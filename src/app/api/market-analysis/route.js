import { NextResponse } from 'next/server';

/**
 * Generates competitive analysis data
 * @param {string} sector - Company sector
 * @param {string} symbol - Company symbol for context
 * @returns {Array} Competitor analysis data
 */
function generateCompetitorAnalysis(sector, symbol) {
  const sectorCompetitors = {
    Technology: [
      { name: 'Apple Inc.', symbol: 'AAPL', marketShare: 28.5, growth: 12.3, pe: 28.4, revenue: 394.3 },
      { name: 'Microsoft Corp.', symbol: 'MSFT', marketShare: 22.1, growth: 15.7, pe: 32.1, revenue: 211.9 },
      { name: 'Alphabet Inc.', symbol: 'GOOGL', marketShare: 18.9, growth: 8.9, pe: 24.8, revenue: 307.4 },
      { name: 'Amazon.com Inc.', symbol: 'AMZN', marketShare: 16.2, growth: 11.4, pe: 45.2, revenue: 574.8 },
      { name: 'Meta Platforms', symbol: 'META', marketShare: 8.7, growth: 6.2, pe: 19.5, revenue: 134.9 },
      { name: 'Tesla Inc.', symbol: 'TSLA', marketShare: 5.6, growth: 18.5, pe: 48.9, revenue: 96.8 }
    ],
    Financial: [
      { name: 'JPMorgan Chase', symbol: 'JPM', marketShare: 25.2, growth: 8.1, pe: 12.5, revenue: 158.1 },
      { name: 'Bank of America', symbol: 'BAC', marketShare: 18.7, growth: 6.4, pe: 11.8, revenue: 94.9 },
      { name: 'Wells Fargo', symbol: 'WFC', marketShare: 15.3, growth: 4.2, pe: 10.9, revenue: 73.8 },
      { name: 'Citigroup Inc.', symbol: 'C', marketShare: 12.8, growth: 5.7, pe: 9.4, revenue: 71.9 },
      { name: 'Goldman Sachs', symbol: 'GS', marketShare: 11.4, growth: 9.8, pe: 14.2, revenue: 47.4 },
      { name: 'Morgan Stanley', symbol: 'MS', marketShare: 16.6, growth: 7.2, pe: 13.1, revenue: 54.1 }
    ],
    Healthcare: [
      { name: 'Johnson & Johnson', symbol: 'JNJ', marketShare: 22.4, growth: 7.8, pe: 16.2, revenue: 94.9 },
      { name: 'Pfizer Inc.', symbol: 'PFE', marketShare: 18.1, growth: 5.4, pe: 13.8, revenue: 58.5 },
      { name: 'UnitedHealth Group', symbol: 'UNH', marketShare: 15.7, growth: 12.1, pe: 24.7, revenue: 324.2 },
      { name: 'Merck & Co.', symbol: 'MRK', marketShare: 14.2, growth: 6.8, pe: 17.9, revenue: 60.1 },
      { name: 'AbbVie Inc.', symbol: 'ABBV', marketShare: 12.9, growth: 8.9, pe: 15.4, revenue: 58.1 },
      { name: 'Bristol-Myers Squibb', symbol: 'BMY', marketShare: 16.7, growth: 4.2, pe: 12.6, revenue: 46.4 }
    ],
    Automotive: [
      { name: 'Tesla Inc.', symbol: 'TSLA', marketShare: 31.2, growth: 18.5, pe: 48.9, revenue: 96.8 },
      { name: 'Ford Motor Co.', symbol: 'F', marketShare: 18.4, growth: -2.1, pe: 7.8, revenue: 158.1 },
      { name: 'General Motors', symbol: 'GM', marketShare: 16.9, growth: 1.4, pe: 6.2, revenue: 171.8 },
      { name: 'Toyota Motor Corp.', symbol: 'TM', marketShare: 15.7, growth: 4.8, pe: 9.1, revenue: 274.5 },
      { name: 'Stellantis N.V.', symbol: 'STLA', marketShare: 12.2, growth: 3.2, pe: 4.1, revenue: 189.5 },
      { name: 'BMW Group', symbol: 'BMWYY', marketShare: 5.6, growth: 6.7, pe: 5.8, revenue: 142.6 }
    ]
  };

  // Default to Technology if sector not found
  const competitors = sectorCompetitors[sector] || sectorCompetitors.Technology;
  
  // Add some randomization to make data more realistic
  return competitors.map(competitor => ({
    ...competitor,
    marketShare: parseFloat((competitor.marketShare * (0.9 + Math.random() * 0.2)).toFixed(1)),
    growth: parseFloat((competitor.growth * (0.8 + Math.random() * 0.4)).toFixed(1)),
    pe: parseFloat((competitor.pe * (0.9 + Math.random() * 0.2)).toFixed(1))
  }));
}

