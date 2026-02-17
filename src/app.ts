import express, { NextFunction, Request, Response } from "express";
import bookingRouter from "./routers/bookings.router";
import { mainJobs } from "./jobs/main.job";

const PORT: number = 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/booking", bookingRouter);

mainJobs()

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
