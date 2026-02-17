import express, { Request, Response } from "express";
import transactionRouter from "./routers/transaction.router";
import { mainJobs } from "./jobs/main.job";


const PORT: number = 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/transactions', transactionRouter)

mainJobs()

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});