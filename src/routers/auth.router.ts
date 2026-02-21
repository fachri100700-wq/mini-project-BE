import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { jwtVerify } from "../middlewares/auth.middleware";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { authLoginValidator } from "../validators/auth-login.validator";
import { expressRequestValidation } from "../middlewares/express-request-validation.middleware";
import { authRegisterValidator } from "../validators/auth-register.validator";
import { authForgotPasswordValidator } from "../validators/auth-forgot-password.validator";
import { authResetPasswordValidator } from "../validators/auth-reset-password.validator";

const router = Router();

router.post('/register',
    authRegisterValidator,
    expressRequestValidation,
    authController.register);

router.post('/login',
    authLoginValidator,
    expressRequestValidation,
    authController.login);

router.get('/session',
    jwtVerify(JWT_TOKEN_SECRET_KEY!),
    authController.session);

router.post("/forgot-password",
    authForgotPasswordValidator,
    expressRequestValidation,
    authController.forgotPassword);

router.post("/reset-password",
    authResetPasswordValidator,
    expressRequestValidation,
    authController.resetPassword);

export default router;