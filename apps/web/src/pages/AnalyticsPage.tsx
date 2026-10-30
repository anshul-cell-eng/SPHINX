import { useState } from "react";
import { useFreelanceStore } from "../lib/freelance-store";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const MONTHLY_TREND = [
  { month: "May", revenue: 145000, hours: 142 },
  { month: "Jun", revenue: 168000, hours: 156 },
  { month: "Jul", revenue: 192000, hours: 168 },
  { month: "Aug", revenue: 215000, hours: 174 },
  { month: "Sep", revenue: 228000, hours: 182 },
  { month: "Oct", revenue: 250000, hours: 195 },
];

const CLIENT_DISTRIBUTION = [
  { name: "Nova Studios", value: 125000, color: "#B86A43" },
  { name: "Pulse Media", value: 95000, color: "#E6A15C" },
  { name: "Aether Labs", value: 75000, color: "#A3A68A" },
  { name: "Zenith FinTech", value: 50000, color: "#D97745" },
  { name: "Solaria CleanTech", value: 60000, color: "#4E8752" },
];

export function AnalyticsPage() {
  const state = useFreelanceStore();

  const totalCollected = state.payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalHoursLogged = state.timeEntries.reduce((sum, e) => sum + e.durationSeconds / 3600, 0);

  const averageHourlyYield = totalHoursLogged > 0 ? Math.round(totalCollected / totalHoursLogged) : 4500;

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2E302B]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Financial & Operational Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A397] mt-1">
            Real-time analytics on revenue velocity, client profitability, and billable time output.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-4">
          <span className="text-[10px] font-mono text-[#77766D] uppercase">Gross Revenue</span>
          <p className="text-2xl font-bold font-mono text-[#F2EFE7] mt-1">
            {currencySymbol}2,50,000
          </p>
          <span className="text-xs font-mono text-[#4E8752] mt-1 block">+28.4% YoY</span>
        </div>

        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-4">
          <span className="text-[10px] font-mono text-[#77766D] uppercase">Average Effective Rate</span>
          <p className="text-2xl font-bold font-mono text-[#B86A43] mt-1">
            {currencySymbol}{averageHourlyYield}/hr
          </p>
          <span className="text-xs font-mono text-[#77766D] mt-1 block">Based on delivered sprints</span>
        </div>

        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-4">
          <span className="text-[10px] font-mono text-[#77766D] uppercase">Collection Velocity (DSO)</span>
          <p className="text-2xl font-bold font-mono text-[#F2EFE7] mt-1">
            1.8 Days
          </p>
          <span className="text-xs font-mono text-[#A5A397] mt-1 block">Accelerated by Razorpay UPI</span>
        </div>

        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-4">
          <span className="text-[10px] font-mono text-[#77766D] uppercase">Client Retention</span>
          <p className="text-2xl font-bold font-mono text-[#4E8752] mt-1">
            100%
          </p>
          <span className="text-xs font-mono text-[#77766D] mt-1 block">Zero client churn this quarter</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Trend */}
        <div className="lg:col-span-8 rounded-xl border border-[#2E302B] bg-[#191A17] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
            <h3 className="text-sm font-semibold text-[#F2EFE7]">Monthly Revenue Trajectory</h3>
            <span className="text-xs font-mono text-[#77766D]">Past 6 Months</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND}>
                <defs>
                  <linearGradient id="analyticsCopperGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B86A43" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#B86A43" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#2E302B" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#77766D" fontSize={11} tickLine={false} axisLine={false} />
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
                        <div className="rounded-lg border border-[#2E302B] bg-[#191A17] p-2.5 text-xs font-mono">
                          <p className="text-[#F2EFE7] font-semibold">{payload[0].payload.month}</p>
                          <p className="text-[#B86A43]">Revenue: ₹{Number(payload[0].value).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#B86A43" strokeWidth={2} fill="url(#analyticsCopperGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Client Share Pie */}
        <div className="lg:col-span-4 rounded-xl border border-[#2E302B] bg-[#191A17] p-5 space-y-4 flex flex-col justify-between">
          <div className="pb-3 border-b border-[#2E302B]">
            <h3 className="text-sm font-semibold text-[#F2EFE7]">Revenue by Client</h3>
            <p className="text-xs text-[#A5A397]">Concentration & portfolio breakdown</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CLIENT_DISTRIBUTION}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CLIENT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#191A17" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Billed"]}
                  contentStyle={{ backgroundColor: "#191A17", border: "1px solid #2E302B", borderRadius: 8, fontSize: 11, color: "#F2EFE7" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {CLIENT_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#A5A397]">{item.name}</span>
                </div>
                <span className="text-[#F2EFE7] font-semibold">₹{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}