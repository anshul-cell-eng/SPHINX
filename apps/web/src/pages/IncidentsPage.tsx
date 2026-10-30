import { useState, useMemo } from "react";
import {
  useMockStore,
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from "@/lib/mock-store";
import {
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Building2,
  User,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { IncidentDrawer } from "../components/incidents/IncidentDrawer";
import { CreateIncidentModal } from "../components/incidents/CreateIncidentModal";

export function IncidentsPage() {
  const { incidents } = useMockStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter incidents in real time
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // Search
      const matchesSearch =
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.incidentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inc.assigneeName && inc.assigneeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        inc.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && inc.status !== "RESOLVED" && inc.status !== "CLOSED") ||
        inc.status === statusFilter;

      // Severity
      const matchesSeverity =
        severityFilter === "ALL" || inc.severity === severityFilter;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [incidents, searchQuery, statusFilter, severityFilter]);

  const activeCount = incidents.filter(
    (i) => i.status !== "RESOLVED" && i.status !== "CLOSED"
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground uppercase">
              Incident Management
            </h1>
            <Badge variant="destructive" className="text-[10px] font-mono">
              {activeCount} Active Outages
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Triage, orchestrate, and resolve critical operational disruptions in real time.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="text-xs gap-1.5 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Incident</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-lg border border-border/70 bg-[#0E1422] p-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by incident ID, summary, assignee, or system..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border/60 bg-background/80 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active (Open/Investigating/Monitoring)</option>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="MONITORING">Monitoring</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Severity Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-muted-foreground">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Severities</option>
              <option value="SEV1_CRITICAL">SEV1 Critical</option>
              <option value="SEV2_HIGH">SEV2 High</option>
              <option value="SEV3_MEDIUM">SEV3 Medium</option>
              <option value="SEV4_LOW">SEV4 Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident Listing Table */}
      <Card className="border-border/80 bg-card/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/70 bg-[#090D14] text-[11px] font-mono text-muted-foreground uppercase">
                <th className="py-3 px-4 font-semibold">Incident</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Assignee</th>
                <th className="py-3 px-4 font-semibold">SLA Window</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No incidents match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => {
                  const isCritical = incident.severity === "SEV1_CRITICAL";
                  const isResolved =
                    incident.status === "RESOLVED" || incident.status === "CLOSED";

                  return (
                    <tr
                      key={incident.id}
                      onClick={() => setSelectedIncident(incident)}
                      className="hover:bg-secondary/40 cursor-pointer transition-colors group"
                    >
                      {/* ID & Title */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">
                            {incident.incidentNumber}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-foreground line-clamp-1 mt-0.5">
                          {incident.title}
                        </p>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          variant={
                            isCritical
                              ? "destructive"
                              : incident.severity === "SEV2_HIGH"
                              ? "warning"
                              : "secondary"
                          }
                          className="text-[10px] font-mono"
                        >
                          {incident.severity.replace("_", " ")}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          variant={isResolved ? "success" : "outline"}
                          className="text-[10px] font-mono uppercase"
                        >
                          {incident.status}
                        </Badge>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap font-sans">
                        <span className="text-xs text-foreground">
                          {incident.departmentName}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                        {incident.assigneeName ? (
                          <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary font-mono">
                              {incident.assigneeName.charAt(0)}
                            </div>
                            <span className="text-xs text-foreground">
                              {incident.assigneeName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* SLA Progress */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span
                            className={
                              incident.slaElapsedMinutes > incident.slaTargetMinutes * 0.8
                                ? "text-rose-400 font-bold"
                                : "text-muted-foreground"
                            }
                          >
                            {incident.slaElapsedMinutes}m / {incident.slaTargetMinutes}m
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="text-[11px] font-sans text-primary group-hover:underline">
                          Inspect &rarr;
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-over Detail Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />

      {/* Create Modal */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
