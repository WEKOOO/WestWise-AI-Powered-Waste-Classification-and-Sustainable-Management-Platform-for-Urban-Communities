# app/utils.py
from PIL import Image
import numpy as np
import io
import logging
from typing import Tuple, Optional
from fastapi import HTTPException
from tensorflow.keras.applications.efficientnet import preprocess_input
from io import BytesIO



logger = logging.getLogger(__name__)

# ImageNet statistics for EfficientNet preprocessing
IMAGENET_MEAN = np.array([0.485, 0.456, 0.406])
IMAGENET_STD = np.array([0.229, 0.224, 0.225])

def validate_image_file(file_bytes: bytes, max_size: int = 10 * 1024 * 1024) -> bool:
    """Validate image file size and format"""
    if len(file_bytes) > max_size:
        raise HTTPException(
            status_code=413, 
            detail=f"File terlalu besar. Maksimal {max_size // (1024*1024)}MB"
        )
    
    try:
        # Try to open image to validate format
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
        return True
    except Exception as e:
        logger.error(f"Invalid image format: {str(e)}")
        raise HTTPException(
            status_code=400, 
            detail="Format gambar tidak valid. Gunakan JPG, PNG, GIF, BMP, atau WebP"
        )

def preprocess_image(image_bytes, target_size=(224, 224)):
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    img_arr = np.array(img)
    img_arr = preprocess_input(img_arr)  # pakai preprocessing EfficientNet
    img_arr = np.expand_dims(img_arr, axis=0)  # jadi (1,224,224,3)
    return img_arr.astype(np.float32)
    

def preprocess_image_batch(file_bytes_list: list, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Preprocess multiple images for batch inference
    
    Args:
        file_bytes_list: List of raw image bytes
        target_size: Target image size (width, height) - default (224, 224)
    
    Returns:
        Preprocessed image batch array with shape (batch_size, 224, 224, 3)
    """
    try:
        batch_images = []
        expected_shape = (*target_size[::-1], 3)  # (height, width, channels)
        
        for i, file_bytes in enumerate(file_bytes_list):
            # Validate image first
            validate_image_file(file_bytes)
            
            # Open and convert image to RGB (ensures 3 channels)
            img = Image.open(io.BytesIO(file_bytes)).convert('RGB')
            
            # Resize image to exact target size (224, 224)
            img = img.resize(target_size, Image.Resampling.LANCZOS)
            
            # Convert to numpy array and ensure shape consistency
            arr = np.array(img).astype('float32')
            
            # Verify shape consistency
            if arr.shape != expected_shape:
                logger.error(f"Image {i} shape mismatch: {arr.shape}, expected: {expected_shape}")
                raise ValueError(f"Image {i} shape mismatch: got {arr.shape}, expected {expected_shape}")
            
            # Normalize to [0, 1]
            arr = arr / 255.0
            
            # Apply ImageNet normalization for EfficientNet
            arr = (arr - IMAGENET_MEAN) / IMAGENET_STD
            
            batch_images.append(arr)
        
        # Stack all images into batch: (batch_size, 224, 224, 3)
        batch_array = np.stack(batch_images, axis=0)
        
        logger.info(f"Batch processed successfully. Final shape: {batch_array.shape}")
        return batch_array
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error preprocessing image batch: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Gagal memproses batch gambar"
        )

def validate_model_input_shape(arr: np.ndarray, expected_batch_size: Optional[int] = None) -> bool:
    """
    Validate that input array has correct shape for EfficientNet model
    
    Args:
        arr: Input array to validate
        expected_batch_size: Expected batch size (None for any batch size)
    
    Returns:
        True if shape is valid
        
    Raises:
        ValueError: If shape is invalid
    """
    try:
        if len(arr.shape) != 4:
            raise ValueError(f"Expected 4D array (batch, height, width, channels), got {len(arr.shape)}D: {arr.shape}")
        
        batch_size, height, width, channels = arr.shape
        
        # Check spatial dimensions (224x224)
        if height != 224 or width != 224:
            raise ValueError(f"Expected spatial dimensions (224, 224), got ({height}, {width})")
        
        # Check channels (RGB = 3)
        if channels != 3:
            raise ValueError(f"Expected 3 channels (RGB), got {channels}")
        
        # Check batch size if specified
        if expected_batch_size is not None and batch_size != expected_batch_size:
            raise ValueError(f"Expected batch size {expected_batch_size}, got {batch_size}")
        
        # Check data type
        if arr.dtype != np.float32:
            logger.warning(f"Input array dtype is {arr.dtype}, expected float32")
        
        logger.info(f"Input shape validation passed: {arr.shape}")
        return True
        
    except Exception as e:
        logger.error(f"Shape validation failed: {str(e)}")
        raise ValueError(f"Invalid input shape: {str(e)}")

def get_model_input_info() -> dict:
    """
    Get information about expected model input format
    
    Returns:
        Dictionary with input specifications
    """
    return {
        "input_shape": "(batch_size, 224, 224, 3)",
        "single_image_shape": "(1, 224, 224, 3)",
        "data_type": "float32",
        "normalization": "ImageNet statistics",
        "mean": IMAGENET_MEAN.tolist(),
        "std": IMAGENET_STD.tolist(),
        "formula": "(pixel_value / 255.0 - mean) / std",
        "pixel_range_after_norm": "approximately [-2.1, 2.6]"
    }

def get_file_extension(filename: str) -> Optional[str]:
    """Get file extension from filename"""
    if '.' in filename:
        return filename.rsplit('.', 1)[1].lower()
    return None

def validate_file_extension(filename: str, allowed_extensions: list) -> bool:
    """Validate file extension"""
    ext = get_file_extension(filename)
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Ekstensi file tidak didukung. Gunakan: {', '.join(allowed_extensions)}"
        )
    return True

def denormalize_image(normalized_arr: np.ndarray) -> np.ndarray:
    """
    Denormalize image array back to [0, 255] range for visualization
    
    Args:
        normalized_arr: Normalized image array
        
    Returns:
        Denormalized image array in [0, 255] range
    """
    try:
        # Reverse the normalization: arr * std + mean
        denorm_arr = (normalized_arr * IMAGENET_STD) + IMAGENET_MEAN
        
        # Clip to [0, 1] range and convert to [0, 255]
        denorm_arr = np.clip(denorm_arr, 0, 1) * 255.0
        
        return denorm_arr.astype(np.uint8)
        
    except Exception as e:
        logger.error(f"Error denormalizing image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Gagal denormalisasi gambar"
        )