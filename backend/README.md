# WestWise Backend - AI Waste Classification API

Backend API untuk sistem klasifikasi sampah berbasis AI menggunakan FastAPI dan TensorFlow Lite.

## Fitur

- ✅ **AI Classification**: Klasifikasi gambar sampah ke 10 kategori
- ✅ **FastAPI Framework**: API modern dengan dokumentasi otomatis
- ✅ **Error Handling**: Penanganan error yang komprehensif
- ✅ **Logging**: Sistem logging untuk monitoring
- ✅ **CORS Support**: Dukungan Cross-Origin untuk frontend
- ✅ **File Validation**: Validasi ukuran dan format file
- ✅ **Health Check**: Endpoint untuk monitoring kesehatan sistem
- ✅ **Environment Config**: Konfigurasi melalui environment variables

## Kategori Klasifikasi

1. Battery (Baterai)
2. Biological (Organik)
3. Bottle (Botol)
4. Cardboard (Kardus)
5. Clothes (Pakaian)
6. Glass (Kaca)
7. Paper (Kertas)
8. Plastic (Plastik)
9. Shoes (Sepatu)
10. Trash (Sampah Umum)

## Instalasi

### Persyaratan
- Python 3.8+
- pip

### Langkah Instalasi

1. **Clone atau extract proyek**
2. **Masuk ke direktori backend**
   ```bash
   cd backend
   ```

3. **Jalankan script startup (Recommended)**
   ```bash
   chmod +x start_server.sh
   ./start_server.sh
   ```

   Atau manual:

4. **Buat virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/Mac
   # atau
   venv\Scripts\activate     # Windows
   ```

5. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

6. **Jalankan server**
   ```bash
   cd app
   python main.py
   ```

## Konfigurasi

Edit file `.env` untuk mengubah konfigurasi:

```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=*
MODEL_PATH=./model/model_best.tflite
MAX_FILE_SIZE=10485760
LOG_LEVEL=INFO
```

## API Endpoints

### 1. Root Endpoint
- **URL**: `GET /`
- **Deskripsi**: Informasi API dan endpoint yang tersedia

### 2. Health Check
- **URL**: `GET /health`
- **Deskripsi**: Cek status kesehatan API dan model

### 3. Model Information
- **URL**: `GET /model/info`
- **Deskripsi**: Informasi detail tentang model AI

### 4. Predict (Klasifikasi)
- **URL**: `POST /predict`
- **Content-Type**: `multipart/form-data`
- **Parameter**: `file` (image file)
- **Deskripsi**: Klasifikasi gambar sampah

#### Contoh Response:
```json
{
  "success": true,
  "prediction": {
    "label": "Plastic",
    "confidence": 0.9234,
    "class_probabilities": {
      "Battery": 0.0123,
      "Biological": 0.0234,
      "Bottle": 0.0345,
      "Cardboard": 0.0456,
      "Clothes": 0.0567,
      "Glass": 0.0678,
      "Paper": 0.0789,
      "Plastic": 0.9234,
      "Shoes": 0.0890,
      "Trash": 0.0901
    }
  },
  "metadata": {
    "filename": "plastic_bottle.jpg",
    "file_size": 245760,
    "processing_time": 0.123,
    "model_version": "2.0.0"
  },
  "timestamp": "2024-06-08T14:30:45.123456"
}
```

## Dokumentasi API

Setelah server berjalan, akses dokumentasi interaktif di:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

### Test dengan curl:
```bash
curl -X POST "http://localhost:8000/predict" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@path/to/your/image.jpg"
```

### Test Health Check:
```bash
curl http://localhost:8000/health
```

## Deployment

### Production Settings
Untuk production, ubah konfigurasi di `.env`:
```env
DEBUG=False
LOG_LEVEL=WARNING
CORS_ORIGINS=https://yourdomain.com
```

### Docker (Optional)
Buat `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "app/main.py"]
```

## Troubleshooting

### Error: Model tidak ditemukan
- Pastikan file `model/model_best.tflite` ada
- Periksa path di konfigurasi `MODEL_PATH`

### Error: CORS
- Periksa konfigurasi `CORS_ORIGINS` di `.env`
- Untuk development, gunakan `*`

### Error: File terlalu besar
- Sesuaikan `MAX_FILE_SIZE` di `.env`
- Default: 10MB

## Monitoring

Server menyediakan logging otomatis untuk:
- Request/Response times
- Error tracking
- Prediction results
- File upload details

Log level dapat diatur melalui `LOG_LEVEL` di `.env`.

## Support

Untuk bantuan atau pertanyaan, silakan buka issue di repository proyek.

