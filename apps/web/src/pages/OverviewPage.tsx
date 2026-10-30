import { useHealthCheck } from "../hooks/use-health-check";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  ShieldCheck,
  Server,
  Users,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Code2,
} from "lucide-react";
import { Link } from "react-router-dom";

export function OverviewPage() {
  const { connectionStatus, healthData, error, refetch, isFetching } = useHealthCheck();

  const isConnected = connectionStatus === "connected";
  const isChecking = connectionStatus === "checking";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero / Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
              NEXUS COMMAND CENTER
            </h1>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              Sprint 01 Foundation
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Every incident. One command center. Faster resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Re-test Health Probe
          </Button>
          <Link to="/incidents">
            <Button size="sm" className="text-xs gap-1.5">
              <span>View Incidents</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Integration Diagnostic Banner */}
      <div
        className={`rounded-lg border p-5 transition-all ${
          isConnected
            ? "border-emerald-500/30 bg-emerald-950/15"
            : isChecking
            ? "border-amber-500/30 bg-amber-950/15"
            : "border-rose-500/30 bg-rose-950/15"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
                isConnected
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : isChecking
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-400"
              }`}
            >
              {isConnected ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isChecking ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">
                  Backend API Channel:{" "}
                  <span
                    className={
                      isConnected
                        ? "text-emerald-400"
                        : isChecking
                        ? "text-amber-400"
                        : "text-rose-400"
                    }
                  >
                    {isConnected
                      ? "Operational & Connected"
                      : isChecking
                      ? "Checking Handshake..."
                      : "Unreachable (Disconnected)"}
                  </span>
                </h2>
                <Badge
                  variant={
                    isConnected ? "success" : isChecking ? "warning" : "destructive"
                  }
                  className="text-[10px] uppercase font-mono"
                >
                  {connectionStatus}
                </Badge>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {isConnected
                  ? `REST Endpoint [/api/v1/health] responded with 200 OK. Shared contract validated.`
                  : isChecking
                  ? "Negotiating HTTP handshake with Express API daemon on port 4000..."
                  : error?.message || "Ensure the backend server is running (`npm run dev:api`)."}
              </p>

              {healthData && (
                <div className="mt-3 inline-flex items-center gap-4 rounded bg-background/60 px-3 py-1.5 text-xs font-mono border border-border/60">
                  <span>
                    Payload Status: <strong className="text-emerald-400">{healthData.status}</strong>
                  </span>
                  <span>•</span>
                  <span>Endpoint: <code className="text-primary">GET /api/v1/health</code></span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-border/40 pt-3 md:pt-0">
            <span className="text-[11px] text-muted-foreground uppercase font-mono">
              Target Host
            </span>
            <span className="text-xs font-mono text-foreground font-medium">
              http://localhost:4000
            </span>
          </div>
        </div>
      </div>

      {/* Operational KPI Metric Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground font-mono uppercase">
              Active Incidents
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">0</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              0 critical • 0 degraded
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground font-mono uppercase">
              Workforce Assigned
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">0</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              8 departments standby
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground font-mono uppercase">
              Monitored Assets
            </CardTitle>
            <Server className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">0</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Fleet ready for onboarding
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground font-mono uppercase">
              System Availability
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">99.99%</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              SLA guarantee active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sprint 01 Architectural Foundation Stack */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground">
            Architecture & Foundation Status (Sprint 01)
          </h2>
          <p className="text-xs text-muted-foreground">
            Core building blocks verified and ready for feature implementation sprints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/80 bg-card/40">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <Layers className="h-4 w-4 text-primary" />
                <Badge variant="success" className="text-[10px] font-mono">
                  Configured
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold mt-2">
                Monorepo Workspaces
              </CardTitle>
              <CardDescription className="text-xs">
                Root npm workspaces linking <code>apps/web</code>, <code>apps/api</code>, and <code>packages/contracts</code>.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/80 bg-card/40">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <Badge variant="success" className="text-[10px] font-mono">
                  Active
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold mt-2">
                Shared Zod Contracts
              </CardTitle>
              <CardDescription className="text-xs">
                Single source of truth in <code>@nexus/contracts</code> for API requests, errors, pagination, and health.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/80 bg-card/40">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <Database className="h-4 w-4 text-amber-400" />
                <Badge
                  variant={
                    (healthData?.services?.database as any) === "connected"
                      ? "success"
                      : "warning"
                  }
                  className="text-[10px] font-mono"
                >
                  {(healthData?.services?.database as any) === "connected"
                    ? "Connected"
                    : "Standby (No DB URL)"}
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold mt-2">
                Prisma ORM & PostgreSQL
              </CardTitle>
              <CardDescription className="text-xs">
                Multi-tenant schema designed with organizations, users, incidents, and audit trail tables.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/80 bg-card/40">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <Badge
                  variant={
                    (healthData?.services as any)?.supabase === "connected"
                      ? "success"
                      : "secondary"
                  }
                  className="text-[10px] font-mono"
                >
                  {(healthData?.services as any)?.supabase === "connected"
                    ? "Connected"
                    : "Standby (No Supabase URL)"}
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold mt-2">
                Supabase Auth & RBAC
              </CardTitle>
              <CardDescription className="text-xs">
                @supabase/supabase-js initialized in API. Ready for Supabase Auth JWT verification in Sprint 02.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
