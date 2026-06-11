import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

interface EventSummary {
  id: string;
  seatTotal: number;
}

// Mapping ticket types based on event index (variasi per event)
const ticketTypeTemplates = [
  // Small events (seatTotal < 100) → 1-2 ticket types
  { minTickets: 1, maxTickets: 2, types: ["REGULAR", "VIP"] },
  // Medium events (seatTotal 100-299) → 2 ticket types
  { minTickets: 2, maxTickets: 2, types: ["REGULAR", "VIP"] },
  // Large events (seatTotal >= 300) → 3 ticket types
  { minTickets: 3, maxTickets: 3, types: ["REGULAR", "VIP", "EARLY"] },
];

function getTicketTemplate(seatTotal: number) {
  if (seatTotal >= 300) return ticketTypeTemplates[2]; // Large
  if (seatTotal >= 100) return ticketTypeTemplates[1]; // Medium
  return ticketTypeTemplates[0]; // Small
}

function getTicketPrice(ticketType: string, eventIndex: number): number {
  switch (ticketType) {
    case "VIP":
      return 150000 + (eventIndex % 5) * 10000; // 150k - 190k
    case "REGULAR":
      return 75000 + (eventIndex % 4) * 5000; // 75k - 95k
    case "EARLY":
      return 50000 + (eventIndex % 3) * 5000; // 50k - 60k
    default:
      return 75000;
  }
}

function getSeatAllocation(ticketType: string, seatTotal: number): number {
  switch (ticketType) {
    case "VIP":
      return Math.floor(seatTotal * 0.2); // 20% VIP
    case "REGULAR":
      return Math.floor(seatTotal * 0.55); // 55% Regular
    case "EARLY":
      return Math.floor(seatTotal * 0.25); // 25% Early Bird
    default:
      return Math.floor(seatTotal / 2);
  }
}

export async function seedTicketTypes(events: EventSummary[]) {
  let ticketTypeCount = 0;

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const template = getTicketTemplate(event.seatTotal);

    // Ambil subset dari types yang tersedia
    const selectedTypes = template.types.slice(0, template.maxTickets);

    for (const typeName of selectedTypes) {
      const price = getTicketPrice(typeName, i + 1);
      const seatAvailable = getSeatAllocation(typeName, event.seatTotal);

      await prisma.ticketType.create({
        data: {
          ticketType: typeName,
          price,
          seatAvailable,
          eventId: event.id,
        },
      });
      ticketTypeCount++;
    }
  }

  console.log(`Seeded ${ticketTypeCount} ticket types.`);
}