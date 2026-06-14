import { AlertCircle, Database } from 'lucide-react';

/**
 * Reusable Chart Container Component
 * @param {object} props
 * @param {string} props.title - Card title
 * @param {string} [props.subtitle] - Card description/subtitle
 * @param {boolean} [props.isLoading] - Loading state flag
 * @param {Error|string|null} [props.error] - Error message or object
 * @param {boolean} [props.isEmpty] - Empty data flag
 * @param {number} [props.height] - Height of the chart container (default: 350)
 * @param {React.ReactNode} [props.actions] - Optional action buttons (like chart type toggles)
 * @param {React.ReactNode} props.children - Recharts components (ResponsiveContainer, etc.)
 * @param {Function} [props.onRetry] - Function to trigger retry on error
 */
export default function ChartCard({
  title,
  subtitle,
  isLoading = false,
  error = null,
  isEmpty = false,
  height = 350,
  actions,
  children,
  onRetry,
}) {
  return (
    <div className="glass-card p-5 md:p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="font-bold text-slate-100 text-base md:text-lg tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {actions && !isLoading && !error && !isEmpty && (
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            {actions}
          </div>
        )}
      </div>

      {/* Main Area */}
      <div className="relative flex-1" style={{ minHeight: `${height}px` }}>
        {isLoading && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 rounded-xl"
            style={{ height: `${height}px` }}
          >
            {/* Skeleton visual loader */}
            <div className="w-full h-full flex flex-col justify-end gap-3 px-4 py-2 animate-pulse">
              <div className="flex items-end justify-between h-4/5 gap-4">
                <div className="w-full bg-slate-800/40 rounded-t-lg" style={{ height: '30%' }}></div>
                <div className="w-full bg-slate-800/40 rounded-t-lg" style={{ height: '60%' }}></div>
                <div className="w-full bg-slate-800/40 rounded-t-lg" style={{ height: '45%' }}></div>
                <div className="w-full bg-slate-800/40 rounded-t-lg" style={{ height: '75%' }}></div>
                <div className="w-full bg-slate-800/40 rounded-t-lg" style={{ height: '50%' }}></div>
                <div className="w-full bg-slate-800/40 rounded-t-lg" style={{ height: '90%' }}></div>
                <div className="w-full bg-slate-800/40 rounded-t-lg" style={{ height: '40%' }}></div>
              </div>
              <div className="flex justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-500">
                <span>Loading Analytics...</span>
              </div>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-rose-950/5 border border-rose-900/10 rounded-xl"
            style={{ height: `${height}px` }}
          >
            <AlertCircle className="w-10 h-10 text-rose-400 mb-3 animate-bounce" />
            <h4 className="font-semibold text-slate-200 mb-1">Failed to load chart</h4>
            <p className="text-xs text-rose-300 max-w-xs mb-4">
              {typeof error === 'string' ? error : error.message || 'An unexpected error occurred.'}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-lg transition shadow-md shadow-rose-900/20"
              >
                Retry Request
              </button>
            )}
          </div>
        )}

        {isEmpty && !isLoading && !error && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-900/20 border border-slate-800/40 rounded-xl"
            style={{ height: `${height}px` }}
          >
            <Database className="w-10 h-10 text-slate-600 mb-3" />
            <h4 className="font-semibold text-slate-400 mb-1">No Data Available</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              There is currently no information available to populate this metric.
            </p>
          </div>
        )}

        {!isLoading && !error && !isEmpty && (
          <div style={{ height: `${height}px`, width: '100%' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
