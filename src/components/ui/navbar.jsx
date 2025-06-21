"use client"

import React, { useState, useEffect } from 'react'

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 ${
            isScrolled 
                ? 'bg-black/20 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
                : 'bg-transparent backdrop-blur-sm'
        }`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center group">
                        <div className="relative">
                            <h1 className="relative text-2xl font-bold bg-white bg-clip-text text-transparent tracking-tight">
                                AI Dashboard
                            </h1>
                        </div>
                    </div>                    <div className="hidden lg:flex items-center space-x-1">
                        {[
                            { name: 'Home', href: '/' },
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Examples', href: '/examples' },
                            { name: 'Quick Start', href: '/quick-start' }
                        ].map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="relative px-6 py-3 text-gray-300 hover:text-white group"
                            >
                                <span className="relative z-10 font-medium">{item.name}</span>
                                <div className="absolute inset-0 bg-white/5 rounded-lg scale-0"></div>
                                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></div>
                            </a>
                        ))}
                        
                        <div className="ml-8">
                            <button className="relative px-8 py-3 border border-gray-800 text-white hover:bg-gray-100 hover:text-black hover:ease-in rounded-full hover:cursor-pointer font-medium group overflow-hidden">
                                <span className="relative z-10">Get Started</span>
                            </button>
                        </div>
                    </div>

                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative p-3 text-gray-300 hover:text-white group"
                        >
                            <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100"></div>
                            <svg className="relative z-10 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={`lg:hidden ${
                    isMenuOpen 
                        ? 'max-h-96 opacity-100 pb-6' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                }`}>                    <div className="pt-4 space-y-2 border-t border-white/10">
                        {[
                            { name: 'Home', href: '/' },
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Examples', href: '/examples' },
                            { name: 'Quick Start', href: '/quick-start' }
                        ].map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="block px-4 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
                            >
                                {item.name}
                            </a>
                        ))}
                        <div className="pt-4">
                            <button className="w-full px-4 py-3 text-cyan-300 rounded-lg font-medium hover:text-white">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
