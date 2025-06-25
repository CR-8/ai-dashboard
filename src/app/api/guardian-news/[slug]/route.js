import { NextResponse } from 'next/server';

// Function to format plain text into HTML paragraphs
function formatPlainTextToHTML(text) {
    if (!text) return '';
    
    // Split by double line breaks first (paragraph breaks)
    let paragraphs = text.split(/\n\s*\n/);
    
    // If no double line breaks, split by sentence endings followed by space and capital letter
    if (paragraphs.length === 1) {
        paragraphs = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
    }
    
    // Group sentences into reasonable paragraph sizes (3-5 sentences each)
    const formattedParagraphs = [];
    let currentParagraph = [];
    
    paragraphs.forEach((para, index) => {
        const sentences = para.split(/(?<=[.!?])\s+/);
        
        sentences.forEach(sentence => {
            if (sentence.trim()) {
                currentParagraph.push(sentence.trim());
                
                // Create new paragraph every 3-4 sentences or if we hit certain patterns
                if (currentParagraph.length >= 3 && (
                    sentence.includes('. ') || 
                    sentence.includes('? ') || 
                    sentence.includes('! ') ||
                    currentParagraph.length >= 5
                )) {
                    formattedParagraphs.push(currentParagraph.join(' '));
                    currentParagraph = [];
                }
            }
        });
        
        // Force paragraph break at natural breaks
        if (currentParagraph.length > 0 && (
            para.includes('Meanwhile') || 
            para.includes('In other news') ||
            para.includes('Earlier') ||
            para.includes('Going back to') ||
            index === paragraphs.length - 1
        )) {
            formattedParagraphs.push(currentParagraph.join(' '));
            currentParagraph = [];
        }
    });
    
    // Add any remaining sentences
    if (currentParagraph.length > 0) {
        formattedParagraphs.push(currentParagraph.join(' '));
    }
    
    // Convert to HTML paragraphs
    return formattedParagraphs
        .filter(p => p.trim().length > 20) // Filter out very short paragraphs
        .map(p => `<p>${p.trim()}</p>`)
        .join('\n\n');
}

export async function GET(request, context) {
    try {
        // Await params as required by Next.js 15
        const { params } = await context;
        const { slug } = params;
        
        // Decode the slug to get the original article ID
        const decodedSlug = decodeURIComponent(slug);
        
        const apiKey = process.env.GUARDIAN_API_KEY;
        
        if (!apiKey) {
            throw new Error('Guardian API key not configured');
        }

        // First, try to get the article by its ID directly from Guardian API
        let articleData = null;
        
        // If slug looks like a Guardian ID (contains forward slashes or is a Guardian path)
        if (decodedSlug.includes('/') || decodedSlug.length > 10) {
            try {
                // Clean the slug to ensure it's a valid Guardian content ID
                let contentId = decodedSlug;
                
                // If it doesn't start with a section, it might be a full Guardian ID
                if (!contentId.includes('/')) {
                    // Try as a direct ID first
                } else {
                    // Ensure it's properly formatted for Guardian API
                    if (!contentId.startsWith('http')) {
                        contentId = decodedSlug;
                    }
                }

                const directUrl = `https://content.guardianapis.com/${contentId}`;
                const searchParams = new URLSearchParams({
                    'api-key': apiKey,
                    'show-fields': 'headline,byline,trailText,thumbnail,short-url,publication,bodyText,standfirst,wordcount',
                    'show-tags': 'contributor,keyword,tone',
                    'show-elements': 'image',
                    'format': 'json'
                });

                const directResponse = await fetch(`${directUrl}?${searchParams}`, {
                    headers: {
                        'User-Agent': 'News-Dashboard/1.0'
                    }
                });

                if (directResponse.ok) {
                    const directData = await directResponse.json();
                    if (directData.response && directData.response.content) {
                        articleData = directData.response.content;
                    }
                }
            } catch (directError) {
                console.log('Direct fetch failed, falling back to search:', directError.message);
            }
        }

        // If direct fetch failed, fall back to getting from our cached articles
        if (!articleData) {
            // Get all articles from our cache
            const allArticlesResponse = await fetch(`${request.nextUrl.origin}/api/guardian-news`);
            const allArticlesResult = await allArticlesResponse.json();

            if (allArticlesResult.success && allArticlesResult.data) {
                articleData = allArticlesResult.data.find(
                    article => article.id === decodedSlug || 
                                        article.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-') === decodedSlug
                );
            }
        }

        if (!articleData) {
            return NextResponse.json({
                success: false,
                error: 'Article not found'
            }, { status: 404 });
        }        // If we got data from Guardian API directly, transform it
        if (articleData.webTitle) {
            // Extract images from elements
            const images = [];
            if (articleData.elements) {
                articleData.elements.forEach(element => {
                    if (element.type === 'image' && element.assets) {
                        // Get the largest available image
                        const sortedAssets = element.assets.sort((a, b) => (b.width || 0) - (a.width || 0));
                        if (sortedAssets.length > 0) {
                            images.push({
                                url: sortedAssets[0].file,
                                width: sortedAssets[0].width,
                                height: sortedAssets[0].height,
                                caption: element.caption || '',
                                credit: element.credit || '',
                                relation: element.relation || 'main'
                            });
                        }
                    }
                });
            }

            // Transform Guardian API response to our format
            const transformedArticle = {
                id: articleData.id,
                headline: articleData.webTitle || articleData.fields?.headline,
                abstract: articleData.fields?.trailText || articleData.fields?.standfirst,
                bodyText: articleData.fields?.bodyText ? formatPlainTextToHTML(articleData.fields.bodyText) : null,
                section: articleData.sectionName || 'News',
                byline: articleData.fields?.byline || 'Staff Reporter',
                published_date: articleData.webPublicationDate,
                url: articleData.webUrl,
                thumbnail: articleData.fields?.thumbnail,
                shortUrl: articleData.fields?.shortUrl,
                wordcount: articleData.fields?.wordcount,
                tags: articleData.tags || [],
                images: images
            };

            return NextResponse.json({
                success: true,
                data: transformedArticle,
                source: 'guardian-api'
            });
        }

        // Return cached article data
        return NextResponse.json({
            success: true,
            data: articleData,
            source: 'cache'
        });

    } catch (error) {
        console.error('Article fetch error:', error);
        
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
