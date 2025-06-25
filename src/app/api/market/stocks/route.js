import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'trending';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock data - replace with real API calls
    const stocksData = {
      trending: [
        { symbol: 'TSLA', name: 'Tesla Inc', price: 248.87 + (Math.random() - 0.5) * 20, change: (Math.random() - 0.5) * 15, changePercent: (Math.random() - 0.5) * 6, marketCap: '791.2B', volume: '45.2M' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 521.13 + (Math.random() - 0.5) * 40, change: (Math.random() - 0.5) * 25, changePercent: (Math.random() - 0.5) * 8, marketCap: '1.28T', volume: '52.8M' },
        { symbol: 'AAPL', name: 'Apple Inc', price: 189.79 + (Math.random() - 0.5) * 10, change: (Math.random() - 0.5) * 8, changePercent: (Math.random() - 0.5) * 4, marketCap: '2.95T', volume: '38.9M' },
        { symbol: 'GOOGL', name: 'Alphabet Inc', price: 134.78 + (Math.random() - 0.5) * 8, change: (Math.random() - 0.5) * 6, changePercent: (Math.random() - 0.5) * 3, marketCap: '1.68T', volume: '25.6M' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.92 + (Math.random() - 0.5) * 15, change: (Math.random() - 0.5) * 12, changePercent: (Math.random() - 0.5) * 5, marketCap: '2.81T', volume: '28.4M' },
        { symbol: 'META', name: 'Meta Platforms Inc', price: 325.45 + (Math.random() - 0.5) * 20, change: (Math.random() - 0.5) * 15, changePercent: (Math.random() - 0.5) * 6, marketCap: '826.5B', volume: '18.7M' },
        { symbol: 'AMZN', name: 'Amazon.com Inc', price: 142.31 + (Math.random() - 0.5) * 8, change: (Math.random() - 0.5) * 6, changePercent: (Math.random() - 0.5) * 4, marketCap: '1.48T', volume: '33.2M' },
        { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.56 + (Math.random() - 0.5) * 12, change: (Math.random() - 0.5) * 8, changePercent: (Math.random() - 0.5) * 5, marketCap: '230.1B', volume: '62.1M' }
      ],
      gainers: [
        { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 521.13, change: 24.67, changePercent: 4.97, marketCap: '1.28T', volume: '52.8M' },
        { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.56, change: 8.89, changePercent: 6.55, marketCap: '230.1B', volume: '62.1M' },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 248.87, change: 12.42, changePercent: 5.26, marketCap: '791.2B', volume: '45.2M' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.92, change: 15.34, changePercent: 4.23, marketCap: '2.81T', volume: '28.4M' }
      ],
      losers: [
        { symbol: 'META', name: 'Meta Platforms Inc', price: 325.45, change: -12.67, changePercent: -3.75, marketCap: '826.5B', volume: '18.7M' },
        { symbol: 'AMZN', name: 'Amazon.com Inc', price: 142.31, change: -8.45, changePercent: -5.61, marketCap: '1.48T', volume: '33.2M' },
        { symbol: 'AAPL', name: 'Apple Inc', price: 189.79, change: -4.15, changePercent: -2.14, marketCap: '2.95T', volume: '38.9M' },
        { symbol: 'GOOGL', name: 'Alphabet Inc', price: 134.78, change: -3.89, changePercent: -2.81, marketCap: '1.68T', volume: '25.6M' }
      ]
    };

    return NextResponse.json({
      success: true,
      data: stocksData[type] || stocksData.trending,
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
