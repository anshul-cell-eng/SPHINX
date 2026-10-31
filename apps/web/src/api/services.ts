/**
 * @file services.ts
 * @module api/services
 * @description Production React Query hooks and type-safe API service bindings for FreelanceFlow backend.
 * Encapsulates client management, project sprints, persistent time tracking, invoice generation in paise,
 * proposal generation, AI draft outlines, analytics, and client portal operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, Currency, type ApiResponse } from "./client";

// ==========================================
// DATA CONTRACTS & INTERFACES
// ==========================================

export interface BackendClient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  address?: string;
  status: "ACTIVE" | "LEAD" | "INACTIVE";
  totalBilledPaise: number;
  outstandingPaise: number;
  currency: string;
  createdAt: string;
}

export interface BackendProject {
  id: string;
  title: string;
  clientId: string;
  clientName?: string;
  description: string;
  status: "PLANNING" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  budgetPaise: number;
  spentPaise: number;
  deadline?: string;
  progress: number;
  tasksCount?: number;
  completedTasksCount?: number;
  deliverables?: Array<{ id: string; title: string; status: "PENDING" | "SUBMITTED" | "APPROVED" }>;
}

export interface BackendTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "BACKLOG" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedMinutes?: number;
  loggedMinutes?: number;
}

export interface BackendTimeEntry {
  id: string;
  projectId: string;
  projectTitle?: string;
  description: string;
  durationSeconds: number;
  billable: boolean;
  ratePerHourPaise?: number;
  startedAt: string;
  stoppedAt?: string;
  isRunning?: boolean;
}

export interface BackendInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPricePaise: number;
  totalPaise: number;
}

export interface BackendInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName?: string;
  projectId?: string;
  items: BackendInvoiceItem[];
  subtotalPaise: number;
  taxPaise: number;
  totalPaise: number;
  status: "DRAFT" | "UNPAID" | "PAID" | "OVERDUE";
  dueDate: string;
  paymentUrl?: string;
  createdAt: string;
}

export interface BackendProposal {
  id: string;
  title: string;
  clientId: string;
  clientName?: string;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
  totalValuePaise: number;
  scopeSummary?: string;
  sections?: Array<{ title: string; content: string }>;
  pdfUrl?: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalEarningsPaise: number;
  pendingAmountPaise: number;
  overdueInvoicesCount: number;
  trackedHoursThisMonth: number;
  activeProjectsCount: number;
  activeClientsCount: number;
  revenueHistory: Array<{ month: string; amountPaise: number }>;
}

export interface PortalProjectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "freelancer" | "client";
  content: string;
  createdAt: string;
}

// ==========================================
// 1. CLIENT SERVICES
// ==========================================

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await apiClient.get<BackendClient[]>("/clients");
      return res.data;
    },
  });
};

export const useClientDetail = (clientId: string) => {
  return useQuery({
    queryKey: ["clients", clientId],
    queryFn: async () => {
      const res = await apiClient.get<BackendClient & { projects: BackendProject[]; invoices: BackendInvoice[] }>(
        `/clients/${clientId}`
      );
      return res.data;
    },
    enabled: !!clientId,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<BackendClient>) => {
      const res = await apiClient.post<BackendClient>("/clients", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useInviteToPortal = () => {
  return useMutation({
    mutationFn: async (clientId: string) => {
      const res = await apiClient.post<{ inviteUrl: string; emailSent: boolean }>(
        `/clients/${clientId}/invite-portal`
      );
      return res.data;
    },
  });
};

// ==========================================
// 2. PROJECT & TASK SERVICES
// ==========================================

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await apiClient.get<BackendProject[]>("/projects");
      return res.data;
    },
  });
};

export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: async () => {
      const res = await apiClient.get<BackendTask[]>(`/projects/${projectId}/tasks`);
      return res.data;
    },
    enabled: !!projectId,
  });
};

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Partial<BackendTask>) => {
      const res = await apiClient.post<BackendTask>(`/projects/${projectId}/tasks`, task);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateTaskStatus = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: BackendTask["status"] }) => {
      const res = await apiClient.patch<BackendTask>(`/projects/${projectId}/tasks/${taskId}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"] });
    },
  });
};

// ==========================================
// 3. PERSISTENT TIME TRACKER
// ==========================================

export const useRunningTimer = () => {
  return useQuery({
    queryKey: ["time", "running"],
    queryFn: async () => {
      const res = await apiClient.get<BackendTimeEntry | null>("/time/running");
      return res.data;
    },
    refetchInterval: 10000, // Poll every 10s for multi-device sync
  });
};

export const useStartTimeEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { projectId: string; description: string }) => {
      const res = await apiClient.post<BackendTimeEntry>("/time/start", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time", "running"] });
      queryClient.invalidateQueries({ queryKey: ["time", "entries"] });
    },
  });
};

export const useStopTimeEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (timeEntryId?: string) => {
      const res = await apiClient.post<BackendTimeEntry>("/time/stop", { timeEntryId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time", "running"] });
      queryClient.invalidateQueries({ queryKey: ["time", "entries"] });
    },
  });
};

export const useTimeEntries = () => {
  return useQuery({
    queryKey: ["time", "entries"],
    queryFn: async () => {
      const res = await apiClient.get<BackendTimeEntry[]>("/time/entries");
      return res.data;
    },
  });
};

// ==========================================
// 4. INVOICES & PAYMENT LINKS (PAISE MATH)
// ==========================================

export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await apiClient.get<BackendInvoice[]>("/invoices");
      return res.data;
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceData: Partial<BackendInvoice>) => {
      const res = await apiClient.post<BackendInvoice>("/invoices", invoiceData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useGeneratePaymentLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const res = await apiClient.post<{ paymentLink: string }>(`/invoices/${invoiceId}/payment-link`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useSendInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const res = await apiClient.post<{ sent: boolean; recipientEmail: string }>(`/invoices/${invoiceId}/send`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// ==========================================
// 5. PROPOSALS & AI OUTLINES
// ==========================================

export const useProposals = () => {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      const res = await apiClient.get<BackendProposal[]>("/proposals");
      return res.data;
    },
  });
};

export const useGenerateAiDraft = () => {
  return useMutation({
    mutationFn: async (params: { clientName: string; projectScope: string; budgetRupees: number }) => {
      const res = await apiClient.post<{ outline: string; deliverables: string[]; estimatedTimeline: string }>(
        "/proposals/ai-draft",
        {
          ...params,
          budgetPaise: Currency.toPaise(params.budgetRupees),
        }
      );
      return res.data;
    },
  });
};

// ==========================================
// 6. DASHBOARD & REVENUE SUMMARY
// ==========================================

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const res = await apiClient.get<DashboardSummary>("/dashboard/summary");
      return res.data;
    },
  });
};

// ==========================================
// 7. CLIENT PORTAL SERVICES (/portal/*)
// ==========================================

export const usePortalOverview = () => {
  return useQuery({
    queryKey: ["portal", "overview"],
    queryFn: async () => {
      const res = await apiClient.get<{
        projects: BackendProject[];
        invoices: BackendInvoice[];
        proposals: BackendProposal[];
      }>("/portal/overview");
      return res.data;
    },
  });
};

export const usePortalPayInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invoiceId, razorpayPaymentId }: { invoiceId: string; razorpayPaymentId: string }) => {
      const res = await apiClient.post<{ paid: boolean; transactionHash: string }>(
        `/portal/invoices/${invoiceId}/pay`,
        { razorpayPaymentId }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal", "overview"] });
    },
  });
};

export const usePortalSignProposal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ proposalId, signatureDataUrl }: { proposalId: string; signatureDataUrl: string }) => {
      const res = await apiClient.post<{ signed: boolean; contractId: string }>(
        `/portal/proposals/${proposalId}/sign`,
        { signatureDataUrl }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal", "overview"] });
    },
  });
};

export const usePortalProjectMessages = (projectId: string) => {
  return useQuery({
    queryKey: ["portal", "projects", projectId, "messages"],
    queryFn: async () => {
      const res = await apiClient.get<PortalProjectMessage[]>(`/portal/projects/${projectId}/messages`);
      return res.data;
    },
    enabled: !!projectId,
    refetchInterval: 3000, // Live real-time thread polling
  });
};

export const useSendPortalMessage = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await apiClient.post<PortalProjectMessage>(`/portal/projects/${projectId}/messages`, {
        content,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal", "projects", projectId, "messages"] });
    },
  });
};
