import { NextResponse } from 'next/server';

// Mock API for market indices - replace with real API calls
export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, replace this with real API calls to financial data providers
    // Example: Alpha Vantage, Yahoo Finance, or IEX Cloud
    const indices = [
      { 
        symbol: 'S&P 500', 
        ticker: 'SPX', 
        price: 4735.32 + (Math.random() - 0.5) * 100, 
        change: (Math.random() - 0.5) * 50, 
        changePercent: (Math.random() - 0.5) * 3, 
        high: 4741.83, 
        low: 4698.12,
        volume: '2.1B'
      },
      { 
        symbol: 'Dow Jones', 
        ticker: 'DJI', 
        price: 37845.45 + (Math.random() - 0.5) * 200, 
        change: (Math.random() - 0.5) * 100, 
        changePercent: (Math.random() - 0.5) * 2, 
        high: 37892.34, 
        low: 37756.89,
        volume: '350M'
      },
      { 
        symbol: 'Nasdaq', 
        ticker: 'IXIC', 
        price: 14756.78 + (Math.random() - 0.5) * 300, 
        change: (Math.random() - 0.5) * 150, 
        changePercent: (Math.random() - 0.5) * 4, 
        high: 14789.45, 
        low: 14623.12,
        volume: '4.2B'
      },
      { 
        symbol: 'Russell 2000', 
        ticker: 'RUT', 
        price: 2045.56 + (Math.random() - 0.5) * 50, 
        change: (Math.random() - 0.5) * 30, 
        changePercent: (Math.random() - 0.5) * 2, 
        high: 2067.89, 
        low: 2032.45,
        volume: '1.8B'
      }
    ];

    return NextResponse.json({
      success: true,
      data: indices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market indices' },
      { status: 500 }
    );
  }
}
