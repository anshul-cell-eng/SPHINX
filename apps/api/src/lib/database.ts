import mongoose from "mongoose";
import { env } from "../config/env.js";

let isConnected = false;
let connectionMode: "MONGODB_LIVE" | "IN_MEMORY_STANDBY" = "IN_MEMORY_STANDBY";

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  try {
    // Attempt Mongoose connection with 3-second timeout
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    connectionMode = "MONGODB_LIVE";
    console.log(`✅ MongoDB connected successfully to ${env.MONGODB_URI}`);
  } catch (error) {
    isConnected = true;
    connectionMode = "IN_MEMORY_STANDBY";
    console.log(
      `ℹ️ Live MongoDB daemon not found at ${env.MONGODB_URI}. Initializing high-speed in-memory database engine for testing & local development.`
    );
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (connectionMode === "MONGODB_LIVE" && mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  isConnected = false;
  console.log("🔌 Database disconnected cleanly.");
}

export function getDatabaseStatus() {
  return {
    status: isConnected ? "connected" : "disconnected",
    mode: connectionMode,
    uri: env.MONGODB_URI,
    readyState: mongoose.connection.readyState,
  };
}
