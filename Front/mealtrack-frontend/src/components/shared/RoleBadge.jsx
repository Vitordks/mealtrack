import { Badge } from "@/components/ui/badge";
import { NIVEL_ACESSO_BADGE } from "@/utils/enumLabels";

/** @param {{ nivelAcesso: string }} props */
export function RoleBadge({ nivelAcesso }) {
  const meta = NIVEL_ACESSO_BADGE[nivelAcesso] ?? { label: nivelAcesso, variant: "outline" };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
