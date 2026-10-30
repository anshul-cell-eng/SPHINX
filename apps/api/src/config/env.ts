import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from process.env or .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  API_PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(4000),
  WEB_URL: z
    .string()
    .min(1)
    .default("http://localhost:5173"),
  DATABASE_URL: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .pipe(z.string().min(1).optional()),
  DIRECT_URL: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .pipe(z.string().min(1).optional()),
  SUPABASE_URL: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .pipe(z.string().url("SUPABASE_URL must be a valid URL").optional()),
  SUPABASE_ANON_KEY: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .pipe(z.string().min(1).optional()),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .pipe(z.string().min(1).optional()),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Critical: Environment variable validation failed:");
    result.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    });
    process.exit(1);
  }

  // Safety check: warn if sensitive keys are missing in production
  if (result.data.NODE_ENV === "production") {
    if (!result.data.DATABASE_URL) {
      console.error("❌ Critical: DATABASE_URL must be defined in production.");
      process.exit(1);
    }
  }

  return result.data;
}

export const env = validateEnv();
