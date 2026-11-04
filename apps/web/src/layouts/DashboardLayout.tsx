import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileSignature,
  FileCheck2,
  Receipt,
  Clock,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  Play,
  Pause,
  Square,
  Globe,
  ArrowUpRight,
  Menu,
  X,
  Shield,
} from "lucide-react";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const state = useFreelanceStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadNotifs = state.notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: "Overview", to: "/app", icon: LayoutDashboard },
    { label: "Projects", to: "/app/projects", icon: FolderKanban, badge: state.projects.length },
    { label: "Clients", to: "/app/clients", icon: Users, badge: state.clients.length },
    { label: "Proposals", to: "/app/proposals", icon: FileSignature },
    { label: "Contracts", to: "/app/contracts", icon: FileCheck2 },
    { label: "Invoices", to: "/app/invoices", icon: Receipt, badge: state.invoices.filter((i) => i.status === "UNPAID").length || undefined },
    { label: "Time Tracking", to: "/app/time-tracking", icon: Clock },
    { label: "Payments", to: "/app/payments", icon: CreditCard },
    { label: "Analytics", to: "/app/analytics", icon: BarChart3 },
    { label: "Settings", to: "/app/settings", icon: Settings },
  ];

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#111210] text-[#F2EFE7] flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 h-14 border-b border-[#2E302B] bg-[#111210] px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded border border-[#2E302B] bg-[#191A17] text-[#A5A397] hover:text-[#F2EFE7]"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link to="/app" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#191A17] border border-[#2E302B] text-[#B86A43] shadow-subtle">
              <span className="font-mono font-bold text-xs">F</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-sans font-semibold tracking-wider text-xs text-[#F2EFE7]">
                FREELANCEOS
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#77766D] uppercase">
                STUDIO WORKSPACE
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Live Stopwatch Bar */}
        <div className="hidden lg:flex items-center gap-3 rounded border border-[#2E302B] bg-[#191A17] px-3 py-1 shadow-subtle">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                state.activeTimer.isRunning
                  ? "bg-[#4E8752]"
                  : state.activeTimer.elapsedSeconds > 0
                  ? "bg-[#E6A15C]"
                  : "bg-[#77766D]"
              }`}
            />
            <span className="text-xs font-mono font-semibold text-[#F2EFE7]">
              {formatTimer(state.activeTimer.elapsedSeconds)}
            </span>
          </div>

          <span className="text-[#3D3F38]">|</span>

          <span className="text-xs text-[#A5A397] max-w-[180px] truncate">
            {state.activeTimer.projectName || "Design Sprints"}
          </span>

          <div className="flex items-center gap-1 pl-1">
            {state.activeTimer.isRunning ? (
              <button
                onClick={() => freelanceStore.pauseTimer()}
                title="Pause Timer"
                className="p-1 rounded text-[#E6A15C] hover:bg-[#22231F] transition-colors"
              >
                <Pause className="h-3 w-3" />
              </button>
            ) : (
              <button
                onClick={() => freelanceStore.startTimer(state.projects[0]?.id || "proj-1", "Design System Sprint")}
                title="Resume Timer"
                className="p-1 rounded text-[#4E8752] hover:bg-[#22231F] transition-colors"
              >
                <Play className="h-3 w-3 fill-[#4E8752]" />
              </button>
            )}

            {state.activeTimer.elapsedSeconds > 0 && (
              <button
                onClick={() => freelanceStore.stopTimer()}
                title="Stop & Log Session"
                className="p-1 rounded text-[#C95A53] hover:bg-[#22231F] transition-colors"
              >
                <Square className="h-2.5 w-2.5 fill-[#C95A53]" />
              </button>
            )}
          </div>
        </div>

        {/* Right Controls: Role Switcher, Currency, Notifications & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Client Portal Preview Pill */}
          <Link
            to="/portal"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#2E302B] bg-[#191A17] hover:bg-[#22231F] text-[#A3A68A] text-xs font-medium transition-colors"
          >
            <Globe className="h-3 w-3" />
            <span>Client View</span>
          </Link>

          {/* Currency Switcher */}
          <div className="flex rounded border border-[#2E302B] bg-[#191A17] p-0.5 text-xs font-mono">
            {(["INR", "USD", "EUR"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => freelanceStore.setCurrency(curr)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  state.currency === curr
                    ? "bg-[#22231F] text-[#F2EFE7] font-bold border border-[#2E302B]"
                    : "text-[#A5A397] hover:text-[#F2EFE7]"
                }`}
              >
                {curr === "INR" ? "₹" : curr === "USD" ? "$" : "€"}
              </button>
            ))}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-1.5 rounded border border-[#2E302B] bg-[#191A17] text-[#A5A397] hover:text-[#F2EFE7] hover:border-[#3D3F38] transition-colors"
            >
              <Bell className="h-3.5 w-3.5" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#B86A43] text-[9px] font-mono font-bold text-[#F2EFE7] flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-md border border-[#2E302B] bg-[#191A17] p-4 shadow-elevated z-50">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#2E302B] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F2EFE7] uppercase tracking-wider font-mono">
                      System Notifications
                    </span>
                    <span className="rounded bg-[#22231F] border border-[#2E302B] text-[#B86A43] text-[10px] font-mono px-1.5 py-0.5">
                      {unreadNotifs} unread
                    </span>
                  </div>
                  {unreadNotifs > 0 && (
                    <button
                      onClick={() => freelanceStore.markAllNotificationsRead()}
                      className="text-[11px] text-[#A5A397] hover:text-[#F2EFE7] font-mono"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {state.notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        freelanceStore.markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                        setNotifDropdownOpen(false);
                      }}
                      className={`p-2.5 rounded border transition-all cursor-pointer ${
                        n.read
                          ? "bg-[#111210] border-[#2E302B]/60 text-[#A5A397]"
                          : "bg-[#22231F] border-[#3D3F38] text-[#F2EFE7]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-xs">{n.title}</span>
                        <span className="text-[10px] text-[#77766D] font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#A5A397] leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded border border-[#2E302B] bg-[#191A17] hover:border-[#3D3F38] transition-colors"
            >
              <img
                src={state.profile.avatar}
                alt={state.profile.name}
                className="h-6 w-6 rounded object-cover ring-1 ring-[#2E302B]"
              />
              <span className="hidden sm:inline text-xs font-medium text-[#F2EFE7] px-1">
                {state.profile.name}
              </span>
              <ChevronDown className="hidden sm:inline h-3 w-3 text-[#A5A397]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-md border border-[#2E302B] bg-[#191A17] p-1.5 shadow-elevated z-50">
                <div className="px-3 py-2 border-b border-[#2E302B] mb-1">
                  <p className="text-xs font-semibold text-[#F2EFE7]">{state.profile.name}</p>
                  <p className="text-[10px] text-[#A5A397] truncate">{state.profile.email}</p>
                </div>
                <Link
                  to="/app/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-[#A5A397] hover:bg-[#22231F] hover:text-[#F2EFE7] transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Workspace Settings</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-[#A5A397] hover:bg-[#22231F] hover:text-[#F2EFE7] transition-colors"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>Landing Page</span>
                </Link>
                <div className="border-t border-[#2E302B] my-1" />
                <button
                  onClick={async () => {
                    setUserMenuOpen(false);
                    await logout();
                    navigate("/auth/login");
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded text-xs text-[#C95A53] hover:bg-[#22231F] transition-colors"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-56 pt-14 border-r border-[#2E302B] bg-[#111210] flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[9px] font-mono text-[#77766D] uppercase tracking-widest">
              Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/app"
                  ? location.pathname === "/app"
                  : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#22231F] border border-[#2E302B] text-[#F2EFE7] font-semibold"
                      : "text-[#A5A397] hover:text-[#F2EFE7] hover:bg-[#191A17]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        isActive ? "text-[#B86A43]" : "text-[#77766D]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                        isActive
                          ? "bg-[#B86A43] text-[#F2EFE7]"
                          : "bg-[#191A17] text-[#A5A397] border border-[#2E302B]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Sidebar Status Card */}
          <div className="p-3 border-t border-[#2E302B]">
            <div className="rounded border border-[#2E302B] bg-[#191A17] p-3 shadow-subtle">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-[#77766D] text-[9px]">RAZORPAY RECON</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#4E8752]" />
              </div>
              <p className="text-xs font-semibold text-[#F2EFE7]">Test Gateway Active</p>
              <p className="text-[10px] text-[#A5A397] mt-0.5">UPI & Cards verified</p>
            </div>
          </div>
        </aside>

        {/* Dynamic Page Outlet Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 bg-[#111210]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
