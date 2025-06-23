// Simple in-memory cache for API responses
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.rateLimits = new Map();
  }

  // Generate cache key
  generateKey(source, symbol, endpoint) {
    return `${source}_${symbol}_${endpoint}`;
  }

  // Check if data is cached and fresh
  get(source, symbol, endpoint, maxAge = 5 * 60 * 1000) { // 5 minutes default
    const key = this.generateKey(source, symbol, endpoint);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    console.log(`Cache HIT for ${key} (age: ${Math.round(age/1000)}s)`);
    return cached.data;
  }

  // Store data in cache
  set(source, symbol, endpoint, data) {
    const key = this.generateKey(source, symbol, endpoint);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`Cache SET for ${key}`);
  }

  // Rate limiting check
  canMakeRequest(source, limit = 60, window = 60000) { // Default: 60 requests per minute
    const now = Date.now();
    const windowStart = now - window;
    
    if (!this.rateLimits.has(source)) {
      this.rateLimits.set(source, []);
    }
    
    const requests = this.rateLimits.get(source);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => time > windowStart);
    this.rateLimits.set(source, recentRequests);
    
    if (recentRequests.length >= limit) {
      console.warn(`Rate limit exceeded for ${source}: ${recentRequests.length}/${limit}`);
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    return true;
  }

  // Get cache statistics
  getStats() {
    const stats = {
      totalEntries: this.cache.size,
      rateLimitTracking: {},
      cacheEntries: []
    };
    
    // Rate limit stats
    for (const [source, requests] of this.rateLimits.entries()) {
      const recentRequests = requests.filter(time => time > Date.now() - 60000);
      stats.rateLimitTracking[source] = {
        requestsLastMinute: recentRequests.length,
        totalTracked: requests.length
      };
    }
    
    // Cache entries
    for (const [key, value] of this.cache.entries()) {
      stats.cacheEntries.push({
        key,
        age: Math.round((Date.now() - value.timestamp) / 1000),
        size: JSON.stringify(value.data).length
      });
    }
    
    return stats;
  }

  // Clear old cache entries
  cleanup(maxAge = 30 * 60 * 1000) { // 30 minutes
    const now = Date.now();
    let removed = 0;
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} entries`);
    }
  }
}

// Global cache instance
const globalCache = new CacheManager();

// Cleanup every 10 minutes
setInterval(() => {
  globalCache.cleanup();
}, 10 * 60 * 1000);

export default globalCache;
