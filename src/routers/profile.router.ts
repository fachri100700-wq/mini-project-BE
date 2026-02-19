import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware";
import { profileController } from "../controllers/profile.controller";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { customerOnly } from "../middlewares/role.middleware";
import { updateProfileValidator } from "../validators/profile-update.validator";
import { expressRequestValidation } from "../middlewares/express-request-validation.middleware";

const router = Router();

router.use(jwtVerify(JWT_TOKEN_SECRET_KEY!));
router.use(customerOnly);

router.get('/', profileController.getProfile);
router.get('/referrals', profileController.getReferralInfo);
router.get('/coupons', profileController.getCoupons);

router.patch('/',
    updateProfileValidator,
    expressRequestValidation,
    profileController.updateProfile);

export default router;