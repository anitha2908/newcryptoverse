import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchCryptos } from '../services/cryptoApi';
import SearchBar from '../components/SearchBar';

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
}

const SearchPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchCryptos(searchTerm);
        setResults(searchResults);
      } catch (error) {
        console.error('Error searching cryptocurrencies:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Update URL with search query
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('q', searchTerm);
    window.history.pushState({}, '', `${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Cryptocurrencies</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
                Search by name or symbol
              </label>
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bitcoin, BTC, Ethereum..."
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Coin</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Symbol</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rank</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full" src={result.thumb} alt={result.name} />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{result.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {result.symbol.toUpperCase()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {result.market_cap_rank ? `#${result.market_cap_rank}` : 'N/A'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link to={`/crypto/${result.id}`} className="text-blue-600 hover:text-blue-900">
                          View<span className="sr-only">, {result.name}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : searchTerm.trim().length > 1 ? (
          <div className="py-8 text-center">
            <p className="text-gray-600">No results found for "{searchTerm}"</p>
            <p className="mt-2 text-gray-500">Try a different search term or check the spelling</p>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-600">Enter a search term to find cryptocurrencies</p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Bitcoin', 'Ethereum', 'Cardano', 'Solana'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchTerm(term)}
                  className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Searches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/crypto/bitcoin" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <img src="https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png" alt="Bitcoin" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Bitcoin</p>
              <p className="text-sm text-gray-500">BTC</p>
            </div>
          </Link>
          <Link to="/crypto/ethereum" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <img src="https://assets.coingecko.com/coins/images/279/thumb/ethereum.png" alt="Ethereum" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Ethereum</p>
              <p className="text-sm text-gray-500">ETH</p>
            </div>
          </Link>
          <Link to="/crypto/ripple" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <img src="https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png" alt="XRP" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900">XRP</p>
              <p className="text-sm text-gray-500">XRP</p>
            </div>
          </Link>
          <Link to="/crypto/cardano" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <img src="https://assets.coingecko.com/coins/images/975/thumb/cardano.png" alt="Cardano" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Cardano</p>
              <p className="text-sm text-gray-500">ADA</p>
            </div>
          </Link>
          <Link to="/crypto/solana" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <img src="https://assets.coingecko.com/coins/images/4128/thumb/solana.png" alt="Solana" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Solana</p>
              <p className="text-sm text-gray-500">SOL</p>
            </div>
          </Link>
          <Link to="/crypto/dogecoin" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
            <img src="https://assets.coingecko.com/coins/images/5/thumb/dogecoin.png" alt="Dogecoin" className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Dogecoin</p>
              <p className="text-sm text-gray-500">DOGE</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;