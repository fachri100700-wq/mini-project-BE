import { prisma } from "../../config/prisma-client.config";
import { TransactionStatus } from "../../../generated/prisma/client";

type GroupBy = "year" | "month" | "day";

export const organizerStatisticService = {
  async getStatistics(organizerId: string, groupBy?: GroupBy) {
    const now = new Date();

    const transactions = await prisma.transaction.findMany({
      where: {
        transactionStatus: TransactionStatus.DONE,
        booking: {
          event: {
            userId: organizerId,
            deletedAt: null,
          },
        },
      },
      select: {
        amountPaid: true,
        createdAt: true,
        booking: {
          select: {
            quantity: true,
          },
        },
      },
    });

    // ===== Revenue & Attendees =====
    let totalRevenue = 0;
    let totalAttendees = 0;

    const revenueMap: Record<string, number> = {};

    const pad = (n: number) => String(n).padStart(2, "0");

    for (const trx of transactions) {
      totalRevenue += trx.amountPaid;
      totalAttendees += trx.booking.quantity;

      if (!groupBy) continue;

      const date = trx.createdAt;
      let key = "";

      if (groupBy === "year") {
        key = `${date.getFullYear()}`;
      }

      if (groupBy === "month") {
        key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
      }

      if (groupBy === "day") {
        key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      }

      revenueMap[key] = (revenueMap[key] || 0) + trx.amountPaid;
    }

    const revenueGraph = Object.entries(revenueMap).map(
      ([period, total]) => ({
        period,
        total,
      })
    );

    // ===== Active Events =====
    const activeEvents = await prisma.event.count({
      where: {
        userId: organizerId,
        deletedAt: null,
        endDate: {
          gte: now,
        },
      },
    });

    return {
      totalRevenue,
      totalAttendees,
      activeEvents,
      revenueGraph,
      groupBy,
    };
  },
};