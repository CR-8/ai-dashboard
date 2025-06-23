import { NextResponse } from 'next/server';

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Financial Modeling Prep API (free tier alternative)
const FMP_API_KEY = process.env.FMP_API_KEY || 'demo';
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Yahoo Finance API (free alternative)
const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

/**
 * Fetches company overview data
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Company overview data
 */
async function fetchCompanyOverview(symbol) {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch company overview');
    }
    
    const data = await response.json();
    
    // Handle API rate limit or error responses
    if (data.Note || data['Error Message']) {
      throw new Error(data.Note || data['Error Message']);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return null;
  }
}

/**
 * Fetches real-time stock quote
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Stock quote data
 */
async function fetchStockQuote(symbol) {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock quote');
    }
    
    const data = await response.json();
    
    if (data.Note || data['Error Message']) {
      throw new Error(data.Note || data['Error Message']);
    }
    
    return data['Global Quote'] || {};
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
}

/**
 * Fetches historical stock data
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Array>} Historical stock data
 */
async function fetchHistoricalData(symbol) {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }
    
    const data = await response.json();
    
    if (data.Note || data['Error Message']) {
      throw new Error(data.Note || data['Error Message']);
    }
    
    const timeSeries = data['Monthly Time Series'] || {};
    
    // Convert to array format and get last 6 months
    const stockData = Object.entries(timeSeries)
      .slice(0, 6)
      .reverse()
      .map(([date, values]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        price: parseFloat(values['4. close']),
        volume: parseFloat(values['5. volume']) / 1000000, // Convert to millions
        marketCap: 0 // Will be calculated based on shares outstanding
      }));
    
    return stockData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}

/**
 * Generates fallback data when APIs fail
 * @param {string} symbol - Stock symbol
 * @returns {Object} Fallback company data
 */
function generateFallbackData(symbol) {
  const basePrice = 100 + Math.random() * 200;
  const companies = {
    AAPL: { name: 'Apple Inc.', sector: 'Technology', basePrice: 180 },
    MSFT: { name: 'Microsoft Corporation', sector: 'Technology', basePrice: 300 },
    GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', basePrice: 120 },
    TSLA: { name: 'Tesla Inc.', sector: 'Automotive', basePrice: 250 },
    AMZN: { name: 'Amazon.com Inc.', sector: 'E-commerce', basePrice: 140 },
  };
  
  const company = companies[symbol] || { 
    name: `${symbol} Corporation`, 
    sector: 'Technology', 
    basePrice: basePrice 
  };
  
  const currentPrice = company.basePrice + (Math.random() - 0.5) * 20;
  const change = (Math.random() - 0.5) * 10;
  const changePercent = (change / currentPrice) * 100;
  
  return {
    companyName: company.name,
    symbol: symbol,
    sector: company.sector,
    currentPrice: parseFloat(currentPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    marketCap: parseFloat((currentPrice * 5).toFixed(2)), // Approximate
    peRatio: parseFloat((15 + Math.random() * 20).toFixed(1)),
    revenue: parseFloat((200 + Math.random() * 300).toFixed(1)),
    netIncome: parseFloat((40 + Math.random() * 80).toFixed(1)),
    
    // Generate historical data
    stockData: Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const price = currentPrice * (0.8 + Math.random() * 0.4);
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        price: parseFloat(price.toFixed(2)),
        volume: parseFloat((1.5 + Math.random() * 2).toFixed(1)),
        marketCap: parseFloat((price * 5 / 1000).toFixed(2))
      };
    }),
    
    // Generate quarterly financial data
    financialMetrics: Array.from({ length: 6 }, (_, i) => {
      const baseRevenue = 25 + Math.random() * 20;
      const revenue = baseRevenue + i * 2;
      const profit = revenue * (0.15 + Math.random() * 0.1);
      
      return {
        quarter: `Q${(i % 4) + 1} ${2023 + Math.floor(i / 4)}`,
        revenue: parseFloat(revenue.toFixed(1)),
        profit: parseFloat(profit.toFixed(1)),
        eps: parseFloat((profit / 10).toFixed(2))
      };
    })
  };
}

/**
 * Main API handler for company data
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { symbol } = body;
    
    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Company symbol is required' },
        { status: 400 }
      );
    }
    
    const normalizedSymbol = symbol.toUpperCase().trim();
    
    // Fetch data from multiple sources
    const [overview, quote, historicalData] = await Promise.allSettled([
      fetchCompanyOverview(normalizedSymbol),
      fetchStockQuote(normalizedSymbol),
      fetchHistoricalData(normalizedSymbol)
    ]);
    
    // Check if we have valid data from APIs
    const hasValidData = overview.status === 'fulfilled' && overview.value && 
                        quote.status === 'fulfilled' && quote.value;
    
    let companyData;
    
    if (hasValidData) {
      // Transform real API data
      const overviewData = overview.value;
      const quoteData = quote.value;
      const stockHistory = historicalData.status === 'fulfilled' ? historicalData.value : [];
      
      companyData = {
        companyName: overviewData.Name || `${normalizedSymbol} Corporation`,
        symbol: normalizedSymbol,
        sector: overviewData.Sector || 'Technology',
        currentPrice: parseFloat(quoteData['05. price']) || 0,
        change: parseFloat(quoteData['09. change']) || 0,
        changePercent: parseFloat(quoteData['10. change percent']?.replace('%', '')) || 0,
        marketCap: parseFloat(overviewData.MarketCapitalization) / 1000000000 || 0,
        peRatio: parseFloat(overviewData.PERatio) || 0,
        revenue: parseFloat(overviewData.RevenueTTM) / 1000000000 || 0,
        netIncome: (parseFloat(overviewData.ProfitMargin) * parseFloat(overviewData.RevenueTTM)) / 1000000000 || 0,
        stockData: stockHistory,
        description: overviewData.Description || 'No description available',
        dividendYield: parseFloat(overviewData.DividendYield) || 0,
        bookValue: parseFloat(overviewData.BookValue) || 0,
        eps: parseFloat(overviewData.EPS) || 0
      };
    } else {
      // Use fallback data
      console.log('Using fallback data for:', normalizedSymbol);
      companyData = generateFallbackData(normalizedSymbol);
    }
    
    return NextResponse.json({
      success: true,
      data: companyData,
      source: hasValidData ? 'api' : 'fallback'
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Company API endpoint',
    usage: 'POST /api/company with { symbol: "AAPL" }',
    supportedMethods: ['POST']
  });
}
