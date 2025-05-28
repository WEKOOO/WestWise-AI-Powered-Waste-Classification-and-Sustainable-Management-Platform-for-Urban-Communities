import React from 'react';
import { Info, Leaf, Globe, HeartHandshake } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center mb-6">
        <Info className="w-8 h-8 mr-3 text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-800">Tentang EcoClassify</h2>
      </div>

      <p className="text-gray-600">
        EcoClassify adalah sistem klasifikasi sampah berbasis AI yang dirancang untuk membantu masyarakat
        dalam memilah dan mengelola sampah dengan lebih baik. Dengan teknologi terbaru, kami menyediakan solusi
        cerdas yang mendukung keberlanjutan dan kelestarian lingkungan.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start bg-green-50 p-4 rounded-lg">
          <Leaf className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Ramah Lingkungan</h3>
            <p className="text-sm text-gray-600">Membantu mengurangi dampak sampah dan meningkatkan kesadaran akan daur ulang.</p>
          </div>
        </div>

        <div className="flex items-start bg-blue-50 p-4 rounded-lg">
          <Globe className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Teknologi AI</h3>
            <p className="text-sm text-gray-600">Menggunakan kecerdasan buatan untuk mengenali dan mengklasifikasikan berbagai jenis sampah.</p>
          </div>
        </div>

        <div className="flex items-start bg-orange-50 p-4 rounded-lg">
          <HeartHandshake className="w-6 h-6 text-orange-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Dukungan Komunitas</h3>
            <p className="text-sm text-gray-600">Memberikan edukasi dan akses ke fasilitas pengelolaan sampah.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
