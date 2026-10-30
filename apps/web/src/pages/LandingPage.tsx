import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Freelance3DHero } from "../components/3d/Freelance3DHero";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Star,
  Users,
  FolderKanban,
  FileText,
  CreditCard,
  Clock,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe,
  ChevronDown,
  Layers,
  Laptop,
  Check,
  X,
  FileSignature,
  DollarSign,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState<"overview" | "system" | "workflow" | "pricing" | "faq">("overview");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      const scrollPosition = window.scrollY + 140;
      const featuresEl = document.getElementById("features");
      const workflowEl = document.getElementById("workflow");
      const pricingEl = document.getElementById("pricing");
      const faqEl = document.getElementById("faq");

      if (faqEl && scrollPosition >= faqEl.offsetTop) {
        setActiveNavSection("faq");
      } else if (pricingEl && scrollPosition >= pricingEl.offsetTop) {
        setActiveNavSection("pricing");
      } else if (workflowEl && scrollPosition >= workflowEl.offsetTop) {
        setActiveNavSection("workflow");
      } else if (featuresEl && scrollPosition >= featuresEl.offsetTop) {
        setActiveNavSection("system");
      } else {
        setActiveNavSection("overview");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featureTabs = [
    {
      id: "crm",
      title: "Client Directory & CRM",
      icon: Users,
      description: "Unified relationship ledger. Track contracts, billing terms, active deliverables, and client portal access in one place.",
      badge: "Zero Friction",
      stats: { primary: "24", label: "Active Clients", secondary: "100%", sub: "Retention Rate" },
    },
    {
      id: "kanban",
      title: "Project Boards & Delivery",
      icon: FolderKanban,
      description: "Structured delivery pipelines with milestone checkpoints, delivery dependencies, and real-time execution tracking.",
      badge: "Sprint Control",
      stats: { primary: "12", label: "Active Sprints", secondary: "94%", sub: "On-Time Rate" },
    },
    {
      id: "proposals",
      title: "Proposals & Agreements",
      icon: FileSignature,
      description: "Professional client proposals with cryptographic e-signatures, audit logs, and instant conversion to active projects.",
      badge: "Legally Binding",
      stats: { primary: "₹1.5L", label: "Avg Contract Value", secondary: "89%", sub: "Acceptance" },
    },
    {
      id: "payments",
      title: "Invoicing & UPI Settlement",
      icon: CreditCard,
      description: "GST-compliant invoicing integrated with Razorpay and instant UPI payment links. Automatic webhook reconciliation.",
      badge: "Instant Pay",
      stats: { primary: "₹2,50,000", label: "Monthly Billed", secondary: "< 24 hrs", sub: "Avg Settlement" },
    },
    {
      id: "timer",
      title: "Time & Billable Allocation",
      icon: Clock,
      description: "Integrated stopwatch with automatic project attribution, billable hourly rates, and one-click invoice generation.",
      badge: "Precision Timer",
      stats: { primary: "5h 24m", label: "Logged Today", secondary: "₹24,300", sub: "Billable Value" },
    },
    {
      id: "analytics",
      title: "Financial Ledger & Analytics",
      icon: BarChart3,
      description: "Real-time revenue analytics, client profitability margins, quarterly tax forecasts, and cashflow trajectories.",
      badge: "P&L Ledger",
      stats: { primary: "+28.4%", label: "MoM Growth", secondary: "₹18,500", sub: "Daily Run-Rate" },
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Author Proposal",
      desc: "Assemble milestone deliverables, timelines, and contract terms from professional templates.",
      icon: FileText,
      tag: "5 Minutes",
    },
    {
      step: "02",
      title: "Cryptographic E-Sign",
      desc: "Client reviews and executes the agreement with verifiable cryptographic timestamps.",
      icon: CheckCircle2,
      tag: "Zero Paperwork",
    },
    {
      step: "03",
      title: "Structured Sprints",
      desc: "Convert signed milestones into Kanban boards with automated checklist items.",
      icon: FolderKanban,
      tag: "Sprint Control",
    },
    {
      step: "04",
      title: "Precision Time Capture",
      desc: "Track billable sessions with instantaneous project linkage and hourly rate computation.",
      icon: Clock,
      tag: "1-Click Timer",
    },
    {
      step: "05",
      title: "Automated GST Invoice",
      desc: "Generate professional GST invoices with itemized deliverables and Razorpay payment links.",
      icon: CreditCard,
      tag: "Razorpay + UPI",
    },
    {
      step: "06",
      title: "Direct Settlement",
      desc: "Receive payments directly into your account with automatic transaction verification.",
      icon: Zap,
      tag: "Instant Payout",
    },
  ];

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Principal, Aether Systems",
      company: "Independent Consultancy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      content:
        "FREELANCEOS brings the discipline of enterprise financial tooling to independent operators. Replacing three disconnected tools with one cohesive operating system saved us ten hours of administrative overhead every single week.",
      badge: "Engineering Studio",
      metric: "₹4.8L / mo",
    },
    {
      name: "Sarah Chen",
      role: "Design Director",
      company: "Chen Creative",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      content:
        "The client portal alone transformed our enterprise sales cycle. High-budget clients immediately notice the difference between receiving a messy email PDF versus a dedicated, secure command center with instant UPI checkout.",
      badge: "Product Design",
      metric: "100% On-Time Settlement",
    },
    {
      name: "Rohan Varma",
      role: "Independent Consultant",
      company: "Studio Vertex",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      content:
        "This is software designed for professionals who take their business seriously. The typography, information density, and instant Razorpay payment flow provide an unparalleled level of credibility.",
      badge: "Technology Advisory",
      metric: "3x Faster Invoicing",
    },
  ];

  const faqs = [
    {
      q: "Does FREELANCEOS support Indian UPI and Razorpay payments?",
      a: "Yes. FREELANCEOS natively integrates with Razorpay, supporting Indian UPI applications (Google Pay, PhonePe, Paytm, CRED), Netbanking, and Credit/Debit cards with server-side signature verification and automatic webhook reconciliation.",
    },
    {
      q: "Can clients access their own dedicated portal?",
      a: "Yes. Every client receives an isolated portal login where they can track project deliverables, review scopes, e-sign contracts, and pay invoices without accessing your private business ledger.",
    },
    {
      q: "Are contracts and e-signatures legally binding?",
      a: "Yes. Every executed agreement generates an immutable audit record with cryptographic hash verification, timestamped approval events, and signer IP logging compliant with standard digital contract requirements.",
    },
    {
      q: "Can I export professional GST-compliant invoices?",
      a: "Yes. All invoices include automated GST calculations, line-item tax breakdowns, custom payment notes, and print-ready formatted PDF exports.",
    },
    {
      q: "Is there a free trial period?",
      a: "Yes. You can explore the platform on our Free Starter plan, or begin a 14-day trial of the Pro tier with no credit card required.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111210] text-[#F2EFE7] font-sans overflow-x-hidden selection:bg-[#B86A43]/25 selection:text-[#F2EFE7]">
      {/* ============================================================== */}
      {/* A. NAVIGATION BAR — REFINED EDITORIAL INDUSTRIAL DESIGN        */}
      {/* ============================================================== */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? "border-b border-[#2E302B] bg-[#111210]/95 backdrop-blur-md"
            : "border-b border-[#2E302B]/60 bg-[#111210]/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Monogram & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#191A17] border border-[#2E302B] text-[#F2EFE7] shadow-subtle group-hover:border-[#B86A43] transition-colors">
              <span className="font-mono font-bold text-sm tracking-tight text-[#B86A43]">F</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-semibold tracking-wider text-sm text-[#F2EFE7]">
                FREELANCEOS
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#77766D] uppercase">
                v2.4
              </span>
            </div>
          </Link>

          {/* Center Navigation Links — Signature Bordered Plate */}
          <nav className="hidden md:flex items-center gap-1 rounded-md border border-[#2E302B] bg-[#191A17] p-1 shadow-subtle">
            <a
              href="#hero"
              onClick={() => setActiveNavSection("overview")}
              className={`rounded px-3 py-1 text-xs font-medium transition-all ${
                activeNavSection === "overview"
                  ? "text-[#F2EFE7] bg-[#22231F] border border-[#2E302B]"
                  : "text-[#A5A397] hover:text-[#F2EFE7] hover:bg-[#22231F]/50 border border-transparent"
              }`}
            >
              Overview
            </a>
            <a
              href="#features"
              onClick={() => setActiveNavSection("system")}
              className={`rounded px-3 py-1 text-xs font-medium transition-all ${
                activeNavSection === "system"
                  ? "text-[#F2EFE7] bg-[#22231F] border border-[#2E302B]"
                  : "text-[#A5A397] hover:text-[#F2EFE7] hover:bg-[#22231F]/50 border border-transparent"
              }`}
            >
              System
            </a>
            <a
              href="#workflow"
              onClick={() => setActiveNavSection("workflow")}
              className={`rounded px-3 py-1 text-xs font-medium transition-all ${
                activeNavSection === "workflow"
                  ? "text-[#F2EFE7] bg-[#22231F] border border-[#2E302B]"
                  : "text-[#A5A397] hover:text-[#F2EFE7] hover:bg-[#22231F]/50 border border-transparent"
              }`}
            >
              Workflow
            </a>
            <a
              href="#pricing"
              onClick={() => setActiveNavSection("pricing")}
              className={`rounded px-3 py-1 text-xs font-medium transition-all ${
                activeNavSection === "pricing"
                  ? "text-[#F2EFE7] bg-[#22231F] border border-[#2E302B]"
                  : "text-[#A5A397] hover:text-[#F2EFE7] hover:bg-[#22231F]/50 border border-transparent"
              }`}
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setActiveNavSection("faq")}
              className={`rounded px-3 py-1 text-xs font-medium transition-all ${
                activeNavSection === "faq"
                  ? "text-[#F2EFE7] bg-[#22231F] border border-[#2E302B]"
                  : "text-[#A5A397] hover:text-[#F2EFE7] hover:bg-[#22231F]/50 border border-transparent"
              }`}
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/auth/login"
              className="hidden sm:inline-flex text-xs font-medium text-[#A5A397] hover:text-[#F2EFE7] transition-colors px-2 py-1"
            >
              Sign In
            </Link>

            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#B86A43] hover:bg-[#D97745] px-4 py-2 text-xs font-medium text-[#F2EFE7] transition-colors shadow-subtle border border-[#C87C55]/30"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* B. HERO SECTION — TWO COLUMN INDUSTRIAL PRESENTATION           */}
      {/* ============================================================== */}
      <section
        id="hero"
        className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden bg-[#111210] px-4 sm:px-6 lg:px-8 pt-3 pb-6 border-b border-[#2E302B]"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 flex-1 py-4">
          {/* LEFT COLUMN: 40% — TYPOGRAPHIC HIERARCHY & ACTIONS */}
          <div className="w-full lg:w-[40%] flex-shrink-0 z-20 flex flex-col items-start pr-0 lg:pr-4">
            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 rounded-md border border-[#2E302B] bg-[#191A17] px-3 py-1 text-xs font-mono text-[#A5A397] shadow-subtle mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B86A43]" />
              <span>FREELANCER OPERATING SYSTEM</span>
              <span className="text-[#77766D]">•</span>
              <span className="text-[#E6A15C]">SERIOUS SAAS</span>
            </div>

            {/* Disciplined Editorial Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-[#F2EFE7] font-sans leading-[1.14] mb-4">
              One Workspace.
              <br />
              Every Client.
              <br />
              <span className="text-[#B86A43]">
                Every Payment.
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#A5A397] text-sm sm:text-base max-w-sm sm:max-w-md leading-relaxed font-sans mb-6">
              Manage client relationships, deliver projects on Kanban boards, track billable hours, and settle invoices with native Razorpay UPI checkout.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8 w-full sm:w-auto">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#B86A43] hover:bg-[#D97745] px-6 py-2.5 text-xs sm:text-sm font-medium text-[#F2EFE7] shadow-subtle border border-[#C87C55]/30 transition-colors"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#2E302B] bg-[#191A17] hover:bg-[#22231F] hover:border-[#3D3F38] px-5 py-2.5 text-xs sm:text-sm font-medium text-[#F2EFE7] transition-colors"
              >
                <Play className="h-3 w-3 text-[#A5A397]" />
                <span>Watch Product Demo</span>
              </button>
            </div>

            {/* Trust Indicator with JetBrains Mono Metric */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#2E302B] w-full max-w-md">
              <div className="flex -space-x-1.5 overflow-hidden">
                <img
                  className="inline-block h-7 w-7 rounded-full ring-1 ring-[#191A17] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                  alt="Operator 1"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-1 ring-[#191A17] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                  alt="Operator 2"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-1 ring-[#191A17] object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                  alt="Operator 3"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-1 ring-[#191A17] object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"
                  alt="Operator 4"
                />
              </div>

              <div>
                <p className="text-xs font-mono font-semibold text-[#F2EFE7] tracking-tight">
                  10,000+ ACTIVE OPERATORS
                </p>
                <p className="text-[11px] text-[#A5A397]">
                  Handling over ₹12Cr in verified client billing.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 60% — 3D SMOKED GLASS SPHERE & 6 CHARCOAL CARDS */}
          <div className="w-full lg:w-[60%] flex-shrink-0 relative z-10 flex items-center justify-center overflow-hidden">
            <Freelance3DHero />
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM FEATURE DOCK — CLEAN INDUSTRIAL CARDS                   */}
        {/* ============================================================== */}
        <div className="max-w-7xl mx-auto w-full mt-2 z-20 flex flex-col md:flex-row items-center gap-3">
          {/* Main 5-Item Operational Dock */}
          <div className="flex-1 w-full rounded-md border border-[#2E302B] bg-[#191A17] p-3 shadow-card">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2E302B]">
              {/* Feature 1 */}
              <div className="flex items-center gap-2.5 px-2 py-0.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#22231F] border border-[#2E302B] text-[#B86A43]">
                  <FolderKanban className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F2EFE7] tracking-tight">Project Pipelines</p>
                  <p className="text-[10px] text-[#A5A397]">Structured sprints</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-2.5 px-2 py-0.5 pt-2 sm:pt-0.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#22231F] border border-[#2E302B] text-[#B86A43]">
                  <CreditCard className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F2EFE7] tracking-tight">Automated Invoicing</p>
                  <p className="text-[10px] text-[#A5A397]">Razorpay + UPI</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-2.5 px-2 py-0.5 pt-2 sm:pt-0.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#22231F] border border-[#2E302B] text-[#4E8752]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F2EFE7] tracking-tight">Legal Contracts</p>
                  <p className="text-[10px] text-[#A5A397]">Cryptographic signs</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-2.5 px-2 py-0.5 pt-2 sm:pt-0.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#22231F] border border-[#2E302B] text-[#E6A15C]">
                  <BarChart3 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F2EFE7] tracking-tight">Financial Ledger</p>
                  <p className="text-[10px] text-[#A5A397]">Real-time P&L</p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="flex items-center gap-2.5 px-2 py-0.5 pt-2 sm:pt-0.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#22231F] border border-[#2E302B] text-[#A3A68A]">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F2EFE7] tracking-tight">Client Portal</p>
                  <p className="text-[10px] text-[#A5A397]">Dedicated access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Architecture Badge */}
          <div className="w-full md:w-auto shrink-0 rounded-md border border-[#2E302B] bg-[#191A17] px-4 py-2.5 shadow-card flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#22231F] border border-[#2E302B] text-[#B86A43]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F2EFE7] tracking-tight">Linear Precision.</p>
              <p className="text-[10px] text-[#A5A397] font-mono">FINANCIAL RIGOR.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* C. FEATURE SYSTEM SHOWCASE — CLEAN MOCKUP & TABS               */}
      {/* ============================================================== */}
      <section id="features" className="py-20 lg:py-28 relative border-b border-[#2E302B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#2E302B] bg-[#191A17] px-3 py-1 text-xs font-mono text-[#A5A397]">
              <span>SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F2EFE7] font-sans">
              Designed for Independent Operators
            </h2>
            <p className="text-sm sm:text-base text-[#A5A397] font-sans">
              Replace fragmented tools with a unified operating system built specifically for billing, delivery, and client retention.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Feature Switcher Tabs */}
            <div className="lg:col-span-5 space-y-2.5">
              {featureTabs.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeFeatureTab === idx;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFeatureTab(idx)}
                    className={`w-full text-left p-4 rounded-md border transition-all text-sm relative overflow-hidden ${
                      isActive
                        ? "bg-[#22231F] border-[#3D3F38] text-[#F2EFE7] shadow-card"
                        : "bg-[#191A17] border-[#2E302B] text-[#A5A397] hover:border-[#3D3F38] hover:text-[#F2EFE7]"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B86A43]" />
                    )}
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded border ${
                            isActive
                              ? "border-[#B86A43]/40 bg-[#191A17] text-[#B86A43]"
                              : "border-[#2E302B] bg-[#22231F] text-[#A5A397]"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold text-sm">{tab.title}</h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#2E302B] text-[#A5A397] bg-[#111210]">
                        {tab.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#A5A397] pl-11 leading-relaxed">
                      {tab.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right: Live Interactive SaaS Mockup */}
            <div className="lg:col-span-7">
              <div className="relative rounded-lg border border-[#2E302B] bg-[#191A17] p-5 sm:p-6 shadow-card overflow-hidden">
                {/* Mockup Top Window Chrome */}
                <div className="flex items-center justify-between border-b border-[#2E302B] pb-3 mb-5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3D3F38]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3D3F38]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3D3F38]" />
                    <span className="ml-3 text-xs font-mono text-[#77766D]">
                      freelanceos.internal/ledger/overview
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#4E8752] border border-[#4E8752]/30 px-2 py-0.5 rounded bg-[#4E8752]/10">
                    LIVE PRODUCTION
                  </span>
                </div>

                {/* Dynamic Content Display based on active tab */}
                <div className="space-y-4">
                  {/* Top Metric Bar */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded bg-[#22231F] border border-[#2E302B]">
                      <p className="text-[11px] text-[#A5A397]">Primary Output</p>
                      <p className="text-xl font-bold font-mono text-[#F2EFE7] mt-0.5">
                        {featureTabs[activeFeatureTab].stats.primary}
                      </p>
                      <p className="text-[10px] text-[#77766D] font-mono mt-0.5">
                        {featureTabs[activeFeatureTab].stats.label}
                      </p>
                    </div>

                    <div className="p-3.5 rounded bg-[#22231F] border border-[#2E302B]">
                      <p className="text-[11px] text-[#A5A397]">Efficiency Ratio</p>
                      <p className="text-xl font-bold font-mono text-[#B86A43] mt-0.5">
                        {featureTabs[activeFeatureTab].stats.secondary}
                      </p>
                      <p className="text-[10px] text-[#77766D] font-mono mt-0.5">
                        {featureTabs[activeFeatureTab].stats.sub}
                      </p>
                    </div>
                  </div>

                  {/* Operational Ledger Rows */}
                  <div className="rounded border border-[#2E302B] bg-[#111210] p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#A5A397] pb-2 border-b border-[#2E302B] font-mono">
                      <span>ENTITY RECORD</span>
                      <span>STATUS</span>
                      <span>LEDGER IMPACT</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5">
                      <span className="text-[#F2EFE7] font-medium">Stripe Payment Gateway Sprint</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4E8752]/10 border border-[#4E8752]/30 text-[#4E8752]">
                        SETTLED
                      </span>
                      <span className="font-mono text-[#F2EFE7]">₹85,000</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5 border-t border-[#2E302B]">
                      <span className="text-[#F2EFE7] font-medium">Three.js Interactive Viewer Component</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E6A15C]/10 border border-[#E6A15C]/30 text-[#E6A15C]">
                        IN REVIEW
                      </span>
                      <span className="font-mono text-[#F2EFE7]">₹45,000</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5 border-t border-[#2E302B]">
                      <span className="text-[#F2EFE7] font-medium">Brand Identity & Editorial System</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#22231F] border border-[#2E302B] text-[#A5A397]">
                        DISPATCHED
                      </span>
                      <span className="font-mono text-[#F2EFE7]">₹1,20,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* D. WORKFLOW SECTION — 6 STRUCTURED STAGES                      */}
      {/* ============================================================== */}
      <section id="workflow" className="py-20 lg:py-28 relative border-b border-[#2E302B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#2E302B] bg-[#191A17] px-3 py-1 text-xs font-mono text-[#A5A397]">
              <span>DELIVERY PIPELINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F2EFE7] font-sans">
              From Agreement to Settlement
            </h2>
            <p className="text-sm sm:text-base text-[#A5A397] font-sans">
              Six sequential milestones that eliminate administrative friction and ensure on-time payment.
            </p>
          </div>

          {/* 6 Connected Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  onMouseEnter={() => setActiveWorkflowStep(idx)}
                  className={`p-6 rounded-md border transition-all ${
                    activeWorkflowStep === idx
                      ? "bg-[#22231F] border-[#3D3F38] shadow-card"
                      : "bg-[#191A17] border-[#2E302B] hover:border-[#3D3F38]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-mono font-bold text-[#B86A43]">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#2E302B] bg-[#111210] text-[#A5A397]">
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#111210] border border-[#2E302B] text-[#B86A43]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold text-[#F2EFE7]">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#A5A397] leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="pt-3 border-t border-[#2E302B] flex items-center justify-between text-[11px] font-mono text-[#77766D]">
                    <span>Stage {idx + 1} of 6</span>
                    <span className="text-[#4E8752] flex items-center gap-1">
                      <Check className="h-3 w-3" /> VERIFIED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* E. CLIENT PORTAL SHOWCASE                                      */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-28 relative border-b border-[#2E302B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-md border border-[#2E302B] bg-[#191A17] px-3 py-1 text-xs font-mono text-[#4E8752]">
                <Globe className="h-3.5 w-3.5" />
                <span>CLIENT COLLABORATION</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F2EFE7] leading-tight font-sans">
                Dedicated Client Command Center
              </h2>
              <p className="text-sm text-[#A5A397] leading-relaxed">
                Provide high-value clients with a transparent, branded interface to inspect project milestones, approve deliverables, and settle invoices in one click via Razorpay UPI.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-[#F2EFE7]">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#B86A43] shrink-0" />
                  <span>Authenticated client access with scoped permissions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#B86A43] shrink-0" />
                  <span>One-click UPI and Card settlement with instant verification</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#B86A43] shrink-0" />
                  <span>Cryptographic timestamped contract execution</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/portal"
                  className="inline-flex items-center gap-2 rounded-md bg-[#22231F] hover:bg-[#2A2B26] border border-[#2E302B] px-4 py-2.5 text-xs font-medium text-[#F2EFE7] transition-colors"
                >
                  <span>Inspect Client Portal View</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-md border border-[#2E302B] bg-[#191A17] p-6 shadow-card">
                <div className="flex items-center justify-between pb-3 border-b border-[#2E302B] mb-4 text-xs font-mono">
                  <span className="text-[#A5A397]">CLIENT PORTAL • ACME CORP DISPATCH</span>
                  <span className="text-[#4E8752] border border-[#4E8752]/30 px-2 py-0.5 rounded bg-[#4E8752]/10">
                    AUTHENTICATED
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded bg-[#22231F] border border-[#2E302B] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-[#F2EFE7]">Design System v3.0 Sprint</h4>
                        <p className="text-xs text-[#A5A397]">Contracted with Studio Operator</p>
                      </div>
                      <span className="text-xs font-mono text-[#F2EFE7] bg-[#191A17] border border-[#2E302B] px-2.5 py-1 rounded">
                        78% Finished
                      </span>
                    </div>

                    <div className="w-full bg-[#111210] rounded-sm h-1.5 overflow-hidden">
                      <div className="bg-[#B86A43] h-1.5 rounded-sm w-[78%]" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#A5A397] font-mono">
                      <span>11 of 14 milestones approved</span>
                      <span className="text-[#F2EFE7]">Delivery: Nov 20, 2026</span>
                    </div>
                  </div>

                  <div className="p-4 rounded bg-[#22231F] border border-[#2E302B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#E6A15C]">INV-2026-004</span>
                        <span className="text-[10px] font-mono text-[#E6A15C] border border-[#E6A15C]/30 px-1.5 rounded">
                          PENDING SETTLEMENT
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#F2EFE7] mt-1">
                        Three.js Core & Orbital Systems Milestone
                      </p>
                      <p className="text-[11px] text-[#A5A397] font-mono">Amount: ₹35,000 + 18% GST (₹41,300)</p>
                    </div>

                    <Link
                      to="/app/payments"
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] font-medium text-xs border border-[#C87C55]/30 transition-colors shrink-0"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Settle via Razorpay UPI</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* F. PRICING PLANS — REFINED DISCIPLINED CARDS                   */}
      {/* ============================================================== */}
      <section id="pricing" className="py-20 lg:py-28 relative border-b border-[#2E302B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#2E302B] bg-[#191A17] px-3 py-1 text-xs font-mono text-[#A5A397]">
              <span>SUBSCRIPTION TIERS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F2EFE7] font-sans">
              Transparent, Professional Pricing
            </h2>
            <p className="text-sm sm:text-base text-[#A5A397] font-sans">
              Start with our free core plan, then upgrade as your billing volume scales.
            </p>

            {/* Billing Switcher */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span
                className={`text-xs font-medium ${
                  billingCycle === "monthly" ? "text-[#F2EFE7]" : "text-[#77766D]"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
                }
                className="relative inline-flex h-5 w-10 items-center rounded-full bg-[#191A17] border border-[#2E302B] p-0.5"
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-[#B86A43] transition-transform ${
                    billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-medium ${
                    billingCycle === "yearly" ? "text-[#F2EFE7]" : "text-[#77766D]"
                  }`}
                >
                  Annual Billing
                </span>
                <span className="rounded border border-[#4E8752]/30 bg-[#4E8752]/10 px-1.5 py-0.5 text-[9px] font-mono text-[#4E8752]">
                  20% OFF
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className="rounded-md border border-[#2E302B] bg-[#191A17] p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F2EFE7]">Starter</h3>
                <p className="text-xs text-[#A5A397] mt-1">For independent creators starting out</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-[#F2EFE7]">₹0</span>
                  <span className="text-xs text-[#77766D]">/ forever free</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-[#F2EFE7]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8752] shrink-0" />
                    <span>Up to 3 active clients</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8752] shrink-0" />
                    <span>Standard Kanban boards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8752] shrink-0" />
                    <span>5 invoices per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8752] shrink-0" />
                    <span>Time tracking logs</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-[#2E302B]">
                <Link
                  to="/app"
                  className="w-full inline-flex items-center justify-center rounded-md border border-[#2E302B] bg-[#22231F] hover:bg-[#2A2B26] py-2 text-xs font-medium text-[#F2EFE7] transition-colors"
                >
                  Start Free
                </Link>
              </div>
            </div>

            {/* Pro Plan (Highlighted with Copper) */}
            <div className="relative rounded-md border-2 border-[#B86A43] bg-[#22231F] p-7 shadow-card flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-[#B86A43] px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-[#F2EFE7] uppercase">
                RECOMMENDED OPERATOR TIER
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#F2EFE7]">Pro Studio</h3>
                <p className="text-xs text-[#A5A397] mt-1">For serious independent consultants</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-[#F2EFE7]">
                    {billingCycle === "yearly" ? "₹1,199" : "₹1,499"}
                  </span>
                  <span className="text-xs text-[#77766D]">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-[#F2EFE7]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#B86A43] shrink-0" />
                    <span>Unlimited clients & projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#B86A43] shrink-0" />
                    <span>Razorpay & UPI Instant Settlement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#B86A43] shrink-0" />
                    <span>Branded Client Portal logins</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#B86A43] shrink-0" />
                    <span>Cryptographic e-signatures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#B86A43] shrink-0" />
                    <span>GST tax compliance reports</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-[#3D3F38]">
                <Link
                  to="/app"
                  className="w-full inline-flex items-center justify-center rounded-md bg-[#B86A43] hover:bg-[#D97745] py-2 text-xs font-medium text-[#F2EFE7] transition-colors shadow-subtle border border-[#C87C55]/30"
                >
                  Start 14-Day Pro Trial
                </Link>
              </div>
            </div>

            {/* Agency Plan */}
            <div className="rounded-md border border-[#2E302B] bg-[#191A17] p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F2EFE7]">Collective / Agency</h3>
                <p className="text-xs text-[#A5A397] mt-1">For multi-person boutique studios</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-[#F2EFE7]">
                    {billingCycle === "yearly" ? "₹3,199" : "₹3,999"}
                  </span>
                  <span className="text-xs text-[#77766D]">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-[#F2EFE7]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#A3A68A] shrink-0" />
                    <span>Everything in Pro Studio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#A3A68A] shrink-0" />
                    <span>Up to 5 team member accounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#A3A68A] shrink-0" />
                    <span>Custom domain for Client Portal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#A3A68A] shrink-0" />
                    <span>Priority technical support</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-[#2E302B]">
                <Link
                  to="/app"
                  className="w-full inline-flex items-center justify-center rounded-md border border-[#2E302B] bg-[#22231F] hover:bg-[#2A2B26] py-2 text-xs font-medium text-[#F2EFE7] transition-colors"
                >
                  Contact Studio Advisory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* G. EDITORIAL TESTIMONIALS                                      */}
      {/* ============================================================== */}
      <section id="testimonials" className="py-20 lg:py-28 relative border-b border-[#2E302B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#2E302B] bg-[#191A17] px-3 py-1 text-xs font-mono text-[#E6A15C]">
              <Star className="h-3.5 w-3.5 fill-[#E6A15C]" />
              <span>TESTIMONIAL ARCHIVE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F2EFE7] font-sans">
              Trusted by Senior Independent Operators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-md border border-[#2E302B] bg-[#191A17] p-6 flex flex-col justify-between shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#E6A15C]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-[#E6A15C]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#2E302B] bg-[#22231F] text-[#A5A397]">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#E8E4DA] leading-relaxed">
                    "{t.content}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2E302B] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-[#2E302B]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#F2EFE7]">{t.name}</p>
                      <p className="text-[10px] text-[#A5A397]">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#4E8752]">
                    {t.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* H. FAQ SECTION                                                 */}
      {/* ============================================================== */}
      <section id="faq" className="py-20 lg:py-28 relative border-b border-[#2E302B]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2EFE7] font-sans">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A397]">
              Technical and operational details on deployment, Razorpay settlement, and client isolation.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-md border border-[#2E302B] bg-[#191A17] overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-[#F2EFE7]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#A5A397] transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="px-4 pb-4 pt-1 text-xs text-[#A5A397] leading-relaxed border-t border-[#2E302B]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* I. CALL TO ACTION                                              */}
      {/* ============================================================== */}
      <section className="py-20 relative overflow-hidden bg-[#111210]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Ready to Upgrade Your Operational Standard?
          </h2>
          <p className="text-xs sm:text-sm text-[#A5A397] max-w-xl mx-auto">
            Join independent developers, designers, and consultants who run their business on FREELANCEOS.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md font-medium text-xs sm:text-sm text-[#F2EFE7] bg-[#B86A43] hover:bg-[#D97745] border border-[#C87C55]/30 shadow-subtle transition-colors"
            >
              <span>Get Started Immediately</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-xs sm:text-sm text-[#F2EFE7] border border-[#2E302B] bg-[#22231F] hover:bg-[#2A2B26] transition-colors"
            >
              Explore Live Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* J. FOOTER                                                      */}
      {/* ============================================================== */}
      <footer className="border-t border-[#2E302B] bg-[#0E0F0D] py-10 text-xs text-[#77766D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#191A17] border border-[#2E302B] text-[#B86A43] font-mono font-bold text-xs">
                F
              </div>
              <span className="font-mono font-bold text-[#F2EFE7] tracking-wider">
                FREELANCEOS
              </span>
              <span className="text-[10px] text-[#77766D] font-mono">v2.4.0 Production</span>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-[#A5A397]">
              <a href="#features" className="hover:text-[#F2EFE7] transition-colors">System</a>
              <a href="#pricing" className="hover:text-[#F2EFE7] transition-colors">Pricing</a>
              <Link to="/app" className="hover:text-[#F2EFE7] transition-colors">Dashboard</Link>
              <Link to="/portal" className="hover:text-[#F2EFE7] transition-colors">Client Portal</Link>
              <Link to="/auth/login" className="hover:text-[#F2EFE7] transition-colors">Sign In</Link>
            </div>

            <div className="flex items-center gap-2 text-[#A5A397] font-mono text-[10px]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#4E8752]" />
              <span>256-BIT SSL • RAZORPAY UPI VERIFIED</span>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-[#2E302B]/60 text-center text-[10px] text-[#77766D] font-mono">
            © 2026 FREELANCEOS. Engineered for independent professionals and boutique agencies.
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* INTERACTIVE DEMO MODAL                                         */}
      {/* ============================================================== */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-xl rounded-md border border-[#2E302B] bg-[#191A17] p-6 shadow-elevated"
            >
              <button
                onClick={() => setDemoModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded border border-[#2E302B] bg-[#22231F] px-2.5 py-0.5 text-xs font-mono text-[#B86A43]">
                  <Play className="h-3 w-3" />
                  <span>PRODUCT WALKTHROUGH</span>
                </div>

                <h3 className="text-lg font-bold text-[#F2EFE7]">
                  Inspect FREELANCEOS Workspaces
                </h3>

                <p className="text-xs text-[#A5A397] leading-relaxed">
                  Select a live workspace view to inspect genuine end-to-end freelancer operations, invoice generation, and client interactions.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div
                    onClick={() => {
                      setDemoModalOpen(false);
                      navigate("/app");
                    }}
                    className="p-3.5 rounded border border-[#2E302B] bg-[#22231F] hover:border-[#3D3F38] cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2 text-[#B86A43] mb-1">
                      <Laptop className="h-4 w-4" />
                      <span className="text-xs font-bold text-[#F2EFE7]">Freelancer View</span>
                    </div>
                    <p className="text-[11px] text-[#A5A397]">
                      Projects, clients, time tracking, and invoice management.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setDemoModalOpen(false);
                      navigate("/portal");
                    }}
                    className="p-3.5 rounded border border-[#2E302B] bg-[#22231F] hover:border-[#3D3F38] cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2 text-[#4E8752] mb-1">
                      <Globe className="h-4 w-4" />
                      <span className="text-xs font-bold text-[#F2EFE7]">Client Portal</span>
                    </div>
                    <p className="text-[11px] text-[#A5A397]">
                      Deliverable review, milestone sign-offs, and UPI payment.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setDemoModalOpen(false);
                      navigate("/app");
                    }}
                    className="px-4 py-2 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] font-medium text-xs border border-[#C87C55]/30 transition-colors"
                  >
                    Open Workspace
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
