// import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// NOTE: Set GEMINI_API_KEY in your environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request) {
  let keyword = 'unknown';
  try {
    const body = await request.json();
    keyword = body.keyword;

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }
    const prompt = `You are a business intelligence analyst. Analyze the market for the keyword: "${keyword}".\nResearch and provide a comprehensive, realistic, and up-to-date business intelligence report in valid JSON only, with no markdown or code block formatting.\n\nThe JSON must include:\n- overview: { marketSize (number, billions), growthRate (string, e.g. '+8.5%'), trend ('up'|'down'|'stable'), summary (string) }\n- monthlyData: [{ month, revenue, users, expenses, engagement }]\n- demographics: [{ age, percentage, value, color }]\n- topCompetitors: [{ name, marketShare, revenue, color }]\n- channels: [{ name, value, color }]\n- regions: [{ region, revenue, growth, users }]\n- performanceMetrics: [{ metric, value, target, unit }]\n- trends: [{ trend, impact, description, direction }]\n- opportunities: [{ opportunity, potential, description, timeline }]\n- risks: [{ risk, severity, description, probability }]\n- keyMetrics: { customerAcquisitionCost, lifetimeValue, churnRate, conversionRate, marketPenetration, customerSatisfaction }\n- chartData: { areaChart, lineChart, pieChart, barChart, competitorPieChart, regionalBarChart }\n\n**All numbers and facts must be plausible and based on real-world market knowledge as of 2024.**\n**Return only the JSON object, no markdown, no commentary, no code block.**`;

    // Call Gemini API
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    if (!geminiRes.ok) throw new Error('Gemini API error');
    const geminiData = await geminiRes.json();
    let responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Remove Markdown code block markers if present
    if (responseText) {
      responseText = responseText.trim();
      if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
      }
    }

    let analysisData;
    try {
      analysisData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError, responseText);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch analysis from Gemini',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      keyword,
      timestamp: new Date().toISOString(),
      data: analysisData
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analysis',
    }, { status: 500 });
  }
}

