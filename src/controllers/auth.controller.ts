import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { LoginDTO, RegisterDTO } from "../types/auth.dto";
import { NODE_ENV } from "../config/main.config";

export const authController = {
  async register(req: Request, res: Response) {
    const body = req.body as RegisterDTO;

    await authService.register(body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        email: body.email,
        username: body.username,
        role: body.role,
      },
    });
  },

  async login(req: Request, res: Response) {
    const body = req.body as LoginDTO;

    const { id, username, Role, token } = await authService.login(body);

    const isProd = NODE_ENV === "production";

    const cookies: any = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    };

    res.cookie("accessToken", token, cookies);

    res.status(200).json({
      status: true,
      message: "User logged in successfully",
      data: {
        id,
        username,
        role: Role,
      },
    });
  },

  async session(req: Request, res: Response) {
    const { userId } = res?.locals?.payload;

    const { id, username, role } = await authService?.session(userId);

    res.status(200).json({
      success: true,
      message: "User auth is successfull",
      data: {
        id,
        username,
        role,
      },
    });
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      await authService.forgotPassword(email);

      res.status(200).json({
        message: "If the email exists, a reset link has been sent",
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;

      await authService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },
};
