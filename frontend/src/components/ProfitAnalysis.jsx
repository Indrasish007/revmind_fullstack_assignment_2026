import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Percent, TrendingUp, DollarSign } from 'lucide-react';
import ChartCard from './ChartCard';

// Format currencies for tooltips and charts
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
};

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rev = payload[0].value;
    const cogs = payload[1].value;
    const profit = rev - cogs;
    const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3.5 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-slate-100 mb-2">{label}</p>
        <div className="flex flex-col gap-1.5 text-xs text-slate-300">
          <div className="flex justify-between items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              Net Revenue:
            </span>
            <span className="font-bold text-white">{formatCurrency(rev)}</span>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              COGS:
            </span>
            <span className="font-bold text-white">{formatCurrency(cogs)}</span>
          </div>
          <div className="h-px bg-slate-800/80 my-1"></div>
          <div className="flex justify-between items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Gross Profit:
            </span>
            <span className="font-bold text-emerald-400">{formatCurrency(profit)}</span>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Margin:
            </span>
            <span className="font-bold text-amber-400">{margin}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Profit Analysis Component (tabbed)
 * @param {object} props
 * @param {object} props.data - The Profit Analysis API response data
 * @param {boolean} props.isLoading - Loading state flag
 * @param {Error|string|null} props.error - Error state flag
 * @param {Function} props.onRetry - Retry function
 */
export default function ProfitAnalysis({ data, isLoading, error, onRetry }) {
  const [activeTab, setActiveTab] = useState('category'); // 'category' | 'subcategory' | 'channel'

  // Extract the specific dataset based on active tab
  const tabData = useMemo(() => {
    if (!data) return [];
    if (activeTab === 'category') return data.by_category || [];
    if (activeTab === 'subcategory') return data.by_subcategory || [];
    if (activeTab === 'channel') return data.by_channel || [];
    return [];
  }, [data, activeTab]);

  const tabs = [
    { id: 'category', label: 'By Category' },
    { id: 'subcategory', label: 'By Subcategory' },
    { id: 'channel', label: 'By Sales Channel' },
  ];

  return (
    <ChartCard
      title="Profit Margin & Cost Analysis"
      subtitle="Compare net revenues, cost of goods sold, and gross margins across segments"
      isLoading={isLoading}
      error={error}
      isEmpty={!isLoading && (!data || tabData.length === 0)}
      height={460}
      onRetry={onRetry}
      actions={
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full items-stretch">
        {/* Recharts Bar Chart (Left 3 cols on lg) */}
        <div className="lg:col-span-3 h-[280px] lg:h-full min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tabData}
              margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorCOGS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(tick) => `$${tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
              />
              <Bar name="Net Revenue" dataKey="net_revenue" fill="url(#colorRev)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar name="COGS" dataKey="cogs" fill="url(#colorCOGS)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Structured Margin Summary (Right 2 cols on lg) */}
        <div className="lg:col-span-2 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-800/60 lg:pl-6 pt-6 lg:pt-0">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-indigo-400" />
            Margin Breakdown
          </h4>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {tabData.map((item, index) => {
              const profit = item.net_revenue - item.cogs;
              const margin = item.net_revenue > 0 ? ((profit / item.net_revenue) * 100).toFixed(1) : 0;
              
              // Color badges based on margin size
              let marginColor = 'text-indigo-400';
              let marginBg = 'bg-indigo-500/10 border-indigo-500/20';
              if (margin >= 45) {
                marginColor = 'text-emerald-400';
                marginBg = 'bg-emerald-500/10 border-emerald-500/20';
              } else if (margin < 30) {
                marginColor = 'text-rose-400';
                marginBg = 'bg-rose-500/10 border-rose-500/20';
              } else if (margin >= 38) {
                marginColor = 'text-cyan-400';
                marginBg = 'bg-cyan-500/10 border-cyan-500/20';
              }

              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/60 transition duration-200"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-200 truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 shrink-0" />
                      Profit: {formatCurrency(profit)}
                    </span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold shrink-0 flex items-center gap-1 ${marginBg} ${marginColor}`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    {margin}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
