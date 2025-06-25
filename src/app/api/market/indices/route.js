import { NextResponse } from 'next/server';

// Function to generate realistic market data
function generateMarketData() {
  const now = new Date();
  const marketHours = now.getHours() >= 9 && now.getHours() < 16; // 9 AM to 4 PM
  const volatilityMultiplier = marketHours ? 1 : 0.3; // Lower volatility after hours
  
  return [
    { 
      symbol: 'S&P 500', 
      ticker: 'SPX', 
      price: 4735.32 + (Math.random() - 0.5) * 50 * volatilityMultiplier, 
      change: (Math.random() - 0.5) * 25 * volatilityMultiplier, 
      changePercent: (Math.random() - 0.5) * 1.5 * volatilityMultiplier, 
      high: 4741.83, 
      low: 4698.12,
      volume: '2.1B'
    },
    { 
      symbol: 'Dow Jones', 
      ticker: 'DJI', 
      price: 37845.45 + (Math.random() - 0.5) * 100 * volatilityMultiplier, 
      change: (Math.random() - 0.5) * 50 * volatilityMultiplier, 
      changePercent: (Math.random() - 0.5) * 1.2 * volatilityMultiplier, 
      high: 37892.34, 
      low: 37756.89,
      volume: '350M'
    },
    { 
      symbol: 'Nasdaq', 
      ticker: 'IXIC', 
      price: 14756.78 + (Math.random() - 0.5) * 150 * volatilityMultiplier, 
      change: (Math.random() - 0.5) * 75 * volatilityMultiplier, 
      changePercent: (Math.random() - 0.5) * 2 * volatilityMultiplier, 
      high: 14789.45, 
      low: 14623.12,
      volume: '4.2B'
    },
    { 
      symbol: 'Russell 2000', 
      ticker: 'RUT', 
      price: 2045.56 + (Math.random() - 0.5) * 25 * volatilityMultiplier, 
      change: (Math.random() - 0.5) * 15 * volatilityMultiplier, 
      changePercent: (Math.random() - 0.5) * 1.5 * volatilityMultiplier, 
      high: 2067.89, 
      low: 2032.45,
      volume: '1.8B'
    }
  ].map(index => ({
    ...index,
    price: parseFloat(index.price.toFixed(2)),
    change: parseFloat(index.change.toFixed(2)),
    changePercent: parseFloat(index.changePercent.toFixed(2))
  }));
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const indices = generateMarketData();

    return NextResponse.json({
      success: true,
      data: indices,
      timestamp: new Date().toISOString(),
      marketHours: new Date().getHours() >= 9 && new Date().getHours() < 16
    });
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market indices' },
      { status: 500 }
    );
  }
}
