import { Request, Response } from "express";
import { organizerProfileService } from "../../services/dashboard/organizer-profile.service";

export const organizerProfileController = {
  async getProfile(req: Request, res: Response) {
    const { userId } = res.locals.payload;

    const data = await organizerProfileService.getProfile(userId);

    res.status(200).json({
      success: true,
      message: "Organizer profile fetched successfully",
      data,
    });
  },

  async updateProfile(req: Request, res: Response) {
    const { userId } = res.locals.payload;

    const data = await organizerProfileService.updateProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Organizer profile updated successfully",
      data,
    });
  },
};