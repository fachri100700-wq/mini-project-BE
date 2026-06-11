import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function jwtVerify(secretKey: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            const token = req?.cookies?.accessToken;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Access token missing",
                });
            }

            const payload = jwt.verify(token, secretKey);
            res.locals.payload = payload;

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized or invalid token",
            });
        }
    };
}