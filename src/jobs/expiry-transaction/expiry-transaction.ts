import { prisma } from "../../config/prisma-client.config";

export async function expiryTransactionJob() {
  const waitingPaymentTranstions = await prisma.transaction.findMany({
    where: {
      expiry: {
        lt: new Date(),
      },
      transactionStatus:
        "WAITING_FOR_PAYMENT",
    },
    include: {
      booking: true,
    },
  });

  await prisma.$transaction(async (tx) => {
    for (const trx of waitingPaymentTranstions) {
      await tx.ticketType.update({
        where: { id: trx.booking.ticketTypeId },
        data: { seatAvailable: { increment: trx.booking.quantity } },
      });

      await tx.event.update({
        where: { id: trx.booking.eventId },
        data: { seatTotal: { increment: trx.booking.quantity } },
      });

      const expiredTranstions = await tx.transaction.update({
        where: { id: trx.id },
        data: { transactionStatus: "EXPIRED" },
      });

      console.log(
        `[CRON]: ${expiredTranstions.id} transaction(s) has been expired`,
      );
    }
  });

  
}
