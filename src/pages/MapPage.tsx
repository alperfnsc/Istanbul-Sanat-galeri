import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Clock, ArrowLeft, Loader2, Navigation, Map as MapIcon, Palette, Search, SlidersHorizontal, X, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchGalleries, Gallery } from '../services/dataService';
import { geocodeAddress, Coordinates } from '../services/geocodeService';
import { useTheme } from '../context/ThemeContext';
import L from 'leaflet';

// Create a static, modern museum (landmark) icon marker using divIcon
const getCustomIcon = (isActive: boolean = false) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="relative w-9 h-9 flex items-center justify-center transition-all ${isActive ? 'scale-125' : ''}">
        ${isActive ? '<div class="absolute inset-0 bg-rose-500 rounded-full shadow-lg opacity-30 animate-pulse"></div>' : ''}
        <div class="relative ${isActive ? 'bg-rose-600 border-2 border-white' : 'bg-neutral-900 border-2 border-white'} text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="22" x2="21" y2="22"></line>
            <line x1="6" y1="18" x2="6" y2="11"></line>
            <line x1="10" y1="18" x2="10" y2="11"></line>
            <line x1="14" y1="18" x2="14" y2="11"></line>
            <line x1="18" y1="18" x2="18" y2="11"></line>
            <polygon points="12 2 20 7 4 7"></polygon>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
    tooltipAnchor: [18, 0]
  });
};

type LoadedGallery = Gallery;

