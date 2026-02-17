import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";
import { multerUpload } from "../helpers/multer.helper";

const router = Router()

router.post(
  "/",
  multerUpload(
    "src/uploads",
    "IMG-MENU",
    ["jpg", "jpeg", "png", "svg", "webp"],
    "memory",
  ).single("payment-proof"),
  transactionController.create,
);

export default router