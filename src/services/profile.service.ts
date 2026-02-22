import cloudinary from "../config/cloudinary.config";
import type { UploadApiResponse } from "cloudinary";
import { prisma } from "../config/prisma-client.config"
import AppError from "../helpers/app-error.helper";
import { hashing, hashMatch } from "../helpers/bcrypt.helper";
import { CouponResponseDTO } from "../types/coupon-response.dto";
import { ProfileResponseDTO } from "../types/profile-response.dto";
import { ReferralInfoResponseDTO } from "../types/referral-response.dto";
import { UpdateProfileDTO } from "../types/update-profile.dto";

export const profileService = {
    async getProfile(userId: string): Promise<ProfileResponseDTO> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                referralCode: true,
                avatarUrl: true,
                createdAt: true,
            },
        });

        if (!user) throw AppError("User not found", 404);

        return user;
    },

    async getReferralInfo(userId: string): Promise<ReferralInfoResponseDTO> {
        const now = new Date();

        const [balance, rewards] = await Promise.all([
            prisma.referralReward.aggregate({
                where: {
                    userId,
                    expireDate: { gt: now },
                },
                _sum: { points: true },
            }),
            prisma.referralReward.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    points: true,
                    reason: true,
                    startDate: true,
                    expireDate: true,
                },
            }),
        ]);

        return {
            availablePoints: balance._sum.points ?? 0,
            history: rewards,
        };
    },

    async getCoupons(userId: string): Promise<CouponResponseDTO[]> {
        const now = new Date();

        return prisma.coupon.findMany({
            where: {
                userId,
                expiredDate: { gt: now },
                isUsed: false,
            },
            select: {
                id: true,
                code: true,
                discount: true,
                expiredDate: true,
                userId: true,
                isUsed: true,
            },
            orderBy: { expiredDate: "asc" },
        });
    },

    async updateProfile(userId: string, data: UpdateProfileDTO): Promise<Pick<ProfileResponseDTO, "username">> {
        return prisma.user.update({
            where: { id: userId },
            data,
            select: {
                username: true,
            },
        });
    },

    async updateAvatar(userId: string, fileBuffer: Buffer) {
    if (!fileBuffer) throw AppError("No file uploaded", 400);

    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
        { folder: "avatars", resource_type: "image" },
        (error, result) => {
            if (error || !result) reject(error || new Error("Upload failed"));
            else resolve(result);
        }
        );
        stream.end(fileBuffer);
    });

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: uploadResult.secure_url },
        select: { avatarUrl: true },
    });

    return updatedUser;
    },

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });
        if (!user) throw AppError("User not found", 404);

        const isMatch = await hashMatch(currentPassword, user?.password);
        if (!isMatch) {
            throw AppError("Current password is incorrect", 400);
        }

        const isSame = await hashMatch(newPassword, user?.password);
        if (isSame) {
            throw AppError("New password must be different from the current password", 400);
        }

        const hashedPassword = await hashing(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    },
}