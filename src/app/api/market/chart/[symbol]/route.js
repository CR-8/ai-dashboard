import { NextResponse } from 'next/server';

export async function GET(request, context) {
  try {
    const { params } = await context;
    const { symbol } = await params;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '1D';

    if (!symbol) {
      return NextResponse.json({
        success: false,
        error: 'Symbol is required'
      }, { status: 400 });
    }

    // Generate realistic chart data based on timeframe
    const generateChartData = (timeframe, basePrice = 100) => {
      const dataPoints = {
        '1D': { points: 24, interval: 'hour', format: 'HH:mm' },
        '1W': { points: 35, interval: 'day', format: 'MMM DD' },
        '1M': { points: 30, interval: 'day', format: 'MMM DD' },
        '3M': { points: 90, interval: 'day', format: 'MMM DD' },
        '1Y': { points: 52, interval: 'week', format: 'MMM YYYY' },
        '5Y': { points: 60, interval: 'month', format: 'MMM YYYY' }
      };

      const config = dataPoints[timeframe] || dataPoints['1D'];
      const data = [];
      let currentPrice = basePrice;
      let currentDate = new Date();

      // Set start date based on timeframe
      switch (timeframe) {
        case '1D':
          currentDate.setHours(9, 30, 0, 0); // Market open
          break;
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
        case '5Y':
          currentDate.setFullYear(currentDate.getFullYear() - 5);
          break;
      }

      for (let i = 0; i < config.points; i++) {
        // Generate realistic price movement (random walk with slight upward bias)
        const changePercent = (Math.random() - 0.48) * 0.05; // Slight upward bias
        currentPrice = Math.max(currentPrice * (1 + changePercent), 0.01);

        // Generate volume (higher volume during market hours for intraday)
        const baseVolume = 1000000;
        const volumeMultiplier = timeframe === '1D' 
          ? (currentDate.getHours() >= 9 && currentDate.getHours() <= 16 ? 2 : 0.5)
          : Math.random() * 1.5 + 0.5;
        const volume = Math.floor(baseVolume * volumeMultiplier);

        data.push({
          timestamp: new Date(currentDate).getTime(),
          date: new Date(currentDate).toISOString(),
          price: parseFloat(currentPrice.toFixed(2)),
          volume: volume,
          high: parseFloat((currentPrice * (1 + Math.random() * 0.02)).toFixed(2)),
          low: parseFloat((currentPrice * (1 - Math.random() * 0.02)).toFixed(2)),
          open: parseFloat((currentPrice * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
          close: parseFloat(currentPrice.toFixed(2))
        });

        // Increment date based on interval
        switch (config.interval) {
          case 'hour':
            currentDate.setHours(currentDate.getHours() + 1);
            break;
          case 'day':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case 'week':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'month':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
        }
      }

      return data;
    };

    // Get base price from symbol (in real app, this would come from your data source)
    const getBasePrice = (symbol) => {
      const prices = {
        'AAPL': 175.43,
        'GOOGL': 141.80,
        'MSFT': 420.55,
        'AMZN': 151.94,
        'TSLA': 248.50,
        'META': 512.20,
        'NVDA': 875.30,
        'NFLX': 491.50,
        'AMD': 138.74,
        'INTC': 24.35,
        'ORCL': 115.50,
        'CRM': 265.12,
        'JPM': 195.85,
        'BAC': 35.42,
        'WFC': 58.73,
        'GS': 378.90,
        'JNJ': 162.34,
        'PFE': 27.85,
        'UNH': 485.67,
        'ABBV': 172.45
      };
      return prices[symbol.toUpperCase()] || 100 + Math.random() * 200;
    };

    const basePrice = getBasePrice(symbol);
    const chartData = generateChartData(timeframe, basePrice);

    // Calculate statistics
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const totalChange = lastPrice - firstPrice;
    const totalChangePercent = (totalChange / firstPrice) * 100;

    return NextResponse.json({
      success: true,
      data: chartData,
      metadata: {
        symbol: symbol.toUpperCase(),
        timeframe,
        dataPoints: chartData.length,
        minPrice,
        maxPrice,
        firstPrice,
        lastPrice,
        totalChange: parseFloat(totalChange.toFixed(2)),
        totalChangePercent: parseFloat(totalChangePercent.toFixed(2)),
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chart API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
