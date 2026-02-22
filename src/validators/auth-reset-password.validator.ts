import { body } from "express-validator";

export const authResetPasswordValidator = [
    body("token")
        .notEmpty()
        .withMessage("Reset token is required")
        .bail()
        .isString()
        .withMessage("Reset token must be a string"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
];