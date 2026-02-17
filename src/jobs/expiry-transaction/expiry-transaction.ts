import { prisma } from "../../config/prisma-client.config";

export async function expiryTransactionJob() {
  const expiredTranstions = await prisma.transaction.findMany({
    where: {
      expiry: {
        lt: new Date(),
      },
      transactionStatus: "WAITING_FOR_PAYMENT",
    },
    include: {
      booking: true,
    },
  });

  
  /* console.log(
      `[CRON]: ${expiredTranstions.count} transaction(s) has been expired`,
    ); */
}
