# WestWise v2.0 - AI-Powered Waste Classification Platform

Platform klasifikasi sampah berbasis AI yang telah diperbaiki dan diintegrasikan dengan fitur-fitur modern untuk manajemen berkelanjutan di komunitas urban.

## 🚀 Quick Start

### Backend
```bash
cd backend
chmod +x start_server.sh
./start_server.sh
```

### Frontend
```bash
cd westwise-frontend
npm run dev --host
```

Akses aplikasi di: `http://localhost:5173`

## 📋 Features

- ✅ **AI Classification**: 10 kategori sampah dengan TensorFlow Lite
- ✅ **Modern UI/UX**: Interface responsif dengan React + Tailwind CSS
- ✅ **Drag & Drop Upload**: Upload gambar dengan mudah
- ✅ **Real-time Results**: Hasil klasifikasi dengan confidence score
- ✅ **Health Monitoring**: Endpoint monitoring kesehatan sistem
- ✅ **Error Handling**: Penanganan error yang komprehensif
- ✅ **API Documentation**: Swagger UI dan ReDoc
- ✅ **Cross-Platform**: Kompatibel desktop dan mobile

## 🏗️ Architecture

```
WestWise v2.0/
├── backend/              # FastAPI Backend
│   ├── app/             # Application code
│   ├── model/           # AI Model (TensorFlow Lite)
│   └── requirements.txt # Python dependencies
├── westwise-frontend/   # React Frontend
│   ├── src/            # Source code
│   └── package.json    # Node.js dependencies
└── docs/               # Documentation
```

## 🔧 Tech Stack

**Backend:**
- FastAPI
- TensorFlow Lite
- Python 3.11
- Uvicorn

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Shadcn/UI

## 📊 Waste Categories

1. **Battery** - Baterai dan elektronik
2. **Biological** - Sampah organik
3. **Bottle** - Botol plastik/kaca
4. **Cardboard** - Kardus
5. **Clothes** - Pakaian
6. **Glass** - Kaca
7. **Paper** - Kertas
8. **Plastic** - Plastik
9. **Shoes** - Sepatu
10. **Trash** - Sampah umum

## 📖 Documentation

- [Backend README](backend/README.md)
- [API Documentation](http://localhost:8000/docs) (saat server berjalan)
- [Laporan Lengkap](WestWise_v2_Report.md)

## 🧪 Testing

```bash
# Test backend health
curl http://localhost:8000/health

# Test prediction
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@path/to/image.jpg"
```

## 🚀 Deployment

### Development
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

### Production
1. Update environment variables
2. Configure CORS for production domain
3. Set DEBUG=False
4. Deploy using Docker atau cloud services

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 📞 Support

Untuk bantuan atau pertanyaan:
- Buka issue di repository
- Email: support@westwise.ai

---

**WestWise v2.0** - Sustainable Waste Management for Urban Communities

