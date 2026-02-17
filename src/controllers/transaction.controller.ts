import { Request, Response } from "express";
import { transactionService } from "../services/transaction.service";

export const transactionController = {
    async create(req: Request, res: Response){
        const {bookingId, userId, expiry, amountPaid, paymentProof} = req.body

        const files = req.file as Express.Multer.File;

        await transactionService.create(files, {
          bookingId,
          userId,
          amountPaid,
          expiry,
          paymentProof
        });
    }

    
};