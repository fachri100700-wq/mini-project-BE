import { body } from "express-validator";

export const updateOrganizerProfileValidator = [
  body("displayName")
    .optional()
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage("Display name must be between 2 and 50 characters"),

  body("bio")
    .optional()
    .isString()
    .isLength({ max: 150 })
    .withMessage("Bio must be at most 150 characters"),

  body("avatarUrl")
    .optional()
    .isString()
    .isURL()
    .withMessage("Avatar URL must be a valid URL"),

  body("location")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage("Location must be at most 50 characters"),
];