import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Search, BarChart2 } from 'lucide-react';
import { getCryptosList } from '../services/cryptoApi';
import CryptoCard from '../components/CryptoCard';
import SearchBar from '../components/SearchBar';

const HomePage: React.FC = () => {
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCryptos = async () => {
      try {
        const data = await getCryptosList(10);
        setCryptos(data);
      } catch (error) {
        console.error('Error fetching top cryptocurrencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCryptos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Cryptoverse Dashboard
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Track and analyze cryptocurrency prices, market trends, and historical data over the past five years.
        </p>
        <div className="mt-8 flex justify-center">
          <SearchBar />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center mb-4">
            <BarChart2 className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">Track Prices</h2>
          </div>
          <p className="mb-4">Monitor real-time cryptocurrency prices and market movements with interactive charts.</p>
          <Link to="/cryptocurrencies" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
            View All Cryptocurrencies
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">Analyze Trends</h2>
          </div>
          <p className="mb-4">Explore historical price data and market trends over the past five years.</p>
          <Link to="/cryptocurrencies" className="inline-block bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors">
            Analyze Trends
          </Link>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center mb-4">
            <Search className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">Compare Cryptos</h2>
          </div>
          <p className="mb-4">Compare different cryptocurrencies side by side to make informed investment decisions.</p>
          <Link to="/compare" className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors">
            Compare Cryptocurrencies
          </Link>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Top Cryptocurrencies</h2>
          <Link to="/cryptocurrencies" className="text-blue-600 hover:text-blue-800 font-medium">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 h-48 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cryptos.map((crypto) => (
              <CryptoCard
                key={crypto.id}
                id={crypto.id}
                rank={crypto.market_cap_rank}
                name={crypto.name}
                symbol={crypto.symbol}
                price={crypto.current_price}
                marketCap={crypto.market_cap}
                change24h={crypto.price_change_percentage_24h}
                image={crypto.image}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Use Cryptoverse?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Comprehensive Data</h3>
            <p className="text-gray-600">Access detailed historical price data for all major cryptocurrencies over the past five years.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Charts</h3>
            <p className="text-gray-600">Visualize price trends and market movements with our interactive and responsive charts.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Comparison Tools</h3>
            <p className="text-gray-600">Compare multiple cryptocurrencies side by side to identify investment opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;