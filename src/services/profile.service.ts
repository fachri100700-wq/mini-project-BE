import { prisma } from "../config/prisma-client.config"
import AppError from "../helpers/app-error.helper";
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

    async updateProfile(userId: string, data: UpdateProfileDTO): Promise<Pick<ProfileResponseDTO, "username" | "avatarUrl">> {
        return prisma.user.update({
            where: { id: userId },
            data,
            select: {
                username: true,
                avatarUrl: true,
            },
        });
    },
}