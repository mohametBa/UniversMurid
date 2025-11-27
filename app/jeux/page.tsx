// app/jeux/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useGameStats } from '@/lib/hooks/useGameStats';
import PlayerStatsDisplay from './components/PlayerStatsDisplay';
import ProgressRecovery from '@/components/ProgressRecovery';

import FarmManagement from './components/FarmManagement';
import KhidmaSystem from './components/KhidmaSystem';
import LearningPortals from './components/LearningPortals';
import Overview from './components/Overview';
import GameProgressRecovery from '../components/GameProgressRecovery';
import { Home, Wheat, Heart, Brain, ChevronRight, Crown, Trophy } from 'lucide-react';
import type { KhidmaGameState } from './types';

const INITIAL_GAME_STATE: KhidmaGameState = {
  player: {
    level: 'talib',
    experience: 0,
    completedTasks: [],
    unlockedLocations: ['village'],
    resources: {
      faaida: 50,
      baraka: 0,
      leveil: 0
    }
  },
  farm: {
    plots: [
      { id: 'plot1', cropType: 'empty', plantedDate: new Date(), harvestDate: null, isReady: false, productivity: 50 },
      { id: 'plot2', cropType: 'empty', plantedDate: new Date(), harvestDate: null, isReady: false, productivity: 50 },
      { id: 'plot3', cropType: 'empty', plantedDate: new Date(), harvestDate: null, isReady: false, productivity: 50 },
      { id: 'plot4', cropType: 'empty', plantedDate: new Date(), harvestDate: null, isReady: false, productivity: 50 }
    ],
    tools: {
      houe: true,
      tracteur: false,
      semences: 10,
      eau: 100
    },
    animals: {
      poules: 2,
      boeufs: 0
    }
  },
  khidma: {
    completedTasks: [],
    currentStreak: 0,
    totalBarakaEarned: 0,
    reputationLevel: 1
  },
  currentLocation: 'village',
  inventory: {
    tools: ['houe'],
    seeds: 10,
    water: 100
  },
  achievements: [],
  dailyBonuses: {
    lastClaimed: new Date(),
    streakDays: 0
  }
};

const DISCIPLE_LEVELS = {
  talib: { name: 'Tâlib (Étudiant)', icon: '🎓', color: 'from-blue-500 to-indigo-600', minExperience: 0 },
  khadim: { name: 'Khâdim (Serviteur)', icon: '🙏', color: 'from-green-500 to-teal-600', minExperience: 100 },
  salik: { name: 'Sâlik (Voyageur)', icon: '🚶‍♂️', color: 'from-orange-500 to-red-600', minExperience: 300 },
  murid: { name: 'Murid (Aspirant)', icon: '👑', color: 'from-purple-500 to-pink-600', minExperience: 600 }
};

