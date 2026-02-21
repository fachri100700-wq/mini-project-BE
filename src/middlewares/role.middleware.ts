import { NextFunction, Request, Response } from "express";

export function customerOnly(req: Request, res: Response, next: NextFunction) {
    const { role } = res?.locals?.payload;

    if (role !== "customer") {
        return res.status(403).json({
            success: false,
            message: "You're not authorized to view this page",
        });
    }

    next();
}