import { body } from "express-validator";

export const transactionActionValidator = [
  body("action")
    .exists().withMessage("Action is required")
    .isIn(["approve", "reject"])
    .withMessage("Action must be either approve or reject"),
];