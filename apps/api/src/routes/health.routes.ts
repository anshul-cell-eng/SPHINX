import { Router } from "express";
import { ApiResponseHelper } from "../lib/api-response.js";
import { getDatabaseStatus } from "../lib/database.js";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  const dbStatus = getDatabaseStatus();

  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    services: {
      api: { status: "operational", uptimeSeconds: Math.round(process.uptime()) },
      database: dbStatus,
      razorpay: { status: "test_mode_ready" },
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
  };

  ApiResponseHelper.success(res, "FREELANCEOS System Diagnostics Healthy", healthData);
});
