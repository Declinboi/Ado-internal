import { Request, Response } from "express";
import { User } from "../models/userModel";
import generateToken from "../utils/generateToken";
import { sendVerificationEmail } from "../mailConfig/emails";
import { emailQueue } from "../queue/emailQueue";
// import { User } from "../models/User";

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
       // Queue the email job
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







  
}
