import { Request, Response } from "express";
import { organizerAttendeeService } from "../../services/dashboard/organizer-attendee.service";

export const organizerAttendeeController = {
  async getAttendees(req: Request, res: Response) {
    const { userId } = res?.locals?.payload;
    const eventId = req?.params?.eventId as string;

    const data =
      await organizerAttendeeService.getAttendees(
        userId,
        eventId
      );

    res.status(200).json({
      success: true,
      message: "Attendee list fetched successfully",
      data,
    });
  },
};