import mongoose, { Schema } from "mongoose";

// 1. User Schema
const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["FREELANCER", "CLIENT"], default: "FREELANCER" },
    company: { type: String, default: "" },
    avatar: { type: String, default: "" },
    hourlyRate: { type: Number, default: 4500 },
    taxId: { type: String, default: "" },
    upiId: { type: String, default: "" },
    workspaceId: { type: String, required: true, index: true },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

// 2. Client Schema
const ClientSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    workspaceId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    address: { type: String, default: "" },
    currency: { type: String, default: "INR" },
    taxId: { type: String, default: "" },
    status: { type: String, enum: ["ACTIVE", "LEAD", "INACTIVE"], default: "ACTIVE" },
    totalBilled: { type: Number, default: 0 },
    outstandingBalance: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    tags: { type: [String], default: [] },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

// 3. Project Schema
const ProjectSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    workspaceId: { type: String, required: true, index: true },
    clientId: { type: String, required: true, index: true },
    clientName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PLANNING", "IN_PROGRESS", "REVIEW", "COMPLETED"],
      default: "IN_PROGRESS",
    },
    priority: {
      type: String,
      enum: ["URGENT", "HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
    },
    budget: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    deadline: { type: String, default: "" },
    progress: { type: Number, default: 0 },
    tasksCount: { type: Number, default: 0 },
    completedTasksCount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

// 4. Task Schema
const TaskSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    workspaceId: { type: String, required: true, index: true },
    projectId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["BACKLOG", "IN_PROGRESS", "IN_REVIEW", "DONE"],
      default: "BACKLOG",
    },
    priority: {
      type: String,
      enum: ["URGENT", "HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
    },
    assignee: { type: String, default: "" },
    dueDate: { type: String, default: "" },
    estimatedHours: { type: Number, default: 0 },
    loggedHours: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 5. Proposal Schema
const ProposalSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    workspaceId: { type: String, required: true, index: true },
    clientId: { type: String, required: true, index: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    proposalNumber: { type: String, required: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "SENT", "ACCEPTED", "REJECTED"],
      default: "DRAFT",
    },
    amount: { type: Number, default: 0 },
    validUntil: { type: String, default: "" },
    scope: { type: String, default: "" },
    deliverables: { type: [Schema.Types.Mixed], default: [] },
    terms: { type: String, default: "" },
    sentAt: { type: String },
    acceptedAt: { type: String },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

// 6. Contract Schema
const ContractSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    workspaceId: { type: String, required: true, index: true },
    clientId: { type: String, required: true, index: true },
    clientName: { type: String, required: true },
    contractNumber: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["SERVICE_AGREEMENT", "NDA", "RETAINER", "IP_ASSIGNMENT"],
      default: "SERVICE_AGREEMENT",
    },
    status: {
      type: String,
      enum: ["DRAFT", "PENDING_SIGNATURE", "SIGNED", "EXPIRED"],
      default: "PENDING_SIGNATURE",
    },
    effectiveDate: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    content: { type: String, default: "" },
    signedByClient: { type: Boolean, default: false },
    signedByFreelancer: { type: Boolean, default: true },
    clientSignatureName: { type: String },
    clientSignatureDate: { type: String },
    freelancerSignatureName: { type: String },
    freelancerSignatureDate: { type: String },
    signatureHash: { type: String },
    ipAddress: { type: String },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

// 7. Invoice Schema
const InvoiceSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    workspaceId: { type: String, required: true, index: true },
    clientId: { type: String, required: true, index: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    invoiceNumber: { type: String, required: true },
    issueDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "UNPAID", "PAID", "OVERDUE"],
      default: "UNPAID",
    },
    items: { type: [Schema.Types.Mixed], default: [] },
    subtotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 18 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    paymentId: { type: String },
    paidAt: { type: String },
    notes: { type: String, default: "" },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

// 8. Payment Schema
const PaymentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    workspaceId: { type: String, required: true, index: true },
    paymentId: { type: String, required: true, index: true },
    invoiceId: { type: String, required: true, index: true },
    invoiceNumber: { type: String, required: true },
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    method: { type: String, enum: ["UPI", "CARD", "NETBANKING"], default: "UPI" },
    status: { type: String, enum: ["SUCCESS", "PENDING", "FAILED"], default: "SUCCESS" },
    transactionHash: { type: String, required: true },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    verifiedAt: { type: String, required: true },
    upiVpa: { type: String },
  },
  { timestamps: true }
);

// 9. Time Entry Schema
const TimeEntrySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    workspaceId: { type: String, required: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String, required: true },
    taskTitle: { type: String, required: true },
    description: { type: String, default: "" },
    startTime: { type: String, required: true },
    endTime: { type: String },
    durationSeconds: { type: Number, default: 0 },
    isBillable: { type: Boolean, default: true },
    hourlyRate: { type: Number, default: 4500 },
    isBilled: { type: Boolean, default: false },
    invoiceId: { type: String },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export const ClientModel = mongoose.models.Client || mongoose.model("Client", ClientSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export const TaskModel = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export const ProposalModel = mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);
export const ContractModel = mongoose.models.Contract || mongoose.model("Contract", ContractSchema);
export const InvoiceModel = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
export const PaymentModel = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export const TimeEntryModel = mongoose.models.TimeEntry || mongoose.model("TimeEntry", TimeEntrySchema);
