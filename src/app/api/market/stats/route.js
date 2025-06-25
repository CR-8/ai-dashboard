import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const marketStats = {
      activelyTrading: (3000 + Math.floor(Math.random() * 500)).toLocaleString(),
      advancers: (1800 + Math.floor(Math.random() * 200)).toLocaleString(),
      decliners: (1300 + Math.floor(Math.random() * 200)).toLocaleString(),
      unchanged: (40 + Math.floor(Math.random() * 20)).toString(),
      totalVolume: '12.8B',
      vix: 18.45 + (Math.random() - 0.5) * 5
    };

    return NextResponse.json({
      success: true,
      data: marketStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market stats' },
      { status: 500 }
    );
  }
}
