import { expiryTransactionForAdminSchedule } from "./expiry-transaction/expiry-transaction-for-admin-schedule";

export function mainJobs(){
    expiryTransactionForAdminSchedule();
}