import { prisma } from "../../config/prisma-client.config";
import AppError from "../../helpers/app-error.helper";
import { TransactionStatus } from "../../../generated/prisma/client";
import transporter from "../../helpers/nodemailer.helper";
import { USER_EMAILER } from "../../config/main.config";

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
      select: {
        id: true,
        user: {
          select: {
            email: true,
            username: true,
          },
        },
        booking: {
          select: {
            event: {
              select: {
                eventName: true,
              },
            },
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

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        transactionStatus: newStatus,
      },
      select: {
        id: true,
        transactionStatus: true,
      },
    });

    transporter.sendMail({
      from: `"Event Platform" <${USER_EMAILER}>`,
      to: transaction.user.email,
      subject:
        newStatus === TransactionStatus.DONE
          ? "Payment Approved"
          : "Payment Rejected",
      html: `
        <p>Hi ${transaction.user.username},</p>

        <p>
          Your payment for
          <strong>${transaction.booking.event.eventName}</strong>
          has been
          <strong>${newStatus === TransactionStatus.DONE ? "approved" : "rejected"}</strong>.
        </p>

        ${
          newStatus === TransactionStatus.REJECTED
            ? `<p>If you used points, vouchers, or coupons, they will be returned.</p>`
            : ""
        }

        <p>Thank you for using our platform.</p>
      `,
    }).catch((err) => {
      console.error("Email send failed:", err.message);
    });

    return updatedTransaction;
  },
};