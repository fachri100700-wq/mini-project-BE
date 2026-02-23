-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_promoId_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "promoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_promoId_fkey" FOREIGN KEY ("promoId") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
