import { useSyncExternalStore } from "react";
import type {
  Client,
  Project,
  Task,
  Proposal,
  Contract,
  Invoice,
  PaymentTransaction,
  TimeEntry,
  AppNotification,
  FreelancerProfile,
  Currency,
  TaskStatus,
} from "../types/freelanceos";

const STORAGE_KEY = "freelanceos_v1_store";

export interface ActiveTimer {
  isRunning: boolean;
  projectId: string;
  projectName: string;
  taskTitle: string;
  startTime: number | null; // Date.now()
  elapsedSeconds: number;
}

export interface FreelanceOSState {
  profile: FreelancerProfile;
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  proposals: Proposal[];
  contracts: Contract[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
  timeEntries: TimeEntry[];
  notifications: AppNotification[];
  activeTimer: ActiveTimer;
  currency: Currency;
  activeRole: "FREELANCER" | "CLIENT";
  activeClientId?: string; // used when viewing as a client
}

const INITIAL_PROFILE: FreelancerProfile = {
  name: "Alex Morgan",
  email: "alex@freelanceos.studio",
  title: "Principal Product Designer & Full-Stack Engineer",
  company: "Apex Design Systems",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  bio: "Designing and building high-performance fintech SaaS, 3D web applications, and venture-scale design systems.",
  hourlyRate: 4500, // INR
  currency: "INR",
  taxId: "27AADCA1234F1Z8", // GSTIN
  address: "Studio 4B, Cyber City, Indiranagar, Bengaluru, KA 560038",
  phone: "+91 98765 43210",
  upiId: "alex.apex@okhdfcbank",
  razorpayKeyId: "rzp_test_9kM38Lp0QxWv12",
  razorpayKeySecret: "sec_test_7f920da8e14b",
  bankAccount: "918237465012",
  bankIfsc: "HDFC0001234",
  bankName: "HDFC Bank Ltd",
};

const INITIAL_CLIENTS: Client[] = [
  {
    id: "cli-1",
    name: "Sarah Chen",
    company: "Nova Studios Inc",
    email: "sarah@novastudios.design",
    phone: "+91 98200 11223",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    address: "742 Innovation Way, Austin, TX",
    currency: "INR",
    taxId: "GSTIN27AABCT1234",
    status: "ACTIVE",
    totalBilled: 125000,
    outstandingBalance: 0,
    createdAt: "2026-08-15",
    notes: "Top enterprise client. Monthly design systems retainer.",
    tags: ["Design System", "Enterprise", "Retainer"],
  },
  {
    id: "cli-2",
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
    createdAt: "2026-09-02",
    notes: "AI copilot 3D visual frontend. High growth startup.",
    tags: ["Three.js", "AI", "Fixed Bid"],
  },
  {
    id: "cli-3",
    name: "Priya Sharma",
    company: "Zenith FinTech",
    email: "priya@zenithfin.io",
    phone: "+91 99880 55667",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    address: "BKC Complex, Bandra East, Mumbai, MH",
    currency: "INR",
    taxId: "GSTIN27AABCZ9988",
    status: "ACTIVE",
    totalBilled: 50000,
    outstandingBalance: 0,
    createdAt: "2026-09-20",
    notes: "Wealth dashboard redesign. Razorpay UPI integrated.",
    tags: ["Fintech", "Mobile Web"],
  },
  {
    id: "cli-4",
    name: "Devon Miller",
    company: "Pulse Media",
    email: "devon@pulsemedia.co",
    phone: "+91 98450 77889",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    address: "Brooklyn Navy Yard, Brooklyn, NY",
    currency: "INR",
    taxId: "US-EIN-123456789",
    status: "ACTIVE",
    totalBilled: 95000,
    outstandingBalance: 15000,
    createdAt: "2026-07-10",
    notes: "Streaming video platform marketing website.",
    tags: ["Creative Dev", "GSAP"],
  },
  {
    id: "cli-5",
    name: "Elena Rostova",
    company: "Hyperion Robotics",
    email: "elena@hyperion-bot.eu",
    phone: "+49 30 1234567",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
    address: "Friedrichstraße 100, Berlin, Germany",
    currency: "EUR",
    taxId: "DE-VAT-987654321",
    status: "LEAD",
    totalBilled: 0,
    outstandingBalance: 0,
    createdAt: "2026-10-05",
    notes: "Robotics fleet control UI proposal pending review.",
    tags: ["Robotics", "WebSockets"],
  },
  {
    id: "cli-6",
    name: "Karan Johar",
    company: "Solaria CleanTech",
    email: "karan@solariaglobal.com",
    phone: "+91 99100 88221",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150",
    address: "Outer Ring Road, Bengaluru, KA",
    currency: "INR",
    taxId: "GSTIN29AAOCS1122",
    status: "ACTIVE",
    totalBilled: 60000,
    outstandingBalance: 0,
    createdAt: "2026-06-12",
    notes: "Solar grid monitoring IoT analytics.",
    tags: ["IoT", "Dashboard"],
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Nova Design System v3.0",
    clientId: "cli-1",
    clientName: "Nova Studios Inc",
    description: "Enterprise Figma-to-React component library with strict tokens and WCAG AAA compliance.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    budget: 150000,
    spent: 95000,
    deadline: "2026-11-20",
    progress: 78,
    tasksCount: 14,
    completedTasksCount: 11,
    tags: ["Design System", "React", "Tokens"],
    createdAt: "2026-09-01",
  },
  {
    id: "proj-2",
    title: "Aether 3D Copilot Canvas",
    clientId: "cli-2",
    clientName: "Aether Labs",
    description: "Interactive real-time WebGL node-graph visualizer with custom Three.js shaders and bloom.",
    status: "IN_PROGRESS",
    priority: "URGENT",
    budget: 85000,
    spent: 50000,
    deadline: "2026-11-10",
    progress: 60,
    tasksCount: 10,
    completedTasksCount: 6,
    tags: ["Three.js", "WebGL", "GLSL"],
    createdAt: "2026-09-15",
  },
  {
    id: "proj-3",
    title: "Zenith Mobile Wealth Flow",
    clientId: "cli-3",
    clientName: "Zenith FinTech",
    description: "Ultra-fast micro-investment checkout with UPI 2.0 AutoPay and portfolio analytics.",
    status: "REVIEW",
    priority: "MEDIUM",
    budget: 65000,
    spent: 60000,
    deadline: "2026-11-05",
    progress: 92,
    tasksCount: 8,
    completedTasksCount: 7,
    tags: ["Fintech", "UPI", "React"],
    createdAt: "2026-09-25",
  },
  {
    id: "proj-4",
    title: "Pulse Interactive Showcase",
    clientId: "cli-4",
    clientName: "Pulse Media",
    description: "Award-winning promotional web experience featuring GSAP ScrollTrigger and audio reactivity.",
    status: "COMPLETED",
    priority: "MEDIUM",
    budget: 95000,
    spent: 95000,
    deadline: "2026-10-25",
    progress: 100,
    tasksCount: 12,
    completedTasksCount: 12,
    tags: ["GSAP", "Creative", "Audio"],
    createdAt: "2026-08-10",
  },
  {
    id: "proj-5",
    title: "Hyperion Autonomous Ops Dashboard",
    clientId: "cli-5",
    clientName: "Hyperion Robotics",
    description: "Fleet tracking interface with geospatial maps, telemetry charts, and emergency cutoff controls.",
    status: "PLANNING",
    priority: "HIGH",
    budget: 180000,
    spent: 0,
    deadline: "2026-12-15",
    progress: 15,
    tasksCount: 6,
    completedTasksCount: 1,
    tags: ["Robotics", "Telemetry", "WebSockets"],
    createdAt: "2026-10-18",
  },
  {
    id: "proj-6",
    title: "Solaria Grid IoT Monitor",
    clientId: "cli-6",
    clientName: "Solaria CleanTech",
    description: "Real-time solar inverter efficiency monitoring with anomaly detection alerts.",
    status: "COMPLETED",
    priority: "LOW",
    budget: 60000,
    spent: 60000,
    deadline: "2026-09-30",
    progress: 100,
    tasksCount: 9,
    completedTasksCount: 9,
    tags: ["CleanTech", "IoT", "Charts"],
    createdAt: "2026-07-01",
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "tsk-1",
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
  {
    id: "tsk-2",
    projectId: "proj-1",
    title: "Data Table with Virtual Scrolling",
    description: "Implement TanStack Table with virtualizer for 50,000+ financial transaction rows at 60 FPS.",
    status: "DONE",
    priority: "URGENT",
    assignee: "Alex Morgan",
    dueDate: "2026-10-22",
    estimatedHours: 12,
    loggedHours: 11,
  },
  {
    id: "tsk-3",
    projectId: "proj-1",
    title: "Accessible Modal Dialog System",
    description: "Radix UI primitives integration with focus trapping, ESC dismiss, and screen reader announcements.",
    status: "IN_REVIEW",
    priority: "MEDIUM",
    assignee: "Alex Morgan",
    dueDate: "2026-11-02",
    estimatedHours: 6,
    loggedHours: 5.5,
  },
  {
    id: "tsk-4",
    projectId: "proj-1",
    title: "Storybook 8 Dark Studio Theme",
    description: "Brand custom Storybook manager and preview canvas with FREELANCEOS dark glass aesthetics.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    assignee: "Alex Morgan",
    dueDate: "2026-11-06",
    estimatedHours: 10,
    loggedHours: 4,
  },
  {
    id: "tsk-5",
    projectId: "proj-2",
    title: "Bloom & Chromatic Aberration Post-Processing",
    description: "Implement custom Three.js postprocessing pass with selective glass sphere glow and chromatic dispersion.",
    status: "IN_PROGRESS",
    priority: "URGENT",
    assignee: "Alex Morgan",
    dueDate: "2026-11-04",
    estimatedHours: 14,
    loggedHours: 9,
  },
  {
    id: "tsk-6",
    projectId: "proj-2",
    title: "Node Connector Bezier Splines",
    description: "Interactive glowing Bezier cables connecting copilot reasoning nodes in real-time.",
    status: "BACKLOG",
    priority: "HIGH",
    assignee: "Alex Morgan",
    dueDate: "2026-11-08",
    estimatedHours: 16,
    loggedHours: 0,
  },
  {
    id: "tsk-7",
    projectId: "proj-3",
    title: "Razorpay UPI AutoPay Sandbox Flow",
    description: "Test recurring mandate registration and webhook verification signature on server.",
    status: "IN_REVIEW",
    priority: "URGENT",
    assignee: "Alex Morgan",
    dueDate: "2026-11-01",
    estimatedHours: 8,
    loggedHours: 8,
  },
  {
    id: "tsk-8",
    projectId: "proj-5",
    title: "ROS2 WebSocket Telemetry Bridge",
    description: "Design protocol schema for high-frequency robot joint velocity and battery state.",
    status: "BACKLOG",
    priority: "MEDIUM",
    assignee: "Alex Morgan",
    dueDate: "2026-11-15",
    estimatedHours: 20,
    loggedHours: 2,
  },
];

const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    proposalNumber: "PROP-2026-089",
    title: "Enterprise Design System & UI Architecture",
    clientId: "cli-1",
    clientName: "Nova Studios Inc",
    clientEmail: "sarah@novastudios.design",
    status: "ACCEPTED",
    amount: 150000,
    validUntil: "2026-11-15",
    scope: "Architect and deliver a multi-brand React design system with TypeScript, Tailwind, automated tokens, and accessibility testing.",
    deliverables: [
      { id: "del-1", title: "Figma Token Architecture", description: "Semantic color, typography, spacing variables", amount: 35000 },
      { id: "del-2", title: "Core Component Library", description: "40+ accessible UI primitives in React & Tailwind", amount: 80000 },
      { id: "del-3", title: "Documentation & CI/CD", description: "Storybook interactive docs, npm package publish pipeline", amount: 35000 },
    ],
    terms: "50% upfront deposit upon signing. Net 15 days upon milestone completions. Full IP assignment upon final settlement.",
    sentAt: "2026-08-28",
    acceptedAt: "2026-08-30",
    createdAt: "2026-08-25",
  },
  {
    id: "prop-2",
    proposalNumber: "PROP-2026-090",
    title: "Real-Time 3D Copilot Canvas UI",
    clientId: "cli-2",
    clientName: "Aether Labs",
    clientEmail: "marcus@aetherlabs.ai",
    status: "ACCEPTED",
    amount: 85000,
    validUntil: "2026-11-20",
    scope: "Design and implement custom Three.js / React Three Fiber interactive scene with glowing nodes and camera controls.",
    deliverables: [
      { id: "del-4", title: "3D Scene & Shaders", description: "Glass sphere centerpiece, orbit rings, GLSL bloom", amount: 50000 },
      { id: "del-5", title: "HTML Overlay Cards", description: "Floating glassmorphism telemetry cards with mouse parallax", amount: 35000 },
    ],
    terms: "Milestone-based billing. Razorpay UPI or Netbanking supported. Revisions included up to 3 rounds.",
    sentAt: "2026-09-10",
    acceptedAt: "2026-09-12",
    createdAt: "2026-09-08",
  },
  {
    id: "prop-3",
    proposalNumber: "PROP-2026-091",
    title: "Hyperion Autonomous Robot Fleet GUI",
    clientId: "cli-5",
    clientName: "Hyperion Robotics",
    clientEmail: "elena@hyperion-bot.eu",
    status: "SENT",
    amount: 180000,
    validUntil: "2026-11-25",
    scope: "Comprehensive mission-control web frontend for monitoring autonomous delivery rovers across urban hubs.",
    deliverables: [
      { id: "del-6", title: "Geospatial Live Map", description: "Mapbox GL JS integration with real-time GPS telemetry", amount: 70000 },
      { id: "del-7", title: "Rover Health & Diagnostics", description: "Battery, motor torque, sensor anomaly monitors", amount: 60000 },
      { id: "del-8", title: "Operator Override Controls", description: "Low-latency joystick and emergency stop WebRTC stream", amount: 50000 },
    ],
    terms: "Net 30 payment terms via International Wire or Stripe/Razorpay. NDA required prior to source access.",
    sentAt: "2026-10-20",
    createdAt: "2026-10-18",
  },
];

