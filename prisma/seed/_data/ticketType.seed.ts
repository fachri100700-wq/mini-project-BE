import { prisma } from "../../../src/config/prisma-client.config";

export async function seedTicketType() {
  console.log("🌱 Seeding TicketType...");

  const events = await prisma.event.findMany()

  if(events.length === 0){
    throw new Error("Event type can't be found in DB!")
  }

  const ticketTypes = [
    {
      ticketType: "GENERAL",
      price: 75000,
      seatAvailable: 500,
      eventId: events[0].id,
    },
    {
      ticketType: "VIP",
      price: 80000,
      seatAvailable: 600,
      eventId: events[1].id,
    },
    {
      ticketType: "REGULER",
      price: 0,
      seatAvailable: 300,
      eventId: events[2].id,
    },
    {
      ticketType: "REGULER",
      price: 0,
      seatAvailable: 250,
      eventId: events[3].id,
    },
    {
      ticketType: "GENERAL",
      price: 0,
      seatAvailable: 800,
      eventId: events[4].id,
    },

    {
      ticketType: "GENERAL",
      price: 150000,
      seatAvailable: 1000,
      eventId: events[5].id,
    },
    {
      ticketType: "VIP",
      price: 200000,
      seatAvailable: 100,
      eventId: events[6].id,
    },
    {
      ticketType: "REGULER",
      price: 250000,
      seatAvailable: 120,
      eventId: events[7].id,
    },
    {
      ticketType: "GENERAL",
      price: 180000,
      seatAvailable: 400,
      eventId: events[8].id,
    },
    {
      ticketType: "REGULER",
      price: 0,
      seatAvailable: 350,
      eventId: events[9].id,
    },

    {
      ticketType: "GENERAL",
      price: 120000,
      seatAvailable: 200,
      eventId: events[10].id,
    },
    {
      ticketType: "VIP",
      price: 130000,
      seatAvailable: 220,
      eventId: events[11].id,
    },
    {
      ticketType: "REGULER",
      price: 0,
      seatAvailable: 900,
      eventId: events[12].id,
    },
    {
      ticketType: "GENERAL",
      price: 0,
      seatAvailable: 700,
      eventId: events[13].id,
    },
    {
      ticketType: "VIP",
      price: 0,
      seatAvailable: 150,
      eventId: events[14].id,
    },

    {
      ticketType: "REGULER",
      price: 0,
      seatAvailable: 120,
      eventId: events[15].id,
    },
    {
      ticketType: "GENERAL",
      price: 140000,
      seatAvailable: 400,
      eventId: events[16].id,
    },
    {
      ticketType: "GENERAL",
      price: 160000,
      seatAvailable: 600,
      eventId: events[17].id,
    },
    {
      ticketType: "VIP",
      price: 0,
      seatAvailable: 300,
      eventId: events[18].id,
    },
    {
      ticketType: "VIP",
      price: 180000,
      seatAvailable: 180,
      eventId: events[19].id,
    },

    {
      ticketType: "REGULER",
      price: 0,
      seatAvailable: 500,
      eventId: events[20].id,
    },
    {
      ticketType: "VIP",
      price: 200000,
      seatAvailable: 350,
      eventId: events[21].id,
    },
    {
      ticketType: "GENERAL",
      price: 0,
      seatAvailable: 800,
      eventId: events[22].id,
    },
    {
      ticketType: "REGULER",
      price: 0,
      seatAvailable: 100,
      eventId: events[23].id,
    },
    {
      ticketType: "VVIP",
      price: 300000,
      seatAvailable: 50,
      eventId: events[24].id,
    },

    {
      ticketType: "GENERAL",
      price: 0,
      seatAvailable: 2000,
      eventId: events[25].id,
    },
    {
      ticketType: "VIP",
      price: 400000,
      seatAvailable: 450,
      eventId: events[26].id,
    },
    {
      ticketType: "GENERAL",
      price: 220000,
      seatAvailable: 100,
      eventId: events[27].id,
    },
    {
      ticketType: "REGULER",
      price: 0,
      seatAvailable: 150,
      eventId: events[28].id,
    },
    {
      ticketType: "VVIP",
      price: 500000,
      seatAvailable: 5000,
      eventId: events[29].id,
    },
  ];

  await prisma.ticketType.createMany({
    data: ticketTypes,
    skipDuplicates: true,
  });
}
