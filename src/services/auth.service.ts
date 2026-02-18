import { Role, User } from "../../generated/prisma/client";
import { JWT_TOKEN_SECRET_KEY } from "../config/main.config";
import { prisma } from "../config/prisma-client.config";
import AppError from "../helpers/app-error.helper";
import { hashing, hashMatch } from "../helpers/bcrypt.helper";
import { jwtCreateToken } from "../helpers/jwt.helper";

export const authService = {
    async register({ email, username, password, role }: Pick<User, 'email' | 'username' | 'password' | 'role'>){
        const findUserByEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(findUserByEmail) throw AppError('Email already registered', 409)

        const hashedPassword = await hashing(password);

        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role
            }
        })
    },

    async login({ email, password }: Pick<User, 'email' | 'password'>) {
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