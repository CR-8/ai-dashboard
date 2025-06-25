"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ExternalLink, Tag, User, Calendar, TrendingUp, Globe, Zap } from 'lucide-react';

const News = () => {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Fetch news data from API
  const fetchNews = async () => {
    try {
      setError(null);
      const response = await fetch('/api/guardian-news');
      const result = await response.json();      if (result.success) {
        setArticles(result.data);
        setLastUpdated(result.lastFetched);
        setNextUpdate(result.nextUpdate);
      } else {
        setError(result.error || 'Failed to fetch news');
        // Keep existing articles if available
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Filter articles based on selected category
  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article => 
        article.section.toUpperCase() === selectedCategory
      );
      setFilteredArticles(filtered);
    }
  }, [articles, selectedCategory]);
  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Optionally refetch with category filter for better performance
    // fetchNews(category);
  };

  // Initial fetch
  useEffect(() => {
    fetchNews();
  }, []);

  // Set up auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNews();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
  };  // Handle article click to navigate to article page
  const handleArticleClick = (article) => {
    // Encode the full article ID to handle slashes and special characters
    const encodedSlug = encodeURIComponent(article.id);
    router.push(`/news/${encodedSlug}`);
  };

  // Handle external link (for "Read Original" buttons)
  const handleExternalLink = (article, e) => {
    e.stopPropagation(); // Prevent triggering the article click
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-2 w-32 bg-white/10 rounded animate-pulse mx-auto"></div>
          <div className="text-white/60 font-mono text-sm tracking-wide">Loading latest news...</div>
          <div className="text-white/30 font-mono text-xs tracking-wider">Fetching from The Guardian</div>
        </div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 text-center max-w-md">
          <div className="text-white/60 font-mono text-sm tracking-wide">Unable to load news</div>
          <div className="text-white/40 font-mono text-xs tracking-wider">{error}</div>          <button 
            onClick={() => fetchNews()}
            className="border border-white/20 px-4 py-2 text-xs font-mono text-white hover:border-white/40 transition-colors tracking-wider"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }
  const featuredArticle = filteredArticles.find(article => article.type === 'featured');
  const standardArticles = filteredArticles.filter(article => article.type === 'standard');
  const compactArticles = filteredArticles.filter(article => article.type === 'compact');

  return (
    <div className="min-h-screen bg-black text-white">      
    {/* Professional Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-8xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-mono font-medium tracking-[0.2em] text-white">
            NEWS
          </h1>
          <div className="hidden md:flex items-center space-x-1 text-xs font-mono text-white/40 tracking-wider">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className='text-green-400'>LIVE</span>
          </div>
          {lastUpdated && (
            <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-white/60">
          <span>UPDATED :</span>
          <span>{formatDate(lastUpdated)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono text-white/60">
          <span className="tracking-wider">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }).toUpperCase()}</span>
          {error && (            <button 
              onClick={() => fetchNews()}
              className="border border-white/20 px-2 py-1 hover:border-white/40 transition-colors tracking-wider"
            >
          REFRESH
            </button>
          )}
        </div>
          </div>
          
        {/* Category Navigation */}
        <div className="pt-6 mt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <span className="text-xs font-mono text-white/40 tracking-widest">CATEGORIES</span>            <div className="flex items-center align-middle justify-center space-x-6">
          {['ALL', 'ENVIRONMENT', 'TECHNOLOGY', 'BUSINESS', 'SCIENCE', 'HEALTH', 'POLITICS'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`text-xs font-mono hover:cursor-pointer transition-colors tracking-widest relative group ${
                selectedCategory === category 
                  ? 'text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {category}
              <div className={`absolute bottom-[-4px] left-0 h-px bg-white transition-all duration-300 ${
                selectedCategory === category ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></div>
            </button>
          ))}
            </div>
          </div>          <div className="flex items-center space-x-4 text-xs font-mono text-white/40">
            <span className="tracking-wider">{filteredArticles.length} ARTICLES</span>
            <div className="w-px h-4 bg-white/20"></div>
            <span className="tracking-wider">{selectedCategory === 'ALL' ? 'ALL CATEGORIES' : selectedCategory}</span>
            <div className="w-px h-4 bg-white/20"></div>
            <span className="tracking-wider">THE GUARDIAN</span>
          </div>
        </div>
        </div>
        </div>
      </header>      {/* Main Content with Professional Bento Grid */}
      <main className="max-w-8xl mx-auto px-6 py-12">
        {filteredArticles.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="text-white/60 font-mono text-lg tracking-wide">
                No articles found in {selectedCategory.toLowerCase()} category
              </div>
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="border border-white/20 px-4 py-2 text-xs font-mono text-white hover:border-white/40 transition-colors tracking-wider"
              >
                VIEW ALL ARTICLES
              </button>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-12 gap-6">
            {/* Hero Featured Article */}
          {featuredArticle && (
            <article className="col-span-12 lg:col-span-8 group cursor-pointer" onClick={() => handleArticleClick(featuredArticle)}>
              <div className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 p-8 h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    {React.createElement(getSectionIcon(featuredArticle.section), { 
                      className: "w-4 h-4 text-white/60" 
                    })}
                    <span className="text-xs font-mono text-white/60 tracking-widest">
                      {featuredArticle.section.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center text-xs font-mono text-white/40">
                    <Clock className="w-3 h-3 mr-2" />
                    {formatDate(featuredArticle.published_date)}
                  </div>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-mono font-light mb-6 leading-[1.1] text-white group-hover:text-white/90 transition-colors">
                  {featuredArticle.headline}
                </h2>
                
                <p className="text-white/70 font-mono mb-8 text-lg leading-relaxed max-w-3xl">
                  {featuredArticle.abstract}
                </p>
                  <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-mono text-white/50">
                    <User className="w-4 h-4 mr-2" />
                    <span className="tracking-wide">{featuredArticle.byline}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleArticleClick(featuredArticle)}
                      className="flex items-center text-sm font-mono text-white hover:text-white/70 transition-colors border border-white/20 px-4 py-2 hover:border-white/40"
                    >
                      <span className="tracking-wide hover:cursor-pointer">READ ARTICLE</span>
                      <User className="w-4 h-4 ml-3" />
                    </button>
                    <button 
                      onClick={(e) => handleExternalLink(featuredArticle, e)}
                      className="flex items-center text-sm font-mono text-white/60 hover:text-white hover:cursor-pointer transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Breaking News Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="border border-white/10 bg-white/[0.02] h-full">
              <div className="p-6">
                <h3 className="text-lg font-mono font-medium mb-8 tracking-[0.15em] text-white border-b border-white/10 pb-4">
                  BREAKING
                </h3>
                <div className="space-y-6">                  
                  {compactArticles.slice(0, 3).map((article, index) => (
                    <div key={article.id} className="group cursor-pointer" onClick={() => handleArticleClick(article)}>
                      <div className="border-l-2 border-white/20 pl-4 hover:border-white/60 transition-colors duration-200">
                        <div className="flex items-center space-x-2 mb-3">
                          {React.createElement(getSectionIcon(article.section), { 
                            className: "w-3 h-3 text-white/40" 
                          })}
                          <span className="text-xs font-mono text-white/40 tracking-widest">
                            {article.section.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-mono font-light text-sm mb-3 leading-tight text-white/90 group-hover:text-white transition-colors">
                          {article.headline}
                        </h4>
                        <div className="flex items-center text-xs font-mono text-white/30">
                          <Clock className="w-3 h-3 mr-2" />
                          <span className="tracking-wide">{formatDate(article.published_date)}</span>
                        </div>
                      </div>
                      {index < 2 && <div className="w-full h-px bg-white/10 mt-6"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>          
          {/* Standard Articles Grid */}
          {standardArticles.map((article, index) => (
            <article key={article.id} className="col-span-12 md:col-span-6 lg:col-span-4 group cursor-pointer" onClick={() => handleArticleClick(article)}>
              <div className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 p-6 h-full">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center space-x-2">
                    {React.createElement(getSectionIcon(article.section), { 
                      className: "w-3 h-3 text-white/50" 
                    })}
                    <span className="text-xs font-mono text-white/50 tracking-widest">
                      {article.section.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-px h-3 bg-white/20"></div>
                  <div className="flex items-center text-xs font-mono text-white/30">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="tracking-wide">{formatDate(article.published_date)}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-mono font-light mb-4 leading-tight text-white/90 group-hover:text-white transition-colors">
                  {article.headline}
                </h3>
                
                <p className="text-white/60 font-mono text-sm mb-6 leading-relaxed">
                  {article.abstract}
                </p>
                  <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs font-mono text-white/40">
                    <User className="w-3 h-3 mr-2" />
                    <span className="tracking-wide">{article.byline}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleArticleClick(article)}
                      className="flex items-center text-xs font-mono text-white/60 hover:text-white transition-colors"
                    >
                      <span className="tracking-wider hover:cursor-pointer">READ</span>
                    </button>
                    <button 
                      onClick={(e) => handleExternalLink(article, e)}
                      className="flex items-center hover:cursor-pointer text-xs font-mono text-white/40 hover:text-white/60 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* More Headlines Section */}
          <section className="col-span-12">
            <div className="border border-white/10 bg-white/[0.02]">
              <div className="p-8">
                <h3 className="text-lg font-mono font-medium mb-8 tracking-[0.15em] text-white border-b border-white/10 pb-4">
                  MORE HEADLINES
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">                  
                  {compactArticles.slice(3).map((article, index) => (
                    <div 
                      key={article.id} 
                      className="border border-white/[0.08] hover:border-white/20 transition-colors duration-200 p-5 group cursor-pointer"
                      onClick={() => handleArticleClick(article)}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        {React.createElement(getSectionIcon(article.section), { 
                          className: "w-3 h-3 text-white/40" 
                        })}
                        <span className="text-xs font-mono text-white/40 tracking-widest">
                          {article.section.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-mono font-light text-sm mb-4 leading-tight text-white/80 group-hover:text-white transition-colors">
                        {article.headline}
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs font-mono text-white/30">
                          <User className="w-3 h-3 mr-2" />
                          <span className="tracking-wide">{article.byline}</span>
                        </div>
                        <div className="flex items-center text-xs font-mono text-white/30">
                          <Clock className="w-3 h-3 mr-2" />
                          <span className="tracking-wide">{formatDate(article.published_date)}</span>
                        </div>
                      </div>                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
        )}
      </main>
    </div>
  );
};

export default News;