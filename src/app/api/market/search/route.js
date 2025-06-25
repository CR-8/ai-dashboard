import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Expanded stock database for search
    const allStocks = [
      { symbol: 'AAPL', name: 'Apple Inc', price: 189.79, exchange: 'NASDAQ', sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.92, exchange: 'NASDAQ', sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', price: 134.78, exchange: 'NASDAQ', sector: 'Technology' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', price: 142.31, exchange: 'NASDAQ', sector: 'Consumer Cyclical' },
      { symbol: 'TSLA', name: 'Tesla Inc', price: 248.87, exchange: 'NASDAQ', sector: 'Consumer Cyclical' },
      { symbol: 'META', name: 'Meta Platforms Inc', price: 325.45, exchange: 'NASDAQ', sector: 'Technology' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 521.13, exchange: 'NASDAQ', sector: 'Technology' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.56, exchange: 'NASDAQ', sector: 'Technology' },
      { symbol: 'NFLX', name: 'Netflix Inc', price: 445.23, exchange: 'NASDAQ', sector: 'Communication Services' },
      { symbol: 'CRM', name: 'Salesforce Inc', price: 234.67, exchange: 'NYSE', sector: 'Technology' },
      { symbol: 'INTC', name: 'Intel Corporation', price: 43.21, exchange: 'NASDAQ', sector: 'Technology' },
      { symbol: 'PYPL', name: 'PayPal Holdings Inc', price: 61.89, exchange: 'NASDAQ', sector: 'Financial Services' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co', price: 172.45, exchange: 'NYSE', sector: 'Financial Services' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.92, exchange: 'NYSE', sector: 'Healthcare' },
      { symbol: 'PFE', name: 'Pfizer Inc', price: 29.87, exchange: 'NYSE', sector: 'Healthcare' },
      { symbol: 'KO', name: 'The Coca-Cola Company', price: 59.23, exchange: 'NYSE', sector: 'Consumer Defensive' },
      { symbol: 'DIS', name: 'The Walt Disney Company', price: 89.67, exchange: 'NYSE', sector: 'Communication Services' },
      { symbol: 'BA', name: 'The Boeing Company', price: 198.34, exchange: 'NYSE', sector: 'Industrials' },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 102.56, exchange: 'NYSE', sector: 'Energy' },
      { symbol: 'WMT', name: 'Walmart Inc', price: 163.78, exchange: 'NYSE', sector: 'Consumer Defensive' }
    ];

    let filteredStocks = [];
    
    if (query && query.length > 0) {
      const queryLower = query.toLowerCase();
      filteredStocks = allStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(queryLower) ||
        stock.name.toLowerCase().includes(queryLower) ||
        stock.sector.toLowerCase().includes(queryLower)
      );
      
      // Sort by relevance - exact symbol matches first, then name matches
      filteredStocks.sort((a, b) => {
        const aSymbolMatch = a.symbol.toLowerCase().startsWith(queryLower);
        const bSymbolMatch = b.symbol.toLowerCase().startsWith(queryLower);
        
        if (aSymbolMatch && !bSymbolMatch) return -1;
        if (!aSymbolMatch && bSymbolMatch) return 1;
        
        return a.symbol.localeCompare(b.symbol);
      });
      
      // Limit results
      filteredStocks = filteredStocks.slice(0, 8);
    } else {
      // Return popular stocks if no query
      filteredStocks = allStocks.slice(0, 6);
    }

    // Add realistic price fluctuations
    filteredStocks = filteredStocks.map(stock => ({
      ...stock,
      price: parseFloat((stock.price + (Math.random() - 0.5) * stock.price * 0.02).toFixed(2))
    }));

    return NextResponse.json({
      success: true,
      data: filteredStocks,
      query,
      resultCount: filteredStocks.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error searching stocks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}
