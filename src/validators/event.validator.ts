import { body } from "express-validator";
import { EventType, EventCategory } from "../../generated/prisma/enums";
import AppError from "../helpers/app-error.helper";

export const createEventValidator = [
  body("eventName")
    .exists()
    .withMessage("Event name is required")
    .isLength({ min: 6, max: 50 })
    .withMessage("Event name at least have 6 caracter"),

  body("startDate")
    .exists()
    .withMessage("Start date is required")
    .isISO8601() //format tanggal
    .withMessage("Start date must be a valid date format"),

  body("endDate")
    .exists()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date format")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw AppError("End date must be after start date", 422);
      }
      return true;
    }),

  body("imageUrl")
    .optional({ nullable: true })
    .isString()
    .withMessage("Image URL must string"),

  body("location")
    .exists()
    .withMessage("Location is required")
    .isLength({ max: 100 })
    .withMessage("Location maximum 100 caracter"),

  body("description")
    .exists()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 200 })
    .withMessage("Description at least have 10 caracter"),

  body("seatTotal")
    .exists()
    .withMessage("Seat total is required")
    .isInt({ min: 1 })
    .withMessage("Seat total at least have 1 seat"),

  body("eventType")
    .exists()
    .withMessage("Event type is required")
    .isIn(Object.values(EventType)) //untuk type enum (validasi “harus salah satu dari…”)
    .withMessage(
      `Event type must be one of: ${Object.values(EventType).join(", ")}`,
    ),

  body("eventCategory")
    .exists()
    .withMessage("Event category name is required")
    .isIn(Object.values(EventCategory))
    .withMessage(
      `Event category must one of: ${Object.values(EventCategory).join(", ")}`,
    ),

  body("ticketType")
    .isArray({ min: 1 })
    .withMessage("At least one ticket type is required"),

  body("ticketType.*.name")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Ticket type name must be between 3-20 characters"),

  body("ticketType.*.price")
    .isInt({ min: 0 })
    .withMessage("Price must be a valid number and cannot be negative"),

  body("ticketType.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Seat available must be at least 1")
    .custom((quantity, { req }) => {
      if (Number(quantity) > Number(req.body.seatTotal)) {
        throw new Error("Ticket seats cannot exceed total event seats");
      }
      return true;
    }),

  body("promoName")
    .optional({ checkFalsy: true })
    .isLength({ min: 5, max: 20 })
    .withMessage("Promo name must be between 5-20 characters"),

  body("promoStartDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Promo start date must be a valid date")
    .custom((startDate, { req }) => {
      if (new Date(startDate) > new Date(req.body.startDate)) {
        throw new Error("Promo must start before the event starts!");
      }
      return true;
    }),

  body("promoEndDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Promo end date must be a valid date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.promoStartDate)) {
        throw new Error("Promo end date must be after promo start date");
      }
      if (new Date(endDate) > new Date(req.body.startDate)) {
        throw new Error("Promo must end before or when the event starts");
      }
      return true;
    }),

  body("quota")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Promo quota must be at least 1"),

  body("discAmount")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Discount amount must be a positive number"),
];
