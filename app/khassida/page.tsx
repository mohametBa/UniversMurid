'use client';

import { useState } from 'react';
import {
  Book,
  Search,
  Filter,
  Bookmark,
  Heart,
  Share2,
  Eye,
  Download,
  Star,
  Calendar,
  User,
  Headphones
} from 'lucide-react';

// Import des données centralisées
import { khassidaData, khassidaCategories, languages } from '../../data/content';
import Flipbook from '../components/Flipbook';
import AudioPlayer from '../components/AudioPlayer';

export default function KhassidaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedLanguage, setSelectedLanguage] = useState('Toutes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFlipbookOpen, setIsFlipbookOpen] = useState(false);
  const [selectedKhassida, setSelectedKhassida] = useState<any>(null);

  // États pour la lecture audio
  const [currentPlayingKhassida, setCurrentPlayingKhassida] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const filteredKhassida = khassidaData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'Toutes' || item.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const handleOpenFlipbook = (khassida: any) => {
    setSelectedKhassida(khassida);
    setIsFlipbookOpen(true);
  };

  const handleCloseFlipbook = () => {
    setIsFlipbookOpen(false);
    setSelectedKhassida(null);
  };

  const handlePlayAudio = (khassida: any) => {
    if (currentPlayingKhassida?.id === khassida.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPlayingKhassida(khassida);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const handleNext = () => {
    const currentIndex = filteredKhassida.findIndex(k => k.id === currentPlayingKhassida?.id);
    const nextIndex = (currentIndex + 1) % filteredKhassida.length;
    const nextKhassida = filteredKhassida[nextIndex];
    setCurrentPlayingKhassida(nextKhassida);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentIndex = filteredKhassida.findIndex(k => k.id === currentPlayingKhassida?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredKhassida.length - 1;
    const prevKhassida = filteredKhassida[prevIndex];
    setCurrentPlayingKhassida(prevKhassida);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setCurrentPlayingKhassida(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleTimeUpdate = (time: number) => {
    if (typeof time === 'number' && !isNaN(time)) {
      setCurrentTime(time);
    }
  };

  const handleDurationUpdate = (dur: number) => {
    if (typeof dur === 'number' && !isNaN(dur)) {
      setDuration(dur);
    }
  };

  // Fonction pour obtenir l'URL du PDF basé sur le titre
  const getPdfUrl = (title: string) => {
    // Pour l'instant, nous utiliserons le PDF existant pour tous
    if (title.toLowerCase().includes('adiaa') || title.toLowerCase().includes('adiaabanii')) {
      return '/khassidaText/adiaabanii-ar.pdf';
    }
    // Pour les autres khassidas, on peut utiliser le même PDF en attendant
    return '/khassidaText/adiaabanii-ar.pdf';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
            <Book className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Khassidas 
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explorez la collection complète des œuvres spirituelles de Cheikh Ahmadou Bamba
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-3 sm:space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Rechercher dans les Khassida..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Filters - Mobile: Stack, Desktop: Horizontal */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3 sm:gap-4">
              {/* Category Filter */}
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Catégorie</label>
                <div className="flex overflow-x-auto scrollbar-hide bg-gray-50 dark:bg-gray-700 rounded-lg p-1 space-x-1">
                  {khassidaCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Filter */}
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Langue</label>
                <div className="flex overflow-x-auto scrollbar-hide bg-gray-50 dark:bg-gray-700 rounded-lg p-1 space-x-1">
                  {languages.slice(0, 3).map(language => (
                    <button
                      key={language}
                      onClick={() => setSelectedLanguage(language)}
                      className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                        selectedLanguage === language
                          ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                      }`}
                    >
                      {language === 'Toutes' ? 'Toutes' : language.split('/')[0]}
                    </button>
                  ))}
                  {/* Show more languages on desktop */}
                  <div className="hidden sm:flex overflow-x-auto scrollbar-hide bg-gray-50 dark:bg-gray-700 rounded-lg p-1 space-x-1">
                    {languages.slice(3).map(language => (
                      <button
                        key={language}
                        onClick={() => setSelectedLanguage(language)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                          selectedLanguage === language
                            ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex sm:flex-col">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 sm:mt-0">Vue</label>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 h-fit sm:self-start">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredKhassida.length} résultat{filteredKhassida.length > 1 ? 's' : ''} trouvé{filteredKhassida.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Khassida Grid */}
        <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}>
          {filteredKhassida.map((khassida) => (
            <div
              key={khassida.id}
              className={`bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
              }`}
            >
              <div className={`${viewMode === 'list' ? 'w-full sm:w-40 lg:w-48 sm:flex-shrink-0 h-32 sm:h-40 lg:h-48' : 'h-36 sm:h-44 lg:h-48'} bg-gradient-to-br from-emerald-400 to-green-600 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Book className={`${viewMode === 'list' ? 'w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16' : 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24'} text-white opacity-80`} />
                </div>
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-1.5 sm:px-2 py-1 rounded-full text-xs font-medium">
                    {khassida.category}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4 lg:p-6 flex-1">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className={`${viewMode === 'list' ? 'text-base sm:text-lg' : 'text-base sm:text-lg lg:text-xl'} font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2`}>
                      {khassida.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <User className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{khassida.author}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button className={`p-1.5 rounded-lg transition-colors ${
                      khassida.isBookmarked
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}>
                      <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button className={`p-1.5 rounded-lg transition-colors ${
                      khassida.isLiked
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400'
                    }`}>
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 sm:mb-3 lg:text-sm line-clamp-2">
                  {khassida.description}
                </p>

                {/* Mobile: Simplified stats, Desktop: Full stats */}
                <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                  <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-4">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      <span>{khassida.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">{khassida.views.toLocaleString()}</span>
                      <span className="sm:hidden">{(khassida.views / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">{khassida.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-1 rounded">
                    {viewMode === 'list' ? khassida.language : khassida.language.split('/')[0]}
                  </span>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleOpenFlipbook(khassida)}
                      className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors`}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Lire</span>
                    </button>
                    <button
                      onClick={() => handlePlayAudio(khassida)}
                      className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        currentPlayingKhassida?.id === khassida.id && isPlaying
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <Headphones className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Écouter</span>
                    </button>
                    <button className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg transition-colors">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg transition-colors">
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredKhassida.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune Khassida trouvée
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>

      {/* Flipbook Modal */}
      {selectedKhassida && (
        <Flipbook
          pdfUrl={getPdfUrl(selectedKhassida.title)}
          title={selectedKhassida.title}
          author={selectedKhassida.author}
          isOpen={isFlipbookOpen}
          onClose={handleCloseFlipbook}
        />
      )}

      {/* Audio Player */}
      {currentPlayingKhassida && (
        <AudioPlayer
          khassida={currentPlayingKhassida}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onNext={handleNext}
          onPrev={handlePrev}
          onClose={handleClosePlayer}
          currentTime={currentTime}
          duration={duration}
          onTimeUpdate={handleTimeUpdate}
          onDurationUpdate={handleDurationUpdate}
        />
      )}
    </div>
  );
}