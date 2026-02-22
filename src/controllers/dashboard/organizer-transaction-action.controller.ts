import { Request, Response } from "express";
import { organizerTransactionActionService } from "../../services/dashboard/organizer-transaction-action.service";

export const organizerTransactionActionController = {
  async updateTransaction(req: Request, res: Response) {
    const { userId } = res.locals.payload;
    const { transactionId } = req.params;
    const { action } = req.body;

    const data =
      await organizerTransactionActionService.updateStatus(
        userId,
        transactionId,
        action
      );

    res.status(200).json({
      success: true,
      message:
        action === "approve"
          ? "Transaction approved"
          : "Transaction rejected",
      data,
    });
  },
};