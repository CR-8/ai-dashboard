import { NextResponse } from 'next/server';

// Generate realistic stock data with proper fluctuations
function generateStockData(baseStock, type) {
  let multiplier = 1;
  
  // Adjust change based on type
  if (type === 'gainers') {
    multiplier = Math.random() * 3 + 2; // 2-5x positive
  } else if (type === 'losers') {
    multiplier = -(Math.random() * 3 + 2); // 2-5x negative
  } else {
    multiplier = (Math.random() - 0.5) * 4; // -2 to +2
  }
  
  const change = baseStock.baseChange * multiplier;
  const changePercent = (change / baseStock.basePrice) * 100;
  const price = baseStock.basePrice + change;
  
  return {
    ...baseStock,
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2))
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'trending';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Base stock data
    const baseStocks = [
      { symbol: 'TSLA', name: 'Tesla Inc', basePrice: 248.87, baseChange: 5.2, marketCap: '791.2B', volume: '45.2M' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 521.13, baseChange: 8.5, marketCap: '1.28T', volume: '52.8M' },
      { symbol: 'AAPL', name: 'Apple Inc', basePrice: 189.79, baseChange: 3.2, marketCap: '2.95T', volume: '38.9M' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', basePrice: 134.78, baseChange: 2.8, marketCap: '1.68T', volume: '25.6M' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', basePrice: 378.92, baseChange: 4.1, marketCap: '2.81T', volume: '28.4M' },
      { symbol: 'META', name: 'Meta Platforms Inc', basePrice: 325.45, baseChange: 6.7, marketCap: '826.5B', volume: '18.7M' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', basePrice: 142.31, baseChange: 3.9, marketCap: '1.48T', volume: '33.2M' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', basePrice: 142.56, baseChange: 4.8, marketCap: '230.1B', volume: '62.1M' },
      { symbol: 'NFLX', name: 'Netflix Inc', basePrice: 445.23, baseChange: 7.2, marketCap: '197.8B', volume: '12.4M' },
      { symbol: 'CRM', name: 'Salesforce Inc', basePrice: 234.67, baseChange: 3.5, marketCap: '224.1B', volume: '8.9M' },
      { symbol: 'INTC', name: 'Intel Corporation', basePrice: 43.21, baseChange: 1.8, marketCap: '181.5B', volume: '28.7M' },
      { symbol: 'PYPL', name: 'PayPal Holdings Inc', basePrice: 61.89, baseChange: 2.1, marketCap: '72.4B', volume: '14.2M' }
    ];
    
    // Generate stocks based on type
    let stocks = baseStocks.map(stock => generateStockData(stock, type));
    
    // Sort based on type
    if (type === 'gainers') {
      stocks = stocks
        .filter(stock => stock.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 8);
    } else if (type === 'losers') {
      stocks = stocks
        .filter(stock => stock.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 8);
    } else {
      // Trending - mix of high volume and significant moves
      stocks = stocks
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 8);
    }

    return NextResponse.json({
      success: true,
      data: stocks,
      type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stocks data' },
      { status: 500 }
    );
  }
}
