import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/** @param {{ page: number, totalPages: number, onPrevious: () => void, onNext: () => void, totalItems: number }} props */
export function Pagination({ page, totalPages, onPrevious, onNext, totalItems }) {
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <p className="text-sm text-muted-foreground">
        Página <span className="font-medium text-foreground">{page}</span> de{" "}
        <span className="font-medium text-foreground">{totalPages}</span> ·{" "}
        {totalItems} {totalItems === 1 ? "registro" : "registros"}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={page <= 1}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Próxima
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
