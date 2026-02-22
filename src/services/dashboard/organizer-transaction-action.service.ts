import { prisma } from "../../config/prisma-client.config";
import AppError from "../../helpers/app-error.helper";
import { TransactionStatus } from "../../../generated/prisma/client";

export const organizerTransactionActionService = {
  async updateStatus(
    organizerId: string,
    transactionId: string,
    action: "approve" | "reject"
  ) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        transactionStatus: TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION,
        booking: {
          event: {
            userId: organizerId,
            deletedAt: null,
          },
        },
      },
    });

    if (!transaction) {
      throw AppError(
        "Transaction not found or not authorized",
        404
      );
    }

    const newStatus =
      action === "approve"
        ? TransactionStatus.DONE
        : TransactionStatus.REJECTED;

    return prisma.transaction.update({
      where: { id: transactionId },
      data: {
        transactionStatus: newStatus,
      },
      select: {
        id: true,
        transactionStatus: true,
      },
    });
  },
};