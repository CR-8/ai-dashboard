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
  Activity,
  Building2,
  BarChart3,
  PieChart
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/market-api';
import { SectorChart } from '@/components/ui/sector-chart';

const SectorDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const sectorSlug = params.sector;
  
  const [sectorData, setSectorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('marketCap');
  const [sortOrder, setSortOrder] = useState('desc');
  const [timeframe, setTimeframe] = useState('1M');

  useEffect(() => {
    if (sectorSlug) {
      fetchSectorData();
    }
  }, [sectorSlug]);

  const fetchSectorData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/market/sector/${sectorSlug}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch sector data');
      }
      
      setSectorData(data.data);
    } catch (err) {
      console.error('Error fetching sector data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedStocks = sectorData?.stocks?.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'marketCap') {
      aValue = parseFloat(aValue.replace(/[TB$]/g, '')) * (aValue.includes('T') ? 1000 : 1);
      bValue = parseFloat(bValue.replace(/[TB$]/g, '')) * (bValue.includes('T') ? 1000 : 1);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black border border-gray-400  text-white font-mono">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-black border border-gray-400  rounded w-1/4"></div>
            <div className="h-32 bg-black border border-gray-400 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 border border-gray-400 bg-black rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-black border border-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sectorData) {
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
          
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-2">Sector Not Found</h1>
              <p className="text-gray-400 mb-4">
                {error || `Unable to find data for sector: ${sectorSlug}`}
              </p>
              <Button onClick={() => router.push('/market')} variant="outline">
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
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Market
                </Button>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchSectorData}
                    className="border-gray-700 hover:bg-gray-900"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Sector Overview */}
            <Card className="bg-black text-gray-300 border-gray-800">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{sectorData.name} Sector</h1>
                            <p className="text-gray-400 mb-4">{sectorData.description}</p>
                            <div className="flex items-center space-x-4">
                                <Badge variant="secondary" className=" text-gray-300">
                                    {sectorData.companies} Companies
                                </Badge>
                                <Badge variant="secondary" className=" text-gray-300">
                                    Market Cap: {sectorData.totalMarketCap}
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className="text-2xl font-bold mb-1">Sector Performance</div>
                            <div className={`flex items-center justify-end gap-2 text-xl ${getChangeColor(sectorData.performance)}`}>
                                {getChangeIcon(sectorData.performance)}
                                <span>{formatPercentage(sectorData.performance)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Volume</p>
                            <p className="text-lg font-semibold">{sectorData.volume}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Avg P/E Ratio</p>
                            <p className="text-lg font-semibold">{sectorData.avgPE}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Top Performer</p>
                            <p className="text-lg font-semibold text-green-400">{sectorData.topPerformer}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Worst Performer</p>
                            <p className="text-lg font-semibold text-red-400">{sectorData.worstPerformer}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sector Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-4">
                <Card className="bg-black text-gray-300 border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-0 text-xs">
                                Gainers
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xl font-bold">{sectorData.gainers}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Advancing Stocks</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black text-gray-300 border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingDown className="w-5 h-5 text-red-400" />
                            <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-0 text-xs">
                                Losers
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xl font-bold">{sectorData.losers}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Declining Stocks</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black text-gray-300 border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Activity className="w-5 h-5 text-blue-400" />
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-0 text-xs">
                                Active
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xl font-bold">{sectorData.activeStocks}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Actively Trading</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black text-gray-300 border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Building2 className="w-5 h-5 text-purple-400" />
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-0 text-xs">
                                Total
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xl font-bold">{sectorData.companies}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Companies</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sector Performance Chart */}
            <Card className="bg-black text-gray-300 border-gray-800">
                <CardHeader className="border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Sector Performance
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                            {['1W', '1M', '3M', '1Y'].map((period) => (
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
                <CardContent className="p-0">
                    <SectorChart
                        sector={sectorSlug}
                        timeframe={timeframe}
                        height={320}
                        className="p-6"
                    />
                </CardContent>
            </Card>

            {/* All Companies Table */}
            <Card className="bg-black text-gray-300 border-gray-800">
                <CardHeader className="border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                            All {sectorData.name} Companies ({sectorData.stocks?.length || 0})
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Sort by:</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSort('marketCap')}
                                className={`text-xs ${sortBy === 'marketCap' ? 'text-white' : 'text-gray-400'}`}
                            >
                                Market Cap {sortBy === 'marketCap' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSort('changePercent')}
                                className={`text-xs ${sortBy === 'changePercent' ? 'text-white' : 'text-gray-400'}`}
                            >
                                Change {sortBy === 'changePercent' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSort('volume')}
                                className={`text-xs ${sortBy === 'volume' ? 'text-white' : 'text-gray-400'}`}
                            >
                                Volume {sortBy === 'volume' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {!sortedStocks || sortedStocks.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No companies found in this sector</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
                            {sortedStocks.map((stock, index) => (
                                <div 
                                    key={stock.symbol} 
                                    className="p-4 hover:bg-gray-800/30 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/market/stock/${stock.symbol}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-xs text-gray-500 w-8">
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-white">{stock.symbol}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-48">{stock.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-6">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-white">{formatCurrency(stock.price)}</p>
                                                <div className={`flex items-center justify-end gap-1 text-xs ${getChangeColor(stock.change)}`}>
                                                    {getChangeIcon(stock.change)}
                                                    <span>{formatPercentage(stock.changePercent)}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right text-xs text-gray-500 min-w-20">
                                                <p className="font-medium">{stock.marketCap}</p>
                                                <p>Vol: {stock.volume}</p>
                                            </div>
                                            
                                            <div className="text-right text-xs text-gray-500 min-w-16">
                                                {stock.pe && <p>P/E: {stock.pe}</p>}
                                                {stock.dividend && <p>Div: {stock.dividend}%</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
);
};

export default SectorDetailPage;
