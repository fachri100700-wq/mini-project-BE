import { Request, Response } from "express";
import { transactionService } from "../services/transaction.service";

export const transactionController = {
    async create(req: Request, res: Response){
        const {bookingId, userId} = req.body

        const files = req.file as Express.Multer.File;

        const transaction = await transactionService.create(files, {
          bookingId,
          userId
        });

        res.status(200).json({
            success: true,
            message: "Creat transaction success",
            data: transaction
        })
    }

    
};