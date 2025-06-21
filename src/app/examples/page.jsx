import React from 'react'

function Example() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">Dashboard Examples</h1>
          <p className="text-gray-400 text-lg">Explore these example dashboards to see what's possible with AI Dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
            <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-b border-white/10"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Sales Analytics</h3>
              <p className="text-gray-400">Track sales performance with AI-powered insights and predictions.</p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
            <div className="h-48 bg-gradient-to-br from-green-600/20 to-teal-600/20 border-b border-white/10"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Customer Insights</h3>
              <p className="text-gray-400">Understand your customers better with advanced analytics and AI.</p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
            <div className="h-48 bg-gradient-to-br from-orange-600/20 to-red-600/20 border-b border-white/10"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Financial Dashboard</h3>
              <p className="text-gray-400">Monitor financial metrics and forecasts with real-time data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Example