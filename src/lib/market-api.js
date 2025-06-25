// Market API utilities
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://yourdomain.com' 
  : 'http://localhost:3000';

export const marketAPI = {
  // Fetch market indices (S&P 500, Dow Jones, etc.)
  async getMarketIndices() {
    try {
      const response = await fetch(`${BASE_URL}/api/market/indices`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error fetching market indices:', error);
      throw error;
    }
  },

  // Fetch stocks by type (trending, gainers, losers)
  async getStocks(type = 'trending') {
    try {
      const response = await fetch(`${BASE_URL}/api/market/stocks?type=${type}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error;
    }
  },

  // Fetch market statistics
  async getMarketStats() {
    try {
      const response = await fetch(`${BASE_URL}/api/market/stats`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error fetching market stats:', error);
      throw error;
    }
  },

  // Fetch sector performance
  async getSectors() {
    try {
      const response = await fetch(`${BASE_URL}/api/market/sectors`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error fetching sectors:', error);
      throw error;
    }
  },

  // Search stocks
  async searchStocks(query) {
    try {
      const response = await fetch(`${BASE_URL}/api/market/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  }
};

// Utility functions for formatting
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value) => {
  const formatted = Math.abs(value).toFixed(2);
  return `${value >= 0 ? '+' : '-'}${formatted}%`;
};

export const formatCompactNumber = (value) => {
  if (value >= 1e12) return (value / 1e12).toFixed(1) + 'T';
  if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
  return value.toString();
};

// Watchlist management (using localStorage for now)
export const watchlistManager = {
  getWatchlist() {
    if (typeof window === 'undefined') return [];
    try {
      const watchlist = localStorage.getItem('marketWatchlist');
      return watchlist ? JSON.parse(watchlist) : [];
    } catch (error) {
      console.error('Error loading watchlist:', error);
      return [];
    }
  },

  addToWatchlist(stock) {
    if (typeof window === 'undefined') return;
    try {
      const watchlist = this.getWatchlist();
      if (!watchlist.find(item => item.symbol === stock.symbol)) {
        watchlist.push(stock);
        localStorage.setItem('marketWatchlist', JSON.stringify(watchlist));
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  },

  removeFromWatchlist(symbol) {
    if (typeof window === 'undefined') return;
    try {
      const watchlist = this.getWatchlist();
      const filtered = watchlist.filter(item => item.symbol !== symbol);
      localStorage.setItem('marketWatchlist', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  },

  isInWatchlist(symbol) {
    const watchlist = this.getWatchlist();
    return watchlist.some(item => item.symbol === symbol);
  }
};
