/*
  Warnings:

  - You are about to drop the column `customerId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `organizerId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `organizerId` on the `promotions` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `_EventToTicketType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `customers` table without a default value. This is not possible if the table is not empty.
  - The required column `referralId` was added to the `customers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `ticketId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `promotions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentProof` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionStatus` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'organizer');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('WAITING_FOR_PAYMENT', 'WAITING_FOR_ADMIN_CONFIRMATION', 'DONE', 'REJECTED', 'EXPIRED', 'CANCELED');

-- DropForeignKey
ALTER TABLE "_EventToTicketType" DROP CONSTRAINT "_EventToTicketType_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToTicketType" DROP CONSTRAINT "_EventToTicketType_B_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customerId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "promotions" DROP CONSTRAINT "promotions_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_customerId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_customerId_fkey";

-- DropIndex
DROP INDEX "customers_email_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "email",
DROP COLUMN "password",
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "referralId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "organizerId",
ADD COLUMN     "ticketId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "promotions" DROP COLUMN "organizerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "customerId",
ADD COLUMN     "paymentProof" TEXT NOT NULL,
ADD COLUMN     "transactionStatus" "TransactionStatus" NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_EventToTicketType";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "customerId" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "ticket_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
