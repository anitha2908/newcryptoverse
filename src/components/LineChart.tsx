import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface LineChartProps {
  coinHistory: {
    prices: [number, number][];
  };
  currentPrice: string;
  coinName: string;
  timeframe: string;
}

const LineChart: React.FC<LineChartProps> = ({ coinHistory, currentPrice, coinName, timeframe }) => {
  if (!coinHistory?.prices?.length) {
    return <div className="text-center py-10">Loading chart data...</div>;
  }

  const coinPrice = coinHistory.prices.map((price) => price[1]);
  
  // Format timestamps based on timeframe
  const coinTimestamp = coinHistory.prices.map((price) => {
    const date = new Date(price[0]);
    
    if (timeframe === '1d' || timeframe === '7d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '30d') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { year: 'numeric', month: 'short' });
    }
  });

  // Only show a reasonable number of labels based on the timeframe
  const filteredTimestamps = coinTimestamp.filter((_, i) => {
    if (timeframe === '1d') return i % 6 === 0;
    if (timeframe === '7d') return i % 24 === 0;
    if (timeframe === '30d') return i % 5 === 0;
    if (timeframe === '1y') return i % 30 === 0;
    return i % 90 === 0; // 5y
  });

  const filteredPrices = coinPrice.filter((_, i) => {
    if (timeframe === '1d') return i % 6 === 0;
    if (timeframe === '7d') return i % 24 === 0;
    if (timeframe === '30d') return i % 5 === 0;
    if (timeframe === '1y') return i % 30 === 0;
    return i % 90 === 0; // 5y
  });

  const data = {
    labels: filteredTimestamps,
    datasets: [
      {
        label: 'Price in USD',
        data: filteredPrices,
        fill: false,
        backgroundColor: '#0071bd',
        borderColor: '#0071bd',
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${coinName} Price Chart`,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="chart-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{coinName} Price Chart</h2>
        <div className="flex items-center">
          <p className="font-medium text-gray-600 mr-2">Current {coinName} Price:</p>
          <p className="font-bold text-blue-600">${currentPrice}</p>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;