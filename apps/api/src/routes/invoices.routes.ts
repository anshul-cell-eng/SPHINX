import { Router } from "express";
import { z } from "zod";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore, type InvoiceRecord } from "../lib/memory-store.js";
import { persistEntity } from "../lib/persistence.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const invoicesRouter = Router();

invoicesRouter.use(authenticate);

const createInvoiceSchema = z.object({
  clientId: z.string().min(1),
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  dueDate: z.string().min(1),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().positive(),
      rate: z.number().positive(),
      amount: z.number(),
    })
  ).min(1),
  taxRate: z.number().default(18),
  discount: z.number().default(0),
  notes: z.string().optional().default("Payment due within 15 days via Razorpay or UPI QR code."),
});

// GET /api/v1/invoices
invoicesRouter.get("/", (req, res) => {
  const workspaceId = req.user!.workspaceId;
  const invoices = memoryStore.invoices.filter((i) => i.workspaceId === workspaceId);
  ApiResponseHelper.success(res, "Invoices retrieved", invoices);
});

// GET /api/v1/invoices/:id (IDOR protected)
invoicesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const workspaceId = req.user!.workspaceId;
  const inv = memoryStore.invoices.find((i) => i.id === id);

  if (!inv) {
    ApiResponseHelper.error(res, "Invoice not found", "NOT_FOUND", 404);
    return;
  }

  // Cross-user IDOR check
  if (inv.workspaceId !== req.user!.workspaceId) {
    ApiResponseHelper.error(res, "Forbidden: Unauthorized access to invoice reminder", "FORBIDDEN", 403);
    return;
  }

  if (inv.workspaceId !== workspaceId) {
    ApiResponseHelper.error(res, "Forbidden: Access to this invoice is unauthorized", "FORBIDDEN", 403);
    return;
  }

  ApiResponseHelper.success(res, "Invoice retrieved successfully", inv);
});

// POST /api/v1/invoices
invoicesRouter.post("/", async (req, res) => {
  const parse = createInvoiceSchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Validation error", "VALIDATION_ERROR", 400, parse.error.issues);
    return;
  }

  const workspaceId = req.user!.workspaceId;
  const data = parse.data;

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const taxAmount = Math.round((subtotal * data.taxRate) / 100);
  const total = subtotal + taxAmount - data.discount;

  const num = `INV-2026-${String(memoryStore.invoices.length + 1).padStart(3, "0")}`;

  const newInvoice: InvoiceRecord = {
    id: `inv-${Date.now()}`,
    workspaceId,
    invoiceNumber: num,
    clientId: data.clientId,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: data.dueDate,
    status: "UNPAID",
    items: data.items.map((item, idx) => ({ ...item, id: `itm-${Date.now()}-${idx}` })),
    subtotal,
    taxRate: data.taxRate,
    taxAmount,
    discount: data.discount,
    total,
    currency: "INR",
    notes: data.notes,
    createdAt: new Date().toISOString().split("T")[0],
  };

  memoryStore.invoices.unshift(newInvoice);
  await persistEntity("invoice", newInvoice);

  // Update client outstanding balance
  const client = memoryStore.clients.find((c) => c.id === data.clientId);
  if (client) {
    client.outstandingBalance += total;
    await persistEntity("client", client);
  }

  ApiResponseHelper.success(res, "Invoice created successfully", newInvoice, 201);
});

// POST /api/v1/invoices/:id/remind
invoicesRouter.post("/:id/remind", (req, res) => {
  const { id } = req.params;
  const inv = memoryStore.invoices.find((i) => i.id === id);

  if (!inv) {
    ApiResponseHelper.error(res, "Invoice not found", "NOT_FOUND", 404);
    return;
  }

  // Cross-user IDOR check
  if (inv.workspaceId !== req.user!.workspaceId) {
    ApiResponseHelper.error(res, "Forbidden: Unauthorized access to invoice reminder", "FORBIDDEN", 403);
    return;
  }

  // Record reminder notification
  memoryStore.notifications.unshift({
    id: `notif-${Date.now()}`,
    workspaceId: inv.workspaceId,
    title: "Reminder Dispatched",
    message: `Payment reminder sent to ${inv.clientName} for invoice ${inv.invoiceNumber}.`,
    type: "INVOICE",
    timestamp: "Just now",
    read: false,
  });

  ApiResponseHelper.success(res, "Payment reminder queued successfully", { invoiceNumber: inv.invoiceNumber });
});
