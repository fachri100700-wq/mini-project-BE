import { Request, Response } from "express";
import { profileService } from "../services/profile.service";

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
}