import { addDays, addMinutes } from "date-fns";
import { Transaction } from "../../generated/prisma/browser";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";
import { cloudinaryUpload } from "../helpers/cloudinary.helper";

export const transactionService = {
  async getWaitingConfirm(){
    const result = await prisma.booking.findMany({
      where: {
        deletedAt: null,
        transactions: {
          some: {
            // Narik booking yang punya minimal 1 transaksi nunggu konfirmasi (beda table/relasi)
            transactionStatus: "WAITING_FOR_ADMIN_CONFIRMATION",
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        event: {
          select: {
            eventName: true,
          },
        },
        transactions: {
          where: { transactionStatus: "WAITING_FOR_ADMIN_CONFIRMATION" },
          select: {
            id: true, 
            amountPaid: true,
            paymentProof: true,
          },
        },
      },
    });
    
    return result
  },
  
  async uploadPaymentProof(
    id: string, files: Express.Multer.File,
    { bookingId, userId }: Pick<Transaction, "bookingId" | "userId">,
  ) {
    if (!files) {
      throw AppError("Image is required", 400);
    }

    const checkExpired = await prisma.transaction.findFirst({
      where: {
        bookingId,
        transactionStatus: "EXPIRED",
      },
    });

    if (checkExpired) throw AppError("Your transaction is expired", 400);

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        bookingId,
        userId,
        transactionStatus: "WAITING_FOR_PAYMENT",
      },
    });

    if (!existingTransaction) {
      throw AppError("Transaction not found or already paid", 404);
    }

    const uploadPaymentProof = await cloudinaryUpload(files.buffer);

    return await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        paymentProof: uploadPaymentProof.secureUrl,
        transactionStatus: "WAITING_FOR_ADMIN_CONFIRMATION",
        expiry: addDays(new Date(), 3)
      },
    });
  },

  async verify(id: string, status: "DONE" | "REJECTED") {

    
    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: {
          id,
        },
        include:{
          booking: true
        }
      });

      

      if(!transaction){
        throw AppError("Transaction is not found", 404)
      }

      if(transaction.transactionStatus !== "WAITING_FOR_ADMIN_CONFIRMATION"){
        throw AppError("This transaction status is not waiting for admin confirmation",400,);
      }

      if (status === "REJECTED") {
        await tx.ticketType.update({
          where: { id: transaction.booking.ticketTypeId },
          data: { seatAvailable: { increment: transaction.booking.quantity } },
        });

        await tx.event.update({
          where: { id: transaction.booking.eventId },
          data: { seatTotal: { increment: transaction.booking.quantity } },
        });
      }

      return await tx.transaction.update({
        where: { id },
        data: {
          transactionStatus: status,
          
        },
      });
    });
  },
};
