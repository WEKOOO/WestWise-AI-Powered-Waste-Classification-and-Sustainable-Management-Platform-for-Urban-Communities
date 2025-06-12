import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Upload, Camera, Trash2, CheckCircle, AlertCircle, Loader2, BarChart3, Eye, Recycle, Leaf, Users, Target, Award, Heart, Globe, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'
import './App.css'

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [cameraStream, setCameraStream] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const wasteCategories = {
    'Battery': { color: 'bg-red-500', description: 'Baterai dan komponen elektronik', icon: '🔋' },
    'Biological': { color: 'bg-green-500', description: 'Sampah organik dan biologis', icon: '🌱' },
    'Bottle': { color: 'bg-blue-500', description: 'Botol plastik dan kaca', icon: '🍼' },
    'Cardboard': { color: 'bg-yellow-500', description: 'Kardus dan kertas tebal', icon: '📦' },
    'Clothes': { color: 'bg-purple-500', description: 'Pakaian dan tekstil', icon: '👕' },
    'Glass': { color: 'bg-cyan-500', description: 'Kaca dan material transparan', icon: '🥃' },
    'Paper': { color: 'bg-orange-500', description: 'Kertas dan dokumen', icon: '📄' },
    'Plastic': { color: 'bg-pink-500', description: 'Plastik dan polimer', icon: '🥤' },
    'Shoes': { color: 'bg-indigo-500', description: 'Sepatu dan alas kaki', icon: '👟' },
    'Trash': { color: 'bg-gray-500', description: 'Sampah umum lainnya', icon: '🗑️' }
  }

  // Mock dashboard data
  const dashboardStats = {
    totalKlasifikasi: 1247,
    sampahOrganik: 432,
    akurasiModel: 97.7
  }

  const categoryDistribution = [
    { category: 'Organik', count: 432, color: 'bg-green-500' },
    { category: 'Anorganik', count: 315, color: 'bg-blue-500' },
    { category: 'Dapat Didaur Ulang', count: 289, color: 'bg-purple-500' },
    { category: 'Berbahaya (B3)', count: 211, color: 'bg-red-500' }
  ]

  const tips = [
    'Pisahkan sampah sesuai kategori',
    'Kurangi penggunaan plastik sekali pakai',
    'Kompos sampah organik di rumah',
    'Manfaatkan bank sampah terdekat'
  ]

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 }
  }

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setCameraStream(stream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
        setSelectedFile(file)
        setPreview(canvas.toDataURL())
        stopCamera()
      }, 'image/jpeg', 0.8)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setPrediction(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setError(null)
      setPrediction(null)
      
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const classifyImage = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Gagal melakukan klasifikasi')
      }

      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreview(null)
    setPrediction(null)
    setError(null)
    stopCamera()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const renderNavigation = () => (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/95 backdrop-blur-md shadow-lg border-b sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              WestWise
            </span>
          </motion.div>
          <div className="flex space-x-2">
            {[
              { id: 'home', label: 'Home', icon: Globe },
              { id: 'about', label: 'About', icon: Heart },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'classification', label: 'Classification', icon: Camera }
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                  currentPage === item.id 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">AI-Powered Waste Classification</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              {...fadeInUp}
              transition={{ delay: 0.3 }}
            >
              Selamat Datang di{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                WestWise
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
              {...fadeInUp}
              transition={{ delay: 0.5 }}
            >
              Platform pintar berbasis AI untuk mengklasifikasikan sampah Anda dan mendapatkan 
              panduan penanganan yang tepat untuk masa depan yang lebih hijau.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              {...fadeInUp}
              transition={{ delay: 0.7 }}
            >
              <Button 
                onClick={() => setCurrentPage('classification')}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Mulai Klasifikasi Sekarang
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                onClick={() => setCurrentPage('about')}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                size="lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Pelajari Lebih Lanjut
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Leaf className="w-16 h-16" />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Recycle className="w-20 h-20" />
          </motion.div>
        </div>
      </div>

      {/* How it works section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-20"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tiga langkah sederhana untuk mengklasifikasikan sampah Anda dengan teknologi AI terdepan
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Upload,
              title: "1. Unggah Gambar",
              description: "Pilih gambar sampah dari galeri Anda atau gunakan kamera langsung untuk mengambil foto.",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Zap,
              title: "2. Analisis AI",
              description: "AI kami akan menganalisis gambar menggunakan deep learning untuk mengidentifikasi jenis sampah dengan akurasi tinggi.",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Eye,
              title: "3. Lihat Hasil",
              description: "Dapatkan hasil klasifikasi lengkap dengan tingkat kepercayaan dan panduan penanganan yang tepat.",
              color: "from-green-500 to-emerald-500"
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center group"
            >
              <motion.div 
                className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <step.icon className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          variants={fadeInUp}
        >
          <Button 
            onClick={() => setCurrentPage('classification')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Coba Sekarang
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Waste categories section */}
      <div className="bg-white py-20">
        <motion.div 
          className="max-w-7xl mx-auto px-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Kategori Sampah yang Didukung
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistem kami dapat mengidentifikasi 10 kategori sampah yang berbeda dengan akurasi tinggi
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.entries(wasteCategories).map(([category, info], index) => (
              <motion.div 
                key={category} 
                variants={scaleIn}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <div className={`w-6 h-6 ${info.color} rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}></div>
                <h3 className="font-bold text-gray-800 mb-2">{category}</h3>
                <p className="text-sm text-gray-600">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-20">
        <motion.div 
          className="max-w-7xl mx-auto px-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Dampak Positif Bersama
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pengguna yang telah berkontribusi untuk lingkungan yang lebih bersih
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "1,247+", label: "Total Klasifikasi", icon: BarChart3 },
              { number: "97.7%", label: "Akurasi Model", icon: Target },
              { number: "432kg", label: "Sampah Organik Teridentifikasi", icon: Leaf }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className="w-12 h-12 text-white mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/90 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <motion.div 
          className="max-w-7xl mx-auto px-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              WestWise
            </span>
          </div>
          <p className="text-gray-400 text-lg mb-2">
            Smart Waste Classification System
          </p>
          <p className="text-gray-500 text-sm">
            Capstone Project - Coding Camp 2025 Powered by DBS Foundation
          </p>
        </motion.div>
      </footer>
    </div>
  )

  const renderAboutPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          variants={fadeInUp}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Tentang{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              WestWise
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Solusi inovatif berbasis AI untuk mengklasifikasikan sampah dan menciptakan masa depan yang lebih berkelanjutan
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-16 items-center mb-20"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Target className="w-10 h-10 text-green-600" />
              Misi Kami
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              WestWise hadir untuk membantu masyarakat dalam mengelola sampah dengan lebih efektif melalui teknologi 
              artificial intelligence. Kami percaya bahwa dengan klasifikasi sampah yang tepat, kita dapat mengurangi 
              dampak negatif terhadap lingkungan dan meningkatkan efisiensi daur ulang.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Platform kami menggunakan deep learning untuk mengidentifikasi 10 kategori sampah yang berbeda dengan 
              akurasi tinggi, memberikan panduan penanganan yang tepat untuk setiap jenis sampah.
            </p>
          </motion.div>
          
          <motion.div 
            variants={scaleIn}
            className="relative"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">97.7%</div>
                  <div className="text-sm opacity-90">Akurasi Model</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">10</div>
                  <div className="text-sm opacity-90">Kategori Sampah</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">1000+</div>
                  <div className="text-sm opacity-90">Pengguna Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm opacity-90">Tersedia</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mb-20"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Teknologi terdepan untuk solusi pengelolaan sampah yang cerdas dan efektif
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "Klasifikasi Real-time",
                description: "Identifikasi jenis sampah secara instan menggunakan kamera atau upload gambar",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Akurasi Tinggi",
                description: "Model AI dengan akurasi 97.7% yang terus dilatih dengan data terbaru",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Proses Cepat",
                description: "Hasil klasifikasi dalam hitungan detik dengan panduan penanganan lengkap",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: BarChart3,
                title: "Dashboard Analitik",
                description: "Pantau statistik dan tren klasifikasi sampah dengan visualisasi yang menarik",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Globe,
                title: "Akses Universal",
                description: "Platform web yang dapat diakses dari berbagai perangkat kapan saja",
                color: "from-teal-500 to-blue-500"
              },
              {
                icon: Heart,
                title: "Ramah Lingkungan",
                description: "Berkontribusi untuk masa depan yang lebih hijau dan berkelanjutan",
                color: "from-pink-500 to-rose-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className="text-center mb-20"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
              <Users className="w-10 h-10 text-green-600" />
              Tim Pengembang
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Dikembangkan oleh tim yang berdedikasi untuk menciptakan solusi teknologi ramah lingkungan
            </p>
          </motion.div>

          <motion.div 
            variants={scaleIn}
            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Award className="w-12 h-12" />
              <div className="text-left">
                <h3 className="text-2xl font-bold">Capstone Project</h3>
                <p className="text-lg opacity-90">DBS Foundation x Dicoding Coding Camp</p>
              </div>
            </div>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Proyek ini merupakan hasil kolaborasi dalam program pelatihan coding yang bertujuan 
              mengembangkan solusi teknologi untuk permasalahan lingkungan.
            </p>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Siap Berkontribusi untuk Lingkungan?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Mulai klasifikasi sampah Anda sekarang dan jadilah bagian dari gerakan untuk masa depan yang lebih hijau
          </p>
          <Button 
            onClick={() => setCurrentPage('classification')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Mulai Klasifikasi
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )

  const renderDashboardPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex items-center gap-3 mb-8"
          {...fadeInUp}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Statistik</h1>
            <p className="text-gray-600">Pantau performa dan statistik klasifikasi sampah</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              title: "Total Klasifikasi",
              value: dashboardStats.totalKlasifikasi.toLocaleString(),
              icon: BarChart3,
              color: "from-blue-500 to-cyan-500",
              bgColor: "from-blue-50 to-cyan-50"
            },
            {
              title: "Sampah Organik",
              value: dashboardStats.sampahOrganik,
              icon: Leaf,
              color: "from-green-500 to-emerald-500",
              bgColor: "from-green-50 to-emerald-50"
            },
            {
              title: "Akurasi Model",
              value: `${dashboardStats.akurasiModel}%`,
              icon: Target,
              color: "from-purple-500 to-pink-500",
              bgColor: "from-purple-50 to-pink-50"
            }
          ].map((stat, index) => (
            <motion.div key={index} variants={scaleIn}>
              <Card className={`bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Distribution Chart */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  Distribusi Kategori Sampah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryDistribution.map((item, index) => (
                    <motion.div 
                      key={item.category} 
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                        <span className="font-medium text-gray-800">{item.category}</span>
                      </div>
                      <span className="text-gray-600 font-semibold">{item.count}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                  Tips Pengelolaan Sampah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tips.map((tip, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        
      </motion.div>
    </div>
  )

  const renderClassificationPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-8"
          {...fadeInUp}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Klasifikasi Sampah Anda
          </h1>
          <p className="text-xl text-gray-600">
            Unggah gambar atau gunakan kamera untuk mengetahui jenis sampah dan cara penanganannya.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  Unggah File atau Gunakan Kamera
                </CardTitle>
                <CardDescription>
                  PNG, JPG, GIF hingga 10MB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {showCamera ? (
                    <motion.div
                      key="camera"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="space-y-4"
                    >
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-64 object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={capturePhoto}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Ambil Foto
                        </Button>
                        <Button
                          onClick={stopCamera}
                          variant="outline"
                          className="flex-1"
                        >
                          Batal
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        
                        {preview ? (
                          <motion.div 
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <img
                              src={preview}
                              alt="Preview"
                              className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                            />
                            <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                          </motion.div>
                        ) : (
                          <div className="space-y-4">
                            <motion.div 
                              className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Upload className="w-8 h-8 text-white" />
                            </motion.div>
                            <div>
                              <p className="text-lg font-medium text-gray-700">
                                Pilih File Gambar
                              </p>
                              <p className="text-sm text-gray-500">
                                PNG, JPG, GIF hingga 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={classifyImage}
                          disabled={!selectedFile || loading}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Menganalisis...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Klasifikasi
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={startCamera}
                          variant="outline"
                          className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Kamera
                        </Button>
                      </div>

                      {(selectedFile || preview) && (
                        <Button
                          onClick={resetForm}
                          variant="outline"
                          className="w-full mt-2 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  Hasil Klasifikasi
                </CardTitle>
                <CardDescription>
                  Hasil analisis AI untuk kategori sampah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Alert className="mb-4 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {prediction ? (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {/* Main Prediction */}
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="flex items-center justify-center gap-2 mb-4"
                        >
                          <Badge 
                            className={`${wasteCategories[prediction.prediction.label]?.color} text-white px-4 py-2 text-lg`}
                          >
                            {prediction.prediction.label}
                          </Badge>
                        </motion.div>
                        <p className="text-gray-600 mb-4">
                          {wasteCategories[prediction.prediction.label]?.description}
                        </p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-sm text-gray-600">Tingkat Kepercayaan:</span>
                          <span className={`font-bold text-lg ${getConfidenceColor(prediction.prediction.confidence)}`}>
                            {(prediction.prediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={prediction.prediction.confidence * 100} 
                          className="h-3"
                        />
                      </div>

                      {/* Handling Instructions */}
                      {prediction.prediction.handling_instruction && (
                        <motion.div 
                          className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2 text-lg">
                            <Recycle className="w-5 h-5" />
                            Cara Penanganan
                          </h4>
                          <p className="text-blue-700 leading-relaxed">
                            {prediction.prediction.handling_instruction}
                          </p>
                        </motion.div>
                      )}

                      {/* All Probabilities */}
                      <div>
                        <h4 className="font-bold mb-4 text-lg text-gray-800">Semua Probabilitas:</h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {Object.entries(prediction.prediction.class_probabilities)
                            .sort(([,a], [,b]) => b - a)
                            .map(([category, probability], index) => (
                              <motion.div 
                                key={category} 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full ${wasteCategories[category]?.color}`}></div>
                                  <span className="font-medium text-gray-800">{category}</span>
                                </div>
                                <span className="text-gray-600 font-semibold">
                                  {(probability * 100).toFixed(1)}%
                                </span>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : !loading && (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        Unggah gambar untuk melihat hasil klasifikasi
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            {renderHomePage()}
          </motion.div>
        )}
        {currentPage === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            {renderAboutPage()}
          </motion.div>
        )}
        {currentPage === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            {renderDashboardPage()}
          </motion.div>
        )}
        {currentPage === 'classification' && (
          <motion.div
            key="classification"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            {renderClassificationPage()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

