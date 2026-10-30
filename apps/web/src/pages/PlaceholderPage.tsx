import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

interface PlaceholderPageProps {
  title: string;
  description: string;
  moduleCode: string;
  targetSprint: string;
}

export function PlaceholderPage({
  title,
  description,
  moduleCode,
  targetSprint,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground uppercase">
              {title}
            </h1>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              {moduleCode}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <Link to="/">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <ArrowLeft className="h-3 w-3" />
            Back to Overview
          </Button>
        </Link>
      </div>

      <Card className="border-border/80 bg-card/40 max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <CardTitle className="text-sm font-semibold">
                Feature Roadmap Placement
              </CardTitle>
            </div>
            <Badge variant="warning" className="text-[10px] font-mono">
              {targetSprint}
            </Badge>
          </div>
          <CardDescription className="text-xs mt-1">
            This module interface is provisioned as an architectural boundary in Sprint 01. Full business logic, data models, and API endpoints will be connected in {targetSprint}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="rounded border border-border/60 bg-background/50 p-3 text-xs space-y-1.5 font-mono text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Architectural Constraints
            </div>
            <p>• Multi-tenant database schema prepared in Prisma</p>
            <p>• Contract schemas will reside in @nexus/contracts</p>
            <p>• Protected by server-side authorization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
