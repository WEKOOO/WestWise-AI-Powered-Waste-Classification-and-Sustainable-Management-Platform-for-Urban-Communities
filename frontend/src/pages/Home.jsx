import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Camera, Upload, Eye, Sparkles, ArrowRight } from 'lucide-react';
// Removed unused imports: useState, useRef, ImageUpload, ClassificationResult
// Removed unused import: wasteCategories
import HeroSection from '../components/HeroSection'; // Keep HeroSection if it's just display
import WasteCategoriesGrid from '../components/WasteCategoriesGrid';

const Home = () => {
  // Removed state variables: selectedImage, classificationResult, isAnalyzing
  // Removed refs: fileInputRef, cameraInputRef
  // Removed functions: handleFileUpload, simulateClassification, resetClassification

  return (
    <div className="space-y-12"> {/* Increased spacing */}
      {/* Hero Section - Assuming this is now just informational */}
      <div className="text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-16 px-6 rounded-3xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Selamat Datang di EcoClassify!</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Platform pintar untuk mengklasifikasikan sampah Anda dan mendapatkan panduan penanganan yang tepat.</p>
        <Link 
          to="/classification" 
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-emerald-700 bg-white hover:bg-emerald-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Mulai Klasifikasi Sekarang
          <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
        </Link>
      </div>

      {/* Removed ImageUpload and ClassificationResult components from Home */}
      {/* The HeroSection component (defined in HeroSection.jsx) was actually the upload choice buttons. */}
      {/* We can replace it with a simple informational section or remove it if the top hero is enough. */}
      {/* Let's add an informational section about classification */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Bagaimana Cara Kerjanya?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-3">
                      <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">1. Unggah Gambar</h3>
                  <p className="text-sm text-gray-600">Pilih gambar sampah dari galeri Anda.</p>
              </div>
              <div className="flex flex-col items-center">
                  <div className="bg-purple-100 p-4 rounded-full mb-3">
                      <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">2. Analisis AI</h3>
                  <p className="text-sm text-gray-600">AI kami akan menganalisis gambar untuk mengidentifikasi jenis sampah.</p>
              </div>
              <div className="flex flex-col items-center">
                  <div className="bg-green-100 p-4 rounded-full mb-3">
                      <Eye className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">3. Lihat Hasil</h3>
                  <p className="text-sm text-gray-600">Dapatkan hasil klasifikasi dan panduan penanganan.</p>
              </div>
          </div>
           <div className="text-center mt-6">
             <Link 
               to="/classification" 
               className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center"
             >
               Coba Sekarang <ArrowRight className="ml-1 h-4 w-4" />
             </Link>
           </div>
      </div>

      {/* Keep WasteCategoriesGrid if it's relevant informational content */}
      <WasteCategoriesGrid />
    </div>
  );
};

export default Home;

