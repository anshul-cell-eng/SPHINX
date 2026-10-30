import bcrypt from "bcryptjs";

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "FREELANCER" | "CLIENT";
  company: string;
  avatar: string;
  hourlyRate: number;
  taxId: string;
  upiId: string;
  workspaceId: string;
  createdAt: string;
}

export interface ClientRecord {
  id: string;
  workspaceId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  currency: string;
  taxId: string;
  status: "ACTIVE" | "LEAD" | "INACTIVE";
  totalBilled: number;
  outstandingBalance: number;
  notes: string;
  tags: string[];
  createdAt: string;
}

export interface ProjectRecord {
  id: string;
  workspaceId: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  status: "PLANNING" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  budget: number;
  spent: number;
  deadline: string;
  progress: number;
  tasksCount: number;
  completedTasksCount: number;
  tags: string[];
  createdAt: string;
}

export interface TaskRecord {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string;
  status: "BACKLOG" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
}

export interface ProposalRecord {
  id: string;
  workspaceId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  proposalNumber: string;
  title: string;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
  amount: number;
  validUntil: string;
  scope: string;
  deliverables: Array<{ id: string; title: string; description: string; amount: number }>;
  terms: string;
  sentAt?: string;
  acceptedAt?: string;
  createdAt: string;
}

export interface ContractRecord {
  id: string;
  workspaceId: string;
  clientId: string;
  clientName: string;
  contractNumber: string;
  title: string;
  type: "SERVICE_AGREEMENT" | "NDA" | "RETAINER" | "IP_ASSIGNMENT";
  status: "DRAFT" | "PENDING_SIGNATURE" | "SIGNED" | "EXPIRED";
  effectiveDate: string;
  amount: number;
  content: string;
  signedByClient: boolean;
  signedByFreelancer: boolean;
  clientSignatureName?: string;
  clientSignatureDate?: string;
  freelancerSignatureName?: string;
  freelancerSignatureDate?: string;
  signatureHash?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface InvoiceRecord {
  id: string;
  workspaceId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: "DRAFT" | "UNPAID" | "PAID" | "OVERDUE";
  items: Array<{ id: string; description: string; quantity: number; rate: number; amount: number }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  paymentId?: string;
  paidAt?: string;
  notes: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  workspaceId: string;
  paymentId: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  method: "UPI" | "CARD" | "NETBANKING";
  status: "SUCCESS" | "PENDING" | "FAILED";
  transactionHash: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  verifiedAt: string;
  upiVpa?: string;
}

export interface TimeEntryRecord {
  id: string;
  workspaceId: string;
  projectId: string;
  projectName: string;
  taskTitle: string;
  description: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  isBillable: boolean;
  hourlyRate: number;
  isBilled: boolean;
  invoiceId?: string;
  date: string;
}

export interface NotificationRecord {
  id: string;
  workspaceId: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

// Seed password hashes for demo accounts
const DEMO_PASSWORD_HASH = bcrypt.hashSync("password123", 10);
const FREELANCEOS_HASH = bcrypt.hashSync("FreelanceOS@2026", 10);
const CLIENT_PORTAL_HASH = bcrypt.hashSync("ClientPortal@2026", 10);

class MemoryStore {
  users: UserRecord[] = [
    {
      id: "usr-freelancer-1",
      email: "alex@freelanceos.dev",
      passwordHash: FREELANCEOS_HASH,
      name: "Alex Morgan",
      role: "FREELANCER",
      company: "Apex Design Systems",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      hourlyRate: 4500,
      taxId: "27AADCA1234F1Z8",
      upiId: "alex.apex@okhdfcbank",
      workspaceId: "ws-alex",
      createdAt: "2026-08-01",
    },
    {
      id: "usr-freelancer-alias",
      email: "alex@freelanceos.studio",
      passwordHash: DEMO_PASSWORD_HASH,
      name: "Alex Morgan",
      role: "FREELANCER",
      company: "Apex Design Systems",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      hourlyRate: 4500,
      taxId: "27AADCA1234F1Z8",
      upiId: "alex.apex@okhdfcbank",
      workspaceId: "ws-alex",
      createdAt: "2026-08-01",
    },
    {
      id: "usr-client-1",
      email: "sarah@zenithfintech.com",
      passwordHash: CLIENT_PORTAL_HASH,
      name: "Sarah Chen",
      role: "CLIENT",
      company: "Zenith FinTech",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      hourlyRate: 0,
      taxId: "GSTIN27AABCT1234",
      upiId: "sarah.zenith@icici",
      workspaceId: "ws-alex", // belongs to Alex's workspace as client
      createdAt: "2026-08-15",
    },
    {
      id: "usr-client-alias",
      email: "sarah@novastudios.design",
      passwordHash: DEMO_PASSWORD_HASH,
      name: "Sarah Chen",
      role: "CLIENT",
      company: "Nova Studios Inc",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      hourlyRate: 0,
      taxId: "GSTIN27AABCT1234",
      upiId: "sarah.nova@icici",
      workspaceId: "ws-alex",
      createdAt: "2026-08-15",
    },
  ];

