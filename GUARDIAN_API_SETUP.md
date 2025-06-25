# Guardian News API Setup

This guide will help you set up The Guardian News API for your news dashboard.

## Getting Your API Key

1. **Visit The Guardian Open Platform**
   - Go to [https://open-platform.theguardian.com/](https://open-platform.theguardian.com/)

2. **Register for an API Key**
   - Click "Register for an API key"
   - Fill out the registration form
   - Agree to the terms and conditions
   - Submit your application

3. **Get Your API Key**
   - Once approved, you'll receive your API key via email
   - You can also find it in your developer dashboard

## Environment Setup

1. **Add to your `.env.local` file:**
   ```env
   GUARDIAN_API_KEY=your-api-key-here
   ```

2. **Alternative Environment Variables:**
   You can also use any of these variable names:
   ```env
   GUARDIAN_API_KEY=your-api-key-here
   NEXT_PUBLIC_GUARDIAN_API_KEY=your-api-key-here
   THE_GUARDIAN_API_KEY=your-api-key-here
   ```

## API Features

The `/api/guardian-news` endpoint provides:

- **Automatic caching**: Data is cached for 5 minutes
- **Auto-refresh**: News updates every 5 minutes
- **Error handling**: Fallback to cached data if API fails
- **Article transformation**: Automatically categorizes articles as featured, standard, or compact
- **Section filtering**: Focuses on key news sections
- **Clean data structure**: Formatted for your news page components

## API Endpoints

### GET `/api/guardian-news`
Fetches the latest news with automatic caching.

**Response:**
```json
{
  "success": true,
  "data": [...articles],
  "cached": false,
  "lastFetched": 1640995200000,
  "nextUpdate": 1640995500000,
  "totalArticles": 20
}
```

### POST `/api/guardian-news`
Forces a cache refresh and fetches fresh data.

## Rate Limits

The Guardian API has the following rate limits:
- **Tier**: Free tier (12 calls per second)
- **Daily**: 5,000 calls per day
- **Monthly**: No monthly limit specified

The built-in caching system helps you stay well within these limits.

## Troubleshooting

1. **API Key Issues:**
   - Ensure your API key is correctly set in environment variables
   - Check that your key is approved and active
   - Verify there are no extra spaces in the key

2. **No Data Loading:**
   - Check browser network tab for API errors
   - Verify your internet connection
   - Check the API status at The Guardian's status page

3. **Cache Issues:**
   - Use the POST endpoint to force refresh
   - Restart your development server
   - Clear browser cache

## Testing Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit your news page:
   ```
   http://localhost:3000/news
   ```

3. Check the browser console for any errors

4. Test the API endpoint directly:
   ```
   http://localhost:3000/api/guardian-news
   ```

## Support

If you encounter issues:
- Check The Guardian's API documentation: [https://open-platform.theguardian.com/documentation/](https://open-platform.theguardian.com/documentation/)
- Review your API usage in The Guardian developer dashboard
- Ensure your environment variables are properly configured
