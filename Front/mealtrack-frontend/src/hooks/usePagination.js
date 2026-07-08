import { useMemo, useState } from "react";

import { DEFAULT_PAGE_SIZE } from "@/config/app";

/**
 * Pagina um array em memória. Necessário porque nenhum endpoint da API
 * (GET /usuarios, /alimentos, /refeicoes, /producoes, /restaurantes)
 * suporta paginação por query param — todos retornam a lista inteira.
 *
 * @param {unknown[]} items
 * @param {number} pageSize
 */
export function usePagination(items, pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  return {
    page: safePage,
    totalPages,
    setPage,
    paginatedItems,
    goToNextPage: () => setPage((current) => Math.min(current + 1, totalPages)),
    goToPreviousPage: () => setPage((current) => Math.max(current - 1, 1)),
  };
}
