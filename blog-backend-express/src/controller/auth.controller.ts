import { Request, Response } from "express";

import { ILoginUser, IRegisterUser } from "@/schemas/auth.schemas";

import AuthService from "@/services/auth.services";

const authService = new AuthService();

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: IRegisterUser = req.body;

      const user = await authService.registerUser(userData);

      res.status(201).json({
        success: true,
        message: "Registration successful. Please login.",
        data: user,
      });
    } catch (error: any) {
      if (error.message === "USER_ALREADY_EXISTS") {
        res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: ILoginUser = req.body;

      const { user, accessToken, refreshToken } =
        await authService.loginUser(credentials);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user,
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      if (error.message === "INVALID_CREDENTIALS") {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
        return;
      }

      res.status(500).json({ success: false, message: "Login failed" });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      if (!data.refreshToken) {
        res
          .status(401)
          .json({ success: false, message: "Refresh token missing" });
        return;
      }

      const { accessToken, newRefreshToken } =
        await authService.refreshAccessToken(data.refreshToken);

      res.status(200).json({
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      const user = await authService.getCurrentUser(req.user!.id);
      res.status(200).json({ success: true, data: user });
    } catch (err: any) {
      res
        .status(500)
        .json({ success: false, message: "Failed to get user information" });
    }
  }
}

export default AuthController;