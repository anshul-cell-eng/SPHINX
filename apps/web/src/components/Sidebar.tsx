import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Server,
  Building2,
  MapPin,
  BarChart3,
  Settings,
  Shield,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMockStore } from "@/lib/mock-store";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  getBadge?: (store: ReturnType<typeof useMockStore>) => string | null;
}

const navigationItems: NavItem[] = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  {
    name: "Incidents",
    href: "/incidents",
    icon: AlertTriangle,
    getBadge: (store) =>
      store.openIncidents.length > 0 ? `${store.openIncidents.length} Active` : null,
  },
  {
    name: "Workforce",
    href: "/workforce",
    icon: Users,
    getBadge: (store) => `${store.employees.length}`,
  },
  { name: "Assets", href: "/assets", icon: Server },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const store = useMockStore();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-border bg-[#0B0F17] transition-all duration-300 ease-in-out lg:static lg:translate-x-0 select-none",
          isCollapsed ? "w-20" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/25 text-primary">
              <Shield className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-semibold tracking-wider text-sm text-foreground flex items-center gap-1.5 font-mono">
                  NEXUS
                  <span className="text-[10px] uppercase font-semibold px-1 py-0.2 rounded bg-primary/20 text-primary border border-primary/30">
                    Enterprise
                  </span>
                </span>
                <p className="text-[10px] text-muted-foreground tracking-tight">
                  Command Center
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Tenant Indicator */}
        {!isCollapsed && (
          <div className="px-3 py-2.5 border-b border-border/60 bg-[#090D14]">
            <div className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors cursor-pointer border border-border/40">
              <div className="flex items-center gap-2 truncate">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="font-medium text-foreground truncate text-[11px]">
                  Acme Global Ops
                </span>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 font-mono">
              Operations Navigation
            </div>
          )}

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const badge = item.getBadge ? item.getBadge(store) : null;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md text-xs font-medium transition-all duration-150",
                    isCollapsed
                      ? "justify-center p-2.5"
                      : "justify-between px-3 py-2",
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/25 font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground border border-transparent"
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 transition-colors" />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>

                {!isCollapsed && badge && (
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-mono",
                      badge.includes("Active")
                        ? "bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30"
                        : "bg-secondary/80 text-muted-foreground"
                    )}
                  >
                    {badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Meta Footer */}
        <div className="border-t border-border p-3 bg-[#090D14]">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {!isCollapsed ? (
              <>
                <div>
                  <p className="font-medium text-foreground text-[11px] truncate">
                    NEXUS Command
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground/70">
                    Engine v1.0.4
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500" title="Core Matrix Online" />
              </>
            ) : (
              <div className="mx-auto h-2 w-2 rounded-full bg-emerald-500" title="Online" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
