import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const sectors = [
      { 
        name: 'Technology', 
        performance: -0.5 + Math.random() * 3, 
        companies: 143,
        volume: '5.2B',
        marketCap: '15.8T'
      },
      { 
        name: 'Healthcare', 
        performance: -0.3 + Math.random() * 2.5, 
        companies: 89,
        volume: '2.1B',
        marketCap: '8.9T'
      },
      { 
        name: 'Financial Services', 
        performance: -0.8 + Math.random() * 2, 
        companies: 156,
        volume: '3.8B',
        marketCap: '12.3T'
      },
      { 
        name: 'Consumer Cyclical', 
        performance: -1 + Math.random() * 2, 
        companies: 98,
        volume: '1.9B',
        marketCap: '6.7T'
      },
      { 
        name: 'Energy', 
        performance: -1.5 + Math.random() * 3, 
        companies: 67,
        volume: '2.3B',
        marketCap: '4.2T'
      },
      { 
        name: 'Utilities', 
        performance: -0.5 + Math.random() * 1.5, 
        companies: 34,
        volume: '890M',
        marketCap: '1.8T'
      }
    ];

    return NextResponse.json({
      success: true,
      data: sectors,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sectors data' },
      { status: 500 }
    );
  }
}
