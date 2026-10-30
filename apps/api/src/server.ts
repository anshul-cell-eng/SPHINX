import { app } from "./app.js";
import { env, effectivePort } from "./config/env.js";
import { connectDatabase, disconnectDatabase, getDatabaseStatus } from "./lib/database.js";
import { initDatabaseSync } from "./lib/persistence.js";

async function startServer() {
  // Connect to Database (with automatic graceful fallback)
  await connectDatabase();
  // Hydrate from MongoDB Atlas or seed baseline collections
  await initDatabaseSync();

  const server = app.listen(effectivePort, "0.0.0.0", () => {
    const dbStatus = getDatabaseStatus();
    console.log("==================================================");
    console.log(`🚀 FREELANCEOS Production Server running in [${env.NODE_ENV}] mode`);
    console.log(`📡 Listening on: 0.0.0.0:${effectivePort}`);
    console.log(`🩺 Health check: /health & /api/v1/health`);
    console.log(`🗄️ Database status: ${dbStatus.status} (${dbStatus.mode})`);
    console.log(`💳 Razorpay Integration: Active (Test Mode ID: ${env.RAZORPAY_KEY_ID})`);
    console.log("==================================================");
  });

  // Graceful Shutdown Handler
  function handleGracefulShutdown(signal: string) {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
      console.log("🔌 HTTP server closed. Draining connections...");
      try {
        await disconnectDatabase();
        console.log("✅ Graceful shutdown completed cleanly.");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
      }
    });

    setTimeout(() => {
      console.error("⚠️ Forcefully terminating process after 10s timeout.");
      process.exit(1);
    }, 10000).unref();
  }

  process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));
}

startServer().catch((err) => {
  console.error("❌ Fatal error starting server:", err);
  process.exit(1);
});
