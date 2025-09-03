import { NextResponse } from 'next/server';

export async function GET(request, context) {
  try {
    const { params } = await context;
    const { sector } = await params;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '1M';

    if (!sector) {
      return NextResponse.json({
        success: false,
        error: 'Sector is required'
      }, { status: 400 });
    }

    // Generate sector performance data
    const generateSectorData = (sectorSlug, timeframe) => {
      const sectorMap = {
        'technology': 'Technology',
        'healthcare': 'Healthcare', 
        'financial': 'Financial Services',
        'energy': 'Energy',
        'consumer-goods': 'Consumer Goods',
        'industrials': 'Industrials',
        'telecommunications': 'Telecommunications',
        'utilities': 'Utilities',
        'real-estate': 'Real Estate'
      };

      const sectorName = sectorMap[sectorSlug] || 'Technology';
      
      const dataPoints = {
        '1W': { points: 7, interval: 'day' },
        '1M': { points: 30, interval: 'day' },
        '3M': { points: 90, interval: 'day' },
        '1Y': { points: 52, interval: 'week' }
      };

      const config = dataPoints[timeframe] || dataPoints['1M'];
      const data = [];
      let currentIndex = 100; // Start at index 100
      let currentDate = new Date();

      // Set start date
      switch (timeframe) {
        case '1W':
          currentDate.setDate(currentDate.getDate() - 7);
          break;
        case '1M':
          currentDate.setMonth(currentDate.getMonth() - 1);
          break;
        case '3M':
          currentDate.setMonth(currentDate.getMonth() - 3);
          break;
        case '1Y':
          currentDate.setFullYear(currentDate.getFullYear() - 1);
          break;
      }

      // Sector-specific performance characteristics
      const sectorVolatility = {
        'technology': 0.025,
        'healthcare': 0.015,
        'financial': 0.020,
        'energy': 0.035,
        'consumer-goods': 0.012,
        'industrials': 0.018,
        'telecommunications': 0.010,
        'utilities': 0.008,
        'real-estate': 0.022
      };

      const volatility = sectorVolatility[sectorSlug] || 0.020;

      for (let i = 0; i < config.points; i++) {
        // Generate sector performance with different volatility by sector
        const changePercent = (Math.random() - 0.5) * volatility;
        currentIndex = Math.max(currentIndex * (1 + changePercent), 50);

        data.push({
          timestamp: new Date(currentDate).getTime(),
          date: new Date(currentDate).toISOString(),
          value: parseFloat(currentIndex.toFixed(2)),
          volume: Math.floor(Math.random() * 10000000 + 5000000), // Sector volume
          performance: parseFloat(((currentIndex - 100) / 100 * 100).toFixed(2))
        });

        // Increment date
        if (config.interval === 'day') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (config.interval === 'week') {
          currentDate.setDate(currentDate.getDate() + 7);
        }
      }

      return {
        data,
        sectorName,
        totalChange: parseFloat(((currentIndex - 100) / 100 * 100).toFixed(2))
      };
    };

    const result = generateSectorData(sector, timeframe);

    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: {
        sector: result.sectorName,
        timeframe,
        dataPoints: result.data.length,
        totalChange: result.totalChange,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Sector Chart API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
