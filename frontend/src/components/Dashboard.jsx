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
  LayoutDashboard
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

export default function Dashboard() {
  // Independent States for modular loading/error states
  const [summary, setSummary] = useState(null);
  const [regionSales, setRegionSales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [profitData, setProfitData] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  const [loading, setLoading] = useState({
    summary: false,
    region: false,
    category: false,
    products: false,
    profit: false,
    trend: false
  });

  const [errors, setErrors] = useState({
    summary: null,
    region: null,
    category: null,
    products: null,
    profit: null,
    trend: null
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

  // Fetch all dashboard data
  const loadAllData = useCallback(() => {
    fetchSummaryData();
    fetchRegionData();
    fetchCategoryData();
    fetchTopProductsData();
    fetchProfitData();
    fetchTrendData();
  }, [
    fetchSummaryData,
    fetchRegionData,
    fetchCategoryData,
    fetchTopProductsData,
    fetchProfitData,
    fetchTrendData
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
        // Render custom rank badges
        const rank = index + 1;
        let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700/50';
        if (rank === 1) badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        if (rank === 2) badgeColor = 'bg-slate-300/10 text-slate-300 border-slate-300/30';
        if (rank === 3) badgeColor = 'bg-amber-700/10 text-amber-600 border-amber-700/30';
        
        return (
          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${badgeColor}`}>
            #{rank}
          </span>
        );
      }
    },
    {
      key: 'product_name',
      label: 'Product Name',
      sortable: true,
      render: (name) => <span className="font-bold text-white block truncate max-w-[180px] sm:max-w-[240px]">{name}</span>
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (sku) => <code className="text-[10px] text-slate-400 bg-slate-900/60 border border-slate-800/50 px-1.5 py-0.5 rounded">{sku}</code>
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
        return <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${badgeStyle}`}>{cat}</span>;
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

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 text-left">
      
      {/* Top Navigation / Sub-header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/25 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">Sales Dashboard</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">NovaBite Consumer Goods Performance Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>FY 2024 - 2025</span>
          </div>

          <button
            type="button"
            onClick={loadAllData}
            disabled={isRefreshing}
            className={`p-2 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-700 active:bg-slate-900 text-slate-300 transition duration-200 cursor-pointer ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Refresh All Dashboard Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </header>

      {/* Global Error Banner */}
      {Object.values(errors).some(Boolean) && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Notice:</span> Some dashboard data sections failed to load. You can try refreshing those individual components or use the global refresh button above to reload all segments.
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <KPICard
          title="Total Net Revenue"
          value={summary ? formatCurrency(summary.total_net_revenue) : '$0'}
          icon={DollarSign}
          description="Cumulative net sales revenue"
          trend="4.2%"
          trendDirection="up"
          colorScheme="indigo"
          isLoading={loading.summary}
        />
        <KPICard
          title="GP Margin"
          value={summary ? `${summary.gross_profit_margin_pct}%` : '0%'}
          icon={Percent}
          description="Average gross profitability"
          trend="1.8%"
          trendDirection="up"
          colorScheme="emerald"
          isLoading={loading.summary}
        />
        <KPICard
          title="Units Sold"
          value={summary ? formatNumber(summary.total_units_sold) : '0'}
          icon={ShoppingBag}
          description="Product units shipped"
          trend="0.5%"
          trendDirection="down"
          colorScheme="cyan"
          isLoading={loading.summary}
        />
        <KPICard
          title="Top Region"
          value={summary ? summary.top_region : 'N/A'}
          icon={MapPin}
          description="Highest net revenue contributor"
          colorScheme="gold"
          isLoading={loading.summary}
        />
        <KPICard
          title="Top Channel"
          value={summary ? summary.top_channel : 'N/A'}
          icon={Layers}
          description="Highest contributing distribution route"
          colorScheme="violet"
          isLoading={loading.summary}
        />
        <KPICard
          title="Top Product"
          value={summary ? summary.top_product : 'N/A'}
          icon={Sparkles}
          description="Highest sales volume product"
          colorScheme="rose"
          isLoading={loading.summary}
        />
      </section>

      {/* First Row Charts (Monthly Trend + Sales by Region) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Sales & Profit Trend (2/3 width on lg) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Monthly Revenue & Profit Trend"
            subtitle="Chronological sales performance with gross profit tracking"
            isLoading={loading.trend}
            error={errors.trend}
            isEmpty={!loading.trend && monthlyTrend.length === 0}
            height={360}
            onRetry={fetchTrendData}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyTrend}
                margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="trendRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="trendProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={10}
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
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(tick) => `$${tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}`}
                />
                <Tooltip content={<CustomTrendTooltip />} cursor={{ stroke: 'rgba(99, 102, 241, 0.2)', strokeWidth: 1.5 }} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
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

        {/* Sales by Region (1/3 width on lg) */}
        <div>
          <ChartCard
            title="Sales by Region"
            subtitle="Geographical distribution of net revenue"
            isLoading={loading.region}
            error={errors.region}
            isEmpty={!loading.region && regionSales.length === 0}
            height={360}
            onRetry={fetchRegionData}
          >
            <div className="flex flex-col items-center justify-center h-full relative">
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionSales}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="net_revenue"
                    >
                      {regionSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(15, 23, 42, 0.8)" strokeWidth={1.5} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Labels list */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full mt-4 max-h-[100px] overflow-y-auto pr-1 scrollbar-thin">
                {regionSales.map((entry, index) => (
                  <div key={entry.region} className="flex items-center gap-2 text-xs">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="font-semibold text-slate-300 truncate">{entry.region}</span>
                    <span className="text-[10px] text-slate-500 font-normal ml-auto shrink-0">
                      {formatCurrency(entry.net_revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

      </section>

      {/* Second Row Component (Profit margin cost analysis) */}
      <section>
        <ProfitAnalysis
          data={profitData}
          isLoading={loading.profit}
          error={errors.profit}
          onRetry={fetchProfitData}
        />
      </section>

      {/* Third Row Components (Sales by Category & Top Products Table) */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        
        {/* Sales by Category (2/5 width on lg) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Sales by Category"
            subtitle="Units sold and revenue shares per product segment"
            isLoading={loading.category}
            error={errors.category}
            isEmpty={!loading.category && categorySales.length === 0}
            height={380}
            onRetry={fetchCategoryData}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySales}
                margin={{ top: 10, right: 5, left: -20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="catRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.95}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                <XAxis 
                  dataKey="category" 
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
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
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
                <Bar name="Net Revenue" dataKey="net_revenue" fill="url(#catRev)" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Top Products Table (3/5 width on lg) */}
        <div className="lg:col-span-3">
          <div className="glass-card p-5 md:p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col h-full">
            <SectionHeader 
              title="Top Performing Products" 
              description="Review top products sorted by net sales revenue and units sold"
            />
            <div className="flex-1">
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

    </div>
  );
}
