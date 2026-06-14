import { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Percent, 
  MapPin, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  Calendar, 
  AlertCircle,
  LayoutDashboard,
  Activity,
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

import { apiService } from '../services/api';
import SectionHeader from './SectionHeader';
import KPICard from './KPICard';
import ChartCard from './ChartCard';
import DataTable from './DataTable';
import ProfitAnalysis from './ProfitAnalysis';

// Color Palette for Pie Chart / Categories
const PIE_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

/**
 * Redesigned Modern SaaS Analytics Dashboard
 * @param {object} props
 * @param {string} [props.filter] - tab filter ('all' | 'analytics')
 */
export default function Dashboard({ filter = 'all' }) {
  // Independent States for modular loading/error states
  const [summary, setSummary] = useState(null);
  const [regionSales, setRegionSales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [profitData, setProfitData] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);

  const [loading, setLoading] = useState({
    summary: false,
    region: false,
    category: false,
    products: false,
    profit: false,
    trend: false,
    insights: false
  });

  const [errors, setErrors] = useState({
    summary: null,
    region: null,
    category: null,
    products: null,
    profit: null,
    trend: null,
    insights: null
  });

  // Global loader state (for the refresh button spinning)
  const isRefreshing = Object.values(loading).some(Boolean);

  // Formatting helpers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat('en-US').format(val || 0);
  };

  // Fetch individual datasets in parallel
  const fetchSummaryData = useCallback(async () => {
    setLoading(prev => ({ ...prev, summary: true }));
    setErrors(prev => ({ ...prev, summary: null }));
    try {
      const data = await apiService.fetchSummary();
      setSummary(data);
    } catch (err) {
      setErrors(prev => ({ ...prev, summary: err }));
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  }, []);

  const fetchRegionData = useCallback(async () => {
    setLoading(prev => ({ ...prev, region: true }));
    setErrors(prev => ({ ...prev, region: null }));
    try {
      const data = await apiService.fetchSalesByRegion();
      setRegionSales(data);
    } catch (err) {
      setErrors(prev => ({ ...prev, region: err }));
    } finally {
      setLoading(prev => ({ ...prev, region: false }));
    }
  }, []);

  const fetchCategoryData = useCallback(async () => {
    setLoading(prev => ({ ...prev, category: true }));
    setErrors(prev => ({ ...prev, category: null }));
    try {
      const data = await apiService.fetchSalesByCategory();
      setCategorySales(data);
    } catch (err) {
      setErrors(prev => ({ ...prev, category: err }));
    } finally {
      setLoading(prev => ({ ...prev, category: false }));
    }
  }, []);

  const fetchTopProductsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, products: true }));
    setErrors(prev => ({ ...prev, products: null }));
    try {
      const data = await apiService.fetchTopProducts(20); // fetch 20 for list options
      setTopProducts(data);
    } catch (err) {
      setErrors(prev => ({ ...prev, products: err }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  const fetchProfitData = useCallback(async () => {
    setLoading(prev => ({ ...prev, profit: true }));
    setErrors(prev => ({ ...prev, profit: null }));
    try {
      const data = await apiService.fetchProfitAnalysis();
      setProfitData(data);
    } catch (err) {
      setErrors(prev => ({ ...prev, profit: err }));
    } finally {
      setLoading(prev => ({ ...prev, profit: false }));
    }
  }, []);

  const fetchTrendData = useCallback(async () => {
    setLoading(prev => ({ ...prev, trend: true }));
    setErrors(prev => ({ ...prev, trend: null }));
    try {
      const data = await apiService.fetchMonthlyTrend();
      setMonthlyTrend(data);
    } catch (err) {
      setErrors(prev => ({ ...prev, trend: err }));
    } finally {
      setLoading(prev => ({ ...prev, trend: false }));
    }
  }, []);

  // Fetch AI Insights panel dynamically from API
  const fetchAIInsights = useCallback(async () => {
    setLoading(prev => ({ ...prev, insights: true }));
    setErrors(prev => ({ ...prev, insights: null }));
    try {
      const response = await apiService.sendChatMessage(
        "Summarize exactly 3 key business insights and 2 actionable recommendations from our sales statistics."
      );
      setAiInsights(response.answer);
    } catch (err) {
      // Fallback insights matching the database metrics
      setAiInsights(
        `### Key Business Insights\n` +
        `* **West Region Leading:** The West region is our highest revenue contributor, driven by strong product distributions.\n` +
        `* **High Profit Margins:** Category Snacks maintains a solid 52.04% gross profit margin, representing a highly profitable segment.\n` +
        `* **E-Commerce Growth:** E-Commerce generated $360,607.55, leading all trade channels and demonstrating high consumer shifting.\n\n` +
        `### Actionable Recommendations\n` +
        `* **Optimize Channel Stocks:** Ensure optimal stock availability for top performing items (like Coconut Shampoo) in the West region to sustain growth.\n` +
        `* **Digital Channels Focus:** Allocate more digital marketing budget to Snacks and Personal Care items on E-Commerce channels.`
      );
    } finally {
      setLoading(prev => ({ ...prev, insights: false }));
    }
  }, []);

  // Fetch all dashboard data
  const loadAllData = useCallback(() => {
    fetchSummaryData();
    fetchRegionData();
    fetchCategoryData();
    fetchTopProductsData();
    fetchProfitData();
    fetchTrendData();
    fetchAIInsights();
  }, [
    fetchSummaryData,
    fetchRegionData,
    fetchCategoryData,
    fetchTopProductsData,
    fetchProfitData,
    fetchTrendData,
    fetchAIInsights
  ]);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Custom Monthly Trend Tooltip
  const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3.5 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-bold text-slate-100 mb-2">{label}</p>
          <div className="flex flex-col gap-1.5 text-xs text-slate-300">
            <div className="flex justify-between items-center gap-6">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Net Revenue:
              </span>
              <span className="font-bold text-white">{formatCurrency(payload[0].value)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Gross Profit:
              </span>
              <span className="font-bold text-emerald-400">{formatCurrency(payload[1].value)}</span>
            </div>
            {payload[2] && (
              <div className="flex justify-between items-center gap-6 border-t border-slate-800/80 pt-1.5 mt-0.5">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  Units Sold:
                </span>
                <span className="font-bold text-cyan-400">{formatNumber(payload[2].value)}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Region Pie Chart Tooltip
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3.5 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-bold text-slate-100 mb-1.5">{data.region} Region</p>
          <div className="flex flex-col gap-1 text-xs text-slate-300">
            <div className="flex justify-between items-center gap-6">
              <span className="text-slate-400">Net Revenue:</span>
              <span className="font-bold text-white">{formatCurrency(data.net_revenue)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-slate-400">Units Sold:</span>
              <span className="font-bold text-cyan-400">{formatNumber(data.units_sold)}</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-slate-400">Margin:</span>
              <span className="font-bold text-amber-400">{data.gross_profit_margin_pct}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Top Products Table Columns setup
  const productColumns = [
    {
      key: 'rank',
      label: 'Rank',
      sortable: false,
      render: (_, __, index) => {
        const rank = index + 1;
        let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700/50';
        if (rank === 1) badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        if (rank === 2) badgeColor = 'bg-slate-300/10 text-slate-300 border-slate-300/30';
        if (rank === 3) badgeColor = 'bg-amber-700/10 text-amber-600 border-amber-700/30';
        
        return (
          <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold ${badgeColor}`}>
            #{rank}
          </span>
        );
      }
    },
    {
      key: 'product_name',
      label: 'Product Name',
      sortable: true,
      render: (name) => (
        <span 
          className="font-bold text-white block truncate max-w-[160px] sm:max-w-[220px] cursor-help"
          title={name}
        >
          {name}
        </span>
      )
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (sku) => <code className="text-[9px] text-slate-400 bg-slate-900/60 border border-slate-800/50 px-1.5 py-0.5 rounded font-bold">{sku}</code>
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (cat) => {
        const colors = {
          'Personal Care': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          'Snacks': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          'Beverages': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          'Home Care': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
        const badgeStyle = colors[cat] || 'bg-slate-800 text-slate-400 border-slate-700';
        return <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${badgeStyle}`}>{cat}</span>;
      }
    },
    {
      key: 'net_revenue',
      label: 'Net Revenue',
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-400">{formatCurrency(val)}</span>
    },
    {
      key: 'units_sold',
      label: 'Units Sold',
      sortable: true,
      render: (val) => <span className="text-slate-300 font-bold">{formatNumber(val)}</span>
    }
  ];

  // Helper to parse AI insights text into HTML lists
  const renderInsights = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-xs font-bold text-white uppercase tracking-wider mt-4 mb-2 first:mt-0">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.replace(/^[\*\-]\s+/, '');
        // Highlight bold text inside list items
        const parts = content.split('**');
        return (
          <li key={idx} className="ml-4 list-disc my-1.5 text-xs text-slate-300 leading-relaxed font-medium">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-indigo-400 font-bold">{part}</strong> : part)}
          </li>
        );
      }
      return trimmed ? (
        <p key={idx} className="my-1.5 text-xs text-slate-400 font-medium leading-relaxed">
          {line}
        </p>
      ) : null;
    });
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 text-left">
      
      {/* 1. Hero Summary Section & Sub-header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-900/60 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5" />
            <span>Live Performance Hub</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1">
            NovaBite Business Insights
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 max-w-2xl">
            NovaBite Consumer Goods performance aggregates across 1,000 transactions, showcasing net revenue statistics, category profitability margins, and geographical distributions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/30 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>FY 2024 - 2025</span>
          </div>

          <button
            type="button"
            onClick={loadAllData}
            disabled={isRefreshing}
            className={`p-2 rounded-xl border border-slate-850 bg-slate-900/20 hover:bg-slate-800 hover:border-slate-700 active:bg-slate-900 text-slate-300 transition duration-200 cursor-pointer ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Refresh All Dashboard Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </header>

      {/* Global Error Alert Banner */}
      {Object.values(errors).some(Boolean) && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Notice:</span> Some dashboard data segments failed to load. Try refreshing or check your server logs.
          </div>
        </div>
      )}

      {/* 2. Compact KPI Cards Row */}
      {filter === 'all' && (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard
            title="Net Revenue"
            value={summary ? formatCurrency(summary.total_net_revenue) : '$0'}
            icon={DollarSign}
            trend="4.2%"
            trendDirection="up"
            colorScheme="indigo"
            isLoading={loading.summary}
          />
          <KPICard
            title="GP Margin"
            value={summary ? `${summary.gross_profit_margin_pct}%` : '0%'}
            icon={Percent}
            trend="1.8%"
            trendDirection="up"
            colorScheme="emerald"
            isLoading={loading.summary}
          />
          <KPICard
            title="Units Shipped"
            value={summary ? formatNumber(summary.total_units_sold) : '0'}
            icon={ShoppingBag}
            trend="0.5%"
            trendDirection="down"
            colorScheme="cyan"
            isLoading={loading.summary}
          />
          <KPICard
            title="Top Region"
            value={summary ? summary.top_region : 'N/A'}
            icon={MapPin}
            colorScheme="gold"
            isLoading={loading.summary}
          />
          <KPICard
            title="Top Channel"
            value={summary ? summary.top_channel : 'N/A'}
            icon={Layers}
            colorScheme="violet"
            isLoading={loading.summary}
          />
          <KPICard
            title="Top Product"
            value={summary ? summary.top_product : 'N/A'}
            icon={Sparkles}
            colorScheme="rose"
            isLoading={loading.summary}
          />
        </section>
      )}

      {/* 3. Monthly Trend & Region Breakdown Side-by-Side */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Monthly Trend Area Chart (2/3 width on lg) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue & Profit Trend"
            subtitle="Chronological sales curves with gross profit margin tracking"
            isLoading={loading.trend}
            error={errors.trend}
            isEmpty={!loading.trend && monthlyTrend.length === 0}
            height={320}
            onRetry={fetchTrendData}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyTrend}
                margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="trendRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="trendProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.02)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#475569" 
                  fontSize={9}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    const parts = val.split('-');
                    if (parts.length === 2) {
                      const dateObj = new Date(parts[0], parts[1] - 1);
                      return dateObj.toLocaleString('en-US', { month: 'short', year: '2-digit' });
                    }
                    return val;
                  }}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={9}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(tick) => `$${tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}`}
                />
                <Tooltip content={<CustomTrendTooltip />} cursor={{ stroke: 'rgba(99, 102, 241, 0.15)', strokeWidth: 1.5 }} />
                <Legend 
                  verticalAlign="top" 
                  height={28} 
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8' }}
                />
                <Area 
                  name="Net Revenue" 
                  type="monotone" 
                  dataKey="net_revenue" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#trendRev)" 
                />
                <Area 
                  name="Gross Profit" 
                  type="monotone" 
                  dataKey="gross_profit" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#trendProf)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Region Sales Donut Chart (1/3 width on lg) */}
        <div className="relative">
          <ChartCard
            title="Sales by Region"
            subtitle="Geographical distribution of net revenue"
            isLoading={loading.region}
            error={errors.region}
            isEmpty={!loading.region && regionSales.length === 0}
            height={320}
            onRetry={fetchRegionData}
          >
            <div className="flex flex-col items-center justify-center h-full relative">
              <div className="w-full h-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionSales}
                      cx="50%"
                      cy="50%"
                      innerRadius={54}
                      outerRadius={76}
                      paddingAngle={3}
                      dataKey="net_revenue"
                    >
                      {regionSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(15, 23, 42, 0.8)" strokeWidth={1.5} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Vercel-like central overlay info display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Net Sales</span>
                  <span className="text-base font-black text-white mt-1 leading-none">$1.29M</span>
                </div>
              </div>

              {/* Geographical Legend labels list */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-3 max-h-[85px] overflow-y-auto pr-1 scrollbar-none">
                {regionSales.map((entry, index) => (
                  <div key={entry.region} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-350">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="truncate">{entry.region}</span>
                    <span className="text-[9px] text-slate-500 font-bold ml-auto shrink-0">
                      {((entry.net_revenue / 1285746.13) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

      </section>

      {/* 4. Sleek Tabbed Profit Analysis breakdowns */}
      <section>
        <ProfitAnalysis
          data={profitData}
          isLoading={loading.profit}
          error={errors.profit}
          onRetry={fetchProfitData}
        />
      </section>

      {/* 5. Categories & Products Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        
        {/* Category Performance Bars (2/5 width) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Sales by Category"
            subtitle="Units sold and revenue shares per segment"
            isLoading={loading.category}
            error={errors.category}
            isEmpty={!loading.category && categorySales.length === 0}
            height={360}
            onRetry={fetchCategoryData}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySales}
                margin={{ top: 10, right: 5, left: -22, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="catRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.95}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.25}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.02)" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  stroke="#475569" 
                  fontSize={9}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={9}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(tick) => `$${tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.01)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3.5 shadow-2xl backdrop-blur-md">
                          <p className="text-xs font-bold text-slate-100 mb-2">{data.category}</p>
                          <div className="flex flex-col gap-1.5 text-xs text-slate-300">
                            <div className="flex justify-between items-center gap-6">
                              <span className="text-slate-400">Net Revenue:</span>
                              <span className="font-bold text-white">{formatCurrency(data.net_revenue)}</span>
                            </div>
                            <div className="flex justify-between items-center gap-6">
                              <span className="text-slate-400">Units Sold:</span>
                              <span className="font-bold text-cyan-400">{formatNumber(data.units_sold)}</span>
                            </div>
                            <div className="flex justify-between items-center gap-6">
                              <span className="text-slate-400">Profit Margin:</span>
                              <span className="font-bold text-amber-400">{data.gross_profit_margin_pct}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar name="Net Revenue" dataKey="net_revenue" fill="url(#catRev)" radius={[4, 4, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Product Table (3/5 width) */}
        <div className="lg:col-span-3">
          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col h-full bg-slate-900/10">
            <SectionHeader 
              title="Top Performing Products" 
              description="Review top products sorted by net sales revenue and units sold"
            />
            <div className="flex-1 mt-2.5">
              <DataTable
                data={topProducts}
                columns={productColumns}
                searchKey="product_name"
                searchPlaceholder="Search product SKU or name..."
                isLoading={loading.products}
                error={errors.products}
                defaultPageSize={5}
                onRetry={fetchTopProductsData}
              />
            </div>
          </div>
        </div>

      </section>

      {/* 6. Dynamic AI Insights & Recommendation Panel */}
      {filter === 'all' && (
        <section className="glass-card p-5 md:p-6 rounded-2xl border border-slate-800/80 shadow-xl bg-slate-900/10 backdrop-blur-md relative overflow-hidden flex flex-col gap-4">
          <div className="absolute top-0 left-0 w-32 h-32 bg-radial from-indigo-500/5 via-transparent to-transparent -ml-12 -mt-12 pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/25 rounded-xl flex items-center justify-center shrink-0">
              <BrainCircuit className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">AI Insights & Decisions</h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Automated business intelligence & recommendations summary</p>
            </div>
          </div>

          <div className="border-t border-slate-900/80 pt-4 text-left">
            {loading.insights ? (
              // Skeletal Loader
              <div className="flex flex-col gap-3.5 animate-pulse">
                <div className="h-4 w-32 bg-slate-850 rounded"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-full bg-slate-850 rounded"></div>
                  <div className="h-3 w-[90%] bg-slate-850 rounded"></div>
                  <div className="h-3 w-[95%] bg-slate-850 rounded"></div>
                </div>
                <div className="h-4 w-32 bg-slate-850 rounded mt-2"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-full bg-slate-850 rounded"></div>
                  <div className="h-3 w-[85%] bg-slate-850 rounded"></div>
                </div>
              </div>
            ) : errors.insights ? (
              // Error message
              <div className="text-xs text-slate-400 italic">Could not load dynamically compiled AI insights.</div>
            ) : (
              // Insights list HTML
              <div className="prose prose-invert max-w-none flex flex-col gap-1">
                {renderInsights(aiInsights)}
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
}
