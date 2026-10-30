import { useState } from "react";
import { Link } from "react-router-dom";
import { useFreelanceStore } from "../lib/freelance-store";
import {
  DollarSign,
  Users,
  FolderKanban,
  Clock,
  TrendingUp,
  Receipt,
  FileCheck2,
  CheckCircle2,
  Send,
  Plus,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MONTHLY_REVENUE_DATA = [
  { month: "May", revenue: 145000, target: 120000 },
  { month: "Jun", revenue: 168000, target: 140000 },
  { month: "Jul", revenue: 192000, target: 160000 },
  { month: "Aug", revenue: 215000, target: 180000 },
  { month: "Sep", revenue: 228000, target: 200000 },
  { month: "Oct", revenue: 250000, target: 220000 },
];

export function DashboardOverview() {
  const state = useFreelanceStore();
  const [reminderSent, setReminderSent] = useState<Record<string, boolean>>({});

  const totalRevenue = state.payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const outstandingRevenue = state.invoices
    .filter((i) => i.status === "UNPAID" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + i.total, 0);

  const activeProjects = state.projects.filter((p) => p.status !== "COMPLETED");
  const pendingInvoices = state.invoices.filter((i) => i.status === "UNPAID");

  const handleSendReminder = (invoiceId: string) => {
    setReminderSent((prev) => ({ ...prev, [invoiceId]: true }));
    setTimeout(() => {
      setReminderSent((prev) => ({ ...prev, [invoiceId]: false }));
    }, 3000);
  };

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#2E302B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
              Workspace Overview
            </h1>
            <span className="rounded border border-[#2E302B] bg-[#191A17] text-[#B86A43] text-[10px] font-mono px-2 py-0.5">
              PRO STUDIO
            </span>
          </div>
          <p className="text-xs text-[#A5A397]">
            Operator {state.profile.name} • {pendingInvoices.length} invoices awaiting settlement • {activeProjects.length} active delivery sprints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/app/invoices"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#2E302B] bg-[#191A17] hover:bg-[#22231F] text-[#F2EFE7] text-xs font-medium transition-colors"
          >
            <Receipt className="h-3.5 w-3.5 text-[#B86A43]" />
            <span>New Invoice</span>
          </Link>

          <Link
            to="/app/projects"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium shadow-subtle border border-[#C87C55]/30 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Project</span>
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4 PRIMARY KPI CARDS                                            */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Revenue */}
        <div className="rounded-md border border-[#2E302B] bg-[#191A17] p-4 shadow-subtle">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-[#A5A397] uppercase tracking-wider text-[10px]">
              Total Revenue
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#22231F] text-[#4E8752] border border-[#2E302B]">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#F2EFE7]">
            {currencySymbol}2,50,000
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#4E8752] font-mono mt-1.5">
            <TrendingUp className="h-3 w-3" />
            <span>+24.8% vs last month</span>
          </div>
        </div>

        {/* KPI 2: Active Clients */}
        <div className="rounded-md border border-[#2E302B] bg-[#191A17] p-4 shadow-subtle">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-[#A5A397] uppercase tracking-wider text-[10px]">
              Active Clients
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#22231F] text-[#A3A68A] border border-[#2E302B]">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#F2EFE7]">
            {state.clients.length} Accounts
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#A3A68A] font-mono mt-1.5">
            <span>4 retainers • 100% verified</span>
          </div>
        </div>

        {/* KPI 3: Active Projects */}
        <div className="rounded-md border border-[#2E302B] bg-[#191A17] p-4 shadow-subtle">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-[#A5A397] uppercase tracking-wider text-[10px]">
              Active Sprints
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#22231F] text-[#B86A43] border border-[#2E302B]">
              <FolderKanban className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#F2EFE7]">
            {activeProjects.length} Active
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#A5A397] font-mono mt-1.5">
            <span>8 in development • 4 in review</span>
          </div>
        </div>

        {/* KPI 4: Outstanding Payments */}
        <div className="rounded-md border border-[#2E302B] bg-[#191A17] p-4 shadow-subtle">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-[#A5A397] uppercase tracking-wider text-[10px]">
              Pending Settlement
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#22231F] text-[#E6A15C] border border-[#2E302B]">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#F2EFE7]">
            {currencySymbol}{outstandingRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#E6A15C] font-mono mt-1.5">
            <span>{pendingInvoices.length} invoices awaiting settlement</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* REVENUE ANALYTICS & RECENT ACTIVITY                            */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Financial Revenue Area Chart */}
        <div className="lg:col-span-8 rounded-md border border-[#2E302B] bg-[#191A17] p-5 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-[#F2EFE7]">
                Revenue Trajectory & Cashflow
              </h3>
              <p className="text-xs text-[#A5A397] mt-0.5">
                Monthly verified billing vs projected target
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-[#F2EFE7]">
                <span className="h-2 w-2 rounded-full bg-[#B86A43]" />
                <span>Collected</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#77766D]">
                <span className="h-2 w-2 rounded-full bg-[#3D3F38]" />
                <span>Target</span>
              </div>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE_DATA}>
                <defs>
                  <linearGradient id="revenueCopperGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B86A43" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B86A43" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#2E302B" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#77766D"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#77766D"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded border border-[#2E302B] bg-[#111210] p-3 shadow-elevated text-xs font-mono">
                          <p className="text-[#A5A397] font-semibold mb-1">
                            {payload[0].payload.month} 2026
                          </p>
                          <p className="text-[#B86A43]">
                            Settled: ₹{Number(payload[0].value).toLocaleString()}
                          </p>
                          <p className="text-[#77766D]">
                            Target: ₹{Number(payload[1]?.value || 0).toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#B86A43"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#revenueCopperGrad)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#3D3F38"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={0}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Operational Event Stream */}
        <div className="lg:col-span-4 rounded-md border border-[#2E302B] bg-[#191A17] p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B] mb-3">
              <h3 className="text-sm font-semibold text-[#F2EFE7]">Recent Activity</h3>
              <span className="text-[10px] font-mono text-[#4E8752] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4E8752]" />
                AUDIT LOG
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#22231F] text-[#4E8752] border border-[#2E302B] mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F2EFE7]">
                    Payment of ₹25,000 verified
                  </p>
                  <p className="text-[11px] text-[#A5A397]">
                    Zenith FinTech via Razorpay UPI
                  </p>
                  <span className="text-[10px] text-[#77766D] font-mono">10m ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#22231F] text-[#B86A43] border border-[#2E302B] mt-0.5">
                  <FileCheck2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F2EFE7]">
                    Master Services Agreement Signed
                  </p>
                  <p className="text-[11px] text-[#A5A397]">
                    Sarah Chen (Nova Studios) executed scope
                  </p>
                  <span className="text-[10px] text-[#77766D] font-mono">1h ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#22231F] text-[#A3A68A] border border-[#2E302B] mt-0.5">
                  <FolderKanban className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F2EFE7]">
                    Design System Milestone Delivered
                  </p>
                  <p className="text-[11px] text-[#A5A397]">
                    Token architecture approved by client
                  </p>
                  <span className="text-[10px] text-[#77766D] font-mono">4h ago</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/app/analytics"
            className="pt-3 border-t border-[#2E302B] flex items-center justify-between text-xs font-medium text-[#B86A43] hover:text-[#D97745] font-mono"
          >
            <span>Full Financial Audit</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ACTIVE SPRINT PROGRESS & PENDING INVOICES                      */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Projects List */}
        <div className="lg:col-span-6 rounded-md border border-[#2E302B] bg-[#191A17] p-5 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E302B] mb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#F2EFE7]">Sprint Delivery Status</h3>
              <p className="text-xs text-[#A5A397]">Milestone tracking across active pipelines</p>
            </div>
            <Link
              to="/app/projects"
              className="text-xs font-mono text-[#B86A43] hover:text-[#D97745] flex items-center gap-1"
            >
              <span>Kanban</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeProjects.slice(0, 4).map((proj) => (
              <div
                key={proj.id}
                className="p-3 rounded border border-[#2E302B] bg-[#22231F] hover:border-[#3D3F38] transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <h4 className="text-xs font-semibold text-[#F2EFE7]">{proj.title}</h4>
                    <p className="text-[11px] text-[#A5A397]">{proj.clientName}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F2EFE7]">
                    {proj.progress}%
                  </span>
                </div>

                <div className="w-full bg-[#111210] rounded-sm h-1.5 overflow-hidden">
                  <div
                    className="bg-[#B86A43] h-1.5 rounded-sm"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#77766D] mt-2">
                  <span>{proj.completedTasksCount} / {proj.tasksCount} tasks completed</span>
                  <span>Due: {proj.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invoices Action List */}
        <div className="lg:col-span-6 rounded-md border border-[#2E302B] bg-[#191A17] p-5 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E302B] mb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#F2EFE7]">Unsettled Invoices</h3>
              <p className="text-xs text-[#A5A397]">Direct Razorpay payment links & reminders</p>
            </div>
            <Link
              to="/app/invoices"
              className="text-xs font-mono text-[#B86A43] hover:text-[#D97745] flex items-center gap-1"
            >
              <span>All Invoices</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded border border-[#2E302B] bg-[#22231F] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#E6A15C]">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 rounded bg-[#E6A15C]/10 border border-[#E6A15C]/30 text-[#E6A15C]">
                      UNPAID
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#F2EFE7] mt-0.5">{inv.clientName}</p>
                  <p className="text-[11px] font-mono text-[#A5A397]">
                    Total: {currencySymbol}{inv.total.toLocaleString()} • Due: {inv.dueDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendReminder(inv.id)}
                    className="px-2.5 py-1 rounded border border-[#2E302B] bg-[#191A17] text-xs font-medium text-[#A5A397] hover:text-[#F2EFE7] hover:border-[#3D3F38] transition-colors flex items-center gap-1"
                  >
                    {reminderSent[inv.id] ? (
                      <span className="text-[#4E8752] flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Dispatched
                      </span>
                    ) : (
                      <>
                        <Send className="h-3 w-3" />
                        <span>Remind</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/app/payments"
                    className="px-3 py-1 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium shadow-subtle border border-[#C87C55]/30 transition-colors flex items-center gap-1"
                  >
                    <CreditCard className="h-3 w-3" />
                    <span>Pay</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
