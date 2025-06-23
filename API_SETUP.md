# API Setup Guide for Enhanced Financial Dashboard

## Required API Keys for Full Functionality

### 1. Google AI (Gemini) API Key - **REQUIRED**
- Go to: https://aistudio.google.com/app/apikey
- Create a new API key
- **Free Tier**: 60 requests per minute, 1,500 requests per day
- Add to .env.local: `GOOGLE_AI_API_KEY=your_key_here`

### 2. Alpha Vantage - **REQUIRED** (Free tier available)
- Go to: https://www.alphavantage.co/support/#api-key
- Sign up for free API key 
- **Free Tier**: 500 requests/day, 5 requests/minute
- Add to .env.local: `ALPHA_VANTAGE_API_KEY=your_key_here`

### 3. Finnhub - **RECOMMENDED** (Free tier available)
- Go to: https://finnhub.io/register
- Sign up for free API key
- **Free Tier**: 60 calls/minute, unlimited daily requests
- Add to .env.local: `FINNHUB_API_KEY=your_key_here`

### 4. Financial Modeling Prep - **RECOMMENDED** (Free tier available)
- Go to: https://financialmodelingprep.com/developer/docs
- Sign up for free API key
- **Free Tier**: 250 requests/day
- Add to .env.local: `FMP_API_KEY=your_key_here`

### 5. Twelve Data - **OPTIONAL** (Free tier available)
- Go to: https://twelvedata.com/pricing
- Sign up for free API key
- **Free Tier**: 800 requests/day, 8 requests/minute
- Add to .env.local: `TWELVE_DATA_API_KEY=your_key_here`

### 6. News API - **OPTIONAL** (Free tier available)
- Go to: https://newsapi.org/register
- Sign up for free API key
- **Free Tier**: 1000 requests/day for developer plan
- Add to .env.local: `NEWS_API_KEY=your_key_here`

### 7. Polygon.io - **OPTIONAL** (Paid)
- Go to: https://polygon.io/
- Sign up for API key
- **Free Tier**: 5 requests/minute (very limited)
- Add to .env.local: `POLYGON_API_KEY=your_key_here`

## Enhanced Features

### Web Scraping Integration
- Moneycontrol.com: Automatic scraping for Indian stocks
- Google Analytics: Market sentiment analysis
- Real-time news aggregation from multiple sources

### AI-Powered Analysis
- Google Gemini integration for comprehensive market analysis
- News sentiment analysis
- Technical indicators prediction
- Investment recommendations with confidence scores

## Setup Instructions

1. Copy .env.example to .env.local (if exists) or create .env.local
2. Fill in your API keys (minimum: GOOGLE_AI_API_KEY and ALPHA_VANTAGE_API_KEY)
3. Install dependencies: `npm install`
4. Restart your development server: `npm run dev`

## .env.local Template

```env
# Required for basic functionality
GOOGLE_AI_API_KEY=your_google_ai_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here

# Recommended for enhanced features
FINNHUB_API_KEY=your_finnhub_key_here
FMP_API_KEY=your_fmp_key_here

# Optional for additional data sources
TWELVE_DATA_API_KEY=your_twelve_data_key_here
NEWS_API_KEY=your_news_api_key_here
POLYGON_API_KEY=your_polygon_key_here
```

## API Endpoints

- **POST /api/analyze-company** - Comprehensive company analysis
  - Fetches data from multiple sources
  - Includes AI-powered analysis
  - Returns news, sentiment, and recommendations

## Enhanced Data Sources

### Financial Data
- **Alpha Vantage**: Historical prices, company overview
- **Finnhub**: Real-time quotes, financial news
- **Financial Modeling Prep**: Detailed financial statements
- **Twelve Data**: Alternative stock data source
- **Moneycontrol**: Indian market data (web scraping)

### News & Sentiment
- **News API**: Global financial news
- **Finnhub News**: Company-specific news
- **Web Scraping**: Real-time news from financial websites

### AI Analysis
- **Google Gemini**: Market analysis, predictions, sentiment analysis
- **Technical Indicators**: RSI, MACD, SMA calculations
- **Risk Assessment**: Volatility, Beta, VaR analysis

## Fallback System

The API includes comprehensive fallback mechanisms:
- If real APIs fail, it generates realistic mock data
- Multiple data source redundancy
- Graceful error handling with user-friendly messages

## Rate Limiting & Best Practices

- Implements exponential backoff for failed requests
- Respects API rate limits
- Caches data when possible
- Parallel data fetching for optimal performance

## Free Tier Optimization Strategies

### API Usage Optimization
1. **Request Batching**: Group multiple data requests when possible
2. **Smart Caching**: Cache responses for 5-15 minutes to reduce API calls
3. **Fallback Hierarchy**: Use primary → secondary → web scraping → mock data
4. **Rate Limit Respect**: Automatic throttling and retry mechanisms
5. **Efficient Endpoints**: Use most data-rich endpoints to minimize calls

### Daily Limits Management
- **Alpha Vantage**: 500 calls/day → ~20 stocks fully analyzed
- **FMP**: 250 calls/day → ~12 stocks with financial data
- **News API**: 1000 calls/day → ~50 stocks with news
- **Twelve Data**: 800 calls/day → ~40 stocks analyzed
- **Google AI**: 1500 calls/day → Unlimited stock analysis

### Recommended Setup for Maximum Free Usage
```
Priority 1: GOOGLE_AI_API_KEY + ALPHA_VANTAGE_API_KEY
Priority 2: + FINNHUB_API_KEY (unlimited daily calls)
Priority 3: + TWELVE_DATA_API_KEY (800 calls/day backup)
Priority 4: + NEWS_API_KEY (1000 news requests/day)
Priority 5: + FMP_API_KEY (250 detailed financial calls/day)
```

### Smart Usage Patterns
- **Morning**: Batch analyze watchlist stocks
- **During Market Hours**: Use real-time Finnhub data (unlimited)
- **Evening**: Deep analysis with FMP financial data
- **Weekend**: News analysis and AI insights
