import { Request, Response } from "express";
import { profileService } from "../services/profile.service";
import { MulterRequest } from "../types/express";

export const profileController = {
    async getProfile(req: Request, res: Response) {
        const { userId } = res?.locals?.payload;

        const data = await profileService.getProfile(userId);

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data,
        });
    },

    async getReferralInfo(req: Request, res: Response) {
        const { userId } = res?.locals?.payload;

        const data = await profileService.getReferralInfo(userId);

        res.status(200).json({
            success: true,
            message: "Referral info fetched successfully",
            data,
        });
    },

    async getCoupons(req: Request, res: Response) {
        const { userId } = res?.locals?.payload;

        const data = await profileService.getCoupons(userId);

        res.status(200).json({
            success: true,
            message: "Coupons fetched successfully",
            data,
        });
    },

    async updateProfile(req: Request, res: Response) {
        const { userId } = res?.locals?.payload;

        const data = await profileService.updateProfile(userId, req.body);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data,
        });
    },

    async updateAvatar(req: MulterRequest, res: Response) {
        const { userId } = res.locals.payload;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        try {
            const updatedUser = await profileService.updateAvatar(userId, req.file.buffer);
            res.status(200).json({
                success: true,
                message: "Avatar updated successfully",
                data: updatedUser,
            });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    async changePassword(req: Request, res: Response) {
        const { userId } = res?.locals?.payload;

        const { currentPassword, newPassword } = req.body;

        await profileService.changePassword(
            userId,
            currentPassword,
            newPassword
        );

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    },

    
}