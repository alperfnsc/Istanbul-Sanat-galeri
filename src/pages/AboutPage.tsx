import { Link } from 'react-router-dom';
import { Palette, ArrowLeft, Heart, Sparkles, MapPin, Map, Filter, Coffee } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <header className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between z-10 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0">
        <Link to="/" className="flex items-center gap-2 text-xl font-medium tracking-tight">
          <Palette className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
          <span>ArtRoute Istanbul</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link
            to="/map"
            className="text-sm font-medium hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
          >
            Harita
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white pb-0.5"
          >
            Hakkında
          </Link>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-all"
            title={theme === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'}
            aria-label="Tema Degistir"
          >
            {theme === 'light' ? <Moon className="w-5 h-5 text-neutral-700" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-20 w-full">
        {/* Intro Arrow Back */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Giriş Sayfasına Dön</span>
        </Link>

        {/* Hero Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Sanatın Merkezine Rehberlik Ediyoruz
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-12">
            <strong>ArtRoute Istanbul</strong>, İstanbul'un göz kamaştıran zengin kültür ve sanat duraklarını tek bir etkileşimli harita üzerinde keşfetmenizi sağlayan modern bir rehber projesidir. Amacımız şehir genelindeki çağdaş sanat galerilerini, köklü müzeleri ve yaratıcı kültür merkezlerini sanatseverlerle zahmetsizce buluşturmaktır.
          </p>
        </motion.div>

        {/* Features/Values Grid */}
        <div className="grid md:grid-cols-2 gap-8 my-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center mb-4">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Canlı & Esnek Harita</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              En güncel koordinat geocoding motoru sayesinde İstanbul'daki galerileri semt ve adreslerine göre en doğru yerlerinde bulun, tek dokunuşla Google Haritalar üzerinden anında yol tarifi alın.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center mb-4">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Gelişmiş Filtreleme</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Aradığınız galeri ismine, adres kelimelerine veya ilçeye göre dinamik olarak arama yapın. Tüm galerileri anında listeleyin ve etkileşimli sidebar üzerinden doğrudan yönetin.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Zengin Detay Kartları</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Her kültür ve sanat durağının çalışma saatleri, telefon numarası, gerçek adresi ve çekici görsellerini tek bakışta görerek ziyaretinizi akıllıca planlayın.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center mb-4">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Kullanıcı Dostu Deneyim</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Geceleri rahat bir gezinme için dilediğiniz an aydınlık ve karanlık mod arasında geçiş yapın. Çarpıcı, göz yormayan, minimalist tasarımın keyfini çıkarın.
            </p>
          </motion.div>
        </div>

        {/* Quote / Mission */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-l-4 border-neutral-900 dark:border-white pl-6 my-16 py-2 italic text-lg text-neutral-700 dark:text-neutral-300"
        >
          "İstanbul bir köprüdür; yalnızca kıtaları değil, geçmişin kadim birikimiyle bugünün modern sanat vizyonunu da birbirine bağlar. ArtRoute bu eşsiz sentezin kapısını aralar."
        </motion.div>

        {/* Technical Stack / Source */}
        <div className="border-t border-neutral-150 dark:border-neutral-900 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Veri Kaynağı & Teknoloji</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
              Bu uygulama; Google Sheets entegrasyonu, OpenStreetMap API (Nominatim), React ve Leaflet kullanılarak tam performanslı olarak geliştirilmiştir.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-100 dark:border-neutral-800">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for art lovers</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-neutral-400 dark:text-neutral-600 text-sm border-t border-neutral-100 dark:border-neutral-900 mt-auto bg-neutral-50 dark:bg-neutral-950">
        &copy; {new Date().getFullYear()} ArtRoute Istanbul. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
