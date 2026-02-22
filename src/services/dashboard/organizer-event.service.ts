import { EventCategory, EventType } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma-client.config";
import AppError from "../../helpers/app-error.helper";

type UpdateEventDTO = {
  eventName?: string;
  startDate?: Date;
  endDate?: Date;
  imageUrl?: string;
  location?: string;
  description?: string;
  seatTotal?: number;
  eventType?: EventType;
  eventCategory?: EventCategory;
};

export const organizerEventService = {
  async getEventById(eventId: string, organizerId: string) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId: organizerId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw AppError("Event not found or not authorized", 404);
    }

    return event;
  },

  async updateEvent(
    eventId: string,
    organizerId: string,
    data: UpdateEventDTO
  ) {
    if (Object.keys(data).length === 0) {
      throw AppError("No data provided for update", 400);
    }

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId: organizerId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw AppError("Event not found or not authorized", 404);
    }

    return prisma.event.update({
      where: { id: eventId },
      data,
    });
  },
};