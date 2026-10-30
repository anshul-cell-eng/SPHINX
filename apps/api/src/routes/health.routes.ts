import { Router } from "express";
import type { Request, Response } from "express";
import { ApiResponseHelper } from "../lib/api-response.js";

export const healthRouter = Router();

/**
 * GET /api/v1/health
 * Production health probe verifying API server operational readiness
 */
healthRouter.get("/", (_req: Request, res: Response) => {
  ApiResponseHelper.success(
    res,
    "NEXUS API is operational",
    {
      status: "healthy",
    },
    200
  );
});
