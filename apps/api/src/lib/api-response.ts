import type { Response } from "express";
import type {
  ApiResponse,
  ApiErrorResponse,
  PaginationMeta,
} from "../types/contracts.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ApiResponseHelper {
  public static success<T>(
    res: Response,
    message: string,
    data: T,
    statusCode = 200,
    meta?: PaginationMeta
  ): Response<ApiResponse<T>> {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    };
    return res.status(statusCode).json(payload);
  }

  public static error(
    res: Response,
    message: string,
    code = "INTERNAL_SERVER_ERROR",
    statusCode = 500,
    details?: unknown
  ): Response<ApiErrorResponse> {
    const payload: ApiErrorResponse = {
      success: false,
      message,
      error: {
        code,
        ...(details !== undefined ? { details: details as any } : {}),
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
