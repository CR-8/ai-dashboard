'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Star,
  Share2,
  Plus,
  Activity,
  DollarSign,
  Target,
  BarChart3,
  Sparkle
} from 'lucide-react';
import { formatCurrency, formatPercentage, watchlistManager } from '@/lib/market-api';
import InteractiveChart from '@/components/ui/interactive-chart';

const StockDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol?.toUpperCase();
  
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');

  useEffect(() => {
    if (symbol) {
      fetchStockData();
      setIsInWatchlist(watchlistManager.isInWatchlist(symbol));
    }
  }, [symbol]);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/market/stock/${symbol}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch stock data');
      }
      
      setStockData(data.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = () => {
    if (!stockData) return;
    
    if (isInWatchlist) {
      watchlistManager.removeFromWatchlist(symbol);
    } else {
      watchlistManager.addToWatchlist({
        symbol: stockData.symbol,
        name: stockData.name,
        price: stockData.price,
        change: stockData.change,
        changePercent: stockData.changePercent
      });
    }
    
    setIsInWatchlist(!isInWatchlist);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-gray-800 rounded"></div>
              <div className="h-96 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Market
          </Button>
          
          <Card className="border-red-500/20 text-gray-200 bg-red-500/20">
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-2">Stock Not Found</h1>
              <p className="text-gray-400 mb-4">
                {error || `Unable to find data for symbol: ${symbol}`}
              </p>
              <Button onClick={() => router.push('/market')} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                Return to Market
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-black text-white font-mono">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

            {/* Header */}
                        <div className="flex items-center justify-between animate-fade-in">
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                                Back
                            </Button>
                            
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleWatchlistToggle}
                                    className={`${isInWatchlist ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 border hover:cursor-pointer border-gray-700 hover:bg-gray-900 transition-all duration-300 hover:scale-105 animate-slide-in-right`}
                                    style={{ animationDelay: '0.1s' }}
                                >
                                    <Star className={`w-4 h-4 mr-2 transition-all duration-300 ${isInWatchlist ? 'fill-current rotate-12' : 'hover:rotate-12'}`} />
                                    {isInWatchlist ? 'Remove' : 'Watch'}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 border border-gray-700 hover:cursor-pointer hover:bg-gradient-to-r hover:from-[#bf14a2] hover:to-[#f73a1c] hover:text-white transition-all duration-500 hover:scale-105 animate-slide-in-right group"
                                    style={{ animationDelay: '0.2s' }}
                                    onClick={async () => {
                                        try {
                                            console.log(`Analyzing ${symbol}...`);
                                            
                                            const response = await fetch('/api/analyze-company', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({ symbol }),
                                            });

                                            if (!response.ok) {
                                                throw new Error(`HTTP error! status: ${response.status}`);
                                            }

                                            const data = await response.json();
                                            
                                            if (data.error) {
                                                console.warn('API returned error:', data.error);
                                            } else {
                                                console.log('Successfully analyzed:', symbol);
                                                router.push(`/dashboard/${symbol}`);
                                            }
                                        } catch (error) {
                                            console.error('Error analyzing company:', error);
                                        }
                                    }}
                                >
                                    <Sparkle className="w-4 h-4 mr-2 transition-all duration-300 group-hover:rotate-180 group-hover:scale-110" />
                                    Analyze using AI
                                </Button>
                                
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-400 hover:cursor-pointer border border-gray-700 hover:bg-gray-900 hover:text-white hover:scale-105"
                                >
                                    <Share2 className="w-4 h-4 mr-2 transition-all duration-300 group-hover:rotate-12" />
                                    Share
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchStockData}
                                    className="border-gray-700 hover:cursor-pointer hover:bg-gray-900 transition-all duration-300 hover:scale-105 animate-slide-in-right group"
                                    style={{ animationDelay: '0.4s' }}
                                >
                                    <RefreshCw className="w-4 h-4 mr-2 transition-all duration-300 group-hover:rotate-180" />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {/* Stock Overview */}
            <Card className="bg-black text-gray-300 border-gray-800">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold">{stockData.symbol}</h1>
                            <p className="text-gray-400">{stockData.name}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                    {stockData.exchange}
                                </Badge>
                                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                    {stockData.sector}
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className="text-4xl font-bold">{formatCurrency(stockData.price)}</div>
                            <div className={`flex items-center justify-end gap-2 text-lg ${getChangeColor(stockData.change)}`}>
                                {getChangeIcon(stockData.change)}
                                <span>{stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}</span>
                                <span>({formatPercentage(stockData.changePercent)})</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Market Cap</p>
                            <p className="text-lg font-semibold">{stockData.marketCap}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Volume</p>
                            <p className="text-lg font-semibold">{stockData.volume}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Day High</p>
                            <p className="text-lg font-semibold">{formatCurrency(stockData.dayHigh)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Day Low</p>
                            <p className="text-lg font-semibold">{formatCurrency(stockData.dayLow)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Chart and Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Interactive Chart */}
                <Card className="lg:col-span-2 bg-black text-gray-300 border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Price Chart
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((period) => (
                                    <Button
                                        key={period}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setTimeframe(period)}
                                        className={`text-xs h-7 px-2 ${
                                            timeframe === period ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {period}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-black text-gray-300">
                        <InteractiveChart
                            symbol={stockData.symbol}
                            timeframe={timeframe}
                            height={320}
                            className="p-6 bg-black text-gray-300"
                        />
                    </CardContent>
                </Card>

                {/* Stock Details Sidebar */}
                <div className="space-y-6">
                    
                    {/* Key Metrics */}
                    <Card className="bg-black text-gray-300 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Key Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">P/E Ratio</span>
                                <span className="font-semibold">{stockData.peRatio || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">EPS</span>
                                <span className="font-semibold">{stockData.eps || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">52W High</span>
                                <span className="font-semibold">{formatCurrency(stockData.weekHigh52)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">52W Low</span>
                                <span className="font-semibold">{formatCurrency(stockData.weekLow52)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Avg Volume</span>
                                <span className="font-semibold">{stockData.avgVolume}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Beta</span>
                                <span className="font-semibold">{stockData.beta || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-black text-gray-300 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button 
                                variant="outline" 
                                className="w-full justify-start border-gray-700 hover:bg-gray-800"
                                onClick={() => router.push(`/market/sector/${stockData.sector.toLowerCase().replace(/\s+/g, '-')}`)}
                            >
                                <Target className="w-4 h-4 mr-2" />
                                View {stockData.sector} Sector
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="w-full justify-start border-gray-700 hover:bg-gray-800"
                            >
                                <Activity className="w-4 h-4 mr-2" />
                                Technical Analysis
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="w-full justify-start border-gray-700 hover:bg-gray-800"
                            >
                                <DollarSign className="w-4 h-4 mr-2" />
                                Financial Statements
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
);
};

export default StockDetailPage;
