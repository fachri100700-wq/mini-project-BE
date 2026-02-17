import cron from "node-cron";
import { expiryTransactionJob } from "./expiry-transaction";

export function expiryTransactionSchedule() {
  cron.schedule("*/15 * * * *", async () => {
    (console.log(`[CRON]: running expiry transaction job`),
      await expiryTransactionJob());
  });
}
