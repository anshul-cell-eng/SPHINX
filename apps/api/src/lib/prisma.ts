import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const isDatabaseConfigured = Boolean(env.DATABASE_URL);

export const prisma: PrismaClient =
  globalThis.__prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

/**
 * Diagnostic function to test live PostgreSQL database connection
 */
export async function checkDatabaseConnection(): Promise<{
  status: "connected" | "unconfigured" | "error";
  message: string;
  latencyMs?: number;
}> {
  if (!isDatabaseConfigured) {
    return {
      status: "unconfigured",
      message: "DATABASE_URL is not set in .env",
    };
  }

  const startTime = Date.now();
  try {
    // Perform raw SQL ping
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: "connected",
      message: "PostgreSQL connection verified",
      latencyMs: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Database connection failed",
    };
  }
}

export async function disconnectPrisma(): Promise<void> {
  if (isDatabaseConfigured) {
    await prisma.$disconnect();
  }
}
