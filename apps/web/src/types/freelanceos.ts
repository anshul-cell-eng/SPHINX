export type Currency = "INR" | "USD" | "EUR";

export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
export type ProjectPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export type TaskStatus = "BACKLOG" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export type ProposalStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";

export type ContractStatus = "DRAFT" | "PENDING_SIGNATURE" | "SIGNED" | "EXPIRED";
export type ContractType = "SERVICE_AGREEMENT" | "NDA" | "RETAINER" | "IP_ASSIGNMENT";

export type InvoiceStatus = "DRAFT" | "UNPAID" | "PAID" | "OVERDUE";

export type PaymentMethod = "UPI" | "CARD" | "NETBANKING" | "WALLET";
export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  currency: Currency;
  taxId: string;
  status: "ACTIVE" | "LEAD" | "INACTIVE";
  totalBilled: number;
  outstandingBalance: number;
  createdAt: string;
  notes: string;
  tags: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget: number;
  spent: number;
  deadline: string;
  progress: number;
  tasksCount: number;
  completedTasksCount: number;
  tags: string[];
  createdAt: string;
}

export interface ProposalItem {
  id: string;
  title: string;
  description: string;
  amount: number;
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  status: ProposalStatus;
  amount: number;
  validUntil: string;
  scope: string;
  deliverables: ProposalItem[];
  terms: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  type: ContractType;
  status: ContractStatus;
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

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // percentage e.g. 18
  taxAmount: number;
  discount: number;
  total: number;
  currency: Currency;
  paymentId?: string;
  paidAt?: string;
  notes: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  paymentId: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionHash: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  verifiedAt: string;
  upiVpa?: string;
}

export interface TimeEntry {
  id: string;
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "PAYMENT" | "INVOICE" | "PROJECT" | "PROPOSAL" | "CONTRACT" | "SYSTEM";
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface FreelancerProfile {
  name: string;
  email: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
  hourlyRate: number;
  currency: Currency;
  taxId: string;
  address: string;
  phone: string;
  upiId: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  bankAccount: string;
  bankIfsc: string;
  bankName: string;
}
