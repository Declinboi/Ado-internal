// src/middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";

// Extend Express Request
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    is_admin: boolean;
  };
}

// Middleware to authenticate user
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    req.user = {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    };

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed.");
  }
};

// Middleware to authorize admin access
export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.is_admin) {
    next();
  } else {
    res.status(403).send("Not authorized as an admin.");
  }
};
