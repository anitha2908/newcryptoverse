import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Activity, Clock, Award } from 'lucide-react';

interface CryptoStatsProps {
  stats: {
    name: string;
    value: string | number;
    icon: React.ReactNode;
  }[];
  title: string;
}

const CryptoStats: React.FC<CryptoStatsProps> = ({ stats, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map(({ name, value, icon }) => (
          <div key={name} className="flex items-center p-3 bg-gray-50 rounded-md">
            <div className="mr-3 text-blue-500">{icon}</div>
            <div>
              <p className="text-sm text-gray-500">{name}</p>
              <p className="font-medium text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoStats;