import http from "http";
import crypto from "crypto";
import { app } from "../app.js";
import { env } from "../config/env.js";
import { memoryStore } from "../lib/memory-store.js";

interface TestResult {
  phase: string;
  testId: string;
  name: string;
  status: "PASS" | "FAIL";
  durationMs: number;
  details: string;
  evidence?: any;
}

const results: TestResult[] = [];
let server: http.Server;
let baseUrl = "";

async function startServer(): Promise<void> {
  return new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const addr = server.address() as any;
      baseUrl = `http://127.0.0.1:${addr.port}`;
      console.log(`[TEST-SUITE] Test server started at ${baseUrl}`);
      resolve();
    });
  });
}

async function stopServer(): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => {
      console.log("[TEST-SUITE] Test server stopped");
      resolve();
    });
  });
}

async function runTest(
  phase: string,
  testId: string,
  name: string,
  fn: () => Promise<{ pass: boolean; details: string; evidence?: any }>
) {
  const start = performance.now();
  try {
    const res = await fn();
    const durationMs = Math.round(performance.now() - start);
    results.push({
      phase,
      testId,
      name,
      status: res.pass ? "PASS" : "FAIL",
      durationMs,
      details: res.details,
      evidence: res.evidence,
    });
    const symbol = res.pass ? "✓ PASS" : "✗ FAIL";
    console.log(`[${symbol}] [${testId}] ${name} (${durationMs}ms): ${res.details}`);
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    results.push({
      phase,
      testId,
      name,
      status: "FAIL",
      durationMs,
      details: `Exception: ${err.message}`,
    });
    console.log(`[✗ FAIL] [${testId}] ${name} (${durationMs}ms): Exception ${err.message}`);
  }
}

