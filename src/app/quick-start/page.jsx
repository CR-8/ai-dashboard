import React from 'react'

function QuickStart() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Quick Start Guide</h1>
        <p className="text-gray-400 text-lg mb-8">Get up and running with AI Dashboard in minutes</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md">
            <h3 className="text-xl font-semibold text-white mb-3">1. Setup</h3>
            <p className="text-gray-400">Configure your AI Dashboard environment and connect your data sources.</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md">
            <h3 className="text-xl font-semibold text-white mb-3">2. Explore</h3>
            <p className="text-gray-400">Discover powerful AI features and visualization capabilities.</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md">
            <h3 className="text-xl font-semibold text-white mb-3">3. Create</h3>
            <p className="text-gray-400">Build stunning dashboards with AI-powered insights.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickStart