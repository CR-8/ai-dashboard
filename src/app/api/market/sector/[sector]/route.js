import { NextResponse } from 'next/server';

// Sector database with detailed information
const sectorDatabase = {
  'technology': {
    name: 'Technology',
    description: 'Companies that develop, manufacture, and distribute technology products and services.',
    companies: 143,
    totalMarketCap: '15.8T',
    volume: '5.2B',
    avgPE: 28.7,
    topPerformer: 'NVDA',
    worstPerformer: 'INTC',
    gainers: 89,
    losers: 43,
    activeStocks: 127,
    stocks: [
      {
        symbol: 'AAPL',
        name: 'Apple Inc',
        basePrice: 189.79,
        marketCap: '2.95T',
        volume: '38.9M'
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        basePrice: 378.92,
        marketCap: '2.81T',
        volume: '28.4M'
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc',
        basePrice: 134.78,
        marketCap: '1.68T',
        volume: '25.6M'
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        basePrice: 521.13,
        marketCap: '1.28T',
        volume: '52.8M'
      },
      {
        symbol: 'META',
        name: 'Meta Platforms Inc',
        basePrice: 325.45,
        marketCap: '826.5B',
        volume: '18.7M'
      },
      {
        symbol: 'AMD',
        name: 'Advanced Micro Devices',
        basePrice: 142.56,
        marketCap: '230.1B',
        volume: '62.1M'
      },
      {
        symbol: 'INTC',
        name: 'Intel Corporation',
        basePrice: 43.21,
        marketCap: '181.5B',
        volume: '28.7M'
      },
      {
        symbol: 'CRM',
        name: 'Salesforce Inc',
        basePrice: 234.67,
        marketCap: '224.1B',
        volume: '8.9M'
      }
    ]
  },
  'healthcare': {
    name: 'Healthcare',
    description: 'Companies involved in the research, development, production, and marketing of products and services related to health and medical care.',
    companies: 89,
    totalMarketCap: '8.9T',
    volume: '2.1B',
    avgPE: 22.4,
    topPerformer: 'UNH',
    worstPerformer: 'PFE',
    gainers: 52,
    losers: 31,
    activeStocks: 78,
    stocks: [
      {
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        basePrice: 158.92,
        marketCap: '421.3B',
        volume: '12.4M'
      },
      {
        symbol: 'PFE',
        name: 'Pfizer Inc',
        basePrice: 29.87,
        marketCap: '167.8B',
        volume: '24.1M'
      },
      {
        symbol: 'UNH',
        name: 'UnitedHealth Group Inc',
        basePrice: 523.45,
        marketCap: '495.2B',
        volume: '3.2M'
      },
      {
        symbol: 'ABT',
        name: 'Abbott Laboratories',
        basePrice: 108.34,
        marketCap: '189.7B',
        volume: '6.8M'
      }
    ]
  },
  'financial-services': {
    name: 'Financial Services',
    description: 'Companies that provide financial services including banking, investment, insurance, and real estate.',
    companies: 156,
    totalMarketCap: '12.3T',
    volume: '3.8B',
    avgPE: 12.8,
    topPerformer: 'JPM',
    worstPerformer: 'PYPL',
    gainers: 89,
    losers: 54,
    activeStocks: 142,
    stocks: [
      {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co',
        basePrice: 172.45,
        marketCap: '508.3B',
        volume: '15.7M'
      },
      {
        symbol: 'BAC',
        name: 'Bank of America Corp',
        basePrice: 34.12,
        marketCap: '271.4B',
        volume: '42.3M'
      },
      {
        symbol: 'WFC',
        name: 'Wells Fargo & Company',
        basePrice: 52.89,
        marketCap: '189.6B',
        volume: '18.9M'
      },
      {
        symbol: 'PYPL',
        name: 'PayPal Holdings Inc',
        basePrice: 61.89,
        marketCap: '72.4B',
        volume: '14.2M'
      }
    ]
  },
  'consumer-cyclical': {
    name: 'Consumer Cyclical',
    description: 'Companies that sell non-essential goods and services that consumers buy when they have disposable income.',
    companies: 98,
    totalMarketCap: '6.7T',
    volume: '1.9B',
    avgPE: 24.6,
    topPerformer: 'TSLA',
    worstPerformer: 'F',
    gainers: 58,
    losers: 35,
    activeStocks: 84,
    stocks: [
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc',
        basePrice: 142.31,
        marketCap: '1.48T',
        volume: '33.2M'
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc',
        basePrice: 248.87,
        marketCap: '791.2B',
        volume: '45.2M'
      },
      {
        symbol: 'HD',
        name: 'The Home Depot Inc',
        basePrice: 367.23,
        marketCap: '378.9B',
        volume: '4.1M'
      },
      {
        symbol: 'NKE',
        name: 'Nike Inc',
        basePrice: 101.47,
        marketCap: '158.7B',
        volume: '8.3M'
      }
    ]
  },
  'energy': {
    name: 'Energy',
    description: 'Companies involved in the exploration, production, marketing, and distribution of oil, gas, and renewable energy.',
    companies: 67,
    totalMarketCap: '4.2T',
    volume: '2.3B',
    avgPE: 14.2,
    topPerformer: 'XOM',
    worstPerformer: 'FSLR',
    gainers: 34,
    losers: 28,
    activeStocks: 59,
    stocks: [
      {
        symbol: 'XOM',
        name: 'Exxon Mobil Corporation',
        basePrice: 102.56,
        marketCap: '425.7B',
        volume: '18.4M'
      },
      {
        symbol: 'CVX',
        name: 'Chevron Corporation',
        basePrice: 152.78,
        marketCap: '287.3B',
        volume: '9.7M'
      },
      {
        symbol: 'COP',
        name: 'ConocoPhillips',
        basePrice: 118.34,
        marketCap: '147.2B',
        volume: '7.8M'
      }
    ]
  },
  'utilities': {
    name: 'Utilities',
    description: 'Companies that provide essential services such as electricity, gas, water, and waste management.',
    companies: 34,
    totalMarketCap: '1.8T',
    volume: '890M',
    avgPE: 18.9,
    topPerformer: 'NEE',
    worstPerformer: 'ED',
    gainers: 19,
    losers: 12,
    activeStocks: 28,
    stocks: [
      {
        symbol: 'NEE',
        name: 'NextEra Energy Inc',
        basePrice: 67.45,
        marketCap: '135.8B',
        volume: '12.3M'
      },
      {
        symbol: 'DUK',
        name: 'Duke Energy Corporation',
        basePrice: 98.23,
        marketCap: '76.4B',
        volume: '3.1M'
      },
      {
        symbol: 'SO',
        name: 'The Southern Company',
        basePrice: 74.12,
        marketCap: '79.2B',
        volume: '4.7M'
      }
    ]
  }
};

