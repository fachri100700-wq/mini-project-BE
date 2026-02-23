import { Booking } from "../../generated/prisma/client";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";
import { addMinutes } from "date-fns";

export const bookingsService = {
  async get(id: string) {
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
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
        transactions: {
          where: {
            deletedAt: null
          }
        }  
      },
    });

    return booking
  },

  async create({
    quantity,
    eventId,
    ticketTypeId,
    userId,
    promoId,
  }: Pick<
    Booking,
    "quantity" | "eventId" | "ticketTypeId" | "userId" | "promoId"
  >) {
    if (quantity <= 0) throw AppError("Quantity minimum 1", 400);

    return await prisma.$transaction(async (tx) => {
    
      const ticket = await tx.ticketType.findUnique({
        where: { id: ticketTypeId },
        include: { event: true },
      });

      if (!ticket || ticket.eventId !== eventId)
        throw AppError("Ticket not valid", 404);
      if (ticket.seatAvailable < quantity)
        throw AppError("Stock ticket is empty", 400);

    
      let discountAmount = 0;
      if (promoId) {
        const promo = await tx.promotion.findFirst({
          where: { id: promoId, eventId, quota: { gt: 0 }, deletedAt: null },
        });

        if (!promo) throw AppError("Promo is emtpy", 400);

        discountAmount = promo.discAmount; // diskon flat

        
        await tx.promotion.update({
          where: { id: promoId },
          data: { quota: { decrement: 1 } },
        });
      }

      
      const finalPrice = Math.max(0, quantity * ticket.price - discountAmount);

     
      await tx.ticketType.update({
        where: { id: ticketTypeId },
        data: {
          seatAvailable: { decrement: Number(quantity) },
          event: { update: { seatTotal: { decrement: Number(quantity) } } },
        },
      });

      
      const booking = await tx.booking.create({
        data: {
          quantity: Number(quantity),
          totalPrice: Number(finalPrice),
          eventId,
          ticketTypeId,
          userId,
          promoId: promoId ?? undefined,
        },
      });

      
      const transaction = await tx.transaction.create({
        data: {
          bookingId: booking.id,
          userId,
          expiry: addMinutes(new Date(), 120), 
          amountPaid: Number(finalPrice),
          paymentProof: "",
          transactionStatus: "WAITING_FOR_PAYMENT",
        },
      });

      return { booking, transaction };
    });
  },
};
