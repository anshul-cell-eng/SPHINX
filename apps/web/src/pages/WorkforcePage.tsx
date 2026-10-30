import { useState, useMemo } from "react";
import { useMockStore, Employee, EmployeeStatus } from "@/lib/mock-store";
import {
  Users,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export function WorkforcePage() {
  const { employees, departments, incidents } = useMockStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        departmentFilter === "ALL" || emp.department === departmentFilter;

      const matchesStatus =
        statusFilter === "ALL" || emp.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchQuery, departmentFilter, statusFilter]);

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge variant="success" className="text-[10px] font-mono">Available</Badge>;
      case "ON_CALL":
        return <Badge variant="default" className="text-[10px] font-mono">On-Call Primary</Badge>;
      case "BUSY":
        return <Badge variant="warning" className="text-[10px] font-mono">In Incident</Badge>;
      case "OFFLINE":
        return <Badge variant="secondary" className="text-[10px] font-mono">Offline</Badge>;
    }
  };

  const employeeAssignedIncidents = useMemo(() => {
    if (!selectedEmployee) return [];
    return incidents.filter((i) => i.assigneeId === selectedEmployee.id);
  }, [incidents, selectedEmployee]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground uppercase">
              Workforce Operations
            </h1>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              {employees.length} Active Personnel
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage incident commanders, engineering responders, shifts, and departmental assignments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-lg border border-border/70 bg-[#0E1422] p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search responder by name, role, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border/60 bg-background/80 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-muted-foreground">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Units</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All States</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_CALL">On-Call</option>
              <option value="BUSY">Busy</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workforce Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <Card
            key={emp.id}
            onClick={() => setSelectedEmployee(emp)}
            className="border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 cursor-pointer transition-all duration-150"
          >
            <CardHeader className="p-4 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center font-bold font-mono text-sm text-primary">
                    {emp.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {emp.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {emp.role}
                    </p>
                  </div>
                </div>
                {getStatusBadge(emp.status)}
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-2 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{emp.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{emp.location}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-2.5 mt-2">
                <span>Active Outages:</span>
                <span
                  className={
                    emp.activeIncidentsCount > 0
                      ? "text-rose-400 font-bold"
                      : "text-muted-foreground"
                  }
                >
                  {emp.activeIncidentsCount} Incidents
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Employee Detail Slide-over Panel */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md h-full border-l border-border bg-[#0B0F17] p-6 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold font-mono text-base text-primary">
                  {selectedEmployee.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {selectedEmployee.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedEmployee.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 py-5 space-y-6 text-xs font-mono">
              <div className="rounded-lg border border-border/70 bg-[#0E1422] p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Operational Status:</span>
                  {getStatusBadge(selectedEmployee.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="text-foreground">{selectedEmployee.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-foreground">{selectedEmployee.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Direct Contact:</span>
                  <span className="text-foreground">{selectedEmployee.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Internal Email:</span>
                  <span className="text-foreground">{selectedEmployee.email}</span>
                </div>
              </div>

              {/* Active Assigned Incidents */}
              <div>
                <h4 className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  Assigned Disruption Tasks ({employeeAssignedIncidents.length})
                </h4>

                {employeeAssignedIncidents.length === 0 ? (
                  <div className="rounded-lg border border-border/50 p-4 text-center text-muted-foreground bg-secondary/20">
                    No active incident workloads currently dispatched to this responder.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {employeeAssignedIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        className="rounded-lg border border-border/70 bg-card/60 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-bold">{inc.incidentNumber}</span>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {inc.status}
                          </Badge>
                        </div>
                        <p className="text-foreground font-sans font-medium line-clamp-1">
                          {inc.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          Target SLA: {inc.slaTargetMinutes}m ({inc.slaElapsedMinutes}m elapsed)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border/60 pt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEmployee(null)}
                className="text-xs"
              >
                Close Panel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
