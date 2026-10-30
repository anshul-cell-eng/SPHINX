import { app } from "./app.js";
import { env } from "./config/env.js";
import { disconnectPrisma, isDatabaseConfigured } from "./lib/prisma.js";

const server = app.listen(env.API_PORT, () => {
  console.log("==================================================");
  console.log(`🚀 NEXUS API Server running in [${env.NODE_ENV}] mode`);
  console.log(`📡 Listening on: http://localhost:${env.API_PORT}`);
  console.log(`🩺 Health check: http://localhost:${env.API_PORT}/api/v1/health`);
  console.log(
    `🗄️ Database status: ${
      isDatabaseConfigured
        ? "PostgreSQL connection string provided"
        : "Standby (DATABASE_URL not configured)"
    }`
  );
  console.log("==================================================");
});

// Graceful Shutdown Handler
function handleGracefulShutdown(signal: string) {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  // Stop accepting new HTTP requests
  server.close(async () => {
    console.log("🔌 HTTP server closed. Draining connections...");

    try {
      await disconnectPrisma();
      console.log("🗄️ Database connections closed.");
      console.log("✅ Graceful shutdown completed cleanly.");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during database disconnect:", error);
      process.exit(1);
    }
  });

  // Force exit if connections fail to drain within 10 seconds
  setTimeout(() => {
    console.error("⚠️ Forcefully terminating process after 10s timeout.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));
process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));