function generateRealtimeSectorData(baseSector) {
  const now = new Date();
  const marketHours = now.getHours() >= 9 && now.getHours() < 16;
  const volatility = marketHours ? 1 : 0.3;
  
  // Generate sector performance
  const performance = (Math.random() - 0.5) * 4 * volatility; // -2% to +2%
  
  // Generate stock data with realistic movements
  const stocks = baseSector.stocks.map(stock => {
    const changePercent = (Math.random() - 0.5) * 8 * volatility; // -4% to +4%
    const change = (stock.basePrice * changePercent) / 100;
    const price = stock.basePrice + change;
    
    return {
      ...stock,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  });
  
  return {
    ...baseSector,
    performance: parseFloat(performance.toFixed(2)),
    stocks,
    timestamp: new Date().toISOString(),
    marketHours
  };
}

export async function GET(request, context) {
  try {
    const { params } = await context;
    const { sector } = await params;
    const sectorSlug = sector?.toLowerCase();
    
    if (!sectorSlug) {
      return NextResponse.json(
        { success: false, error: 'Sector slug is required' },
        { status: 400 }
      );
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const baseSector = sectorDatabase[sectorSlug];
    
    if (!baseSector) {
      return NextResponse.json(
        { success: false, error: `Sector '${sectorSlug}' not found` },
        { status: 404 }
      );
    }
    
    const sectorData = generateRealtimeSectorData(baseSector);
    
    return NextResponse.json({
      success: true,
      data: sectorData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching sector data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sector data' },
      { status: 500 }
    );
  }
}