export default function JeuxPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [gameState, setGameState] = useState<KhidmaGameState>(INITIAL_GAME_STATE);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'farm' | 'khidma' | 'learning'>('overview');

  // Hook pour les stats du jeu
  const {
    hasUnsavedChanges,
    lastSaved,
    loadedStats,
    saveProgress,
    sessionPlayTime,
    totalPlayTime,
    isSaving,
    isLoading: isStatsLoading,
    error: statsError
  } = useGameStats(gameState, {
    gameType: 'khidma_sentier',
    autoSaveInterval: 60000,
    onSaveSuccess: (stats) => {
      console.log('Auto-sauvegarde effectuée:', stats);
    },
    onSaveError: (error) => {
      console.error('Erreur sauvegarde:', error);
    }
  });

  // Charger les stats précédentes si disponibles
  useEffect(() => {
    if (loadedStats?.gameState) {
      console.log('Chargement de la sauvegarde précédente:', loadedStats.gameState);
      setGameState(loadedStats.gameState);
      setActiveTab('stats');
    }
  }, [loadedStats]);

  // Rediriger vers la page de connexion si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleGameStateUpdate = useCallback((newState: KhidmaGameState) => {
    setGameState(newState);
  }, []);

  const handleManualSave = useCallback(async () => {
    try {
      console.log('🔄 Début de la sauvegarde manuelle avec l\'état:', gameState);
      
      // Vérifier l'état utilisateur
      if (!user) {
        console.error('❌ Utilisateur non connecté');
        return;
      }
      
      const result = await saveProgress(gameState);
      if (result) {
        console.log('✅ Partie sauvegardée manuellement avec succès');
      } else {
        console.warn('⚠️ La sauvegarde a échoué ou retourner false');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde manuelle:', error);
    }
  }, [gameState, saveProgress, user]);


  const handleActivitySuggestion = useCallback((tabName: 'farm' | 'khidma' | 'learning' | 'stats') => {
    setActiveTab(tabName);
  }, []);

  const handleGameSelect = useCallback((gameType: string) => {
    if (gameType === 'khidma') setActiveTab('khidma');
    else if (gameType === 'quiz') setActiveTab('learning');
  }, []);

  const getCurrentLevel = () => {
    const exp = gameState.player.experience;
    if (exp >= 600) return 'murid';
    if (exp >= 300) return 'salik';
    if (exp >= 100) return 'khadim';
    return 'talib';
  };

  const currentLevel = getCurrentLevel();
  const levelInfo = DISCIPLE_LEVELS[currentLevel];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white rounded-3xl shadow-2xl mb-6 sm:mb-8 group hover:shadow-3xl transition-all duration-500 safe-area-inset-left safe-area-inset-right">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-amber-600/90"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
            <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 sm:p-5 lg:p-6 rounded-2xl transform group-hover:scale-110 transition-all duration-300 touch-manipulation">
                  <div className="text-5xl sm:text-6xl lg:text-7xl">{levelInfo.icon}</div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 leading-tight">Le Sentier de la Khidma</h1>
                  <div className="flex justify-center sm:justify-start">
                    <div className={`bg-gradient-to-r ${levelInfo.color} px-4 sm:px-6 py-2 sm:py-3 rounded-full text-white font-semibold text-sm sm:text-base lg:text-lg shadow-lg`}>
                      {levelInfo.name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center">
                <div className="text-sm sm:text-base text-orange-200 mb-2">Points d'Expérience</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center justify-center">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mr-2 text-yellow-300" />
                  {gameState.player.experience}
                </div>
              </div>
            </div>

            {/* Ressources */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-5 lg:p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 group/resource touch-manipulation min-h-[80px] sm:min-h-[90px] flex items-center">
                <div className="flex items-center w-full">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 sm:p-4 rounded-xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform flex-shrink-0">
                    <div className="text-xl sm:text-2xl">💰</div>
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-orange-200 mb-1 font-medium">Faaïda</div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{gameState.player.resources.faaida}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-5 lg:p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 group/resource touch-manipulation min-h-[80px] sm:min-h-[90px] flex items-center">
                <div className="flex items-center w-full">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 sm:p-4 rounded-xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform flex-shrink-0">
                    <div className="text-xl sm:text-2xl">✨</div>
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-orange-200 mb-1 font-medium">Baraka</div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{gameState.player.resources.baraka}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-5 lg:p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 group/resource touch-manipulation min-h-[80px] sm:min-h-[90px] flex items-center">
                <div className="flex items-center w-full">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-3 sm:p-4 rounded-xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform flex-shrink-0">
                    <div className="text-xl sm:text-2xl">🧠</div>
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-orange-200 mb-1 font-medium">L'Éveil</div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{gameState.player.resources.leveil}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Décoration */}
          <div className="absolute top-0 right-0 w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-l from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16 lg:-translate-y-20 lg:translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12 lg:translate-y-16 lg:-translate-x-16"></div>
        </div>

        {/* Onglets de navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto scrollbar-hide safe-area-inset-bottom">
            <button
              onClick={() => setActiveTab('overview')}
              className={`group flex items-center px-2 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm lg:text-sm shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation min-h-[44px] sm:min-h-[48px] lg:min-h-[48px] ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`p-2 sm:p-3 rounded-lg mr-2 sm:mr-3 transition-all ${
                activeTab === 'overview' 
                  ? 'bg-white/20' 
                  : 'bg-amber-100 dark:bg-amber-900/30 group-hover:bg-white'
              }`}>
                <Home className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <span className="hidden xs:inline">Vue d'ensemble</span>
              <span className="xs:hidden">Vue</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`group flex items-center px-2 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm lg:text-sm shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation min-h-[44px] sm:min-h-[48px] lg:min-h-[48px] ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`p-2 sm:p-3 rounded-lg mr-2 sm:mr-3 transition-all ${
                activeTab === 'stats' 
                  ? 'bg-white/20' 
                  : 'bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-white'
              }`}>
                <span className="text-lg sm:text-xl lg:text-2xl">📊</span>
              </div>
              <span className="hidden xs:inline">Mes Statistiques</span>
              <span className="xs:hidden">Stats</span>
            </button>
            <button
              onClick={() => setActiveTab('farm')}
              className={`group flex items-center px-2 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm lg:text-sm shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation min-h-[44px] sm:min-h-[48px] lg:min-h-[48px] ${
                activeTab === 'farm'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`p-2 sm:p-3 rounded-lg mr-2 sm:mr-3 transition-all ${
                activeTab === 'farm' 
                  ? 'bg-white/20' 
                  : 'bg-green-100 dark:bg-green-900/30 group-hover:bg-white'
              }`}>
                <Wheat className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <span className="hidden xs:inline">Agriculture</span>
              <span className="xs:hidden">Ferme</span>
            </button>
            <button
              onClick={() => setActiveTab('khidma')}
              className={`group flex items-center px-2 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm lg:text-sm shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation min-h-[44px] sm:min-h-[48px] lg:min-h-[48px] ${
                activeTab === 'khidma'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`p-2 sm:p-3 rounded-lg mr-2 sm:mr-3 transition-all ${
                activeTab === 'khidma' 
                  ? 'bg-white/20' 
                  : 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-white'
              }`}>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <span className="hidden xs:inline">Khidma</span>
              <span className="xs:hidden">Service</span>
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`group flex items-center px-2 sm:px-4 lg:px-4 py-2 sm:py-3 lg:py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm lg:text-sm shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation min-h-[44px] sm:min-h-[48px] lg:min-h-[48px] ${
                activeTab === 'learning'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`p-2 sm:p-3 rounded-lg mr-2 sm:mr-3 transition-all ${
                activeTab === 'learning' 
                  ? 'bg-white/20' 
                  : 'bg-purple-100 dark:bg-purple-900/30 group-hover:bg-white'
              }`}>
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <span className="hidden xs:inline">Apprentissage</span>
              <span className="xs:hidden">Apprendre</span>
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="pb-20 sm:pb-28 lg:pb-32 safe-area-inset-bottom">
          {activeTab === 'overview' && (
            <>
              <Overview gameState={gameState} onActivitySuggestion={handleActivitySuggestion} />
              
              {/* Principe fort du jeu */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 text-white shadow-2xl mb-6 sm:mb-8 mt-6 sm:mt-8 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 to-orange-600/90 rounded-3xl"></div>
                <div className="relative text-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-2xl inline-flex mb-4 sm:mb-6 transform group-hover:scale-110 transition-all duration-300">
                    <div className="text-4xl sm:text-5xl lg:text-6xl">⚖️</div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Principe Fondamental</h3>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 mb-4 sm:mb-6">
                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold leading-relaxed italic">
                      « La réussite matérielle n'a de sens et de durée que si elle repose sur le savoir spirituel et le service désintéressé. »
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 touch-manipulation">
                      <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">💰</div>
                      <div className="font-bold text-sm sm:text-base lg:text-lg">Faaïda</div>
                      <div className="text-xs sm:text-sm text-orange-200">Matériel</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 touch-manipulation">
                      <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">✨</div>
                      <div className="font-bold text-sm sm:text-base lg:text-lg">Baraka</div>
                      <div className="text-xs sm:text-sm text-orange-200">Spirituel</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/20 touch-manipulation">
                      <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">🧠</div>
                      <div className="font-bold text-sm sm:text-base lg:text-lg">L'Éveil</div>
                      <div className="text-xs sm:text-sm text-orange-200">Intelligence</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-orange-200 mt-4 sm:mt-6 font-medium leading-relaxed">
                    Aucune progression durable n'est possible sans équilibre entre ces trois dimensions.
                  </p>
                </div>
                
                {/* Décoration */}
                <div className="absolute top-0 right-0 w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-l from-white/10 to-transparent rounded-full -translate-y-16 -translate-x-16 lg:-translate-y-20 lg:-translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12 lg:translate-y-16 lg:-translate-x-16"></div>
              </div>

              {/* Statuts et progression */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Prochain niveau */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-2xl mr-4">
                      <Crown className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Progression Spirituelle</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(DISCIPLE_LEVELS).map(([level, info]) => {
                      const isUnlocked = gameState.player.experience >= info.minExperience;
                      const isCurrent = currentLevel === level;
                      
                      return (
                        <div key={level} className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          isCurrent 
                            ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 shadow-lg' 
                            : isUnlocked 
                            ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 hover:border-green-400' 
                            : 'border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700/50 opacity-75'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`text-4xl mr-4 p-3 rounded-2xl ${
                                isCurrent 
                                  ? 'bg-orange-100 dark:bg-orange-900/50' 
                                  : isUnlocked 
                                  ? 'bg-green-100 dark:bg-green-900/50' 
                                  : 'bg-slate-100 dark:bg-gray-600'
                              }`}>
                                {info.icon}
                              </div>
                              <div>
                                <div className={`font-bold text-lg ${isCurrent 
                                  ? 'text-orange-800 dark:text-orange-300' 
                                  : isUnlocked 
                                  ? 'text-green-800 dark:text-green-300' 
                                  : 'text-slate-600 dark:text-gray-400'
                                }`}>
                                  {info.name}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-gray-400">{info.minExperience} pts d'expérience requis</div>
                                <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                                  isCurrent 
                                    ? 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-300' 
                                    : isUnlocked 
                                    ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-300' 
                                    : 'bg-slate-200 dark:bg-gray-600 text-slate-600 dark:text-gray-400'
                                }`}>
                                  {isCurrent ? 'Niveau actuel' : isUnlocked ? 'Débloqué' : 'Verrouillé'}
                                </div>
                              </div>
                            </div>
                            {isCurrent && (
                              <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                ⭐ Actuel
                              </div>
                            )}
                            {isUnlocked && !isCurrent && (
                              <div className="text-green-600 dark:text-green-400 text-2xl">✓</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Objectifs actuels */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-2xl mr-4">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Objectifs Actuels</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="group p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 hover:scale-105 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl mr-3">
                          <div className="text-2xl">🌱</div>
                        </div>
                        <div className="font-bold text-blue-800 dark:text-blue-300">Préparer la saison</div>
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mb-3">Cultivez 2 parcelles d'arachide</div>
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 mb-2">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full transition-all duration-500" style={{width: '60%'}}></div>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">3/5 parcelles préparées (60%)</div>
                    </div>

                    <div className="group p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 hover:scale-105 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl mr-3">
                          <div className="text-2xl">🙏</div>
                        </div>
                        <div className="font-bold text-green-800 dark:text-green-300">Service communautaire</div>
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 mb-3">Complétez 3 tâches de Khidma</div>
                      <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-3 mb-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500" style={{width: '33%'}}></div>
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">1/3 tâches complétées (33%)</div>
                    </div>

                    <div className="group p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 hover:scale-105 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl mr-3">
                          <div className="text-2xl">📚</div>
                        </div>
                        <div className="font-bold text-purple-800 dark:text-purple-300">Connaissance spirituelle</div>
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400 mb-3">Débloquez le portail "Vie du Cheikh"</div>
                      <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3 mb-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500" style={{width: '70%'}}></div>
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">7/10 Baraka accumulée (70%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === 'stats' && (
            <PlayerStatsDisplay stats={loadedStats || null} isLoading={false} />
          )}
          {activeTab === 'farm' && (
            <FarmManagement gameState={gameState} onGameStateUpdate={handleGameStateUpdate} />
          )}
          {activeTab === 'khidma' && (
            <KhidmaSystem gameState={gameState} onGameStateUpdate={handleGameStateUpdate} />
          )}
          {activeTab === 'learning' && (
            <LearningPortals gameState={gameState} onGameStateUpdate={handleGameStateUpdate} />
          )}
        </div>

        {/* Composant de récupération automatique de progression */}
        <GameProgressRecovery onGameSelect={handleGameSelect} />
      </div>


    </div>
  );
}