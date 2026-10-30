import { useSyncExternalStore } from "react";

export type IncidentSeverity = "SEV1_CRITICAL" | "SEV2_HIGH" | "SEV3_MEDIUM" | "SEV4_LOW";
export type IncidentPriority = "P1_URGENT" | "P2_HIGH" | "P3_NORMAL" | "P4_LOW";
export type IncidentStatus = "OPEN" | "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED" | "CLOSED";
export type EmployeeStatus = "AVAILABLE" | "ON_CALL" | "BUSY" | "OFFLINE";

export interface Incident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  status: IncidentStatus;
  departmentId: string;
  departmentName: string;
  reporterName: string;
  assigneeId: string | null;
  assigneeName: string | null;
  createdAt: string;
  resolvedAt: string | null;
  slaTargetMinutes: number;
  slaElapsedMinutes: number;
  affectedSystem: string;
  location: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  avatarUrl?: string;
  activeIncidentsCount: number;
  phone: string;
  location: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  incidentCount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "warning" | "info" | "success";
  timestamp: string;
  unread: boolean;
  incidentId?: string;
}

export interface TopologyNode {
  id: string;
  name: string;
  type: "organization" | "department" | "location" | "incident";
  position: [number, number, number];
  status: "healthy" | "warning" | "critical";
  details: {
    lead?: string;
    metrics?: string;
    incidents?: number;
    latency?: string;
  };
}

interface MockState {
  incidents: Incident[];
  employees: Employee[];
  departments: Department[];
  notifications: AppNotification[];
  topologyNodes: TopologyNode[];
}

const initialEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "Elena Rostova",
    email: "elena.r@nexusops.internal",
    role: "Lead SRE & Incident Commander",
    department: "Cloud Infrastructure",
    status: "ON_CALL",
    activeIncidentsCount: 2,
    phone: "+1 (555) 234-8901",
    location: "US-East (N. Virginia)",
  },
  {
    id: "emp-2",
    name: "Marcus Vance",
    email: "marcus.v@nexusops.internal",
    role: "Senior Security Analyst",
    department: "Security Operations",
    status: "BUSY",
    activeIncidentsCount: 1,
    phone: "+1 (555) 789-1234",
    location: "US-West (Oregon)",
  },
  {
    id: "emp-3",
    name: "Aisha Chen",
    email: "aisha.c@nexusops.internal",
    role: "Staff Platform Engineer",
    department: "Core Engineering",
    status: "AVAILABLE",
    activeIncidentsCount: 0,
    phone: "+44 20 7946 0912",
    location: "EU-Central (Frankfurt)",
  },
  {
    id: "emp-4",
    name: "David Kalu",
    email: "david.k@nexusops.internal",
    role: "DevOps & Release Lead",
    department: "DevOps",
    status: "AVAILABLE",
    activeIncidentsCount: 0,
    phone: "+1 (555) 678-9012",
    location: "US-East (N. Virginia)",
  },
  {
    id: "emp-5",
    name: "Sofia Rodriguez",
    email: "sofia.r@nexusops.internal",
    role: "Tier 3 Operations Specialist",
    department: "Customer Operations",
    status: "OFFLINE",
    activeIncidentsCount: 0,
    phone: "+65 6789 0123",
    location: "AP-South (Singapore)",
  },
];

const initialDepartments: Department[] = [
  { id: "dept-1", name: "Cloud Infrastructure", code: "INFRA", head: "Elena Rostova", incidentCount: 2 },
  { id: "dept-2", name: "Security Operations", code: "SECOP", head: "Marcus Vance", incidentCount: 1 },
  { id: "dept-3", name: "Core Engineering", code: "ENG", head: "Aisha Chen", incidentCount: 0 },
  { id: "dept-4", name: "DevOps", code: "DEVOPS", head: "David Kalu", incidentCount: 0 },
  { id: "dept-5", name: "Customer Operations", code: "CUSTOPS", head: "Sofia Rodriguez", incidentCount: 0 },
];