// Sub-component to center/fly map to the active coords dynamically
function RecenterMap({ activeCoords }: { activeCoords: Coordinates | null }) {
  const map = useMap();
  useEffect(() => {
    if (activeCoords) {
      map.flyTo([activeCoords.lat, activeCoords.lng], 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [activeCoords, map]);
  return null;
}

export default function MapPage() {
  const { theme, toggleTheme } = useTheme();
  const [galleries, setGalleries] = useState<LoadedGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeGallery, setActiveGallery] = useState<LoadedGallery | null>(null);

  // Center of Istanbul
  const istanbulCenter: [number, number] = [41.0082, 28.9784];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchGalleries();
        
        // Use coordinates parsed directly from the spreadsheet (instant display!)
        setGalleries(data);
        setLoading(false);

        // Fallback geocoding only for any entry that might lack coordinates
        data.forEach(async (gallery) => {
          if (!gallery.coords) {
            const coords = await geocodeAddress(gallery.address, gallery.district, gallery.name);
            if (coords) {
              setGalleries(prev => 
                prev.map(item => 
                  item.name === gallery.name ? { ...item, coords } : item
                )
              );
            }
          }
        });
      } catch (err) {
        console.error(err);
        setError("Galeri verileri yüklenirken bir sorun oluştu.");
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter unique districts sorted alphabetically
  const districts = Array.from(
    new Set(galleries.map(g => g.district).filter(Boolean))
  ).sort();

  // Filter galleries based on query and district
  const filteredGalleries = galleries.filter(g => {
    const matchQuery = 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchDistrict = !selectedDistrict || g.district === selectedDistrict;
    
    return matchQuery && matchDistrict;
  });

  const totalLoaded = galleries.filter(g => g.coords !== null).length;

  return (
    <div className="h-screen w-full flex flex-col bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="flex-none h-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-900 shadow-sm z-50 flex items-center justify-between px-4 sm:px-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-colors group">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-450 group-hover:text-black dark:group-hover:text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight hidden sm:block">
              ArtRoute Istanbul
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalLoaded < galleries.length && !error ? (
            <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-450 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/50">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="hidden xs:inline">Harita noktaları yükleniyor... ({totalLoaded}/{galleries.length})</span>
              <span className="xs:hidden">Yükleniyor... ({totalLoaded}/{galleries.length})</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
              <span>{totalLoaded} Galeri Yüklendi</span>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-all text-neutral-700 dark:text-neutral-300"
            title={theme === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'}
            aria-label="Tema Degistir"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Content Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* Collapsible Sidebar */}
        <aside 
          className={`bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-900 flex flex-col z-10 transition-all duration-300 overflow-hidden shrink-0 
            ${isSidebarOpen 
              ? 'w-full md:w-80 lg:w-96 h-[40vh] md:h-full border-b md:border-b-0 dark:border-neutral-900' 
              : 'w-0 h-0 md:h-full overflow-hidden border-b-0'
            }`}
        >
          {/* Sidebar Header / Filter Box */}
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 transition-colors duration-300">
            <div className="flex items-center justify-between mb-3 md:hidden">
              <span className="text-sm font-bold text-neutral-900 dark:text-white">Filtrele & Arama</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Galeri adı veya adres ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-neutral-350 text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <div className="flex-1 relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-3 pr-8 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 dark:focus:ring-neutral-350 transition-all appearance-none cursor-pointer font-medium text-neutral-700 dark:text-neutral-300"
                >
                  <option value="">Tüm İlçeler</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-550 dark:text-neutral-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>

              {(searchQuery || selectedDistrict) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDistrict("");
                  }}
                  className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-805 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800"
                >
                  Sıfırla
                </button>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900 bg-white dark:bg-neutral-950 transition-colors duration-300">
            {filteredGalleries.length === 0 ? (
              <div className="p-8 text-center text-neutral-550 dark:text-neutral-400 text-sm">
                <p className="font-semibold text-neutral-900 dark:text-white">Galeri bulunamadı</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Arama kriterlerinizi değiştirmeyi deneyin.</p>
              </div>
            ) : (
              filteredGalleries.map((gallery, index) => {
                const isAct = activeGallery?.name === gallery.name;
                const hasCoords = gallery.coords !== null;
                return (
                  <div
                    key={`${gallery.name}-${index}`}
                    onClick={() => {
                      if (gallery.coords) {
                        setActiveGallery(gallery);
                      }
                    }}
                    className={`p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-all flex gap-3 items-start justify-between ${
                      isAct ? 'bg-neutral-50 dark:bg-neutral-900/80 border-l-4 border-neutral-900 dark:border-white pl-3' : ''
                    } ${!hasCoords ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex gap-3 min-w-0 flex-1">
                      {gallery.image && (
                        <img
                          src={gallery.image}
                          alt={gallery.name}
                          className="w-16 h-16 object-cover rounded-lg shrink-0 border border-neutral-100 dark:border-neutral-800"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                            {gallery.name}
                          </h4>
                          <span className="text-[10px] bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-full font-medium border border-neutral-200/20">
                            {gallery.district}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-1 font-light">
                          {gallery.address}
                        </p>
                        {gallery.workingHours && (
                          <div className="flex items-center gap-1 text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                            <span className="truncate">{gallery.workingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!hasCoords && (
                      <div className="shrink-0 p-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Map Container View */}
        <div className="flex-1 relative z-0 h-full">
          
          {/* Floating Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 left-4 z-[1000] bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-all flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <SlidersHorizontal className="w-4 h-4 text-neutral-800 dark:text-neutral-300" />
            <span>{isSidebarOpen ? "Filtreleri Kapat" : "Galerileri Filtrele"}</span>
            {filteredGalleries.length < galleries.length && (
              <span className="inline-flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-[10px] w-5 h-5 rounded-full">
                {filteredGalleries.length}
              </span>
            )}
          </button>

          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
              <Loader2 className="w-10 h-10 animate-spin text-neutral-900 dark:text-white mb-4" />
              <p className="text-neutral-600 dark:text-neutral-300 font-medium">Veriler getiriliyor, lütfen bekleyin...</p>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-neutral-950">
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-xl border border-red-200 dark:border-red-900/50 flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* The Map */}
          <MapContainer 
            center={istanbulCenter} 
            zoom={12} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url={theme === 'dark' 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
            />
            <ZoomControl position="bottomright" />
            
            {/* Control to fly to coordinates */}
            <RecenterMap activeCoords={activeGallery ? activeGallery.coords : null} />
            
            {/* Only show filtered galleries on map */}
            {filteredGalleries.filter(g => g.coords !== null).map((gallery, idx) => {
              const isActive = activeGallery?.name === gallery.name;
              return (
                <Marker 
                  key={`${gallery.name}-${idx}`} 
                  position={[gallery.coords!.lat, gallery.coords!.lng]}
                  icon={getCustomIcon(isActive)}
                  eventHandlers={{
                    click: () => {
                      setActiveGallery(gallery);
                    }
                  }}
                >
                  <Tooltip 
                    direction="top" 
                    offset={[0, -10]} 
                    opacity={1} 
                    className="custom-tooltip font-sans rounded-md shadow-sm border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="font-semibold text-neutral-900 dark:text-white">{gallery.name}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{gallery.district}</div>
                  </Tooltip>
                  <Popup className="custom-popup">
                    <div className="flex flex-col gap-2 min-w-[200px] max-w-[280px] p-1 font-sans">
                      {gallery.image && (
                        <div className="w-full h-32 overflow-hidden rounded-t-lg -mt-1 -mx-1 mb-2">
                          <img 
                            src={gallery.image} 
                            alt={gallery.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight border-b border-neutral-100 dark:border-neutral-800 pb-2">
                        {gallery.name}
                      </h3>
                      
                      <div className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                        <Navigation className="w-4 h-4 mt-0.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                        <span>{gallery.address}</span>
                      </div>
                      
                      {gallery.phone && (
                        <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 flex-wrap">
                          <Phone className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                          <a href={`tel:${gallery.phone}`} className="hover:text-black dark:hover:text-white font-medium transition-colors">
                            {gallery.phone}
                          </a>
                        </div>
                      )}

                      {gallery.workingHours && (
                        <div className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                          <Clock className="w-4 h-4 mt-0.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                          <span>{gallery.workingHours}</span>
                        </div>
                      )}
                      
                      {/* Provide navigation link on google maps */}
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${gallery.coords!.lat},${gallery.coords!.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-950 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      >
                        <MapIcon className="w-4 h-4" />
                        <span>Yol Tarifi Al</span>
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}