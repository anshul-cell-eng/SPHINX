import { Router } from "express";
import { healthRouter } from "./health.routes.js";

export const apiV1Router = Router();

// Mount Health Check endpoint at /health
apiV1Router.use("/health", healthRouter);
