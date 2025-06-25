import { NextResponse } from 'next/server';

// Mock stock database with detailed information
const stockDatabase = {
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc',
    exchange: 'NASDAQ',
    sector: 'Technology',
    basePrice: 189.79,
    marketCap: '2.95T',
    volume: '38.9M',
    avgVolume: '52.8M',
    peRatio: 28.45,
    eps: 6.67,
    beta: 1.24,
    weekHigh52: 199.62,
    weekLow52: 164.08,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'
  },
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    basePrice: 378.92,
    marketCap: '2.81T',
    volume: '28.4M',
    avgVolume: '35.2M',
    peRatio: 32.15,
    eps: 11.78,
    beta: 0.89,
    weekHigh52: 384.30,
    weekLow52: 309.45,
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.'
  },
  'GOOGL': {
    symbol: 'GOOGL',
    name: 'Alphabet Inc',
    exchange: 'NASDAQ',
    sector: 'Technology',
    basePrice: 134.78,
    marketCap: '1.68T',
    volume: '25.6M',
    avgVolume: '31.4M',
    peRatio: 25.67,
    eps: 5.25,
    beta: 1.12,
    weekHigh52: 151.55,
    weekLow52: 121.46,
    description: 'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.'
  },
  'TSLA': {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    basePrice: 248.87,
    marketCap: '791.2B',
    volume: '45.2M',
    avgVolume: '78.9M',
    peRatio: 65.34,
    eps: 3.81,
    beta: 2.34,
    weekHigh52: 299.29,
    weekLow52: 152.37,
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.'
  },
  'NVDA': {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    basePrice: 521.13,
    marketCap: '1.28T',
    volume: '52.8M',
    avgVolume: '89.5M',
    peRatio: 74.23,
    eps: 7.02,
    beta: 1.67,
    weekHigh52: 589.07,
    weekLow52: 365.23,
    description: 'NVIDIA Corporation operates as a computing company in the United States, Taiwan, China, Hong Kong, and other international markets.'
  },
  'META': {
    symbol: 'META',
    name: 'Meta Platforms Inc',
    exchange: 'NASDAQ',
    sector: 'Technology',
    basePrice: 325.45,
    marketCap: '826.5B',
    volume: '18.7M',
    avgVolume: '24.1M',
    peRatio: 22.89,
    eps: 14.21,
    beta: 1.18,
    weekHigh52: 353.83,
    weekLow52: 274.38,
    description: 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family.'
  },
  'AMZN': {
    symbol: 'AMZN',
    name: 'Amazon.com Inc',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    basePrice: 142.31,
    marketCap: '1.48T',
    volume: '33.2M',
    avgVolume: '41.7M',
    peRatio: 45.67,
    eps: 3.12,
    beta: 1.15,
    weekHigh52: 155.63,
    weekLow52: 118.35,
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.'
  },
  'AMD': {
    symbol: 'AMD',
    name: 'Advanced Micro Devices Inc',
    exchange: 'NASDAQ',
    sector: 'Technology',
    basePrice: 142.56,
    marketCap: '230.1B',
    volume: '62.1M',
    avgVolume: '85.3M',
    peRatio: 156.78,
    eps: 0.91,
    beta: 1.89,
    weekHigh52: 164.46,
    weekLow52: 93.12,
    description: 'Advanced Micro Devices, Inc. operates as a semiconductor company worldwide.'
  }
};

function generateRealtimeStockData(baseStock) {
  const now = new Date();
  const marketHours = now.getHours() >= 9 && now.getHours() < 16;
  const volatility = marketHours ? 1 : 0.3;
  
  // Generate realistic price movement
  const changePercent = (Math.random() - 0.5) * 6 * volatility; // -3% to +3%
  const change = (baseStock.basePrice * changePercent) / 100;
  const price = baseStock.basePrice + change;
  
  // Generate day high/low based on current price
  const dayRange = baseStock.basePrice * 0.03; // 3% range
  const dayHigh = price + Math.random() * (dayRange / 2);
  const dayLow = price - Math.random() * (dayRange / 2);
  
  return {
    ...baseStock,
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    dayHigh: parseFloat(dayHigh.toFixed(2)),
    dayLow: parseFloat(dayLow.toFixed(2)),
    timestamp: new Date().toISOString(),
    marketHours
  };
}

export async function GET(request, context) {
  try {
    const { params } = await context;
    const symbol = params.symbol?.toUpperCase();
    
    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Stock symbol is required' },
        { status: 400 }
      );
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const baseStock = stockDatabase[symbol];
    
    if (!baseStock) {
      return NextResponse.json(
        { success: false, error: `Stock symbol '${symbol}' not found` },
        { status: 404 }
      );
    }
    
    const stockData = generateRealtimeStockData(baseStock);
    
    return NextResponse.json({
      success: true,
      data: stockData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
