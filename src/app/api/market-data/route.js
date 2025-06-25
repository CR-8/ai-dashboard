import { NextResponse } from 'next/server';

// Mock data for demonstration - replace with actual API calls
const mockMarketData = {
  indices: [
    { symbol: 'SPY', name: 'S&P 500 ETF', price: 445.23, change: 2.34, changePercent: 0.53 },
    { symbol: 'QQQ', name: 'NASDAQ-100 ETF', price: 378.91, change: -1.23, changePercent: -0.32 },
    { symbol: 'DIA', name: 'Dow Jones ETF', price: 347.85, change: 0.89, changePercent: 0.26 },
    { symbol: 'IWM', name: 'Russell 2000 ETF', price: 198.45, change: -0.76, changePercent: -0.38 }
  ],
  topGainers: [
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.30, change: 45.20, changePercent: 5.45 },
    { symbol: 'AAPL', name: 'Apple Inc', price: 189.25, change: 8.75, changePercent: 4.85 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 245.80, change: 12.30, changePercent: 5.27 },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 415.60, change: 18.90, changePercent: 4.76 }
  ],
  topLosers: [
    { symbol: 'META', name: 'Meta Platforms', price: 485.20, change: -23.45, changePercent: -4.61 },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 145.75, change: -8.25, changePercent: -5.36 },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 138.90, change: -6.80, changePercent: -4.67 },
    { symbol: 'NFLX', name: 'Netflix Inc', price: 425.30, change: -15.70, changePercent: -3.56 }
  ],
  sectors: [
    { name: 'Technology', performance: 2.45, status: 'up' },
    { name: 'Healthcare', performance: 1.23, status: 'up' },
    { name: 'Financial', performance: -0.87, status: 'down' },
    { name: 'Energy', performance: -1.54, status: 'down' },
    { name: 'Consumer Discretionary', performance: 0.92, status: 'up' },
    { name: 'Industrials', performance: 0.34, status: 'up' }
  ],
  marketStats: {
    totalVolume: '15.2B',
    advancingStocks: 1847,
    decliningStocks: 1234,
    unchangedStocks: 321,
    newHighs: 89,
    newLows: 34
  }
};

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
    // Try to fetch real data, fallback to mock data
    const [alphaVantageData, finnhubData] = await Promise.all([
      fetchAlphaVantageData(),
      fetchFinnhubData()
    ]);

    let marketData = mockMarketData;

    // Update with real data if available
    if (alphaVantageData) {
      marketData.indices[0] = {
        ...marketData.indices[0],
        ...alphaVantageData
      };
    }

    if (finnhubData && finnhubData.length > 0) {
      // Update top gainers/losers with real data
      finnhubData.forEach((stock, index) => {
        if (index < marketData.topGainers.length) {
          marketData.topGainers[index] = {
            ...marketData.topGainers[index],
            symbol: stock.symbol,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent
          };
        }
      });
    }

    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Error in market data API:', error);
    return NextResponse.json(mockMarketData);
  }
}
