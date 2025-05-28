import React, { useState, useCallback } from 'react';
import { UploadCloud, File, X } from 'lucide-react'; // Using lucide-react icons

export default function ImageUpload({ onUpload, isUploading }) { // Accept onUpload prop and isUploading state
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      // Basic validation (optional: add more checks like file size)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Error: Only JPG, PNG, or GIF files are allowed.');
        // Reset file input
        event.target.value = null;
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Immediately trigger upload via parent component's function
      if (onUpload) {
        onUpload(file);
      }
    } else {
      // Handle case where file selection is cancelled
      setSelectedFile(null);
      setPreview(null);
      // Optionally notify parent if needed
    }
  }, [onUpload]);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    // Reset the file input visually if needed (though the state handles it)
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = null;
    }
    // Optionally notify parent that selection was cleared
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white transition-colors duration-200 ease-in-out hover:border-emerald-400">
      <input 
        type="file" 
        onChange={handleFileChange}
        className="hidden" 
        id="file-upload"
        accept="image/jpeg, image/png, image/gif, image/jpg" // Specify accepted file types
        disabled={isUploading} // Disable input during upload
      />
      
      {!selectedFile ? (
        <label 
          htmlFor="file-upload" 
          className={`cursor-pointer flex flex-col items-center justify-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <span className="font-semibold text-emerald-600 hover:text-emerald-800 transition">
            Pilih File Gambar
          </span>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hingga 10MB</p>
        </label>
      ) : (
        <div className="mt-4 text-left">
          <p className="text-sm font-medium text-gray-700 mb-2">File Terpilih:</p>
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md border border-gray-200">
            <div className="flex items-center space-x-2 overflow-hidden">
              {preview && <img src={preview} alt="Preview" className="h-10 w-10 rounded object-cover"/>}
              {!preview && <File className="h-6 w-6 text-gray-500 flex-shrink-0" />}
              <span className="text-sm text-gray-800 truncate" title={selectedFile.name}>{selectedFile.name}</span>
            </div>
            <button 
              onClick={handleRemoveFile} 
              className="text-gray-500 hover:text-red-600 transition disabled:opacity-50" 
              title="Hapus file"
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {isUploading && (
          <div className="mt-4 text-sm text-emerald-600">Mengunggah dan memproses...</div>
      )}
    </div>
  );
}
