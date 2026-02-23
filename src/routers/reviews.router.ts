import { Router } from "express";
import { reviewsController } from "../controllers/reviews.controller";
import { jwtVerify } from "../middlewares/auth.middleware";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { customerOnly } from "../middlewares/customerOnly.middleware";
import { createReviewValidator } from "../validators/review.validator";
import { expressRequestValidation } from "../middlewares/express-request-validation.middleware";

const reviewsRouter = Router();

reviewsRouter.get("/:eventId",jwtVerify(JWT_TOKEN_SECRET_KEY!), customerOnly, reviewsController.get);
reviewsRouter.post("/", jwtVerify(JWT_TOKEN_SECRET_KEY!), customerOnly, createReviewValidator, expressRequestValidation, reviewsController.create);
reviewsRouter.delete("/:id", reviewsController.delete);

export default reviewsRouter;
