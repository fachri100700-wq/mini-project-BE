import express, { NextFunction, Request, Response } from "express";
import authRouter from './routers/auth.router';
import cors from 'cors';
import { corsOptions } from "./config/cors.config";

const PORT: number = 8000;
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.expose === true ? err.statusCode : 500;
  const message = err.expose === true ? err.message : 'Something went wrong';
  console.log(err);
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
});

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});