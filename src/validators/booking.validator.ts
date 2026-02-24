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
    .isInt({ min: 1, max: 10 }).withMessage("You can only purchase between 1 and 10 tickets"),

  body("promoId")
    .optional({ nullable: true })
    .isUUID().withMessage("Invalid Promo ID format"),

  body("couponId")
    .optional({ nullable: true })
    .isUUID().withMessage("Invalid Coupon ID format"),

  body("referralRewardId")
    .optional({ nullable: true })
    .isUUID().withMessage("Invalid Referral Reward ID format"),

  /* body("userId")
    .notEmpty().withMessage("User ID is required")
    .isUUID().withMessage("Invalid User ID format"), */
]