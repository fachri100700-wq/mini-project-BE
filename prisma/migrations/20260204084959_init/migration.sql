/*
  Warnings:

  - The values [KONSER,LOREM,IPSUM] on the enum `EventCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventCategory_new" AS ENUM ('CONCERT', 'SEMINAR', 'SPORTS', 'WORKSHOP', 'EXHIBITION', 'THEATER', 'FESTIVAL', 'OTHER');
ALTER TABLE "events" ALTER COLUMN "eventCategory" TYPE "EventCategory_new" USING ("eventCategory"::text::"EventCategory_new");
ALTER TYPE "EventCategory" RENAME TO "EventCategory_old";
ALTER TYPE "EventCategory_new" RENAME TO "EventCategory";
DROP TYPE "public"."EventCategory_old";
COMMIT;
