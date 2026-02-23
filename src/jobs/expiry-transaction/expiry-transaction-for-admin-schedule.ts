import cron from "node-cron";
import { expiryTransactionForAdminJob } from "./expiry-transaction-for-admin";

export function expiryTransactionForAdminSchedule() {
  cron.schedule("* * */3 * *", async () => {
    (console.log(`[CRON]: running expiry transaction job`),
      await expiryTransactionForAdminJob());
  });
}
