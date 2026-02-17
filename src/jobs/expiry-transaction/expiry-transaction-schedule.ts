import cron from "node-cron";
import { expiryTransactionJob } from "./expiry-transaction";

export function expiryTransactionSchedule() {
  cron.schedule("*/1 * * * *", async () => {
    (console.log(`[CRON]: transaction(s) has been expired`),
      await expiryTransactionJob());
  });
}
