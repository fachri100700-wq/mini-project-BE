import { prisma } from "../../../src/config/prisma-client.config";

const ticketTypes = [
  {
    ticketType: "FREE",
    price: 0,
    seatAvailable: 500,
  },
  {
    ticketType: "REG",
    price: 100000,
    seatAvailable: 300,
  },
  {
    ticketType: "VIP",
    price: 250000,
    seatAvailable: 150,
  },
  {
    ticketType: "VVIP",
    price: 500000,
    seatAvailable: 50,
  },
  {
    ticketType: "STUDENT",
    price: 75000,
    seatAvailable: 200,
  },
  {
    ticketType: "EARLY",
    price: 85000,
    seatAvailable: 100,
  },
  {
    ticketType: "GROUP",
    price: 90000,
    seatAvailable: 250,
  },
  {
    ticketType: "ONLINE",
    price: 50000,
    seatAvailable: 1000,
  },
];

export async function seedTicketType() {
  console.log("🌱 Seeding TicketType...");
  await prisma.ticketType.createMany({
    data: ticketTypes,
    skipDuplicates: true,
  });
}