const initialIncidents: Incident[] = [
  {
    id: "inc-1042",
    incidentNumber: "INC-1042",
    title: "Postgres Connection Pool Saturation (EU-Central)",
    description: "Database connection pooler reaching 98% utilization during peak traffic. Latency spikes observed in checkout pipeline.",
    severity: "SEV1_CRITICAL",
    priority: "P1_URGENT",
    status: "INVESTIGATING",
    departmentId: "dept-1",
    departmentName: "Cloud Infrastructure",
    reporterName: "Automated Synthetics Alert",
    assigneeId: "emp-1",
    assigneeName: "Elena Rostova",
    createdAt: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
    resolvedAt: null,
    slaTargetMinutes: 60,
    slaElapsedMinutes: 34,
    affectedSystem: "Database Cluster pg-pool-01",
    location: "EU-Central (Frankfurt)",
  },
  {
    id: "inc-1041",
    incidentNumber: "INC-1041",
    title: "Elevated Anomalous Authentication Requests",
    description: "Credential-stuffing pattern detected across auth endpoints. Rate-limiting threshold triggered in perimeter WAF.",
    severity: "SEV2_HIGH",
    priority: "P2_HIGH",
    status: "OPEN",
    departmentId: "dept-2",
    departmentName: "Security Operations",
    reporterName: "Cloudflare WAF Ingestion",
    assigneeId: "emp-2",
    assigneeName: "Marcus Vance",
    createdAt: new Date(Date.now() - 78 * 60 * 1000).toISOString(),
    resolvedAt: null,
    slaTargetMinutes: 120,
    slaElapsedMinutes: 78,
    affectedSystem: "Identity Perimeter Gateway",
    location: "Global Edge",
  },
  {
    id: "inc-1040",
    incidentNumber: "INC-1040",
    title: "Kafka Event Broker Partition Lag on Telemetry Pipeline",
    description: "Message offset lag exceeded 45,000 events on topic telemetry.ingress. Auto-scaling worker group triggered.",
    severity: "SEV3_MEDIUM",
    priority: "P3_NORMAL",
    status: "MONITORING",
    departmentId: "dept-1",
    departmentName: "Cloud Infrastructure",
    reporterName: "Prometheus Alertmanager",
    assigneeId: "emp-1",
    assigneeName: "Elena Rostova",
    createdAt: new Date(Date.now() - 145 * 60 * 1000).toISOString(),
    resolvedAt: null,
    slaTargetMinutes: 240,
    slaElapsedMinutes: 145,
    affectedSystem: "Kafka Broker Node-04",
    location: "US-East (N. Virginia)",
  },
  {
    id: "inc-1039",
    incidentNumber: "INC-1039",
    title: "Edge CDN TLS Certificate Handshake Renegotiation",
    description: "Intermittent TLS handshake dropouts on APAC edge POP. Certificate chain verified and cache flushed.",
    severity: "SEV4_LOW",
    priority: "P4_LOW",
    status: "RESOLVED",
    departmentId: "dept-4",
    departmentName: "DevOps",
    reporterName: "David Kalu",
    assigneeId: "emp-4",
    assigneeName: "David Kalu",
    createdAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    slaTargetMinutes: 480,
    slaElapsedMinutes: 300,
    affectedSystem: "Edge POP SG-01",
    location: "AP-South (Singapore)",
  },
];

const initialNotifications: AppNotification[] = [
  {
    id: "notif-1",
    title: "SEV1 Critical Incident Triggered",
    message: "INC-1042: Postgres Connection Pool Saturation in EU-Central.",
    type: "alert",
    timestamp: "34m ago",
    unread: true,
    incidentId: "inc-1042",
  },
  {
    id: "notif-2",
    title: "High Priority Security Alert",
    message: "INC-1041: Anomalous authentication pattern detected on WAF.",
    type: "warning",
    timestamp: "1h 18m ago",
    unread: true,
    incidentId: "inc-1041",
  },
  {
    id: "notif-3",
    title: "Incident Resolved",
    message: "INC-1039: Edge CDN TLS Handshake renegotiation resolved.",
    type: "success",
    timestamp: "1h ago",
    unread: false,
    incidentId: "inc-1039",
  },
  {
    id: "notif-4",
    title: "SLA Risk Warning",
    message: "INC-1041 has elapsed 65% of its SLA target resolution window.",
    type: "info",
    timestamp: "2h ago",
    unread: false,
    incidentId: "inc-1041",
  },
];

