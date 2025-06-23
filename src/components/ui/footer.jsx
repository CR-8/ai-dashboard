import React from 'react';
import { Github, Twitter, Linkedin, Mail, ArrowRight, ExternalLink } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    const footerSections = {
        platform: [
            { name: 'DASHBOARD', href: '/' },
            { name: 'ANALYTICS', href: '/examples' },
            { name: 'QUICK START', href: '/quick-start' },
            { name: 'API ACCESS', href: '#' }
        ],
        resources: [
            { name: 'DOCUMENTATION', href: '#' },
            { name: 'TUTORIALS', href: '#' },
            { name: 'CASE STUDIES', href: '#' },
            { name: 'COMMUNITY', href: '#' }
        ],
        company: [
            { name: 'ABOUT US', href: '#' },
            { name: 'CAREERS', href: '#' },
            { name: 'CONTACT', href: '#' },
            { name: 'SUPPORT', href: '#' }
        ]
    };

    const socialLinks = [
        { name: 'Github', href: '#', icon: Github },
        { name: 'Twitter', href: '#', icon: Twitter },
        { name: 'LinkedIn', href: '#', icon: Linkedin }
    ];

    const legalLinks = [
        { name: 'PRIVACY POLICY', href: '#' },
        { name: 'TERMS OF SERVICE', href: '#' },
        { name: 'COOKIE POLICY', href: '#' },
        { name: 'SECURITY', href: '#' }
    ];

    return (
        <footer className="bg-black border-t border-neutral-800 font-mono">
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-6 h-6 bg-white flex items-center justify-center">
                                    <div className="w-2 h-2 bg-black"></div>
                                </div>
                                <span className="text-white text-sm font-medium tracking-wider">FINANALYTICS</span>
                            </div>
                            <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                                PROFESSIONAL FINANCIAL ANALYSIS PLATFORM DELIVERING 
                                INSTITUTIONAL-GRADE INSIGHTS FOR MODERN INVESTORS
                            </p>
                        </div>
                        
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-neutral-700 hover:bg-neutral-800 transition-colors group"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    {Object.entries(footerSections).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-white text-xs font-medium tracking-wider mb-6 uppercase">
                                {category}
                            </h3>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-neutral-400 hover:text-white transition-colors text-xs font-mono tracking-wide flex items-center gap-2 group"
                                        >
                                            <span>{link.name}</span>
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-neutral-800 pt-12 mb-12">
                    <div className="max-w-md">
                        <h3 className="text-white text-sm font-medium mb-3 tracking-wide">STAY INFORMED</h3>
                        <p className="text-neutral-400 text-xs mb-6 leading-relaxed">
                            RECEIVE MARKET INSIGHTS, PLATFORM UPDATES, AND EXCLUSIVE ANALYSIS 
                            DIRECTLY TO YOUR INBOX
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="ENTER EMAIL ADDRESS"
                                className="flex-1 bg-neutral-900 border border-neutral-800 px-4 py-3 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors font-mono"
                            />
                            <button className="bg-white text-black px-6 py-3 text-xs font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 font-mono tracking-wide">
                                SUBSCRIBE
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-neutral-600 text-xs mt-3">
                            NO SPAM. UNSUBSCRIBE ANYTIME.
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-neutral-800 pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        {/* Copyright */}
                        <div className="text-neutral-500 text-xs font-mono">
                            © {currentYear} FINANALYTICS. ALL RIGHTS RESERVED. LICENSED UNDER MIT.
                        </div>
                        
                        {/* Legal Links */}
                        <div className="flex flex-wrap gap-6 text-xs">
                            {legalLinks.map((link, index) => (
                                <React.Fragment key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-neutral-500 hover:text-white transition-colors font-mono tracking-wide"
                                    >
                                        {link.name}
                                    </a>
                                    {index < legalLinks.length - 1 && (
                                        <span className="text-neutral-700">·</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center justify-center lg:justify-end gap-2 mt-6 lg:mt-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-neutral-500 text-xs font-mono">
                            SYSTEM STATUS: OPERATIONAL
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;