  clients: ClientRecord[] = [
    {
      id: "cli-1",
      workspaceId: "ws-alex",
      name: "Sarah Chen",
      company: "Zenith FinTech",
      email: "sarah@zenithfintech.com",
      phone: "+91 98200 11223",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      address: "742 Innovation Way, Austin, TX",
      currency: "INR",
      taxId: "GSTIN27AABCT1234",
      status: "ACTIVE",
      totalBilled: 125000,
      outstandingBalance: 0,
      notes: "Top enterprise client. Monthly design systems retainer.",
      tags: ["Design System", "Enterprise", "Retainer"],
      createdAt: "2026-08-15",
    },
    {
      id: "cli-2",
      workspaceId: "ws-alex",
      name: "Marcus Vance",
      company: "Aether Labs",
      email: "marcus@aetherlabs.ai",
      phone: "+91 97110 33445",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      address: "450 Mission St, San Francisco, CA",
      currency: "INR",
      taxId: "GSTIN29AABCA5678",
      status: "ACTIVE",
      totalBilled: 75000,
      outstandingBalance: 35000,
      notes: "AI copilot 3D visual frontend. High growth startup.",
      tags: ["Three.js", "AI", "Fixed Bid"],
      createdAt: "2026-09-02",
    },
  ];

  projects: ProjectRecord[] = [
    {
      id: "proj-1",
      workspaceId: "ws-alex",
      clientId: "cli-1",
      clientName: "Nova Studios Inc",
      title: "Nova Design System v3.0",
      description: "Enterprise Figma-to-React component library with strict tokens and WCAG AAA compliance.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      budget: 150000,
      spent: 95000,
      deadline: "2026-11-20",
      progress: 78,
      tasksCount: 4,
      completedTasksCount: 3,
      tags: ["Design System", "React", "Tokens"],
      createdAt: "2026-09-01",
    },
  ];

  tasks: TaskRecord[] = [
    {
      id: "tsk-1",
      workspaceId: "ws-alex",
      projectId: "proj-1",
      title: "Figma Tokens Sync Pipeline",
      description: "Automate token export from Figma Variables directly to Tailwind theme config via GitHub Actions.",
      status: "DONE",
      priority: "HIGH",
      assignee: "Alex Morgan",
      dueDate: "2026-10-15",
      estimatedHours: 8,
      loggedHours: 7.5,
    },
  ];

  proposals: ProposalRecord[] = [
    {
      id: "prop-1",
      workspaceId: "ws-alex",
      proposalNumber: "PROP-2026-089",
      title: "Enterprise Design System & UI Architecture",
      clientId: "cli-1",
      clientName: "Nova Studios Inc",
      clientEmail: "sarah@novastudios.design",
      status: "ACCEPTED",
      amount: 150000,
      validUntil: "2026-11-15",
      scope: "Architect and deliver a multi-brand React design system.",
      deliverables: [
        { id: "del-1", title: "Figma Token Architecture", description: "Variables taxonomy", amount: 35000 },
        { id: "del-2", title: "Core Component Library", description: "40+ primitives", amount: 115000 },
      ],
      terms: "50% upfront deposit. Net 15.",
      sentAt: "2026-08-28",
      acceptedAt: "2026-08-30",
      createdAt: "2026-08-25",
    },
  ];

