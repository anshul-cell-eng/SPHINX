import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { authRouter } from "./auth.routes.js";
import { clientsRouter } from "./clients.routes.js";
import { projectsRouter } from "./projects.routes.js";
import { tasksRouter } from "./tasks.routes.js";
import { proposalsRouter } from "./proposals.routes.js";
import { contractsRouter } from "./contracts.routes.js";
import { invoicesRouter } from "./invoices.routes.js";
import { paymentsRouter } from "./payments.routes.js";
import { timeTrackingRouter } from "./time-tracking.routes.js";
import { portalRouter } from "./portal.routes.js";
import { analyticsRouter } from "./analytics.routes.js";

export const apiV1Router = Router();

apiV1Router.use("/health", healthRouter);
apiV1Router.use("/auth", authRouter);
apiV1Router.use("/clients", clientsRouter);
apiV1Router.use("/projects", projectsRouter);
apiV1Router.use("/tasks", tasksRouter);
apiV1Router.use("/proposals", proposalsRouter);
apiV1Router.use("/contracts", contractsRouter);
apiV1Router.use("/invoices", invoicesRouter);
apiV1Router.use("/payments", paymentsRouter);
apiV1Router.use("/time-tracking", timeTrackingRouter);
apiV1Router.use("/time-entries", timeTrackingRouter);
apiV1Router.use("/portal", portalRouter);
apiV1Router.use("/analytics", analyticsRouter);