/**
 * Generates sector performance data
 * @returns {Array} Sector performance data
 */
function generateSectorPerformance() {
  const baseSectors = [
    { sector: 'Technology', performance: 18.5, color: '#3b82f6' },
    { sector: 'Healthcare', performance: 12.8, color: '#10b981' },
    { sector: 'Financial Services', performance: 8.9, color: '#f59e0b' },
    { sector: 'Energy', performance: -2.4, color: '#ef4444' },
    { sector: 'Consumer Discretionary', performance: 6.7, color: '#8b5cf6' },
    { sector: 'Industrials', performance: 4.2, color: '#06b6d4' },
    { sector: 'Materials', performance: 2.1, color: '#84cc16' },
    { sector: 'Utilities', performance: 1.8, color: '#f97316' },
    { sector: 'Real Estate', performance: 3.4, color: '#ec4899' },
    { sector: 'Communication Services', performance: 7.9, color: '#14b8a6' }
  ];

  // Add some variation to performance data
  return baseSectors.map(sector => ({
    ...sector,
    performance: parseFloat((sector.performance * (0.8 + Math.random() * 0.4)).toFixed(1))
  }));
}

/**
 * Generates analyst ratings data
 * @param {number} currentPrice - Current stock price
 * @param {string} symbol - Stock symbol
 * @returns {Array} Analyst ratings data
 */
function generateAnalystRatings(currentPrice, symbol) {
  const firms = [
    'Goldman Sachs Group Inc.',
    'Morgan Stanley',
    'JPMorgan Chase & Co.',
    'Bank of America Corp.',
    'Credit Suisse Group AG',
    'Barclays PLC',
    'Deutsche Bank AG',
    'Wells Fargo & Company',
    'Citigroup Inc.',
    'UBS Group AG'
  ];

  const ratings = [
    { rating: 'Strong Buy', weight: 0.25 },
    { rating: 'Buy', weight: 0.35 },
    { rating: 'Overweight', weight: 0.20 },
    { rating: 'Hold', weight: 0.15 },
    { rating: 'Underweight', weight: 0.05 }
  ];

  // Generate ratings for random selection of firms
  const numRatings = 5 + Math.floor(Math.random() * 6); // 5-10 ratings
  const selectedFirms = firms.sort(() => 0.5 - Math.random()).slice(0, numRatings);

  return selectedFirms.map((firm, index) => {
    // Weighted random rating selection
    const rand = Math.random();
    let cumulativeWeight = 0;
    let selectedRating = 'Hold';

    for (const { rating, weight } of ratings) {
      cumulativeWeight += weight;
      if (rand <= cumulativeWeight) {
        selectedRating = rating;
        break;
      }
    }

    // Generate price target based on rating
    let targetMultiplier;
    switch (selectedRating) {
      case 'Strong Buy':
        targetMultiplier = 1.15 + Math.random() * 0.15; // 15-30% upside
        break;
      case 'Buy':
        targetMultiplier = 1.08 + Math.random() * 0.12; // 8-20% upside
        break;
      case 'Overweight':
        targetMultiplier = 1.03 + Math.random() * 0.10; // 3-13% upside
        break;
      case 'Hold':
        targetMultiplier = 0.95 + Math.random() * 0.10; // -5% to +5%
        break;
      case 'Underweight':
        targetMultiplier = 0.85 + Math.random() * 0.10; // -15% to -5%
        break;
      default:
        targetMultiplier = 1.0;
    }

    const target = parseFloat((currentPrice * targetMultiplier).toFixed(2));
    const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago

    return {
      firm,
      rating: selectedRating,
      target,
      current: currentPrice,
      updatedDaysAgo: daysAgo,
      analyst: `${['John', 'Sarah', 'Michael', 'Lisa', 'David', 'Emma'][Math.floor(Math.random() * 6)]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][Math.floor(Math.random() * 6)]}`
    };
  });
}

