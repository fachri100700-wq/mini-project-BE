import { body } from "express-validator";

export const forgotPasswordValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),
];