import React, { useState, useEffect } from 'react';

const SplashScreen2 = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [currentTask, setCurrentTask] = useState(0);
    const [isReady, setIsReady] = useState(false);

    const tasks = [
        { label: 'Initializing core systems    ', duration: 25 },
        { label: 'Loading AI models            ', duration: 40 },
        { label: 'Connecting to dashboard      ', duration: 20 },
        { label: 'Finalizing setup             ', duration: 15 }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 0.8;
                
                // Update current task based on progress
                let cumulativeDuration = 0;
                for (let i = 0; i < tasks.length; i++) {
                    cumulativeDuration += tasks[i].duration;
                    if (newProgress <= cumulativeDuration) {
                        setCurrentTask(i);
                        break;
                    }
                }

                if (newProgress >= 100) {
                    clearInterval(timer);
                    setIsReady(true);
                    setTimeout(() => {
                        setFadeOut(true);
                        setTimeout(() => onComplete?.(), 400);
                    }, 600);
                    return 100;
                }
                return newProgress;
            });
        }, 50);

        return () => clearInterval(timer);
    }, [onComplete]);    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-500 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
        }`}>
            {/* Grid Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Main Container */}
            <div className="relative max-w-4xl mx-auto px-8">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-12 gap-4 max-w-3xl mx-auto">
                    
                    {/* Logo Section - Spans 4 columns */}
                    <div className="col-span-4 h-32 bg-white border border-gray-800 rounded-xl flex items-center justify-center group transition-all duration-300">
                        <div className="text-center">
                            <div className="font-mono text-2xl font-bold text-black mb-1">AI</div>
                            <div className="w-8 h-px bg-black/60 mx-auto"></div>
                        </div>
                    </div>

                    {/* Brand Section - Spans 8 columns */}
                    <div className="col-span-8 h-32 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="font-mono text-3xl font-bold text-white tracking-tight mb-2">
                                ANALYTICS
                            </h1>
                            <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                                Intelligence Platform
                            </p>
                        </div>
                    </div>

                    {/* Progress Section - Spans 8 columns */}
                    <div className="col-span-8 h-24 bg-gray-900 border border-gray-800 rounded-xl flex items-center px-6">
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-mono text-xs text-gray-400 uppercase tracking-wide">
                                    {isReady ? 'Ready' : tasks[currentTask]?.label}
                                </span>
                                <span className="font-mono ml-4 text-xs font-bold text-white">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Status Section - Spans 4 columns */}
                    <div className="col-span-4 h-24 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="font-mono text-xs text-gray-500 mb-1">Status</div>
                            <div className={`inline-flex items-center space-x-1 ${isReady ? 'text-white' : 'text-gray-400'}`}>
                                <div className={`w-2 h-2 bg-green-400 rounded-full ${isReady ? 'bg-white' : 'bg-gray-400'} ${!isReady ? 'animate-pulse' : ''}`}></div>
                                <span className="font-mono text-xs text-green-400 font-medium">
                                    {isReady ? 'READY' : 'LOADING'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* System Info - Spans 6 columns */}
                    <div className="col-span-6 h-20 bg-gray-900 border border-gray-800 rounded-xl flex items-center px-4">
                        <div className="w-full">
                            <div className="font-mono text-xs text-gray-600 uppercase tracking-wide mb-2">System</div>
                            <div className="flex justify-between">
                                <span className="font-mono text-xs text-gray-400">v2.1.0</span>
                                <span className="font-mono text-xs text-gray-400">Build #{String(Date.now()).slice(-4)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Process Indicator - Spans 6 columns */}
                    <div className="col-span-6 h-20 bg-white border border-gray-800 rounded-xl flex items-center justify-center">
                        <div className="flex space-x-1">
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-8 bg-black rounded-full transition-all duration-300 ${
                                        i <= currentTask ? 'opacity-100' : 'opacity-30'
                                    }`}
                                    style={{ 
                                        animationDelay: `${i * 150}ms`,
                                        transform: i === currentTask && !isReady ? 'scaleY(1.2)' : 'scaleY(1)'
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Minimal footer */}
                <div className="text-center mt-8">
                    <p className="font-mono text-xs text-gray-600 tracking-widest">
                        © 2025 AI ANALYTICS
                    </p>
                </div>
            </div>

            {/* Corner indicators */}
            <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-white/20"></div>
            <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-white/20"></div>
            <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-white/20"></div>
            <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-white/20"></div>
        </div>
    );
};

export default SplashScreen2;