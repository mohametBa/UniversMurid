// app/jeux/components/Overview.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Star, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  MapPin,
  Users,
  Zap,
  BookOpen,
  Heart,
  Gift
} from 'lucide-react';
import type { KhidmaGameState } from '../types';
import { useGameStats } from '@/lib/hooks/useGameStats';

interface OverviewProps {
  gameState: KhidmaGameState;
  onActivitySuggestion?: (tabName: 'farm' | 'khidma' | 'learning' | 'stats') => void;
}

export default function Overview({ gameState, onActivitySuggestion }: OverviewProps) {
  // Utiliser le hook useGameStats pour récupérer les stats sauvegardées
  const {
    loadedStats,
    isLoading: isStatsLoading,
    totalPlayTime
  } = useGameStats(gameState, {
    gameType: 'khidma_sentier',
    autoSaveInterval: 60000
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Utiliser les stats sauvegardées ou initialiser à 0 si inexistantes
  const getQuickStats = () => {
    // Utiliser les stats sauvegardées si disponibles, sinon utiliser le gameState actuel
    const sourceState = loadedStats?.gameState || gameState;
    
    const completedTasks = sourceState.khidma?.completedTasks?.length || 0;
    const unlockedLocations = sourceState.player?.unlockedLocations?.length || 1;
    const readyHarvests = sourceState.farm?.plots?.filter(plot => plot.isReady).length || 0;
    const totalAnimals = (sourceState.farm?.animals?.poules || 0) + (sourceState.farm?.animals?.boeufs || 0);
    
    return {
      completedTasks,
      unlockedLocations,
      readyHarvests,
      totalAnimals
    };
  };

  const quickStats = getQuickStats();

  // Suggestions d'activités
  const getActivitySuggestions = () => {
    // Utiliser les stats sauvegardées ou initialiser à 0 si inexistantes
    const sourceState = loadedStats?.gameState || gameState;
    
    const suggestions = [];
    
    if (quickStats.readyHarvests > 0) {
      suggestions.push({
        icon: <Target className="w-5 h-5" />,
        title: "Récolter vos cultures",
        description: `${quickStats.readyHarvests} parcelle(s) prête(s) à récoler`,
        action: "Aller à l'agriculture",
        tab: "farm",
        color: "from-green-500 to-emerald-500"
      });
    }
    
    if (sourceState.khidma?.currentStreak === 0) {
      suggestions.push({
        icon: <Heart className="w-5 h-5" />,
        title: "Commencer une nouvelle Khidma",
        description: "Maintenez votre streak quotidien",
        action: "Commencer",
        tab: "khidma",
        color: "from-blue-500 to-indigo-500"
      });
    }
    
    suggestions.push({
      icon: <BookOpen className="w-5 h-5" />,
      title: "Apprendre quelque chose de nouveau",
      description: "Explorez les portails d'apprentissage",
      action: "Découvrir",
      tab: "learning",
      color: "from-purple-500 to-pink-500"
    });
    
    return suggestions.slice(0, 3); // Limiter à 3 suggestions
  };

  const activitySuggestions = getActivitySuggestions();

  // Accomplissements récents
  const getRecentAchievements = () => {
    // Utiliser les stats sauvegardées ou initialiser à 0 si inexistantes
    const sourceState = loadedStats?.gameState || gameState;
    
    const achievements = [];
    
    if (quickStats.completedTasks > 0) {
      achievements.push({
        icon: <Trophy className="w-4 h-4 text-yellow-500" />,
        title: `${quickStats.completedTasks} tâche(s) accomplie(s)`,
        time: "Aujourd'hui"
      });
    }
    
    if (sourceState.player?.level === 'khadim' || sourceState.player?.level === 'salik' || sourceState.player?.level === 'murid') {
      achievements.push({
        icon: <Award className="w-4 h-4 text-purple-500" />,
        title: `Niveau ${sourceState.player.level} atteint`,
        time: "Récent"
      });
    }
    
    if (quickStats.totalAnimals >= 5) {
      achievements.push({
        icon: <Users className="w-4 h-4 text-green-500" />,
        title: "Élevage prospère",
        time: "Cette semaine"
      });
    }
    
    return achievements.slice(0, 4);
  };

  const recentAchievements = getRecentAchievements();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* En-tête de bienvenue */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Bienvenue sur votre Sentier ✨
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {formatDate(currentTime)} à {formatTime(currentTime)}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Prochaine session</div>
            <div className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
              Demain matin
            </div>
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />
            <span className="font-medium text-sm sm:text-base">Localisation actuelle : {(loadedStats?.gameState || gameState).currentLocation}</span>
            {isStatsLoading && (
              <div className="ml-2 animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-amber-600"></div>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            {loadedStats ? 'Données chargées depuis la base de données' : 'Utilisation des données locales (initialisation à zéro)'}
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Tâches</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{quickStats.completedTasks}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Accomplies</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Lieux</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{quickStats.unlockedLocations}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Déverrouillés</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Récoltes</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{quickStats.readyHarvests}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Prêtes</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Animaux</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{quickStats.totalAnimals}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Dans la ferme</div>
        </div>
      </div>

      {/* Suggestions d'activités */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
            Que faire ensuite ?
          </h3>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {activitySuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group touch-manipulation"
              onClick={() => {
                if (onActivitySuggestion) {
                  onActivitySuggestion(suggestion.tab as 'farm' | 'khidma' | 'learning' | 'stats');
                }
              }}
            >
              <div className="flex items-center mb-2 sm:mb-0">
                <div className={`p-2 sm:p-3 bg-gradient-to-r ${suggestion.color} rounded-lg text-white mr-3 sm:mr-4 flex-shrink-0`}>
                  {suggestion.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white text-sm sm:text-base">
                    {suggestion.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {suggestion.action}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Cliquer →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accomplissements récents */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-500" />
            Accomplissements récents
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          {recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg touch-manipulation">
                  <div className="mr-3 flex-shrink-0">
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 dark:text-white text-sm sm:text-base truncate">
                      {achievement.title}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {achievement.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
              <Gift className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm sm:text-base">Accomplissez vos premières tâches pour voir vos réalisations ici !</p>
            </div>
          )}
        </div>
      </div>

      {/* Conseil du jour */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white mr-0 sm:mr-4 flex-shrink-0 mb-3 sm:mb-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">
              💡 Conseil du jour
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              Maintenir une régularité dans vos Khidmas renforce votre streak et multiplie les récompenses. 
              Même une petite action quotidienne a plus de valeur que de grands efforts sporadiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}