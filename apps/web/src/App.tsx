import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "./layouts/AppLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

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
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route
              path="incidents"
              element={
                <PlaceholderPage
                  title="Incident Management"
                  description="Monitor, triage, and resolve enterprise outages, incidents, and operational alerts."
                  moduleCode="MOD-INC"
                  targetSprint="Sprint 02"
                />
              }
            />
            <Route
              path="workforce"
              element={
                <PlaceholderPage
                  title="Workforce & Responders"
                  description="Manage on-call responders, shifts, departments, and personnel operational allocations."
                  moduleCode="MOD-WRK"
                  targetSprint="Sprint 03"
                />
              }
            />
            <Route
              path="assets"
              element={
                <PlaceholderPage
                  title="Asset & Infrastructure Inventory"
                  description="Track enterprise hardware, cloud instances, network switches, and critical infrastructure."
                  moduleCode="MOD-AST"
                  targetSprint="Sprint 03"
                />
              }
            />
            <Route
              path="departments"
              element={
                <PlaceholderPage
                  title="Departments & Teams"
                  description="Configure multi-tenant organizational structure, operational units, and department codes."
                  moduleCode="MOD-DEP"
                  targetSprint="Sprint 03"
                />
              }
            />
            <Route
              path="locations"
              element={
                <PlaceholderPage
                  title="Locations & Sites"
                  description="Manage physical data centers, office branches, and operational sites."
                  moduleCode="MOD-LOC"
                  targetSprint="Sprint 04"
                />
              }
            />
            <Route
              path="analytics"
              element={
                <PlaceholderPage
                  title="Analytics & SLA Reporting"
                  description="Operational velocity metrics, MTTR, MTTD, and SLA breach risk analytics."
                  moduleCode="MOD-ANL"
                  targetSprint="Sprint 04"
                />
              }
            />
            <Route
              path="settings"
              element={
                <PlaceholderPage
                  title="Settings & System Configuration"
                  description="Tenant configurations, API webhooks, Supabase auth parameters, and audit controls."
                  moduleCode="MOD-SET"
                  targetSprint="Sprint 05"
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
