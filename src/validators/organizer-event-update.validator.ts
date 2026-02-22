import { body } from "express-validator";
import { EventCategory, EventType } from "../generated/prisma/client";

export const updateOrganizerEventValidator = [
  body("eventName")
    .optional()
    .isString()
    .isLength({ min: 3, max: 100 }),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be valid ISO date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be valid ISO date"),

  body("imageUrl")
    .optional()
    .isString()
    .isURL(),

  body("location")
    .optional()
    .isString()
    .isLength({ max: 100 }),

  body("description")
    .optional()
    .isString()
    .isLength({ max: 150 }),

  body("seatTotal")
    .optional()
    .isInt({ min: 1 }),

  body("eventType")
    .optional()
    .isIn(Object.values(EventType)),

  body("eventCategory")
    .optional()
    .isIn(Object.values(EventCategory)),
];