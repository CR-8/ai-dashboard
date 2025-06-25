import { NextResponse } from 'next/server';

// Cache to store the news data
let newsCache = {
  data: null,
  lastFetched: null,
  isLoading: false
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function fetchGuardianNews() {
  const apiKey = process.env.GUARDIAN_API_KEY;
  
  if (!apiKey) {
    throw new Error('Guardian API key not configured');
  }

  // Build the API URL with comprehensive parameters
  const baseUrl = 'https://content.guardianapis.com/search';
  const params = new URLSearchParams({
    'api-key': apiKey,
    'show-fields': 'headline,byline,trailText,thumbnail,short-url,publication,bodyText',
    'show-tags': 'contributor',
    'show-elements': 'image',
    'page-size': '20',
    'order-by': 'newest',
    'section': 'world|technology|business|environment|science|uk-news|us-news',
    'format': 'json'
  });

  const response = await fetch(`${baseUrl}?${params}`, {
    headers: {
      'User-Agent': 'News-Dashboard/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Guardian API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.response.results;
}

function transformArticleData(articles) {
  return articles.map((article, index) => {
    // Determine article type based on position and content
    let type = 'compact';
    if (index === 0) {
      type = 'featured';
    } else if (index <= 4 && article.fields?.trailText?.length > 100) {
      type = 'standard';
    }

    // Extract author from contributor tags or byline field
    let byline = 'Staff Reporter';
    if (article.tags && article.tags.length > 0) {
      const contributor = article.tags.find(tag => tag.type === 'contributor');
      if (contributor) {
        byline = contributor.webTitle;
      }
    } else if (article.fields?.byline) {
      byline = article.fields.byline;
    }

    // Clean and format the section name
    const sectionMap = {
      'world': 'Environment',
      'technology': 'Technology',
      'business': 'Business',
      'environment': 'Environment',
      'science': 'Science',
      'uk-news': 'Politics',
      'us-news': 'Politics',
      'politics': 'Politics'
    };

    const section = sectionMap[article.sectionId] || 
                   article.sectionName?.split(' ').map(word => 
                     word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                   ).join(' ') || 'News';

    return {
      id: article.id || `article-${index}`,
      type,
      headline: article.webTitle || article.fields?.headline || 'Breaking News',
      abstract: article.fields?.trailText || article.fields?.bodyText?.substring(0, 200) + '...' || 'Latest news update from The Guardian.',
      section,
      byline,
      published_date: article.webPublicationDate || new Date().toISOString(),
      url: article.webUrl,
      thumbnail: article.fields?.thumbnail,
      shortUrl: article.fields?.shortUrl
    };
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const now = Date.now();
    
    // Check if we have valid cached data
    if (newsCache.data && 
        newsCache.lastFetched && 
        (now - newsCache.lastFetched) < CACHE_DURATION) {
      
      let data = newsCache.data;
      
      // Filter by category if specified
      if (category && category !== 'ALL') {
        data = newsCache.data.filter(article => 
          article.section.toUpperCase() === category.toUpperCase()
        );
      }
      
      return NextResponse.json({
        success: true,
        data: data,
        cached: true,
        lastFetched: newsCache.lastFetched,
        nextUpdate: newsCache.lastFetched + CACHE_DURATION,
        category: category || 'ALL'
      });
    }

    // Prevent multiple simultaneous fetches
    if (newsCache.isLoading) {
      return NextResponse.json({
        success: true,
        data: newsCache.data || [],
        cached: true,
        loading: true,
        message: 'Update in progress, returning cached data'
      });
    }

    // Mark as loading
    newsCache.isLoading = true;

    try {
      // Fetch fresh data from Guardian API
      const articles = await fetchGuardianNews();
      const transformedArticles = transformArticleData(articles);      // Update cache
      newsCache.data = transformedArticles;
      newsCache.lastFetched = now;
      newsCache.isLoading = false;

      let data = transformedArticles;
      
      // Filter by category if specified
      if (category && category !== 'ALL') {
        data = transformedArticles.filter(article => 
          article.section.toUpperCase() === category.toUpperCase()
        );
      }

      return NextResponse.json({
        success: true,
        data: data,
        cached: false,
        lastFetched: now,
        nextUpdate: now + CACHE_DURATION,
        totalArticles: transformedArticles.length,
        filteredArticles: data.length,
        category: category || 'ALL'
      });

    } catch (fetchError) {
      newsCache.isLoading = false;
      
      // If we have cached data, return it with error info
      if (newsCache.data) {
        return NextResponse.json({
          success: true,
          data: newsCache.data,
          cached: true,
          error: 'Failed to fetch fresh data, returning cached results',
          lastFetched: newsCache.lastFetched
        });
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('Guardian News API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      data: [],
      fallback: true
    }, { status: 500 });
  }
}

// Optional: Add a POST endpoint to manually refresh the cache
export async function POST() {
  try {
    // Force refresh by clearing cache
    newsCache.data = null;
    newsCache.lastFetched = null;
    newsCache.isLoading = false;

    // Fetch fresh data
    const articles = await fetchGuardianNews();
    const transformedArticles = transformArticleData(articles);

    // Update cache
    newsCache.data = transformedArticles;
    newsCache.lastFetched = Date.now();

    return NextResponse.json({
      success: true,
      message: 'Cache refreshed successfully',
      data: transformedArticles,
      totalArticles: transformedArticles.length
    });

  } catch (error) {
    console.error('Force refresh error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
