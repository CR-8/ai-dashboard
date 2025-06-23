import React from 'react'
import { ChevronRight, Zap, Search, Palette, ArrowRight, CheckCircle, Clock, Users } from 'lucide-react'

function QuickStart() {
  const steps = [
    {
      id: '01',
      title: 'Setup',
      description: 'Configure your AI Dashboard environment and connect your data sources.',
      icon: <Zap className="w-5 h-5" />,
      status: 'complete'
    },
    {
      id: '02', 
      title: 'Explore',
      description: 'Discover powerful AI features and visualization capabilities.',
      icon: <Search className="w-5 h-5" />,
      status: 'active'
    },
    {
      id: '03',
      title: 'Create',
      description: 'Build stunning dashboards with AI-powered insights.',
      icon: <Palette className="w-5 h-5" />,
      status: 'pending'
    }
  ]

  const features = [
    { label: 'Data Sources', value: '12+', icon: <Users className="w-4 h-4" /> },
    { label: 'Setup Time', value: '5 min', icon: <Clock className="w-4 h-4" /> },
    { label: 'Success Rate', value: '99.9%', icon: <CheckCircle className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">QUICK START</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Get Started in Minutes
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Deploy your AI Dashboard with our streamlined setup process. 
            No complex configurations required.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{feature.label}</span>
                {feature.icon}
              </div>
              <div className="text-2xl font-bold">{feature.value}</div>
            </div>
          ))}
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Large Feature Card */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Step-by-Step Guide</h2>
                <p className="text-gray-400">Follow our structured approach to get up and running</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.status === 'complete' ? 'bg-green-500/20 text-green-500 border border-green-500/20' :
                    step.status === 'active' ? 'bg-white/20 text-white border border-white/20' :
                    'bg-white/5 text-gray-500 border border-white/10'
                  }`}>
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                  <div className="text-gray-400">
                    {step.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Cards */}
          <div className="space-y-6">
            {/* Documentation Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Documentation</h3>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Complete guides and API references for advanced configuration.
              </p>
              <div className="text-xs text-gray-500">
                Last updated: 2 days ago
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Support</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                24/7 technical support and community forums available.
              </p>
              <div className="text-xs text-gray-500">
                Average response: 2 hours
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Start Setup</h3>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-gray-400 mb-6">
              Begin the automated setup process with our configuration wizard.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Estimated time: 5 minutes</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">View Examples</h3>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-gray-400 mb-6">
              Explore sample dashboards and use cases to inspire your setup.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>12 example templates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickStart