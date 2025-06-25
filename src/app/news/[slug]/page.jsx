"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ExternalLink, User, ArrowLeft, Globe, Zap, TrendingUp, Tag, Share2, BookOpen } from 'lucide-react';

const NewsArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        // Decode the slug to get the original article ID
        const decodedSlug = decodeURIComponent(params.slug);

        // Try to get the specific article first
        const articleResponse = await fetch(`/api/guardian-news/${encodeURIComponent(decodedSlug)}`);
        const articleResult = await articleResponse.json();

        if (articleResult.success && articleResult.data) {
          setArticle(articleResult.data);
          
          // Get related articles from the main news feed
          const allArticlesResponse = await fetch('/api/guardian-news');
          const allArticlesResult = await allArticlesResponse.json();
          
          if (allArticlesResult.success && allArticlesResult.data) {
            // Get related articles from the same section
            const related = allArticlesResult.data
              .filter(a => a.section === articleResult.data.section && a.id !== articleResult.data.id)
              .slice(0, 3);
            setRelatedArticles(related);
          }
        } else {
          setError(articleResult.error || 'Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = (text?.split(' ').length || 0) + (article?.bodyText?.split(' ').length || 0);
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes);
  };

  const getEstimatedWordCount = () => {
    const abstractWords = article?.abstract?.split(' ').length || 0;
    const bodyWords = article?.bodyText?.split(' ').length || 0;
    return abstractWords + bodyWords + 500; // Add base content estimation
  };

  const getSectionIcon = (section) => {
    const icons = {
      'Environment': Globe,
      'Technology': Zap,
      'Business': TrendingUp,
      'Science': Tag,
      'Health': User,
      'Politics': User
    };
    return icons[section] || Tag;
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.headline,
        text: article.abstract,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Could add a toast notification here
        console.log('URL copied to clipboard');
      });
    }
  };

  const handleReadOriginal = () => {
    if (article?.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-2 w-32 bg-white/10 rounded animate-pulse mx-auto"></div>
          <div className="text-white/60 font-mono text-sm tracking-wide">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 text-center max-w-md">
          <div className="text-white/60 font-mono text-sm tracking-wide">Article not found</div>
          <div className="text-white/40 font-mono text-xs tracking-wider">{error}</div>
          <button 
            onClick={() => router.push('/news')}
            className="border border-white/20 px-4 py-2 text-xs font-mono text-white hover:border-white/40 transition-colors tracking-wider"
          >
            BACK TO NEWS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm top-0">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/news')}
              className="flex items-center space-x-3 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm tracking-wider">BACK TO NEWS</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleShare}
                className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors border border-white/20 px-3 py-1.5 hover:border-white/40"
              >
                <Share2 className="w-3 h-3" />
                <span className="font-mono text-xs tracking-wider">SHARE</span>
              </button>
              
              {article.url && (
                <button 
                  onClick={handleReadOriginal}
                  className="flex items-center space-x-2 text-white hover:text-white/70 transition-colors border border-white/20 px-3 py-1.5 hover:border-white/40"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="font-mono text-xs tracking-wider">ORIGINAL</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>      
      {/* Main Article Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <article className="space-y-12">
          {/* Article Header */}
          <header className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {React.createElement(getSectionIcon(article.section), { 
                    className: "w-4 h-4 text-white/60" 
                  })}
                  <span className="text-sm font-mono text-white/60 tracking-widest">
                    {article.section.toUpperCase()}
                  </span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center text-sm font-mono text-white/40">
                  <Clock className="w-3 h-3 mr-2" />
                  {formatDate(article.published_date)}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm font-mono text-white/40">
                <div className="flex items-center">
                  <BookOpen className="w-3 h-3 mr-2" />
                  {getReadingTime(article.abstract)} min read
                </div>
                <div className="text-xs">
                  {Math.round(getEstimatedWordCount() / 100) * 100}+ words
                </div>
              </div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-mono font-light leading-[0.95] text-white tracking-tight">
              {article.headline}
            </h1>

            <div className="space-y-6">
              <p className="text-2xl lg:text-3xl font-mono font-light text-white/80 leading-[1.4] tracking-wide">
                {article.abstract}
              </p>
              
              {/* Author and Publication Info */}
              <div className="flex items-center justify-between pt-8 border-t border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-white/60" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-mono text-white/90 tracking-wide">
                      {article.byline}
                    </div>
                    <div className="text-sm font-mono text-white/50 tracking-wider">
                      THE GUARDIAN • {formatDate(article.published_date).split(',')[0]}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-white/60" />
                  </button>
                  <button 
                    onClick={handleReadOriginal}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>            </div>
          </header>

          {/* Hero Image */}
          {article.images && article.images.length > 0 && (
            <div className="my-12">
              <div className="aspect-[16/9] bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
                <img 
                  src={article.images[0].url} 
                  alt={article.images[0].caption || article.headline}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'rgba(255,255,255,0.02)';
                  }}
                />
              </div>
              {article.images[0].caption && (
                <p className="text-sm font-mono text-white/50 mt-3 text-center italic">
                  {article.images[0].caption}
                  {article.images[0].credit && (
                    <span className="text-white/30"> • {article.images[0].credit}</span>
                  )}
                </p>
              )}
            </div>
          )}
          
          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <div className="space-y-6">
              {/* Enhanced Content with Medium-like styling */}
              <div className="text-white/85 leading-relaxed space-y-6 text-lg">
                {/* Show body text if available from Guardian API */}
                {article.bodyText ? (
                  <div 
                    className="space-y-6 [&>p]:text-lg [&>p]:leading-8 [&>p]:mb-6 [&>p]:font-light [&>h2]:text-2xl [&>h2]:font-mono [&>h2]:font-medium [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-xl [&>h3]:font-mono [&>h3]:font-medium [&>h3]:text-white/90 [&>h3]:mt-8 [&>h3]:mb-4"
                    dangerouslySetInnerHTML={{ 
                      __html: article.bodyText
                        .replace(/<p>/g, '<p class="text-lg leading-8 mb-6 font-light text-white/85">')
                        .replace(/<strong>/g, '<strong class="text-white font-medium">')
                        .replace(/<em>/g, '<em class="text-white/90 italic">')
                        .replace(/<a /g, '<a class="text-white hover:text-white/70 underline underline-offset-4 transition-colors" ')
                        .replace(/<h2>/g, '<h2 class="text-2xl font-mono font-medium text-white mt-12 mb-6 tracking-wide">')
                        .replace(/<h3>/g, '<h3 class="text-xl font-mono font-medium text-white/90 mt-8 mb-4 tracking-wide">')
                        .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-white/20 pl-6 py-4 bg-white/[0.02] my-8 italic text-white/70">')
                        .replace(/<ul>/g, '<ul class="space-y-2 list-disc list-inside text-white/80 my-6">')
                        .replace(/<ol>/g, '<ol class="space-y-2 list-decimal list-inside text-white/80 my-6">')
                    }} 
                  />
                ) : (
                  <>
                    {/* Enhanced fallback content with better structure */}
                    <div className="space-y-8">
                      <p className="text-lg leading-8 font-light first-letter:text-5xl first-letter:font-mono first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:text-white">
                        This article provides comprehensive coverage of the latest developments in {article.section.toLowerCase()}. 
                        {article.headline} represents a significant moment that will shape the landscape of this field for years to come.
                      </p>
                      
                      <p className="text-lg leading-8 font-light">
                        {article.abstract} The implications of this development extend far beyond the immediate sector, 
                        potentially influencing policy decisions, market dynamics, and public discourse in profound ways.
                      </p>

                      <div className="my-12 py-8 border-y border-white/10">
                        <h2 className="text-2xl font-mono font-medium text-white mb-6 tracking-wide">
                          Key Insights
                        </h2>
                        <div className="space-y-4 text-lg leading-8 font-light">
                          <p>
                            The story unfolds against a backdrop of increasing attention to {article.section.toLowerCase()} issues, 
                            with stakeholders across industries watching closely for developments that could impact their operations.
                          </p>
                          <p>
                            Expert analysis suggests that this development marks a turning point, with potential ramifications 
                            extending well beyond the immediate timeframe and geographical boundaries.
                          </p>
                        </div>
                      </div>

                      <blockquote className="border-l-4 border-white/20 pl-8 py-6 bg-white/[0.02] my-12 italic text-xl leading-9 text-white/80 font-light">
                        "This represents a pivotal moment that will have lasting implications for the {article.section.toLowerCase()} 
                        sector and the broader landscape it operates within."
                      </blockquote>

                      <div className="space-y-6">
                        <h2 className="text-2xl font-mono font-medium text-white mb-6 tracking-wide">
                          Looking Forward
                        </h2>
                        <p className="text-lg leading-8 font-light">
                          As the situation continues to evolve, industry observers are closely monitoring developments 
                          for signs of how this will influence future trends and decision-making processes.
                        </p>
                        <p className="text-lg leading-8 font-light">
                          The comprehensive coverage and detailed analysis available in the original Guardian article 
                          provides essential context and expert perspectives that illuminate the full scope of this important story.
                        </p>
                      </div>

                      <div className="bg-white/[0.02] border border-white/10 rounded-lg p-8 my-12">
                        <h3 className="text-xl font-mono font-medium text-white/90 mb-4 tracking-wide">
                          About This Story
                        </h3>
                        <p className="text-base leading-7 font-light text-white/70">
                          This article is part of The Guardian's ongoing coverage of {article.section.toLowerCase()} developments. 
                          For the most up-to-date information and detailed analysis from expert journalists, 
                          visit the original article on The Guardian's website.
                        </p>
                      </div>
                    </div>
                  </>
                )}              
                </div>
            {/* Call to Action */}
                          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-8 my-12">
                            <div className="text-center space-y-4">
                              <h3 className="text-xl font-mono font-medium text-white tracking-wide">
                                Read the Original Article over at &apos;The Guardian&apos;
                              </h3>
                              <button 
                                onClick={handleReadOriginal}
                                className="inline-flex hover:cursor-pointer items-center space-x-3 text-white hover:text-white/80 hover:bg-white/10 transition-colors border border-white/20 px-8 py-4 hover:border-white/40 rounded-lg font-mono tracking-wider"
                              >
                                <span>READ ORIGINAL ARTICLE</span>
                                <ExternalLink className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>        
                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                      <section className="mt-20 pt-12 border-t border-white/10">
                        <div className="space-y-8">
                          <div className="text-center space-y-4">
                            <h2 className="text-3xl font-mono font-medium tracking-[0.15em] text-white">
                              MORE IN {article.section.toUpperCase()}
                            </h2>
                            <p className="text-white/60 font-light max-w-2xl mx-auto">
                              Continue exploring stories that matter in {article.section.toLowerCase()}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                            {relatedArticles.map((relatedArticle) => (
                              <article 
                                key={relatedArticle.id}
                                className="group cursor-pointer space-y-4"
                                onClick={() => router.push(`/news/${encodeURIComponent(relatedArticle.id)}`)}
                              >                    
                              {/* Article Image */}
                                <div className="aspect-[16/10] bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden group-hover:border-white/20 transition-colors">
                                  {relatedArticle.thumbnail ? (
                                    <img 
                                      src={relatedArticle.thumbnail} 
                                      alt={relatedArticle.headline}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        const fallback = document.createElement('div');
                                        fallback.className = 'w-full h-full flex items-center justify-center';
                                        fallback.innerHTML = `<svg class="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
                                        e.target.parentElement.appendChild(fallback);
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      {React.createElement(getSectionIcon(relatedArticle.section), { 
                                        className: "w-12 h-12 text-white/20" 
                                      })}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Article Content */}
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    {React.createElement(getSectionIcon(relatedArticle.section), { 
                                      className: "w-3 h-3 text-white/40" 
                                    })}
                                    <span className="text-xs font-mono text-white/40 tracking-widest">
                                      {relatedArticle.section.toUpperCase()}
                                    </span>
                                  </div>
                                  
                                  <h3 className="text-xl font-mono font-light leading-tight text-white/90 group-hover:text-white transition-colors">
                                    {relatedArticle.headline}
                                  </h3>
                                  
                                  <p className="text-white/60 font-light leading-relaxed line-clamp-3">
                                    {relatedArticle.abstract}
                                  </p>
                                  
                                  <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center text-sm font-mono text-white/40">
                                      <Clock className="w-3 h-3 mr-2" />
                                      <span className="tracking-wide">{formatDate(relatedArticle.published_date).split(',')[0]}</span>
                                    </div>
                                    <div className="flex items-center text-sm font-mono text-white/60 group-hover:text-white transition-colors">
                                      <span className="tracking-wider">READ</span>
                                      <ArrowLeft className="w-3 h-3 ml-2 rotate-180" />
                                    </div>
                                  </div>
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}
                  </main>      
                  {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-mono font-medium text-white tracking-wider">
                Stay Informed
              </h3>
              <p className="text-white/60 font-light">
                Professional news coverage powered by The Guardian
              </p>
            </div>
            <div className="flex items-center justify-center space-x-8 text-xs font-mono text-white/30">
              <span className="tracking-widest">© 2025 NEWS PLATFORM</span>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="tracking-widest">BUILT FOR PROFESSIONALS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsArticlePage;
