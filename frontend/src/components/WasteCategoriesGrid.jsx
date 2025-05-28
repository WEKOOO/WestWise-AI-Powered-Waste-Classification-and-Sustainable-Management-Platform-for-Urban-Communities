import React from 'react';
import { wasteCategories } from '../data/wasteCategories';

const WasteCategoriesGrid = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kategori Sampah yang Didukung</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(wasteCategories).map(([key, category]) => (
          <div key={key} className={`${category.bgColor} ${category.borderColor} border rounded-xl p-4 text-center hover:shadow-md transition-shadow`}>
            <category.icon className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
            <p className="font-semibold text-sm text-gray-800">{category.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteCategoriesGrid;