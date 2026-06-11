import { Review } from "../../generated/prisma/browser";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";

export const reviewsService = {
  async get(eventId: string, userId?: string) {
    if (!eventId) {
      throw AppError("Event ID is required", 400);
    }

    const reviews = await prisma.review.findMany({
      where: {
        eventId,
      },
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let transactionDone = null;
    if (userId) {
      transactionDone = await prisma.transaction.findFirst({
        where: {
          booking: { eventId },
          userId,
          transactionStatus: "DONE",
        },
      });
    }

    const stats = await prisma.review.aggregate({
      where: { eventId },
      _avg: {
        rating: true, // jumlah rating / total reviewer
      },
      _count: {
        id: true,
      },
    });

    return {
      averageRating: stats._avg.rating
        ? Number(stats._avg.rating.toFixed(1))
        : 0,
      totalReviews: stats._count.id,
      data: reviews,
      transactionDone,
    };
  },

  async create({
    eventId,
    userId,
    feedback,
    rating,
  }: Pick<Review, "eventId" | "userId" | "feedback" | "rating">) {
    if (rating < 1 || rating > 5) {
      throw AppError("make a rating minimum 1 and maximal 5", 400);
    }

    const alreadyPurchase = await prisma.transaction.findFirst({
      where: {
        booking: { eventId },
        userId,
        transactionStatus: "DONE",
      },
    });

    if (!alreadyPurchase) {
      throw AppError("Buy the ticket first then review", 400);
    }

    /* const alreadyReview = await prisma.review.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (alreadyReview) {
      throw AppError("only 1 review is allowed for each event", 400);
    } */

    return await prisma.review.create({
      data: {
        userId,
        eventId,
        rating,
        feedback,
      },
    });
  },

  async delete(id: string) {
    return await prisma.review.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};