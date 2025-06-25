import { NextResponse } from 'next/server';

// Enhanced mock data for demonstration - replace with actual API calls
function generateRealtimeMarketData() {
  const now = new Date();
  const marketHours = now.getHours() >= 9 && now.getHours() < 16;
  const volatility = marketHours ? 1 : 0.3;
  
  return {
    indices: [
      { 
        symbol: 'SPY', 
        name: 'S&P 500 ETF', 
        price: parseFloat((445.23 + (Math.random() - 0.5) * 10 * volatility).toFixed(2)), 
        change: parseFloat(((Math.random() - 0.5) * 5 * volatility).toFixed(2)), 
        changePercent: parseFloat(((Math.random() - 0.5) * 2 * volatility).toFixed(2)),
        volume: '125.4M',
        high: 448.50,
        low: 442.10
      },
      { 
        symbol: 'QQQ', 
        name: 'NASDAQ-100 ETF', 
        price: parseFloat((378.91 + (Math.random() - 0.5) * 8 * volatility).toFixed(2)), 
        change: parseFloat(((Math.random() - 0.5) * 4 * volatility).toFixed(2)), 
        changePercent: parseFloat(((Math.random() - 0.5) * 1.8 * volatility).toFixed(2)),
        volume: '87.2M',
        high: 382.15,
        low: 375.80
      },
      { 
        symbol: 'DIA', 
        name: 'Dow Jones ETF', 
        price: parseFloat((347.85 + (Math.random() - 0.5) * 6 * volatility).toFixed(2)), 
        change: parseFloat(((Math.random() - 0.5) * 3 * volatility).toFixed(2)), 
        changePercent: parseFloat(((Math.random() - 0.5) * 1.5 * volatility).toFixed(2)),
        volume: '42.8M',
        high: 350.20,
        low: 345.60
      },
      { 
        symbol: 'IWM', 
        name: 'Russell 2000 ETF', 
        price: parseFloat((198.45 + (Math.random() - 0.5) * 5 * volatility).toFixed(2)), 
        change: parseFloat(((Math.random() - 0.5) * 3 * volatility).toFixed(2)), 
        changePercent: parseFloat(((Math.random() - 0.5) * 2 * volatility).toFixed(2)),
        volume: '78.5M',
        high: 201.30,
        low: 196.80
      }
    ],
    topGainers: generateGainers(),
    topLosers: generateLosers(),
    sectors: [
      { name: 'Technology', performance: parseFloat((Math.random() * 3 - 0.5).toFixed(2)), status: Math.random() > 0.3 ? 'up' : 'down' },
      { name: 'Healthcare', performance: parseFloat((Math.random() * 2.5 - 0.3).toFixed(2)), status: Math.random() > 0.4 ? 'up' : 'down' },
      { name: 'Financial', performance: parseFloat((Math.random() * 2 - 0.8).toFixed(2)), status: Math.random() > 0.5 ? 'up' : 'down' },
      { name: 'Energy', performance: parseFloat((Math.random() * 3 - 1.5).toFixed(2)), status: Math.random() > 0.4 ? 'up' : 'down' },
      { name: 'Consumer Discretionary', performance: parseFloat((Math.random() * 2.5 - 0.5).toFixed(2)), status: Math.random() > 0.4 ? 'up' : 'down' },
      { name: 'Industrials', performance: parseFloat((Math.random() * 2 - 0.3).toFixed(2)), status: Math.random() > 0.5 ? 'up' : 'down' }
    ],
    marketStats: {
      totalVolume: '15.2B',
      advancingStocks: 1800 + Math.floor(Math.random() * 400),
      decliningStocks: 1200 + Math.floor(Math.random() * 300),
      unchangedStocks: 300 + Math.floor(Math.random() * 50),
      newHighs: 80 + Math.floor(Math.random() * 30),
      newLows: 25 + Math.floor(Math.random() * 20),
      vix: parseFloat((18.5 + (Math.random() - 0.5) * 8).toFixed(2))
    },
    timestamp: new Date().toISOString(),
    marketHours
  };
}

function generateGainers() {
  const stocks = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', basePrice: 875.30 },
    { symbol: 'AAPL', name: 'Apple Inc', basePrice: 189.25 },
    { symbol: 'TSLA', name: 'Tesla Inc', basePrice: 245.80 },
    { symbol: 'MSFT', name: 'Microsoft Corp', basePrice: 415.60 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', basePrice: 142.30 },
    { symbol: 'GOOGL', name: 'Alphabet Inc', basePrice: 138.90 }
  ];
  
  return stocks.map(stock => {
    const changePercent = Math.random() * 6 + 1; // 1-7% gains
    const change = (stock.basePrice * changePercent) / 100;
    const price = stock.basePrice + change;
    
    return {
      ...stock,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  }).sort((a, b) => b.changePercent - a.changePercent);
}

function generateLosers() {
  const stocks = [
    { symbol: 'META', name: 'Meta Platforms', basePrice: 485.20 },
    { symbol: 'AMZN', name: 'Amazon.com Inc', basePrice: 145.75 },
    { symbol: 'NFLX', name: 'Netflix Inc', basePrice: 425.30 },
    { symbol: 'PYPL', name: 'PayPal Holdings', basePrice: 61.40 },
    { symbol: 'INTC', name: 'Intel Corporation', basePrice: 43.50 },
    { symbol: 'CRM', name: 'Salesforce Inc', basePrice: 234.80 }
  ];
  
  return stocks.map(stock => {
    const changePercent = -(Math.random() * 6 + 1); // 1-7% losses
    const change = (stock.basePrice * changePercent) / 100;
    const price = stock.basePrice + change;
    
    return {
      ...stock,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  }).sort((a, b) => a.changePercent - b.changePercent);
}

async function fetchAlphaVantageData() {
  if (!process.env.ALPHA_VANTAGE_API_KEY) {
    console.warn('Alpha Vantage API key not found, using mock data');
    return null;
  }

  try {
    // Fetch S&P 500 data
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
      };
    }
  } catch (error) {
    console.error('Error fetching Alpha Vantage data:', error);
  }
  
  return null;
}

async function fetchFinnhubData() {
  if (!process.env.FINNHUB_API_KEY) {
    console.warn('Finnhub API key not found, using mock data');
    return null;
  }

  try {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    const promises = symbols.map(symbol =>
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`)
        .then(res => res.json())
        .then(data => ({
          symbol,
          price: data.c,
          change: data.d,
          changePercent: data.dp
        }))
    );

    const results = await Promise.all(promises);
    return results.filter(result => result.price);
  } catch (error) {
    console.error('Error fetching Finnhub data:', error);
  }

  return null;
}

export async function GET() {
  try {
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const marketData = generateRealtimeMarketData();

    return NextResponse.json({
      success: true,
      data: marketData,
      timestamp: new Date().toISOString(),
      lastUpdate: new Date().toLocaleTimeString()
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
