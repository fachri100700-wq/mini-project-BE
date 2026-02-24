import { Request, Response } from "express";
import { organizerEventService } from "../../services/dashboard/organizer-event.service";

export const organizerEventController = {
  async getEvents(req: Request, res: Response) {
    const { userId } = res.locals.payload;

    const data = await organizerEventService.getEventsByOrganizer(userId);

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data,
    });
  },

  async getEvent(req: Request, res: Response) {
    const { userId } = res?.locals?.payload;
    const eventId = req?.params?.eventId as string;

    const data = await organizerEventService.getEventById(eventId, userId);

    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      data,
    });
  },

  async updateEvent(req: Request, res: Response) {
    const { userId } = res?.locals?.payload;
    const eventId = req?.params?.eventId as string;

    const data = await organizerEventService.updateEvent(
      eventId,
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data,
    });
  },
};