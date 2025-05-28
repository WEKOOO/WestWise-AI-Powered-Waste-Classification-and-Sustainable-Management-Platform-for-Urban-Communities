import React from 'react';

const WasteDistribution = ({ stats }) => {
  const distributionData = [
    { name: 'Organik', count: stats.organicWaste, color: 'bg-green-500' },
    { name: 'Anorganik', count: stats.inorganicWaste, color: 'bg-blue-500' },
    { name: 'Dapat Didaur Ulang', count: stats.recyclableWaste, color: 'bg-purple-500' },
    { name: 'Berbahaya (B3)', count: stats.hazardousWaste, color: 'bg-red-500' }
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Distribusi Kategori Sampah</h3>
      <div className="space-y-3">
        {distributionData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${item.color} mr-3`} />
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-800">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteDistribution;