import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const StockRow = ({ 
  stock, 
  formatCurrency, 
  formatPercentage, 
  getChangeColor, 
  getChangeIcon,
  onWatchlistToggle,
  onStockClick,
  isInWatchlist = false
}) => {
  return (
    <div 
      className="flex items-center justify-between p-4 hover:bg-gray-800/30 transition-all cursor-pointer group font-mono"
      onClick={() => onStockClick && onStockClick(stock)}
    >
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-auto hover:bg-gray-700/50 transition-colors flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onWatchlistToggle && onWatchlistToggle(stock);
          }}
        >
          <Star 
            className={`w-3 h-3 transition-colors ${
              isInWatchlist 
                ? 'text-white fill-white' 
                : 'text-gray-600 hover:text-gray-400'
            }`} 
          />
        </Button>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <p className="font-bold text-sm text-white">
              {stock.symbol}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {stock.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6 flex-shrink-0">
        <div className="text-right">
          <p className="text-sm font-bold text-white">
            {formatCurrency(stock.price)}
          </p>
          <div className={`flex items-center justify-end gap-1 text-xs font-medium ${getChangeColor(stock.change)}`}>
            {getChangeIcon(stock.change)}
            <span>{formatPercentage(stock.changePercent)}</span>
          </div>
        </div>

        {(stock.marketCap || stock.volume) && (
          <div className="text-right text-xs text-gray-500 min-w-16">
            {stock.marketCap && <p className="font-medium">{stock.marketCap}</p>}
            {stock.volume && <p>{stock.volume}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockRow;
