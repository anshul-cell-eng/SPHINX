import { Router } from "express";
import { z } from "zod";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore, type ProposalRecord } from "../lib/memory-store.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const proposalsRouter = Router();

proposalsRouter.use(authenticate);

const createProposalSchema = z.object({
  title: z.string().min(2),
  clientId: z.string().min(1),
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  amount: z.number().positive(),
  validUntil: z.string().min(1),
  scope: z.string().min(5),
  deliverables: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      description: z.string(),
      amount: z.number(),
    })
  ).min(1),
  terms: z.string().min(5),
});

// GET /api/v1/proposals
proposalsRouter.get("/", (req, res) => {
  const workspaceId = req.user!.workspaceId;
  const proposals = memoryStore.proposals.filter((p) => p.workspaceId === workspaceId);
  ApiResponseHelper.success(res, "Proposals retrieved", proposals);
});

// POST /api/v1/proposals
proposalsRouter.post("/", (req, res) => {
  const parse = createProposalSchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Validation error", "VALIDATION_ERROR", 400, parse.error.issues);
    return;
  }

  const workspaceId = req.user!.workspaceId;
  const num = `PROP-2026-${String(memoryStore.proposals.length + 90).padStart(3, "0")}`;

  const newProp: ProposalRecord = {
    id: `prop-${Date.now()}`,
    workspaceId,
    proposalNumber: num,
    ...parse.data,
    deliverables: parse.data.deliverables.map((d, i) => ({
      id: d.id || `del-${Date.now()}-${i}`,
      title: d.title,
      description: d.description,
      amount: d.amount,
    })),
    status: "SENT",
    sentAt: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString().split("T")[0],
  };

  memoryStore.proposals.unshift(newProp);
  ApiResponseHelper.success(res, "Proposal created successfully", newProp, 201);
});

// PATCH /api/v1/proposals/:id/approve
proposalsRouter.patch("/:id/approve", (req, res) => {
  const { id } = req.params;
  const prop = memoryStore.proposals.find((p) => p.id === id);

  if (!prop) {
    ApiResponseHelper.error(res, "Proposal not found", "NOT_FOUND", 404);
    return;
  }

  // Cross-user IDOR check
  const isFreelancerOwner = req.user!.role === "FREELANCER" && prop.workspaceId === req.user!.workspaceId;
  const isClientRecipient = req.user!.role === "CLIENT" && prop.clientEmail.toLowerCase() === req.user!.email.toLowerCase();
  if (!isFreelancerOwner && !isClientRecipient) {
    ApiResponseHelper.error(res, "Forbidden: Unauthorized access to proposal", "FORBIDDEN", 403);
    return;
  }

  prop.status = "ACCEPTED";
  prop.acceptedAt = new Date().toISOString();

  ApiResponseHelper.success(res, "Proposal accepted", prop);
});

// PATCH /api/v1/proposals/:id/reject
proposalsRouter.patch("/:id/reject", (req, res) => {
  const { id } = req.params;
  const prop = memoryStore.proposals.find((p) => p.id === id);

  if (!prop) {
    ApiResponseHelper.error(res, "Proposal not found", "NOT_FOUND", 404);
    return;
  }

  // Cross-user IDOR check
  const isFreelancerOwner = req.user!.role === "FREELANCER" && prop.workspaceId === req.user!.workspaceId;
  const isClientRecipient = req.user!.role === "CLIENT" && prop.clientEmail.toLowerCase() === req.user!.email.toLowerCase();
  if (!isFreelancerOwner && !isClientRecipient) {
    ApiResponseHelper.error(res, "Forbidden: Unauthorized access to proposal", "FORBIDDEN", 403);
    return;
  }

  prop.status = "REJECTED";
  ApiResponseHelper.success(res, "Proposal rejected", prop);
});
