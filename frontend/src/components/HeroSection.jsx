import React from 'react';
import { Camera, Upload } from 'lucide-react';

// Renaming the component defined here for clarity, as it functions like an upload choice component
// It's currently exported as default, so how it's imported/used in the parent matters.
// Assuming it's used as <HeroSection /> based on the filename.
// We will remove the ref props as they are no longer needed.
const UploadOrCaptureChoice = ({ onFileUpload }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Camera Option - Use label to trigger input */}
      <label 
        htmlFor="camera-input"
        className="group border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 cursor-pointer transform hover:scale-105 block"
      >
        <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
          <Camera className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="font-bold text-xl mb-2 text-gray-800">Ambil Foto</h3>
        <p className="text-gray-600">Gunakan kamera untuk mengambil foto sampah secara langsung</p>
        {/* Hidden input for camera capture */}
        <input
          id="camera-input" // ID for the label
          // ref={cameraInputRef} // Ref removed
          type="file"
          accept="image/*"
          capture="user" // Use camera
          onChange={onFileUpload}
          className="hidden"
        />
      </label>

      {/* File Upload Option - Use label to trigger input */}
      <label 
        htmlFor="file-input"
        className="group border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer transform hover:scale-105 block"
      >
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="font-bold text-xl mb-2 text-gray-800">Upload Gambar</h3>
        <p className="text-gray-600">Pilih gambar dari galeri atau komputer Anda</p>
        {/* Hidden input for file upload */}
        <input
          id="file-input" // ID for the label
          // ref={fileInputRef} // Ref removed
          type="file"
          accept="image/*" // Accept standard image types
          onChange={onFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

// Assuming the parent component imports this file as 'HeroSection'
// We keep the default export matching the filename for compatibility, 
// even though the component inside is now named UploadOrCaptureChoice.
export default UploadOrCaptureChoice; 

