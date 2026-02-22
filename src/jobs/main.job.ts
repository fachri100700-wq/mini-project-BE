import { expiryTransactionSchedule } from "./expiry-transaction/expiry-transaction-schedule";

export function mainJobs(){
    expiryTransactionSchedule()
}