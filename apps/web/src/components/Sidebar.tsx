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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigationItems: NavItem[] = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle, badge: "0 Active" },
  { name: "Workforce", href: "/workforce", icon: Users },
  { name: "Assets", href: "/assets", icon: Server },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-[#0B0F17] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/25 text-primary">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold tracking-wider text-sm text-foreground flex items-center gap-1.5 font-mono">
                NEXUS
                <span className="text-[10px] uppercase font-semibold px-1 py-0.2 rounded bg-primary/20 text-primary border border-primary/30">
                  SaaS
                </span>
              </span>
              <p className="text-[10px] text-muted-foreground tracking-tight">
                Command Center
              </p>
            </div>
          </div>
        </div>

        {/* Tenant Indicator */}
        <div className="px-4 py-3 border-b border-border/60 bg-[#090D14]">
          <div className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors cursor-pointer border border-border/40">
            <div className="flex items-center gap-2 truncate">
              <div className="h-2 w-2 rounded-full bg-primary/80" />
              <span className="font-medium text-foreground truncate">
                Acme Enterprise Ops
              </span>
            </div>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 font-mono">
            Navigation
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/25 font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground border border-transparent"
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 transition-colors" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Meta Footer */}
        <div className="border-t border-border p-4 bg-[#090D14]">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              <p className="font-medium text-foreground text-[11px]">Sprint 01: Foundation</p>
              <p className="text-[10px] font-mono text-muted-foreground/70">v1.0.0-alpha</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500" title="System Ready" />
          </div>
        </div>
      </aside>
    </>
  );
}
