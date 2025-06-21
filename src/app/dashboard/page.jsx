"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
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
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Power BI color palette
const colors = {
  primary: "#0078D4",
  secondary: "#106EBE", 
  accent1: "#8B5CF6",
  accent2: "#06D6A0",
  accent3: "#FFD60A",
  accent4: "#F72585",
  accent5: "#4CC9F0",
  success: "#00B7C3",
  warning: "#FF8C00",
  danger: "#E74C3C",
  dark: "#323130",
  light: "#F3F2F1"
};

const defaultData = {
  overview: {
    marketSize: "0",
    growthRate: "0%",
    trend: "stable",
    summary: "Enter a keyword to analyze market data"
  },
  monthlyData: [],
  channels: [],
  topCompetitors: [],
  regions: [],
  performanceMetrics: [],
  keyMetrics: {
    customerAcquisitionCost: 0,
    lifetimeValue: 0,
    churnRate: 0,
    conversionRate: 0,
    marketPenetration: 0,
    customerSatisfaction: 0
  }
};

function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      setCurrentKeyword(searchParam);
      handleAnalyze(searchParam);
    }
  }, [searchParams]);
  const handleAnalyze = async (keyword = searchQuery) => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setCurrentKeyword(keyword);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Transform API data to match our chart format
        const transformedData = {
          overview: result.data.overview,
          monthlyData: result.data.monthlyData || [],
          channels: result.data.channels || [],
          topCompetitors: (result.data.topCompetitors || []).map((comp, index) => ({
            ...comp,
            color: [colors.accent1, colors.accent2, colors.accent3, colors.accent4, colors.accent5][index % 5]
          })),
          regions: result.data.regions || [],
          performanceMetrics: [
            { 
              metric: "CAC", 
              value: result.data.keyMetrics?.customerAcquisitionCost || 0, 
              target: (result.data.keyMetrics?.customerAcquisitionCost || 0) * 1.2,
              unit: "$" 
            },
            { 
              metric: "LTV", 
              value: result.data.keyMetrics?.lifetimeValue || 0, 
              target: (result.data.keyMetrics?.lifetimeValue || 0) * 0.9,
              unit: "$" 
            },
            { 
              metric: "Churn Rate", 
              value: result.data.keyMetrics?.churnRate || 0, 
              target: (result.data.keyMetrics?.churnRate || 0) * 0.8,
              unit: "%" 
            },
            { 
              metric: "Conversion", 
              value: result.data.keyMetrics?.conversionRate || 0, 
              target: (result.data.keyMetrics?.conversionRate || 0) * 1.1,
              unit: "%" 
            }
          ],
          keyMetrics: result.data.keyMetrics || defaultData.keyMetrics
        };
        
        setData(transformedData);
      } else {
        setError(result.error || 'Failed to analyze keyword');
        console.error('API Error:', result.error);
      }
    } catch (error) {
      setError('Network error - please check your connection');
      console.error('Error calling API:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };
  const KPICard = ({ title, value, change, icon: Icon, color = colors.primary }) => (
    <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-2 font-medium tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-white mb-1 group-hover:text-blue-100 transition-colors">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                {change.startsWith('+') ? (
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1.5 animate-pulse" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1.5 animate-pulse" />
                )}
                <span className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div 
            className="p-4 rounded-xl transition-all duration-300 group-hover:scale-110" 
            style={{ 
              backgroundColor: `${color}15`, 
              border: `1px solid ${color}30`,
              boxShadow: `0 0 20px ${color}20`
            }}
          >
            <Icon className="h-7 w-7 transition-all duration-300" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  const formatNumber = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };
  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-gray-800/50 backdrop-blur-sm px-6 py-6 shadow-2xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Business Intelligence Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              {currentKeyword ? (
                <span className="flex items-center gap-2">
                  Analysis for: 
                  <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
                    {currentKeyword}
                  </span>
                </span>
              ) : (
                "Enter a keyword to start analysis"
              )}
            </p>
            {error && (
              <div className="flex items-center mt-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertTriangle className="h-4 w-4 mr-2 animate-pulse" />
                {error}
              </div>
            )}
          </div>          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter keyword to analyze..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-96 px-5 py-3 bg-gradient-to-r from-[#2a2a2a] to-[#323232] border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 group-hover:border-gray-500"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
            </div>
            <Button 
              onClick={() => handleAnalyze()}
              disabled={loading || !searchQuery.trim()}
              className="bg-white  text-black px-8 py-3 rounded-xl font-semibold hover:cursor-pointer hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Activity className="h-5 w-5 mr-2" />
              )}
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <KPICard
            title="Market Size"
            value={data.overview.marketSize ? `$${data.overview.marketSize}B` : "No data"}
            change={data.overview.growthRate !== "0%" ? data.overview.growthRate : null}
            icon={Globe}
            color={colors.primary}
          />
          <KPICard
            title="Monthly Revenue"
            value={data.monthlyData.length > 0 ? formatCurrency(data.monthlyData[data.monthlyData.length - 1]?.revenue || 0) : "No data"}
            change={data.monthlyData.length > 0 ? "+8.2%" : null}
            icon={DollarSign}
            color={colors.success}
          />
          <KPICard
            title="Active Users"
            value={data.monthlyData.length > 0 ? formatNumber(data.monthlyData[data.monthlyData.length - 1]?.users || 0) : "No data"}
            change={data.monthlyData.length > 0 ? "+12.3%" : null}
            icon={Users}
            color={colors.accent2}
          />
          <KPICard
            title="Conversion Rate"
            value={data.keyMetrics.conversionRate > 0 ? `${data.keyMetrics.conversionRate}%` : "No data"}
            change={data.keyMetrics.conversionRate > 0 ? "+0.3%" : null}
            icon={Target}
            color={colors.accent3}
          />
        </div>       
        {data.monthlyData.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="bg-transparent border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Revenue vs Expenses Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={data.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" tickFormatter={formatCurrency} fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [formatCurrency(value), '']}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke={colors.primary}
                      fill={colors.primary}
                      fillOpacity={0.7}
                      name="Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="2"
                      stroke={colors.warning}
                      fill={colors.warning}
                      fillOpacity={0.7}
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-transparent border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  User Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={data.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" tickFormatter={formatNumber} fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [formatNumber(value), 'Users']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke={colors.accent2}
                      strokeWidth={4}
                      dot={{ fill: colors.accent2, strokeWidth: 3, r: 5 }}
                      name="Active Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {data.channels.length > 0 && (
              <Card className="bg-transparent border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={data.channels}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {data.channels.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '12px',
                          color: 'white',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [`${value}%`, 'Share']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {data.performanceMetrics.length > 0 && (
              <Card className="bg-transparent border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data.performanceMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="metric" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '12px',
                          color: 'white',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill={colors.primary} name="Actual" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" fill={colors.accent4} name="Target" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border-gray-700/50">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No Analysis Data</h3>
              <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
                Enter a keyword above and click "Analyze" to view comprehensive market insights and analytics.
              </p>
              <Button 
                onClick={() => setSearchQuery("AI chatbots")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"              >
                Try "AI chatbots" as example
              </Button>
            </CardContent>
          </Card>
        )}

        {(data.regions.length > 0 || data.topCompetitors.length > 0) && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {data.regions.length > 0 && (
              <Card className="bg-transparent border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    Regional Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data.regions} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis type="number" stroke="#9CA3AF" tickFormatter={formatCurrency} fontSize={12} />
                      <YAxis dataKey="region" type="category" stroke="#9CA3AF" width={100} fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '12px',
                          color: 'white',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [formatCurrency(value), 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill={colors.accent2} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {data.topCompetitors.length > 0 && (
              <Card className="bg-transparent border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    Market Share Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={data.topCompetitors}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="marketShare"
                        label={({ name, marketShare }) => `${name}: ${marketShare}%`}
                      >
                        {data.topCompetitors.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '12px',
                          color: 'white',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [`${value}%`, 'Market Share']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-transparent border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center text-lg font-semibold">
                <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                Key Performance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="text-gray-400 font-medium">Customer Acquisition Cost</span>
                <span className="text-white font-semibold text-lg">
                  {data.keyMetrics.customerAcquisitionCost > 0 ? `$${data.keyMetrics.customerAcquisitionCost}` : "No data"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="text-gray-400 font-medium">Lifetime Value</span>
                <span className="text-white font-semibold text-lg">
                  {data.keyMetrics.lifetimeValue > 0 ? `$${data.keyMetrics.lifetimeValue}` : "No data"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="text-gray-400 font-medium">Churn Rate</span>
                <span className="text-white font-semibold text-lg">
                  {data.keyMetrics.churnRate > 0 ? `${data.keyMetrics.churnRate}%` : "No data"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 font-medium">Market Penetration</span>
                <span className="text-white font-semibold text-lg">
                  {data.keyMetrics.marketPenetration > 0 ? `${data.keyMetrics.marketPenetration}%` : "No data"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                Export Report
              </Button>
              <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
                Schedule Update
              </Button>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                Share Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-transparent border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg font-semibold">Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={`px-3 py-1 rounded-full font-medium ${data.overview.trend === 'up' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 
                      data.overview.trend === 'down' ? 'border-red-500/50 text-red-400 bg-red-500/10' : 
                      'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'}`}
                  >
                    {data.overview.trend === 'up' ? '📈 Growing' : 
                     data.overview.trend === 'down' ? '📉 Declining' : '📊 Stable'}
                  </Badge>
                  <span className="text-sm text-gray-400 font-medium">Market Trend</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {data.overview.summary}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                  <span className="text-gray-400 font-medium">Growth Rate</span>
                  <span className={`font-bold text-lg ${
                    data.overview.growthRate.startsWith('+') ? 'text-green-400' : 
                    data.overview.growthRate.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {data.overview.growthRate !== "0%" ? data.overview.growthRate : "No data"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Loading Dashboard...</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
