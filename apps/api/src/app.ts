import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { apiV1Router } from "./routes/index.js";
import { healthRouter } from "./routes/health.routes.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

export function createApp(): express.Application {
  const app = express();

  // 1. CORS Configuration
  const allowedOrigins = [
    env.WEB_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || env.NODE_ENV === "development") {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  // 2. Request Parsers
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // 3. Root health alias for deployment platforms (Render, Docker, Kubernetes)
  app.use("/health", healthRouter);

  // 4. API v1 Router
  app.use("/api/v1", apiV1Router);

  // 5. 404 Catch-All Middleware
  app.use(notFoundHandler);

  // 6. Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
