import { Booking } from "../../generated/prisma/client";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";

export const bookingsService = {
  async get(id: string) {
    return await prisma.booking.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: {
          select: { 
            username: true, 
            email: true 
          },
        },
        event: {
          select: {
            eventName: true,
            startDate: true,
            endDate: true,
            location: true,
          },
        },
        ticketType: {
          select: {
            ticketType: true,
            price: true,
          },
        },
        promo: {
          select: {
            promoName: true,
            discAmount: true,
          },
        },
      },
    });
  },

  async create({
    quantity,
    totalPrice,
    eventId,
    ticketTypeId,
    userId,
    promoId,
  }: Pick<
    Booking,
    | "quantity"
    | "totalPrice"
    | "eventId"
    | "ticketTypeId"
    | "userId"
    | "promoId"
  >) {
    if (quantity <= 0) {
      throw AppError("Quantity cannot be 0", 400);
    }

    return await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticketType.findFirst({
        where: {
          id: ticketTypeId,
          eventId: eventId,
          deletedAt: null,
        },
        include: {
          event: true,
        },
      });

      if (!ticket) {
        throw AppError("Ticket not found", 400);
      }

      if (quantity > ticket.seatAvailable) {
        throw AppError("Total booking cannot be more than seat available", 400);
      }

      let promo = null;
      //karena typresript deteksi promoId bisa null karena "string?"
      if (promoId && eventId) {
        promo = await tx.promotion.findFirst({
          where: {
            id: promoId,
            eventId: eventId,
            deletedAt: null,
          },
        });
      }

      const finalPromo = promo?.discAmount ?? 0;

      const finalPrice = Math.max(0, quantity * ticket.price - finalPromo);

      await tx.ticketType.update({
        where: {
          id: ticketTypeId,
          eventId: eventId,
        },
        data: {
          seatAvailable: {
            decrement: quantity,
          },
          event: { update: { seatTotal: { decrement: quantity } } },
        },
      });

      if (promoId) {
        if (!promo || promo.quota <= 0) {
          throw AppError("Promo not available", 400);
        }
        await tx.promotion.update({
          where: { id: promoId },
          data: { quota: { decrement: 1 } },
        });
      }

      return await tx.booking.create({
        data: {
          quantity: Number(quantity),
          totalPrice: Number(finalPrice),
          eventId,
          ticketTypeId,
          userId,
          promoId: promoId || null,
        },
      });
    });
  },
};
