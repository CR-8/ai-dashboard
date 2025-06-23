"use client"

import React, { useState, useEffect, useRef } from 'react'
import { BarChart3, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { animateNavbarLinks, animateNavbarBrand, animateMobileMenu } from '@/lib/animations'

function Navbar() {
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const mobileMenuRef = useRef(null)
    
    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        }, 60000)
        
        return () => clearInterval(timer)
    }, [])
    
    // Animation effects on load
    useEffect(() => {
        animateNavbarLinks()
        animateNavbarBrand()
    }, [])
      // Mobile menu animation
    useEffect(() => {
        if (mobileMenuRef.current) {
            // Use the animateMobileMenu function from animations.js
            animateMobileMenu(mobileMenuOpen);
        }
    }, [mobileMenuOpen])

    return (        
             <nav className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">                          <div className="flex items-center gap-3 navbar-brand">
                            <Link href="/">
                                <div className="w-6 h-6 bg-white flex items-center justify-center">
                                    <BarChart3 className="w-3 h-3 text-black" />
                                </div>
                            </Link>
                            <Link href="/">
                                <span className="text-sm font-medium tracking-wider">FIN-ANALYTICS</span>
                            </Link>
                        </div><div className="hidden md:flex items-center gap-8 text-xs text-neutral-400">
                            <Link href="/dashboard">
                                <span className={`navbar-link hover:text-white cursor-pointer transition-colors ${pathname === '/dashboard' ? 'text-white' : ''}`}>DASHBOARD</span>
                            </Link>
                            <Link href="/quick-start">
                                <span className={`navbar-link hover:text-white cursor-pointer transition-colors ${pathname === '/quick-start' ? 'text-white' : ''}`}>QUICK START</span>
                            </Link>
                            <Link href="/examples">
                                <span className={`navbar-link hover:text-white cursor-pointer transition-colors ${pathname === '/examples' ? 'text-white' : ''}`}>EXAMPLES</span>
                            </Link>
                            <Link href="/docs">
                                <span className={`navbar-link hover:text-white cursor-pointer transition-colors ${pathname === '/docs' ? 'text-white' : ''}`}>DOCS</span>
                            </Link>
                        </div><div className="flex items-center gap-4 text-xs text-neutral-500">
                            <div className="hidden md:flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                <span>LIVE {time}</span>
                            </div>
                            <Link href="/">
                                <button className="bg-white text-black px-4 py-2 text-xs font-medium hover:bg-neutral-100 transition-colors">
                                    GET STARTED
                                </button>
                            </Link>
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden text-white"
                            >
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>                </div>
                  {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div ref={mobileMenuRef} className="mobile-menu md:hidden py-4 px-4 bg-black border-t border-neutral-800">
                        <div className="flex flex-col space-y-4 text-xs text-neutral-400">
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                <span className={`block py-2 hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-white' : ''}`}>DASHBOARD</span>
                            </Link>
                            <Link href="/analytics" onClick={() => setMobileMenuOpen(false)}>
                                <span className={`block py-2 hover:text-white transition-colors ${pathname === '/quick-start' ? 'text-white' : ''}`}>QUICK START</span>
                            </Link>
                            <Link href="/reports" onClick={() => setMobileMenuOpen(false)}>
                                <span className={`block py-2 hover:text-white transition-colors ${pathname === '/examples' ? 'text-white' : ''}`}>EXAMPLES</span>
                            </Link>
                            <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>
                                <span className={`block py-2 hover:text-white transition-colors ${pathname === '/docs' ? 'text-white' : ''}`}>DOCS</span>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
    )
}

export default Navbar
