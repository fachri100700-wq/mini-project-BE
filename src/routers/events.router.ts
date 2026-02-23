import { NextFunction, Request, Response, Router } from "express";
import { eventsController } from "../controllers/events.controller";
import { expressRequestValidation } from "../middleware/express.request.validation.middleware";
import { createEventValidator } from "../validators/event.validator";
import { multerUpload } from "../helpers/multer.helper";

const router = Router()


router.get("/", eventsController.getByFilter);
router.get('/:id', eventsController.getById)
router.post(
  "/",
  multerUpload(
    "src/uploads",
    "IMG-MENU",
    ["jpg", "jpeg", "png", "svg", "webp"],
    "memory",
  ).single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.ticketType === 'string') {
      req.body.ticketType = JSON.parse(req.body.ticketType);
    }
    next();},
  createEventValidator,
  expressRequestValidation,
  eventsController.create,
);
router.put(
  "/:id",
  multerUpload(
    "src/uploads",
    "IMG-MENU",
    ["jpg", "jpeg", "png", "svg", "webp"],
    "memory",
  ).single("image"),
  createEventValidator,
  expressRequestValidation,
  eventsController.update
);
router.put('/:id/delete', eventsController.delete)

export default router