/*
  Warnings:

  - The values [KONSER,LOREM,IPSUM] on the enum `EventCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `organizerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizers` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventCategory_new" AS ENUM ('CONCERT', 'SEMINAR', 'SPORTS', 'WORKSHOP', 'EXHIBITION', 'THEATER', 'FESTIVAL', 'OTHER');
ALTER TABLE "events" ALTER COLUMN "eventCategory" TYPE "EventCategory_new" USING ("eventCategory"::text::"EventCategory_new");
ALTER TYPE "EventCategory" RENAME TO "EventCategory_old";
ALTER TYPE "EventCategory_new" RENAME TO "EventCategory";
DROP TYPE "public"."EventCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "referral_points" DROP CONSTRAINT "referral_points_customerId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_customerId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organizerId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "customerId",
DROP COLUMN "organizerId";

-- DropTable
DROP TABLE "customers";

-- DropTable
DROP TABLE "organizers";

-- AddForeignKey
ALTER TABLE "referral_points" ADD CONSTRAINT "referral_points_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
