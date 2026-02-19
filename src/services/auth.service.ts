import { Role, User } from "../../generated/prisma/client";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";
import { hashing, hashMatch } from "../helpers/bcrypt.helper";
import { jwtCreateToken } from "../helpers/jwt.helper";
import generateReferralCode from "../helpers/referralcode.helper";
import { LoginDTO, RegisterDTO } from "../validators/auth.dto";

export const authService = {
    async register({ 
            email,
            username,
            password,
            role,
            referralCode
        }: RegisterDTO){
        
        const findUserByEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(findUserByEmail) throw AppError('Email already registered', 409)

        const hashedPassword = await hashing(password);
        const newReferralCode = await generateReferralCode(prisma);
        
        let referrer: User | null = null;

        if(referralCode) {
            referrer = await prisma.user.findUnique({
                where: { referralCode },
            });

            if(!referrer) {
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

        if(!findUserByEmail) throw AppError('Invalid email or password', 401)

        const passwordMatch = await hashMatch(password, findUserByEmail?.password);

        if(!passwordMatch) throw AppError('Invalid email or password', 401)

        const token = jwtCreateToken(
            { userId: findUserByEmail?.id, role: findUserByEmail?.role },
            JWT_TOKEN_SECRET_KEY!,
            {
                expiresIn: '1d'
            }
        )

        return {
            username: findUserByEmail?.username,
            Role: findUserByEmail?.role,
            token
        }
    },

    async session(userId: string){
        const findUserById = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!findUserById) throw AppError("User not found", 404);

        return {
            username: findUserById?.username,
            role: findUserById?.role
        }
        
    }
}