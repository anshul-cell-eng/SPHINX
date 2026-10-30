import { Router } from "express";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore } from "../lib/memory-store.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const portalRouter = Router();

portalRouter.use(authenticate);

// Helper to determine the authorized clientId
function getAuthorizedClientId(req: any): string | null {
  // If user is a Client, find their client record matching their email
  if (req.user?.role === "CLIENT") {
    const client = memoryStore.clients.find(
      (c) => c.email.toLowerCase() === req.user?.email.toLowerCase()
    );
    return client ? client.id : null;
  }
  // If freelancer, allow viewing requested clientId if in their workspace
  const reqClientId = (req.query.clientId as string) || memoryStore.clients[0]?.id;
  const client = memoryStore.clients.find((c) => c.id === reqClientId && c.workspaceId === req.user?.workspaceId);
  return client ? client.id : null;
}

// GET /api/v1/portal/dashboard (Scoped strictly to the authenticated client)
portalRouter.get("/dashboard", (req, res) => {
  const clientId = getAuthorizedClientId(req);

  if (!clientId) {
    ApiResponseHelper.error(res, "Forbidden: No client profile linked to this account", "FORBIDDEN", 403);
    return;
  }

  const client = memoryStore.clients.find((c) => c.id === clientId);
  const projects = memoryStore.projects.filter((p) => p.clientId === clientId);
  const invoices = memoryStore.invoices.filter((i) => i.clientId === clientId);
  const proposals = memoryStore.proposals.filter((p) => p.clientId === clientId);
  const contracts = memoryStore.contracts.filter((c) => c.clientId === clientId);

  ApiResponseHelper.success(res, "Client portal data retrieved", {
    client,
    projects,
    invoices,
    proposals,
    contracts,
  });
});
