import { body } from "express-validator";

export const authLoginValidator = [
    body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid'),

    body('password')
    .notEmpty()
    .withMessage('Password is required')
]