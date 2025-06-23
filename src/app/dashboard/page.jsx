"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
  ResponsiveContainer,
  Cell
} from "recharts";

import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Loader2,
  Activity,
  BarChart3,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
  Download,
  Share,
  Eye,
  Calendar,
  Globe,
  Users,
  Zap,
  Signal,
  MoreHorizontal,
  Maximize2,
  ChevronRight,
  ExternalLink,
  Sparkles
} from "lucide-react";

export default function ProfessionalDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCompany, setCurrentCompany] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  // Enhanced mock data for demonstration
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
    lastUpdated: "2025-06-23T10:30:00Z",
    confidence: 94,
    volatility: 12.8,
    beta: 1.24,
    dividendYield: 0.45,
    stockData: [
      { date: 'Jan', price: 142.50, volume: 2.3, marketCap: 2.85, high: 145.20, low: 140.10 },
      { date: 'Feb', price: 156.80, volume: 2.8, marketCap: 3.14, high: 159.40, low: 152.30 },
      { date: 'Mar', price: 168.20, volume: 3.1, marketCap: 3.36, high: 171.90, low: 164.50 },
      { date: 'Apr', price: 175.90, volume: 2.9, marketCap: 3.52, high: 178.60, low: 172.30 },
      { date: 'May', price: 189.40, volume: 3.4, marketCap: 3.79, high: 192.80, low: 186.10 },
      { date: 'Jun', price: 198.75, volume: 3.2, marketCap: 3.97, high: 201.20, low: 195.40 },
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
      { name: 'Apple', marketShare: 28.5, growth: 12.3, pe: 28.4 , color:'#ef4444'},
      { name: 'Microsoft', marketShare: 22.1, growth: 15.7, pe: 32.1, color:'#3b82f6' },
      { name: 'Google', marketShare: 18.9, growth: 8.9, pe: 24.8, color:'#facc15' },
      { name: 'Amazon', marketShare: 16.2, growth: 11.4, pe: 45.2, color:'#10b981' },
      { name: 'Meta', marketShare: 8.7, growth: 6.2, pe: 19.5, color:'#8b5cf6' },
      { name: 'Others', marketShare: 5.6, growth: 4.1, pe: 22.3, color:'#a1a1aa' }
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
      { firm: 'Goldman Sachs', rating: 'BUY', target: 220, current: 198.75, confidence: 92 },
      { firm: 'Morgan Stanley', rating: 'OVERWEIGHT', target: 215, current: 198.75, confidence: 88 },
      { firm: 'JP Morgan', rating: 'NEUTRAL', target: 200, current: 198.75, confidence: 85 },
      { firm: 'Bank of America', rating: 'BUY', target: 225, current: 198.75, confidence: 90 },
      { firm: 'Credit Suisse', rating: 'OUTPERFORM', target: 210, current: 198.75, confidence: 87 },
    ],
    riskMetrics: {
      volatility: 12.8,
      beta: 1.24,
      sharpe: 1.45,
      maxDrawdown: 8.2,
      var95: 5.1
    },
    technicalIndicators: [
      { name: 'RSI', value: 68.4, signal: 'neutral' },
      { name: 'MACD', value: 2.3, signal: 'bullish' },
      { name: 'SMA 50', value: 189.2, signal: 'bullish' },
      { name: 'SMA 200', value: 172.8, signal: 'bullish' },
    ]
  };  const handleAnalyze = async (company = searchQuery) => {
    if (!company.trim()) return;
    
    setLoading(true);
    setCurrentCompany(company);

    try {
      console.log(`Analyzing ${company}...`);
      
      const response = await fetch('/api/analyze-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: company.toUpperCase() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle API errors gracefully
      if (data.error) {
        console.warn('API returned error:', data.error);
        if (data.fallback && data.data) {
          setCompanyData({ ...mockData, ...data.data, symbol: company.toUpperCase() });
        } else {
          setCompanyData({ ...mockData, symbol: company.toUpperCase() });
        }
      } else {
        // Successful API response
        console.log('Successfully received real data for:', company);
        setCompanyData(data);
      }
    } catch (error) {
      console.error('Error analyzing company:', error);
      // Fallback to mock data with updated symbol
      setCompanyData({ ...mockData, symbol: company.toUpperCase() });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!currentCompany) return;
    
    setRefreshing(true);
    
    try {
      console.log(`Refreshing data for ${currentCompany}...`);
      
      const response = await fetch('/api/analyze-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: currentCompany.toUpperCase() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.error) {
          setCompanyData(data);
          console.log('Data refreshed successfully');
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
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

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const displayData = companyData || mockData;

  // Chart configurations with enhanced colors
  const chartConfig = {
    price: {
      label: "Price",
      color: "#3b82f6",
    },
    volume: {
      label: "Volume", 
      color: "#8b5cf6",
    },
    revenue: {
      label: "Revenue",
      color: "#06b6d4",
    },
    profit: {
      label: "Profit",
      color: "#10b981",
    },
    eps: {
      label: "EPS",
      color: "#f59e0b",
    },
    marketShare: {
      label: "Market Share",
      color: "#ef4444",
    },
    performance: {
      label: "Performance",
      color: "#8b5cf6",
    }
  };

  // Color palette for charts
  const colors = {
    primary: "#3b82f6",
    secondary: "#8b5cf6", 
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#06b6d4",
    purple: "#a855f7",
    pink: "#ec4899",
    teal: "#14b8a6",
    orange: "#f97316"
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-[1600px] mx-auto p-6 space-y-6">
          
          {/* Header Section */}
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-mono font-light tracking-[0.2em] text-white">
                FINANCIAL INTELLIGENCE
              </h1>
              <p className="text-sm text-zinc-500 font-mono uppercase tracking-wider">
                Advanced Market Analysis Platform
              </p>
            </div>

            {/* Search Interface */}
            <Card className="bg-zinc-950 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter ticker symbol (AAPL, MSFT, TSLA...)"
                      disabled={loading}
                      className="pl-10 bg-zinc-900 border-zinc-700 text-white font-mono focus:border-white"
                    />
                  </div>
                  <Button
                    onClick={() => handleAnalyze()}
                    disabled={loading || !searchQuery.trim()}
                    className="min-w-[120px] font-mono"
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
                  {companyData && (
                    <Button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      variant="outline"
                      className="font-mono"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </div>

                {/* Quick Access Symbols */}
                <div className="flex flex-wrap gap-2">
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
                      className="font-mono text-xs border text-zinc-200 border-zinc-800 hover:border-zinc-600"
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="bg-zinc-950 border-zinc-800 col-span-full">
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-zinc-500 font-mono text-sm">Processing market data...</p>
                </CardContent>
              </Card>
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-zinc-950 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                      <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
                      <div className="h-2 bg-zinc-800 rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Dashboard Content */}
          {displayData && !loading && (
            <div className="space-y-6">
              
              {/* Company Header */}
              <Card className="bg-zinc-950 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl text-zinc-200 font-mono font-light tracking-wider">
                          {displayData.companyName}
                        </h2>
                        <Badge variant="outline" className="font-mono text-xs">
                          {displayData.symbol}
                        </Badge>
                        <Badge className="bg-zinc-800 text-zinc-300 font-mono text-xs">
                          {displayData.sector}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-500 font-mono">
                        <span>Market Cap: ${formatCurrency(displayData.marketCap * 1000000000)}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>Updated: {getTimeAgo(displayData.lastUpdated)}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="flex items-center gap-1">
                          <Signal className="h-3 w-3" />
                          Confidence: {displayData.confidence}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-3xl text-zinc-200 font-mono font-light">${displayData.currentPrice.toFixed(2)}</div>
                      <div className="flex items-center justify-end gap-1">
                        {displayData.change >= 0 ? 
                          <ArrowUpRight className="h-4 w-4 text-green-400" /> : 
                          <ArrowDownRight className="h-4 w-4 text-red-400" />
                        }
                        <span className={`font-mono text-sm ${displayData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(displayData.changePercent)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Key Metrics - Top Row */}
                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Market Cap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-mono font-light text-white">${formatCurrency(displayData.marketCap * 1000000000)}</div>
                      <div className="flex items-center text-xs text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8.2% vs sector
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">P/E Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-mono font-light text-white">{displayData.peRatio.toFixed(1)}</div>
                      <div className="text-xs text-zinc-400">Industry avg: 24.8</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Revenue (TTM)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-mono font-light text-white">${formatCurrency(displayData.revenue * 1000000000)}</div>
                      <div className="flex items-center text-xs text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12.4% YoY
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Volatility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-mono font-light text-white">{displayData.volatility}%</div>
                      <div className="text-xs text-zinc-400">30-day average</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Chart - Large */}
                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Price Performance</CardTitle>
                        <CardDescription className="font-mono text-zinc-400">6-month price movement with volume</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-xs font-mono text-zinc-300">6M</Button>
                        <Button variant="ghost" size="sm" className="text-xs font-mono text-zinc-300">1Y</Button>
                        <Button variant="ghost" size="sm" className="text-xs font-mono text-zinc-300">5Y</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={displayData.stockData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#a1a1aa" 
                            fontSize={11} 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            tickMargin={10}
                          />
                          <YAxis 
                            yAxisId="price"
                            stroke="#a1a1aa" 
                            fontSize={11} 
                            tickFormatter={(value) => `$${value}`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            width={60}
                          />
                          <YAxis 
                            yAxisId="volume"
                            orientation="right"
                            stroke="#a1a1aa" 
                            fontSize={11} 
                            tickFormatter={(value) => `${value}B`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            width={60}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} className="text-zinc-300"/>
                          <Area 
                            yAxisId="price"
                            type="monotone" 
                            dataKey="price" 
                            stroke="#3b82f6" 
                            fill="url(#priceGradient)" 
                            strokeWidth={2}
                          />
                          <Bar yAxisId="volume" dataKey="volume" fill="#8b5cf6" opacity={0.6} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Technical Indicators */}
                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Technical Signals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {displayData.technicalIndicators.map((indicator, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-mono text-zinc-200">{indicator.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-white">{indicator.value}</span>
                          <Badge 
                            variant={indicator.signal === 'bullish' ? 'default' : indicator.signal === 'bearish' ? 'destructive' : 'secondary'}
                            className="text-xs font-mono"
                          >
                            {indicator.signal}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Financial Metrics Chart */}
                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-6">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Financial Performance</CardTitle>
                    <CardDescription className="font-mono text-zinc-400">Quarterly revenue and profit trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={displayData.financialMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis 
                            dataKey="quarter" 
                            stroke="#a1a1aa" 
                            fontSize={11}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            tickMargin={10}
                          />
                          <YAxis 
                            yAxisId="revenue"
                            stroke="#a1a1aa" 
                            fontSize={11} 
                            tickFormatter={(value) => `$${value}B`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            width={60}
                          />
                          <YAxis 
                            yAxisId="eps"
                            orientation="right"
                            stroke="#a1a1aa" 
                            fontSize={11} 
                            tickFormatter={(value) => `$${value}`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            width={60}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} className="text-zinc-300"/>
                          <Bar yAxisId="revenue" dataKey="revenue" fill="#06b6d4" />
                          <Bar yAxisId="revenue" dataKey="profit" fill="#10b981" />
                          <Line yAxisId="eps" type="monotone" dataKey="eps" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Market Position */}
                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-6">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Market Position</CardTitle>
                    <CardDescription className="font-mono text-zinc-400">Competitive landscape analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={displayData.competitorAnalysis} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis 
                            type="number"
                            stroke="#a1a1aa" 
                            fontSize={11} 
                            tickFormatter={(value) => `${value}%`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            tickMargin={10}
                            domain={[0, 35]}
                          />
                          <YAxis 
                            dataKey="name" 
                            type="category"
                            stroke="#a1a1aa" 
                            fontSize={11} 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            width={80}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent />} 
                            className="text-zinc-300"
                          />
                          <Bar 
                            dataKey="marketShare" 
                            radius={[0, 4, 4, 0]}
                          >
                            {displayData.competitorAnalysis.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card> 

                {/* Analyst Ratings */}
                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Analyst Consensus</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {displayData.analystRatings.slice(0, 5).map((rating, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="text-sm font-mono text-zinc-200">{rating.firm}</div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={rating.rating === 'BUY' || rating.rating === 'OVERWEIGHT' || rating.rating === 'OUTPERFORM' ? 'default' : 'secondary'}
                            className="text-xs font-mono"
                          >
                            {rating.rating}
                          </Badge>
                          <span className="text-xs font-mono text-zinc-400">${rating.target}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Sector Performance */}
                <Card className="bg-zinc-950 border-zinc-800 lg:col-span-8">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Sector Performance</CardTitle>
                    <CardDescription className="font-mono text-zinc-400">Year-to-date sector comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={displayData.sectorPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis 
                            dataKey="sector" 
                            stroke="#a1a1aa" 
                            fontSize={11}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            tickMargin={10}
                          />
                          <YAxis 
                            stroke="#a1a1aa" 
                            fontSize={11} 
                            tickFormatter={(value) => `${value}%`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa' }}
                            width={50}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} className="text-zinc-300" />
                          <Bar dataKey="performance">
                            {displayData.sectorPerformance.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.performance >= 0 ? colors.success : colors.danger}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* News and Insights Section */}
              {displayData.news && displayData.news.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Latest News */}
                  <Card className="bg-zinc-950 border-zinc-800 lg:col-span-8">
                    <CardHeader>
                      <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Latest News</CardTitle>
                      <CardDescription className="font-mono text-zinc-400">Recent developments and market sentiment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {displayData.news.slice(0, 3).map((article, index) => (
                        <div key={index} className="border-l-2 border-zinc-700 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-mono text-zinc-200 mb-1">{article.title}</h4>
                              <p className="text-xs text-zinc-400 mb-2 line-clamp-2">{article.description}</p>
                              <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <span>{article.source}</span>
                                <Separator orientation="vertical" className="h-3" />
                                <span>{getTimeAgo(article.publishedAt)}</span>
                                {article.sentiment && (
                                  <>
                                    <Separator orientation="vertical" className="h-3" />
                                    <Badge 
                                      variant={article.sentiment === 'positive' ? 'default' : article.sentiment === 'negative' ? 'destructive' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {article.sentiment}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                            {article.url !== '#' && (
                              <Button variant="ghost" size="sm" className="ml-2">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* AI Insights */}
                  <Card className="bg-zinc-950 border-zinc-800 lg:col-span-4">
                    <CardHeader>
                      <CardTitle className="text-sm font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {displayData.recommendation && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-400">Recommendation</span>
                            <Badge 
                              variant={displayData.recommendation === 'BUY' ? 'default' : displayData.recommendation === 'SELL' ? 'destructive' : 'secondary'}
                              className="font-mono"
                            >
                              {displayData.recommendation}
                            </Badge>
                          </div>
                          {displayData.targetPrice && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono text-zinc-400">Target Price</span>
                              <span className="text-sm font-mono text-white">${displayData.targetPrice}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {displayData.keyInsights && (
                        <div className="space-y-2">
                          <span className="text-xs font-mono text-zinc-400">Key Insights</span>
                          {displayData.keyInsights.slice(0, 3).map((insight, index) => (
                            <div key={index} className="text-xs text-zinc-300 flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {displayData.risks && (
                        <div className="space-y-2">
                          <span className="text-xs font-mono text-zinc-400">Risk Factors</span>
                          {displayData.risks.slice(0, 3).map((risk, index) => (
                            <div key={index} className="text-xs text-zinc-300 flex items-start gap-2">
                              <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{risk}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Data Quality Indicator */}
              {displayData.dataQuality && (
                <Card className="bg-zinc-950 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Signal className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-mono text-zinc-300">Data Quality</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${displayData.dataQuality.realTimeData ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          Real-time
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${displayData.dataQuality.newsIntegration ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          News
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${displayData.dataQuality.aiAnalysis ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          AI Analysis
                        </div>
                        {displayData.dataQuality.sources && (
                          <span className="text-zinc-400">
                            {displayData.dataQuality.sources.length} sources
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 pt-6">
                <Button variant="outline" className="font-mono">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="font-mono">
                  <Share className="h-4 w-4 mr-2" />
                  Share Analysis
                </Button>
                <Button variant="outline" className="font-mono">
                  <Eye className="h-4 w-4 mr-2" />
                  Watch List
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}