// Fallback mock data generator
function generateMockData(keyword) {
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate base revenue that grows over time
  const baseRevenue = Math.floor(Math.random() * 20000 + 30000);
  const baseUsers = Math.floor(Math.random() * 1000 + 1500);
  
  const monthlyData = months.map((month, index) => {
    const growthFactor = 1 + (index * 0.05) + (Math.random() * 0.1 - 0.05); // 5% base growth + random variation
    const revenue = Math.floor(baseRevenue * growthFactor);
    const expenses = Math.floor(revenue * (0.6 + Math.random() * 0.1)); // 60-70% of revenue
    const users = Math.floor(baseUsers * growthFactor);
    
    return {
      month,
      revenue,
      users,
      expenses,
      engagement: Math.floor(Math.random() * 30 + 70) // 70-100% engagement
    };
  });
  
  return {
    overview: {
      marketSize: `${(Math.random() * 100 + 10).toFixed(1)}`,
      growthRate: `+${(Math.random() * 20 + 5).toFixed(1)}%`,
      trend: Math.random() > 0.2 ? 'up' : Math.random() > 0.7 ? 'stable' : 'down',
      summary: `The ${keyword} market shows promising growth with increasing demand and digital transformation driving adoption across multiple sectors.`
    },
    monthlyData,
    demographics: [
      { age: "18-25", percentage: 25, value: Math.floor(Math.random() * 10000 + 5000), color: "#8B5CF6" },
      { age: "26-35", percentage: 35, value: Math.floor(Math.random() * 15000 + 8000), color: "#06D6A0" },
      { age: "36-45", percentage: 25, value: Math.floor(Math.random() * 12000 + 6000), color: "#FFD60A" },
      { age: "46-55", percentage: 10, value: Math.floor(Math.random() * 8000 + 4000), color: "#F72585" },
      { age: "55+", percentage: 5, value: Math.floor(Math.random() * 5000 + 2000), color: "#4CC9F0" }
    ],
    topCompetitors: [
      { name: "Market Leader Co.", marketShare: 35, revenue: Math.floor(Math.random() * 1000000 + 500000), color: "#8B5CF6" },
      { name: "Innovation Inc.", marketShare: 25, revenue: Math.floor(Math.random() * 800000 + 400000), color: "#06D6A0" },
      { name: "Growth Corp.", marketShare: 20, revenue: Math.floor(Math.random() * 600000 + 300000), color: "#FFD60A" },
      { name: "Emerging Ltd.", marketShare: 20, revenue: Math.floor(Math.random() * 400000 + 200000), color: "#F72585" }
    ],
    channels: [
      { name: "Organic Search", value: 45, color: "#8B5CF6" },
      { name: "Direct", value: 25, color: "#06D6A0" },
      { name: "Social Media", value: 15, color: "#FFD60A" },
      { name: "Referral", value: 10, color: "#F72585" },
      { name: "Email", value: 5, color: "#4CC9F0" }
    ],
    regions: [
      { region: "North America", revenue: Math.floor(Math.random() * 500000 + 200000), growth: Math.floor(Math.random() * 15 + 5), users: Math.floor(Math.random() * 50000 + 20000) },
      { region: "Europe", revenue: Math.floor(Math.random() * 400000 + 150000), growth: Math.floor(Math.random() * 12 + 3), users: Math.floor(Math.random() * 40000 + 15000) },
      { region: "Asia Pacific", revenue: Math.floor(Math.random() * 600000 + 250000), growth: Math.floor(Math.random() * 20 + 8), users: Math.floor(Math.random() * 60000 + 25000) },
      { region: "Latin America", revenue: Math.floor(Math.random() * 200000 + 50000), growth: Math.floor(Math.random() * 18 + 6), users: Math.floor(Math.random() * 20000 + 8000) },
      { region: "Middle East", revenue: Math.floor(Math.random() * 150000 + 30000), growth: Math.floor(Math.random() * 15 + 4), users: Math.floor(Math.random() * 15000 + 5000) }
    ],
    performanceMetrics: [
      { metric: "CAC", value: Math.floor(Math.random() * 150 + 50), target: Math.floor(Math.random() * 200 + 100), unit: "$" },
      { metric: "LTV", value: Math.floor(Math.random() * 1500 + 500), target: Math.floor(Math.random() * 2000 + 800), unit: "$" },
      { metric: "Churn Rate", value: Math.floor(Math.random() * 8 + 2), target: Math.floor(Math.random() * 6 + 3), unit: "%" },
      { metric: "Conversion", value: (Math.random() * 6 + 2).toFixed(1), target: (Math.random() * 8 + 4).toFixed(1), unit: "%" }
    ],
    trends: [
      { trend: "Digital Transformation", impact: "high", description: "Accelerated adoption of digital solutions", direction: "positive" },
      { trend: "Mobile-First Approach", impact: "high", description: "Increasing mobile usage and preferences", direction: "positive" },
      { trend: "Sustainability Focus", impact: "medium", description: "Growing emphasis on environmental responsibility", direction: "positive" },
      { trend: "Market Consolidation", impact: "medium", description: "Mergers and acquisitions increasing", direction: "neutral" }
    ],
    opportunities: [
      { opportunity: "Market Expansion", potential: "high", description: "Untapped markets in emerging regions", timeline: "medium" },
      { opportunity: "Technology Integration", potential: "high", description: "AI and automation opportunities", timeline: "short" },
      { opportunity: "Partnership Development", potential: "medium", description: "Strategic alliances and collaborations", timeline: "long" },
      { opportunity: "Product Innovation", potential: "high", description: "New product categories and features", timeline: "medium" }
    ],
    risks: [
      { risk: "Market Saturation", severity: "medium", description: "Increasing competition in mature markets", probability: "medium" },
      { risk: "Regulatory Changes", severity: "low", description: "Potential policy and regulatory shifts", probability: "low" },
      { risk: "Economic Uncertainty", severity: "medium", description: "Global economic fluctuations", probability: "medium" },
      { risk: "Technology Disruption", severity: "high", description: "Emerging technologies threatening current models", probability: "low" }
    ],
    keyMetrics: {
      customerAcquisitionCost: Math.floor(Math.random() * 200 + 50),
      lifetimeValue: Math.floor(Math.random() * 2000 + 500),
      churnRate: Math.floor(Math.random() * 10 + 2),
      conversionRate: (Math.random() * 8 + 2).toFixed(1),
      marketPenetration: (Math.random() * 30 + 10).toFixed(1),
      customerSatisfaction: (Math.random() * 20 + 80).toFixed(1)
    },
    chartData: {
      areaChart: "monthlyData for revenue vs expenses visualization",
      lineChart: "monthlyData for user growth trend",
      pieChart: "channels for traffic source distribution",
      barChart: "performanceMetrics for KPI comparison",
      competitorPieChart: "topCompetitors for market share analysis", 
      regionalBarChart: "regions for geographic performance"
    }
  };
}
