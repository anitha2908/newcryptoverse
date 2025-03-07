import React from 'react';

interface TimeframeSelectorProps {
  activeTimeframe: string;
  onChange: (timeframe: string) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ activeTimeframe, onChange }) => {
  const timeframes = [
    { value: '1d', label: '24h' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
    { value: '1y', label: '1y' },
    { value: '5y', label: '5y' },
  ];

  return (
    <div className="flex space-x-2 mb-4">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe.value}
          onClick={() => onChange(timeframe.value)}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            activeTimeframe === timeframe.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {timeframe.label}
        </button>
      ))}
    </div>
  );
};

export default TimeframeSelector;