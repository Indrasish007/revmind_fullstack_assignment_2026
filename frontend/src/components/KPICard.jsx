import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Compact & Information-dense Reusable KPI Card Component
 * @param {object} props
 * @param {string} props.title - Card title / label
 * @param {string|number} props.value - Primary value to display
 * @param {React.ElementType} props.icon - Lucide Icon component
 * @param {string} [props.description] - Subtitle or additional context
 * @param {string|number} [props.trend] - Percentage or text representing trend
 * @param {'up'|'down'|'neutral'} [props.trendDirection] - Color style for the trend
 * @param {'indigo'|'cyan'|'emerald'|'gold'|'rose'|'violet'} [props.colorScheme] - Primary color accents
 * @param {boolean} [props.isLoading] - Renders a skeleton loader instead of content
 */
export default function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  colorScheme = 'indigo',
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="glass-card p-4.5 rounded-xl border border-slate-800/40 bg-slate-900/10 flex flex-col justify-between min-h-[105px] h-auto animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-3 w-20 bg-slate-800/80 rounded"></div>
          <div className="h-6 w-6 bg-slate-800/85 rounded-lg"></div>
        </div>
        <div className="h-7 w-28 bg-slate-800/80 rounded mt-2"></div>
      </div>
    );
  }

  // Color scheme style definitions
  const schemeClasses = {
    indigo: {
      border: 'hover:border-indigo-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.08)]',
      icon: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    cyan: {
      border: 'hover:border-cyan-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]',
      icon: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    emerald: {
      border: 'hover:border-emerald-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]',
      icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    gold: {
      border: 'hover:border-amber-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]',
      icon: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    rose: {
      border: 'hover:border-rose-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.08)]',
      icon: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    violet: {
      border: 'hover:border-violet-500/30',
      glow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]',
      icon: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
  };

  const scheme = schemeClasses[colorScheme] || schemeClasses.indigo;

  // Trend background and text color coding
  const trendClasses = {
    up: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    down: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    neutral: 'text-slate-400 bg-slate-800/40 border-slate-700/50'
  };

  const trendClass = trendClasses[trendDirection] || trendClasses.neutral;

  return (
    <div className={`glass-card p-4.5 rounded-xl border border-slate-800/80 bg-slate-900/15 relative overflow-hidden flex flex-col justify-between min-h-[105px] h-auto transition-all duration-300 shadow-md ${scheme.border} ${scheme.glow}`}>
      
      {/* Top row: Label & Icon */}
      <div className="flex justify-between items-start gap-4">
        <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-slate-500 uppercase select-none truncate">
          {title}
        </span>
        {Icon && (
          <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${scheme.icon}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Bottom row: Value & Trend Change */}
      <div className="flex items-baseline justify-between gap-3 mt-3">
        <span className="text-xl md:text-2xl font-black tracking-tight text-white whitespace-normal break-words min-w-0">
          {value}
        </span>
        {trend && (
          <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold flex items-center gap-0.5 shrink-0 ${trendClass}`}>
            {trendDirection === 'up' && <TrendingUp className="w-3 h-3" />}
            {trendDirection === 'down' && <TrendingDown className="w-3 h-3" />}
            {trendDirection === 'neutral' && <Minus className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>

    </div>
  );
}
