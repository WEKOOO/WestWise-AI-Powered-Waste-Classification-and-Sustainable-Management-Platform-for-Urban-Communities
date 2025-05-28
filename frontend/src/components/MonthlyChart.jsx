import React from 'react';

const MonthlyChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  return (
    <div className="mt-8 bg-gray-50 rounded-xl p-6">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Tren Klasifikasi Bulanan</h3>
      <div className="bg-white rounded-lg p-6">
        <div className="grid grid-cols-12 gap-2 h-40 items-end">
          {Array.from({ length: 12 }, (_, i) => {
            const height = Math.random() * 80 + 20;
            return (
              <div 
                key={i} 
                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer" 
                style={{ height: `${height}%` }}
                title={`Bulan ${i + 1}: ${Math.floor(height * 10)} klasifikasi`}
              >
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-12 gap-2 mt-3 text-xs text-gray-500">
          {months.map((month, i) => (
            <div key={i} className="text-center font-medium">{month}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyChart;