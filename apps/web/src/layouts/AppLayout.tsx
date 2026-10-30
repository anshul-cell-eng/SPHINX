import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { CinematicIntro } from "../components/CinematicIntro";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("nexus_sidebar_collapsed") === "true";
  });
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check if first visit of the session
    const hasSeen = sessionStorage.getItem("nexus_intro_viewed");
    if (!hasSeen) {
      setShowIntro(true);
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("nexus_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <>
      {showIntro && (
        <CinematicIntro
          onComplete={() => setShowIntro(false)}
          forceShow={showIntro}
        />
      )}

      <div className="flex min-h-screen bg-background text-foreground font-sans">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
          <Header
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            onReplayIntro={() => setShowIntro(true)}
          />
          <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
