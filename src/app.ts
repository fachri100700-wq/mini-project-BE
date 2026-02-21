import express, { NextFunction, Request, Response } from "express";
import transactionRouter from "./routers/transaction.router";

import cors from "cors";
import { corsOptions } from "./config/cors.config";

const PORT: number = 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use("/api/transactions", transactionRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR:", err);
  const statusCode = err.expose === true ? err.statusCode : 500;
  const message = err.expose === true ? err.message : "Semothing went wrong";

  res.status(statusCode).json({
    success: false,
    message: message,
    data: null,
  });
});

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});
