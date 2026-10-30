import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore, type UserRecord } from "../lib/memory-store.js";
import { persistEntity } from "../lib/persistence.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rate-limit.middleware.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(2),
  role: z.enum(["FREELANCER", "CLIENT"]).default("FREELANCER"),
  company: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /register
authRouter.post("/register", authRateLimiter, async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Validation failed", "VALIDATION_ERROR", 400, parse.error.issues);
    return;
  }

  const { email, password, name, role, company } = parse.data;

  // Check if email already registered
  const existing = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    ApiResponseHelper.error(res, "A user with this email already exists", "EMAIL_EXISTS", 409);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = `usr-${Date.now()}`;
  const workspaceId = role === "FREELANCER" ? `ws-${userId}` : "ws-shared";

  const newUser: UserRecord = {
    id: userId,
    email: email.toLowerCase(),
    passwordHash,
    name,
    role,
    company: company || (role === "FREELANCER" ? `${name} Studio` : "Client Entity"),
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150`,
    hourlyRate: 4500,
    taxId: "GSTIN29AAACA1234",
    upiId: `${name.toLowerCase().replace(/\s+/g, "")}@upi`,
    workspaceId,
    createdAt: new Date().toISOString(),
  };

  memoryStore.users.push(newUser);
  await persistEntity("user", newUser);

  // Generate JWT tokens
  const tokenPayload = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    workspaceId: newUser.workspaceId,
  };

  const accessToken = jwt.sign(tokenPayload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(tokenPayload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  ApiResponseHelper.success(
    res,
    "Registration successful",
    {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        company: newUser.company,
        workspaceId: newUser.workspaceId,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900,
      },
    },
    201
  );
});

// POST /login
authRouter.post("/login", authRateLimiter, async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Invalid login credentials format", "VALIDATION_ERROR", 400);
    return;
  }

  const { email, password } = parse.data;

  const user = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    ApiResponseHelper.error(res, "Invalid email or password", "INVALID_CREDENTIALS", 401);
    return;
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    ApiResponseHelper.error(res, "Invalid email or password", "INVALID_CREDENTIALS", 401);
    return;
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    workspaceId: user.workspaceId,
  };

  const accessToken = jwt.sign(tokenPayload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(tokenPayload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  ApiResponseHelper.success(res, "Authentication successful", {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
      workspaceId: user.workspaceId,
      avatar: user.avatar,
    },
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: 900,
    },
  });
});

// POST /refresh
authRouter.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    ApiResponseHelper.error(res, "Missing refreshToken", "BAD_REQUEST", 400);
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
    const user = memoryStore.users.find((u) => u.id === decoded.userId);

    if (!user) {
      ApiResponseHelper.error(res, "User not found", "UNAUTHORIZED", 401);
      return;
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      workspaceId: user.workspaceId,
    };

    const newAccessToken = jwt.sign(tokenPayload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

    ApiResponseHelper.success(res, "Token refreshed successfully", {
      accessToken: newAccessToken,
      expiresIn: 900,
    });
  } catch (err) {
    ApiResponseHelper.error(res, "Invalid or expired refresh token", "INVALID_REFRESH_TOKEN", 401);
  }
});

// GET /me
authRouter.get("/me", authenticate, (req, res) => {
  const user = memoryStore.users.find((u) => u.id === req.user?.userId);
  if (!user) {
    ApiResponseHelper.error(res, "User profile not found", "NOT_FOUND", 404);
    return;
  }

  ApiResponseHelper.success(res, "Profile retrieved", {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    company: user.company,
    workspaceId: user.workspaceId,
    avatar: user.avatar,
    hourlyRate: user.hourlyRate,
    taxId: user.taxId,
    upiId: user.upiId,
  });
});
