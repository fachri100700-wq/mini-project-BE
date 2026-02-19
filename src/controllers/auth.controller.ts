import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { LoginDTO, RegisterDTO } from "../types/auth.dto";

export const authController = {
    async register(req: Request, res: Response){
        const body = req.body as RegisterDTO;

        await authService.register(body)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                email: body.email,
                username: body.username,
                role: body.role
            }
        })
    },

    async login(req: Request, res: Response){
        const body = req.body as LoginDTO;

        const { username, Role, token } = await authService.login(body)

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        })

        res.status(200).json({
            status: true,
            message: 'User logged in successfully',
            data: {
                username,
                Role
            }
        })
    },

    async session(req: Request, res: Response){
        const { userId } = res?.locals?.payload;

        const {username, role} = await authService?.session( userId );

        res.status(200).json({
            success: true,
            message: 'User auth is successfull',
            data: {
                username,
                role,
            }
        })
    }
}