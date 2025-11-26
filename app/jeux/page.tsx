// app/jeux/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useGameStats } from '@/lib/hooks/useGameStats';
import PlayerStatsDisplay from './components/PlayerStatsDisplay';
import AuthDiagnostic from '@/components/AuthDiagnostic';
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
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600/90 to-amber-600/90 text-white rounded-3xl shadow-2xl mb-8">
          <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">{levelInfo.icon}</div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Le Sentier de la Khidma</h1>
                  <p className="text-orange-100 text-base sm:text-lg">{levelInfo.name}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm text-orange-200">Expérience</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{gameState.player.experience} pts</div>
              </div>
            </div>

            {/* Ressources */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="text-xl sm:text-2xl mr-2 sm:mr-3">💰</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-orange-200">Faaïda</div>
                    <div className="text-lg sm:text-xl font-bold truncate">{gameState.player.resources.faaida}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="text-xl sm:text-2xl mr-2 sm:mr-3">✨</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-orange-200">Baraka</div>
                    <div className="text-lg sm:text-xl font-bold truncate">{gameState.player.resources.baraka}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="text-xl sm:text-2xl mr-2 sm:mr-3">🧠</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-orange-200">L'Éveil</div>
                    <div className="text-lg sm:text-xl font-bold truncate">{gameState.player.resources.leveil}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets de navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 sm:p-2 shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
              }`}
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
              }`}
            >
              📊 Mes Statistiques
            </button>
            <button
              onClick={() => setActiveTab('farm')}
              className={`flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'farm'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
              }`}
            >
              <Wheat className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Agriculture
            </button>
            <button
              onClick={() => setActiveTab('khidma')}
              className={`flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'khidma'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Khidma
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'learning'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
              }`}
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Apprentissage
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="pb-32">
          {activeTab === 'overview' && (
            <>
              <Overview gameState={gameState} onActivitySuggestion={handleActivitySuggestion} />
              
              {/* Principe fort du jeu */}
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800 mb-8 mt-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">⚖️</div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Principe Fondamental</h3>
                  <p className="text-lg text-slate-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    « La réussite matérielle n'a de sens et de durée que si elle repose sur le savoir spirituel et le service désintéressé. »
                  </p>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-4 italic">
                    Aucune progression durable n'est possible sans équilibre entre <strong>Faaïda</strong>, <strong>Baraka</strong> et <strong>L'Éveil</strong>.
                  </p>
                </div>
              </div>

              {/* Statuts et progression */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Prochain niveau */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                    <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                    Progression Spirituelle
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(DISCIPLE_LEVELS).map(([level, info]) => {
                      const isUnlocked = gameState.player.experience >= info.minExperience;
                      const isCurrent = currentLevel === level;
                      
                      return (
                        <div key={level} className={`p-4 rounded-lg border-2 ${
                          isCurrent ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 
                          isUnlocked ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">{info.icon}</div>
                              <div>
                                <div className={`font-semibold ${isCurrent ? 'text-orange-800 dark:text-orange-300' : isUnlocked ? 'text-green-800 dark:text-green-300' : 'text-slate-600 dark:text-gray-400'}`}>
                                  {info.name}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-gray-400">{info.minExperience} pts d'expérience requis</div>
                              </div>
                            </div>
                            {isCurrent && (
                              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Actuel
                              </div>
                            )}
                            {isUnlocked && !isCurrent && (
                              <div className="text-green-600 dark:text-green-400">✓</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Objectifs actuels */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                    <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                    Objectifs Actuels
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🌱 Préparer la saison</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">Cultivez 2 parcelles d'arachide</div>
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">3/5 parcelles préparées</div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="font-semibold text-green-800 dark:text-green-300 mb-2">🙏 Service communautaire</div>
                      <div className="text-sm text-green-600 dark:text-green-400 mb-2">Complétez 3 tâches de Khidma</div>
                      <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '33%'}}></div>
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">1/3 tâches complétées</div>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📚 Connaissance spirituelle</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">Débloquez le portail "Vie du Cheikh"</div>
                      <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '70%'}}></div>
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">7/10 Baraka accumulée</div>
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