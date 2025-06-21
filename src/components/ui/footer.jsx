"use client";

import React from 'react';

const Footer = () => {
    return (
        <footer className="backdrop-blur-md border-t border-white/10 text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">AI Dashboard</h3>
                        <p className="text-gray-400">
                            Empowering businesses with intelligent data insights and AI-powered analytics.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-md font-semibold mb-4">Navigation</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                            <li><a href="/examples" className="text-gray-400 hover:text-white transition-colors">Examples</a></li>
                            <li><a href="/quick-start" className="text-gray-400 hover:text-white transition-colors">Quick Start</a></li>
                        </ul>
                    </div>
                      <div>
                        <h4 className="text-md font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                        </ul>
                    </div>
                </div>
                
                <hr className="border-white/10 my-6" />
                
                <div className="text-center text-gray-400">
                    <p>&copy; 2025 Dashboard AI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;