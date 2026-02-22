import { body } from "express-validator"

export const  changePasswordValidator = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters"),
];