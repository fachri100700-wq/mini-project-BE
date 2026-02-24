import { Request, Response } from "express";
import { eventsServices } from "../services/events.service";

export const eventsController = {
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const eventId = await eventsServices.getById(id as string);

    res.status(200).json({
      success: true,
      message: `Get event with id = ${id} success`,
      data: eventId,
    });
  },

  async getByFilter(req: Request, res: Response) {
    const { search, category, type, location } = req.query;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { events, totalEvents, totalPage } = await eventsServices.getByFilter({
      search: search as string,
      category: category as string,
      type: type as string,
      location: location as string,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: `Get event with filter success`,
      data: events, totalEvents, totalPage
    });
  },

  async create(req: Request, res: Response) {
    const {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      promoName,
      promoStartDate,
      promoEndDate,
      quota,
      discAmount,
      ticketType,
      price,
      seatAvailable,
      eventId
    } = req.body;

    const userId = res.locals.payload.userId;
    const file = req.file as Express.Multer.File;

    const event = await eventsServices.create(file, {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      userId,
      promoName,
      promoStartDate,
      promoEndDate,
      quota,
      discAmount,
      ticketType,
      price,
      seatAvailable,
      eventId
    });

    res.status(201).json({
      success: true,
      message: "Create event successful",
      data: event,
    });
  },

  async update(req: Request, res: Response) {
    const { id } = req?.params;

    const {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
    } = req.body;

    const userId = res.locals.payload.userId;
    const file = req.file as Express.Multer.File;

    const event = await eventsServices.update(id as string, file, {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Update event successful",
      data: event,
    });
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const event = await eventsServices.delete(id as string);

    res.status(200).json({
      success: true,
      message: "Delete event Successfull",
      data: event,
    });
  },
};