const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "cnt-1",
    contractNumber: "CNT-2026-042",
    title: "Master Services Agreement (MSA)",
    clientId: "cli-1",
    clientName: "Nova Studios Inc",
    type: "SERVICE_AGREEMENT",
    status: "SIGNED",
    effectiveDate: "2026-09-01",
    amount: 150000,
    content: `MASTER SERVICES AGREEMENT\n\nThis Agreement is entered into by and between Apex Design Systems ("Contractor") and Nova Studios Inc ("Client").\n\n1. SCOPE OF SERVICES: Contractor shall provide principal UI engineering and design system architecture.\n2. COMPENSATION: Fixed project fee of ₹1,50,000 payable upon milestone completion.\n3. INTELLECTUAL PROPERTY: Upon full receipt of payment, Contractor assigns all right, title, and interest in deliverables to Client.\n4. CONFIDENTIALITY: Contractor agrees to maintain all proprietary technical data strictly confidential.`,
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
  {
    id: "cnt-2",
    contractNumber: "CNT-2026-043",
    title: "Mutual Non-Disclosure Agreement (NDA)",
    clientId: "cli-2",
    clientName: "Aether Labs",
    type: "NDA",
    status: "SIGNED",
    effectiveDate: "2026-09-14",
    amount: 0,
    content: `MUTUAL NON-DISCLOSURE AGREEMENT\n\nParties: Apex Design Systems & Aether Labs.\n\n1. PURPOSE: Discussing confidential algorithmic copilot architecture and 3D visualization.\n2. TERM: Two (2) years from effective date.\n3. GOVERNING LAW: Governed by the laws of India, jurisdiction of Bengaluru courts.`,
    signedByClient: true,
    signedByFreelancer: true,
    clientSignatureName: "Marcus Vance",
    clientSignatureDate: "2026-09-14T11:05:00Z",
    freelancerSignatureName: "Alex Morgan",
    freelancerSignatureDate: "2026-09-14T11:45:00Z",
    signatureHash: "sha256:2b904fc197e8832a5ef678129dca3318bc0094eef71a64bc259012d98efaa761",
    ipAddress: "104.28.192.44",
    createdAt: "2026-09-12",
  },
  {
    id: "cnt-3",
    contractNumber: "CNT-2026-044",
    title: "Robotics Ops Platform Services Agreement",
    clientId: "cli-5",
    clientName: "Hyperion Robotics",
    type: "SERVICE_AGREEMENT",
    status: "PENDING_SIGNATURE",
    effectiveDate: "2026-11-01",
    amount: 180000,
    content: `SOFTWARE CONSULTING AGREEMENT\n\nParties: Apex Design Systems & Hyperion Robotics.\n\nDeliverables: Autonomous fleet control GUI, telemetry integrations, real-time WebSocket protocol.\nPayment Terms: Net 30 upon invoice delivery. Total contract consideration: ₹1,80,000.`,
    signedByClient: false,
    signedByFreelancer: true,
    freelancerSignatureName: "Alex Morgan",
    freelancerSignatureDate: "2026-10-20T09:00:00Z",
    createdAt: "2026-10-20",
  },
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-001",
    clientId: "cli-1",
    clientName: "Nova Studios Inc",
    clientEmail: "sarah@novastudios.design",
    issueDate: "2026-09-05",
    dueDate: "2026-09-20",
    status: "PAID",
    items: [
      { id: "itm-1", description: "Milestone 1: Design Tokens & Token CI Pipeline", quantity: 1, rate: 50000, amount: 50000 },
      { id: "itm-2", description: "Figma Variables Taxonomy Setup", quantity: 1, rate: 25000, amount: 25000 },
    ],
    subtotal: 75000,
    taxRate: 18,
    taxAmount: 13500,
    discount: 0,
    total: 88500,
    currency: "INR",
    paymentId: "pay-101",
    paidAt: "2026-09-18T16:20:00Z",
    notes: "Paid via Razorpay UPI. Payment verified.",
    createdAt: "2026-09-05",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-002",
    clientId: "cli-4",
    clientName: "Pulse Media",
    clientEmail: "devon@pulsemedia.co",
    issueDate: "2026-09-28",
    dueDate: "2026-10-12",
    status: "PAID",
    items: [
      { id: "itm-3", description: "Creative Dev: GSAP Scroll Experience & 3D Shaders", quantity: 1, rate: 80000, amount: 80000 },
      { id: "itm-4", description: "Audio-reactive Canvas Visualizer", quantity: 1, rate: 15000, amount: 15000 },
    ],
    subtotal: 95000,
    taxRate: 18,
    taxAmount: 17100,
    discount: 5000,
    total: 107100,
    currency: "INR",
    paymentId: "pay-102",
    paidAt: "2026-10-10T12:05:00Z",
    notes: "Settled via Corporate Wire / Razorpay Gateway.",
    createdAt: "2026-09-28",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-003",
    clientId: "cli-3",
    clientName: "Zenith FinTech",
    clientEmail: "priya@zenithfin.io",
    issueDate: "2026-10-02",
    dueDate: "2026-10-16",
    status: "PAID",
    items: [
      { id: "itm-5", description: "Wealth Dashboard Frontend Sprints (Sprint 1 & 2)", quantity: 1, rate: 50000, amount: 50000 },
    ],
    subtotal: 50000,
    taxRate: 18,
    taxAmount: 9000,
    discount: 0,
    total: 59000,
    currency: "INR",
    paymentId: "pay-103",
    paidAt: "2026-10-15T18:30:00Z",
    notes: "Instant UPI QR settlement verified.",
    createdAt: "2026-10-02",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026-004",
    clientId: "cli-2",
    clientName: "Aether Labs",
    clientEmail: "marcus@aetherlabs.ai",
    issueDate: "2026-10-15",
    dueDate: "2026-10-30",
    status: "UNPAID",
    items: [
      { id: "itm-6", description: "Three.js 3D Sphere & Orbit System Milestone", quantity: 1, rate: 35000, amount: 35000 },
    ],
    subtotal: 35000,
    taxRate: 18,
    taxAmount: 6300,
    discount: 0,
    total: 41300,
    currency: "INR",
    notes: "Milestone 2 deliverable approved. Pending client checkout.",
    createdAt: "2026-10-15",
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2026-005",
    clientId: "cli-1",
    clientName: "Nova Studios Inc",
    clientEmail: "sarah@novastudios.design",
    issueDate: "2026-10-25",
    dueDate: "2026-11-10",
    status: "UNPAID",
    items: [
      { id: "itm-7", description: "Sprint 3: Enterprise Data Table Component", quantity: 1, rate: 36500, amount: 36500 },
    ],
    subtotal: 36500,
    taxRate: 18,
    taxAmount: 6570,
    discount: 0,
    total: 43070,
    currency: "INR",
    notes: "Work completed ahead of schedule. Thank you!",
    createdAt: "2026-10-25",
  },
];

