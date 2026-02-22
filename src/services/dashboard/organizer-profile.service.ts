import { prisma } from "../../config/prisma-client.config";
import AppError from "../../helpers/app-error.helper";

type UpdateOrganizerProfileDTO = {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
};

export const organizerProfileService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        location: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw AppError("User not found", 404);

    return user;
  },

  async updateProfile(userId: string, data: UpdateOrganizerProfileDTO) {
    if (Object.keys(data).length === 0) {
      throw AppError("No data provided for update", 400);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        displayName: true,
        bio: true,
        avatarUrl: true,
        location: true,
      },
    });

    return updated;
  },
};