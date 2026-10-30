import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore } from "../lib/memory-store.js";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: "FREELANCER" | "CLIENT";
  workspaceId: string;
  clientId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ApiResponseHelper.error(res, "Missing or malformed Authorization header", "UNAUTHORIZED", 401);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      ApiResponseHelper.error(res, "Access token has expired", "TOKEN_EXPIRED", 401);
      return;
    }
    ApiResponseHelper.error(res, "Invalid authentication token", "INVALID_TOKEN", 401);
  }
}

export function requireRole(allowedRoles: Array<"FREELANCER" | "CLIENT">) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponseHelper.error(res, "Authentication required", "UNAUTHORIZED", 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ApiResponseHelper.error(
        res,
        `Forbidden: Role '${req.user.role}' lacks permission for this endpoint`,
        "FORBIDDEN",
        403
      );
      return;
    }

    next();
  };
}

export const requireFreelancer = requireRole(["FREELANCER"]);
export const requireClient = requireRole(["CLIENT"]);
