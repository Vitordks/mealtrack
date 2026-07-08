import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * @param {{ label: string, value: React.ReactNode, icon: React.ComponentType, isLoading?: boolean, hint?: string, accent?: "primary"|"success"|"warning"|"destructive" }} props
 */
export function StatCard({ label, value, icon: Icon, isLoading, hint, accent = "primary" }) {
  const accentClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          )}
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", accentClasses[accent])}>
          <Icon className="size-4.5" />
        </div>
      </CardContent>
    </Card>
  );
}
