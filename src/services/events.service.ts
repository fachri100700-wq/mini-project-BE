
import { Event } from "../../generated/prisma/client";
import { EventCategory, EventType } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";
import { cloudinaryUpload } from "../helpers/cloudinary.helper";

interface IFilterEvent {
  search?: string;
  category?: string;
  type?: string;
  location?: string;
  page: number;
  limit: number;
}

interface CreateEvent {
  eventName: string;
  startDate: Date;
  endDate: Date;
  location: string;
  description: string;
  seatTotal: number;
  eventType: EventType;
  eventCategory: EventCategory;
  userId: string;


  ticketType: string;
  price: number;
  seatAvailable: number;
  eventId: string


  promoName?: string;
  promoStartDate?: Date;
  promoEndDate?: Date;
  quota?: number;
  discAmount?: number;
}

export const eventsServices = {
  async getById(id: string) {
    const event = await prisma.event.findUnique({
      where: {
        id,
        deletedAt: null
      },
      include: {
        user: true,
        ticketType: true,
        promotion: true
      }
    });

    return event
  },

  async getByFilter({ search, category, type, location, page, limit }: IFilterEvent) {
    const offset = (page - 1) * limit;

    const whereClause: any = {
      eventName: search ? { contains: search, mode: "insensitive" } : undefined,
      eventCategory: category ? (category.toUpperCase() as any) : undefined,
      eventType: type ? (type.toUpperCase() as any) : undefined,
      location: location ? { contains: location, mode: "insensitive" } : undefined,
      deletedAt: null,
    };

    const [events, totalEvents] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
      }),
      prisma.event.count({
        where: whereClause,
      }),
    ]);


    const totalPage = Math.ceil(totalEvents / limit);

    return {
      events,
      totalEvents,
      totalPage,
    };
  },


  async create(
    file: Express.Multer.File,
    {
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

    }: CreateEvent

  ) {
    if (!file) {
      throw AppError("Image is required", 400);
    }
    const uploaded = await cloudinaryUpload(file.buffer);

    return await prisma.$transaction(async (tx) => {

      const createdEvent = await tx.event.create({
        data: {
          eventName,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          imageUrl: uploaded.secureUrl,
          location,
          description,
          seatTotal: Number(seatTotal),
          eventCategory,
          eventType,
          userId,
        },
      });

      /* =================== TICKET TYPE LOGIC ======================= */


      const tickets =
        typeof ticketType === "string" ? JSON.parse(ticketType) : ticketType;

      const totalIncomingSeats = tickets.reduce(
        (sum: number, t: any) => sum + Number(t.quantity),
        0,
      );

      if (totalIncomingSeats > createdEvent.seatTotal) {
        throw AppError(
          `Total ticket (${totalIncomingSeats}) exceeding the event quota (${createdEvent.seatTotal})!`,
          400,
        );
      }


      const ticketNames = tickets.map((t: any) => t.name.toLowerCase().trim());
      const hasDuplicate = ticketNames.some(
        (name: string, index: number) => ticketNames.indexOf(name) !== index,
      );

      if (hasDuplicate) {
        throw AppError("There cannot be twin ticket names in one event", 400);
      }


      const createdType = await tx.ticketType.createMany({
        data: tickets.map((t: any) => ({
          ticketType: t.name,
          price: Number(t.price),
          seatAvailable: Number(t.quantity),
          eventId: createdEvent.id,
        })),
      });

      /* ======================== PROMOTION LOGIC ======================== */


      let createdPromotion = null;

      if (promoName) {

        const startPromo = new Date(promoStartDate!);
        const endPromo = new Date(promoEndDate!);
        const eventStart = new Date(createdEvent.startDate);

        const isInvalidDate = startPromo > endPromo || endPromo > eventStart;

        if (isInvalidDate) {
          throw AppError(
            "Promotion date must be valid and end before the event starts!",
            400,
          );
        }


        const duplicatePromo = await tx.promotion.findFirst({
          where: {
            promoName: String(promoName),
            eventId: createdEvent.id,
            deletedAt: null,
          },
        });

        if (duplicatePromo)
          throw AppError("This promo name is already taken", 400);


        createdPromotion = await tx.promotion.create({
          data: {
            promoName: String(promoName),
            promoStartDate: startPromo,
            promoEndDate: endPromo,
            quota: Number(quota),
            discAmount: Number(discAmount),
            eventId: createdEvent.id,
            userId: createdEvent.userId,
          },
        });
      }

      return { createdEvent, createdType, createdPromotion };
    })
  },

  async update(
    id: string,
    file: Express.Multer.File,
    {
      eventName,
      startDate,
      endDate,
      location,
      description,
      seatTotal,
      eventType,
      eventCategory,
      userId,
    }: Pick<
      Event,
      | "eventName"
      | "startDate"
      | "endDate"
      | "location"
      | "description"
      | "seatTotal"
      | "eventType"
      | "eventCategory"
      | "userId"
    >,
  ) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
      },
    });

    if (!existingEvent) {
      throw AppError("Event not found", 404);
    }

    if (!file) {
      throw AppError("Image is required", 400);
    }

    const uploaded = await cloudinaryUpload(file.buffer);

    await prisma.event.update({
      where: {
        id,
      },
      data: {
        eventName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageUrl: uploaded.secureUrl,
        location,
        description,
        seatTotal: Number(seatTotal),
        eventType,
        eventCategory,
        userId,
      },
    });
  },
  async delete(id: string) {
    const existingEvent = await prisma.event.findFirst({ where: { id } });

    if (!existingEvent) {
      throw AppError("Event not found", 404);
    }

    await prisma.event.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
