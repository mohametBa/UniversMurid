'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Heart, 
  Users, 
  Clock, 
  Star,
  Calendar,
  CheckCircle,
  Award,
  HandHeart,
  Building,
  GraduationCap,
  Trophy,
  Target,
  Sparkles,
  Save,
  RotateCcw,
  Play,
  Pause,
  Crown,
  TrendingUp
} from 'lucide-react';
import { KhidmaTask, KhidmaGameState, KhidmaProgress } from '../types';
import { useGameStats } from '@/lib/hooks/useGameStats';
import { useAuth } from '@/lib/auth/context';
import { KHIDMA_TASKS, DIFFICULTY_CONFIG } from '../constants';

interface KhidmaSystemProps {
  gameState: KhidmaGameState;
  onGameStateUpdate: (newState: KhidmaGameState) => void;
}



export default function KhidmaSystem({ gameState, onGameStateUpdate }: KhidmaSystemProps) {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<KhidmaTask | null>(null);
  const [isTaskInProgress, setIsTaskInProgress] = useState(false);
  const [taskProgress, setTaskProgress] = useState(0);
  const [showReputationModal, setShowReputationModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Hook pour la gestion automatique de la progression
  const {
    gameState: savedGameState,
    activeTasks: savedActiveTasks,
    currentSession,
    isLoading,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    markAsChanged,
    saveTaskProgress,
  } = useGameStats(gameState, { gameType: 'khidma_sentier' });

  // Calculer les statistiques de Khidma
  const khidmaStats = {
    completedTasks: gameState.khidma.completedTasks.length,
    totalBarakaEarned: gameState.khidma.totalBarakaEarned,
    reputationLevel: gameState.khidma.reputationLevel,
    currentStreak: gameState.khidma.currentStreak,
    barakaForNextLevel: gameState.khidma.reputationLevel * 100
  };

  const availableTasks = KHIDMA_TASKS.filter(task => !task.isCompleted);
  const completedTasks = KHIDMA_TASKS.filter(task => task.isCompleted);

  const updateGameState = useCallback((newState: KhidmaGameState) => {
    onGameStateUpdate(newState);
    // Sauvegarder automatiquement l'état
    markAsChanged(newState);
  }, [onGameStateUpdate, markAsChanged]);

  const startTask = async (task: KhidmaTask) => {
    if (isTaskInProgress) return;
    
    setSelectedTask(task);
    setIsTaskInProgress(true);
    setTaskProgress(0);

    // Enregistrer la tâche en cours
    await saveTaskProgress(task.id, task.type, 0);

    // Simuler la progression de la tâche
    const progressInterval = setInterval(() => {
      setTaskProgress(prev => {
        const newProgress = prev + (100 / (task.timeRequired * 2)); // 2% par seconde
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          completeTask(task);
          return 100;
        }
        
        // Sauvegarder la progression de la tâche
        saveTaskProgress(task.id, task.type, Math.floor(newProgress));
        
        return newProgress;
      });
    }, 1000);
  };

  const completeTask = async (task: KhidmaTask) => {
    const newBaraka = task.barakaReward;
    const newFaaida = task.faaidaReward;
    const experienceGain = task.barakaReward;

    // Mettre à jour les ressources
    const newResources = {
      ...gameState.player.resources,
      faaida: gameState.player.resources.faaida + newFaaida,
      baraka: gameState.player.resources.baraka + newBaraka
    };

    // Calculer le nouveau niveau de réputation
    const newTotalBaraka = gameState.khidma.totalBarakaEarned + newBaraka;
    const newReputationLevel = Math.floor(newTotalBaraka / 100) + 1;
    const newStreak = gameState.khidma.currentStreak + 1;

    // Marquer la tâche comme terminée dans le système de progression
    await saveTaskProgress(task.id, task.type, 100, true);

    const newGameState = {
      ...gameState,
      player: {
        ...gameState.player,
        resources: newResources,
        experience: gameState.player.experience + experienceGain
      },
      khidma: {
        ...gameState.khidma,
        completedTasks: [...gameState.khidma.completedTasks, task],
        totalBarakaEarned: newTotalBaraka,
        reputationLevel: newReputationLevel,
        currentStreak: newStreak
      }
    };

    updateGameState(newGameState);

    setIsTaskInProgress(false);
    setSelectedTask(null);
    setTaskProgress(0);

    // Afficher le niveau de réputation s'il a augmenté
    if (newReputationLevel > gameState.khidma.reputationLevel) {
      setTimeout(() => setShowReputationModal(true), 500);
    }
  };

  const getTaskTypeIcon = (type: KhidmaTask['type']) => {
    switch (type) {
      case 'daara': return <GraduationCap className="w-5 h-5" />;
      case 'magal': return <Trophy className="w-5 h-5" />;
      case 'travaux_collectifs': return <Building className="w-5 h-5" />;
      case 'aide_communaute': return <HandHeart className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getTaskTypeName = (type: KhidmaTask['type']) => {
    switch (type) {
      case 'daara': return 'Enseignement';
      case 'magal': return 'Célébration';
      case 'travaux_collectifs': return 'Travaux';
      case 'aide_communaute': return 'Aide Humanitaire';
      default: return 'Communauté';
    }
  };

  // Vérifier s'il y a des tâches en cours à reprendre
  useEffect(() => {
    if (savedActiveTasks && savedActiveTasks.length > 0 && !isTaskInProgress) {
      setShowResumeModal(true);
    }
  }, [savedActiveTasks, isTaskInProgress]);

  // Fonction pour reprendre une tâche interrompue
  const resumeTask = async (savedTask: any) => {
    const task = KHIDMA_TASKS.find(t => t.id === savedTask.task_id);
    if (!task) return;

    setSelectedTask(task);
    setIsTaskInProgress(true);
    setTaskProgress(savedTask.progress_percentage);

    // Continuer la progression de la tâche
    const progressInterval = setInterval(() => {
      setTaskProgress(prev => {
        const newProgress = Math.max(prev, savedTask.progress_percentage) + (100 / (task.timeRequired * 2));
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          completeTask(task);
          return 100;
        }
        
        // Sauvegarder la progression
        saveTaskProgress(task.id, task.type, Math.floor(newProgress));
        
        return newProgress;
      });
    }, 1000);

    setShowResumeModal(false);
  };

  // Formater le temps de dernière sauvegarde
  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Jamais sauvegardé';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-orange-200 dark:border-gray-700 shadow-xl">
      {/* Header du système de Khidma */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-800 dark:text-orange-300 flex items-center mb-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg mr-3">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              Système de Khidma
            </h2>
            <p className="text-orange-600 dark:text-orange-400 text-sm sm:text-base">Service communautaire et développement spirituel</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-xs text-orange-200 mb-1">Réputation Actuelle</div>
            <div className="text-3xl font-bold flex items-center">
              <Crown className="w-7 h-7 mr-2 text-yellow-300" />
              Niveau {khidmaStats.reputationLevel}
            </div>
          </div>
        </div>

        {/* Indicateur de sauvegarde automatique */}
        {user && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-orange-200 dark:border-gray-700 mb-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                  ) : hasUnsavedChanges ? (
                    <Save className="w-4 h-4 text-orange-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    {isSaving ? 'Sauvegarde en cours...' : 
                     hasUnsavedChanges ? 'Modifications non sauvegardées' :
                     `Dernière sauvegarde: ${formatLastSaved(lastSaved)}`}
                  </span>
                </div>
              </div>
              
              {currentSession && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-500 dark:text-gray-400">Session active</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{khidmaStats.completedTasks}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Tâches complétées</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-red-200 dark:border-red-800 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-red-600" />
              </div>
              <Heart className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-1">{khidmaStats.totalBarakaEarned}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Baraka totale</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <Trophy className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{khidmaStats.currentStreak}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Série actuelle</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <Star className="w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{khidmaStats.barakaForNextLevel - khidmaStats.totalBarakaEarned}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Baraka pour niveau +</div>
          </div>
        </div>
      </div>

      {/* Barre de progression de réputation */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-orange-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg mr-3">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-orange-800 dark:text-orange-300">
                Progression Réputation Niveau {khidmaStats.reputationLevel}
              </span>
              <p className="text-xs text-orange-600 dark:text-orange-400">Prochain niveau dans {khidmaStats.barakaForNextLevel - khidmaStats.totalBarakaEarned} Baraka</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-600 dark:text-gray-400 mb-1">Progression</div>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">
              {khidmaStats.totalBarakaEarned}/{khidmaStats.barakaForNextLevel}
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-500 shadow-lg"
            style={{ 
              width: `${Math.min((khidmaStats.totalBarakaEarned % 100), 100)}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-600 dark:text-gray-400">
          <span>Niveau {khidmaStats.reputationLevel}</span>
          <span>{Math.round((khidmaStats.totalBarakaEarned % 100))}%</span>
          <span>Niveau {khidmaStats.reputationLevel + 1}</span>
        </div>
      </div>

      {/* Tâches en cours */}
      {isTaskInProgress && selectedTask && (
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-2xl border border-emerald-300">
          <div className="flex items-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
              {getTaskTypeIcon(selectedTask.type)}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{selectedTask.title}</h3>
              <p className="text-emerald-200 text-sm">{getTaskTypeName(selectedTask.type)}</p>
            </div>
          </div>
          
          <p className="text-emerald-100 mb-6 leading-relaxed">{selectedTask.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-semibold">Durée</span>
              </div>
              <div className="text-2xl font-bold">{selectedTask.timeRequired} min</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-semibold">Récompense</span>
              </div>
              <div className="text-2xl font-bold">+{selectedTask.barakaReward}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Progression</span>
                <span className="text-lg font-bold">{Math.round(taskProgress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000 shadow-lg"
                  style={{ width: `${taskProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium">Tâche en cours d'exécution...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des tâches disponibles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availableTasks.map((task) => {
          const difficultyConfig = DIFFICULTY_CONFIG[task.difficulty];
          const colorClasses = {
            green: {
              border: 'border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500',
              bg: 'bg-green-50 dark:bg-green-900/10',
              iconBg: 'bg-green-100 dark:bg-green-900/30',
              icon: 'text-green-600',
              badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
              button: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            },
            yellow: {
              border: 'border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500',
              bg: 'bg-yellow-50 dark:bg-yellow-900/10',
              iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
              icon: 'text-yellow-600',
              badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
              button: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
            },
            red: {
              border: 'border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500',
              bg: 'bg-red-50 dark:bg-red-900/10',
              iconBg: 'bg-red-100 dark:bg-red-900/30',
              icon: 'text-red-600',
              badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
              button: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
            }
          };
          const colors = colorClasses[difficultyConfig.color as keyof typeof colorClasses];
          
          return (
            <div
              key={task.id}
              className={`group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${colors.border}`}
              onClick={() => !isTaskInProgress && startTask(task)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`${colors.iconBg} p-3 rounded-xl mr-4 transition-all group-hover:scale-110`}>
                    <div className={colors.icon}>
                      {getTaskTypeIcon(task.type)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{task.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-gray-400">{getTaskTypeName(task.type)}</p>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.badge}`}>
                  {task.difficulty === 'easy' ? '🟢 Facile' : task.difficulty === 'medium' ? '🟡 Moyen' : '🔴 Difficile'}
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-gray-300 mb-6 leading-relaxed">{task.description}</p>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{task.timeRequired}min</div>
                  <div className="text-xs text-slate-600 dark:text-gray-400">Durée</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Sparkles className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-lg font-bold text-red-600">+{task.barakaReward}</div>
                  <div className="text-xs text-red-600">Baraka</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-green-600 font-bold text-sm">F</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">+{task.faaidaReward}</div>
                  <div className="text-xs text-green-600">Faaïda</div>
                </div>
              </div>
              
              <button
                disabled={isTaskInProgress}
                className={`w-full ${colors.button} disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center group-hover:scale-105`}
              >
                {isTaskInProgress ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Occupé...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Commencer cette tâche
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Historique des tâches complétées */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Tâches Complétées
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {completedTasks.slice(-6).map((task) => (
              <div key={task.id} className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">{task.title}</span>
                  </div>
                  <span className="text-xs text-green-600">+{task.barakaReward} ✨</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de niveau de réputation */}
      {showReputationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Félicitations !</h3>
            <p className="text-lg text-slate-600 mb-6">
              Votre dévouement vous a élevé au <strong>Niveau {khidmaStats.reputationLevel}</strong> !
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Réputation Accrue</span>
              </div>
              <p className="text-sm text-slate-600">
                Les membres de la communauté vous font plus confiance et certains services s'ouvrent à vous.
              </p>
            </div>
            
            <button
              onClick={() => setShowReputationModal(false)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}