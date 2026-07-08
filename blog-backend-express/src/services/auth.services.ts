import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { queryOne } from "@/config/db";

import { ILoginUser, IRegisterUser } from "@/schemas/auth.schemas";

import { normalizeDate } from "@/utils/formatDate";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at?: string;
}

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
  private readonly ACCESS_TOKEN_EXPIRY = "15m";
  private readonly REFRESH_TOKEN_EXPIRY = "1d";

  private generateAccessToken(payload: {
    id: number;
    email: string;
  }): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  private generateRefreshToken(payload: {
    id: number;
    email: string;
  }): string {
    const tokenPayload = {
      payload,
      tokenId: crypto.randomBytes(16).toString("hex"),
    };
    return jwt.sign(tokenPayload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });
  }

  public async registerUser(
    userData: IRegisterUser,
  ): Promise<{ id: number; email: string }> {
    const existingUser = await queryOne<User>(
      "SELECT id FROM users WHERE email = $1",
      [userData.email],
    );

    if (existingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const sql = `
      INSERT INTO users 
      (first_name, last_name, email, password, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const result = await queryOne<{ id: number }>(sql, [
      userData.first_name,
      userData.last_name,
      userData.email,
      hashedPassword,
      userData.phone || null,
    ]);

    return {
      id: result!.id,
      email: userData.email,
    };
  }

  public async loginUser(userCredentials: ILoginUser) {
    const { email, password } = userCredentials;

    const user = await queryOne<User>(
      "SELECT id, first_name, last_name, email, password, created_at FROM users WHERE email = $1",
      [email],
    );

    if (!user) throw new Error("INVALID_CREDENTIALS");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("INVALID_CREDENTIALS");

    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      user: payload,
      accessToken,
      refreshToken,
    };
  }

  public async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    newRefreshToken: string;
  }> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as {
        payload: {
          id: number;
          email: string;
        };
      };

      const accessToken = this.generateAccessToken({
        id: decoded.payload.id,
        email: decoded.payload.email,
      });
      const newRefreshToken = this.generateRefreshToken({
        id: decoded.payload.id,
        email: decoded.payload.email,
      });

      return { accessToken, newRefreshToken };
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  public async getCurrentUser(id: number): Promise<User | null> {
    const user = await queryOne<User>(
      `SELECT id, first_name, last_name, email, phone, created_at
             FROM users WHERE id = $1`,
      [id],
    );

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const userResponse = {
      ...user,
    };
    return userResponse;
  }

  public verifyAccessToken(token: string): any | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as any;
    } catch {
      return null;
    }
  }
}

export default AuthService;