const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: "pay-101",
    paymentId: "PAY_RZP_99182341",
    invoiceId: "inv-1",
    invoiceNumber: "INV-2026-001",
    clientId: "cli-1",
    clientName: "Nova Studios Inc",
    amount: 88500,
    currency: "INR",
    method: "UPI",
    status: "SUCCESS",
    transactionHash: "tx_0x9b3f4a187e2d90bc314a8e23f01b98a27d1109a1",
    razorpayOrderId: "order_K7xM91jQ20lp",
    razorpayPaymentId: "pay_K7xMaL009vWz",
    verifiedAt: "2026-09-18T16:20:00Z",
    upiVpa: "sarah.nova@icici",
  },
  {
    id: "pay-102",
    paymentId: "PAY_RZP_99182342",
    invoiceId: "inv-2",
    invoiceNumber: "INV-2026-002",
    clientId: "cli-4",
    clientName: "Pulse Media",
    amount: 107100,
    currency: "INR",
    method: "CARD",
    status: "SUCCESS",
    transactionHash: "tx_0x7c1a8e994d2091ea2837bcda11082fc498e2193b",
    razorpayOrderId: "order_M2zP44rT19kx",
    razorpayPaymentId: "pay_M2zP88yQ10an",
    verifiedAt: "2026-10-10T12:05:00Z",
  },
  {
    id: "pay-103",
    paymentId: "PAY_RZP_99182343",
    invoiceId: "inv-3",
    invoiceNumber: "INV-2026-003",
    clientId: "cli-3",
    clientName: "Zenith FinTech",
    amount: 25000, // matches prompt card "Payment Received — ₹25,000"
    currency: "INR",
    method: "UPI",
    status: "SUCCESS",
    transactionHash: "tx_0x3d8e90a1bc72418e9f2019ab7641cdd8901237ef",
    razorpayOrderId: "order_T9vX88mL01as",
    razorpayPaymentId: "pay_T9vX99kP44bz",
    verifiedAt: "2026-10-15T18:30:00Z",
    upiVpa: "zenith.treasury@axisbank",
  },
];