const initialTopologyNodes: TopologyNode[] = [
  {
    id: "core-org",
    name: "NEXUS Core Intelligence",
    type: "organization",
    position: [0, 0, 0],
    status: "healthy",
    details: { lead: "Operational Command", metrics: "99.99% Uptime", latency: "14ms" },
  },
  {
    id: "dept-infra",
    name: "Cloud Infrastructure",
    type: "department",
    position: [2.5, 1.2, 0.5],
    status: "critical",
    details: { lead: "Elena Rostova", incidents: 2, metrics: "Pool at 98%" },
  },
  {
    id: "dept-secop",
    name: "Security Operations",
    type: "department",
    position: [-2.4, 1.4, -0.6],
    status: "warning",
    details: { lead: "Marcus Vance", incidents: 1, metrics: "WAF Filtering" },
  },
  {
    id: "dept-eng",
    name: "Core Engineering",
    type: "department",
    position: [1.8, -1.5, 1.2],
    status: "healthy",
    details: { lead: "Aisha Chen", incidents: 0, metrics: "14 Deployments/day" },
  },
  {
    id: "dept-devops",
    name: "DevOps & SRE",
    type: "department",
    position: [-1.9, -1.3, -1.1],
    status: "healthy",
    details: { lead: "David Kalu", incidents: 0, metrics: "Pipeline 100% Green" },
  },
  {
    id: "loc-fra",
    name: "Region: EU-Central (Frankfurt)",
    type: "location",
    position: [3.8, 0.4, -1.2],
    status: "critical",
    details: { latency: "18ms", incidents: 1 },
  },
  {
    id: "loc-iad",
    name: "Region: US-East (N. Virginia)",
    type: "location",
    position: [-3.6, -0.5, 1.4],
    status: "warning",
    details: { latency: "22ms", incidents: 1 },
  },
  {
    id: "loc-sin",
    name: "Region: AP-South (Singapore)",
    type: "location",
    position: [0.4, 3.2, 1.5],
    status: "healthy",
    details: { latency: "64ms", incidents: 0 },
  },
];

// Reactive Singleton Store Implementation
class MockStore {
  private state: MockState = {
    incidents: initialIncidents,
    employees: initialEmployees,
    departments: initialDepartments,
    notifications: initialNotifications,
    topologyNodes: initialTopologyNodes,
  };

  private listeners = new Set<() => void>();

  public getSnapshot = (): MockState => {
    return this.state;
  };

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- ACTIONS ---

  public createIncident(data: {
    title: string;
    description: string;
    severity: IncidentSeverity;
    priority: IncidentPriority;
    departmentId: string;
    assigneeId: string | null;
    affectedSystem: string;
    location: string;
  }) {
    const nextNumber = `INC-${1043 + this.state.incidents.length - 4}`;
    const department = this.state.departments.find((d) => d.id === data.departmentId);
    const assignee = this.state.employees.find((e) => e.id === data.assigneeId);

    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      incidentNumber: nextNumber,
      title: data.title,
      description: data.description,
      severity: data.severity,
      priority: data.priority,
      status: "OPEN",
      departmentId: data.departmentId,
      departmentName: department?.name || "General Operations",
      reporterName: "Operations Command Center",
      assigneeId: data.assigneeId,
      assigneeName: assignee?.name || null,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      slaTargetMinutes: data.severity === "SEV1_CRITICAL" ? 60 : data.severity === "SEV2_HIGH" ? 120 : 240,
      slaElapsedMinutes: 0,
      affectedSystem: data.affectedSystem || "Production Cluster",
      location: data.location || "US-East (N. Virginia)",
    };

