import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Reusable KPI Card Component
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
  description,
  trend,
  trendDirection = 'neutral',
  colorScheme = 'indigo',
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 relative overflow-hidden animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="h-4 w-28 bg-slate-800 rounded"></div>
          <div className="h-10 w-10 bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-8 w-36 bg-slate-800 rounded mb-2"></div>
        <div className="h-3 w-48 bg-slate-800 rounded"></div>
      </div>
    );
  }

  // Scheme color styling mappings
  const schemeClasses = {
    indigo: {
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      glow: 'shadow-indigo-500/5',
      textGradient: 'text-gradient-purple',
    },
    cyan: {
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'shadow-cyan-500/5',
      textGradient: 'text-gradient-cyan',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'shadow-emerald-500/5',
      textGradient: 'text-gradient-emerald',
    },
    gold: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'shadow-amber-500/5',
      textGradient: 'text-gradient-gold',
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'shadow-rose-500/5',
      textGradient: 'text-rose-400',
    },
    violet: {
      iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      glow: 'shadow-violet-500/5',
      textGradient: 'text-violet-400',
    },
  };

  const scheme = schemeClasses[colorScheme] || schemeClasses.indigo;

  return (
    <div className={`glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-full shadow-lg ${scheme.glow}`}>
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-slate-800/10 via-transparent to-transparent -mr-12 -mt-12 pointer-events-none rounded-full" />
      
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
            {title}
          </span>
          {Icon && (
            <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${scheme.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${scheme.textGradient}`}>
            {value}
          </span>
          {description && (
            <span className="text-xs text-slate-400 font-medium truncate">
              {description}
            </span>
          )}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs">
          {trendDirection === 'up' && (
            <span className="flex items-center gap-0.5 font-semibold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              {trend}
            </span>
          )}
          {trendDirection === 'down' && (
            <span className="flex items-center gap-0.5 font-semibold text-rose-400">
              <TrendingDown className="w-3.5 h-3.5" />
              {trend}
            </span>
          )}
          {trendDirection === 'neutral' && (
            <span className="flex items-center gap-0.5 font-medium text-slate-400">
              <Minus className="w-3.5 h-3.5" />
              {trend}
            </span>
          )}
          <span className="text-slate-500 font-normal">vs prior period</span>
        </div>
      )}
    </div>
  );
}
