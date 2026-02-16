import { Router } from "express";
import { bookingsController } from "../controllers/bookings.controller";

const router = Router()

router.get('/:id', bookingsController.get)
router.post('/', bookingsController.create)

export default router