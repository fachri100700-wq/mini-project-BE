import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { jwtVerify } from "../middlewares/auth.middleware";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { authLoginValidator } from "../validators/auth-login.validator";
import { expressRequestValidation } from "../middlewares/express-request-validation.middleware";
import { authRegisterValidator } from "../validators/auth-register.validator";

const router = Router();

router.post('/register',
    authRegisterValidator,
    expressRequestValidation,
    authController.register);
router.post('/login',
    authLoginValidator,
    expressRequestValidation,
    authController.login);
router.get('/session', jwtVerify(JWT_TOKEN_SECRET_KEY!), authController.session)

export default router;