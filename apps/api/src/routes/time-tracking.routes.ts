import { Router } from "express";
import { z } from "zod";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore, type TimeEntryRecord } from "../lib/memory-store.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const timeTrackingRouter = Router();

timeTrackingRouter.use(authenticate);

const createEntrySchema = z.object({
  projectId: z.string().min(1),
  projectName: z.string().min(1),
  taskTitle: z.string().min(1),
  description: z.string().optional().default(""),
  durationSeconds: z.number().positive(),
  hourlyRate: z.number().default(4500),
  date: z.string().min(1),
});

const convertToInvoiceSchema = z.object({
  entryIds: z.array(z.string()).min(1),
  clientId: z.string().min(1),
});

// GET /api/v1/time-tracking
timeTrackingRouter.get("/", (req, res) => {
  const workspaceId = req.user!.workspaceId;
  const entries = memoryStore.timeEntries.filter((e) => e.workspaceId === workspaceId);
  ApiResponseHelper.success(res, "Time entries retrieved", entries);
});

// POST /api/v1/time-tracking
timeTrackingRouter.post("/", (req, res) => {
  const parse = createEntrySchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Validation error", "VALIDATION_ERROR", 400, parse.error.issues);
    return;
  }

  const workspaceId = req.user!.workspaceId;
  const newEntry: TimeEntryRecord = {
    id: `time-${Date.now()}`,
    workspaceId,
    ...parse.data,
    startTime: new Date().toISOString(),
    isBillable: true,
    isBilled: false,
  };

  memoryStore.timeEntries.unshift(newEntry);
  ApiResponseHelper.success(res, "Time session recorded", newEntry, 201);
});

// POST /api/v1/time-tracking/convert-to-invoice
timeTrackingRouter.post("/convert-to-invoice", (req, res) => {
  const parse = convertToInvoiceSchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Invalid payload", "VALIDATION_ERROR", 400);
    return;
  }

  const { entryIds, clientId } = parse.data;
  const workspaceId = req.user!.workspaceId;

  const entries = memoryStore.timeEntries.filter(
    (e) => e.workspaceId === workspaceId && entryIds.includes(e.id) && !e.isBilled
  );

  if (!entries.length) {
    ApiResponseHelper.error(res, "No unbilled time entries found for the given IDs", "NOT_FOUND", 404);
    return;
  }

  const client = memoryStore.clients.find((c) => c.id === clientId) || memoryStore.clients[0];

  const items = entries.map((e, idx) => ({
    id: `itm-${Date.now()}-${idx}`,
    description: `${e.projectName} — ${e.taskTitle} (${(e.durationSeconds / 3600).toFixed(2)} hrs @ ₹${e.hourlyRate}/hr)`,
    quantity: Number((e.durationSeconds / 3600).toFixed(2)),
    rate: e.hourlyRate,
    amount: Math.round((e.durationSeconds / 3600) * e.hourlyRate),
  }));

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = Math.round(subtotal * 0.18);
  const total = subtotal + taxAmount;
  const num = `INV-2026-${String(memoryStore.invoices.length + 1).padStart(3, "0")}`;

  const newInvoice = {
    id: `inv-${Date.now()}`,
    workspaceId,
    invoiceNumber: num,
    clientId: client.id,
    clientName: client.company,
    clientEmail: client.email,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    status: "UNPAID" as const,
    items,
    subtotal,
    taxRate: 18,
    taxAmount,
    discount: 0,
    total,
    currency: "INR",
    notes: "Generated from verified time tracking sessions.",
    createdAt: new Date().toISOString().split("T")[0],
  };

  memoryStore.invoices.unshift(newInvoice);

  // Mark entries as billed
  entries.forEach((e) => {
    e.isBilled = true;
    e.invoiceId = newInvoice.id;
  });

  ApiResponseHelper.success(res, "Invoice generated from billable time sessions", newInvoice, 201);
});
