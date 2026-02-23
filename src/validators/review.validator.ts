import { body, validationResult } from "express-validator";

export const createReviewValidator = [
  
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("feedback")
    .notEmpty()
    .withMessage("Feedback is required")
    .isString()
    .withMessage("Feedback must be a string")
    .isLength({ min: 10 })
    .withMessage("Feedback is too short (min 10 characters)"),
];