const INITIAL_TIME_ENTRIES: TimeEntry[] = [
  {
    id: "time-1",
    projectId: "proj-1",
    projectName: "Nova Design System v3.0",
    taskTitle: "Accessible Modal Dialog System",
    description: "Screen reader testing and keyboard navigation trap focus logic.",
    startTime: "2026-10-30T09:00:00Z",
    endTime: "2026-10-30T11:45:00Z",
    durationSeconds: 9900, // 2h 45m
    isBillable: true,
    hourlyRate: 4500,
    isBilled: false,
    date: "2026-10-30",
  },
  {
    id: "time-2",
    projectId: "proj-2",
    projectName: "Aether 3D Copilot Canvas",
    taskTitle: "Bloom & Chromatic Aberration Post-Processing",
    description: "Tuning transmission materials and three.js glass sphere refraction.",
    startTime: "2026-10-30T13:00:00Z",
    endTime: "2026-10-30T15:39:00Z",
    durationSeconds: 9540, // 2h 39m -> Total today: 5h 24m (matching hero card!)
    isBillable: true,
    hourlyRate: 4500,
    isBilled: false,
    date: "2026-10-30",
  },
  {
    id: "time-3",
    projectId: "proj-1",
    projectName: "Nova Design System v3.0",
    taskTitle: "Data Table with Virtual Scrolling",
    description: "Benchmarking 60 FPS re-renders during column sorting.",
    startTime: "2026-10-29T10:00:00Z",
    endTime: "2026-10-29T14:30:00Z",
    durationSeconds: 16200, // 4h 30m
    isBillable: true,
    hourlyRate: 4500,
    isBilled: true,
    invoiceId: "inv-5",
    date: "2026-10-29",
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Payment Received",
    message: "₹25,000 received from Zenith FinTech via Razorpay UPI.",
    type: "PAYMENT",
    timestamp: "10 minutes ago",
    read: false,
    link: "/app/payments",
  },
  {
    id: "notif-2",
    title: "Contract Signed",
    message: "Sarah Chen signed Master Services Agreement (CNT-2026-042).",
    type: "CONTRACT",
    timestamp: "1 hour ago",
    read: false,
    link: "/app/contracts",
  },
  {
    id: "notif-3",
    title: "Proposal Approved",
    message: "Aether Labs accepted proposal PROP-2026-090 for ₹85,000.",
    type: "PROPOSAL",
    timestamp: "Yesterday",
    read: true,
    link: "/app/proposals",
  },
  {
    id: "notif-4",
    title: "Milestone Due Soon",
    message: "Zenith Mobile Wealth Flow final review is due in 5 days.",
    type: "PROJECT",
    timestamp: "2 days ago",
    read: true,
    link: "/app/projects",
  },
];

