"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, Zap, Brain, BarChart3 } from 'lucide-react';

const suggestions = [
  { text: "AI Startups", icon: Brain, category: "Technology" },
  { text: "Crypto Trends", icon: TrendingUp, category: "Finance" },
  { text: "SaaS Growth", icon: BarChart3, category: "Business" },
  { text: "Climate Tech", icon: Zap, category: "Environment" },
  { text: "E-commerce", icon: TrendingUp, category: "Retail" },
  { text: "Healthcare AI", icon: Brain, category: "Health" }
];

export default function SearchSuggestions({ onSelect, isVisible }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || !isVisible) return null;  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-[60] animate-in fade-in-0 slide-in-from-top-2 duration-200">
      <div className="bg-[#111] border border-[#333] rounded-lg p-4 shadow-none transform scale-100 transition-all duration-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-3 h-3 text-white" />
          <p className="text-xs text-[#a0a0a0] uppercase tracking-wider">Trending companies</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelect(suggestion.text)}
              className="group flex items-center gap-3 p-2.5 bg-transparent border border-[#222] rounded-md hover:bg-[#222] hover:border-[#333] transition-all duration-300"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-[#222] rounded-md flex items-center justify-center group-hover:bg-[#333] transition-colors">
                <suggestion.icon className="w-3 h-3 text-white" />
              </div>
              <div className="flex-grow text-left">
                <div className="text-xs font-normal text-white group-hover:text-white transition-colors font-mono">
                  {suggestion.text}
                </div>
                <div className="text-[10px] text-[#666] uppercase tracking-wider">
                  {suggestion.category}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            Or type any keyword to get AI-powered market insights
          </p>
        </div>
      </div>
    </div>
  );
}
