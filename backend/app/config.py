# app/config.py
import os
from pydantic_settings import BaseSettings
from typing import List, Dict

class Settings(BaseSettings):
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # CORS Configuration
    cors_origins: str = "*"
    
    # Model Configuration
    model_path: str = "./model/model_best.tflite"
    
    # File Upload Configuration
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: List[str] = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]
    
    # Logging Configuration
    log_level: str = "INFO"
    
    # Classification Configuration
    class_names: List[str] = [
        "Battery", "Biological", "Bottle", "Cardboard", "Clothes", 
        "Glass", "Paper", "Plastic", "Shoes", "Trash"
    ]

    # Waste Handling Instructions
    handling_instructions: Dict[str, str] = {
        "Battery": (
            "🔋 Baterai mengandung logam berat seperti merkuri, kadmium, dan timbal yang sangat berbahaya bagi tanah dan air.\n"
            "🧾 Buang baterai bekas ke tempat pengumpulan khusus (dropbox baterai) di toko elektronik atau pusat daur ulang.\n"
            "🚫 Jangan buang ke tempat sampah biasa karena bisa menyebabkan pencemaran serius jika bocor ke lingkungan.\n"
            "✅ Alternatif: Gunakan baterai isi ulang (rechargeable) untuk mengurangi limbah baterai."
        ),

        "Biological": (
            "🍃 Sampah biologis seperti sisa makanan dan daun bisa dikomposkan menjadi pupuk alami.\n"
            "♻️ Jika memungkinkan, lakukan komposting mandiri di rumah atau bawa ke fasilitas kompos komunitas.\n"
            "🗑️ Jika tidak, buang ke tempat sampah organik agar tidak mencemari limbah kering.\n"
            "✅ Alternatif: Kurangi food waste dengan mengelola porsi makanan dan menyimpan bahan makanan dengan benar."
        ),

        "Bottle": (
            "🥤 Botol plastik atau kaca dapat didaur ulang jika dibersihkan terlebih dahulu.\n"
            "🧼 Cuci botol, lepaskan label dan tutupnya, lalu buang ke tempat sampah daur ulang khusus botol.\n"
            "🚫 Botol kotor atau bercampur bahan lain bisa mengganggu proses daur ulang.\n"
            "✅ Alternatif: Gunakan botol minum isi ulang (tumbler) untuk mengurangi sampah sekali pakai."
        ),

        "Cardboard": (
            "📦 Kardus mudah didaur ulang, tetapi harus bersih dan kering agar tidak merusak kertas lain dalam daur ulang.\n"
            "📉 Lipat atau pipihkan kardus untuk menghemat ruang, lalu buang ke tempat daur ulang kertas.\n"
            "🚫 Kardus yang berminyak (misal bekas pizza) sebaiknya tidak didaur ulang.\n"
            "✅ Alternatif: Gunakan kardus bekas untuk penyimpanan atau kerajinan sebelum membuangnya."
        ),

        "Clothes": (
            "👕 Pakaian bekas bisa memiliki kehidupan kedua jika didonasikan ke panti asuhan atau bank pakaian.\n"
            "🧵 Untuk pakaian rusak, cari fasilitas daur ulang tekstil (jika tersedia di kota Anda).\n"
            "🚫 Membuang pakaian ke tempat sampah umum menambah beban TPA dan membutuhkan ratusan tahun untuk terurai.\n"
            "✅ Alternatif: Upcycle jadi lap, tas, atau kerajinan tangan."
        ),

        "Glass": (
            "🍾 Kaca bisa didaur ulang tanpa kehilangan kualitasnya.\n"
            "⚠️ Bersihkan dan pisahkan botol kaca dari tutupnya (biasanya logam/plastik), lalu buang ke tempat daur ulang kaca.\n"
            "🚨 Hati-hati saat membuang pecahan kaca. Bungkus dengan kertas/kardus sebelum dibuang agar tidak melukai petugas.\n"
            "✅ Alternatif: Gunakan kembali botol kaca untuk wadah simpan."
        ),

        "Paper": (
            "📄 Kertas merupakan salah satu bahan paling umum dan mudah didaur ulang.\n"
            "🧻 Pastikan kertas tidak tercampur plastik, minyak, atau makanan.\n"
            "📑 Lipat atau susun rapi lalu buang ke tempat sampah daur ulang kertas.\n"
            "✅ Alternatif: Gunakan kertas bolak-balik, hindari cetak yang tidak perlu."
        ),

        "Plastic": (
            "🧴 Plastik bisa didaur ulang, tapi sangat bergantung pada jenisnya (PET, HDPE, dll).\n"
            "🧼 Cuci plastik bekas makanan/minuman dan pisahkan berdasarkan kode daur ulang jika tersedia.\n"
            "🚫 Jangan campur plastik dengan bahan organik atau limbah berbahaya.\n"
            "✅ Alternatif: Bawa tas belanja sendiri, kurangi plastik sekali pakai."
        ),

        "Shoes": (
            "👟 Sepatu bekas yang masih layak pakai sebaiknya disumbangkan.\n"
            "🧱 Sepatu rusak bisa didaur ulang menjadi bahan konstruksi di fasilitas tertentu.\n"
            "🚫 Membuang sepatu ke tempat sampah biasa menambah limbah padat yang sulit terurai.\n"
            "✅ Alternatif: Gunakan program trade-in sepatu dari brand besar jika tersedia."
        ),

        "Trash": (
            "🚮 Sampah umum seperti popok, styrofoam, atau tisu bekas tidak bisa didaur ulang.\n"
            "🗑️ Buang ke tempat sampah residu agar tidak mencemari alur daur ulang.\n"
            "♻️ Sebisa mungkin kurangi konsumsi barang sekali pakai dan pilih produk yang bisa digunakan kembali.\n"
            "✅ Alternatif: Gunakan reusable cloth, hindari barang yang sulit didaur ulang."
        )
    }

    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()


