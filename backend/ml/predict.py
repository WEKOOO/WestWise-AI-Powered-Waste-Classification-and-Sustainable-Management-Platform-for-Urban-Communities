import sys
import json
import numpy as np
from PIL import Image
from tensorflow.lite.python.interpreter import Interpreter as tflite

# Define class names based on user input (ensure order matches model output)
CLASS_NAMES = ["battery", "biological", "bottle", "cardboard", "clothes", "glass", "paper", "plastic", "shoes", "trash"]

# Define handling instructions based on user input
HANDLING_INFO = {
    "battery": [
        "Jangan buang ke tempat sampah biasa",
        "Kumpulkan di tempat khusus limbah B3",
        "Serahkan ke bank sampah atau fasilitas daur ulang elektronik",
        "Jauhkan dari jangkauan anak-anak"
    ],
    "biological": [
        "Pisahkan dari sampah lainnya",
        "Buat kompos di rumah",
        "Dapat dijadikan pupuk organik",
        "Proses dalam waktu 2-3 minggu"
    ],
    "bottle": [
        "Cuci bersih sebelum dibuang",
        "Lepaskan tutup dan label",
        "Kumpulkan di bank sampah",
        "Dapat dijual untuk tambahan income"
    ],
    "cardboard": [
        "Ratakan dan lipat rapi",
        "Pisahkan dari isolasi dan lem",
        "Jual ke pengepul atau bank sampah",
        "Simpan di tempat kering untuk mencegah lembab"
    ],
    "clothes": [
        "Sumbangkan jika masih layak pakai",
        "Gunakan kembali sebagai kain pel",
        "Jual ke pengrajin daur ulang tekstil",
        "Jangan dicampur dengan sampah basah"
    ],
    "glass": [
        "Pisahkan dari jenis sampah lain",
        "Bungkus sebelum dibuang agar tidak melukai",
        "Serahkan ke bank sampah atau pengepul kaca",
        "Jangan campur dengan keramik atau porselen"
    ],
    "paper": [
        "Jauhkan dari air agar tidak rusak",
        "Lipat rapi dan kumpulkan",
        "Gunakan kembali jika masih bisa dipakai",
        "Jual ke pengepul kertas"
    ],
    "plastic": [
        "Bersihkan dari sisa makanan atau cairan",
        "Pisahkan berdasarkan jenis plastik (kode daur ulang)",
        "Gunakan kembali jika memungkinkan",
        "Kumpulkan di dropbox daur ulang"
    ],
    "shoes": [
        "Sumbangkan jika masih bisa digunakan",
        "Kirim ke produsen yang menerima program daur ulang sepatu",
        "Jangan buang sembarangan",
        "Coba ubah jadi pot tanaman atau kerajinan"
    ],
    "trash": [
        "Gunakan kantong sampah tertutup",
        "Buang di tempat sampah akhir",
        "Kurangi produksi sampah ini sebisa mungkin",
        "Jangan mencampur dengan limbah B3 atau organik"
    ]
}

def load_and_preprocess_image(image_path, input_shape):
    try:
        img = Image.open(image_path).convert("RGB")
        # Resize image to match model input size
        # Ensure input_shape is (height, width)
        img = img.resize((input_shape[1], input_shape[0]))
        img_array = np.array(img, dtype=np.float32)
        # Normalize image (example: scale to [0, 1]) - Adjust if your model needs different normalization
        img_array = img_array / 255.0
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        print(json.dumps({"error": f"Error processing image: {str(e)}"}), file=sys.stderr)
        sys.exit(1)

def predict(model_path, image_path):
    try:
        # Load TFLite model
        interpreter = tflite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()

        # Get input and output details
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        # Get input shape (usually height, width, channels)
        input_shape = input_details[0]["shape"][1:3] # Assuming shape is [batch, height, width, channels]
        input_dtype = input_details[0]["dtype"]

        # Load and preprocess image
        img_array = load_and_preprocess_image(image_path, input_shape)

        # Ensure input data type matches model expectation
        if img_array.dtype != input_dtype:
             img_array = img_array.astype(input_dtype)

        # Set tensor
        interpreter.set_tensor(input_details[0]["index"], img_array)

        # Run inference
        interpreter.invoke()

        # Get output
        output_data = interpreter.get_tensor(output_details[0]["index"])
        predictions = output_data[0] # Assuming batch size is 1

        # Process output
        predicted_index = np.argmax(predictions)
        confidence = float(predictions[predicted_index]) # Convert numpy float to python float
        predicted_class = CLASS_NAMES[predicted_index]
        handling = HANDLING_INFO.get(predicted_class, ["No specific handling information available."])

        result = {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "handling": handling
        }
        print(json.dumps(result))

    except Exception as e:
        # Print error as JSON to stderr for Node.js to potentially capture
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python predict.py <image_path>"}), file=sys.stderr)
        sys.exit(1)

    image_path_arg = sys.argv[1]
    # Assuming model is in the same directory or a known relative path
    model_path_arg = "/home/ubuntu/waste_classification_backend/backend/ml/model_best.tflite"

    predict(model_path_arg, image_path_arg)

