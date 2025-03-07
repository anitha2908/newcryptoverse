import axios from 'axios';

// CoinGecko API base URL
const baseUrl = 'https://api.coingecko.com/api/v3';

// Get list of cryptocurrencies
export const getCryptosList = async (limit = 100) => {
  try {
    const response = await axios.get(`${baseUrl}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies list:', error);
    return [];
  }
};

// Get historical data for a specific cryptocurrency
export const getCryptoHistory = async (coinId: string, days = 1825) => { // 1825 days = 5 years
  try {
    const response = await axios.get(`${baseUrl}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${coinId} history:`, error);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
};

// Get detailed information about a specific cryptocurrency
export const getCryptoDetails = async (coinId: string) => {
  try {
    const response = await axios.get(`${baseUrl}/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${coinId} details:`, error);
    return null;
  }
};

// Search for cryptocurrencies
export const searchCryptos = async (query: string) => {
  try {
    const response = await axios.get(`${baseUrl}/search`, {
      params: {
        query: query,
      }
    });
    return response.data.coins;
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    return [];
  }
};