"use client"

import React, { useState, useEffect, useRef } from 'react'
import { BarChart3, Menu, X, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { animateNavbarLinks, animateNavbarBrand, animateMobileMenu } from '@/lib/animations'
import { useAuth } from '@/contexts/AuthContext'

function Navbar() {
    const { user, isAuthenticated, logout, loading } = useAuth();
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const pathname = usePathname()
    const mobileMenuRef = useRef(null)
    const userMenuRef = useRef(null)
    
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
        }    }, [mobileMenuOpen])

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setUserMenuOpen(false);
        await logout();
    };    const getUserDisplayName = () => {
        if (!user) return '';
        
        // Check if this is user metadata from Supabase
        if (user.user_metadata?.first_name || user.user_metadata?.last_name) {
            const firstName = user.user_metadata.first_name || '';
            const lastName = user.user_metadata.last_name || '';
            return `${firstName} ${lastName}`.trim();
        }
        
        // Check if this is user metadata with full_name
        if (user.user_metadata?.full_name) {
            return user.user_metadata.full_name;
        }
        
        // Fallback to email username
        if (user.email) {
            return user.email.split('@')[0];
        }
        
        return 'User';
    };

    const getUserEmail = () => {
        if (!user) return '';
        return user.email || '';
    };    return (
        <nav className="border-b border-zinc-800 bg-black sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-4 navbar-brand">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-white flex items-center justify-center">
                                <BarChart3 className="w-3 h-3 text-black" />
                            </div>
                            <span className="font-mono font-bold text-sm tracking-tight">FIN-ANALYTICS</span>
                        </Link>
                    </div>                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {[
                            { href: '/dashboard', label: 'Dashboard' },
                            { href: '/quick-start', label: 'Quick Start' },
                            { href: '/examples', label: 'Examples' },
                            { href: '/docs', label: 'Docs' }
                        ].map((item) => (
                            <Link key={item.href} href={item.href}>
                                <div className={`px-4 py-2 font-mono text-xs hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800 ${
                                    pathname === item.href ? 'bg-zinc-900 border-zinc-800 text-white' : 'text-zinc-400'
                                }`}>
                                    {item.label.toUpperCase()}
                                </div>
                            </Link>
                        ))}
                    </div>                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Status Indicator */}
                        <div className="hidden md:flex items-center gap-3 px-3 py-2 border border-zinc-800 bg-zinc-950">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="font-mono text-xs text-zinc-400">LIVE</span>
                            <span className="font-mono text-xs text-white">{time}</span>
                        </div>
                        
                        {/* User Section */}
                        {!loading && (
                            <>
                                {isAuthenticated ? (
                                    <div className="relative" ref={userMenuRef}>
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center gap-2 px-3 py-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition-colors font-mono text-xs"
                                        >
                                            <div className="w-4 h-4 bg-white text-black flex items-center justify-center text-xs font-bold">
                                                {getUserDisplayName().charAt(0).toUpperCase()}
                                            </div>
                                            <span className="hidden sm:inline text-white">{getUserDisplayName().toUpperCase()}</span>
                                        </button>
                                        
                                        {userMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-79 bg-black border border-zinc-800 shadow-2xl z-50">
                                                <div className="p-1">
                                                    <div className="px-3 py-3 border-b border-zinc-800">
                                                        <div className="font-mono text-xs text-zinc-500 uppercase">Account</div>
                                                        <div className="font-mono text-xs text-white mt-1">{getUserEmail()}</div>
                                                    </div>
                                                    <div className="py-1">
                                                        <Link href="/profile" onClick={() => setUserMenuOpen(false)}>
                                                            <div className="px-3 py-2 font-mono text-xs hover:bg-zinc-900 cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                                                                <User size={12} />
                                                                PROFILE
                                                            </div>
                                                        </Link>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full text-left px-3 py-2 font-mono text-xs hover:bg-zinc-900 cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors"
                                                        >
                                                            <LogOut size={12} />
                                                            LOGOUT
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link href="/auth">
                                        <button className="bg-white text-black px-4 py-2 font-mono text-xs font-bold hover:bg-zinc-200 transition-colors">
                                            GET STARTED
                                        </button>
                                    </Link>
                                )}
                            </>
                        )}
                        
                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition-colors"
                        >
                            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>
                    </div>
                </div>                </div>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div ref={mobileMenuRef} className="mobile-menu md:hidden border-t border-zinc-800 bg-black">
                    <div className="max-w-7xl mx-auto px-8 py-6">
                        {/* Navigation Links */}
                        <div className="space-y-1 mb-6">
                            {[
                                { href: '/dashboard', label: 'Dashboard' },
                                { href: '/quick-start', label: 'Quick Start' },
                                { href: '/examples', label: 'Examples' },
                                { href: '/docs', label: 'Docs' }
                            ].map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                                    <div className={`px-4 py-3 font-mono text-xs border border-zinc-800 hover:bg-zinc-900 transition-colors ${
                                        pathname === item.href ? 'bg-zinc-900 text-white' : 'text-zinc-400'
                                    }`}>
                                        {item.label.toUpperCase()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center gap-3 px-4 py-3 border border-zinc-800 bg-zinc-950 mb-6">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span className="font-mono text-xs text-zinc-400">LIVE</span>
                            <span className="font-mono text-xs text-white">{time}</span>
                        </div>
                        
                        {/* User Section */}
                        {!loading && (
                            <>
                                {isAuthenticated ? (
                                    <div className="border border-zinc-800 bg-zinc-950">
                                        <div className="px-4 py-3 border-b border-zinc-800">
                                            <div className="font-mono text-xs text-zinc-500 uppercase">Account</div>
                                            <div className="font-mono text-xs text-white mt-1">{getUserDisplayName()}</div>
                                            <div className="font-mono text-xs text-zinc-400 mt-1">{getUserEmail()}</div>
                                        </div>
                                        <div className="p-1">
                                            <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                                                <div className="px-3 py-2 font-mono text-xs hover:bg-zinc-900 cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                                                    <User size={12} />
                                                    PROFILE
                                                </div>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setMobileMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full text-left px-3 py-2 font-mono text-xs hover:bg-zinc-900 cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                                            >
                                                <LogOut size={12} />
                                                LOGOUT
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                                        <button className="w-full bg-white text-black px-4 py-3 font-mono text-xs font-bold hover:bg-zinc-200 transition-colors">
                                            GET STARTED
                                        </button>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
