import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * @param {{ label: string, htmlFor: string, error?: string, required?: boolean, children: React.ReactNode, className?: string }} props
 */
export function FormField({ label, htmlFor, error, required, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
