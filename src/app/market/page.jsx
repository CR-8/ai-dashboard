'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
  Activity,
  Bookmark,
  AlertCircle,
  DollarSign,
  PieChart,
  Target,
  Zap
} from 'lucide-react';

// Import components and utilities
import MarketCard from '@/components/market/MarketCard';
import StockRow from '@/components/market/StockRow';
import SearchBar from '@/components/market/SearchBar';
import { marketAPI, formatCurrency, formatPercentage, watchlistManager } from '@/lib/market-api';

const MarketPage = () => {
  // State management
  const [marketData, setMarketData] = useState({
    indices: [],
    stocks: [],
    marketStats: {},
    sectors: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('trending');
  const [watchlist, setWatchlist] = useState([]);

  // Fetch all market data
  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [indices, stocks, marketStats, sectors] = await Promise.all([
        marketAPI.getMarketIndices(),
        marketAPI.getStocks(activeTab),
        marketAPI.getMarketStats(),
        marketAPI.getSectors()
      ]);

      setMarketData({
        indices,
        stocks,
        marketStats,
        sectors
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to fetch market data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Load watchlist from localStorage
  useEffect(() => {
    setWatchlist(watchlistManager.getWatchlist());
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchMarketData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, fetchMarketData]);

  // Handle tab change
  const handleTabChange = async (newTab) => {
    setActiveTab(newTab);
    setLoading(true);
    try {
      const stocks = await marketAPI.getStocks(newTab);
      setMarketData(prev => ({ ...prev, stocks }));
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError('Failed to fetch stocks data.');
    } finally {
      setLoading(false);
    }
  };

  // Watchlist management
  const handleWatchlistToggle = (stock) => {
    const isInWatchlist = watchlistManager.isInWatchlist(stock.symbol);
    
    if (isInWatchlist) {
      watchlistManager.removeFromWatchlist(stock.symbol);
    } else {
      watchlistManager.addToWatchlist(stock);
    }
    
    setWatchlist(watchlistManager.getWatchlist());
  };

  // Search handling
  const handleSearch = (query) => {
    // Implement search logic if needed
    console.log('Searching for:', query);
  };

  const handleSuggestionSelect = (suggestion) => {
    // Navigate to stock detail page or add to watchlist
    console.log('Selected:', suggestion);
  };

  // Utility functions
  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />;
  };

  const getBgChangeColor = (change) => {
    return change >= 0 ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30';
  };  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Error Display */}
        {error && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchMarketData}
                  className="ml-auto border-red-500/30 text-red-300 hover:bg-red-500/10 text-xs"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">MARKET</h1>
              <p className="text-sm text-gray-400">Real-time market data and analytics</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMarketData}
              disabled={loading}
              className="border-gray-700 hover:bg-gray-900 transition-colors text-xs"
            >
              <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Enhanced Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            onSuggestionSelect={handleSuggestionSelect}
            className="max-w-lg"
          />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-min">
          
          {/* Portfolio Overview - Large Card */}
          <Card className="md:col-span-2 lg:col-span-2 xl:col-span-3 bg-black border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Portfolio Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl text-gray-200 font-bold">$127,543.82</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm font-medium">+2.34%</span>
                  <span className="text-gray-500 text-sm ml-2">today</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-lg font-semibold text-green-400">+$2,847.36</div>
                  <div className="text-xs text-gray-500">Day's P&L</div>
                </div>
                <div>
                  <div className="text-lg text-gray-300 font-semibold">${marketData.marketStats.totalVolume || '12.8B'}</div>
                  <div className="text-xs text-gray-500">Volume</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Cards */}
          <Card className="bg-black text-gray-200 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-0 text-xs">
                  +12%
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold">{marketData.marketStats.advancers || '2,847'}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Advancers</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black text-gray-200 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-0 text-xs">
                  -8%
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold">{marketData.marketStats.decliners || '1,423'}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Decliners</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black text-gray-200 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-0 text-xs">
                  Live
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold">{marketData.marketStats.activelyTrading || '4,127'}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Active</div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Section - Large */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 bg-black border-gray-800">
            <CardHeader className="border-b border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Market Chart
                </CardTitle>
                <div className="flex items-center text-gray-200 space-x-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">1D</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 bg-white text-black">1W</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">1M</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">1Y</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 flex items-center justify-center border border-dashed border-gray-700 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Interactive Chart</p>
                  <p className="text-gray-600 text-xs">Real-time price movements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Watchlist - Tall Card */}
          <Card className="md:col-span-1 lg:col-span-1 xl:col-span-2 bg-black border-gray-800">
            <CardHeader className="border-b border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Watchlist
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                    {watchlist.length}
                  </Badge>
                  <Button variant="ghost" size="sm" className="w-6 bg-gray-200 h-6 p-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {watchlist.length > 0 ? (
                <div className="divide-y divide-black">
                  {watchlist.slice(0, 6).map((stock) => (
                    <div key={stock.symbol} className="p-3 hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{stock.symbol}</p>
                          <p className="text-xs text-gray-500 truncate">{stock.name}</p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-sm font-medium">{formatCurrency(stock.price)}</p>
                          <div className={`flex items-center gap-1 text-xs ${getChangeColor(stock.change)}`}>
                            {getChangeIcon(stock.change)}
                            <span>{formatPercentage(stock.changePercent)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Bookmark className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No stocks yet</p>
                  <p className="text-gray-600 text-xs">Add stocks to track</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Market Indices Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300 uppercase tracking-wider">Market Indices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.indices.map((index) => (
              <MarketCard
                key={index.ticker}
                index={index}
                formatCurrency={formatCurrency}
                formatPercentage={formatPercentage}
                getChangeColor={getChangeColor}
                getChangeIcon={getChangeIcon}
                getBgChangeColor={getBgChangeColor}
              />
            ))}
          </div>
        </div>

        {/* Stock Lists Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Stock List */}
          <Card className="lg:col-span-2 bg-black border-gray-800">
            <CardHeader className="border-b border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleTabChange('trending')}
                    className={`text-sm font-medium pb-1 border-b-2 transition-all ${
                      activeTab === 'trending'
                        ? 'border-white text-white'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Trending
                  </button>
                  <button
                    onClick={() => handleTabChange('gainers')}
                    className={`text-sm font-medium pb-1 border-b-2 transition-all ${
                      activeTab === 'gainers'
                        ? 'border-white text-white'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Gainers
                  </button>
                  <button
                    onClick={() => handleTabChange('losers')}
                    className={`text-sm font-medium pb-1 border-b-2 transition-all ${
                      activeTab === 'losers'
                        ? 'border-white text-white'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Losers
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-800">
                {marketData.stocks.map((stock, index) => (
                  <StockRow
                    key={stock.symbol}
                    stock={stock}
                    formatCurrency={formatCurrency}
                    formatPercentage={formatPercentage}
                    getChangeColor={getChangeColor}
                    getChangeIcon={getChangeIcon}
                    onWatchlistToggle={handleWatchlistToggle}
                    isInWatchlist={watchlistManager.isInWatchlist(stock.symbol)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar - Sector Performance */}
          <Card className="bg-black border-gray-800">
            <CardHeader className="border-b border-gray-800 pb-4">
              <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Sector Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-800">
                {marketData.sectors.map((sector) => (
                  <div key={sector.name} className="p-4 hover:bg-gray-800/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-white truncate">{sector.name}</p>
                        <p className="text-xs text-gray-500">{sector.companies} companies</p>
                      </div>
                      <div className={`text-right ml-3 ${getChangeColor(sector.performance)}`}>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(sector.performance)}
                          <span className="text-sm font-medium">{formatPercentage(sector.performance)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-600 text-center font-mono">
            Data delayed 15min • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MarketPage;
