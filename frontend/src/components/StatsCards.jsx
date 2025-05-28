import React from 'react';
import { TrendingUp, Recycle, PieChart } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Total Klasifikasi</p>
            <p className="text-3xl font-bold text-blue-800">{stats.totalClassifications.toLocaleString()}</p>
          </div>
          <TrendingUp className="w-10 h-10 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">Sampah Organik</p>
            <p className="text-3xl font-bold text-green-800">{stats.organicWaste}</p>
          </div>
          <Recycle className="w-10 h-10 text-green-600" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Akurasi Model</p>
            <p className="text-3xl font-bold text-purple-800">{stats.accuracy}%</p>
          </div>
          <PieChart className="w-10 h-10 text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;