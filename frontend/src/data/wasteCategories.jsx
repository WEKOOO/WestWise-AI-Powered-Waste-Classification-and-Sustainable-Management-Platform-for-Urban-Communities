import { Battery, Recycle, Shirt, Trash2 } from 'lucide-react';

export const wasteCategories = {
  Battery: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: Battery,
    title: 'Baterai',
    description: 'Limbah berbahaya yang mengandung logam berat',
    handling: [
      'Jangan buang ke tempat sampah biasa',
      'Kumpulkan di tempat khusus limbah B3',
      'Serahkan ke bank sampah atau fasilitas daur ulang elektronik',
      'Jauhkan dari jangkauan anak-anak'
    ]
  },
  Biological: {
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: Recycle,
    title: 'Sampah Organik',
    description: 'Sampah yang dapat terurai secara alami',
    handling: [
      'Pisahkan dari sampah lainnya',
      'Buat kompos di rumah',
      'Dapat dijadikan pupuk organik',
      'Proses dalam waktu 2-3 minggu'
    ]
  },
  Bottle: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Recycle,
    title: 'Botol Plastik',
    description: 'Dapat didaur ulang menjadi produk baru',
    handling: [
      'Cuci bersih sebelum dibuang',
      'Lepaskan tutup dan label',
      'Kumpulkan di bank sampah',
      'Dapat dijual untuk tambahan income'
    ]
  },
  Cardboard: {
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Recycle,
    title: 'Kardus',
    description: 'Material yang mudah didaur ulang',
    handling: [
      'Ratakan dan lipat rapi',
      'Pisahkan dari isolasi dan lem',
      'Jual ke pengepul atau bank sampah',
      'Simpan di tempat kering untuk mencegah lembab'
    ]
  },
  Clothes: {
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Shirt,
    title: 'Pakaian',
    description: 'Sampah tekstil yang bisa digunakan kembali',
    handling: [
      'Sumbangkan jika masih layak pakai',
      'Gunakan kembali sebagai kain pel',
      'Jual ke pengrajin daur ulang tekstil',
      'Jangan dicampur dengan sampah basah'
    ]
  },
  Glass: {
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    icon: Recycle,
    title: 'Kaca',
    description: 'Dapat didaur ulang berkali-kali tanpa kehilangan kualitas',
    handling: [
      'Pisahkan dari jenis sampah lain',
      'Bungkus sebelum dibuang agar tidak melukai',
      'Serahkan ke bank sampah atau pengepul kaca',
      'Jangan campur dengan keramik atau porselen'
    ]
  },
  Paper: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Recycle,
    title: 'Kertas',
    description: 'Material ringan dan mudah didaur ulang',
    handling: [
      'Jauhkan dari air agar tidak rusak',
      'Lipat rapi dan kumpulkan',
      'Gunakan kembali jika masih bisa dipakai',
      'Jual ke pengepul kertas'
    ]
  },
  Plastic: {
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    icon: Recycle,
    title: 'Plastik',
    description: 'Sampah yang sulit terurai, harus didaur ulang',
    handling: [
      'Bersihkan dari sisa makanan atau cairan',
      'Pisahkan berdasarkan jenis plastik (kode daur ulang)',
      'Gunakan kembali jika memungkinkan',
      'Kumpulkan di dropbox daur ulang'
    ]
  },
  Shoes: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: Shirt,
    title: 'Sepatu',
    description: 'Sampah tekstil dan karet campuran',
    handling: [
      'Sumbangkan jika masih bisa digunakan',
      'Kirim ke produsen yang menerima program daur ulang sepatu',
      'Jangan buang sembarangan',
      'Coba ubah jadi pot tanaman atau kerajinan'
    ]
  },
  Trash: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: Trash2,
    title: 'Sampah Umum',
    description: 'Sampah yang tidak dapat diklasifikasikan',
    handling: [
      'Gunakan kantong sampah tertutup',
      'Buang di tempat sampah akhir',
      'Kurangi produksi sampah ini sebisa mungkin',
      'Jangan mencampur dengan limbah B3 atau organik'
    ]
  }
}

export default wasteCategories;