/**
 * Calculates market insights and consensus data
 * @param {Array} analystRatings - Analyst ratings array
 * @returns {Object} Market insights
 */
function calculateMarketInsights(analystRatings) {
  if (!analystRatings.length) return null;

  const avgTarget = analystRatings.reduce((sum, rating) => sum + rating.target, 0) / analystRatings.length;
  const currentPrice = analystRatings[0].current;
  const potentialUpside = ((avgTarget - currentPrice) / currentPrice) * 100;

  // Rating distribution
  const ratingCounts = analystRatings.reduce((acc, rating) => {
    acc[rating.rating] = (acc[rating.rating] || 0) + 1;
    return acc;
  }, {});

  // Determine consensus
  const buyRatings = (ratingCounts['Strong Buy'] || 0) + (ratingCounts['Buy'] || 0) + (ratingCounts['Overweight'] || 0);
  const holdRatings = ratingCounts['Hold'] || 0;
  const sellRatings = ratingCounts['Underweight'] || 0;

  let consensus;
  if (buyRatings > holdRatings + sellRatings) {
    consensus = 'BUY';
  } else if (holdRatings > buyRatings + sellRatings) {
    consensus = 'HOLD';
  } else {
    consensus = 'NEUTRAL';
  }

  return {
    consensus,
    avgTarget: parseFloat(avgTarget.toFixed(2)),
    potentialUpside: parseFloat(potentialUpside.toFixed(1)),
    totalAnalysts: analystRatings.length,
    ratingDistribution: ratingCounts,
    priceRange: {
      high: Math.max(...analystRatings.map(r => r.target)),
      low: Math.min(...analystRatings.map(r => r.target))
    }
  };
}

/**
 * Main API handler for market analysis data
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { symbol, sector, currentPrice } = body;
    
    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Company symbol is required' },
        { status: 400 }
      );
    }

    const price = currentPrice || 150; // Default price if not provided
    const companySector = sector || 'Technology'; // Default sector

    // Generate market analysis data
    const competitorAnalysis = generateCompetitorAnalysis(companySector, symbol);
    const sectorPerformance = generateSectorPerformance();
    const analystRatings = generateAnalystRatings(price, symbol);
    const marketInsights = calculateMarketInsights(analystRatings);

    const analysisData = {
      competitorAnalysis,
      sectorPerformance,
      analystRatings,
      marketInsights,
      lastUpdated: new Date().toISOString(),
      dataSource: 'generated' // Indicates this is generated data
    };

    return NextResponse.json({
      success: true,
      data: analysisData
    });

  } catch (error) {
    console.error('Market Analysis API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate market analysis',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Market Analysis API endpoint',
    usage: 'POST /api/market-analysis with { symbol: "AAPL", sector: "Technology", currentPrice: 150 }',
    supportedMethods: ['POST'],
    description: 'Provides competitor analysis, sector performance, and analyst ratings data'
  });
}
