import React, { useState, useEffect } from 'react';
import { getCryptosList, getCryptoHistory } from '../services/cryptoApi';
import ComparisonChart from '../components/ComparisonChart';
import TimeframeSelector from '../components/TimeframeSelector';

const ComparePage: React.FC = () => {
  const [cryptosList, setCryptosList] = useState<any[]>([]);
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<string>('30d');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  // Colors for the chart
  const chartColors = [
    { borderColor: 'rgb(53, 162, 235)', backgroundColor: 'rgba(53, 162, 235, 0.5)' },
    { borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
    { borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)' },
    { borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.5)' },
    { borderColor: 'rgb(153, 102, 255)', backgroundColor: 'rgba(153, 102, 255, 0.5)' },
  ];

  useEffect(() => {
    const fetchCryptosList = async () => {
      try {
        const data = await getCryptosList(50);
        setCryptosList(data);
        // Pre-select Bitcoin and Ethereum
        setSelectedCryptos(['bitcoin', 'ethereum']);
      } catch (error) {
        console.error('Error fetching cryptocurrencies list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptosList();
  }, []);

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (selectedCryptos.length === 0) {
        setComparisonData(null);
        return;
      }

      setChartLoading(true);
      try {
        // Convert timeframe to days for API
        let days = 30;
        switch (timeframe) {
          case '1d': days = 1; break;
          case '7d': days = 7; break;
          case '30d': days = 30; break;
          case '1y': days = 365; break;
          case '5y': days = 1825; break;
          default: days = 30;
        }

        // Fetch historical data for each selected crypto
        const historicalDataPromises = selectedCryptos.map(coinId => 
          getCryptoHistory(coinId, days)
        );
        
        const historicalDataResults = await Promise.all(historicalDataPromises);
        
        // Process data for chart
        if (historicalDataResults.every(data => data && data.prices)) {
          // Get timestamps from the first crypto (they should be the same for all)
          const timestamps = historicalDataResults[0].prices.map((price: [number, number]) => {
            const date = new Date(price[0]);
            if (days <= 1) {
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (days <= 7) {
              return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
            } else if (days <= 30) {
              return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            } else {
              return date.toLocaleDateString([], { year: 'numeric', month: 'short' });
            }
          });

          // Only use a subset of points to avoid overcrowding the chart
          const step = Math.max(1, Math.floor(timestamps.length / 50));
          const filteredTimestamps = timestamps.filter((_, i) => i % step === 0);

          // Create datasets for each crypto
          const datasets = selectedCryptos.map((coinId, index) => {
            const prices = historicalDataResults[index].prices.map((price: [number, number]) => price[1]);
            const filteredPrices = prices.filter((_, i) => i % step === 0);
            
            const cryptoInfo = cryptosList.find(crypto => crypto.id === coinId);
            const name = cryptoInfo ? cryptoInfo.name : coinId;
            
            return {
              label: name,
              data: filteredPrices,
              borderColor: chartColors[index % chartColors.length].borderColor,
              backgroundColor: chartColors[index % chartColors.length].backgroundColor,
              borderWidth: 2,
              pointRadius: 1,
              pointHoverRadius: 5,
              tension: 0.1,
            };
          });

          setComparisonData({
            labels: filteredTimestamps,
            datasets,
          });
        }
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      } finally {
        setChartLoading(false);
      }
    };

    if (selectedCryptos.length > 0) {
      fetchComparisonData();
    }
  }, [selectedCryptos, timeframe, cryptosList]);

  const handleCryptoSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.options;
    const selectedValues: string[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    // Limit to 5 selections
    setSelectedCryptos(selectedValues.slice(0, 5));
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Compare Cryptocurrencies</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <label htmlFor="cryptoSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Select up to 5 cryptocurrencies to compare
          </label>
          <select
            id="cryptoSelect"
            multiple
            value={selectedCryptos}
            onChange={handleCryptoSelection}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            size={5}
          >
            {loading ? (
              <option disabled>Loading cryptocurrencies...</option>
            ) : (
              cryptosList.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </option>
              ))
            )}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Hold Ctrl (or Cmd on Mac) to select multiple cryptocurrencies
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Selected Cryptocurrencies</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCryptos.length > 0 ? (
              selectedCryptos.map((coinId) => {
                const crypto = cryptosList.find((c) => c.id === coinId);
                return crypto ? (
                  <div 
                    key={coinId}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    <img src={crypto.image} alt={crypto.name} className="w-5 h-5 mr-2" />
                    {crypto.name}
                    <button
                      onClick={() => setSelectedCryptos(selectedCryptos.filter(id => id !== coinId))}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </div>
                ) : null;
              })
            ) : (
              <p className="text-gray-500">No cryptocurrencies selected</p>
            )}
          </div>
        </div>

        <TimeframeSelector activeTimeframe={timeframe} onChange={handleTimeframeChange} />

        {chartLoading ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">Loading comparison data...</p>
          </div>
        ) : comparisonData ? (
          <div className="h-96">
            <ComparisonChart 
              data={comparisonData} 
              title="Price Comparison (USD)" 
            />
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">Select cryptocurrencies to compare</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Comparison Insights</h2>
        
        {selectedCryptos.length > 1 ? (
          <div className="space-y-4">
            <p className="text-gray-700">
              Compare the price movements of {selectedCryptos.length} cryptocurrencies over time. 
              This visualization helps you identify correlations, divergences, and potential investment opportunities.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-blue-800 mb-2">How to use this comparison</h3>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                <li>Select different timeframes to analyze short and long-term trends</li>
                <li>Hover over the chart to see exact prices at specific points in time</li>
                <li>Look for cryptocurrencies that move together or independently</li>
                <li>Identify which assets might be leading indicators for market movements</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            Select at least two cryptocurrencies to see comparison insights.
          </p>
        )}
      </div>
    </div>
  );
};

export default ComparePage;