'use client';

import { useState } from 'react';
import { 
  Globe, 
  Languages, 
  Book, 
  Volume2, 
  Download, 
  Search,
  Filter,
  Check,
  Star,
  Users,
  Calendar,
  ArrowRight,
  FileText,
  Headphones
} from 'lucide-react';

const languagesData = [
  {
    code: 'ar',
    name: 'Arabe',
    nativeName: 'العربية',
    flag: '🇸🇦',
    speakers: '300M+',
    khassidaCount: 125,
    audioCount: 98,
    description: 'Langue originale des Khassida et du Coran',
    isAvailable: true,
    isPrimary: true,
    lastUpdated: '2024-02-15',
    completeness: 100
  },
  {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    speakers: '280M+',
    khassidaCount: 125,
    audioCount: 85,
    description: 'Traduction officielle vers le français',
    isAvailable: false,
    isPrimary: false,
    lastUpdated: '2024-02-10',
    completeness: 100
  },
  {
    code: 'wo',
    name: 'Wolof',
    nativeName: 'Wolof',
    flag: '🇸🇳',
    speakers: '15M+',
    khassidaCount: 120,
    audioCount: 92,
    description: 'Traduction en langue wolof pour la communauté sénégalaise',
    isAvailable: false,
    isPrimary: false,
    lastUpdated: '2024-02-12',
    completeness: 96
  },
  {
    code: 'en',
    name: 'Anglais',
    nativeName: 'English',
    flag: '🇬🇧',
    speakers: '1.5B+',
    khassidaCount: 85,
    audioCount: 45,
    description: 'Traduction anglaise pour la portée internationale',
    isAvailable: false,
    isPrimary: false,
    lastUpdated: '2024-01-28',
    completeness: 68
  },
  {
    code: 'es',
    name: 'Espagnol',
    nativeName: 'Español',
    flag: '🇪🇸',
    speakers: '500M+',
    khassidaCount: 45,
    audioCount: 25,
    description: 'Traduction espagnole en cours de développement',
    isAvailable: false,
    isPrimary: false,
    lastUpdated: '2024-01-15',
    completeness: 36
  },
  {
    code: 'pt',
    name: 'Portugais',
    nativeName: 'Português',
    flag: '🇧🇷',
    speakers: '260M+',
    khassidaCount: 30,
    audioCount: 15,
    description: 'Traduction portugaise pour le Brésil et l\'Afrique',
    isAvailable: false,
    isPrimary: false,
    lastUpdated: '2024-01-10',
    completeness: 24
  }
];

const khassidaByLanguage = {
  'ar': [
    { title: 'دقائق البر', arabicTitle: 'دقائق البر', category: 'Prières', rating: 5.0 },
    { title: 'ضياء القلب', arabicTitle: 'ضياء القلب', category: 'Enseignements', rating: 4.9 },
    { title: 'رياض الصالحين', arabicTitle: 'رياض الصالحين', category: 'Compilations', rating: 5.0 }
  ],
  'fr': [
    { title: 'Daqqatul Barra', arabicTitle: 'دقائق البر', category: 'Prières', rating: 5.0 },
    { title: 'Diyaoul Qalb', arabicTitle: 'ضياء القلب', category: 'Enseignements', rating: 4.9 },
    { title: 'Riyaadus Salihin', arabicTitle: 'رياض الصالحين', category: 'Compilations', rating: 5.0 }
  ],
  'wo': [
    { title: 'Daqqatul Barra', arabicTitle: 'دقائق البر', category: 'Prières', rating: 5.0 },
    { title: 'Diyaoul Qalb', arabicTitle: 'ضياء القلب', category: 'Enseignements', rating: 4.9 },
    { title: 'Xale yu jàng', arabicTitle: 'رياض الصالحين', category: 'Compilations', rating: 5.0 }
  ]
};

export default function LanguesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(languagesData[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'comparison'>('grid');

  const availableLanguages = languagesData.filter(lang => lang.isAvailable);
  const selectedKhassida = khassidaByLanguage[selectedLanguage.code as keyof typeof khassidaByLanguage] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Langues et Traductions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explorez les Khassida dans votre langue préférée et découvrez les traductions authentiques
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Languages className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Langues Disponibles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableLanguages.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Book className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Khassida Traduites</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {availableLanguages.reduce((total, lang) => total + lang.khassidaCount, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Volume2 className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Récitations Audio</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {availableLanguages.reduce((total, lang) => total + lang.audioCount, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-600 dark:text-orange-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Locuteurs Potentiels</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2.6B+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Language Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une langue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'comparison' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Comparaison
              </button>
            </div>
          </div>
        </div>

        {/* Languages Grid */}
        <div className={`grid gap-6 mb-12 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {languagesData
            .filter(lang => 
              lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((language) => (
            <div
              key={language.code}
              onClick={() => setSelectedLanguage(language)}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border transition-all duration-300 cursor-pointer group ${
                selectedLanguage.code === language.code
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02]'
              } ${!language.isAvailable ? 'opacity-60' : ''}`}
            >
              <div className="p-6">
                {/* Language Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{language.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {language.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{language.nativeName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {language.isPrimary && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                        Original
                      </span>
                    )}
                    {language.isAvailable && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        Disponible
                      </span>
                    )}
                    {!language.isAvailable && (
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium">
                        En développement
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {language.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Complétude</span>
                    <span className="text-gray-900 dark:text-white font-medium">{language.completeness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${language.completeness}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Book className="w-4 h-4 mr-2" />
                    <span>{language.khassidaCount} Khassida</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Headphones className="w-4 h-4 mr-2" />
                    <span>{language.audioCount} Audio</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{language.speakers}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(language.lastUpdated).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Action Button */}
                {language.isAvailable && (
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                    <span>Explorer les Khassida</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Language Details */}
        {viewMode === 'grid' && selectedLanguage && selectedLanguage.isAvailable && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Khassida disponibles en {selectedLanguage.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Découvrez les œuvres de Cheikh Ahmadou Bamba traduites en {selectedLanguage.name}
              </p>
            </div>

            <div className="grid gap-4">
              {selectedKhassida.map((khassida, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedLanguage.code === 'ar' ? khassida.arabicTitle : khassida.title}
                        </h3>
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs font-medium">
                          {khassida.category}
                        </span>
                      </div>
                      {selectedLanguage.code !== 'ar' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {khassida.arabicTitle}
                        </p>
                      )}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{khassida.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                        <Headphones className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}