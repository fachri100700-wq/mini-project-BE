import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";
import { multerUpload } from "../helpers/multer.helper";
import { jwtVerify } from "../middlewares/auth.middleware";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { customerOnly } from "../middlewares/customerOnly.middleware";

const router = Router()

router.get('/:id', jwtVerify(JWT_TOKEN_SECRET_KEY!),customerOnly, transactionController.getWaitingConfirm)
router.patch(
  "/upload/:id",
  jwtVerify(JWT_TOKEN_SECRET_KEY!), customerOnly,
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