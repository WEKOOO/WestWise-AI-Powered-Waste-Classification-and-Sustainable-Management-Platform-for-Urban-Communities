import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react'; // Or appropriate icons

// Helper function to get category styling (similar to backend/data)
// You might want to centralize this styling logic if used elsewhere
const getCategoryStyle = (categoryName) => {
  // Basic styling, enhance as needed
  const styles = {
    battery: { color: 'text-red-700', bgColor: 'bg-red-100', borderColor: 'border-red-300' },
    biological: { color: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-300' },
    bottle: { color: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
    cardboard: { color: 'text-amber-700', bgColor: 'bg-amber-100', borderColor: 'border-amber-300' },
    clothes: { color: 'text-purple-700', bgColor: 'bg-purple-100', borderColor: 'border-purple-300' },
    glass: { color: 'text-cyan-700', bgColor: 'bg-cyan-100', borderColor: 'border-cyan-300' },
    paper: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' },
    plastic: { color: 'text-pink-700', bgColor: 'bg-pink-100', borderColor: 'border-pink-300' },
    shoes: { color: 'text-orange-700', bgColor: 'bg-orange-100', borderColor: 'border-orange-300' },
    trash: { color: 'text-gray-700', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' },
    default: { color: 'text-gray-700', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' }
  };
  const lowerCaseCategory = categoryName?.toLowerCase() || 'default';
  return styles[lowerCaseCategory] || styles.default;
};

export default function ClassificationResult({ result }) {
  if (!result) {
    return null; // Don't render anything if there's no result
  }

  const { predicted_class, confidence, handling } = result;
  const confidencePercentage = (confidence * 100).toFixed(1); // Format confidence
  const categoryStyle = getCategoryStyle(predicted_class);

  return (
    <div className={`mt-8 p-6 rounded-lg border ${categoryStyle.borderColor} ${categoryStyle.bgColor}`}>
      <h2 className={`text-2xl font-semibold ${categoryStyle.color} mb-4 flex items-center`}>
        <CheckCircle className="w-6 h-6 mr-2" /> Hasil Klasifikasi
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Kategori Terdeteksi:</p>
          <p className={`text-xl font-bold ${categoryStyle.color} capitalize`}>{predicted_class || 'Tidak Dikenali'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Tingkat Keyakinan:</p>
          <p className={`text-xl font-bold ${categoryStyle.color}`}>{confidencePercentage}%</p>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${categoryStyle.color} mb-2`}>Cara Penanganan:</h3>
        {handling && handling.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            {handling.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" /> Informasi penanganan tidak tersedia.
          </p>
        )}
      </div>
    </div>
  );
}