    // Update employees assigned count
    const updatedEmployees = this.state.employees.map((emp) => {
      if (emp.id === data.assigneeId) {
        return {
          ...emp,
          activeIncidentsCount: emp.activeIncidentsCount + 1,
          status: (emp.status === "AVAILABLE" ? "BUSY" : emp.status) as EmployeeStatus,
        };
      }
      return emp;
    });

    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `New Incident Created: ${newIncident.incidentNumber}`,
      message: `${newIncident.title} (${newIncident.severity})`,
      type: newIncident.severity === "SEV1_CRITICAL" ? "alert" : "warning",
      timestamp: "Just now",
      unread: true,
      incidentId: newIncident.id,
    };

    this.state = {
      ...this.state,
      incidents: [newIncident, ...this.state.incidents],
      employees: updatedEmployees,
      notifications: [newNotification, ...this.state.notifications],
    };

    this.notify();
    return newIncident;
  }

  public updateIncidentStatus(incidentId: string, newStatus: IncidentStatus) {
    const updatedIncidents = this.state.incidents.map((inc) => {
      if (inc.id === incidentId) {
        const isResolved = newStatus === "RESOLVED" || newStatus === "CLOSED";
        return {
          ...inc,
          status: newStatus,
          resolvedAt: isResolved ? new Date().toISOString() : inc.resolvedAt,
        };
      }
      return inc;
    });

    const target = this.state.incidents.find((i) => i.id === incidentId);
    let updatedNotifications = this.state.notifications;

    if (target && (newStatus === "RESOLVED" || newStatus === "CLOSED")) {
      updatedNotifications = [
        {
          id: `notif-${Date.now()}`,
          title: `Incident ${target.incidentNumber} ${newStatus}`,
          message: `Incident marked as ${newStatus} by incident responder.`,
          type: "success",
          timestamp: "Just now",
          unread: true,
          incidentId: target.id,
        },
        ...this.state.notifications,
      ];
    }

    this.state = {
      ...this.state,
      incidents: updatedIncidents,
      notifications: updatedNotifications,
    };

    this.notify();
  }

  public assignIncident(incidentId: string, employeeId: string | null) {
    const employee = this.state.employees.find((e) => e.id === employeeId);

    const updatedIncidents = this.state.incidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          assigneeId: employeeId,
          assigneeName: employee?.name || null,
        };
      }
      return inc;
    });

    this.state = {
      ...this.state,
      incidents: updatedIncidents,
    };

    this.notify();
  }

  public markNotificationRead(id: string) {
    this.state = {
      ...this.state,
      notifications: this.state.notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      ),
    };
    this.notify();
  }

  public markAllNotificationsRead() {
    this.state = {
      ...this.state,
      notifications: this.state.notifications.map((n) => ({ ...n, unread: false })),
    };
    this.notify();
  }

  public clearNotifications() {
    this.state = {
      ...this.state,
      notifications: [],
    };
    this.notify();
  }
}

export const mockStore = new MockStore();

export function useMockStore() {
  const state = useSyncExternalStore(mockStore.subscribe, mockStore.getSnapshot);

  const openIncidents = state.incidents.filter(
    (i) => i.status !== "RESOLVED" && i.status !== "CLOSED"
  );
  const criticalIncidents = openIncidents.filter(
    (i) => i.severity === "SEV1_CRITICAL"
  );
  const unreadNotificationsCount = state.notifications.filter((n) => n.unread).length;

  return {
    ...state,
    openIncidents,
    criticalIncidents,
    unreadNotificationsCount,
    createIncident: (data: Parameters<typeof mockStore.createIncident>[0]) =>
      mockStore.createIncident(data),
    updateIncidentStatus: (id: string, status: IncidentStatus) =>
      mockStore.updateIncidentStatus(id, status),
    assignIncident: (incidentId: string, employeeId: string | null) =>
      mockStore.assignIncident(incidentId, employeeId),
    markNotificationRead: (id: string) => mockStore.markNotificationRead(id),
    markAllNotificationsRead: () => mockStore.markAllNotificationsRead(),
    clearNotifications: () => mockStore.clearNotifications(),
  };
}
