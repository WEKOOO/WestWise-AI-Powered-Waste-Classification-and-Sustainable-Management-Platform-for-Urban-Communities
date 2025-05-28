import React, { useState } from 'react';
import { BarChart3, TrendingUp, Recycle, PieChart, CheckCircle } from 'lucide-react';
import StatsCards from '../components/StatsCards';
import WasteDistribution from '../components/WasteDistribution';
import WasteTips from '../components/WasteTips';
import MonthlyChart from '../components/MonthlyChart';

const Dashboard = () => {
  const [stats] = useState({
    totalClassifications: 1247,
    organicWaste: 432,
    inorganicWaste: 315,
    recyclableWaste: 289,
    hazardousWaste: 211,
    accuracy: 94.2
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Statistik</h2>
        </div>
        
        <StatsCards stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WasteDistribution stats={stats} />
          <WasteTips />
        </div>

        <MonthlyChart />
      </div>
    </div>
  );
};

export default Dashboard;