import { useHealthCheck } from "../hooks/use-health-check";
import { Badge } from "./ui/badge";
import { RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionStatusBadgeProps {
  className?: string;
  showRefresh?: boolean;
}

export function ConnectionStatusBadge({
  className,
  showRefresh = true,
}: ConnectionStatusBadgeProps) {
  const { connectionStatus, refetch, isFetching, error } = useHealthCheck();

  const statusConfig = {
    connected: {
      label: "Connected",
      variant: "success" as const,
      icon: CheckCircle2,
      dotClass: "bg-emerald-400 animate-pulse",
      title: "Backend API is responsive and healthy",
    },
    checking: {
      label: "Checking",
      variant: "warning" as const,
      icon: Loader2,
      dotClass: "bg-amber-400 animate-spin",
      title: "Verifying API connectivity...",
    },
    disconnected: {
      label: "Disconnected",
      variant: "destructive" as const,
      icon: AlertCircle,
      dotClass: "bg-rose-400",
      title: error?.message || "Cannot reach backend API server",
    },
  }[connectionStatus];

  const Icon = statusConfig.icon;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Badge
        variant={statusConfig.variant}
        className="px-2.5 py-1 text-xs font-mono font-medium tracking-wide flex items-center gap-1.5"
        title={statusConfig.title}
      >
        <span
          className={cn("h-1.5 w-1.5 rounded-full", statusConfig.dotClass)}
        />
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            connectionStatus === "checking" && "animate-spin"
          )}
        />
        <span>API: {statusConfig.label}</span>
      </Badge>

      {showRefresh && (
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors disabled:opacity-40"
          title="Refresh connection status"
          aria-label="Refresh connection"
        >
          <RefreshCw
            className={cn("h-3 w-3", isFetching && "animate-spin")}
          />
        </button>
      )}
    </div>
  );
}