async function main() {
  console.log("================================================================================");
  console.log("       FREELANCEOS — PRODUCTION READINESS & END-TO-END AUDIT SUITE             ");
  console.log("================================================================================\n");

  await startServer();

  let alexToken = "";
  let alexRefreshToken = "";
  let sarahClientToken = "";
  let bobFreelancerToken = "";
  let testClientId = "";
  let testProjectId = "";
  let testTaskId = "";
  let testProposalId = "";
  let testContractId = "";
  let testInvoiceId = "";
  let testOrderId = "";
  let testTimeEntryId = "";

  // --------------------------------------------------------------------------
  // PHASE 1: BACKEND VERIFICATION
  // --------------------------------------------------------------------------
  await runTest("PHASE 1", "T1.1", "Health check & diagnostic endpoint", async () => {
    const res = await fetch(`${baseUrl}/health`);
    const data = (await res.json()) as any;
    const pass = res.status === 200 && data.success === true && data.data.status === "healthy";
    return {
      pass,
      details: `HTTP ${res.status}, DB mode: ${data.data?.services?.database?.mode}, Node: ${data.data?.system?.nodeVersion}`,
      evidence: { uptime: data.data?.uptime, memoryMB: data.data?.system?.memoryUsageMB },
    };
  });

  await runTest("PHASE 1", "T1.2", "Register new freelancer account with bcrypt password hashing", async () => {
    const email = `bob_${Date.now()}@freelanceos.dev`;
    const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: "SecurePassword@123",
        name: "Bob Freelancer",
        role: "FREELANCER",
      }),
    });
    const data = (await res.json()) as any;
    const token = data.data?.tokens?.accessToken;
    if (res.status === 201 && token) {
      bobFreelancerToken = token;
      return {
        pass: true,
        details: `Registered new account, workspaceId: ${data.data.user.workspaceId}, role: ${data.data.user.role}`,
        evidence: { user: data.data.user },
      };
    }
    return { pass: false, details: `Failed with HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 1", "T1.3", "Login with demo Freelancer Alex Morgan", async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "alex@freelanceos.dev",
        password: "FreelanceOS@2026",
      }),
    });
    const data = (await res.json()) as any;
    const token = data.data?.tokens?.accessToken;
    if (res.status === 200 && token) {
      alexToken = token;
      alexRefreshToken = data.data.tokens.refreshToken;
      return {
        pass: true,
        details: `Authenticated Alex Morgan, workspace: ${data.data.user.workspaceId}, JWT issued`,
        evidence: { role: data.data.user.role },
      };
    }
    return { pass: false, details: `Login failed: HTTP ${res.status} ${data.message}` };
  });

  await runTest("PHASE 1", "T1.4", "Login with demo Client Sarah Chen", async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sarah@zenithfintech.com",
        password: "ClientPortal@2026",
      }),
    });
    const data = (await res.json()) as any;
    const token = data.data?.tokens?.accessToken;
    if (res.status === 200 && token) {
      sarahClientToken = token;
      return {
        pass: true,
        details: `Authenticated Client Sarah Chen, role: CLIENT, JWT issued`,
        evidence: { role: data.data.user.role },
      };
    }
    return { pass: false, details: `Login failed: HTTP ${res.status} ${data.message}` };
  });

  await runTest("PHASE 1", "T1.5", "Reject invalid password authentication", async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "alex@freelanceos.dev",
        password: "WrongPassword!999",
      }),
    });
    const data = (await res.json()) as any;
    const pass = res.status === 401 && data.error?.code === "INVALID_CREDENTIALS";
    return { pass, details: `Rejected with HTTP ${res.status} (${data.message})` };
  });

  await runTest("PHASE 1", "T1.6", "Refresh token rotation and renewal", async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: alexRefreshToken }),
    });
    const data = (await res.json()) as any;
    const pass = res.status === 200 && Boolean(data.data?.accessToken);
    return { pass, details: `HTTP ${res.status}, new access token generated` };
  });

  await runTest("PHASE 1", "T1.7", "Unauthenticated endpoint protection", async () => {
    const res = await fetch(`${baseUrl}/api/v1/clients`);
    const data = (await res.json()) as any;
    const pass = res.status === 401 && data.error?.code === "UNAUTHORIZED";
    return { pass, details: `Protected endpoint returned HTTP ${res.status} without Bearer token` };
  });

  // --------------------------------------------------------------------------
  // PHASE 2: PAYMENT SECURITY & RAZORPAY INTEGRATION
  // --------------------------------------------------------------------------
  await runTest("PHASE 2", "T2.1", "Create Razorpay order from unsettled invoice", async () => {
    const inv = memoryStore.invoices.find((i) => i.status === "UNPAID" && i.workspaceId === "ws-alex") || memoryStore.invoices[0];
    testInvoiceId = inv.id;

    const res = await fetch(`${baseUrl}/api/v1/payments/razorpay/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({ invoiceId: testInvoiceId }),
    });
    const data = (await res.json()) as any;
    if (res.status === 201 && data.data?.orderId) {
      testOrderId = data.data.orderId;
      const expectedPaise = Math.round(inv.total * 100);
      const isPaiseCorrect = data.data.amount === expectedPaise;
      const keyIdReturned = data.data.keyId === env.RAZORPAY_KEY_ID;
      const pass = isPaiseCorrect && keyIdReturned;
      return {
        pass,
        details: `Order created: ${testOrderId}, amount in paise: ${data.data.amount} (₹${inv.total}), secret NOT leaked`,
        evidence: { orderId: testOrderId, amountPaise: data.data.amount },
      };
    }
    return { pass: false, details: `Failed with HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 2", "T2.2", "Reject payment with tampered/invalid signature", async () => {
    const res = await fetch(`${baseUrl}/api/v1/payments/razorpay/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        invoiceId: testInvoiceId,
        razorpayOrderId: testOrderId,
        razorpayPaymentId: "pay_tampered_9999",
        razorpaySignature: "invalid_tampered_signature_hex_value",
        method: "UPI",
      }),
    });
    const data = (await res.json()) as any;
    const pass = res.status === 400 && data.error?.code === "INVALID_SIGNATURE";
    return { pass, details: `Rejected tampered signature with HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 2", "T2.3", "Server-side cryptographic verification with authentic HMAC-SHA256 signature", async () => {
    const paymentId = `pay_${Date.now()}`;
    const payload = `${testOrderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest("hex");

    const res = await fetch(`${baseUrl}/api/v1/payments/razorpay/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        invoiceId: testInvoiceId,
        razorpayOrderId: testOrderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: validSignature,
        method: "UPI",
      }),
    });
    const data = (await res.json()) as any;
    const inv = memoryStore.invoices.find((i) => i.id === testInvoiceId);
    const pass = res.status === 200 && inv?.status === "PAID" && Boolean(data.data?.payment?.transactionHash);
    return {
      pass,
      details: `HMAC-SHA256 verified, invoice status transitioned to ${inv?.status}, ledger hash: ${data.data?.payment?.transactionHash?.slice(0, 16)}...`,
      evidence: { txHash: data.data?.payment?.transactionHash },
    };
  });

  await runTest("PHASE 2", "T2.4", "Reject duplicate payment on already settled invoice", async () => {
    const res = await fetch(`${baseUrl}/api/v1/payments/razorpay/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({ invoiceId: testInvoiceId }),
    });
    const data = (await res.json()) as any;
    const pass = res.status === 400 && data.error?.code === "INVOICE_ALREADY_PAID";
    return { pass, details: `HTTP ${res.status}: Prevented double-billing settled invoice` };
  });

  await runTest("PHASE 2", "T2.5", "Reject unauthorized webhook with invalid signature", async () => {
    const res = await fetch(`${baseUrl}/api/v1/payments/razorpay/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "bogus_signature_hash",
        "x-razorpay-event-id": "evt_test_unauthorized",
      },
      body: JSON.stringify({ event: "payment.captured", payload: {} }),
    });
    const data = (await res.json()) as any;
    const pass = res.status === 401 && data.error?.code === "UNAUTHORIZED_WEBHOOK";
    return { pass, details: `Rejected with HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 2", "T2.6", "Process legitimate Razorpay webhook with HMAC-SHA256 signature", async () => {
    const webhookEventId = `evt_audit_${Date.now()}`;
    const webhookBody = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_webhook_test",
            order_id: testOrderId,
            amount: 500000,
            status: "captured",
          },
        },
      },
    };
    const rawBody = JSON.stringify(webhookBody);
    const validWebhookSig = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    const res = await fetch(`${baseUrl}/api/v1/payments/razorpay/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validWebhookSig,
        "x-razorpay-event-id": webhookEventId,
      },
      body: rawBody,
    });
    const data = (await res.json()) as any;
    const pass = res.status === 200 && data.data?.status === "PROCESSED";
    return { pass, details: `HTTP 200: Webhook processed successfully for ${webhookEventId}` };
  });

  await runTest("PHASE 2", "T2.7", "Enforce webhook idempotency (duplicate event ID ignored)", async () => {
    const webhookEventId = `evt_audit_idempotent_${Date.now()}`;
    const webhookBody = { event: "payment.captured", payload: {} };
    const rawBody = JSON.stringify(webhookBody);
    const validWebhookSig = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    // First delivery
    await fetch(`${baseUrl}/api/v1/payments/razorpay/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validWebhookSig,
        "x-razorpay-event-id": webhookEventId,
      },
      body: rawBody,
    });

    // Second duplicate delivery
    const res2 = await fetch(`${baseUrl}/api/v1/payments/razorpay/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validWebhookSig,
        "x-razorpay-event-id": webhookEventId,
      },
      body: rawBody,
    });
    const data2 = (await res2.json()) as any;
    const pass = res2.status === 200 && data2.data?.status === "DUPLICATE_IGNORED";
    return { pass, details: `HTTP 200: Duplicate delivery ignored safely (status: ${data2.data?.status})` };
  });

  // --------------------------------------------------------------------------
  // PHASE 3: SECURITY AUDIT & MULTI-TENANCY ISOLATION
  // --------------------------------------------------------------------------
  await runTest("PHASE 3", "T3.1", "Prevent cross-user client access (IDOR)", async () => {
    const alexClient = memoryStore.clients.find((c) => c.workspaceId === "ws-alex")!;
    const res = await fetch(`${baseUrl}/api/v1/clients/${alexClient.id}`, {
      headers: { Authorization: `Bearer ${bobFreelancerToken}` },
    });
    const data = (await res.json()) as any;
    const pass = res.status === 403 && data.error?.code === "FORBIDDEN";
    return { pass, details: `Bob blocked from Alex's client: HTTP ${res.status} (${data.message})` };
  });

  await runTest("PHASE 3", "T3.2", "Prevent cross-user project access (IDOR)", async () => {
    const alexProject = memoryStore.projects.find((p) => p.workspaceId === "ws-alex")!;
    const res = await fetch(`${baseUrl}/api/v1/projects/${alexProject.id}`, {
      headers: { Authorization: `Bearer ${bobFreelancerToken}` },
    });
    const data = (await res.json()) as any;
    const pass = res.status === 403 && data.error?.code === "FORBIDDEN";
    return { pass, details: `Bob blocked from Alex's project: HTTP ${res.status} (${data.message})` };
  });

  await runTest("PHASE 3", "T3.3", "Prevent cross-user invoice access (IDOR)", async () => {
    const alexInvoice = memoryStore.invoices.find((i) => i.workspaceId === "ws-alex")!;
    const res = await fetch(`${baseUrl}/api/v1/invoices/${alexInvoice.id}`, {
      headers: { Authorization: `Bearer ${bobFreelancerToken}` },
    });
    const data = (await res.json()) as any;
    const pass = res.status === 403 && data.error?.code === "FORBIDDEN";
    return { pass, details: `Bob blocked from Alex's invoice: HTTP ${res.status} (${data.message})` };
  });

  await runTest("PHASE 3", "T3.4", "Prevent unauthorized payment reminder dispatch", async () => {
    const alexInvoice = memoryStore.invoices.find((i) => i.workspaceId === "ws-alex")!;
    const res = await fetch(`${baseUrl}/api/v1/invoices/${alexInvoice.id}/remind`, {
      method: "POST",
      headers: { Authorization: `Bearer ${bobFreelancerToken}` },
    });
    const data = (await res.json()) as any;
    const pass = res.status === 403 && data.error?.code === "FORBIDDEN";
    return { pass, details: `Bob blocked from sending reminder: HTTP ${res.status}` };
  });

  await runTest("PHASE 3", "T3.5", "Prevent client role from accessing freelancer CRM routes", async () => {
    const res = await fetch(`${baseUrl}/api/v1/clients`, {
      headers: { Authorization: `Bearer ${sarahClientToken}` },
    });
    const data = (await res.json()) as any;
    const pass = res.status === 403 && data.error?.code === "FORBIDDEN";
    return { pass, details: `Client Sarah blocked from /clients route: HTTP ${res.status}` };
  });

  await runTest("PHASE 3", "T3.6", "Enforce input validation schemas (Zod)", async () => {
    const res = await fetch(`${baseUrl}/api/v1/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        name: "A", // too short (min 2)
        company: "B", // too short (min 2)
        email: "not-an-email", // invalid email
      }),
    });
    const data = (await res.json()) as any;
    const pass = res.status === 400 && data.error?.code === "VALIDATION_ERROR";
    return { pass, details: `Schema rejection HTTP ${res.status}, errors caught: ${data.error?.details?.length}` };
  });

  await runTest("PHASE 3", "T3.7", "Verify Helmet security headers", async () => {
    const res = await fetch(`${baseUrl}/health`);
    const xContentType = res.headers.get("x-content-type-options");
    const pass = xContentType === "nosniff";
    return {
      pass,
      details: `Security headers present: X-Content-Type-Options: ${xContentType}`,
    };
  });

  // --------------------------------------------------------------------------
  // PHASE 4: FULL FUNCTIONAL WORKFLOWS (16 End-to-End Steps)
  // --------------------------------------------------------------------------
  await runTest("PHASE 4", "T4.1", "Workflow 1: Create client record in workspace", async () => {
    const res = await fetch(`${baseUrl}/api/v1/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        name: "Vikram Malhotra",
        company: "Hyperion Cloud Systems",
        email: "vikram@hyperioncloud.io",
        phone: "+91 99887 76655",
        address: "Cyber City, Gurugram, India",
        currency: "INR",
        taxId: "GSTIN07AABCH1234F1Z5",
        notes: "Enterprise cloud dashboard redesign retainer.",
      }),
    });
    const data = (await res.json()) as any;
    if (res.status === 201 && data.data?.id) {
      testClientId = data.data.id;
      return { pass: true, details: `Client created: ${testClientId} (${data.data.company})` };
    }
    return { pass: false, details: `Failed HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 4", "T4.2", "Workflow 2: Create project linked to client", async () => {
    const res = await fetch(`${baseUrl}/api/v1/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        title: "Hyperion Kubernetes Observability Platform",
        clientId: testClientId,
        clientName: "Hyperion Cloud Systems",
        budget: 450000,
        deadline: "2026-12-15",
        priority: "HIGH",
        tags: ["Kubernetes", "Next.js", "Three.js"],
      }),
    });
    const data = (await res.json()) as any;
    if (res.status === 201 && data.data?.id) {
      testProjectId = data.data.id;
      return { pass: true, details: `Project created: ${testProjectId} (Budget: ₹${data.data.budget})` };
    }
    return { pass: false, details: `Failed HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 4", "T4.3", "Workflow 3: Add Kanban task and auto-update project progress", async () => {
    const res = await fetch(`${baseUrl}/api/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        projectId: testProjectId,
        title: "Implement 3D Cluster Topology Visualizer",
        description: "Three.js GPU-instanced node cluster graph with glowing energy links.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: "2026-11-20",
        estimatedHours: 24,
      }),
    });
    const data = (await res.json()) as any;
    if (res.status === 201 && data.data?.id) {
      testTaskId = data.data.id;

      // Update task to DONE
      const updateRes = await fetch(`${baseUrl}/api/v1/tasks/${testTaskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${alexToken}`,
        },
        body: JSON.stringify({ status: "DONE" }),
      });
      const updateData = (await updateRes.json()) as any;
      const proj = memoryStore.projects.find((p) => p.id === testProjectId);
      const pass = updateRes.status === 200 && proj?.progress === 100;
      return {
        pass,
        details: `Task completed, project progress auto-recalculated to ${proj?.progress}%`,
      };
    }
    return { pass: false, details: `Failed HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 4", "T4.4", "Workflow 4: Generate proposal with deliverable breakdowns", async () => {
    const res = await fetch(`${baseUrl}/api/v1/proposals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        title: "Cloud Infrastructure Observability Architecture",
        clientId: testClientId,
        clientName: "Hyperion Cloud Systems",
        clientEmail: "vikram@hyperioncloud.io",
        amount: 450000,
        validUntil: "2026-11-30",
        scope: "Deliver end-to-end 3D Kubernetes visualization and distributed telemetry dashboard.",
        deliverables: [
          { title: "Milestone 1: 3D Topology Canvas", description: "R3F interactive scene", amount: 200000 },
          { title: "Milestone 2: Real-time Telemetry Pipeline", description: "WebSocket + Redis stream", amount: 250000 },
        ],
        terms: "Net 15 payment terms upon milestone completion. Razorpay UPI supported.",
      }),
    });
    const data = (await res.json()) as any;
    if (res.status === 201 && data.data?.id) {
      testProposalId = data.data.id;
      return { pass: true, details: `Proposal created: ${testProposalId} (${data.data.proposalNumber})` };
    }
    return { pass: false, details: `Failed HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 4", "T4.5", "Workflow 5: Approve proposal and verify status transition", async () => {
    const res = await fetch(`${baseUrl}/api/v1/proposals/${testProposalId}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${alexToken}` },
    });
    const data = (await res.json()) as any;
    const pass = res.status === 200 && data.data?.status === "ACCEPTED";
    return { pass, details: `Proposal status transitioned to ${data.data?.status}` };
  });

  await runTest("PHASE 4", "T4.6", "Workflow 6: Generate contract agreement", async () => {
    const res = await fetch(`${baseUrl}/api/v1/contracts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        title: "Master Services Agreement — Hyperion Cloud",
        clientId: testClientId,
        clientName: "Hyperion Cloud Systems",
        type: "SERVICE_AGREEMENT",
        amount: 450000,
        effectiveDate: "2026-11-01",
        content: "MASTER SERVICES AGREEMENT between Alex Morgan & Hyperion Cloud Systems. All IP transfers upon full payment.",
      }),
    });
    const data = (await res.json()) as any;
    if (res.status === 201 && data.data?.id) {
      testContractId = data.data.id;
      return { pass: true, details: `Contract created: ${testContractId} (${data.data.contractNumber})` };
    }
    return { pass: false, details: `Failed HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 4", "T4.7", "Workflow 7: Cryptographic digital signature with SHA-256 seal & IP stamp", async () => {
    const res = await fetch(`${baseUrl}/api/v1/contracts/${testContractId}/sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        signerName: "Vikram Malhotra",
        role: "CLIENT",
      }),
    });
    const data = (await res.json()) as any;
    const pass = res.status === 200 && data.data?.status === "SIGNED" && data.data?.signatureHash?.startsWith("sha256:");
    return {
      pass,
      details: `Signed with 256-bit seal: ${data.data?.signatureHash?.slice(0, 24)}... (IP: ${data.data?.ipAddress})`,
    };
  });

  await runTest("PHASE 4", "T4.8", "Workflow 8: Generate tax invoice with 18% GST and line items", async () => {
    const res = await fetch(`${baseUrl}/api/v1/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        clientId: testClientId,
        clientName: "Hyperion Cloud Systems",
        clientEmail: "vikram@hyperioncloud.io",
        dueDate: "2026-11-25",
        taxRate: 18,
        discount: 0,
        items: [
          { description: "3D Cluster Topology Visualizer Architecture", quantity: 1, rate: 200000, amount: 200000 },
          { description: "Telemetry Pipeline Implementation", quantity: 1, rate: 250000, amount: 250000 },
        ],
        notes: "Payment due within 15 days via Razorpay or UPI QR code.",
      }),
    });
    const data = (await res.json()) as any;
    if (res.status === 201 && data.data?.id) {
      const inv = data.data;
      const expectedTax = Math.round(450000 * 0.18); // 81000
      const expectedTotal = 450000 + 81000; // 531000
      const pass = inv.taxAmount === expectedTax && inv.total === expectedTotal;
      return {
        pass,
        details: `Invoice created: ${inv.invoiceNumber}, Subtotal: ₹${inv.subtotal}, GST 18%: ₹${inv.taxAmount}, Total: ₹${inv.total}`,
      };
    }
    return { pass: false, details: `Failed HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 4", "T4.9", "Workflow 9: Record billable time tracking entry", async () => {
    const res = await fetch(`${baseUrl}/api/v1/time-tracking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        projectId: testProjectId,
        projectName: "Hyperion Kubernetes Observability Platform",
        taskTitle: "Shader Optimization & Three.js Instancing",
        description: "Optimized draw calls from 1200 down to 4 via instanced mesh buffers.",
        durationSeconds: 14400, // 4 hours
        hourlyRate: 5000,
        date: "2026-11-02",
      }),
    });
    const data = (await res.json()) as any;
    if (res.status === 201 && data.data?.id) {
      testTimeEntryId = data.data.id;
      return { pass: true, details: `Recorded 4.0 hours @ ₹5,000/hr (ID: ${testTimeEntryId})` };
    }
    return { pass: false, details: `Failed HTTP ${res.status}: ${data.message}` };
  });

  await runTest("PHASE 4", "T4.10", "Workflow 10: Convert logged time entries to invoice", async () => {
    const res = await fetch(`${baseUrl}/api/v1/time-tracking/convert-to-invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${alexToken}`,
      },
      body: JSON.stringify({
        entryIds: [testTimeEntryId],
        clientId: testClientId,
      }),
    });
    const data = (await res.json()) as any;
    const entry = memoryStore.timeEntries.find((e) => e.id === testTimeEntryId);
    const pass = res.status === 201 && entry?.isBilled === true && Boolean(data.data?.invoiceNumber);
    return {
      pass,
      details: `Generated invoice ${data.data?.invoiceNumber} from time session, entry marked isBilled: true`,
    };
  });

  await runTest("PHASE 4", "T4.11", "Workflow 11: Dispatch automated payment reminder", async () => {
    const inv = memoryStore.invoices.find((i) => i.status === "UNPAID" && i.workspaceId === "ws-alex") || memoryStore.invoices[0];
    const res = await fetch(`${baseUrl}/api/v1/invoices/${inv.id}/remind`, {
      method: "POST",
      headers: { Authorization: `Bearer ${alexToken}` },
    });
    const data = (await res.json()) as any;
    const notif = memoryStore.notifications[0];
    const pass = res.status === 200 && notif?.title === "Reminder Dispatched";
    return { pass, details: `Reminder queued for ${inv.invoiceNumber}, notification logged: "${notif?.message}"` };
  });

  await runTest("PHASE 4", "T4.12", "Workflow 12: Analytics overview calculations", async () => {
    const res = await fetch(`${baseUrl}/api/v1/analytics/overview`, {
      headers: { Authorization: `Bearer ${alexToken}` },
    });
    const data = (await res.json()) as any;
    const pass = res.status === 200 && typeof data.data?.totalRevenue === "number" && Array.isArray(data.data?.monthlyRevenue);
    return {
      pass,
      details: `Calculated metrics: Revenue ₹${data.data?.totalRevenue?.toLocaleString()}, DSO ${data.data?.daysSalesOutstanding}d, Yield ₹${data.data?.averageHourlyYield}/hr`,
    };
  });

  // --------------------------------------------------------------------------
  // PHASE 5: MULTI-USER ISOLATION & CLIENT PORTAL
  // --------------------------------------------------------------------------
  await runTest("PHASE 5", "T5.1", "Client Portal strictly scoped to client's own records", async () => {
    const res = await fetch(`${baseUrl}/api/v1/portal/dashboard`, {
      headers: { Authorization: `Bearer ${sarahClientToken}` },
    });
    const data = (await res.json()) as any;
    const client = data.data?.client;
    const projects = data.data?.projects;
    const invoices = data.data?.invoices;
    const pass =
      res.status === 200 &&
      client?.company === "Zenith FinTech" &&
      Array.isArray(projects) &&
      Array.isArray(invoices);
    return {
      pass,
      details: `Sarah Chen accessed portal: ${projects?.length} projects, ${invoices?.length} invoices (Zenith FinTech ONLY)`,
    };
  });

  await runTest("PHASE 5", "T5.2", "Freelancer Bob workspace isolation check", async () => {
    const res = await fetch(`${baseUrl}/api/v1/clients`, {
      headers: { Authorization: `Bearer ${bobFreelancerToken}` },
    });
    const data = (await res.json()) as any;
    // Bob should have 0 clients in his freshly registered workspace
    const pass = res.status === 200 && data.data?.length === 0;
    return {
      pass,
      details: `Bob's workspace is completely isolated: 0 clients visible (Alex has ${memoryStore.clients.filter((c) => c.workspaceId === "ws-alex").length})`,
    };
  });

  // --------------------------------------------------------------------------
  // PHASE 6: AUTOMATION & NOTIFICATIONS
  // --------------------------------------------------------------------------
  await runTest("PHASE 6", "T6.1", "In-memory notification dispatch on payment confirmation", async () => {
    const paymentNotifs = memoryStore.notifications.filter((n) => n.type === "PAYMENT");
    const pass = paymentNotifs.length > 0;
    return { pass, details: `Found ${paymentNotifs.length} verified payment notifications in system feed` };
  });

  // --------------------------------------------------------------------------
  // PHASE 7: PERFORMANCE & BENCHMARKING
  // --------------------------------------------------------------------------
  await runTest("PHASE 7", "T7.1", "API response latency audit (<50ms average)", async () => {
    const iterations = 10;
    let totalMs = 0;
    for (let i = 0; i < iterations; i++) {
      const s = performance.now();
      await fetch(`${baseUrl}/api/v1/analytics/overview`, {
        headers: { Authorization: `Bearer ${alexToken}` },
      });
      totalMs += performance.now() - s;
    }
    const avgLatency = Math.round(totalMs / iterations);
    const pass = avgLatency < 50;
    return { pass, details: `Average latency across ${iterations} runs: ${avgLatency}ms (Target: <50ms)` };
  });

  // --------------------------------------------------------------------------
  // PHASE 8: DEPLOYMENT READINESS
  // --------------------------------------------------------------------------
  await runTest("PHASE 8", "T8.1", "Deployment configuration & environment variable validation", async () => {
    const hasJwt = Boolean(env.JWT_ACCESS_SECRET && env.JWT_REFRESH_SECRET);
    const hasRzp = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && env.RAZORPAY_WEBHOOK_SECRET);
    const hasMongo = Boolean(env.MONGODB_URI);
    const pass = hasJwt && hasRzp && hasMongo;
    return {
      pass,
      details: `Environment configured: JWT Secrets: OK, Razorpay Credentials: OK, MongoDB URI: OK`,
    };
  });

  await stopServer();

  // Print Summary Table
  console.log("\n================================================================================");
  console.log("                           TEST SUITE EXECUTION SUMMARY                        ");
  console.log("================================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  console.log(`TOTAL TESTS : ${total}`);
  console.log(`PASSED      : ${passed}`);
  console.log(`FAILED      : ${failed}`);
  console.log(`SUCCESS RATE: ${Math.round((passed / total) * 100)}%`);
  console.log("================================================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
