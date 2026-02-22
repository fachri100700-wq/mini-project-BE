import { Request, Response } from "express";
import { organizerTransactionService } from "../../services/dashboard/organizer-transaction.service";

export const organizerTransactionController = {
  async getTransactions(req: Request, res: Response) {
    const { userId } = res.locals.payload;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await organizerTransactionService.getTransactions(
      userId,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  },
};