import { useState, useEffect } from "react";
import {
  Incident,
  IncidentStatus,
  useMockStore,
} from "@/lib/mock-store";
import {
  X,
  Clock,
  User,
  Building2,
  MapPin,
  Server,
  CheckCircle2,
  AlertTriangle,
  Send,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface IncidentDrawerProps {
  incident: Incident | null;
  onClose: () => void;
}

export function IncidentDrawer({ incident, onClose }: IncidentDrawerProps) {
  const { employees, updateIncidentStatus, assignIncident } = useMockStore();

  const [currentAssignee, setCurrentAssignee] = useState<string>("");

  useEffect(() => {
    if (incident) {
      setCurrentAssignee(incident.assigneeId || "");
    }
  }, [incident]);

  if (!incident) return null;

  const handleStatusChange = (newStatus: IncidentStatus) => {
    updateIncidentStatus(incident.id, newStatus);
  };

  const handleAssigneeChange = (newAssigneeId: string) => {
    setCurrentAssignee(newAssigneeId);
    assignIncident(incident.id, newAssigneeId || null);
  };

  const slaPercentage = Math.min(
    100,
    Math.round((incident.slaElapsedMinutes / incident.slaTargetMinutes) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl h-full border-l border-border bg-[#0B0F17] p-6 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-primary tracking-wider">
                {incident.incidentNumber}
              </span>
              <Badge
                variant={
                  incident.severity === "SEV1_CRITICAL"
                    ? "destructive"
                    : incident.severity === "SEV2_HIGH"
                    ? "warning"
                    : "secondary"
                }
                className="text-[10px] font-mono"
              >
                {incident.severity.replace("_", " ")}
              </Badge>
              <Badge
                variant={
                  incident.status === "RESOLVED" || incident.status === "CLOSED"
                    ? "success"
                    : "outline"
                }
                className="text-[10px] font-mono uppercase"
              >
                {incident.status}
              </Badge>
            </div>
            <h2 className="text-base font-semibold text-foreground">
              {incident.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 py-4 space-y-6">
          {/* Quick Action Status Bar */}
          <div className="rounded-lg border border-border/70 bg-[#0E1422] p-3.5">
            <span className="block text-xs font-mono font-medium text-muted-foreground mb-2">
              Lifecycle Transition:
            </span>
            <div className="flex flex-wrap gap-2">
              {(["OPEN", "INVESTIGATING", "MONITORING", "RESOLVED", "CLOSED"] as IncidentStatus[]).map(
                (st) => (
                  <Button
                    key={st}
                    variant={incident.status === st ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(st)}
                    className="text-xs h-7 px-2.5 font-mono"
                  >
                    {incident.status === st && (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    )}
                    {st}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* SLA Performance Meter */}
          <div className="rounded-lg border border-border/70 bg-[#0E1422] p-4">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                SLA Countdown ({incident.slaElapsedMinutes}m / {incident.slaTargetMinutes}m)
              </span>
              <span
                className={
                  slaPercentage > 85
                    ? "text-rose-400 font-bold"
                    : slaPercentage > 60
                    ? "text-amber-400"
                    : "text-emerald-400"
                }
              >
                {slaPercentage}% Consumed
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  slaPercentage > 85
                    ? "bg-rose-500"
                    : slaPercentage > 60
                    ? "bg-amber-400"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${slaPercentage}%` }}
              />
            </div>
          </div>

          {/* Description & Technical Summary */}
          <div>
            <h4 className="text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Technical Description
            </h4>
            <p className="text-xs leading-relaxed text-foreground bg-secondary/30 border border-border/50 rounded-lg p-3 font-mono">
              {incident.description}
            </p>
          </div>

          {/* Core Telemetry & Context */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="rounded-lg border border-border/60 bg-card/60 p-3">
              <span className="text-muted-foreground flex items-center gap-1.5 mb-1">
                <Server className="h-3.5 w-3.5 text-cyan-400" />
                Affected Asset / Service
              </span>
              <span className="text-foreground font-medium">
                {incident.affectedSystem}
              </span>
            </div>

            <div className="rounded-lg border border-border/60 bg-card/60 p-3">
              <span className="text-muted-foreground flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                Spatial Location
              </span>
              <span className="text-foreground font-medium">
                {incident.location}
              </span>
            </div>

            <div className="rounded-lg border border-border/60 bg-card/60 p-3">
              <span className="text-muted-foreground flex items-center gap-1.5 mb-1">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Department
              </span>
              <span className="text-foreground font-medium">
                {incident.departmentName}
              </span>
            </div>

            <div className="rounded-lg border border-border/60 bg-card/60 p-3">
              <span className="text-muted-foreground flex items-center gap-1.5 mb-1">
                <User className="h-3.5 w-3.5 text-amber-400" />
                Reported By
              </span>
              <span className="text-foreground font-medium">
                {incident.reporterName}
              </span>
            </div>
          </div>

          {/* Responder Assignment Selector */}
          <div className="rounded-lg border border-border/70 bg-[#0E1422] p-4">
            <label className="block text-xs font-mono font-medium text-muted-foreground mb-2">
              Primary Responder Assignment
            </label>
            <div className="flex gap-2">
              <select
                value={currentAssignee}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="flex-1 rounded-md border border-border bg-background/80 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Unassigned</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.role} ({emp.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Activity Timeline Log */}
          <div>
            <h4 className="text-xs font-mono uppercase text-muted-foreground mb-2">
              Incident Audit Log
            </h4>
            <div className="border-l border-border/60 pl-3 space-y-3 font-mono text-xs text-muted-foreground">
              <div>
                <span className="text-cyan-400 text-[10px]">
                  {new Date(incident.createdAt).toLocaleTimeString()}
                </span>
                <p className="text-foreground">
                  Incident opened by {incident.reporterName}
                </p>
              </div>
              {incident.assigneeName && (
                <div>
                  <span className="text-primary text-[10px]">Active</span>
                  <p className="text-foreground">
                    Assigned to {incident.assigneeName} ({incident.departmentName})
                  </p>
                </div>
              )}
              {incident.resolvedAt && (
                <div>
                  <span className="text-emerald-400 text-[10px]">
                    {new Date(incident.resolvedAt).toLocaleTimeString()}
                  </span>
                  <p className="text-emerald-400 font-semibold">
                    Incident marked as {incident.status}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 pt-4 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground">
            Changes persist in live in-memory store
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