  contracts: ContractRecord[] = [
    {
      id: "cnt-1",
      workspaceId: "ws-alex",
      contractNumber: "CNT-2026-042",
      title: "Master Services Agreement (MSA)",
      clientId: "cli-1",
      clientName: "Nova Studios Inc",
      type: "SERVICE_AGREEMENT",
      status: "SIGNED",
      effectiveDate: "2026-09-01",
      amount: 150000,
      content: "MASTER SERVICES AGREEMENT\n\nParties: Apex Design Systems & Nova Studios Inc.",
      signedByClient: true,
      signedByFreelancer: true,
      clientSignatureName: "Sarah Chen",
      clientSignatureDate: "2026-09-01T14:32:00Z",
      freelancerSignatureName: "Alex Morgan",
      freelancerSignatureDate: "2026-09-01T15:10:00Z",
      signatureHash: "sha256:8f4c2e9b01a76d3e521098bcaf8934df721869e5d4cb0912a7e430ef812bc129",
      ipAddress: "157.240.198.35",
      createdAt: "2026-08-30",
    },
  ];

  invoices: InvoiceRecord[] = [
    {
      id: "inv-1",
      workspaceId: "ws-alex",
      invoiceNumber: "INV-2026-001",
      clientId: "cli-1",
      clientName: "Nova Studios Inc",
      clientEmail: "sarah@novastudios.design",
      issueDate: "2026-09-05",
      dueDate: "2026-09-20",
      status: "PAID",
      items: [
        { id: "itm-1", description: "Milestone 1: Design Tokens CI", quantity: 1, rate: 50000, amount: 50000 },
      ],
      subtotal: 50000,
      taxRate: 18,
      taxAmount: 9000,
      discount: 0,
      total: 59000,
      currency: "INR",
      paymentId: "pay-101",
      paidAt: "2026-09-18T16:20:00Z",
      notes: "Paid via Razorpay UPI.",
      createdAt: "2026-09-05",
    },
    {
      id: "inv-2",
      workspaceId: "ws-alex",
      invoiceNumber: "INV-2026-002",
      clientId: "cli-2",
      clientName: "Aether Labs",
      clientEmail: "marcus@aetherlabs.ai",
      issueDate: "2026-10-15",
      dueDate: "2026-10-30",
      status: "UNPAID",
      items: [
        { id: "itm-2", description: "Three.js 3D Core Milestone", quantity: 1, rate: 35000, amount: 35000 },
      ],
      subtotal: 35000,
      taxRate: 18,
      taxAmount: 6300,
      discount: 0,
      total: 41300,
      currency: "INR",
      notes: "Milestone 2 deliverable approved.",
      createdAt: "2026-10-15",
    },
  ];

  payments: PaymentRecord[] = [
    {
      id: "pay-101",
      workspaceId: "ws-alex",
      paymentId: "PAY_RZP_99182341",
      invoiceId: "inv-1",
      invoiceNumber: "INV-2026-001",
      clientId: "cli-1",
      clientName: "Nova Studios Inc",
      amount: 59000,
      currency: "INR",
      method: "UPI",
      status: "SUCCESS",
      transactionHash: "tx_0x9b3f4a187e2d90bc314a8e23f01b98a27d1109a1",
      razorpayOrderId: "order_K7xM91jQ20lp",
      razorpayPaymentId: "pay_K7xMaL009vWz",
      verifiedAt: "2026-09-18T16:20:00Z",
      upiVpa: "sarah.nova@icici",
    },
  ];

  timeEntries: TimeEntryRecord[] = [
    {
      id: "time-1",
      workspaceId: "ws-alex",
      projectId: "proj-1",
      projectName: "Nova Design System v3.0",
      taskTitle: "Accessible Modal Dialog System",
      description: "Keyboard trap focus logic.",
      startTime: "2026-10-30T09:00:00Z",
      endTime: "2026-10-30T11:45:00Z",
      durationSeconds: 9900,
      isBillable: true,
      hourlyRate: 4500,
      isBilled: false,
      date: "2026-10-30",
    },
  ];

  notifications: NotificationRecord[] = [
    {
      id: "notif-1",
      workspaceId: "ws-alex",
      title: "System Ready",
      message: "FREELANCEOS platform core online.",
      type: "SYSTEM",
      timestamp: "Just now",
      read: false,
    },
  ];

  // Processed webhook event IDs for idempotency
  processedWebhooks: Set<string> = new Set();
}

export const memoryStore = new MemoryStore();