function loadStoredState(): FreelanceOSState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        profile: { ...INITIAL_PROFILE, ...parsed.profile },
      };
    }
  } catch (err) {
    console.warn("FreelanceOS store hydration error, using initial defaults:", err);
  }

  return {
    profile: INITIAL_PROFILE,
    clients: INITIAL_CLIENTS,
    projects: INITIAL_PROJECTS,
    tasks: INITIAL_TASKS,
    proposals: INITIAL_PROPOSALS,
    contracts: INITIAL_CONTRACTS,
    invoices: INITIAL_INVOICES,
    payments: INITIAL_PAYMENTS,
    timeEntries: INITIAL_TIME_ENTRIES,
    notifications: INITIAL_NOTIFICATIONS,
    activeTimer: {
      isRunning: false,
      projectId: "proj-1",
      projectName: "Nova Design System v3.0",
      taskTitle: "Storybook 8 Dark Studio Theme",
      startTime: null,
      elapsedSeconds: 0,
    },
    currency: "INR",
    activeRole: "FREELANCER",
  };
}

let currentState: FreelanceOSState = loadStoredState();
const listeners = new Set<() => void>();

function notify() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch (e) {
    console.error("Failed to persist state", e);
  }
  listeners.forEach((listener) => listener());
}

// Timer ticker loop
if (typeof window !== "undefined") {
  window.setInterval(() => {
    if (currentState.activeTimer.isRunning && currentState.activeTimer.startTime) {
      const now = Date.now();
      const additionalSeconds = Math.floor((now - currentState.activeTimer.startTime) / 1000);
      currentState = {
        ...currentState,
        activeTimer: {
          ...currentState.activeTimer,
          startTime: now,
          elapsedSeconds: currentState.activeTimer.elapsedSeconds + Math.max(1, additionalSeconds),
        },
      };
      notify();
    }
  }, 1000);
}

