import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MarketCard = ({ 
  index, 
  formatCurrency, 
  formatPercentage, 
  getChangeColor, 
  getChangeIcon, 
  getBgChangeColor,
  onClick,
  isActive = false
}) => {
  return (
    <Card 
      className={`bg-black border-gray-800 transition-all cursor-pointer group font-mono ${isActive ? 'ring-2 ring-white/40 bg-zinc-900/35' : ''}`}
      onClick={() => onClick && onClick(index)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">
                {index.symbol}
              </h3>
              <p className="text-xs text-gray-500">{index.ticker}</p>
            </div>
            <Badge 
              variant="secondary" 
              className={`text-xs font-medium ${
                index.change >= 0 
                  ? 'bg-green-500/10 text-green-400 border-0' 
                  : 'bg-red-500/10 text-red-400 border-0'
              }`}
            >
              {index.change >= 0 ? '+' : ''}{formatPercentage(index.changePercent)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-xl font-bold text-white">
              {formatCurrency(index.price)}
            </p>
            
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(index.change)}`}>
              {getChangeIcon(index.change)}
              <span className="font-medium">
                {index.change >= 0 ? '+' : ''}{index.change?.toFixed(2)}
              </span>
            </div>
          </div>

          {(index.high || index.low) && (
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-800">
              <div className="flex justify-between">
                <span>H: {formatCurrency(index.high)}</span>
                <span>L: {formatCurrency(index.low)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCard;
