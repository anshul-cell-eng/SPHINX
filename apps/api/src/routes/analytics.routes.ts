import { Router } from "express";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore } from "../lib/memory-store.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate);

// Handler for analytics calculation
function getAnalyticsData(workspaceId: string) {
  const totalRevenue = memoryStore.payments
    .filter((p) => p.workspaceId === workspaceId && p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalHours = memoryStore.timeEntries
    .filter((e) => e.workspaceId === workspaceId)
    .reduce((sum, e) => sum + e.durationSeconds / 3600, 0);

  const outstandingRevenue = memoryStore.invoices
    .filter((i) => i.workspaceId === workspaceId && (i.status === "UNPAID" || i.status === "OVERDUE"))
    .reduce((sum, i) => sum + i.total, 0);

  const monthlyTrend = [
    { month: "May", revenue: 145000, target: 120000 },
    { month: "Jun", revenue: 168000, target: 140000 },
    { month: "Jul", revenue: 192000, target: 160000 },
    { month: "Aug", revenue: 215000, target: 180000 },
    { month: "Sep", revenue: 228000, target: 200000 },
    { month: "Oct", revenue: totalRevenue, target: 220000 },
  ];

  const averageHourlyYield = totalHours > 0 ? Math.round(totalRevenue / totalHours) : 4800;

  return {
    totalRevenue,
    outstandingRevenue,
    daysSalesOutstanding: 14,
    averageHourlyYield,
    totalHoursLogged: Number(totalHours.toFixed(1)),
    activeClientsCount: memoryStore.clients.filter((c) => c.workspaceId === workspaceId).length,
    activeProjectsCount: memoryStore.projects.filter((p) => p.workspaceId === workspaceId).length,
    monthlyTrend,
    monthlyRevenue: monthlyTrend,
    kpis: {
      totalRevenue,
      outstandingRevenue,
      daysSalesOutstanding: 14,
      averageHourlyYield,
      totalHoursLogged: Number(totalHours.toFixed(1)),
      activeClientsCount: memoryStore.clients.filter((c) => c.workspaceId === workspaceId).length,
      activeProjectsCount: memoryStore.projects.filter((p) => p.workspaceId === workspaceId).length,
    },
  };
}

// GET /api/v1/analytics
analyticsRouter.get("/", (req, res) => {
  const workspaceId = req.user!.workspaceId;
  const data = getAnalyticsData(workspaceId);
  ApiResponseHelper.success(res, "Analytics retrieved", data);
});

// GET /api/v1/analytics/overview (alias)
analyticsRouter.get("/overview", (req, res) => {
  const workspaceId = req.user!.workspaceId;
  const data = getAnalyticsData(workspaceId);
  ApiResponseHelper.success(res, "Analytics overview retrieved", data);
});
