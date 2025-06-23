"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip
} from "recharts";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Globe,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  ChevronRight,
  Plus,
  Minus,
  BarChart3,
  Building2,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Share,
  LayoutDashboard,
  CandlestickChart,
  PieChart as PieChartIcon,
  CreditCard,
  Wallet,
  Landmark,
  Scale,
  ShieldCheck,
  AlertCircle,
  Clock,
  Database,
  BookOpen,
  FileText,
  Settings,
  Moon,
  Sun,
  Sparkles,
  Terminal,
  Code,
  Zap,
  Signal,
  Layers,
  Grid3X3,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreHorizontal,
  Maximize2,
  Bell,
  Bookmark,
  ExternalLink
} from "lucide-react";

export default function ProfessionalDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCompany, setCurrentCompany] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data for demonstration
  const mockData = {
    companyName: "Apple Inc.",
    symbol: "AAPL", 
    currentPrice: 198.75,
    change: 4.85,
    changePercent: 2.5,
    marketCap: 3.97,
    peRatio: 28.4,
    revenue: 394.3,
    netIncome: 99.8,
    sector: "Technology",
    stockData: [
      { date: 'Jan', price: 142.50, volume: 2.3, marketCap: 2.85 },
      { date: 'Feb', price: 156.80, volume: 2.8, marketCap: 3.14 },
      { date: 'Mar', price: 168.20, volume: 3.1, marketCap: 3.36 },
      { date: 'Apr', price: 175.90, volume: 2.9, marketCap: 3.52 },
      { date: 'May', price: 189.40, volume: 3.4, marketCap: 3.79 },
      { date: 'Jun', price: 198.75, volume: 3.2, marketCap: 3.97 },
    ],
    financialMetrics: [
      { quarter: 'Q1 23', revenue: 28.5, profit: 8.2, eps: 1.45 },
      { quarter: 'Q2 23', revenue: 31.2, profit: 9.1, eps: 1.62 },
      { quarter: 'Q3 23', revenue: 34.8, profit: 10.5, eps: 1.89 },
      { quarter: 'Q4 23', revenue: 38.4, profit: 12.1, eps: 2.14 },
      { quarter: 'Q1 24', revenue: 42.6, profit: 13.8, eps: 2.45 },
      { quarter: 'Q2 24', revenue: 45.9, profit: 15.2, eps: 2.71 },
    ],
    competitorAnalysis: [
      { name: 'Apple', marketShare: 28.5, growth: 12.3, pe: 28.4 },
      { name: 'Microsoft', marketShare: 22.1, growth: 15.7, pe: 32.1 },
      { name: 'Google', marketShare: 18.9, growth: 8.9, pe: 24.8 },
      { name: 'Amazon', marketShare: 16.2, growth: 11.4, pe: 45.2 },
      { name: 'Meta', marketShare: 8.7, growth: 6.2, pe: 19.5 },
      { name: 'Others', marketShare: 5.6, growth: 4.1, pe: 22.3 }
    ],
    sectorPerformance: [
      { sector: 'Tech', performance: 18.5 },
      { sector: 'Health', performance: 12.8 },
      { sector: 'Finance', performance: 8.9 },
      { sector: 'Energy', performance: -2.4 },
      { sector: 'Consumer', performance: 6.7 },
      { sector: 'Industrial', performance: 4.2 }
    ],
    analystRatings: [
      { firm: 'Goldman Sachs', rating: 'BUY', target: 220, current: 198.75 },
      { firm: 'Morgan Stanley', rating: 'OVERWEIGHT', target: 215, current: 198.75 },
      { firm: 'JP Morgan', rating: 'NEUTRAL', target: 200, current: 198.75 },
      { firm: 'Bank of America', rating: 'BUY', target: 225, current: 198.75 },
      { firm: 'Credit Suisse', rating: 'OUTPERFORM', target: 210, current: 198.75 },
    ]
  };

  const handleAnalyze = async (company = searchQuery) => {
    if (!company.trim()) return;
    
    setLoading(true);
    setCurrentCompany(company);
    
    // Simulate API call
    setTimeout(() => {
      setCompanyData(mockData);
      setLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const formatCurrency = (value) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}T`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}B`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(2);
  };

  const Card = ({ children, className = "" }) => (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-lg ${className}`}>
      {children}
    </div>
  );

  const Button = ({ children, variant = "primary", size = "md", className = "", onClick, disabled }) => {
    const baseClass = "transition-all duration-200 font-mono tracking-wide";
    const variants = {
      primary: "bg-white text-black hover:bg-zinc-200",
      secondary: "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700",
      ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800"
    };
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-sm"
    };
    
    return (
      <button 
        className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  const Input = ({ value, onChange, onKeyPress, placeholder, disabled }) => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 px-4 py-3 text-sm font-mono focus:outline-none focus:border-white transition-colors"
    />
  );

  const MetricCard = ({ title, value, change, subtitle }) => (
    <Card className="p-4 hover:border-zinc-700 transition-colors">
      <div className="space-y-2">
        <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">{title}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-xl font-light text-white font-mono">{value}</div>
          {change && (
            <div className="flex items-center text-xs text-zinc-400">
              {change.startsWith('+') ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        {subtitle && <div className="text-xs text-zinc-500">{subtitle}</div>}
      </div>
    </Card>
  );

  const displayData = companyData || mockData;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-wider mb-2">FINANCIAL ANALYTICS</h1>
            <p className="text-zinc-500 text-sm">Professional market analysis and insights</p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter company symbol (e.g., AAPL, MSFT, GOOGL)"
                  disabled={loading}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              </div>
              <Button
                onClick={() => handleAnalyze()}
                disabled={loading || !searchQuery.trim()}
                size="lg"
                className="min-w-[20px] flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ANALYZING
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    ANALYZE
                  </>
                )}
              </Button>
            </div>

            {/* Quick symbols */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX'].map((symbol) => (
                <Button
                  key={symbol}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(symbol);
                    handleAnalyze(symbol);
                  }}
                  disabled={loading}
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-zinc-500 text-sm">Processing market data...</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="animate-pulse">
                    <div className="h-3 bg-zinc-800 rounded mb-2"></div>
                    <div className="h-6 bg-zinc-800 rounded mb-2 w-20"></div>
                    <div className="h-2 bg-zinc-800 rounded w-16"></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Company Header */}
        {displayData && !loading && (
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light mb-2">
                    {displayData.companyName} 
                    <span className="text-zinc-500 ml-2 text-lg">{displayData.symbol}</span>
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="border border-zinc-700 px-2 py-1 text-xs">{displayData.sector}</span>
                    <span>Market Cap: ${formatCurrency(displayData.marketCap * 1000000000)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light">${displayData.currentPrice.toFixed(2)}</div>
                  <div className="flex items-center justify-end text-sm text-zinc-400 mt-1">
                    {displayData.change >= 0 ? 
                      <TrendingUp className="h-4 w-4 mr-1" /> : 
                      <TrendingDown className="h-4 w-4 mr-1" />
                    }
                    <span>
                      {displayData.change >= 0 ? '+' : ''}{displayData.change.toFixed(2)} 
                      ({displayData.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Key Metrics Grid */}
        {displayData && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Market Cap"
              value={`$${formatCurrency(displayData.marketCap * 1000000000)}`}
              change="+8.2%"
              subtitle="Above sector average"
            />
            <MetricCard
              title="P/E Ratio"
              value={displayData.peRatio.toFixed(1)}
              change="+1.2%"
              subtitle="Industry: 24.8"
            />
            <MetricCard
              title="Revenue (TTM)"
              value={`$${formatCurrency(displayData.revenue * 1000000000)}`}
              change="+2.8%"
              subtitle="Year-over-year growth"
            />
            <MetricCard
              title="Net Income"
              value={`$${formatCurrency(displayData.netIncome * 1000000000)}`}
              change="+5.4%"
              subtitle="Strong profitability"
            />
          </div>
        )}

        {/* Main Charts Grid */}
        {displayData && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Stock Performance Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-1">Stock Performance</h3>
                  <p className="text-white">6-month price movement</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">6M</Button>
                  <Button variant="ghost" size="sm">1Y</Button>
                  <Button variant="ghost" size="sm">5Y</Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={displayData.stockData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="1 1" stroke="#27272a" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#71717a" 
                    fontSize={10} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={10} 
                    tickFormatter={(value) => `$${value}`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#ffffff" 
                    fill="url(#priceGradient)" 
                    strokeWidth={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Financial Metrics Chart */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-1">Financial Performance</h3>
                <p className="text-white">Quarterly revenue and profit</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={displayData.financialMetrics}>
                  <CartesianGrid strokeDasharray="1 1" stroke="#27272a" />
                  <XAxis 
                    dataKey="quarter" 
                    stroke="#71717a" 
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#71717a" 
                    fontSize={10} 
                    tickFormatter={(value) => `$${value}B`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#71717a" 
                    fontSize={10} 
                    tickFormatter={(value) => `$${value}`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar yAxisId="left" dataKey="revenue" fill="#52525b" />
                  <Bar yAxisId="left" dataKey="profit" fill="#a1a1aa" />
                  <Line yAxisId="right" type="monotone" dataKey="eps" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#ffffff', r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Secondary Analysis Grid */}
        {displayData && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Market Position */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-1">Market Position</h3>
                <p className="text-white">Competitive landscape</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={displayData.competitorAnalysis} layout="horizontal">
                  <CartesianGrid strokeDasharray="1 1" stroke="#27272a" />
                  <XAxis 
                    type="number" 
                    stroke="#71717a" 
                    fontSize={10} 
                    tickFormatter={(value) => `${value}%`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#71717a" 
                    fontSize={10} 
                    width={60}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="marketShare" fill="#ffffff" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Sector Performance */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-1">Sector Performance</h3>
                <p className="text-white">YTD comparison</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={displayData.sectorPerformance}>
                  <CartesianGrid strokeDasharray="1 1" stroke="#27272a" />
                  <XAxis 
                    dataKey="sector" 
                    stroke="#71717a" 
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={10} 
                    tickFormatter={(value) => `${value}%`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="performance" fill="#ffffff" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Analyst Ratings */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-1">Analyst Ratings</h3>
                <p className="text-white">Professional consensus</p>
              </div>
              <div className="space-y-3">
                {displayData.analystRatings.slice(0, 5).map((rating, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="text-sm text-zinc-300">{rating.firm}</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 border ${
                        rating.rating === 'BUY' || rating.rating === 'OVERWEIGHT' || rating.rating === 'OUTPERFORM'
                          ? 'border-white text-white' 
                          : 'border-zinc-700 text-zinc-500'
                      }`}>
                        {rating.rating}
                      </span>
                      <span className="text-xs text-zinc-500">${rating.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}