import { EVENT_APP_URL, JWT_RESET_SECRET_KEY, USER_EMAILER } from "../config/main.config";
import { User } from "../../generated/prisma/client";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";
import { hashing, hashMatch } from "../helpers/bcrypt.helper";
import { jwtCreateToken } from "../helpers/jwt.helper";
import generateReferralCode from "../helpers/referralcode.helper";
import { LoginDTO, RegisterDTO } from "../types/auth.dto";
import path from 'node:path';
import fs from 'fs';
import Handlebars from "handlebars";
import transporter from "../helpers/nodemailer.helper";
import jwt from "jsonwebtoken";

type ResetPasswordTokenPayload = {
    userId: string;
    purpose: "FORGOT_PASSWORD";
    iat: number;
    exp: number;
};

export const authService = {
    async register({
        email,
        username,
        password,
        role,
        referralCode
    }: RegisterDTO) {

        const findUserByEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (findUserByEmail) throw AppError('Email already registered', 409)

        const hashedPassword = await hashing(password);
        const newReferralCode = await generateReferralCode(prisma);
        const cleanReferralCode = referralCode?.trim();

        let referrer: User | null = null;

        if (cleanReferralCode) {
            referrer = await prisma.user.findUnique({
                where: { referralCode: cleanReferralCode },
            });

            if (!referrer) {
                throw AppError("Invalid referral code", 400);
            }
        }

        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    role,
                    referralCode: newReferralCode,
                    referredById: referrer?.id,
                },
            });

            if (referrer) {
                const now = new Date();
                const expire = new Date();
                expire.setMonth(now.getMonth() + 3);

                await tx.referralReward.create({
                    data: {
                        userId: referrer.id,
                        points: 10000,
                        reason: "REFERRED_USER",
                        startDate: now,
                        expireDate: expire,
                    },
                });

                await tx.coupon.create({
                    data: {
                        userId: user.id,
                        code: `REF-${newReferralCode}`,
                        discount: 10000,
                        expiredDate: expire,
                    },
                });
            }
        });
    },

    async login({ email, password }: LoginDTO) {
        const findUserByEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!findUserByEmail) throw AppError('Invalid email or password', 401)

        const passwordMatch = await hashMatch(password, findUserByEmail?.password);

        if (!passwordMatch) throw AppError('Invalid email or password', 401)

        const token = jwtCreateToken(
            { userId: findUserByEmail?.id, role: findUserByEmail?.role },
            JWT_TOKEN_SECRET_KEY!,
            {
                expiresIn: '1d'
            }
        )

        return {
            id: findUserByEmail?.id,
            username: findUserByEmail?.username,
            Role: findUserByEmail?.role,
            token
        }
    },

    async session(userId: string) {
        const findUserById = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!findUserById) throw AppError("User not found", 404);

        return {
            id: findUserById?.id,
            username: findUserById?.username,
            role: findUserById?.role
        }
    },

    async forgotPassword(email: string) {
        const findEmail = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                username: true,
            },
        });

        if (!findEmail) return;

        const resetToken = jwtCreateToken(
            {
                userId: findEmail?.id,
                purpose: "FORGOT_PASSWORD",
            },
            JWT_RESET_SECRET_KEY!,
            {
                expiresIn: '15m',
            },
        );

        const templateDir = path.resolve(__dirname, './../templates');

        const templatePath = path.join(templateDir, 'forgot-password.html');

        const templateSource = fs.readFileSync(templatePath, 'utf-8');

        const compiledTemplate = Handlebars.compile(templateSource);

        const html = compiledTemplate({
            username: findEmail?.username,
            resetPasswordUrl: `${EVENT_APP_URL}/reset-password?token=${resetToken}`,
            appName: "Event Platform"
        });

        await transporter.sendMail({
            from: `"EventKuy" <${USER_EMAILER}>`,
            to: email,
            subject: 'Reset Password',
            html: html,
        });
    },

    async resetPassword(token: string, newPassword: string) {
        let payload: ResetPasswordTokenPayload;

        try {
            payload = jwt.verify(token, JWT_RESET_SECRET_KEY!) as ResetPasswordTokenPayload;
        } catch (err) {
            throw AppError("Invalid or expired reset token", 400);
        }

        if (payload.purpose !== "FORGOT_PASSWORD") {
            throw AppError("Invalid reset token purpose", 400);
        }

        const userId = payload.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });

        if (!user) {
            throw AppError("User not found", 404);
        }

        const isSamePassword = await hashMatch(newPassword, user.password);
        if (isSamePassword) {
            throw AppError("New password must be different from the old password", 400);
        }

        const hashedPassword = await hashing(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }
}