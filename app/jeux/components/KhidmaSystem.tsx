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
  Pause
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
    <div className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-orange-200 dark:border-gray-700">
      {/* Header du système de Khidma */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3" />
            Système de Khidma
          </h2>
          <div className="text-left sm:text-right">
            <div className="text-sm text-orange-600">Réputation</div>
            <div className="text-xl sm:text-2xl font-bold text-orange-800">Niveau {khidmaStats.reputationLevel}</div>
          </div>
        </div>

        {/* Indicateur de sauvegarde automatique */}
        {user && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-lg p-3 border border-orange-200 mb-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              ) : hasUnsavedChanges ? (
                <Save className="w-4 h-4 text-orange-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm text-gray-600">
                {isSaving ? 'Sauvegarde en cours...' : 
                 hasUnsavedChanges ? 'Modifications non sauvegardées' :
                 `Dernière sauvegarde: ${formatLastSaved(lastSaved)}`}
              </span>
            </div>
            
            {currentSession && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">Session active</span>
              </div>
            )}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-orange-200">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{khidmaStats.completedTasks}</div>
            <div className="text-xs sm:text-sm text-slate-600">Tâches complétées</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-orange-200">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{khidmaStats.totalBarakaEarned}</div>
            <div className="text-xs sm:text-sm text-slate-600">Baraka totale</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-orange-200">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{khidmaStats.currentStreak}</div>
            <div className="text-xs sm:text-sm text-slate-600">Série actuelle</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-orange-200">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{khidmaStats.barakaForNextLevel - khidmaStats.totalBarakaEarned}</div>
            <div className="text-xs sm:text-sm text-slate-600">Baraka pour niveau +</div>
          </div>
        </div>
      </div>

      {/* Barre de progression de réputation */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-orange-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-orange-800">
            Progression Réputation Niveau {khidmaStats.reputationLevel}
          </span>
          <span className="text-sm text-slate-600">
            {khidmaStats.totalBarakaEarned}/{khidmaStats.barakaForNextLevel} Baraka
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min((khidmaStats.totalBarakaEarned % 100), 100)}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Tâches en cours */}
      {isTaskInProgress && selectedTask && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center mb-4">
            {getTaskTypeIcon(selectedTask.type)}
            <h3 className="text-xl font-bold ml-3">{selectedTask.title}</h3>
          </div>
          
          <p className="text-green-100 mb-4">{selectedTask.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{selectedTask.timeRequired}min</span>
              </div>
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                <span className="text-sm">+{selectedTask.barakaReward} Baraka</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-200">Progression</div>
              <div className="text-lg font-bold">{Math.round(taskProgress)}%</div>
            </div>
          </div>
          
          <div className="w-full bg-green-400/30 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-1000"
              style={{ width: `${taskProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Liste des tâches disponibles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {availableTasks.map((task) => {
          const difficultyConfig = DIFFICULTY_CONFIG[task.difficulty];
          
          return (
            <div
              key={task.id}
              className={`bg-white rounded-xl p-4 sm:p-5 border-2 ${
                difficultyConfig.color === 'green' ? 'border-green-200' :
                difficultyConfig.color === 'yellow' ? 'border-yellow-200' : 'border-red-200'
              } hover:shadow-lg transition-all cursor-pointer`}
              onClick={() => !isTaskInProgress && startTask(task)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    difficultyConfig.color === 'green' ? 'bg-green-50' :
                    difficultyConfig.color === 'yellow' ? 'bg-yellow-50' : 'bg-red-50'
                  } mr-2 sm:mr-3`}>
                    {getTaskTypeIcon(task.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{task.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600">{getTaskTypeName(task.type)}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-center ${
                  difficultyConfig.color === 'green' ? 'text-green-600 bg-green-50' :
                  difficultyConfig.color === 'yellow' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
                }`}>
                  {task.difficulty === 'easy' ? 'Facile' : task.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-600 mb-4">{task.description}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>{task.timeRequired}min</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>+{task.barakaReward}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600">+{task.faaidaReward}F</span>
                  </div>
                </div>
                
                <button
                  disabled={isTaskInProgress}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors self-start sm:self-center"
                >
                  {isTaskInProgress ? 'Occupé...' : 'Commencer'}
                </button>
              </div>
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