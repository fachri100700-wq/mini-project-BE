import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

interface EventSummary {
  id: string;
  seatTotal: number;
}

interface PromotionData {
  promoName: string;
  discAmount: number;
  quota: number;
}

const promotionsData: PromotionData[] = [
  { promoName: "EARLYBIRD10", discAmount: 10000, quota: 30 },
  { promoName: "FLASHSALE15", discAmount: 15000, quota: 20 },
  { promoName: "GROUP5DISKON", discAmount: 25000, quota: 15 },
  { promoName: "WEEKENDSPESIAL", discAmount: 20000, quota: 25 },
  { promoName: "STUDENTDISKON", discAmount: 12000, quota: 40 },
  { promoName: "MERDEKA45", discAmount: 45000, quota: 10 },
  { promoName: "HEMAT10K", discAmount: 10000, quota: 50 },
  { promoName: "SPESIAL25K", discAmount: 25000, quota: 20 },
  { promoName: "PROMONIKMAT", discAmount: 18000, quota: 35 },
  { promoName: "BONUS50K", discAmount: 50000, quota: 10 },
];

export async function seedPromotions(events: EventSummary[], organizerIds: string[]) {
  let promotionCount = 0;

  // Only create promotions for first 10 events
  const eventsWithPromotion = events.slice(0, 10);

  for (let i = 0; i < eventsWithPromotion.length; i++) {
    const event = eventsWithPromotion[i];
    const organizer = organizerIds[i % organizerIds.length];
    const promo = promotionsData[i];

    const promoStartDate = new Date();
    promoStartDate.setDate(promoStartDate.getDate() + 3); // starts 3 days from now

    const promoEndDate = new Date(promoStartDate);
    promoEndDate.setDate(promoEndDate.getDate() + 14); // lasts 14 days

    await prisma.promotion.create({
      data: {
        promoName: promo.promoName,
        promoStartDate,
        promoEndDate,
        quota: promo.quota,
        discAmount: promo.discAmount,
        eventId: event.id,
        userId: organizer,
      },
    });
    promotionCount++;
  }

  console.log(`Seeded ${promotionCount} promotions (for first 10 events only).`);
}