import { useState } from "react";
import {
  useMockStore,
  IncidentSeverity,
  IncidentPriority,
} from "@/lib/mock-store";
import { X, AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateIncidentModal({
  isOpen,
  onClose,
}: CreateIncidentModalProps) {
  const { departments, employees, createIncident } = useMockStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<IncidentSeverity>("SEV2_HIGH");
  const [priority, setPriority] = useState<IncidentPriority>("P2_HIGH");
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || "dept-1");
  const [assigneeId, setAssigneeId] = useState<string>(employees[0]?.id || "");
  const [affectedSystem, setAffectedSystem] = useState("");
  const [location, setLocation] = useState("US-East (N. Virginia)");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createIncident({
      title: title.trim(),
      description: description.trim() || "Operational incident reported through Command Center.",
      severity,
      priority,
      departmentId,
      assigneeId: assigneeId || null,
      affectedSystem: affectedSystem.trim() || "Core Platform",
      location,
    });

    // Reset and close
    setTitle("");
    setDescription("");
    setAffectedSystem("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-[#0E1424] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 border border-primary/20 text-primary">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground font-mono">
                Log New Incident
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Dispatches immediately to on-call operational queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-muted-foreground mb-1">
              Incident Summary / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Postgres Connection Pool Saturation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-border bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-medium text-muted-foreground mb-1">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="SEV1_CRITICAL">SEV1 — Critical Outage</option>
                <option value="SEV2_HIGH">SEV2 — High Impact</option>
                <option value="SEV3_MEDIUM">SEV3 — Medium Degraded</option>
                <option value="SEV4_LOW">SEV4 — Low Advisory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-muted-foreground mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IncidentPriority)}
                className="w-full rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="P1_URGENT">P1 — Urgent</option>
                <option value="P2_HIGH">P2 — High</option>
                <option value="P3_NORMAL">P3 — Normal</option>
                <option value="P4_LOW">P4 — Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-medium text-muted-foreground mb-1">
                Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-muted-foreground mb-1">
                Assign Responder
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Unassigned</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-medium text-muted-foreground mb-1">
                Affected Component / System
              </label>
              <input
                type="text"
                placeholder="e.g. Auth Gateway, Redis Cluster"
                value={affectedSystem}
                onChange={(e) => setAffectedSystem(e.target.value)}
                className="w-full rounded-md border border-border bg-background/80 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-muted-foreground mb-1">
                Spatial Location / Region
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="US-East (N. Virginia)">US-East (N. Virginia)</option>
                <option value="EU-Central (Frankfurt)">EU-Central (Frankfurt)</option>
                <option value="US-West (Oregon)">US-West (Oregon)</option>
                <option value="AP-South (Singapore)">AP-South (Singapore)</option>
                <option value="Global Edge">Global Edge POPs</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-muted-foreground mb-1">
              Detailed Description & Evidence
            </label>
            <textarea
              rows={3}
              placeholder="Provide symptoms, initial diagnosis, error stack traces, and mitigation actions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-border bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-cyan-400" />
              Updates in-memory live mock state
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Broadcast Incident
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
