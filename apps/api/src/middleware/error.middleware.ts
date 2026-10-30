import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError, ApiResponseHelper } from "../lib/api-response.js";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path as (string | number)[],
    }));

    ApiResponseHelper.error(
      res,
      "Validation failed",
      "VALIDATION_ERROR",
      400,
      formattedErrors
    );
    return;
  }

  // Handle Known Application Errors
  if (err instanceof AppError) {
    ApiResponseHelper.error(
      res,
      err.message,
      err.code,
      err.statusCode,
      err.details
    );
    return;
  }

  // Handle Unexpected Server Errors
  console.error("❌ Unhandled Application Error:", err);

  const message =
    env.NODE_ENV === "production"
      ? "An unexpected internal server error occurred"
      : err.message || "An unexpected error occurred";

  ApiResponseHelper.error(
    res,
    message,
    "INTERNAL_SERVER_ERROR",
    500,
    env.NODE_ENV === "development" ? { stack: err.stack } : undefined
  );
}
