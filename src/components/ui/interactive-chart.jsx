'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const InteractiveChart = ({ 
  symbol, 
  timeframe = '1D',
  chartType = 'line',
  height = 300,
  className = "bg-black text-gray-300 rounded-lg shadow-lg p-4"
}) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (symbol) {
      fetchChartData();
    }
  }, [symbol, timeframe]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/market/chart/${symbol}?timeframe=${timeframe}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch chart data');
      }
      
      setChartData(data.data);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    return `$${value.toFixed(2)}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    switch (timeframe) {
      case '1D':
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      case '1W':
      case '1M':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case '3M':
      case '1Y':
      case '5Y':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
      default:
        return date.toLocaleDateString();
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.price >= data.openPrice;
      
      return (
        <div className="bg-black text-gray-300 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-1">
            {new Date(label).toLocaleString()}
          </p>
          <div className="space-y-1">
            <p className="text-white font-semibold">
              Price: {formatPrice(data.price)}
            </p>
            <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              Change: {isPositive ? '+' : ''}{(data.price - data.openPrice).toFixed(2)} 
              ({((data.price - data.openPrice) / data.openPrice * 100).toFixed(2)}%)
            </p>
            {data.volume && (
              <p className="text-gray-400 text-sm">
                Volume: {data.volume.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-black text-gray-300 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error || chartData.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-black text-gray-300 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="w-12 h-12 text-gray-600 mx-auto mb-3">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 14l3-3 3 3 5-5v4h2V8h-5v2l-3 3-3-3-4 4z"/>
            </svg>
          </div>
          <p className="text-gray-400 text-sm">
            {error || 'No chart data available'}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            {symbol} - {timeframe}
          </p>
        </div>
      </div>
    );
  }

  const firstPrice = chartData[0]?.openPrice || chartData[0]?.price;
  const lastPrice = chartData[chartData.length - 1]?.price;
  const isPositiveChange = lastPrice >= firstPrice;

  return (
    <div className={`bg-black text-gray-300 rounded-lg p-4 ${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">{symbol}</h3>
            <p className="text-gray-400 text-sm">{timeframe} Chart</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-xl">
              {formatPrice(lastPrice)}
            </p>
            <p className={`text-sm ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
              {isPositiveChange ? '+' : ''}{(lastPrice - firstPrice).toFixed(2)} 
              ({((lastPrice - firstPrice) / firstPrice * 100).toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height - 80}>
        {chartType === 'area' ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositiveChange ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositiveChange ? "#10b981" : "#ef4444"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime}
              stroke="#9CA3AF"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={formatPrice}
              stroke="#9CA3AF"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={firstPrice} 
              stroke="#6B7280" 
              strokeDasharray="2 2" 
              opacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositiveChange ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fill={`url(#gradient-${symbol})`}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: isPositiveChange ? "#10b981" : "#ef4444",
                stroke: "#1f2937",
                strokeWidth: 2
              }}
            />
          </AreaChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime}
              stroke="#9CA3AF"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={formatPrice}
              stroke="#9CA3AF"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={firstPrice} 
              stroke="#6B7280" 
              strokeDasharray="2 2" 
              opacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositiveChange ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: isPositiveChange ? "#10b981" : "#ef4444",
                stroke: "#1f2937",
                strokeWidth: 2
              }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default InteractiveChart;
