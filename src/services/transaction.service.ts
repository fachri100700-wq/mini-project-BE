import { addMinutes } from "date-fns";
import { Transaction } from "../../generated/prisma/browser";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";
import { cloudinaryUpload } from "../helpers/cloudinary.helper";

export const transactionService = {
  async create(
    files: Express.Multer.File,
    {
      bookingId,
      userId,
      expiry,
      amountPaid,
      paymentProof,
    }: Pick<
      Transaction,
      "bookingId" | "userId" | "expiry" | "amountPaid" | "paymentProof"
    >,
  ) {
    if (!files) {
      throw AppError("Image is required", 400);
    }

    const uploadPaymentProof = await cloudinaryUpload(files.buffer);

    const totalPriceBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: userId,
        deletedAt: null,
      },
      select: {
        totalPrice: true,
      },
    });

    if (!totalPriceBooking) {
      throw AppError("Booking not found", 404);
    }

    return await prisma.transaction.create({
      data: {
        bookingId,
        userId,
        expiry: addMinutes(Date.now(), 1),
        amountPaid: Number(totalPriceBooking.totalPrice),
        paymentProof: uploadPaymentProof.secureUrl,
      },
    });
  },
};
