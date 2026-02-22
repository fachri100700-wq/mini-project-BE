import { NextFunction, Request, Response } from "express";

export function organizerOnly(req: Request, res: Response, next: NextFunction) {
  const { role } = res?.locals?.payload;

  if (role !== "organizer") {
    return res.status(403).json({
      success: false,
      message: "You're not authorized to access organizer dashboard",
    });
  }

  next();
}