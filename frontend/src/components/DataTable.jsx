import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Database, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Reusable Data Table Component
 * @param {object} props
 * @param {Array<object>} props.data - Array of data objects to display
 * @param {Array<{ key: string, label: string, render?: (val: any, row: any) => React.ReactNode, sortable?: boolean }>} props.columns - Columns configuration
 * @param {string} [props.searchPlaceholder] - Placeholder for search input
 * @param {string} [props.searchKey] - Object property to search on (e.g., 'product_name')
 * @param {boolean} [props.isLoading] - Loading state flag
 * @param {Error|string|null} [props.error] - Error state flag
 * @param {number} [props.defaultPageSize] - Number of items per page (default: 5)
 * @param {Function} [props.onRetry] - Function to trigger retry on error
 */
export default function DataTable({
  data = [],
  columns = [],
  searchPlaceholder = 'Search...',
  searchKey,
  isLoading = false,
  error = null,
  defaultPageSize = 5,
  onRetry,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Reset pagination on search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle header sorting click
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Filter
    if (searchQuery && searchKey) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const value = item[searchKey];
        return value ? String(value).toLowerCase().includes(query) : false;
      });
    }

    // 2. Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        
        const isNumeric = typeof aValue === 'number' && typeof bValue === 'number';
        
        if (isNumeric) {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          const aStr = String(aValue).toLowerCase();
          const bStr = String(bValue).toLowerCase();
          return sortConfig.direction === 'asc'
            ? aStr.localeCompare(bStr)
            : bStr.localeCompare(aStr);
        }
      });
    }

    return result;
  }, [data, searchQuery, searchKey, sortConfig]);

  // Paginate data
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  return (
    <div className="flex flex-col h-full">
      {/* Table Controls (Search & Page Size) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {searchKey && (
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition"
              disabled={isLoading || error}
            />
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-400 self-end sm:self-center">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-900/40 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500/80 cursor-pointer"
            disabled={isLoading || error}
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
          </select>
        </div>
      </div>

      {/* Main Table Wrapper */}
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/10">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/30">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && !isLoading && !error && requestSort(col.key)}
                    className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none ${
                      col.sortable !== false && !isLoading && !error ? 'cursor-pointer hover:text-slate-200 hover:bg-slate-800/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable !== false && !isLoading && !error && (
                        <span className="text-slate-600">
                          {sortConfig.key === col.key ? (
                            sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3 text-indigo-400" /> : <ChevronDown className="h-3 w-3 text-indigo-400" />
                          ) : (
                            <ChevronDown className="h-3 w-3 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton Loader
                Array.from({ length: pageSize }).map((_, rIdx) => (
                  <tr key={rIdx} className="border-b border-slate-800/40 last:border-0">
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-4 py-3.5">
                        <div className="h-3.5 bg-slate-800/60 rounded animate-pulse" style={{ width: cIdx === 0 ? '70%' : '50%' }}></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                // Error Screen
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-rose-400 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-300">Could not retrieve table data</span>
                      <p className="text-[11px] text-rose-300 max-w-xs">{error.message || 'An unexpected error occurred.'}</p>
                      {onRetry && (
                        <button
                          type="button"
                          onClick={onRetry}
                          className="mt-2 px-3 py-1 text-[10px] font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg transition"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Database className="w-8 h-8 text-slate-700" />
                      <span className="text-xs font-medium">No matches found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                paginatedData.map((row, idx) => {
                  const globalIndex = (currentPage - 1) * pageSize + idx;
                  return (
                    <tr 
                      key={idx} 
                      className="border-b border-slate-800/40 last:border-0 hover:bg-slate-800/10 transition group"
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3.5 text-xs text-slate-300 font-medium">
                          {col.render ? col.render(row[col.key], row, globalIndex) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && !error && processedData.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-300">{Math.min(processedData.length, (currentPage - 1) * pageSize + 1)}</span> to{' '}
            <span className="font-semibold text-slate-300">{Math.min(processedData.length, currentPage * pageSize)}</span> of{' '}
            <span className="font-semibold text-slate-300">{processedData.length}</span> entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/20 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, pIdx) => {
                const pageNum = pIdx + 1;
                // Simple logic to show current, adjacent pages, first and last
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={pIdx}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-2.5 py-1 rounded-lg border font-semibold transition ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-900/20'
                          : 'border-slate-800 bg-slate-900/20 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return <span key={pIdx} className="px-1 text-slate-600">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/20 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
