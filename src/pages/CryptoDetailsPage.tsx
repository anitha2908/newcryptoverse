import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DollarSign, TrendingUp, BarChart2, Activity, Clock, Award } from 'lucide-react';
import { getCryptoDetails, getCryptoHistory } from '../services/cryptoApi';
import LineChart from '../components/LineChart';
import CryptoStats from '../components/CryptoStats';
import TimeframeSelector from '../components/TimeframeSelector';

const CryptoDetailsPage: React.FC = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const [cryptoDetails, setCryptoDetails] = useState<any>(null);
  const [cryptoHistory, setCryptoHistory] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      if (!coinId) return;
      
      setLoading(true);
      try {
        const details = await getCryptoDetails(coinId);
        setCryptoDetails(details);
        
        // Convert timeframe to days for API
        let days = 7;
        switch (timeframe) {
          case '1d': days = 1; break;
          case '7d': days = 7; break;
          case '30d': days = 30; break;
          case '1y': days = 365; break;
          case '5y': days = 1825; break;
          default: days = 7;
        }
        
        const history = await getCryptoHistory(coinId, days);
        setCryptoHistory(history);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, [coinId, timeframe]);

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  if (loading || !cryptoDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Format stats for the CryptoStats component
  const generalStats = [
    { 
      name: 'Rank', 
      value: cryptoDetails.market_cap_rank, 
      icon: <Award className="h-5 w-5" /> 
    },
    { 
      name: 'Current Price', 
      value: `$${cryptoDetails.market_data.current_price.usd.toLocaleString()}`, 
      icon: <DollarSign className="h-5 w-5" /> 
    },
    { 
      name: 'Market Cap', 
      value: `$${cryptoDetails.market_data.market_cap.usd.toLocaleString()}`, 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
    { 
      name: '24h Trading Volume', 
      value: `$${cryptoDetails.market_data.total_volume.usd.toLocaleString()}`, 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: 'All-Time High', 
      value: `$${cryptoDetails.market_data.ath.usd.toLocaleString()}`, 
      icon: <TrendingUp className="h-5 w-5" /> 
    },
    { 
      name: 'ATH Date', 
      value: new Date(cryptoDetails.market_data.ath_date.usd).toLocaleDateString(), 
      icon: <Clock className="h-5 w-5" /> 
    },
  ];

  const additionalStats = [
    { 
      name: 'Price Change (24h)', 
      value: `${cryptoDetails.market_data.price_change_percentage_24h.toFixed(2)}%`, 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: 'Price Change (7d)', 
      value: `${cryptoDetails.market_data.price_change_percentage_7d.toFixed(2)}%`, 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: 'Price Change (30d)', 
      value: `${cryptoDetails.market_data.price_change_percentage_30d.toFixed(2)}%`, 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: 'Price Change (1y)', 
      value: `${cryptoDetails.market_data.price_change_percentage_1y?.toFixed(2) || 'N/A'}%`, 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: 'Circulating Supply', 
      value: cryptoDetails.market_data.circulating_supply.toLocaleString(), 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
    { 
      name: 'Total Supply', 
      value: cryptoDetails.market_data.total_supply ? cryptoDetails.market_data.total_supply.toLocaleString() : 'N/A', 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <img 
            src={cryptoDetails.image.large} 
            alt={cryptoDetails.name} 
            className="w-12 h-12 mr-4"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{cryptoDetails.name}</h1>
            <p className="text-gray-500">{cryptoDetails.symbol.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-2xl font-bold text-gray-800">
            ${cryptoDetails.market_data.current_price.usd.toLocaleString()}
          </p>
          <p className={`flex items-center ${
            cryptoDetails.market_data.price_change_percentage_24h >= 0 
              ? 'text-green-500' 
              : 'text-red-500'
          }`}>
            <span>
              {cryptoDetails.market_data.price_change_percentage_24h >= 0 ? '+' : ''}
              {cryptoDetails.market_data.price_change_percentage_24h.toFixed(2)}%
            </span>
            <span className="text-gray-500 ml-1">(24h)</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <TimeframeSelector activeTimeframe={timeframe} onChange={handleTimeframeChange} />
        {cryptoHistory ? (
          <LineChart 
            coinHistory={cryptoHistory} 
            currentPrice={cryptoDetails.market_data.current_price.usd.toLocaleString()} 
            coinName={cryptoDetails.name}
            timeframe={timeframe}
          />
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Loading chart data...</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CryptoStats stats={generalStats} title="General Statistics" />
        <CryptoStats stats={additionalStats} title="Additional Statistics" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About {cryptoDetails.name}</h2>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: cryptoDetails.description.en }}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cryptoDetails.links.homepage[0] && (
            <a 
              href={cryptoDetails.links.homepage[0]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <span className="font-medium text-blue-600">Official Website</span>
            </a>
          )}
          {cryptoDetails.links.blockchain_site.slice(0, 3).map((site: string, index: number) => (
            site && (
              <a 
                key={index}
                href={site} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <span className="font-medium text-blue-600">Blockchain Explorer {index + 1}</span>
              </a>
            )
          ))}
          {cryptoDetails.links.subreddit_url && (
            <a 
              href={cryptoDetails.links.subreddit_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <span className="font-medium text-blue-600">Reddit</span>
            </a>
          )}
          {cryptoDetails.links.repos_url.github.length > 0 && (
            <a 
              href={cryptoDetails.links.repos_url.github[0]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <span className="font-medium text-blue-600">GitHub</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoDetailsPage;