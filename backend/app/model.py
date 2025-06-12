# app/model.py
import os
import numpy as np
import threading
import tensorflow as tf

# Path ke file .tflite
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'model_best.tflite')

# Buat interpreter dan alokasikan tensor
_interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
_interpreter.allocate_tensors()

# Ambil detail input/output
_input_details = _interpreter.get_input_details()
_output_details = _interpreter.get_output_details()

# Karena TFLite Interpreter **tidak thread-safe**, kita pakai lock
_lock = threading.Lock()

def predict_tflite(input_array: np.ndarray) -> np.ndarray:
    """
    input_array: np.ndarray, shape (1, H, W, C), dtype float32
    return: np.ndarray, shape sesuai output, dtype float32
    """
    with _lock:
        # Set input
        _interpreter.set_tensor(_input_details[0]['index'], input_array.astype(_input_details[0]['dtype']))
        # Run inference
        _interpreter.invoke()
        # Ambil output
        output_data = _interpreter.get_tensor(_output_details[0]['index'])
    return output_data

# Expose fungsi dan config
model_predict = predict_tflite
