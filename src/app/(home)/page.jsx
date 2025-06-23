"use client";

import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, BarChart3, Brain, Zap, ChevronRight, ArrowUpRight, Activity, DollarSign, Users, PieChart, LineChart, Building2, Globe, Clock, Shield, Play, Star, ArrowRight } from "lucide-react";
import { 
    animateHeroText, 
    animateSearchBar, 
    animateCounters, 
    animateBentoCards, 
    animateButtonHover, 
    animateButtonClick,
    pageEnterAnimation
} from "@/lib/animations";

export default function ProfessionalDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [activeMetric, setActiveMetric] = useState(0);
    
    // Refs for animation targets
    const searchButtonRef = useRef(null);
    const demoButtonRef = useRef(null);
    const startButtonRef = useRef(null);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMetric((prev) => (prev + 1) % 3);
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    
    // Initialize animations when component mounts
    useEffect(() => {
        // Page enter animation
        pageEnterAnimation();
        
        // Sequence of animations
        setTimeout(() => {
            animateHeroText(); // Animate hero text first
            
            setTimeout(() => {
                animateSearchBar(); // Then animate search bar
                
                setTimeout(() => {
                    animateBentoCards(); // Then animate bento grid cards
                    animateCounters(); // And animate counters
                }, 500);
            }, 1000);
        }, 100);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 2000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const marketMetrics = [
        { label: "S&P 500", value: "4,567.89", change: "+12.34", positive: true },
        { label: "NASDAQ", value: "14,234.56", change: "+45.67", positive: true },
        { label: "DOW JONES", value: "34,567.12", change: "-23.45", positive: false },
    ];

    const features = [
        { icon: Brain, title: "AI-POWERED INSIGHTS", desc: "Advanced machine learning algorithms analyze market patterns and provide intelligent recommendations." },
        { icon: TrendingUp, title: "REAL-TIME ANALYTICS", desc: "Live market data processing with millisecond precision for instant decision making." },
        { icon: Shield, title: "ENTERPRISE SECURITY", desc: "Bank-grade encryption and security protocols protecting your sensitive financial data." }
    ];

    const quickStats = [
        { label: "COMPANIES ANALYZED", value: "10,247", icon: Building2 },
        { label: "ACTIVE USERS", value: "2,847", icon: Users },
        { label: "DATA POINTS", value: "847M", icon: Activity },
        { label: "UPTIME", value: "99.9%", icon: Shield }
    ];

    const recentAnalyses = [
        { company: "APPLE INC", ticker: "AAPL", score: "AAA", trend: "up" },
        { company: "MICROSOFT CORP", ticker: "MSFT", score: "AA+", trend: "up" },
        { company: "TESLA INC", ticker: "TSLA", score: "A-", trend: "down" },
        { company: "AMAZON.COM INC", ticker: "AMZN", score: "AA", trend: "up" }
    ];    return (
        <div className="page-content min-h-screen bg-black text-white font-mono overflow-hidden">{/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1 text-xs text-neutral-400 mb-6 hero-heading-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span>NOW LIVE: REAL-TIME MARKET ANALYSIS</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-normal tracking-tight mb-6 leading-none">
                        <span className="hero-heading-2">PROFESSIONAL</span><br />
                        <span className="text-neutral-500 hero-heading-2">FINANCIAL</span><br />
                        <span className="hero-heading-3">ANALYSIS</span>
                    </h1>
                    <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed hero-description">
                        Advanced financial analytics platform powered by artificial intelligence. 
                        Get institutional-grade insights for smarter investment decisions.
                    </p>

                    {/* Search Interface */}
                    <div className="max-w-2xl mx-auto mb-8 search-container">
                        <div className="bg-neutral-900 border border-neutral-800 p-1 flex items-center gap-1">
                            <input
                                type="text"
                                placeholder="ENTER TICKER SYMBOL OR COMPANY NAME..."
                                className="flex-1 bg-transparent text-white placeholder:text-neutral-500 px-4 py-4 text-sm focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />                            <button
                                ref={searchButtonRef}
                                onClick={(e) => {
                                    animateButtonClick(e.currentTarget);
                                    handleSearch();
                                }}
                                onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
                                onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
                                disabled={isLoading || !searchQuery.trim()}
                                className="bg-white text-black px-6 py-4 text-xs font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 search-button"
                            >
                                {isLoading ? (
                                    <div className="w-3 h-3 border border-neutral-400 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Search className="w-3 h-3" />
                                        ANALYZE
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-neutral-500">
                            <span>TRY:</span>
                            {["AAPL", "MSFT", "GOOGL", "TSLA"].map((ticker) => (
                                <button
                                    key={ticker}
                                    onClick={() => setSearchQuery(ticker)}
                                    className="hover:text-white transition-colors border-b border-transparent hover:border-neutral-600"
                                >
                                    {ticker}
                                </button>
                            ))}
                        </div>
                    </div>                    {/* Live Market Metrics */}
                    <div className="flex items-center justify-center gap-8 text-xs">
                        {marketMetrics.map((metric, index) => (
                            <div key={metric.label} className={`flex items-center gap-2 transition-opacity duration-500 counter-container ${activeMetric === index ? 'opacity-100' : 'opacity-40'}`}>
                                <span className="text-neutral-500">{metric.label}</span>
                                <span className="font-medium counter-value" data-target={metric.value.replace(/,/g, '')} data-decimals="2" data-prefix="" data-suffix="">{metric.value}</span>
                                <span className={metric.positive ? 'text-green-400' : 'text-red-400'}>
                                    {metric.change}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">                    {/* Large Feature Card */}
                    <div className="lg:col-span-2 lg:row-span-2 bg-neutral-900 border border-neutral-800 p-8 group hover:border-neutral-700 transition-colors bento-card">
                        <div className="flex items-start justify-between mb-6">
                            <Brain className="w-8 h-8 text-white" />
                            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-medium mb-4">AI-POWERED INSIGHTS</h3>
                        <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                            Our advanced machine learning algorithms analyze thousands of data points 
                            to provide you with actionable investment insights and market predictions.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-500">ACCURACY RATE</span>
                                <span className="text-green-400">94.7%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-500">MODELS TRAINED</span>
                                <span>247</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-500">DATA SOURCES</span>
                                <span>1,247</span>
                            </div>
                        </div>
                    </div>                    {/* Stats Cards */}
                    {quickStats.slice(0, 2).map((stat, index) => (
                        <div key={stat.label} className="bg-neutral-900 border border-neutral-800 p-6 group hover:border-neutral-700 transition-colors bento-card">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className="w-5 h-5 text-neutral-400" />
                                <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                            </div>
                            <div className="text-2xl font-medium mb-1 counter-value" data-target={stat.value.replace(/,/g, '')} data-suffix="">{stat.value}</div>
                            <div className="text-xs text-neutral-500">{stat.label}</div>
                        </div>
                    ))}

                    {/* Recent Analyses */}
                    <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-6 bento-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium">RECENT ANALYSES</h3>
                            <button className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
                                VIEW ALL <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {recentAnalyses.slice(0, 3).map((analysis) => (
                                <div key={analysis.ticker} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-neutral-800 flex items-center justify-center text-xs">
                                            {analysis.ticker.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium">{analysis.company}</div>
                                            <div className="text-xs text-neutral-500">{analysis.ticker}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium">{analysis.score}</span>
                                        <TrendingUp className={`w-3 h-3 ${analysis.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>                    {/* Remaining Stats */}
                    {quickStats.slice(2).map((stat, index) => (
                        <div key={stat.label} className="bg-neutral-900 border border-neutral-800 p-6 group hover:border-neutral-700 transition-colors bento-card">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className="w-5 h-5 text-neutral-400" />
                                <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                            </div>
                            <div className="text-2xl font-medium mb-1 counter-value" data-target={stat.value.replace(/,/g, '')} data-suffix="">{stat.value}</div>
                            <div className="text-xs text-neutral-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>            {/* Action Buttons */}
            <section className="max-w-7xl mx-auto px-4 pb-16">
                <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                    <button 
                        ref={startButtonRef}
                        className="flex-1 bg-white text-black py-4 px-6 text-xs font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 bento-card"
                        onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
                        onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
                        onClick={(e) => animateButtonClick(e.currentTarget)}
                    >
                        <Zap className="w-4 h-4" />
                        START ANALYSIS
                    </button>
                    <button 
                        ref={demoButtonRef}
                        className="flex-1 bg-transparent border border-neutral-800 text-white py-4 px-6 text-xs font-medium hover:border-neutral-700 hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 bento-card"
                        onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
                        onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
                        onClick={(e) => animateButtonClick(e.currentTarget)}
                    >
                        <Play className="w-4 h-4" />
                        VIEW DEMO
                    </button>
                </div>
            </section>
        </div>
    );
}