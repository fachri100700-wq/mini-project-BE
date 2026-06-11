import { PrismaClient, Role } from "../../generated/prisma/client";
import { faker } from "@faker-js/faker";
import { seedEvents } from "./event/event.seed";
import { seedTicketTypes } from "./ticketType/ticketType.seed";
import { seedPromotions } from "./promotion/promotion.seed";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (order matters due to foreign key constraints)
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.referralReward.deleteMany();
  await prisma.user.deleteMany();

  const users: { id: string; role: string }[] = [];

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

    users.push({ id: user.id, role: user.role });
  }

  console.log(`Seeded ${users.length} users.`);

  const organizerIds = users.filter(u => u.role === Role.organizer).map(u => u.id);

  // Seed Events (requires organizers)
  const events = await seedEvents(organizerIds);

  // Seed TicketTypes (requires events)
  await seedTicketTypes(events);

  // Seed Promotions only for some events (requires events & organizers)
  await seedPromotions(events, organizerIds);

  console.log("Seed completed: users, events, ticket types, and promotions created.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });