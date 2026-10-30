import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().optional(),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_URL: z.string().default("http://localhost:5173"),
  MONGODB_URI: z.string().default("mongodb://127.0.0.1:27017/freelanceos"),
  JWT_ACCESS_SECRET: z.string().default("freelanceos_jwt_access_super_secret_key_2026_dev"),
  JWT_REFRESH_SECRET: z.string().default("freelanceos_jwt_refresh_super_secret_key_2026_dev"),
  RAZORPAY_KEY_ID: z.string().default("rzp_test_9kM38Lp0QxWv12"),
  RAZORPAY_KEY_SECRET: z.string().default("sec_test_7f920da8e14b"),
  RAZORPAY_WEBHOOK_SECRET: z.string().default("whsec_test_99a8b7c6d5e4"),
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

  return result.data;
}

export const env = validateEnv();
export const effectivePort = env.PORT || env.API_PORT;
