import { Request, Response } from "express";
import { organizerStatisticService } from "../../services/dashboard/organizer-statistic.service";

export const organizerStatisticController = {
  async getStatistics(req: Request, res: Response) {
    const { userId } = res?.locals?.payload;

    const allowedGroupBy = ["year", "month", "day"] as const;
    type GroupBy = typeof allowedGroupBy[number];

    const groupBy = (req.query.groupBy as GroupBy) ?? "month";

    if (groupBy && !allowedGroupBy.includes(groupBy)) {
        return res.status(400).json({
            success: false,
            message: "Invalid groupBy value. Use year | month | day",
        });
    }

    const data = await organizerStatisticService.getStatistics(
      userId,
      groupBy
    );

    res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data,
    });
  },
};