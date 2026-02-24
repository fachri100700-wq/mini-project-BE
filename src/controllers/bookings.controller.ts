import { Request, Response } from "express";
import { bookingsService } from "../services/bookings.service";

export const bookingsController = {
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const booking = await bookingsService.get(id as string);

    res.status(200).json({
      success: true,
      message: `get booking with id=${id} success`,
      data: booking,
    });
  },

  async create(req: Request, res: Response) {
    const { quantity, eventId, ticketTypeId, promoId } =
      req.body;

    const userId = res.locals.payload.userId;

    const booking = await bookingsService.create({
      quantity,
      eventId,
      ticketTypeId,
      userId,
      promoId: promoId ?? undefined,
    });

    res.status(200).json({
      success: true,
      message: "Create booking success",
      data: booking,
    });
  },
};
