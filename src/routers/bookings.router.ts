import { Router } from "express";
import { bookingsController } from "../controllers/bookings.controller";
import { createBookingValidator } from "../validators/booking.validator";
import { expressRequestValidation } from "../middleware/express.request.validation.middleware";

const router = Router()

router.get('/:id', bookingsController.get)
router.post('/', createBookingValidator, expressRequestValidation, bookingsController.create)

export default router