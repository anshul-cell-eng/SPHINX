import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, ProtectedFreelancerRoute, ProtectedClientRoute } from "./context/AuthContext";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardOverview } from "./pages/DashboardOverview";
import { ClientsPage } from "./pages/ClientsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProposalsPage } from "./pages/ProposalsPage";
import { ContractsPage } from "./pages/ContractsPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { TimeTrackingPage } from "./pages/TimeTrackingPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ClientPortalPage } from "./pages/ClientPortalPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />

            {/* Client Portal Mode (Protected) */}
            <Route
              path="/portal/*"
              element={
                <ProtectedClientRoute>
                  <ClientPortalPage />
                </ProtectedClientRoute>
              }
            />

            {/* Freelancer SaaS Dashboard (/app/* and /workspace/*) */}
            <Route
              path="/app"
              element={
                <ProtectedFreelancerRoute>
                  <DashboardLayout />
                </ProtectedFreelancerRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="proposals" element={<ProposalsPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="time-tracking" element={<TimeTrackingPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Compatibility alias for /workspace/* */}
            <Route path="/workspace/*" element={<Navigate to="/app" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
