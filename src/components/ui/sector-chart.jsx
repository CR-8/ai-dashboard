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

const SectorChart = ({ 
  sector, 
  timeframe = '1M',
  height = 300,
  className = "bg-black text-gray-300 rounded-lg shadow-lg p-4",
}) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sector) {
      fetchChartData();
    }
  }, [sector, timeframe]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/market/sector-chart/${sector}?timeframe=${timeframe}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch chart data');
      }
      
      setChartData(data.data);
    } catch (err) {
      console.error('Error fetching sector chart data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    
    switch (timeframe) {
      case '1W':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case '1M':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case '3M':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case '1Y':
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black text-gray-300 border border-white rounded-lg p-3 shadow-lg">
          <p className="text-gray-400 text-xs mb-1">
            {new Date(data.timestamp).toLocaleDateString('en-US', { 
              weekday: 'short',
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <div className="space-y-1">
            <p className="text-white font-semibold">
              Index: {data.value.toFixed(2)}
            </p>
            <p className={`text-sm ${data.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Performance: {data.performance >= 0 ? '+' : ''}{data.performance.toFixed(2)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-red-400 text-sm">Failed to load chart</p>
          <p className="text-gray-500 text-xs mt-1">{error}</p>
          <button 
            onClick={fetchChartData}
            className="mt-2 text-xs text-gray-400 hover:text-white underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  const isPositive = chartData[chartData.length - 1]?.performance >= 0;

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="sectorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0.3}
              />
              <stop 
                offset="95%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#374151" 
            vertical={false}
          />
          
          <XAxis 
            dataKey="timestamp"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickFormatter={formatDate}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickFormatter={(value) => value.toFixed(0)}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine y={100} stroke="#6b7280" strokeDasharray="2 2" />
          
          <Area
            type="monotone"
            dataKey="value"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fill="url(#sectorGradient)"
            dot={false}
            activeDot={{ 
              r: 4, 
              fill: isPositive ? "#10b981" : "#ef4444",
              stroke: "#000",
              strokeWidth: 2
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export { SectorChart };
