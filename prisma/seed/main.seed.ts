import { seedUsers } from "./_data/user.seed";
import { seedTicketType } from "./_data/ticketType.seed";
import { prisma } from "../../src/config/prisma-client.config";
import { seedEvent } from "./_data/event.seed";

async function main() {
  try {
    await seedUsers();
    await seedTicketType();
    await seedEvent()

  } catch {
    console.log("Seeding failed:");
    process.exit(1);
  }
}

main()
  .then(async () => {
    console.log("✅ seeded successful");
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(`error`, err);
    await prisma.$disconnect();
    process.exit(1);
  });
