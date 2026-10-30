import type { Request, Response } from "express";
import { ApiResponseHelper } from "../lib/api-response.js";

export function notFoundHandler(req: Request, res: Response): void {
  ApiResponseHelper.error(
    res,
    `Cannot ${req.method} ${req.originalUrl}`,
    "RESOURCE_NOT_FOUND",
    404
  );
}
