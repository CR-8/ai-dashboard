import { NextResponse } from 'next/server';
import { marketAPI } from '@/lib/market-api'

export async function GET(request, { params }) {
  try {
    const { symbol } = params;
    const symbolUpper = symbol?.toUpperCase();

    if (!symbolUpper) {
      return NextResponse.json(
        { success: false, error: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    // Fetch stock data from external API
    let stockData;
    try {
      stockData = await marketAPI.getStockBySymbol(symbolUpper);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: `Stock symbol '${symbolUpper}' not found or unavailable` },
        { status: 404 }
      );
    }

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
