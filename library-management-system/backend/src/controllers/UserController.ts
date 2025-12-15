import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { UserRole } from "../types";

class UserController {
  // REGISTER METHOD
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone, address } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists",
        });
      }

      // Generate unique membership ID
      const membershipId = `MEM${Date.now().toString().slice(-8)}`;

      // Create new user (always as member for public registration)
      const user = await User.create({
        name,
        email,
        password,
        role: UserRole.MEMBER,
        membershipId,
        phone: phone || "",
        address: address || "",
        isActive: true,
        borrowedBooks: [],
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET ||
          "your_super_secret_jwt_key_here_change_this_in_production",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
      );

      // Remove password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipId: user.membershipId,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
      };

      res.status(201).json({
        message: "Registration successful",
        user: userResponse,
        token,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "Registration failed",
        error: error.message,
      });
    }
  }

  // CREATE ADMIN/LIBRARIAN (Admin only)
  async createStaff(req: Request, res: Response) {
    try {
      const { name, email, password, role, phone, address } = req.body;
      const currentUser = (req as any).user;

      // Check if current user is admin
      if (currentUser.role !== UserRole.ADMIN) {
        return res.status(403).json({
          message: "Only administrators can create staff accounts",
        });
      }

      // Validate role
      if (![UserRole.ADMIN, UserRole.LIBRARIAN].includes(role)) {
        return res.status(400).json({
          message: "Invalid role. Must be admin or librarian",
        });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists",
        });
      }

      // Create staff user
      const user = await User.create({
        name,
        email,
        password,
        role,
        membershipId:
          role === UserRole.MEMBER
            ? `MEM${Date.now().toString().slice(-8)}`
            : undefined,
        phone: phone || "",
        address: address || "",
        isActive: true,
        borrowedBooks: [],
      });

      // Remove password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipId: user.membershipId,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
      };

      res.status(201).json({
        message: `${role} account created successfully`,
        user: userResponse,
      });
    } catch (error: any) {
      console.error("Create staff error:", error);
      res.status(500).json({
        message: "Failed to create staff account",
        error: error.message,
      });
    }
  }

  // GET USER PROFILE
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error: any) {
      console.error("Get profile error:", error);
      res.status(500).json({
        message: "Failed to fetch profile",
        error: error.message,
      });
    }
  }

  // UPDATE USER PROFILE
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { name, phone, address, currentPassword, newPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update basic info
      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;

      // Update password if provided
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            message: "Current password is required to change password",
          });
        }

        const isValidPassword = await user.comparePassword(currentPassword);
        if (!isValidPassword) {
          return res.status(401).json({
            message: "Current password is incorrect",
          });
        }

        user.password = newPassword;
      }

      await user.save();

      // Remove password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipId: user.membershipId,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
      };

      res.json({
        message: "Profile updated successfully",
        user: userResponse,
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({
        message: "Failed to update profile",
        error: error.message,
      });
    }
  }

  // LOGIN METHOD
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          message: "Account is deactivated. Please contact administrator.",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET ||
          "your_super_secret_jwt_key_here_change_this_in_production",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
      );

      // Remove password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipId: user.membershipId,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
      };

      res.json({
        message: "Login successful",
        user: userResponse,
        token,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Login failed",
        error: error.message,
      });
    }
  }
}

export default new UserController();
