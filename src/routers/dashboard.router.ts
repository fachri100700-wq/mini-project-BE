import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware";
import { organizerOnly } from "../middlewares/organizerOnly.middleware";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { organizerProfileController } from "../controllers/dashboard/organizer-profile.controller";
import { updateOrganizerProfileValidator } from "../validators/organizer-profile-update.validator";
import { expressRequestValidation } from "../middlewares/express-request-validation.middleware";
import { organizerEventController } from "../controllers/dashboard/organizer-event.controller";
import { updateOrganizerEventValidator } from "../validators/organizer-event-update.validator";
import { organizerTransactionController } from "../controllers/dashboard/organizer-transaction.controller";
import { transactionActionValidator } from "../validators/transaction-action-validator";
import { organizerTransactionActionController } from "../controllers/dashboard/organizer-transaction-action.controller";
import { organizerAttendeeController } from "../controllers/dashboard/organizer-attendee.controller";
import { organizerStatisticController } from "../controllers/dashboard/organizer-statistic.controller";


const router = Router();

router.use(jwtVerify(JWT_TOKEN_SECRET_KEY!));
router.use(organizerOnly);

router.get("/profile", organizerProfileController.getProfile);

router.patch(
  "/profile",
  updateOrganizerProfileValidator,
  expressRequestValidation,
  organizerProfileController.updateProfile
);

router.get("/events", organizerEventController.getEvents);

router.get(
  "/events/:eventId",
  organizerEventController.getEvent
);

router.patch(
  "/events/:eventId",
  updateOrganizerEventValidator,
  expressRequestValidation,
  organizerEventController.updateEvent
);

router.get(
  "/events/:eventId/attendees",
  organizerAttendeeController.getAttendees
);

router.get(
  "/transactions",
  organizerTransactionController.getTransactions
);

router.patch(
  "/transactions/:transactionId",
  transactionActionValidator,
  expressRequestValidation,
  organizerTransactionActionController.updateTransaction
);

router.get(
  "/statistics",
  organizerStatisticController.getStatistics
);

export default router;