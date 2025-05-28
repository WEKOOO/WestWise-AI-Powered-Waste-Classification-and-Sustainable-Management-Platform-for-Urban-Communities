import React from 'react';
import { CheckCircle } from 'lucide-react';

const WasteTips = () => {
  const tips = [
    'Pisahkan sampah sesuai kategori',
    'Kurangi penggunaan plastik sekali pakai',
    'Kompos sampah organik di rumah',
    'Manfaatkan bank sampah terdekat'
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Tips Pengelolaan Sampah</h3>
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start p-3 bg-white rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-700">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteTips;