import { Request, Response } from "express";
import { User } from "../models/userModel";
import generateToken from "../utils/generateToken";
import { sendVerificationEmail } from "../mailConfig/emails";
import { emailQueue } from "../queue/emailQueue";
import { Op } from "sequelize";
import { welcomeEmailQueue } from "../queue/welcomeEmailQueue";
import crypto from "crypto";
import { passwordResetQueue } from "../queue/passwordResetQueue";
import { resetSuccessQueue } from "../queue/resetSuccessQueue";
import bcrypt from "bcryptjs";

export class UserController {
  //    Create a new user
  async createUser(req: Request, res: Response): Promise<void> {
    const { email, password, name } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const verification_token = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user with verification data
      const user = await User.create({
        email,
        password,
        name,
        verification_token,
        verification_expires_at: verificationExpiresAt,
      } as any);

      // Generate JWT token and set as cookie
      generateToken(res, user.id);

      // Send verification email
      await emailQueue.add({
        email: user.email,
        name: user.name,
        token: verification_token,
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          verification_token,
          verification_expires_at: verificationExpiresAt,
        },
      });
    } catch (error) {
      console.error("Create User Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Login user
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await user.isValidPassword(password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      generateToken(res, user.id);
      user.last_login = new Date();
      await user.save();

      // For now we just return user details — you can plug in JWT later
      res.status(200).json({
        Success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          is_verified: user.is_verified,
          is_admin: user.is_admin,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Email verification method
  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { code } = req.body;

    try {
      if (!code) {
        res.status(400).json({
          success: false,
          message: "Verification code is required",
        });
        return;
      }

      // Find user by verification code and ensure it is not expired
      const user = await User.findOne({
        where: {
          verification_token: code,
          verification_expires_at: {
            [Op.gt]: new Date(), // Ensure the token hasn't expired
          },
        },
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: "Invalid or expired verification code",
        });
        return;
      }

      // Update user to mark as verified
      user.is_verified = true;
      user.verification_token = undefined; // Clear the token after verification
      user.verification_expires_at = undefined; // Clear the expiry date
      await user.save();

      // Queue the welcome email
      await welcomeEmailQueue.add({
        email: user.email,
        name: user.name,
      });

      // Respond with a success message
      res.status(200).json({
        success: true,
        message: "Email verified successfully. Welcome message sent.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          is_verified: user.is_verified,
        },
      });
    } catch (err: any) {
      console.error("Error in verifyEmail:", err);
      res.status(500).json({
        success: false,
        message: err.message || "Server error",
      });
    }
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Expire the cookie immediately
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({ message: "Server error during logout" });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        res
          .status(400)
          .json({ success: false, message: "Email address not found" });
        return;
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpireAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.reset_password_token = resetToken;
      user.reset_password_expires_at = resetTokenExpireAt;
      await user.save();

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      // Send password reset email
      await passwordResetQueue.add({ email: user.email, resetUrl });

      res.status(200).json({
        success: true,
        message: "Reset link has been sent to your email",
      });
    } catch (err: any) {
      console.error("Error in forgotPassword:", err);
      res.status(500).json({
        success: false,
        message: err.message || "Server error",
      });
    }
  }

  // ResetPassword
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!token || !password) {
        res
          .status(400)
          .json({ success: false, message: "Token and password are required" });
        return;
      }

      const user = await User.findOne({
        where: {
          reset_password_token: token,
          reset_password_expires_at: {
            [Op.gt]: new Date(), // Sequelize-compatible way of checking expiration
          },
        },
      });

      if (!user) {
        res
          .status(400)
          .json({ success: false, message: "Invalid or expired token" });
        return;
      }

      user.password = password;
      user.reset_password_token = undefined;
      user.reset_password_expires_at = undefined;
      await user.save();

      await resetSuccessQueue.add({ email: user.email });

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (err: any) {
      console.error("Error in resetPassword:", err);
      res.status(500).json({
        success: false,
        message: err.message || "Server error",
      });
    }
  }
}
