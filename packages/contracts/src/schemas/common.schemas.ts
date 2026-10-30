import { z } from "zod";

/**
 * Standard UUID v4 validation schema
 */
export const uuidSchema = z
  .string()
  .uuid({ message: "Identifier must be a valid UUID v4 format" });

/**
 * Common pagination query parameters schema
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().trim().min(1).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().optional(),
});

/**
 * Common entity timestamps schema
 */
export const timestampsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
});

/**
 * Common tenant identification schema for multi-tenant isolation
 */
export const tenantContextSchema = z.object({
  tenantId: uuidSchema,
  organizationName: z.string().min(1).optional(),
});
