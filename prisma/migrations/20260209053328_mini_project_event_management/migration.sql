/*
  Warnings:

  - You are about to drop the column `eventDate` on the `events` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "eventDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" VARCHAR(150),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "displayName" VARCHAR(50),
ADD COLUMN     "location" VARCHAR(50),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
