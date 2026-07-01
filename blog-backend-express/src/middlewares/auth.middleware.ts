import { Response, NextFunction } from "express";

import { queryOne } from "@/config/db";

import { AuthRequest } from "@/controller/auth.controller";

import AuthService, { User } from "@/services/auth.services";

const authService = new AuthService();

export const verifyJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication Token required. Please login.",
      });
      return;
    }

    const decoded = authService.verifyAccessToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
      return;
    }

    const user = await queryOne<User>(
      `SELECT id, first_name, last_name, email, phone, created_at 
             FROM users WHERE id = $1`,
      [decoded.id],
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};