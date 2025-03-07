import React, { useState, useEffect } from 'react';
import { getCryptosList } from '../services/cryptoApi';
import CryptoCard from '../components/CryptoCard';
import SearchBar from '../components/SearchBar';

const CryptocurrenciesPage: React.FC = () => {
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: 'market_cap_rank',
    direction: 'asc',
  });

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const data = await getCryptosList(100);
        setCryptos(data);
        setFilteredCryptos(data);
      } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  useEffect(() => {
    const filtered = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptos(filtered);
  }, [searchTerm, cryptos]);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedCryptos = [...filteredCryptos].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setFilteredCryptos(sortedCryptos);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cryptocurrencies</h1>
      
      <div className="mb-6">
        <div className="max-w-md">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Cryptocurrencies
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or symbol..."
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
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
        <>
          <div className="mb-4 overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('market_cap_rank')}
                  >
                    Rank {getSortIcon('market_cap_rank')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coin
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('current_price')}
                  >
                    Price {getSortIcon('current_price')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price_change_percentage_24h')}
                  >
                    24h Change {getSortIcon('price_change_percentage_24h')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort('market_cap')}
                  >
                    Market Cap {getSortIcon('market_cap')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort('total_volume')}
                  >
                    Volume (24h) {getSortIcon('total_volume')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCryptos.map((crypto) => (
                  <tr key={crypto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {crypto.market_cap_rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                          <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${crypto.current_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        crypto.price_change_percentage_24h >= 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      ${crypto.market_cap.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      ${crypto.total_volume.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Cryptocurrency Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCryptos.map((crypto) => (
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
        </>
      )}
    </div>
  );
};

export default CryptocurrenciesPage;