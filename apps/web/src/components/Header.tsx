import { Menu, Sparkles, User } from "lucide-react";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";
import { NotificationDropdown } from "./NotificationDropdown";
import { Button } from "./ui/button";

interface HeaderProps {
  onMenuToggle: () => void;
  onReplayIntro?: () => void;
}

export function Header({ onMenuToggle, onReplayIntro }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-[#0B0F17]/95 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden text-muted-foreground"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span>OPERATIONS</span>
          <span>/</span>
          <span className="text-foreground font-semibold">ENTERPRISE COMMAND</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Replay Cinematic Intro button */}
        {onReplayIntro && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReplayIntro}
            className="text-xs text-muted-foreground hover:text-cyan-400 gap-1.5 hidden md:flex h-8 px-2.5 font-mono"
            title="Replay Cinematic Intro"
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>Intro</span>
          </Button>
        )}

        {/* Real-time Backend Connection Indicator */}
        <ConnectionStatusBadge />

        <div className="h-4 w-px bg-border hidden sm:block" />

        {/* Real-time Notification Dropdown */}
        <NotificationDropdown />

        <div className="h-4 w-px bg-border hidden sm:block" />

        {/* Operations Lead Avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary border border-border text-xs font-medium text-muted-foreground">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-medium text-foreground hidden md:inline">
            Incident Commander
          </span>
        </div>
      </div>
    </header>
  );
}
