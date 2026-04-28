import React from "react";
import Pagination from "../Utils/Pagination";

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

interface ConfigurableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  totalCount?: number;
  offset?: number;
  limit?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  emptyMessage?: string;
}

function ConfigurableTable<T>({
  columns,
  data,
  totalCount = 0,
  offset = 0,
  limit = 10,
  onNextPage,
  onPrevPage,
  emptyMessage = "No results found",
}: ConfigurableTableProps<T>) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg shadow-sm">
        {data.length > 0 ? (
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC]">
              <tr className="text-[#1E293B] font-semibold text-xl border-b border-[#E2E8F0]">
                {columns.map((col) => (
                  <th
                    key={col.key as string}
                    className={`py-4 px-6 font-bold whitespace-nowrap ${
                      col.width ? col.width : ""
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#475569] text-xl">
              {data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-white border-b border-[#E2E8F0] last:border-b-0 hover:bg-gray-50/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className="py-4 px-6 whitespace-nowrap"
                    >
                      {col.render
                        ? col.render(item)
                        : (item[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="text-[15px] font-roboto font-medium text-gray-500">
              {emptyMessage}
            </div>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalCount > 0 && (
        <Pagination
          currentStartIndex={offset + 1}
          totalItems={totalCount}
          itemsPerPage={limit}
          onPrevPage={onPrevPage || (() => {})}
          onNextPage={onNextPage || (() => {})}
          isFirstPage={offset === 0}
          isLastPage={offset + limit >= totalCount}
        />
      )}
    </div>
  );
}

export default ConfigurableTable;
