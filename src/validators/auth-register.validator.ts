import { body } from "express-validator";

export const authRegisterValidator = [
    body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid')
    .normalizeEmail(),

    body('username')
    .trim()
    .isLength({ min: 3, max: 20})
    .withMessage('Username must be between 3 and 20 characters'),

    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8})
    .withMessage('Password must be at least 8 characters'),

    body('role')
    .isIn(["customer", "organizer"])
    .withMessage('Role must be customer or organizer'),

    body('referralCode')
    .optional()
    .isString()
    .withMessage('Referral code must be a string')
    .isLength({ min: 6, max: 20 })
    .withMessage('Referral code is invalid')
    .trim(),
]