import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import authRouter from './routers/auth.router';
import profileRouter from './routers/profile.router';
import cors from 'cors';
import { corsOptions } from "./config/cors.config";
import cookieParser from "cookie-parser";
import "./config/main.config";

const PORT: number = 8080;
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/profile', profileRouter);

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