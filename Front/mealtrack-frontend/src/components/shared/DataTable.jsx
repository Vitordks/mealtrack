import { useMemo, useState } from "react";

import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

/**
 * @template T
 * @param {{
 *   columns: { key: string, header: string, render: (item: T) => React.ReactNode, className?: string }[],
 *   data: T[],
 *   getRowId: (item: T) => string | number,
 *   isLoading?: boolean,
 *   error?: string | null,
 *   onRetry?: () => void,
 *   searchPlaceholder?: string,
 *   searchFn?: (item: T, query: string) => boolean,
 *   emptyTitle?: string,
 *   emptyDescription?: string,
 *   renderActions?: (item: T) => React.ReactNode,
 *   toolbarActions?: React.ReactNode,
 * }} props
 */
export function DataTable({
  columns,
  data,
  getRowId,
  isLoading = false,
  error = null,
  onRetry,
  searchPlaceholder = "Buscar...",
  searchFn,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription,
  renderActions,
  toolbarActions,
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const filteredData = useMemo(() => {
    if (!debouncedSearch || !searchFn) return data;
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return data;
    return data.filter((item) => searchFn(item, query));
  }, [data, debouncedSearch, searchFn]);

  const { page, totalPages, paginatedItems, goToNextPage, goToPreviousPage } =
    usePagination(filteredData);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchFn ? (
          <SearchInput value={search} onChange={setSearch} placeholder={searchPlaceholder} />
        ) : (
          <div />
        )}
        {toolbarActions}
      </div>

      {error ? (
        <ErrorState description={error} onRetry={onRetry} />
      ) : isLoading ? (
        <TableSkeleton columns={columns.length + (renderActions ? 1 : 0)} />
      ) : filteredData.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {renderActions ? <TableHead className="w-px" /> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow key={getRowId(item)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(item)}
                  </TableCell>
                ))}
                {renderActions ? (
                  <TableCell className="w-px">{renderActions(item)}</TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!isLoading && !error && filteredData.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filteredData.length}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
        />
      )}
    </div>
  );
}
