/*
  Warnings:

  - You are about to drop the column `ticketId` on the `events` table. All the data in the column will be lost.
  - Added the required column `ticketTypeId` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `ticket_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_ticketId_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "ticketTypeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "ticketId";

-- AlterTable
ALTER TABLE "ticket_types" ADD COLUMN     "eventId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "transactionStatus" SET DEFAULT 'WAITING_FOR_PAYMENT',
ALTER COLUMN "paymentProof" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "ticket_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
