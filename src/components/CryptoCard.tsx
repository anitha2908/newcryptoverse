import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoCardProps {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  change24h: number;
  image: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  id,
  rank,
  name,
  symbol,
  price,
  marketCap,
  change24h,
  image,
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: num > 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Link to={`/crypto/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <img src={image} alt={name} className="w-8 h-8 mr-2" />
              <div>
                <h3 className="font-semibold text-gray-800">{name}</h3>
                <p className="text-sm text-gray-500">{symbol.toUpperCase()}</p>
              </div>
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
              Rank #{rank}
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-lg font-bold text-gray-800">{formatNumber(price)}</p>
            <div className="flex items-center mt-1">
              <div className={`flex items-center ${change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change24h >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(change24h).toFixed(2)}%</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">24h</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Market Cap</p>
            <p className="text-sm font-medium text-gray-700">{formatNumber(marketCap)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;