"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SplashScreen from "@/components/ui/splash-screen";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
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
  Sparkles,
  Heart,
  Check,
  Settings,
  FileText,
  PieChart,
  Monitor,
  Bookmark,
  AlertTriangle,
  Info,
  X,
  Plus,
  Minus
} from "lucide-react";

function ProfessionalDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCompany, setCurrentCompany] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const [chartTimeframe, setChartTimeframe] = useState("6M");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("price");
  const [watchlist, setWatchlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Enhanced mock data for demonstration - moved to top to avoid initialization issues
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
  };

  // Display data - moved to top to avoid initialization issues
  const displayData = companyData || mockData;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Load watchlist from localStorage
    const savedWatchlist = JSON.parse(localStorage.getItem('stockWatchlist') || '[]');
    setWatchlist(savedWatchlist);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle company parameter from URL
  useEffect(() => {
    const companyParam = searchParams.get('company');
    if (companyParam) {
      const decodedCompany = decodeURIComponent(companyParam);
      setCurrentCompany(decodedCompany);
      setSearchQuery(decodedCompany);
      
      // Auto-trigger search for the company
      setLoading(true);
      setTimeout(() => {
        // Here you could fetch real data for the company
        // For now, we'll update the mock data with the searched company name
        setCompanyData({
          ...mockData,
          companyName: decodedCompany,
          symbol: decodedCompany.length >= 3 ? decodedCompany.substring(0, 4).toUpperCase() : decodedCompany.toUpperCase()
        });
        setLoading(false);
      }, 1500);
    }
  }, [searchParams]);

  // Enhanced export functionality with multiple formats
  const handleExportAdvanced = async (format = 'pdf') => {
    if (!displayData) return;
    
    setIsExporting(true);
    
    try {
      const reportData = {
        company: displayData.companyName,
        symbol: displayData.symbol,
        currentPrice: displayData.currentPrice,
        change: displayData.change,
        changePercent: displayData.changePercent,
        marketCap: displayData.marketCap,
        peRatio: displayData.peRatio,
        revenue: displayData.revenue,
        netIncome: displayData.netIncome,
        sector: displayData.sector,
        lastUpdated: displayData.lastUpdated,
        confidence: displayData.confidence,
        volatility: displayData.volatility,
        beta: displayData.beta,
        dividendYield: displayData.dividendYield,
        technicalIndicators: displayData.technicalIndicators,
        analystRatings: displayData.analystRatings,
        riskMetrics: displayData.riskMetrics,
        stockData: displayData.stockData,
        financialMetrics: displayData.financialMetrics
      };

      if (format === 'pdf') {
        // Enhanced PDF generation
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.text(`${reportData.company} (${reportData.symbol}) Analysis`, 20, 30);
        
        // Current metrics
        doc.setFontSize(12);
        doc.text(`Current Price: $${reportData.currentPrice}`, 20, 50);
        doc.text(`Change: ${reportData.changePercent >= 0 ? '+' : ''}${reportData.changePercent}%`, 20, 60);
        doc.text(`Market Cap: $${formatCurrency(reportData.marketCap * 1000000000)}`, 20, 70);
        doc.text(`P/E Ratio: ${reportData.peRatio}`, 20, 80);
        doc.text(`Volatility: ${reportData.volatility}%`, 20, 90);
        
        // Technical indicators table
        const techData = reportData.technicalIndicators.map(indicator => [
          indicator.name, indicator.value, indicator.signal
        ]);
        
        doc.autoTable({
          head: [['Indicator', 'Value', 'Signal']],
          body: techData,
          startY: 100,
          styles: { fontSize: 10 }
        });
        
        // Analyst ratings table
        const analystData = reportData.analystRatings.map(rating => [
          rating.firm, rating.rating, `$${rating.target}`
        ]);
        
        doc.autoTable({
          head: [['Firm', 'Rating', 'Target']],
          body: analystData,
          startY: doc.lastAutoTable.finalY + 20,
          styles: { fontSize: 10 }
        });
        
        doc.save(`${reportData.symbol}_analysis_${new Date().toISOString().split('T')[0]}.pdf`);
        
      } else if (format === 'excel') {
        // Excel export with multiple sheets
        const workbook = XLSX.utils.book_new();
        
        // Overview sheet
        const overviewData = [
          ['Metric', 'Value'],
          ['Company', reportData.company],
          ['Symbol', reportData.symbol],
          ['Current Price', `$${reportData.currentPrice}`],
          ['Change %', `${reportData.changePercent}%`],
          ['Market Cap', `$${formatCurrency(reportData.marketCap * 1000000000)}`],
          ['P/E Ratio', reportData.peRatio],
          ['Revenue (TTM)', `$${formatCurrency(reportData.revenue * 1000000000)}`],
          ['Volatility', `${reportData.volatility}%`],
          ['Beta', reportData.beta],
          ['Dividend Yield', `${reportData.dividendYield}%`],
          ['Confidence Score', `${reportData.confidence}%`]
        ];
        
        const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
        XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview');
        
        // Stock data sheet
        const stockSheet = XLSX.utils.json_to_sheet(reportData.stockData);
        XLSX.utils.book_append_sheet(workbook, stockSheet, 'Stock Data');
        
        // Financial metrics sheet
        const financialSheet = XLSX.utils.json_to_sheet(reportData.financialMetrics);
        XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial Metrics');
        
        // Technical indicators sheet
        const techSheet = XLSX.utils.json_to_sheet(reportData.technicalIndicators);
        XLSX.utils.book_append_sheet(workbook, techSheet, 'Technical Indicators');
        
        XLSX.writeFile(workbook, `${reportData.symbol}_analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
        
      } else if (format === 'json') {
        // JSON export
        const jsonBlob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `${reportData.symbol}_analysis_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);
        URL.revokeObjectURL(jsonUrl);
      }

      setShareMessage(`Report exported as ${format.toUpperCase()} successfully!`);
      setTimeout(() => setShareMessage(""), 3000);
      
    } catch (error) {
      console.error('Error exporting report:', error);
      setShareMessage("Export failed. Please try again.");
      setTimeout(() => setShareMessage(""), 3000);
    } finally {
      setIsExporting(false);
      setShowExportDialog(false);
    }
  };

  // Check if company is in watchlist
  useEffect(() => {
    if (currentCompany) {
      const savedWatchlist = JSON.parse(localStorage.getItem('stockWatchlist') || '[]');
      setIsWatchlisted(savedWatchlist.includes(currentCompany.toUpperCase()));
    }
  }, [currentCompany]);

  // Legacy export function for backwards compatibility  
  const handleExport = () => handleExportAdvanced('pdf');
  const handleShare = () => handleShareAdvanced();
  const handleWatchlist = () => handleWatchlistAdvanced();

  // Enhanced watchlist functionality
  const handleWatchlistAdvanced = useCallback(() => {
    if (!currentCompany) return;
    
    const symbol = currentCompany.toUpperCase();
    const updatedWatchlist = isWatchlisted 
      ? watchlist.filter(item => item !== symbol)
      : [...watchlist, symbol];
    
    setWatchlist(updatedWatchlist);
    localStorage.setItem('stockWatchlist', JSON.stringify(updatedWatchlist));
    setIsWatchlisted(!isWatchlisted);
    
    // Add notification
    const notification = {
      id: Date.now(),
      message: isWatchlisted 
        ? `${symbol} removed from watchlist` 
        : `${symbol} added to watchlist`,
      type: 'success'
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  }, [currentCompany, isWatchlisted, watchlist]);

  // Chart timeframe data filtering
  const getFilteredChartData = useCallback(() => {
    if (!displayData?.stockData) return [];
    
    const data = displayData.stockData;
    switch (chartTimeframe) {
      case '1M': return data.slice(-1);
      case '3M': return data.slice(-3);
      case '6M': return data.slice(-6);
      case '1Y': return data;
      case '5Y': return data; // Would need more data points in real implementation
      default: return data;
    }
  }, [displayData, chartTimeframe]);

  // Enhanced sharing functionality
  const handleShareAdvanced = async () => {
    if (!displayData) return;
    
    const shareData = {
      title: `${displayData.companyName} (${displayData.symbol}) Financial Analysis`,
      text: `🔍 ${displayData.companyName} Analysis\n💰 Price: $${displayData.currentPrice}\n📈 Change: ${displayData.change >= 0 ? '+' : ''}${displayData.changePercent}%\n🏢 Market Cap: $${formatCurrency(displayData.marketCap * 1000000000)}\n📊 Confidence: ${displayData.confidence}%`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\nView analysis: ${shareData.url}`);
        setShareMessage("Analysis copied to clipboard!");
        setTimeout(() => setShareMessage(""), 3000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setShareMessage("Unable to share. Please try again.");
      setTimeout(() => setShareMessage(""), 3000);
    }
  };

  const handleAnalyze = async (company = searchQuery) => {
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
        body: JSON.stringify({ symbol: company }), // Send original company name/symbol, let backend resolve it
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle API errors gracefully
      if (data.error) {
        console.warn('API returned error:', data.error);
        if (data.fallback && data.data) {
          setCompanyData({ ...mockData, ...data.data });
        } else {
          setCompanyData({ ...mockData, symbol: company.toUpperCase() });
        }
      } else {
        // Successful API response
        console.log('Successfully received real data for:', company);
        console.log('Data includes news:', data.news?.length || 0, 'articles');
        console.log('Data includes AI insights:', !!data.keyInsights);
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
        body: JSON.stringify({ symbol: currentCompany }), // Send original search term
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.error) {
          setCompanyData(data);
          console.log('Data refreshed successfully');
          console.log('Refreshed data includes news:', data.news?.length || 0, 'articles');
          console.log('Refreshed data includes AI insights:', !!data.keyInsights);
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

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={6000} />;
  }

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
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-lg animate-in slide-in-from-right-full duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white">{notification.message}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1"
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[1600px] mx-auto px-3 py-6 space-y-6">
          
          {/* Header */}
          <div className="space-y-6">
            {/* Brand Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-black" />
                </div>
                <h1 className="text-3xl font-mono font-light tracking-[0.25em] text-white">
                  MARKETS
                </h1>
              </div>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                Professional Analysis Dashboard
              </p>
            </div>

            {/* Search & Controls */}
            <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search company or symbol (e.g., AAPL, Microsoft, Tesla...)"
                      disabled={loading}
                      className="pl-10 bg-zinc-900/50 border-zinc-700/50 text-white font-mono focus:border-white/50 transition-colors"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAnalyze()}
                      disabled={loading || !searchQuery.trim()}
                      className="bg-white text-black hover:bg-zinc-200 font-mono px-6"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          ANALYZE
                        </>
                      ) : (
                        'ANALYZE'
                      )}
                    </Button>
                    
                    {companyData && (
                      <Button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        variant="outline"
                        className="border-zinc-700 text-zinc-200 hover:border-zinc-600 font-mono"
                      >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      </Button>
                    )}
                    
                    <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={!displayData}
                          className="border-zinc-700 text-zinc-200 hover:border-zinc-600 font-mono"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-950 border-zinc-800">
                        <DialogHeader>
                          <DialogTitle className="font-mono text-white">Export Report</DialogTitle>
                          <DialogDescription className="font-mono text-zinc-400">
                            Choose your preferred export format
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Select value={exportFormat} onValueChange={setExportFormat}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white font-mono">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                              <SelectItem value="pdf" className="font-mono text-white">PDF Report</SelectItem>
                              <SelectItem value="excel" className="font-mono text-white">Excel Spreadsheet</SelectItem>
                              <SelectItem value="json" className="font-mono text-white">JSON Data</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleExportAdvanced(exportFormat)}
                              disabled={isExporting}
                              className="flex-1 bg-white text-black hover:bg-zinc-200 font-mono"
                            >
                              {isExporting ? (
                                <>
                                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                  Exporting...
                                </>
                              ) : (
                                'Export'
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowExportDialog(false)}
                              className="border-zinc-700 font-mono"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Quick Access */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-800/50">
                  {[
                    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'
                  ].map((symbol) => (
                    <Button
                      key={symbol}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(symbol);
                        handleAnalyze(symbol);
                      }}
                      disabled={loading}
                      className="font-mono text-xs border border-zinc-800/50 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900/50 transition-colors"
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
            <SplashScreen onComplete={() => {}} duration={6500} />
          )}

          {/* Dashboard Content */}
          {displayData && !loading && (
            <div className="space-y-6">
              
              {/* Company Overview */}
              <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                    
                    {/* Company Info */}
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-mono font-light text-white tracking-wide">
                          {displayData.companyName}
                        </h2>
                        <Badge variant="outline" className="font-mono text-white border-zinc-600">
                          {displayData.symbol}
                        </Badge>
                        <Badge className="bg-zinc-800 text-zinc-300 font-mono">
                          {displayData.sector}
                        </Badge>
                        {displayData.dataQuality?.realTimeData && (
                          <Badge className="bg-green-900 text-green-200 font-mono text-xs">
                            <Signal className="h-3 w-3 mr-1" />
                            LIVE DATA
                          </Badge>
                        )}
                        {displayData.dataQuality?.newsIntegration && (
                          <Badge className="bg-blue-900 text-blue-200 font-mono text-xs">
                            NEWS
                          </Badge>
                        )}
                        {displayData.dataQuality?.aiAnalysis && (
                          <Badge className="bg-purple-900 text-purple-200 font-mono text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 font-mono">
                        <span>Market Cap: ${formatCurrency(displayData.marketCap * 1000000000)}</span>
                        <Separator orientation="vertical" className="h-4 hidden md:block" />
                        <span>Updated: {getTimeAgo(displayData.lastUpdated)}</span>
                        <Separator orientation="vertical" className="h-4 hidden md:block" />
                        <div className="flex items-center gap-1">
                          <Signal className="h-3 w-3" />
                          <span>Confidence: {displayData.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Info */}
                    <div className="text-right space-y-2">
                      <div className="text-3xl font-mono font-light text-white">
                        ${displayData.currentPrice.toFixed(2)}
                      </div>
                      <div className="flex items-center justify-end gap-2">
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
                  
                  {/* Action Bar */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 text-zinc-200 border-t border-zinc-800/50">
                    <Button
                      onClick={handleWatchlistAdvanced}
                      variant={isWatchlisted ? "default" : "outline"}
                      className={`font-mono ${isWatchlisted ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 hover:border-zinc-600'}`}
                    >
                      {isWatchlisted ? (
                        <>
                          <Heart className="h-4 w-4 mr-2 fill-current" />
                          WATCHING
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          WATCH
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleShareAdvanced}
                      variant="outline"
                      className="font-mono border-zinc-700 text-zinc-200 hover:border-zinc-600"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      SHARE
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="font-mono border-zinc-700 text-zinc-200 hover:border-zinc-600"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      ALERTS
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                
                {/* Key Metrics Row */}
                <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm lg:col-span-3 group hover:bg-zinc-950/70 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Market Cap</span>
                        <Building2 className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </div>
                      <div className="text-2xl font-mono font-light text-white">
                        ${formatCurrency(displayData.marketCap * 1000000000)}
                      </div>
                      <div className="flex items-center text-xs text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8.2% vs sector
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm lg:col-span-3 group hover:bg-zinc-950/70 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">P/E Ratio</span>
                        <Target className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </div>
                      <div className="text-2xl font-mono font-light text-white">
                        {displayData.peRatio.toFixed(1)}
                      </div>
                      <div className="text-xs text-zinc-400">Industry avg: 24.8</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm lg:col-span-3 group hover:bg-zinc-950/70 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Revenue (TTM)</span>
                        <DollarSign className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </div>
                      <div className="text-2xl font-mono font-light text-white">
                        ${formatCurrency(displayData.revenue * 1000000000)}
                      </div>
                      <div className="flex items-center text-xs text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12.4% YoY
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm lg:col-span-3 group hover:bg-zinc-950/70 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Volatility</span>
                        <Activity className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </div>
                      <div className="text-2xl font-mono font-light text-white">
                        {displayData.volatility}%
                      </div>
                      <div className="text-xs text-zinc-400">30-day average</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Price Chart */}
                <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm md:col-span-2 lg:col-span-8">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-sm font-mono text-white uppercase tracking-wider">
                          Price Performance
                        </CardTitle>
                        <CardDescription className="font-mono text-zinc-400 text-xs">
                          Interactive price chart with technical analysis
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {['1M', '3M', '6M', '1Y', '5Y'].map((period) => (
                          <Button
                            key={period}
                            variant={chartTimeframe === period ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setChartTimeframe(period)}
                            className={`font-mono text-xs px-3 py-1 ${
                              chartTimeframe === period 
                                ? 'bg-white text-black' 
                                : 'hover:bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {period}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart 
                          data={getFilteredChartData()} 
                          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ffffff" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="1 1" stroke="#404040" opacity={0.3} />
                          <XAxis 
                            dataKey="date" 
                            stroke="#71717a" 
                            fontSize={10} 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a' }}
                          />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickFormatter={(value) => `$${value}`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a' }}
                            width={40}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-zinc-900 text-zinc-200 border-zinc-700" />}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#ffffff" 
                            fill="url(#priceGradient)" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Technical Indicators */}
                <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm md:col-span-2 lg:col-span-4">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-mono text-white uppercase tracking-wider">
                      Technical Signals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {displayData.technicalIndicators.map((indicator, index) => (
                      <div key={index} className="flex items-center justify-between group">
                        <span className="text-sm font-mono text-zinc-300">{indicator.name}</span>
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

                {/* Financial Performance Chart */}
                <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm md:col-span-2 lg:col-span-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-mono text-white uppercase tracking-wider">
                      Financial Metrics
                    </CardTitle>
                    <CardDescription className="font-mono text-zinc-400 text-xs">
                      Quarterly performance trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart 
                          data={displayData.financialMetrics} 
                          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="1 1" stroke="#404040" opacity={0.3} />
                          <XAxis 
                            dataKey="quarter" 
                            stroke="#71717a" 
                            fontSize={10}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a' }}
                          />
                          <YAxis 
                            yAxisId="revenue"
                            stroke="#71717a" 
                            fontSize={10} 
                            tickFormatter={(value) => `$${value}B`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a' }}
                            width={35}
                          />
                          <YAxis 
                            yAxisId="eps"
                            orientation="right"
                            stroke="#71717a" 
                            fontSize={10} 
                            tickFormatter={(value) => `$${value}`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a' }}
                            width={30}
                          />
                          <ChartTooltip content={<ChartTooltipContent className="bg-zinc-900 text-zinc-200 border-zinc-700" />} />
                          <Bar yAxisId="revenue" dataKey="revenue" fill="#ffffff" opacity={0.8} />
                          <Bar yAxisId="revenue" dataKey="profit" fill="#71717a" opacity={0.6} />
                          <Line yAxisId="eps" type="monotone" dataKey="eps" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#ffffff', r: 3 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Market Position */}
                <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm md:col-span-2 lg:col-span-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-mono text-white uppercase tracking-wider">
                      Market Position
                    </CardTitle>
                    <CardDescription className="font-mono text-zinc-400 text-xs">
                      Competitive landscape
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={displayData.competitorAnalysis }
                          className="ml-4"
                          layout="vertical" 
                          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="1 1" stroke="#404040" opacity={0.3} />
                          <XAxis 
                            type="number"
                            stroke="#71717a" 
                            fontSize={10} 
                            tickFormatter={(value) => `${value}%`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a' }}
                            domain={[0, 35]}
                          />
                          <YAxis 
                            dataKey="name" 
                            type="category"
                            stroke="#71717a" 
                            fontSize={10} 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a' }}
                            width={60}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent className="bg-zinc-900 text-zinc-200 border-zinc-700" />}
                          />
                          <Bar 
                            dataKey="marketShare" 
                            className="m-4"
                            radius={[0, 2, 2, 0]}
                            fill="#ffffff"
                            opacity={0.8}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Analyst Ratings */}
                <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-sm md:col-span-2 lg:col-span-12">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-mono text-white uppercase tracking-wider">
                      Analyst Consensus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {displayData.analystRatings.slice(0, 5).map((rating, index) => (
                        <div key={index} className="space-y-2 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                          <div className="text-sm font-mono text-zinc-300">{rating.firm}</div>
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant={rating.rating === 'BUY' || rating.rating === 'OVERWEIGHT' || rating.rating === 'OUTPERFORM' ? 'default' : 'secondary'}
                              className="text-xs font-mono bg-white text-black"
                            >
                              {rating.rating}
                            </Badge>
                            <span className="text-sm font-mono text-white">${rating.target}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default ProfessionalDashboard;