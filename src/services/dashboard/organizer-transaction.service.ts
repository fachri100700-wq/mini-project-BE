import { prisma } from "../../config/prisma-client.config";
import { TransactionStatus } from "../../../generated/prisma/client";

export const organizerTransactionService = {
  async getTransactions(
    organizerId: string,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          transactionStatus: TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION,
          booking: {
            event: {
              userId: organizerId,
              deletedAt: null,
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          booking: {
            include: {
              event: {
                select: {
                  id: true,
                  eventName: true,
                },
              },
              ticketType: {
                select: {
                  ticketType: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),

      prisma.transaction.count({
        where: {
          transactionStatus: TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION,
          booking: {
            event: {
              userId: organizerId,
            },
          },
        },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};