import { Router } from "express";
import type { Request, Response } from "express";
import { ApiResponseHelper } from "../lib/api-response.js";
import { checkDatabaseConnection } from "../lib/prisma.js";
import { checkSupabaseConnection } from "../lib/supabase.js";

export const healthRouter = Router();

/**
 * GET /api/v1/health
 * Production health probe verifying API server operational readiness
 */
healthRouter.get("/", async (_req: Request, res: Response) => {
  const [dbResult, supabaseResult] = await Promise.all([
    checkDatabaseConnection(),
    checkSupabaseConnection(),
  ]);

  ApiResponseHelper.success(
    res,
    "NEXUS API is operational",
    {
      status: "healthy",
      services: {
        database: dbResult.status,
        supabase: supabaseResult.status,
      },
    },
    200
  );
});

/**
 * GET /api/v1/health/detailed
 * Comprehensive service diagnostics with connection details
 */
healthRouter.get("/detailed", async (_req: Request, res: Response) => {
  const [dbResult, supabaseResult] = await Promise.all([
    checkDatabaseConnection(),
    checkSupabaseConnection(),
  ]);

  ApiResponseHelper.success(
    res,
    "NEXUS System Diagnostics",
    {
      status: "healthy",
      uptime: process.uptime(),
      services: {
        database: dbResult,
        supabase: supabaseResult,
      },
    },
    200
  );
});
