import { useState, useRef, useEffect } from "react";
import { useMockStore, AppNotification } from "@/lib/mock-store";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useMockStore();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Esc
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative text-muted-foreground hover:text-foreground h-8 w-8"
        aria-label="System notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
            {unreadNotificationsCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-xl border border-border bg-[#0E1422] p-4 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold font-mono text-foreground uppercase tracking-wider">
                Notifications
              </h4>
              {unreadNotificationsCount > 0 && (
                <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-mono text-rose-400 font-semibold border border-rose-500/30">
                  {unreadNotificationsCount} Unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={markAllNotificationsRead}
                disabled={unreadNotificationsCount === 0}
                className="text-muted-foreground hover:text-foreground p-1 text-xs transition-colors disabled:opacity-30"
                title="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={clearNotifications}
                disabled={notifications.length === 0}
                className="text-muted-foreground hover:text-rose-400 p-1 text-xs transition-colors disabled:opacity-30"
                title="Clear all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 py-2 divide-y divide-border/30">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground font-mono">
                No notifications to display.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                    notif.unread
                      ? "bg-secondary/40 hover:bg-secondary/70"
                      : "hover:bg-secondary/20 opacity-80"
                  }`}
                >
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-foreground truncate">
                        {notif.title}
                      </p>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                  </div>
                  {notif.unread && (
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border/60 pt-2 text-center">
            <span className="text-[10px] font-mono text-muted-foreground">
              Real-time In-Memory Incident Alerts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
