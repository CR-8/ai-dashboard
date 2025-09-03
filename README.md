# AI Financial Dashboard

A modern Next.js 14 application that provides comprehensive financial analysis with AI-powered insights, real-time stock data, and advanced analytics.

## Features

- 🔐 **Supabase Authentication**: Secure user authentication with email/password and OAuth support
- 🤖 **AI-Powered Analysis**: Generate comprehensive market insights using Google Gemini AI
- 📊 **Real-time Stock Data**: Live market data from multiple financial APIs
- � **Interactive Charts**: Beautiful visualizations with Recharts and custom chart components
- 🎨 **Modern UI**: Built with ShadCN UI components and Tailwind CSS
- 🌙 **Dark Theme**: Professional dark theme optimized for financial data
- 📱 **Responsive Design**: Works perfectly on all device sizes
- ⚡ **Real-time Loading**: Elegant loading states and error handling
- 🔍 **Company Search**: Smart company search with autocomplete
- 💼 **User Profiles**: Complete user profile management
- 📊 **Watchlists**: Personal stock watchlists and alerts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (no TypeScript)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + ShadCN UI
- **Charts**: Recharts
- **AI**: Google Gemini AI
- **Icons**: Lucide React
- **APIs**: Alpha Vantage, Finnhub, FMP, Twelve Data, The Guardian

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project ✅ (configured)
- Google AI API key ✅ (configured)
- Alpha Vantage API key ✅ (configured)
- Additional API keys for enhanced functionality ✅ (configured)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd ai-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   The `.env.local` file has been created with all required API keys. The file includes:
   ```env
   # Supabase Configuration (Required)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google AI API Key (Required)
   GOOGLE_AI_API_KEY=your_google_ai_key
   
   # Alpha Vantage API Key (Required)
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   ```

4. **Set up Supabase Database**:
   - In your Supabase project dashboard, go to the SQL Editor
   - Run the SQL script from `supabase_schema.sql` to create tables
   - This sets up user authentication, profiles, and watchlists

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Create Account**: Sign up with email/password or use OAuth (Google/GitHub)
2. **Search Companies**: Use the search bar to find any company (e.g., "Apple", "AAPL", "Tesla")
3. **View Analysis**: Get comprehensive analysis including:
   - Real-time stock data and charts
   - AI-powered market insights
   - Company fundamentals and news
   - Technical indicators and recommendations
4. **Manage Profile**: Update your profile information and preferences
5. **Build Watchlists**: Save companies to track and set alerts

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze-company/       # Company analysis API
│   │   ├── search-companies/      # Company search API
│   │   └── cache-status/          # Cache management API
│   ├── auth/                      # Authentication pages
│   ├── dashboard/                 # Main dashboard
│   ├── profile/                   # User profile management
│   ├── globals.css                # Global styles
│   └── layout.js                  # Root layout
├── components/
│   ├── ui/                        # ShadCN UI components
├── contexts/
│   └── AuthContext.jsx           # Authentication context
├── lib/
│   ├── supabase.js               # Supabase client
│   ├── cache-manager.js          # API caching system
│   ├── animations.js             # GSAP animations
│   └── utils.js                  # Utility functions
└── middleware.js                 # Route protection middleware
```

## API Routes

### `POST /api/analyze-company`

Analyzes a company and returns comprehensive data.

**Request Body**:
```json
{
  "symbol": "AAPL"
}
```

**Response**:
```json
{
  "company": {
    "name": "Apple Inc.",
    "symbol": "AAPL",
    "price": 150.25,
    "change": 2.5,
    "changePercent": 1.69
  },
  "analysis": {
    "summary": "AI-generated analysis",
    "sentiment": "positive",
    "recommendations": [...]
  },
  "charts": [...],
  "news": [...]
}
```

### `GET /api/search-companies`

Searches for companies by name or symbol.

**Query Parameters**:
- `query`: Search term

**Response**:
```json
{
  "suggestions": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "exchange": "NASDAQ"
    }
  ]
}
```

## Authentication Features

- **Email/Password**: Standard email and password authentication
- **OAuth**: Google and GitHub OAuth integration
- **Email Verification**: Automatic email verification for new accounts
- **Password Reset**: Secure password reset via email
- **Session Management**: Automatic token refresh and secure sessions
- **Protected Routes**: Middleware-based route protection
- **User Profiles**: Complete profile management system

## Customization

### Adding New Data Sources

Add new financial APIs in `src/app/api/analyze-company/route.js`:

```javascript
// Add your custom data fetching function
async function fetchCustomData(symbol) {
  const response = await fetch(`https://your-api.com/data/${symbol}`);
  return response.json();
}
```

### Modifying AI Analysis

Update the AI prompt in the analysis API to change the AI's behavior:

```javascript
const prompt = `Analyze the company ${companyName} with the following data...`;
```

### Styling

- Modify `src/app/globals.css` for global styles
- Update component-specific styling in individual component files
- All components use Tailwind CSS with dark theme optimization

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_AI_API_KEY`
   - `ALPHA_VANTAGE_API_KEY`
   - `FINNHUB_API_KEY`
   - `FMP_API_KEY`
   - `TWELVE_DATA_API_KEY`
   - `NEWS_API_KEY`
   - `GUARDIAN_API_KEY`
   - `POLYGON_API_KEY`
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
GOOGLE_AI_API_KEY=your_google_ai_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
# Add other API keys as needed
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `GOOGLE_AI_API_KEY` | Google Gemini AI API key | Yes |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key for stock data | Yes |
| `FINNHUB_API_KEY` | Finnhub API key (optional) | No |
| `FMP_API_KEY` | Financial Modeling Prep API key (optional) | No |
| `TWELVE_DATA_API_KEY` | Twelve Data API key (optional) | No |
| `NEWS_API_KEY` | News API key (optional) | No |
| `GUARDIAN_API_KEY` | The Guardian News API key (optional) | No |
| `POLYGON_API_KEY` | Polygon.io API key (optional) | No |

## Migration from Clerk

This project has been migrated from Clerk to Supabase authentication. Key changes:

- All Clerk components replaced with custom Supabase forms
- User management moved to Supabase Auth
- Session handling updated for Supabase
- OAuth integration configured through Supabase
- Database schema includes user profiles and sessions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
