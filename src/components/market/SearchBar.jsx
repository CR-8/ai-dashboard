import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  onSuggestionSelect, 
  placeholder = "Search stocks, ETFs, indices, or companies...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchTerm.length > 1) {
        setLoading(true);
        try {
          const response = await fetch(`/api/market/search?q=${encodeURIComponent(searchTerm)}`);
          const data = await response.json();
          if (data.success) {
            setSuggestions(data.data);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch && onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.symbol);
    setShowSuggestions(false);
    onSuggestionSelect && onSuggestionSelect(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-500" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        className="pl-10 pr-12 py-2 w-full bg-black border-gray-800 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-0 rounded-lg text-sm transition-all font-mono"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <kbd className="px-2 py-1 text-xs font-mono text-gray-200 bg-gray-800 border border-gray-700 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-gray-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
              <span className="text-sm font-mono">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.symbol}-${index}`}
                className="p-3 hover:bg-gray-900 cursor-pointer border-b border-gray-800 last:border-b-0 transition-colors font-mono"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white text-sm">
                      {suggestion.symbol}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {suggestion.name}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-bold text-white">
                      ${suggestion.price?.toFixed(2)}
                    </p>
                    {suggestion.exchange && (
                      <p className="text-xs text-gray-500">
                        {suggestion.exchange}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : searchTerm.length > 1 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm font-mono">No results for "{searchTerm}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
