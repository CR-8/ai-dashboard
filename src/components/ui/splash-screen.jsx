"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
    BarChart3, 
    TrendingUp, 
    Signal, 
    Database,
    Activity,
    Globe,
    Zap,
    Target,
    CheckCircle2
} from "lucide-react";

export default function SplashScreen({ onComplete, duration = 3000 }) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const loadingSteps = [
        { icon: Database, text: "Initializing Core Systems", duration: 800 },
        { icon: Globe, text: "Establishing Connections", duration: 700 },
        { icon: BarChart3, text: "Loading Analytics", duration: 600 },
        { icon: Activity, text: "Calibrating Models", duration: 500 },
        { icon: Signal, text: "Final Preparations", duration: 400 }
    ];

    const features = [
        { title: "Market Data", subtitle: "Real-time feeds" },
        { title: "AI Analysis", subtitle: "Advanced models" },
        { title: "Risk Metrics", subtitle: "Comprehensive" },
        { title: "Performance", subtitle: "Portfolio tracking" }
    ];

    const stats = [
        { value: "99.9%", label: "Uptime" },
        { value: "< 10ms", label: "Latency" },
        { value: "24/7", label: "Monitoring" },
        { value: "256-bit", label: "Encryption" }
    ];

    useEffect(() => {
        let totalTime = 0;

        const interval = setInterval(() => {
            totalTime += 50;
            const newProgress = Math.min((totalTime / duration) * 100, 100);
            setProgress(newProgress);

            const stepIndex = Math.min(
                Math.floor((totalTime / duration) * loadingSteps.length),
                loadingSteps.length - 1
            );
            setCurrentStep(stepIndex);

            if (totalTime >= duration) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(() => onComplete?.(), 300);
                }, 200);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onComplete]);

    if (!isVisible) return null;

    const CurrentIcon = loadingSteps[currentStep]?.icon || Signal;

    return (
        <div className="fixed inset-0 z-50 bg-black text-white overflow-hidden">
            {/* Grid Pattern Background */}
            <div 
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '32px 32px'
                }}
            />

            <div className="relative h-full flex flex-col">                
                {/* Header */}
                <div className="flex-none border-b border-zinc-800 p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white text-black rounded flex items-center justify-center">
                                <BarChart3 className="w-3 h-3 sm:w-5 sm:h-5" />
                            </div>
                            <div className="font-mono">
                                <div className="text-xs sm:text-sm font-medium">FINANCIAL INTELLIGENCE</div>
                                <div className="text-xs text-zinc-500 hidden sm:block">Enterprise Platform</div>
                            </div>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs border-zinc-700">
                            v2.1.0
                        </Badge>
                    </div>
                </div>                {/* Main Content */}
                <div className="flex-1 p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto h-full">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-full">
                            
                            {/* Left Column - Loading Status */}
                            <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                                
                                {/* Current Status */}
                                <div className="border border-zinc-800 rounded-lg p-4 sm:p-6">
                                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 border border-zinc-700 rounded-lg flex items-center justify-center">
                                            <CurrentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono text-xs sm:text-sm font-medium">System Status</div>
                                            <div className="text-xs text-zinc-500">Initializing Platform</div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="font-mono text-xs text-zinc-400">
                                            {loadingSteps[currentStep]?.text || "Loading..."}
                                        </div>
                                        <Progress value={progress} className="h-1" />
                                        <div className="flex justify-between text-xs font-mono text-zinc-500">
                                            <span>0%</span>
                                            <span>{Math.round(progress)}%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Loading Steps */}
                                <div className="border border-zinc-800 rounded-lg p-4 sm:p-6">
                                    <div className="font-mono text-xs sm:text-sm font-medium mb-3 sm:mb-4">Initialization Steps</div>
                                    <div className="space-y-2 sm:space-y-3">
                                        {loadingSteps.map((step, index) => {
                                            const StepIcon = step.icon;
                                            const isActive = index === currentStep;
                                            const isCompleted = index < currentStep;
                                            
                                            return (
                                                <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border flex items-center justify-center transition-all ${
                                                        isCompleted 
                                                            ? 'bg-white text-black border-white' 
                                                            : isActive 
                                                                ? 'border-white text-white' 
                                                                : 'border-zinc-700 text-zinc-600'
                                                    }`}>
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        ) : (
                                                            <StepIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        )}
                                                    </div>
                                                    <span className={`font-mono text-xs transition-colors ${
                                                        isCompleted || isActive ? 'text-white' : 'text-zinc-600'
                                                    }`}>
                                                        {step.text}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>                            {/* Center Column - Features Grid */}
                            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                                
                                {/* Platform Features */}
                                <div className="border border-zinc-800 rounded-lg p-4 sm:p-6">
                                    <div className="font-mono text-xs sm:text-sm font-medium mb-3 sm:mb-4">Platform Capabilities</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {features.map((feature, index) => (
                                            <div 
                                                key={index}
                                                className={`border border-zinc-800 rounded p-3 sm:p-4 transition-all duration-500 ${
                                                    index <= currentStep ? 'border-zinc-700 bg-zinc-900/20' : ''
                                                }`}
                                                style={{ 
                                                    transitionDelay: `${index * 100}ms`
                                                }}
                                            >
                                                <div className="font-mono text-xs font-medium">{feature.title}</div>
                                                <div className="text-xs text-zinc-500 mt-1">{feature.subtitle}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* System Metrics */}
                                <div className="border border-zinc-800 rounded-lg p-4 sm:p-6">
                                    <div className="font-mono text-xs sm:text-sm font-medium mb-3 sm:mb-4">System Metrics</div>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        {stats.map((stat, index) => (
                                            <div key={index} className="text-center">
                                                <div className="font-mono text-base sm:text-lg font-bold">{stat.value}</div>
                                                <div className="text-xs text-zinc-500">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>                            {/* Right Column - System Info */}
                            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                                
                                {/* System Health */}
                                <div className="border border-zinc-800 rounded-lg p-4 sm:p-6">
                                    <div className="font-mono text-xs sm:text-sm font-medium mb-3 sm:mb-4">System Health</div>
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-500 font-mono">CPU</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs font-mono">12%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-500 font-mono">Memory</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs font-mono">34%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-500 font-mono">Network</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs font-mono">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Status */}
                                <div className="border border-zinc-800 rounded-lg p-4 sm:p-6">
                                    <div className="font-mono text-xs sm:text-sm font-medium mb-3 sm:mb-4">Security</div>
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Zap className="w-3 h-3" />
                                            <span className="text-xs font-mono">Encrypted Connection</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Target className="w-3 h-3" />
                                            <span className="text-xs font-mono">Secure Authentication</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Signal className="w-3 h-3" />
                                            <span className="text-xs font-mono">Real-time Monitoring</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                {/* Footer */}
                <div className="flex-none border-t border-zinc-800 p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <div className="text-xs text-zinc-500 font-mono">
                            © 2025 Financial Intelligence Platform
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-zinc-500 font-mono">
                            <span>Secure</span>
                            <span>•</span>
                            <span>Reliable</span>
                            <span>•</span>
                            <span>Professional</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
