import { z } from "zod";
import {
  uuidSchema,
  paginationQuerySchema,
  timestampsSchema,
  tenantContextSchema,
} from "../schemas/common.schemas.js";
import {
  paginationMetaSchema,
  apiErrorDetailSchema,
  apiErrorResponseSchema,
  healthStatusDataSchema,
  healthResponseSchema,
} from "../schemas/api-response.schemas.js";

// Common inferred types
export type Uuid = z.infer<typeof uuidSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type Timestamps = z.infer<typeof timestampsSchema>;
export type TenantContext = z.infer<typeof tenantContextSchema>;

// API Response inferred types
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ApiErrorDetail = z.infer<typeof apiErrorDetailSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export type HealthStatusData = z.infer<typeof healthStatusDataSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
