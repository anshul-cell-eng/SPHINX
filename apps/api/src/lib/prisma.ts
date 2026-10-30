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

export async function disconnectPrisma(): Promise<void> {
  if (isDatabaseConfigured) {
    await prisma.$disconnect();
  }
}
