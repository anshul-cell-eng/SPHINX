import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore, type ContractRecord } from "../lib/memory-store.js";
import { persistEntity } from "../lib/persistence.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const contractsRouter = Router();

contractsRouter.use(authenticate);

const createContractSchema = z.object({
  title: z.string().min(2),
  clientId: z.string().min(1),
  clientName: z.string().min(1),
  type: z.enum(["SERVICE_AGREEMENT", "NDA", "RETAINER", "IP_ASSIGNMENT"]).default("SERVICE_AGREEMENT"),
  amount: z.number().default(0),
  effectiveDate: z.string().min(1),
  content: z.string().min(10),
});

const signContractSchema = z.object({
  signerName: z.string().min(2),
  role: z.enum(["CLIENT", "FREELANCER"]),
});

// GET /api/v1/contracts
contractsRouter.get("/", (req, res) => {
  const workspaceId = req.user!.workspaceId;
  const contracts = memoryStore.contracts.filter((c) => c.workspaceId === workspaceId);
  ApiResponseHelper.success(res, "Contracts retrieved", contracts);
});

// POST /api/v1/contracts
contractsRouter.post("/", async (req, res) => {
  const parse = createContractSchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Validation error", "VALIDATION_ERROR", 400, parse.error.issues);
    return;
  }

  const workspaceId = req.user!.workspaceId;
  const num = `CNT-2026-${String(memoryStore.contracts.length + 43).padStart(3, "0")}`;

  const newContract: ContractRecord = {
    id: `cnt-${Date.now()}`,
    workspaceId,
    contractNumber: num,
    ...parse.data,
    status: "PENDING_SIGNATURE",
    signedByClient: false,
    signedByFreelancer: true,
    freelancerSignatureName: req.user!.email,
    freelancerSignatureDate: new Date().toISOString(),
    createdAt: new Date().toISOString().split("T")[0],
  };

  memoryStore.contracts.unshift(newContract);
  await persistEntity("contract", newContract);
  ApiResponseHelper.success(res, "Contract created", newContract, 201);
});

// POST /api/v1/contracts/:id/sign
contractsRouter.post("/:id/sign", async (req, res) => {
  const { id } = req.params;
  const parse = signContractSchema.safeParse(req.body);

  if (!parse.success) {
    ApiResponseHelper.error(res, "Validation error", "VALIDATION_ERROR", 400);
    return;
  }

  const contract = memoryStore.contracts.find((c) => c.id === id);
  if (!contract) {
    ApiResponseHelper.error(res, "Contract not found", "NOT_FOUND", 404);
    return;
  }

  // Multi-user IDOR check
  const isFreelancerOwner = req.user!.role === "FREELANCER" && contract.workspaceId === req.user!.workspaceId;
  const isClientSigner = req.user!.role === "CLIENT";
  if (!isFreelancerOwner && !isClientSigner) {
    ApiResponseHelper.error(res, "Forbidden: Unauthorized to sign this contract", "FORBIDDEN", 403);
    return;
  }

  const { signerName, role } = parse.data;
  const clientIp = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const timestamp = new Date().toISOString();

  // Generate 256-bit cryptographic seal over contract metadata, signer, and timestamp
  const payloadToHash = `${contract.contractNumber}|${contract.id}|${signerName}|${timestamp}|${clientIp}`;
  const signatureHash = "sha256:" + crypto.createHash("sha256").update(payloadToHash).digest("hex");

  if (role === "CLIENT") {
    contract.signedByClient = true;
    contract.clientSignatureName = signerName;
    contract.clientSignatureDate = timestamp;
    contract.status = "SIGNED";
    contract.signatureHash = signatureHash;
    contract.ipAddress = clientIp;
  } else {
    contract.signedByFreelancer = true;
    contract.freelancerSignatureName = signerName;
    contract.freelancerSignatureDate = timestamp;
  }

  await persistEntity("contract", contract);
  ApiResponseHelper.success(res, "Contract signed & sealed successfully", contract);
});
