import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import ClassificationResult from '../components/ClassificationResult';
import Camera from '../components/Camera'; // Import the Camera component
import { UploadCloud, Camera as CameraIcon } from 'lucide-react'; // Import icons

// Define the backend API URL (make this configurable, e.g., via .env)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Default to localhost:5000

export default function Classification() {
  console.log('>>> API_URL =', API_URL);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false); // State to control camera visibility
  const [selectedFileForPreview, setSelectedFileForPreview] = useState(null); // Optional: state to show preview from camera/upload

  const handleUpload = async (file) => {
    if (!file) return;

    // Optional: Show preview immediately after selection/capture
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFileForPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setIsLoading(true);
    setError(null); // Clear previous errors
    setPredictionResult(null); // Clear previous results
    setShowCamera(false); // Hide camera after capture/upload

    const formData = new FormData();
    formData.append('image', file); // 'image' should match the backend Multer field name

    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error || 'Prediction failed.');
      }

      console.log('Prediction successful:', data.prediction);
      setPredictionResult(data.prediction);

    } catch (err) {
      console.error('Upload or Prediction Error:', err);
      setError(err.message || 'An unexpected error occurred during prediction.');
      setPredictionResult(null);
      setSelectedFileForPreview(null); // Clear preview on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
  };

  const handleReset = () => {
    setPredictionResult(null);
    setError(null);
    setSelectedFileForPreview(null);
    // Optionally reset file input if needed
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-emerald-800 mb-8 text-center sm:text-4xl">
          Klasifikasi Sampah Anda
        </h1>

        {/* Show Camera or Upload Options */} 
        {!showCamera ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <p className="text-center text-gray-600 mb-6">Unggah gambar atau gunakan kamera untuk mengetahui jenis sampah dan cara penanganannya.</p>
            
            {/* Buttons to choose method */} 
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
               <button 
                 onClick={() => document.getElementById('file-upload-input')?.click()} // Trigger hidden input
                 className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:opacity-50"
                 disabled={isLoading}
               >
                 <UploadCloud className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                 Unggah File
               </button>
               <button 
                 onClick={() => setShowCamera(true)} 
                 className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:opacity-50"
                 disabled={isLoading}
               >
                 <CameraIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                 Ambil Foto
               </button>
            </div>

            {/* Hidden File Input for Upload Button */} 
            <ImageUpload onUpload={handleUpload} isUploading={isLoading} />
            {/* The ImageUpload component itself might need adjustment to just provide the hidden input */} 
            {/* Or simplify: */} 
            {/* <input 
              id="file-upload-input"
              type="file"
              className="hidden"
              accept="image/jpeg, image/png, image/gif, image/jpg"
              onChange={(e) => handleUpload(e.target.files ? e.target.files[0] : null)}
              disabled={isLoading}
            /> */} 

            {/* Display Preview if selected/captured */} 
            {selectedFileForPreview && !isLoading && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">Preview Gambar</h3>
                <img src={selectedFileForPreview} alt="Preview" className="max-w-full h-auto max-h-60 mx-auto rounded-md shadow-md"/>
                 <button 
                   onClick={handleReset} 
                   className="mt-4 block mx-auto text-sm text-gray-600 hover:text-red-600 transition"
                   disabled={isLoading}
                 >
                   Hapus Gambar
                 </button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-sm font-medium text-red-700">Error: {error}</p>
              </div>
            )}

            {isLoading && (
               <div className="mt-6 text-center text-emerald-600">Memproses gambar...</div>
            )}

            {predictionResult && !isLoading && (
              <ClassificationResult result={predictionResult} />
            )}
          </div>
        ) : (
          // Show Camera Component when showCamera is true
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
             <Camera onCapture={handleUpload} onCancel={handleCameraCancel} />
          </div>
        )}

      </div>
    </div>
  );
}

