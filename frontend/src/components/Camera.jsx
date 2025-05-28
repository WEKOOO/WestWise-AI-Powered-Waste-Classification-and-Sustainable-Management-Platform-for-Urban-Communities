import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera as CameraIcon, RefreshCw, Check } from 'lucide-react';

export default function Camera({ onCapture, onCancel }) { // Add onCapture and onCancel props
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Function to start the camera stream
  const startCamera = useCallback(async () => {
    setError(null);
    setCapturedImage(null); // Reset captured image when starting camera
    setIsCameraReady(false);
    try {
      // Prefer back camera for mobile, default for desktop
      const constraints = {
        video: { 
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      let cameraStream;
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.warn('Failed to get environment camera, trying default');
        // Fallback to default camera if environment fails
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      
      setStream(cameraStream);
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        // Wait for video metadata to load to set the ready state
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          console.log('Camera ready');
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.');
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  }, [stream]); // Include stream in dependency array to manage cleanup

  // Function to stop the camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraReady(false);
      console.log('Camera stopped');
    }
  }, [stream]);

  // Start camera on component mount
  useEffect(() => {
    startCamera();
    // Cleanup function to stop camera when component unmounts or startCamera changes
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]); // Depend on startCamera and stopCamera callbacks

  // Function to capture image from video stream
  const captureImage = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // Set canvas dimensions to match video intrinsic dimensions for better quality
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data URL (or blob)
      const imageDataUrl = canvas.toDataURL('image/jpeg'); // Use jpeg for smaller size
      setCapturedImage(imageDataUrl);
      stopCamera(); // Stop camera after capture
    } else {
      console.error('Camera not ready or refs not available for capture');
      setError('Kamera belum siap untuk mengambil gambar.');
    }
  };

  // Function to retake the picture
  const retakePicture = () => {
    setCapturedImage(null);
    startCamera(); // Restart the camera
  };

  // Function to confirm and send the captured image
  const confirmCapture = () => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          // Create a File object from the Blob
          const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
          const fileName = `capture-${timestamp}.jpg`;
          const imageFile = new File([blob], fileName, { type: 'image/jpeg' });
          console.log('Captured image file:', imageFile);
          if (onCapture) {
            onCapture(imageFile); // Pass the File object to the parent
          }
        } else {
           console.error('Failed to convert canvas to blob');
           setError('Gagal memproses gambar yang diambil.');
        }
      }, 'image/jpeg', 0.9); // Quality 0.9
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-4 relative">
      {error && (
        <div className="absolute top-2 left-2 right-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm z-10">
          {error}
        </div>
      )}
      
      <div className="aspect-video bg-black rounded-md flex items-center justify-center overflow-hidden relative">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-contain ${!isCameraReady ? 'hidden' : ''}`}
            // Muted is often required for autoplay without user interaction
            muted 
          />
        )}
        {!isCameraReady && !capturedImage && !error && (
          <p className="text-white text-center">Memulai kamera...</p>
        )}
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        {capturedImage ? (
          <>
            <button 
              onClick={retakePicture}
              className="flex items-center bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition disabled:opacity-50"
              disabled={!isCameraReady && stream === null} // Disable if camera is starting
            >
              <RefreshCw className="w-5 h-5 mr-2" /> Ulangi
            </button>
            <button 
              onClick={confirmCapture}
              className="flex items-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              <Check className="w-5 h-5 mr-2" /> Gunakan Foto
            </button>
          </>
        ) : (
          <button 
            onClick={captureImage}
            className="flex items-center bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition disabled:opacity-50"
            disabled={!isCameraReady || !!error} // Disable if camera not ready or error exists
          >
            <CameraIcon className="w-5 h-5 mr-2" /> Ambil Foto
          </button>
        )}
         <button 
            onClick={onCancel} // Use the cancel prop
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
          >
            Batal
          </button>
      </div>
      {/* Hidden canvas for capturing frame */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}
