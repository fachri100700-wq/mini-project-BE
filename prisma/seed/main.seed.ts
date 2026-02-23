import { PrismaClient, Role, EventType, EventCategory } from "../../generated/prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const users = [];

  // Create 30 users
  for (let i = 0; i < 30; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username().slice(0, 25),
        email: faker.internet.email(),
        password: faker.internet.password(),
        referralCode: faker.string.alphanumeric(12),
        displayName: faker.person.fullName().slice(0, 50),
        bio: faker.lorem.sentence().slice(0, 150),
        avatarUrl: faker.image.avatar(),
        location: faker.location.city().slice(0, 50),
        role: i % 3 === 0 ? Role.organizer : Role.customer,
      },
    });

    users.push(user);
  }

  const events = [];

  // Create 30 events
  for (let i = 0; i < 30; i++) {
    const organizers = users.filter(u => u.role === Role.organizer);
    const organizer = faker.helpers.arrayElement(organizers);

    const startDate = faker.date.future();
    const endDate = faker.date.future({ refDate: startDate });

    const event = await prisma.event.create({
      data: {
        eventName: faker.lorem.words(3).slice(0, 100),
        startDate,
        endDate,
        imageUrl: faker.image.urlLoremFlickr({ category: "city" }),
        location: faker.location.city().slice(0, 100),
        description: faker.lorem.sentence().slice(0, 150),
        seatTotal: faker.number.int({ min: 50, max: 500 }),
        eventType: faker.helpers.arrayElement([EventType.FREE, EventType.PAID]),
        eventCategory: faker.helpers.arrayElement(Object.values(EventCategory)),
        userId: organizer.id,
      },
    });

    events.push(event);

    // Create 1-3 TicketTypes per event
    const ticketTypesCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < ticketTypesCount; j++) {
      await prisma.ticketType.create({
        data: {
          ticketType: faker.helpers.arrayElement(["VIP", "REGULAR", "EARLY"]).slice(0, 10),
          price: faker.number.int({ min: 10, max: 200 }),
          seatAvailable: faker.number.int({ min: 20, max: event.seatTotal }),
          eventId: event.id,
        },
      });
    }
  }

  console.log("Seed completed: 30 users, 30 events, and ticket types created.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });