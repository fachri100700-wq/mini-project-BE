import { expiryTransactionForAdminSchedule } from "./expiry-transaction/expiry-transaction-for-admin-schedule";
import { expiryTransactionSchedule } from "./expiry-transaction/expiry-transaction-schedule";

export function mainJobs(){
    expiryTransactionSchedule()
    expiryTransactionForAdminSchedule();
}