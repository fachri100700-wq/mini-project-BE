import { Request, Response } from "express";
import { transactionService } from "../services/transaction.service";
import AppError from "../helpers/app-error.helper";

export const transactionController = {
  async getWaitingConfirm(req: Request, res: Response){
    

    const result = await transactionService.getWaitingConfirm()

    res.status(200).json({
      success: true,
      message: `Get success`,
      data: result
    })
  },
  
  async uploadPaymentProof(req: Request, res: Response) {
    const {id} = req.params
    const { bookingId, userId } = req.body;

    const files = req.file as Express.Multer.File;

    const transaction = await transactionService.uploadPaymentProof(id as string, files, {
      bookingId,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Upload paymentproof success",
      data: transaction,
    });
  },

  async verify(req: Request, res: Response) {
    const { id } = req.params; 
    const { status } = req.body; 

    

    if (!status || !["DONE", "REJECTED"].includes(status)) {
      throw AppError("Status must 'DONE' atau 'REJECTED'", 400);
    }

    const result = await transactionService.verify(id as string, status)

    res.status(200).json({
      success: true,
      message: `Transaksi berhasil di-update jadi ${status}`,
      data: result,
    });
  },
};
