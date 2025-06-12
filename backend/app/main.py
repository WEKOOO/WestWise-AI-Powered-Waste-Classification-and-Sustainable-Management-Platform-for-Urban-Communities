# app/main.py
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import time
import logging
from datetime import datetime
from typing import Dict, Any

from model import predict_tflite as model_predict
from utils import preprocess_image, validate_file_extension
from config import settings

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="WestWise AI Waste Classification API",
    description="AI-powered waste classification system for sustainable management",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
cors_origins = settings.cors_origins.split(",") if settings.cors_origins != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    return response

# Exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail
            },
            "timestamp": datetime.now().isoformat()
        }
    )

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "success": True,
        "message": "WestWise AI Waste Classification API",
        "version": "2.0.0",
        "endpoints": {
            "predict": "/predict - POST image for classification",
            "health": "/health - Health check",
            "model_info": "/model/info - Model information"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test model loading
        test_array = np.random.random((1, 224, 224, 3)).astype(np.float32)
        _ = model_predict(test_array)
        
        return {
            "success": True,
            "status": "healthy",
            "model_status": "loaded",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unavailable")

@app.get("/model/info")
async def model_info():
    """Get model information"""
    return {
        "success": True,
        "model": {
            "type": "TensorFlow Lite",
            "input_shape": [1, 224, 224, 3],
            "classes": settings.class_names,
            "num_classes": len(settings.class_names)
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Classify waste image
    
    Args:
        file: Image file (JPG, PNG, GIF, BMP, WebP)
    
    Returns:
        Classification result with confidence score
    """
    start_time = time.time()
    
    try:
        # Validate file
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File harus berupa gambar")
        
        if file.filename:
            validate_file_extension(file.filename, settings.allowed_extensions)
        
        # Read and preprocess image
        file_bytes = await file.read()
        img_array = preprocess_image(file_bytes)
        
        # Model inference
        predictions = model_predict(img_array)[0]
        
        # Get prediction results
        predicted_idx = int(np.argmax(predictions))
        predicted_label = settings.class_names[predicted_idx]
        confidence = float(predictions[predicted_idx])
        
        # Prepare all class probabilities
        class_probabilities = {
            settings.class_names[i]: float(predictions[i]) 
            for i in range(len(settings.class_names))
        }
        
        processing_time = time.time() - start_time
        
        result = {
            "success": True,
            "prediction": {
                "label": predicted_label,
                "confidence": round(confidence, 4),
                "class_probabilities": {
                    k: round(v, 4) for k, v in class_probabilities.items()
                },
                "handling_instruction": settings.handling_instructions.get(predicted_label, "Instruksi penanganan tidak tersedia.")
            },
            "metadata": {
                "filename": file.filename,
                "file_size": len(file_bytes),
                "processing_time": round(processing_time, 3),
                "model_version": "2.0.0"
            },
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(
            f"Prediction: {predicted_label} ({confidence:.4f}) - "
            f"File: {file.filename} - Time: {processing_time:.3f}s"
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Gagal melakukan prediksi")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )

