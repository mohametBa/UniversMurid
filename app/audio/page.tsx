'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  Share2,
  Download,
  Clock,
  User,
  Star,
  Book
} from 'lucide-react';

// Import des données centralisées
import { khassidaData, khassidaCategories } from '../../data/content';

export default function AudioPage() {
  const [currentAudio, setCurrentAudio] = useState(khassidaData[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1530); // 25:30 in seconds
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const audioRef = useRef<HTMLAudioElement>(null);

  const filteredAudio = khassidaData.filter((audio: typeof khassidaData[0]) =>
    selectedCategory === 'Tous' || audio.category === selectedCategory
  );

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
  };

  const nextTrack = () => {
    const currentIndex = filteredAudio.findIndex(audio => audio.id === currentAudio.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % filteredAudio.length;
      setCurrentAudio(filteredAudio[nextIndex]);
      setIsPlaying(true);
    }
  };

  const prevTrack = () => {
    const currentIndex = filteredAudio.findIndex(audio => audio.id === currentAudio.id);
    if (currentIndex !== -1) {
      const prevIndex = currentIndex === 0 ? filteredAudio.length - 1 : currentIndex - 1;
      setCurrentAudio(filteredAudio[prevIndex]);
      setIsPlaying(true);
    }
  };

  const playAudio = (audio: typeof khassidaData[0]) => {
    setCurrentAudio(audio);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
            <Headphones className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Écouter les Khassidas et Podcasts
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Profitez des récitations spirituelles par des voix authentiques, nos interwiews inspirantes, et bien plus encore.
          </p>
        </div>

        {/* Audio Player */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          {/* Mobile: Stack vertically, Desktop: Grid */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-center">
            {/* Cover Art */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-full lg:h-48 lg:aspect-square bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Book className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white opacity-80" />
                </div>
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-1.5 py-1 sm:px-2 sm:py-1 lg:px-3 lg:py-1 rounded-full text-xs sm:text-sm font-medium">
                    {currentAudio.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Player Controls */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Track Info */}
              <div className="text-center lg:text-left">
                <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight">
                  {currentAudio.title}
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 lg:mb-4 space-y-1 sm:space-y-0">
                  <div className="flex items-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="truncate max-w-[150px] sm:max-w-[200px]">{currentAudio.author}</span>
                  </div>
                  <div className="hidden sm:block mx-2 lg:mx-4">•</div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                    <span>{currentAudio.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base line-clamp-2">
                  {currentAudio.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatTime(Math.floor(currentTime))}</span>
                  <span>{formatTime(Math.floor(duration))}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    isShuffled
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>

                <button
                  onClick={prevTrack}
                  className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ml-0.5 sm:ml-1 lg:ml-1" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>

                <button
                  onClick={() => setRepeatMode(repeatMode === 'none' ? 'one' : repeatMode === 'one' ? 'all' : 'none')}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    repeatMode !== 'none'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                <button
                  onClick={toggleMute}
                  className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                <button className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  currentAudio.isLiked
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400'
                }`}>
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>
                <button className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg transition-colors">
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>
                <button className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg transition-colors">
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={currentAudio.audios?.[0]?.url}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => {
              if (repeatMode === 'one') {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                }
              } else if (repeatMode === 'all') {
                nextTrack();
              } else {
                setIsPlaying(false);
              }
            }}
          />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex overflow-x-auto scrollbar-hide bg-gray-100 dark:bg-gray-700 rounded-lg p-1 space-x-1">
            {khassidaCategories.map((category: string) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 lg:px-4 lg:py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Audio List */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {filteredAudio.map((audio) => (
            <div
              key={audio.id}
              onClick={() => playAudio(audio)}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
                currentAudio.id === audio.id ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
              }`}
            >
              <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                {/* Play Button */}
                <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                  currentAudio.id === audio.id && isPlaying
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {currentAudio.id === audio.id && isPlaying ? (
                    <Pause className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
                  ) : (
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 ml-0.5" />
                  )}
                </div>

                {/* Audio Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                    {audio.title}
                  </h3>
                  
                  {/* Mobile: Stack vertically, Desktop: Horizontal */}
                  <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-2 lg:mb-3">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-sm">{audio.author}</span>
                    </div>
                    
                    <div className="hidden sm:flex items-center sm:ml-4">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span>{audio.duration}</span>
                    </div>
                    
                    <div className="hidden sm:flex items-center sm:ml-4">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                      <span>{audio.rating}</span>
                    </div>
                  </div>

                  {/* Mobile: Show essential info horizontally */}
                  <div className="flex items-center justify-between sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{audio.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      <span>{audio.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2">
                    {audio.description}
                  </p>
                </div>

                {/* Stats - Mobile: Below, Desktop: Right */}
                <div className="flex sm:flex-col items-center justify-between sm:justify-start sm:items-end sm:space-y-2 text-xs text-gray-500 dark:text-gray-400 w-full sm:w-auto sm:flex-shrink-0">
                  <div className="flex items-center sm:justify-end">
                    <Heart className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">{audio.views}</span>
                    <span className="sm:hidden">{(audio.views / 1000).toFixed(0)}k</span>
                  </div>
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 sm:px-2 py-1 rounded text-xs font-medium">
                    {audio.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}