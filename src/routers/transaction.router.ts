import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";
import { multerUpload } from "../helpers/multer.helper";

const router = Router()

router.patch(
  "/upload/:id",
  multerUpload(
    "src/uploads",
    "IMG-MENU",
    ["jpg", "jpeg", "png", "svg", "webp"],
    "memory",
  ).single("payment-proof"),
  transactionController.uploadPaymentProof,
);
router.patch("/verify/:id", transactionController.verify)

export default router