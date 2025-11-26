'use client';

import { useState } from 'react';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  MessageCircle,
  Mail,
  Link,
  QrCode,
  Download,
  Users,
  Heart,
  Eye,
  Book,
  Volume2,
  Copy,
  Check
} from 'lucide-react';

const socialPlatforms = [
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white',
    description: 'Partager sur Facebook',
    followers: '2.9B utilisateurs',
    isConnected: true
  },
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-sky-500 hover:bg-sky-600',
    textColor: 'text-white',
    description: 'Partager sur Twitter/X',
    followers: '450M utilisateurs',
    isConnected: false
  },
  {
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    textColor: 'text-white',
    description: 'Partager sur Instagram',
    followers: '2B utilisateurs',
    isConnected: true
  },
  {
    name: 'YouTube',
    icon: Youtube,
    color: 'bg-red-600 hover:bg-red-700',
    textColor: 'text-white',
    description: 'Partager sur YouTube',
    followers: '2.7B utilisateurs',
    isConnected: false
  },
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-500 hover:bg-green-600',
    textColor: 'text-white',
    description: 'Partager via WhatsApp',
    followers: '2B utilisateurs',
    isConnected: true
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'bg-gray-600 hover:bg-gray-700',
    textColor: 'text-white',
    description: 'Partager par email',
    followers: '4.2B utilisateurs',
    isConnected: true
  }
];

const shareableContent = [
  {
    id: 1,
    title: "Daqqatul Barra - Prières de Purification",
    type: 'Khassida',
    category: 'Prières',
    description: 'Un recueil essentiel de prières et supplications spirituelles',
    preview: '/khassida/daqqatul-barra',
    likes: 1250,
    views: 8400,
    thumbnail: '/Serigne.png'
  },
  {
    id: 2,
    title: "Diyaoul Qalb - L'Illumination du Cœur",
    type: 'Audio',
    category: 'Enseignements',
    description: 'Récitation mélodieuse des enseignements sur l\'illumination spirituelle',
    preview: '/audio/diyaoul-qalb',
    likes: 890,
    views: 5200,
    thumbnail: '/khassaid.png'
  },
  {
    id: 3,
    title: "Riyaadus Salihin - Jardin des Saints",
    type: 'Khassida',
    category: 'Compilations',
    description: 'Compilation des maximes et conseils des hommes pieux',
    preview: '/khassida/riyaadus-salihin',
    likes: 2100,
    views: 12000,
    thumbnail: '/serigneTouba.png'
  }
];

export default function PartagerPage() {
  const [selectedContent, setSelectedContent] = useState(shareableContent[0]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handlePlatformSelect = (platformName: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleShare = () => {
    const url = `https://universmurid.com${selectedContent.preview}`;
    const message = customMessage || `Découvrez "${selectedContent.title}" sur la plateforme Khassida - ${url}`;
    
    // Simulate sharing
    console.log('Sharing:', { platforms: selectedPlatforms, message, url });
    alert(`Partage simulé sur: ${selectedPlatforms.join(', ')}`);
  };

  const copyToClipboard = () => {
    const url = `https://universmurid.com${selectedContent.preview}`;
    const message = customMessage || `Découvrez "${selectedContent.title}" sur la plateforme Khassida`;
    const fullText = `${message}\n\n${url}`;
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQRCode = () => {
    const url = `https://universmurid.com${selectedContent.preview}`;
    alert(`Génération de QR Code pour: ${url}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-6">
            <Share2 className="w-8 h-8 text-pink-600 dark:text-pink-400" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Partager les Khassidas
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Diffusez la lumière spirituelle des enseignements de Cheikh Ahmadou Bamba à travers le monde
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">8K+</h3>
            <p className="text-gray-600 dark:text-gray-400">Partages ce mois</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">120+</h3>
            <p className="text-gray-600 dark:text-gray-400">Pays atteints</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">95%</h3>
            <p className="text-gray-600 dark:text-gray-400">Taux d'engagement</p>
          </div>
        </div>

        {/* Grille responsive pour mobile */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Content Selection - Optimisé pour mobile */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Contenu à Partager</h2>
            
            <div className="space-y-3 sm:space-y-4">
              {shareableContent.map((content) => (
                <div
                  key={content.id}
                  onClick={() => setSelectedContent(content)}
                  className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedContent.id === content.id
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600'
                  }`}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {content.type === 'Khassida' ? (
                        <Book className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1 space-y-1 sm:space-y-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                          {content.title}
                        </h3>
                        <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-1 rounded text-xs font-medium w-fit">
                          {content.type}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {content.description}
                      </p>
                      <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {content.likes}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {content.views.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sharing Options - Optimisé pour mobile */}
          <div className="space-y-4 sm:space-y-6">
            {/* Custom Message - Amélioré pour mobile */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Message Personnalisé</h3>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ajoutez votre message personnel..."
                className="w-full h-20 sm:h-24 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors resize-none text-sm"
                rows={3}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Laissez vide pour utiliser le message par défaut
              </p>
            </div>

            {/* Platform Selection - Optimisé pour mobile */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Choisir les Plateformes</h3>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {socialPlatforms.map((platform) => {
                  const IconComponent = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.name);
                  
                  return (
                    <button
                      key={platform.name}
                      onClick={() => handlePlatformSelect(platform.name)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className={`w-10 h-10 sm:w-8 sm:h-8 rounded-lg ${platform.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {platform.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {platform.followers}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Share Buttons - Optimisé pour mobile */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Actions de Partage</h3>
              <div className="space-y-3">
                <button
                  onClick={handleShare}
                  disabled={selectedPlatforms.length === 0}
                  className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white py-3 sm:py-4 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Partager sur {selectedPlatforms.length} plateforme{selectedPlatforms.length > 1 ? 's' : ''}</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copié!' : 'Copier'}</span>
                  </button>
                  
                  <button
                    onClick={generateQRCode}
                    className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview - Optimisé pour mobile */}
        <div className="mt-8 sm:mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Aperçu du Partage</h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {selectedContent.type === 'Khassida' ? (
                  <Book className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                  {selectedContent.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">
                  {customMessage || `Découvrez "${selectedContent.title}" sur la plateforme Khassida`}
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm break-all">
                  https://universmurid.com{selectedContent.preview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}