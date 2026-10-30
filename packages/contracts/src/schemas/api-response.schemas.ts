import { z } from "zod";

/**
 * Standard Pagination Metadata
 */
export const paginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

/**
 * Factory for strongly-typed standard API success responses
 */
export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema,
    meta: paginationMetaSchema.optional(),
  });
}

/**
 * Standard API Error Detail Schema
 */
export const apiErrorDetailSchema = z.object({
  code: z.string(),
  message: z.string(),
  path: z.array(z.union([z.string(), z.number()])).optional(),
});

/**
 * Standard API Error Response Schema
 */
export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.string(),
    details: z.union([z.array(apiErrorDetailSchema), z.record(z.unknown()), z.string()]).optional(),
    stack: z.string().optional(),
  }),
  timestamp: z.string().optional(),
});

/**
 * Health Status Data Schema
 */
export const healthStatusDataSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy"]).or(z.string()),
  environment: z.string().optional(),
  uptime: z.number().nonnegative().optional(),
  timestamp: z.string().optional(),
  services: z
    .object({
      database: z.enum(["connected", "disconnected", "unconfigured", "error"]).optional(),
    })
    .optional(),
});

/**
 * Standard Health Check Response Schema
 */
export const healthResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: healthStatusDataSchema,
});
