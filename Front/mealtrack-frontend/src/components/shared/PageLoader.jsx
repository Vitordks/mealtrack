import { Loader2 } from "lucide-react";

export function PageLoader({ label = "Carregando..." }) {
  return (
    <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
