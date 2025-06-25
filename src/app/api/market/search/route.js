import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock search results - replace with real API
    const allStocks = [
      { symbol: 'AAPL', name: 'Apple Inc', price: 189.79, exchange: 'NASDAQ' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.92, exchange: 'NASDAQ' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', price: 134.78, exchange: 'NASDAQ' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', price: 142.31, exchange: 'NASDAQ' },
      { symbol: 'TSLA', name: 'Tesla Inc', price: 248.87, exchange: 'NASDAQ' },
      { symbol: 'META', name: 'Meta Platforms Inc', price: 325.45, exchange: 'NASDAQ' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 521.13, exchange: 'NASDAQ' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.56, exchange: 'NASDAQ' },
      { symbol: 'NFLX', name: 'Netflix Inc', price: 445.23, exchange: 'NASDAQ' },
      { symbol: 'CRM', name: 'Salesforce Inc', price: 234.67, exchange: 'NYSE' }
    ];

    const filteredStocks = query 
      ? allStocks.filter(stock => 
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
        )
      : allStocks.slice(0, 5);

    return NextResponse.json({
      success: true,
      data: filteredStocks,
      query,
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
