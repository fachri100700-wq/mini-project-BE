import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const createBookingValidator = [
  body("eventId")
    .notEmpty().withMessage("Event ID is required")
    .isUUID().withMessage("Invalid Event ID format"),

  body("ticketTypeId")
    .notEmpty().withMessage("Please select a ticket type")
    .isUUID().withMessage("Invalid Ticket Type ID format"),

  body("quantity")
    .notEmpty().withMessage("Quantity is required")
    .isInt({ min: 1 }).withMessage("You must select at least 1 ticket"),

  body("promoId")
    .optional({ nullable: true })
    .isUUID().withMessage("Invalid Promo ID format"),

  body("userId")
    .notEmpty().withMessage("User ID is required")
    .isUUID().withMessage("Invalid User ID format"),
]