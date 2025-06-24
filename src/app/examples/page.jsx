"use client";

import React , {useState} from 'react'
import { TrendingUp, Users, DollarSign, BarChart3, Eye, ArrowUpRight, Activity, Target, Zap, Settings, Calendar, Filter } from 'lucide-react'
import SplashScreen from "@/components/ui/splash-screen2";

function Example() {
  const examples = [
    {
      id: 'sales',
      title: 'Sales Analytics',
      description: 'Track sales performance with AI-powered insights and predictions.',
      icon: <TrendingUp className="w-6 h-6" />,
      metrics: [
        { label: 'Revenue', value: '$124.5K', change: '+12.3%' },
        { label: 'Conversion', value: '3.2%', change: '+0.8%' }
      ],
      tags: ['Analytics', 'Forecasting', 'Performance'],
      featured: true
    },
    {
      id: 'customers',
      title: 'Customer Insights',
      description: 'Understand your customers better with advanced analytics and AI.',
      icon: <Users className="w-6 h-6" />,
      metrics: [
        { label: 'Active Users', value: '12.4K', change: '+5.2%' },
        { label: 'Retention', value: '84.2%', change: '+2.1%' }
      ],
      tags: ['Behavior', 'Segmentation', 'Insights']
    },
    {
      id: 'financial',
      title: 'Financial Dashboard',
      description: 'Monitor financial metrics and forecasts with real-time data.',
      icon: <DollarSign className="w-6 h-6" />,
      metrics: [
        { label: 'Cash Flow', value: '$45.2K', change: '+8.7%' },
        { label: 'Expenses', value: '$23.1K', change: '-3.2%' }
      ],
      tags: ['Finance', 'Reporting', 'Forecasting']
    },
    {
      id: 'operations',
      title: 'Operations Monitor',
      description: 'Real-time operational metrics and performance indicators.',
      icon: <Activity className="w-6 h-6" />,
      metrics: [
        { label: 'Uptime', value: '99.9%', change: '+0.1%' },
        { label: 'Response', value: '120ms', change: '-15ms' }
      ],
      tags: ['Monitoring', 'Performance', 'Alerts']
    },
    {
      id: 'marketing',
      title: 'Marketing Analytics',
      description: 'Campaign performance and attribution tracking with AI insights.',
      icon: <Target className="w-6 h-6" />,
      metrics: [
        { label: 'ROAS', value: '3.4x', change: '+0.3x' },
        { label: 'CTR', value: '2.8%', change: '+0.5%' }
      ],
      tags: ['Campaigns', 'Attribution', 'ROI']
    },
    {
      id: 'productivity',
      title: 'Team Productivity',
      description: 'Track team performance and project completion rates.',
      icon: <Zap className="w-6 h-6" />,
      metrics: [
        { label: 'Velocity', value: '42 pts', change: '+6 pts' },
        { label: 'Completion', value: '87%', change: '+4%' }
      ],
      tags: ['Teams', 'Projects', 'Efficiency']
    }
  ]

  const categories = ['All', 'Analytics', 'Performance', 'Forecasting', 'Monitoring']
  
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={6000} />;
  }
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
            <Eye className="w-4 h-4" />
            <span className="text-sm text-gray-400">EXAMPLES</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Dashboard Gallery
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore production-ready dashboard examples. Each template includes 
            real-time data connections, AI insights, and customizable components.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter by:</span>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                    category === 'All' 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Updated daily</span>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {examples.map((example, index) => (
            <div
              key={example.id}
              className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all cursor-pointer group ${
                example.featured ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Preview Area */}
              <div className="h-48 bg-white/5 border-b border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                    {example.icon}
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    {example.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                        <div className="text-sm font-bold">{metric.value}</div>
                        <div className={`text-xs ${
                          metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {metric.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{example.title}</h3>
                  {example.featured && (
                    <div className="bg-white/10 border border-white/20 rounded-full px-2 py-1 text-xs">
                      Featured
                    </div>
                  )}
                </div>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {example.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {example.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Create Custom Dashboard</h3>
                <p className="text-sm text-gray-400">Build from scratch with our components</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Start with blank canvas</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Request Template</h3>
                <p className="text-sm text-gray-400">Need something specific? Let us know</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Custom development available</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Example