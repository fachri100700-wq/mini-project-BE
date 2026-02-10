import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
    async register(req: Request, res: Response){
        const { email, username, password, role } = req.body;

        await authService.register({ email, username, password, role })

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                email,
                username,
                role
            }
        })
    },

    async login(req: Request, res: Response){
        const { email, password } = req.body;

        const { username, Role, token } = await authService.login({email, password})

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
    }
}