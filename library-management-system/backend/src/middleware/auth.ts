import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "your_super_secret_jwt_key_here_change_this_in_production"
    ) as any;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (roles: string[], allowSelf: boolean = false) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      // If allowSelf is true and user is a member, check if they're accessing their own resource
      if (allowSelf && req.user.role === "member") {
        const userId = req.params.userId || req.params.id;
        if (userId && userId === req.user.userId) {
          return next();
        }
      }

      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};
