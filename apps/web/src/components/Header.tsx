import { Menu, Bell, User } from "lucide-react";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";
import { Button } from "./ui/button";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
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
          <span>PLATFORM</span>
          <span>/</span>
          <span className="text-foreground font-semibold">COMMAND CENTER</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Real-time Backend Connection Indicator */}
        <ConnectionStatusBadge />

        <div className="h-4 w-px bg-border hidden sm:block" />

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
            aria-label="System notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2.5 pl-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary border border-border text-xs font-medium text-muted-foreground">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium text-foreground hidden md:inline">
              Operations Lead
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
