"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import Silk from "@/components/ui/silk";
import SplashScreen from "@/components/ui/splash-screen2";


export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [activeMetric, setActiveMetric] = useState(0);
    const [showSplash, setShowSplash] = useState(true);
    
    const router = useRouter();
    
    // Refs for animation targets
    const searchButtonRef = useRef(null);
    const demoButtonRef = useRef(null);
    const startButtonRef = useRef(null);

    // All useEffect hooks must be before any conditional returns
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
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMetric((prev) => (prev + 1) % 3);
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    
    // Initialize animations when component mounts (only after splash screen)
    useEffect(() => {
        if (!showSplash) {
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
        }
    }, [showSplash]);

    const handleSplashComplete = () => {
        setShowSplash(false);
    };

    if (showSplash) {
        return <SplashScreen onComplete={handleSplashComplete} duration={5000} />;
    }    const handleSearch = () => {
        if (searchQuery.trim()) {
            setIsLoading(true);
            // Navigate to dashboard with company name as URL parameter
            const companyParam = encodeURIComponent(searchQuery.trim());
            router.push(`/dashboard?company=${companyParam}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleAnalysisClick = (company) => {
        const companyParam = encodeURIComponent(company);
        router.push(`/dashboard?company=${companyParam}`);
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
        { company: "AMAZON.COM INC", ticker: "AMZN", score: "AA", trend: "up" }    ];    return (
        <div className="page-content min-h-screen bg-black text-white font-mono overflow-hidden">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-28">
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-neutral-900 border border-neutral-800 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-xs text-neutral-400 mb-3 sm:mb-4 hero-heading-1">
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-[8px] sm:text-[10px] md:text-xs">NOW LIVE: REAL-TIME ANALYSIS</span>
                        <div className="ml-1 text-[8px] sm:text-[10px] text-green-400 font-mono">{currentTime}</div>
                    </div>
                    
                        <h1 className="text-2xl sm:text-3xl z-10 md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-normal tracking-tight mb-3 sm:mb-4 leading-none">
                            <span className="hero-heading-2 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">PROFESSIONAL</span><br />
                            <span className="text-neutral-500 hero-heading-2">FINANCIAL</span><br />
                            <span className="hero-heading-3 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">ANALYSIS</span>
                        </h1>
                    
                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-neutral-400 max-w-[280px] sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed hero-description px-2 sm:px-4 md:px-0">
                        Advanced financial analytics platform powered by artificial intelligence. 
                        Get institutional-grade insights for smarter investment decisions with real-time market data.
                    </p>

                    {/* Search Interface */}
                    <div className="max-w-[300px] sm:max-w-xs md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto mb-4 sm:mb-6 search-container">
                        <div className="bg-neutral-900 border border-neutral-800 p-0.5 sm:p-1 flex items-center gap-0.5 sm:gap-1">
                            <input
                                type="text"
                                placeholder="ENTER TICKER..."
                                className="flex-1 bg-transparent text-white placeholder:text-neutral-500 px-2 sm:px-3 py-2 sm:py-3 text-[10px] sm:text-xs focus:outline-none"
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
                                className="bg-white text-black px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 search-button"
                            >
                                {isLoading ? (
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 border border-neutral-400 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Search className="w-2 h-2 sm:w-3 sm:h-3" />
                                        <span className="hidden sm:inline">ANALYZE</span>
                                        <span className="sm:hidden">GO</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-xs text-neutral-500 flex-wrap">
                            <span className="text-[8px] sm:text-[10px]">TRY:</span>
                            {["AAPL", "MSFT", "GOOGL", "TSLA"].map((ticker) => (
                                <button
                                    key={ticker}
                                    onClick={() => setSearchQuery(ticker)}
                                    className="hover:text-white transition-colors border-b border-transparent hover:border-neutral-600 text-[8px] sm:text-[10px]"
                                >
                                    {ticker}
                                </button>
                            ))}
                        </div>
                    </div>                    {/* Live Market Metrics */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 lg:gap-6 text-xs">
                        {marketMetrics.map((metric, index) => (
                            <div key={metric.label} className={`flex items-center gap-1 sm:gap-2 transition-opacity duration-500 counter-container ${activeMetric === index ? 'opacity-100' : 'opacity-40'}`}>
                                <span className="text-neutral-500 text-[8px] sm:text-[10px]">{metric.label}</span>
                                <span className="font-medium counter-value text-[8px] sm:text-[10px]" data-target={metric.value.replace(/,/g, '')} data-decimals="2" data-prefix="" data-suffix="">{metric.value}</span>
                                <span className={`text-[8px] sm:text-[10px] ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                                    {metric.change}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            
            {/* Bento Grid Features */}
            <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 pb-8 sm:pb-12 lg:pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">                    {/* Large Feature Card */}
                    <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 bg-neutral-900 border border-neutral-800 p-3 sm:p-6 lg:p-8 group hover:border-neutral-700 transition-colors bento-card">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <Brain className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-neutral-500 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-sm sm:text-lg lg:text-xl font-medium mb-2 sm:mb-3">AI-POWERED INSIGHTS</h3>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-400 mb-4 sm:mb-6 leading-relaxed">
                            Our advanced machine learning algorithms analyze thousands of data points 
                            to provide you with actionable investment insights and market predictions.
                        </p>
                        <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex items-center justify-between text-[9px] sm:text-xs">
                                <span className="text-neutral-500">ACCURACY RATE</span>
                                <span className="text-green-400">94.7%</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] sm:text-xs">
                                <span className="text-neutral-500">MODELS TRAINED</span>
                                <span>247</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] sm:text-xs">
                                <span className="text-neutral-500">DATA SOURCES</span>
                                <span>1,247</span>
                            </div>
                        </div>
                    </div>                    {/* Stats Cards */}
                    {quickStats.slice(0, 2).map((stat, index) => (
                        <div key={stat.label} className="bg-neutral-900 border border-neutral-800 p-3 sm:p-4 lg:p-6 group hover:border-neutral-700 transition-colors bento-card">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-neutral-400" />
                                <ArrowUpRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl font-medium mb-0.5 sm:mb-1 counter-value" data-target={stat.value.replace(/,/g, '')} data-suffix="">{stat.value}</div>
                            <div className="text-[9px] sm:text-xs text-neutral-500">{stat.label}</div>
                        </div>
                    ))}                    {/* Recent Analyses */}
                    <div className="sm:col-span-2 lg:col-span-2 bg-neutral-900 border border-neutral-800 p-3 sm:p-4 lg:p-6 bento-card">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <h3 className="text-[10px] sm:text-xs lg:text-sm font-medium">RECENT ANALYSES</h3>
                            <button className="text-[9px] sm:text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-0.5 sm:gap-1">
                                <span className="hidden sm:inline">VIEW ALL</span>
                                <span className="sm:hidden">ALL</span>
                                <ArrowRight className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                            </button>
                        </div>                        <div className="space-y-1.5 sm:space-y-2">
                            {recentAnalyses.slice(0, 3).map((analysis) => (
                                <div 
                                    key={analysis.ticker} 
                                    className="flex items-center justify-between py-1 sm:py-1.5 border-b border-neutral-800 last:border-b-0 cursor-pointer hover:bg-neutral-800/30 transition-colors px-2 -mx-2 rounded"
                                    onClick={() => handleAnalysisClick(analysis.company)}
                                >
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-neutral-800 flex items-center justify-center text-[9px] sm:text-xs">
                                            {analysis.ticker.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-[9px] sm:text-xs font-medium">{analysis.company}</div>
                                            <div className="text-[8px] sm:text-xs text-neutral-500">{analysis.ticker}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5 sm:gap-1">
                                        <span className="text-[9px] sm:text-xs font-medium">{analysis.score}</span>
                                        <TrendingUp className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${analysis.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                                        <ChevronRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-neutral-500 ml-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>                    {/* Remaining Stats */}
                    {quickStats.slice(2).map((stat, index) => (
                        <div key={stat.label} className="bg-neutral-900 border border-neutral-800 p-3 sm:p-4 lg:p-6 group hover:border-neutral-700 transition-colors bento-card">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-neutral-400" />
                                <ArrowUpRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl font-medium mb-0.5 sm:mb-1 counter-value" data-target={stat.value.replace(/,/g, '')} data-suffix="">{stat.value}</div>
                            <div className="text-[9px] sm:text-xs text-neutral-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>            {/* Action Buttons */}
            <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 pb-8 sm:pb-12 lg:pb-16">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto">
                    <button 
                        ref={startButtonRef}
                        className="flex-1 bg-white text-black py-2.5 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-xs font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1 sm:gap-2 bento-card"
                        onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
                        onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
                        onClick={(e) => animateButtonClick(e.currentTarget)}
                    >
                        <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">START ANALYSIS</span>
                        <span className="sm:hidden">START</span>
                    </button>
                    <button 
                        ref={demoButtonRef}
                        className="flex-1 bg-transparent border border-neutral-800 text-white py-2.5 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-xs font-medium hover:border-neutral-700 hover:bg-neutral-900 transition-colors flex items-center justify-center gap-1 sm:gap-2 bento-card"
                        onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
                        onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
                        onClick={(e) => animateButtonClick(e.currentTarget)}
                    >
                        <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">VIEW DEMO</span>
                        <span className="sm:hidden">DEMO</span>
                    </button>
                </div>
            </section>
        </div>
    );
}