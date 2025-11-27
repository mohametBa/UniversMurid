// app/jeux/jouer/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useGameStats } from '@/lib/hooks/useGameStats';
import PlayerStatsDisplay from '../components/PlayerStatsDisplay';
import FarmManagement from '../components/FarmManagement';
import KhidmaSystem from '../components/KhidmaSystem';
import LearningPortals from '../components/LearningPortals';
import Overview from '../components/Overview';
import GameProgressRecovery from '../../components/GameProgressRecovery';
import { Home, Wheat, Heart, Brain, Trophy, Crown, Target } from 'lucide-react';
import type { KhidmaGameState } from '../types';
import { INITIAL_GAME_STATE, DISCIPLE_LEVELS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function JouerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [gameState, setGameState] = useState<KhidmaGameState>(INITIAL_GAME_STATE);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  type TabId = 'overview' | 'stats' | 'farm' | 'khidma' | 'learning';

  interface TabConfig {
    id: TabId;
    label: string;
    short: string;
    icon: React.ReactNode;
    gradient: string;
    borderColor: string;
  }

  const tabs: TabConfig[] = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      short: "Vue",
      icon: <Home className="w-5 h-5" />,
      gradient: "from-emerald-500 to-teal-600",
      borderColor: "border-emerald-500/30"
    },
    {
      id: "stats",
      label: "Statistiques",
      short: "Stats",
      icon: <Trophy className="w-5 h-5" />,
      gradient: "from-teal-500 to-cyan-600",
      borderColor: "border-teal-500/30"
    },
    {
      id: "farm",
      label: "Agriculture",
      short: "Ferme",
      icon: <Wheat className="w-5 h-5" />,
      gradient: "from-yellow-500 to-amber-600",
      borderColor: "border-yellow-500/30"
    },
    {
      id: "khidma",
      label: "Khidma",
      short: "Service",
      icon: <Heart className="w-5 h-5" />,
      gradient: "from-blue-500 to-cyan-600",
      borderColor: "border-blue-500/30"
    },
    {
      id: "learning",
      label: "Apprentissage",
      short: "Savoir",
      icon: <Brain className="w-5 h-5" />,
      gradient: "from-purple-500 to-indigo-600",
      borderColor: "border-purple-500/30"
    }
  ];

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

  useEffect(() => {
    if (loadedStats?.gameState) {
      console.log('Chargement de la sauvegarde précédente:', loadedStats.gameState);
      setGameState(loadedStats.gameState);
      setActiveTab('stats');
    }
  }, [loadedStats]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?warning=Vous devez être connecté pour accéder au jeu');
    }
  }, [user, authLoading, router]);

  const handleGameStateUpdate = useCallback((newState: KhidmaGameState) => {
    setGameState(newState);
  }, []);

  const handleManualSave = useCallback(async () => {
    try {
      if (!user) return;
      const result = await saveProgress(gameState);
      if (result) {
        console.log('✅ Partie sauvegardée');
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 pt-20 pb-32">
      {/* Fond calligraphique subtil */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 text-[15rem] font-arabic text-emerald-300/20"
          animate={{ opacity: [0.2, 0.4, 0.2], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        >
          بِسْمِ ٱللَّٰهِ
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* HEADER MODERNE MOURIDE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-700 to-green-900 rounded-3xl shadow-2xl mb-6 border border-emerald-500/20"
        >
          {/* Fond calligraphique */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-3 right-6 text-5xl font-arabic text-white">بسم الله الرحمن الرحيم</div>
            <div className="absolute bottom-4 left-6 text-4xl font-arabic text-white rotate-12">الحمد لله</div>
          </div>

          <div className="relative px-5 py-5 sm:py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Gauche: Titre + Niveau */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-2 blur-xl bg-yellow-400/40 rounded-full animate-pulse"></div>
                  <div className="relative bg-black/50 backdrop-blur-md border-2 border-yellow-400/70 rounded-2xl p-3">
                    <span className="text-5xl">{levelInfo.icon}</span>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Le Sentier de la <span className="text-yellow-300">Khidma</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-200 text-sm font-semibold bg-black/40 px-3 py-1.5 rounded-full border border-yellow-400/50">
                      {levelInfo.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Droite: Expérience + Ressources */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-yellow-100/80 text-xs font-medium">Expérience</p>
                  <p className="text-white text-xl font-bold flex items-center gap-1.5">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    {gameState.player.experience.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-black/50 backdrop-blur-lg rounded-2xl px-4 py-2.5 border border-white/20">
                  {[
                    { label: "💰", value: gameState.player.resources.faaida, color: "text-yellow-400" },
                    { label: "✨", value: gameState.player.resources.baraka, color: "text-emerald-300" },
                    { label: "🧠", value: gameState.player.resources.leveil, color: "text-cyan-300" },
                  ].map((res, i) => (
                    <div key={i} className="text-center">
                      <div className={`text-2xl ${res.color}`}>{res.label}</div>
                      <div className="text-white text-xs font-bold mt-0.5">
                        {res.value >= 10000 ? `${(res.value / 1000).toFixed(0)}k` : res.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-4 bg-black/60 rounded-full h-2 overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: currentLevel === 'murid' 
                    ? '100%' 
                    : `${((gameState.player.experience % 300) / 300) * 100}%`
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>

            {/* Citation */}
            <div className="mt-4 text-center">
              <p className="text-yellow-200/90 text-xs italic font-medium">
                « La réussite matérielle n'a de sens que par le savoir spirituel et le service désintéressé. »
              </p>
            </div>
          </div>
        </motion.div>

        {/* TABS MODERNES */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap justify-center gap-2 bg-black/40 backdrop-blur-xl rounded-2xl p-3 border border-gray-700/50">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all text-sm
                    ${isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl`}
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <span className="relative">{tab.icon}</span>
                  <span className="relative hidden sm:inline">{tab.label}</span>
                  <span className="relative sm:hidden">{tab.short}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* CONTENU PRINCIPAL */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="pb-20"
          >
            {activeTab === 'overview' && (
              <>
                <Overview gameState={gameState} onActivitySuggestion={handleActivitySuggestion} />

                {/* Grid de progression */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Progression Spirituelle */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-900/60 via-emerald-900/40 to-teal-900/40 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Progression Spirituelle</h3>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(DISCIPLE_LEVELS).map(([level, info]) => {
                        const isUnlocked = gameState.player.experience >= info.minExperience;
                        const isCurrent = currentLevel === level;

                        return (
                          <motion.div
                            key={level}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              isCurrent
                                ? 'border-yellow-500/50 bg-yellow-500/10'
                                : isUnlocked
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-gray-700 bg-gray-800/30 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`text-3xl p-2 rounded-lg ${
                                  isCurrent ? 'bg-yellow-500/20' : isUnlocked ? 'bg-emerald-500/20' : 'bg-gray-700'
                                }`}>
                                  {info.icon}
                                </div>
                                <div>
                                  <div className={`font-bold ${
                                    isCurrent ? 'text-yellow-300' : isUnlocked ? 'text-emerald-300' : 'text-gray-500'
                                  }`}>
                                    {info.name}
                                  </div>
                                  <div className="text-xs text-gray-400">{info.minExperience} XP requis</div>
                                </div>
                              </div>
                              {isCurrent && (
                                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                                  Actuel
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Objectifs Actuels */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-900/60 via-cyan-900/40 to-blue-900/40 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Objectifs Actuels</h3>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          icon: "🌱",
                          title: "Préparer la saison",
                          desc: "Cultivez 2 parcelles d'arachide",
                          progress: 60,
                          current: 3,
                          total: 5,
                          gradient: "from-yellow-500 to-amber-600"
                        },
                        {
                          icon: "🙏",
                          title: "Service communautaire",
                          desc: "Complétez 3 tâches de Khidma",
                          progress: 33,
                          current: 1,
                          total: 3,
                          gradient: "from-emerald-500 to-teal-600"
                        },
                        {
                          icon: "📚",
                          title: "Connaissance spirituelle",
                          desc: "Débloquez le portail Vie du Cheikh",
                          progress: 70,
                          current: 7,
                          total: 10,
                          gradient: "from-cyan-500 to-blue-600"
                        }
                      ].map((obj, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-black/40 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{obj.icon}</span>
                            <div className="flex-1">
                              <div className="font-bold text-white text-sm">{obj.title}</div>
                              <div className="text-xs text-gray-400">{obj.desc}</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${obj.gradient}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${obj.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {obj.current}/{obj.total} ({obj.progress}%)
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </>
            )}
            {activeTab === 'stats' && <PlayerStatsDisplay stats={loadedStats || null} isLoading={false} />}
            {activeTab === 'farm' && <FarmManagement gameState={gameState} onGameStateUpdate={handleGameStateUpdate} />}
            {activeTab === 'khidma' && <KhidmaSystem gameState={gameState} onGameStateUpdate={handleGameStateUpdate} />}
            {activeTab === 'learning' && <LearningPortals gameState={gameState} onGameStateUpdate={handleGameStateUpdate} />}
          </motion.div>
        </AnimatePresence>

        <GameProgressRecovery onGameSelect={handleGameSelect} />
      </div>
    </div>
  );
}