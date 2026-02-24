import { Router } from "express";
import { bookingsController } from "../controllers/bookings.controller";
import { createBookingValidator } from "../validators/booking.validator";
import { expressRequestValidation } from "../middleware/express.request.validation.middleware";
import { jwtVerify } from "../middlewares/auth.middleware";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { customerOnly } from "../middlewares/customerOnly.middleware";

const router = Router()

router.get('/:id',jwtVerify(JWT_TOKEN_SECRET_KEY!), customerOnly, bookingsController.get)
router.post('/',jwtVerify(JWT_TOKEN_SECRET_KEY!), customerOnly, createBookingValidator, expressRequestValidation, bookingsController.create)

export default router