export const freelanceStore = {
  getSnapshot(): FreelanceOSState {
    return currentState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Role switching
  setRole(role: "FREELANCER" | "CLIENT", clientId?: string) {
    currentState = {
      ...currentState,
      activeRole: role,
      activeClientId: clientId || (role === "CLIENT" ? currentState.clients[0]?.id : undefined),
    };
    notify();
  },

  setCurrency(currency: Currency) {
    currentState = { ...currentState, currency };
    notify();
  },

  // CLIENTS
  addClient(client: Omit<Client, "id" | "createdAt" | "totalBilled" | "outstandingBalance">) {
    const newClient: Client = {
      ...client,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      totalBilled: 0,
      outstandingBalance: 0,
    };
    currentState = {
      ...currentState,
      clients: [newClient, ...currentState.clients],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "New Client Added",
          message: `${newClient.name} (${newClient.company}) was added to your workspace.`,
          type: "SYSTEM",
          timestamp: "Just now",
          read: false,
        },
        ...currentState.notifications,
      ],
    };
    notify();
    return newClient;
  },

  updateClient(id: string, updates: Partial<Client>) {
    currentState = {
      ...currentState,
      clients: currentState.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    };
    notify();
  },

  deleteClient(id: string) {
    currentState = {
      ...currentState,
      clients: currentState.clients.filter((c) => c.id !== id),
    };
    notify();
  },

  // PROJECTS
  addProject(project: Omit<Project, "id" | "createdAt" | "spent" | "progress" | "tasksCount" | "completedTasksCount">) {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      spent: 0,
      progress: 0,
      tasksCount: 0,
      completedTasksCount: 0,
    };
    currentState = {
      ...currentState,
      projects: [newProject, ...currentState.projects],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Project Initialized",
          message: `Project "${newProject.title}" has been created.`,
          type: "PROJECT",
          timestamp: "Just now",
          read: false,
          link: "/app/projects",
        },
        ...currentState.notifications,
      ],
    };
    notify();
    return newProject;
  },

  updateProject(id: string, updates: Partial<Project>) {
    currentState = {
      ...currentState,
      projects: currentState.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    };
    notify();
  },

  deleteProject(id: string) {
    currentState = {
      ...currentState,
      projects: currentState.projects.filter((p) => p.id !== id),
      tasks: currentState.tasks.filter((t) => t.projectId !== id),
    };
    notify();
  },

  // TASKS
  addTask(task: Omit<Task, "id" | "loggedHours">) {
    const newTask: Task = {
      ...task,
      id: `tsk-${Date.now()}`,
      loggedHours: 0,
    };
    const updatedTasks = [newTask, ...currentState.tasks];
    const projectTasks = updatedTasks.filter((t) => t.projectId === task.projectId);
    const completed = projectTasks.filter((t) => t.status === "DONE").length;
    const progress = Math.round((completed / (projectTasks.length || 1)) * 100);

    currentState = {
      ...currentState,
      tasks: updatedTasks,
      projects: currentState.projects.map((p) =>
        p.id === task.projectId
          ? { ...p, tasksCount: projectTasks.length, completedTasksCount: completed, progress }
          : p
      ),
    };
    notify();
    return newTask;
  },

  updateTaskStatus(taskId: string, status: TaskStatus) {
    const targetTask = currentState.tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const updatedTasks = currentState.tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    const projectTasks = updatedTasks.filter((t) => t.projectId === targetTask.projectId);
    const completed = projectTasks.filter((t) => t.status === "DONE").length;
    const progress = Math.round((completed / (projectTasks.length || 1)) * 100);

    currentState = {
      ...currentState,
      tasks: updatedTasks,
      projects: currentState.projects.map((p) =>
        p.id === targetTask.projectId
          ? { ...p, completedTasksCount: completed, progress, status: progress === 100 ? "COMPLETED" : p.status }
          : p
      ),
    };
    notify();
  },

  deleteTask(taskId: string) {
    const targetTask = currentState.tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const updatedTasks = currentState.tasks.filter((t) => t.id !== taskId);
    const projectTasks = updatedTasks.filter((t) => t.projectId === targetTask.projectId);
    const completed = projectTasks.filter((t) => t.status === "DONE").length;
    const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;

    currentState = {
      ...currentState,
      tasks: updatedTasks,
      projects: currentState.projects.map((p) =>
        p.id === targetTask.projectId
          ? { ...p, tasksCount: projectTasks.length, completedTasksCount: completed, progress }
          : p
      ),
    };
    notify();
  },

  // PROPOSALS
  addProposal(proposal: Omit<Proposal, "id" | "proposalNumber" | "createdAt">) {
    const num = `PROP-2026-${String(currentState.proposals.length + 90).padStart(3, "0")}`;
    const newProp: Proposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
      proposalNumber: num,
      createdAt: new Date().toISOString().split("T")[0],
    };
    currentState = {
      ...currentState,
      proposals: [newProp, ...currentState.proposals],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Proposal Created",
          message: `${num} sent to ${newProp.clientName} for review.`,
          type: "PROPOSAL",
          timestamp: "Just now",
          read: false,
          link: "/app/proposals",
        },
        ...currentState.notifications,
      ],
    };
    notify();
    return newProp;
  },

  approveProposal(id: string) {
    currentState = {
      ...currentState,
      proposals: currentState.proposals.map((p) =>
        p.id === id ? { ...p, status: "ACCEPTED", acceptedAt: new Date().toISOString() } : p
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Proposal Accepted!",
          message: `Client accepted proposal. You can now execute the contract.`,
          type: "PROPOSAL",
          timestamp: "Just now",
          read: false,
          link: "/app/contracts",
        },
        ...currentState.notifications,
      ],
    };
    notify();
  },

  rejectProposal(id: string) {
    currentState = {
      ...currentState,
      proposals: currentState.proposals.map((p) =>
        p.id === id ? { ...p, status: "REJECTED", rejectedAt: new Date().toISOString() } : p
      ),
    };
    notify();
  },

  // CONTRACTS
  addContract(contract: Omit<Contract, "id" | "contractNumber" | "createdAt" | "signedByClient" | "signedByFreelancer">) {
    const num = `CNT-2026-${String(currentState.contracts.length + 43).padStart(3, "0")}`;
    const newContract: Contract = {
      ...contract,
      id: `cnt-${Date.now()}`,
      contractNumber: num,
      signedByClient: false,
      signedByFreelancer: true,
      freelancerSignatureName: currentState.profile.name,
      freelancerSignatureDate: new Date().toISOString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    currentState = {
      ...currentState,
      contracts: [newContract, ...currentState.contracts],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Contract Dispatched",
          message: `${num} "${newContract.title}" sent for e-signature.`,
          type: "CONTRACT",
          timestamp: "Just now",
          read: false,
          link: "/app/contracts",
        },
        ...currentState.notifications,
      ],
    };
    notify();
    return newContract;
  },

  signContract(id: string, signerName: string, role: "CLIENT" | "FREELANCER") {
    const randomHash = "sha256:" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    currentState = {
      ...currentState,
      contracts: currentState.contracts.map((c) => {
        if (c.id !== id) return c;
        if (role === "CLIENT") {
          return {
            ...c,
            signedByClient: true,
            clientSignatureName: signerName,
            clientSignatureDate: new Date().toISOString(),
            status: "SIGNED",
            signatureHash: randomHash,
            ipAddress: "192.168.1." + Math.floor(Math.random() * 200 + 10),
          };
        } else {
          return {
            ...c,
            signedByFreelancer: true,
            freelancerSignatureName: signerName,
            freelancerSignatureDate: new Date().toISOString(),
          };
        }
      }),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Contract Fully Executed",
          message: `Digital signature verified with cryptographic seal (${randomHash.slice(0, 16)}...).`,
          type: "CONTRACT",
          timestamp: "Just now",
          read: false,
          link: "/app/contracts",
        },
        ...currentState.notifications,
      ],
    };
    notify();
  },

  // INVOICES
  addInvoice(invoice: Omit<Invoice, "id" | "invoiceNumber" | "createdAt">) {
    const num = `INV-2026-${String(currentState.invoices.length + 1).padStart(3, "0")}`;
    const newInv: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: num,
      createdAt: new Date().toISOString().split("T")[0],
    };
    currentState = {
      ...currentState,
      invoices: [newInv, ...currentState.invoices],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Invoice Generated",
          message: `${num} created for ${newInv.clientName} (Total: ₹${newInv.total.toLocaleString()}).`,
          type: "INVOICE",
          timestamp: "Just now",
          read: false,
          link: "/app/invoices",
        },
        ...currentState.notifications,
      ],
    };
    notify();
    return newInv;
  },

  updateInvoiceStatus(id: string, status: Invoice["status"]) {
    currentState = {
      ...currentState,
      invoices: currentState.invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
    };
    notify();
  },

  // PAYMENTS & RAZORPAY VERIFICATION
  processPayment(
    invoiceId: string,
    method: PaymentTransaction["method"],
    razorpayDetails?: { orderId?: string; paymentId?: string; signature?: string }
  ) {
    const inv = currentState.invoices.find((i) => i.id === invoiceId);
    if (!inv) return null;

    const rzpOrder = razorpayDetails?.orderId || `order_${Math.random().toString(36).substring(2, 12)}`;
    const rzpPayment = razorpayDetails?.paymentId || `pay_${Math.random().toString(36).substring(2, 12)}`;
    const txHash = "tx_0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      paymentId: `PAY_RZP_${Math.floor(10000000 + Math.random() * 90000000)}`,
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientId: inv.clientId,
      clientName: inv.clientName,
      amount: inv.total,
      currency: inv.currency,
      method,
      status: "SUCCESS",
      transactionHash: txHash,
      razorpayOrderId: rzpOrder,
      razorpayPaymentId: rzpPayment,
      verifiedAt: new Date().toISOString(),
      upiVpa: method === "UPI" ? `${inv.clientName.toLowerCase().replace(/\s+/g, "")}@upi` : undefined,
    };

    // Update invoice to PAID
    const updatedInvoices = currentState.invoices.map((i) =>
      i.id === invoiceId
        ? {
            ...i,
            status: "PAID" as const,
            paymentId: newPayment.id,
            paidAt: new Date().toISOString(),
          }
        : i
    );

    // Update client totalBilled
    const updatedClients = currentState.clients.map((c) =>
      c.id === inv.clientId
        ? {
            ...c,
            totalBilled: c.totalBilled + inv.total,
            outstandingBalance: Math.max(0, c.outstandingBalance - inv.total),
          }
        : c
    );

    currentState = {
      ...currentState,
      invoices: updatedInvoices,
      payments: [newPayment, ...currentState.payments],
      clients: updatedClients,
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Payment Received & Verified!",
          message: `₹${inv.total.toLocaleString()} confirmed from ${inv.clientName} via ${method}.`,
          type: "PAYMENT",
          timestamp: "Just now",
          read: false,
          link: "/app/payments",
        },
        ...currentState.notifications,
      ],
    };
    notify();
    return newPayment;
  },

  // TIME TRACKING
  startTimer(projectId: string, taskTitle: string) {
    const proj = currentState.projects.find((p) => p.id === projectId);
    currentState = {
      ...currentState,
      activeTimer: {
        isRunning: true,
        projectId,
        projectName: proj?.title || "Active Project",
        taskTitle,
        startTime: Date.now(),
        elapsedSeconds: currentState.activeTimer.projectId === projectId ? currentState.activeTimer.elapsedSeconds : 0,
      },
    };
    notify();
  },

  pauseTimer() {
    currentState = {
      ...currentState,
      activeTimer: {
        ...currentState.activeTimer,
        isRunning: false,
        startTime: null,
      },
    };
    notify();
  },

  stopTimer() {
    const timer = currentState.activeTimer;
    if (timer.elapsedSeconds >= 10) {
      const newEntry: TimeEntry = {
        id: `time-${Date.now()}`,
        projectId: timer.projectId,
        projectName: timer.projectName,
        taskTitle: timer.taskTitle || "General Development",
        description: `Tracked session: ${Math.round(timer.elapsedSeconds / 60)} minutes`,
        startTime: new Date(Date.now() - timer.elapsedSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: timer.elapsedSeconds,
        isBillable: true,
        hourlyRate: currentState.profile.hourlyRate,
        isBilled: false,
        date: new Date().toISOString().split("T")[0],
      };
      currentState = {
        ...currentState,
        timeEntries: [newEntry, ...currentState.timeEntries],
        activeTimer: {
          isRunning: false,
          projectId: timer.projectId,
          projectName: timer.projectName,
          taskTitle: "",
          startTime: null,
          elapsedSeconds: 0,
        },
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: "Time Session Logged",
            message: `${Math.round(timer.elapsedSeconds / 60)}m logged for "${timer.projectName}".`,
            type: "SYSTEM",
            timestamp: "Just now",
            read: false,
            link: "/app/time-tracking",
          },
          ...currentState.notifications,
        ],
      };
    } else {
      currentState = {
        ...currentState,
        activeTimer: {
          ...timer,
          isRunning: false,
          startTime: null,
          elapsedSeconds: 0,
        },
      };
    }
    notify();
  },

  addManualTimeEntry(entry: Omit<TimeEntry, "id" | "isBilled">) {
    const newEntry: TimeEntry = {
      ...entry,
      id: `time-${Date.now()}`,
      isBilled: false,
    };
    currentState = {
      ...currentState,
      timeEntries: [newEntry, ...currentState.timeEntries],
    };
    notify();
  },

  convertTimeEntriesToInvoice(entryIds: string[], clientId: string) {
    const entries = currentState.timeEntries.filter((e) => entryIds.includes(e.id) && !e.isBilled);
    if (!entries.length) return null;

    const client = currentState.clients.find((c) => c.id === clientId) || currentState.clients[0];
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

    const invoice = this.addInvoice({
      clientId: client.id,
      clientName: client.company,
      clientEmail: client.email,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      status: "UNPAID",
      items,
      subtotal,
      taxRate: 18,
      taxAmount,
      discount: 0,
      total,
      currency: "INR",
      notes: "Generated automatically from tracked billable hours.",
    });

    // Mark entries as billed
    currentState = {
      ...currentState,
      timeEntries: currentState.timeEntries.map((e) =>
        entryIds.includes(e.id) ? { ...e, isBilled: true, invoiceId: invoice.id } : e
      ),
    };
    notify();
    return invoice;
  },

  // NOTIFICATIONS
  markNotificationRead(id: string) {
    currentState = {
      ...currentState,
      notifications: currentState.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    };
    notify();
  },

  markAllNotificationsRead() {
    currentState = {
      ...currentState,
      notifications: currentState.notifications.map((n) => ({ ...n, read: true })),
    };
    notify();
  },

  updateProfile(updates: Partial<FreelancerProfile>) {
    currentState = {
      ...currentState,
      profile: { ...currentState.profile, ...updates },
    };
    notify();
  },
};

export function useFreelanceStore(): FreelanceOSState {
  return useSyncExternalStore(freelanceStore.subscribe, freelanceStore.getSnapshot);
}
