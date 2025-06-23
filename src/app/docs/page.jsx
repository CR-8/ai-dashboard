"use client"

import React, { useState } from 'react'
import { 
  Book, 
  Search, 
  ChevronRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Code, 
  Terminal, 
  Zap, 
  Shield, 
  Database, 
  Palette, 
  Settings, 
  HelpCircle,
  FileText,
  Rocket,
  Users,
  MessageSquare,
  Star,
  Clock,
  ChevronDown
} from 'lucide-react'

function Docs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState('')
  const [activeSection, setActiveSection] = useState('getting-started')

  const navigation = [
    {
      title: 'Getting Started',
      items: [
        { id: 'quick-start', title: 'Quick Start', icon: <Rocket className="w-4 h-4" /> },
        { id: 'installation', title: 'Installation', icon: <Terminal className="w-4 h-4" /> },
        { id: 'configuration', title: 'Configuration', icon: <Settings className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Components',
      items: [
        { id: 'charts', title: 'Charts & Graphs', icon: <Palette className="w-4 h-4" /> },
        { id: 'data-tables', title: 'Data Tables', icon: <Database className="w-4 h-4" /> },
        { id: 'widgets', title: 'Widgets', icon: <Zap className="w-4 h-4" /> }
      ]
    },
    {
      title: 'API Reference',
      items: [
        { id: 'authentication', title: 'Authentication', icon: <Shield className="w-4 h-4" /> },
        { id: 'endpoints', title: 'Endpoints', icon: <Code className="w-4 h-4" /> },
        { id: 'webhooks', title: 'Webhooks', icon: <ExternalLink className="w-4 h-4" /> }
      ]
    }
  ]

  const quickLinks = [
    { title: 'API Keys', description: 'Generate and manage API keys', icon: <Shield className="w-5 h-5" />, time: '2 min read' },
    { title: 'Data Sources', description: 'Connect your data sources', icon: <Database className="w-5 h-5" />, time: '5 min read' },
    { title: 'Custom Themes', description: 'Create custom dashboard themes', icon: <Palette className="w-5 h-5" />, time: '8 min read' },
    { title: 'Webhooks Setup', description: 'Configure real-time webhooks', icon: <ExternalLink className="w-5 h-5" />, time: '3 min read' }
  ]

  const codeExample = `// Initialize AI Dashboard
import { Dashboard } from '@ai-dashboard/core'

const dashboard = new Dashboard({
  apiKey: 'your-api-key',
  theme: 'dark',
  realtime: true
})

// Add a chart component
dashboard.addChart({
  type: 'line',
  data: '/api/analytics/sales',
  container: '#sales-chart'
})`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeExample)
    setCopiedCode('copied')
    setTimeout(() => setCopiedCode(''), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
            <Book className="w-4 h-4" />
            <span className="text-sm text-gray-400">DOCUMENTATION</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Developer Guide
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to build powerful AI-driven dashboards. 
            From quick setup to advanced customization.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-colors"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              Press / to focus
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-400">Contents</h3>
              <nav className="space-y-6">
                {navigation.map((section) => (
                  <div key={section.title}>
                    <h4 className="font-medium mb-3 text-sm">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => setActiveSection(item.id)}
                            className={`flex items-center gap-3 w-full text-left p-2 rounded-lg transition-colors ${
                              activeSection === item.id 
                                ? 'bg-white/10 text-white' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {item.icon}
                            <span className="text-sm">{item.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Start Section */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Quick Start</h2>
                  <p className="text-gray-400">Get up and running in under 5 minutes</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Installation</h3>
                  <div className="bg-black/50 rounded-lg p-4 relative">
                    <code className="text-green-400 text-sm">
                      npm install @ai-dashboard/core
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="absolute right-3 top-3 p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Basic Usage</h3>
                  <div className="bg-black/50 rounded-lg p-4 relative">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{codeExample}</code>
                    </pre>
                    <button
                      onClick={handleCopyCode}
                      className="absolute right-3 top-3 p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickLinks.map((link, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{link.title}</h3>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{link.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{link.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-gray-400 mb-4">Join our Discord community for help and discussions</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Users className="w-3 h-3" />
              <span>12.4K members</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-sm text-gray-400 mb-4">Get help from our support team</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span> 2 hour response</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Examples</h3>
            <p className="text-sm text-gray-400 mb-4">Browse code examples and templates</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Star className="w-3 h-3" />
              <span>50+ examples</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Docs