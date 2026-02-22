import { prisma } from "../../config/prisma-client.config";
import AppError from "../../helpers/app-error.helper";
import { TransactionStatus } from "../../../generated/prisma/client";

export const organizerAttendeeService = {
  async getAttendees(organizerId: string, eventId: string) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId: organizerId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!event) {
      throw AppError("Event not found or not authorized", 404);
    }

    const attendees = await prisma.booking.findMany({
      where: {
        eventId,
        deletedAt: null,
        transactions: {
          some: {
            transactionStatus: TransactionStatus.DONE,
          },
        },
      },
      select: {
        quantity: true,
        totalPrice: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return attendees.map((booking) => ({
      userId: booking.user.id,
      username: booking.user.username,
      email: booking.user.email,
      ticketQuantity: booking.quantity,
      totalPaid: booking.totalPrice,
    }));
  },
};