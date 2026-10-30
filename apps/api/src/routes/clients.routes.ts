import { Router } from "express";
import { z } from "zod";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore, type ClientRecord } from "../lib/memory-store.js";
import { persistEntity, removeEntity } from "../lib/persistence.js";
import { authenticate, requireFreelancer } from "../middleware/auth.middleware.js";

export const clientsRouter = Router();

// Apply auth to all client endpoints
clientsRouter.use(authenticate, requireFreelancer);

const createClientSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default("+91 98000 00000"),
  address: z.string().optional().default("Bengaluru, India"),
  currency: z.string().optional().default("INR"),
  taxId: z.string().optional().default("GSTIN29AAACA1234"),
  notes: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default(["Retainer"]),
});

// GET /api/v1/clients (Workspace isolated)
clientsRouter.get("/", (req, res) => {
  const workspaceId = req.user!.workspaceId;
  const clients = memoryStore.clients.filter((c) => c.workspaceId === workspaceId);
  ApiResponseHelper.success(res, "Clients retrieved successfully", clients);
});

// GET /api/v1/clients/:id (IDOR protected)
clientsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const workspaceId = req.user!.workspaceId;

  const client = memoryStore.clients.find((c) => c.id === id);
  if (!client) {
    ApiResponseHelper.error(res, "Client not found", "CLIENT_NOT_FOUND", 404);
    return;
  }

  // Cross-user access check
  if (client.workspaceId !== workspaceId) {
    ApiResponseHelper.error(res, "Forbidden: Access to this client is unauthorized", "FORBIDDEN", 403);
    return;
  }

  ApiResponseHelper.success(res, "Client details retrieved", client);
});

// POST /api/v1/clients
clientsRouter.post("/", async (req, res) => {
  const parse = createClientSchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Validation error", "VALIDATION_ERROR", 400, parse.error.issues);
    return;
  }

  const workspaceId = req.user!.workspaceId;
  const newClient: ClientRecord = {
    id: `cli-${Date.now()}`,
    workspaceId,
    ...parse.data,
    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=150`,
    status: "ACTIVE",
    totalBilled: 0,
    outstandingBalance: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };

  memoryStore.clients.unshift(newClient);
  await persistEntity("client", newClient);
  ApiResponseHelper.success(res, "Client created successfully", newClient, 201);
});

// PATCH /api/v1/clients/:id
clientsRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const workspaceId = req.user!.workspaceId;

  const index = memoryStore.clients.findIndex((c) => c.id === id);
  if (index === -1) {
    ApiResponseHelper.error(res, "Client not found", "CLIENT_NOT_FOUND", 404);
    return;
  }

  if (memoryStore.clients[index].workspaceId !== workspaceId) {
    ApiResponseHelper.error(res, "Forbidden", "FORBIDDEN", 403);
    return;
  }

  memoryStore.clients[index] = { ...memoryStore.clients[index], ...req.body };
  await persistEntity("client", memoryStore.clients[index]);
  ApiResponseHelper.success(res, "Client updated successfully", memoryStore.clients[index]);
});

// DELETE /api/v1/clients/:id
clientsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const workspaceId = req.user!.workspaceId;

  const client = memoryStore.clients.find((c) => c.id === id);
  if (!client) {
    ApiResponseHelper.error(res, "Client not found", "CLIENT_NOT_FOUND", 404);
    return;
  }

  if (client.workspaceId !== workspaceId) {
    ApiResponseHelper.error(res, "Forbidden", "FORBIDDEN", 403);
    return;
  }

  memoryStore.clients = memoryStore.clients.filter((c) => c.id !== id);
  await removeEntity("client", id);
  ApiResponseHelper.success(res, "Client deleted successfully", { id });
});
