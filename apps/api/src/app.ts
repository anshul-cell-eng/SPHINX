import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { apiV1Router } from "./routes/index.js";
import { healthRouter } from "./routes/health.routes.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { apiRateLimiter } from "./middleware/rate-limit.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(): express.Application {
  const app = express();

  // 1. Trust Reverse Proxy (essential for Render / Cloudflare SSL & client IP detection)
  app.set("trust proxy", 1);

  // 2. Security Headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // allow WebGL, Three.js, inline styles, external fonts
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // 3. CORS Configuration
  const allowedOrigins = [
    env.WEB_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://localhost:4000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          env.NODE_ENV === "development" ||
          origin.endsWith(".onrender.com") ||
          (env.WEB_URL && origin === env.WEB_URL)
        ) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "x-razorpay-signature",
        "x-razorpay-event-id",
      ],
    })
  );

  // 4. Request Body Parsers
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // 5. Rate Limiting for API routes
  app.use("/api/", apiRateLimiter);

  // 6. Root health check alias for deployment platforms (Render, Railway, Docker)
  app.use("/health", healthRouter);

  // 7. API v1 Router
  app.use("/api/v1", apiV1Router);

  // 8. Serve Production Static Frontend Build (if present on disk)
  const webDistCandidates = [
    path.resolve(process.cwd(), "apps/web/dist"),
    path.resolve(__dirname, "../../web/dist"),
    path.resolve(__dirname, "../../../apps/web/dist"),
  ];
  const webDistPath = webDistCandidates.find((candidate) => fs.existsSync(candidate));

  if (webDistPath) {
    app.use(express.static(webDistPath));

    // Client-side SPA routing fallback: non-API GET requests serve index.html
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/health")) {
        return next();
      }
      res.sendFile(path.join(webDistPath, "index.html"), (err) => {
        if (err) next();
      });
    });
  }

  // 9. 404 Catch-All Middleware for unmatched API routes
  app.use(notFoundHandler);

  // 10. Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
