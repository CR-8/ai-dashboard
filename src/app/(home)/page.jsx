"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Navigate to dashboard with search query as URL parameter
            router.push(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-24">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard AI</h1>
            <p className="text-gray-400">Create stunning dashboards with the power of AI</p>
        </div>
        
        <div className="h-16 w-[48rem] bg-white/10 border border-white/20 rounded-full flex items-center backdrop-blur-md shadow-2xl hover:bg-white/15 transition-all duration-300">
            <div className="flex-grow px-6">
                <input
                    type="text"
                    placeholder="Enter a keyword to analyze market trends (e.g., 'AI chatbots', 'electric vehicles')..."
                    className="h-full w-full bg-transparent outline-none placeholder:text-gray-400 text-white text-lg"
                    onKeyDown={handleKeyPress}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center justify-center mr-4 p-2 rounded-full hover:bg-white/10 cursor-pointer transition-colors" onClick={handleSearch}>
                <Search className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
            </div>
        </div>
        
        <div className="mt-8 flex gap-4">
            <div 
                className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm hover:bg-blue-600/30 cursor-pointer transition-all"
                onClick={() => window.location.href = "/quick-start"}
            >
                Quick Start
            </div>
            <div 
                className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm hover:bg-purple-600/30 cursor-pointer transition-all"
                onClick={() => window.location.href = "/examples"}
            >
                Examples
            </div>
        </div>
    </div>
);
}
