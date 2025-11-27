// app/jeux/components/PlayerStatsDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Trophy, 
  TrendingUp, 
  Zap, 
  Award, 
  Clock, 
  Target,
  Calendar,
  Star,
  Users,
  BookOpen,
  Activity,
  BarChart3
} from 'lucide-react';
import type { SavedGameStats } from '@/lib/hooks/useGameStats';

interface PlayerStatsDisplayProps {
  stats: SavedGameStats | null;
  isLoading: boolean;
}

export default function PlayerStatsDisplay({
  stats,
  isLoading
}: PlayerStatsDisplayProps) {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [detailedStats, setDetailedStats] = useState<any>(null);

  useEffect(() => {
    if (!stats) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `/api/game-stats/history?gameType=${encodeURIComponent(stats.gameType)}&limit=30`
        );
        if (response.ok) {
          const data = await response.json();
          // Transformer les données pour les graphiques
          const transformedData = data.map((item: any, idx: number) => ({
            date: new Date(item.created_at).toLocaleDateString('fr-FR'),
            experience: item.game_state?.player?.experience || 0,
            faaida: item.game_state?.player?.resources?.faaida || 0,
            baraka: item.game_state?.player?.resources?.baraka || 0,
            leveil: item.game_state?.player?.resources?.leveil || 0,
            level: item.game_state?.player?.level || 'talib',
            playTime: item.total_play_time || 0
          })).reverse();
          setHistoryData(transformedData);
        }
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      }
    };

    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/game-stats/achievements');
        if (response.ok) {
          const data = await response.json();
          setAchievements(data);
        }
      } catch (error) {
        console.error('Erreur chargement achievements:', error);
      }
    };

    const fetchDetailedStats = async () => {
      try {
        const response = await fetch(`/api/game-stats?gameType=${encodeURIComponent(stats.gameType)}`);
        if (response.ok) {
          const data = await response.json();
          // Calculer des statistiques détaillées
          const currentStats = {
            gameState: data.game_state,
            totalPlayTime: data.total_play_time || 0,
            averageSessionTime: data.total_play_time > 0 ? Math.floor(data.total_play_time / 10) : 0,
            lastActivity: data.last_saved,
            levelProgress: calculateLevelProgress(data.game_state?.player?.experience || 0),
            resourcesProgress: calculateResourcesProgress(data.game_state?.player?.resources || {}),
            achievementsUnlocked: data.achievements?.length || 0
          };
          setDetailedStats(currentStats);
        }
      } catch (error) {
        console.error('Erreur chargement stats détaillées:', error);
      }
    };

    fetchHistory();
    fetchAchievements();
    fetchDetailedStats();
  }, [stats]);

  const calculateLevelProgress = (experience: number) => {
    const levels = [
      { name: 'talib', minExp: 0, maxExp: 100 },
      { name: 'khadim', minExp: 100, maxExp: 300 },
      { name: 'salik', minExp: 300, maxExp: 600 },
      { name: 'murid', minExp: 600, maxExp: 1000 }
    ];
    
    const currentLevel = levels.find(level => experience >= level.minExp && experience < level.maxExp) || levels[3];
    const progressInLevel = experience - currentLevel.minExp;
    const totalForLevel = currentLevel.maxExp - currentLevel.minExp;
    
    return {
      current: currentLevel.name,
      progress: Math.min(100, (progressInLevel / totalForLevel) * 100),
      nextLevel: levels[levels.indexOf(currentLevel) + 1]?.name || null
    };
  };

  const calculateResourcesProgress = (resources: any) => {
    const maxResources = { faaida: 1000, baraka: 500, leveil: 200 };
    return Object.keys(maxResources).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      current: resources[key] || 0,
      max: maxResources[key as keyof typeof maxResources],
      percentage: Math.min(100, ((resources[key] || 0) / maxResources[key as keyof typeof maxResources]) * 100)
    }));
  };

  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      talib: 'from-blue-500 to-indigo-600',
      khadim: 'from-green-500 to-teal-600', 
      salik: 'from-orange-500 to-red-600',
      murid: 'from-purple-500 to-pink-600'
    };
    return colors[level as keyof typeof colors] || colors.talib;
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Chargement de vos statistiques...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">Aucune statistique disponible</p>
      </div>
    );
  }

  const gameState = stats.gameState;
  const player = gameState.player;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Résumé principal */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`bg-gradient-to-br ${getLevelColor(player?.level)} rounded-lg p-4 sm:p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-white/80">Niveau</div>
              <div className="text-2xl sm:text-3xl font-bold capitalize">{player?.level}</div>
              {detailedStats?.levelProgress && (
                <div className="text-xs text-white/70 mt-1">
                  {Math.round(detailedStats.levelProgress.progress)}% vers {detailedStats.levelProgress.nextLevel}
                </div>
              )}
            </div>
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-50 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-purple-100">Expérience</div>
              <div className="text-2xl sm:text-3xl font-bold">{player?.experience || 0}</div>
            </div>
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-50 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-blue-100">Achievements</div>
              <div className="text-2xl sm:text-3xl font-bold">{achievements.length}</div>
            </div>
            <Award className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-50 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-orange-100">Temps total</div>
              <div className="text-xl sm:text-2xl font-bold">
                {formatPlayTime(stats.totalPlayTime)}
              </div>
            </div>
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-50 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      {detailedStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-center mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {Math.round(detailedStats.levelProgress.progress)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Vers {detailedStats.levelProgress.nextLevel}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Dernière activité</span>
            </div>
            <div className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white mb-1">
              {new Date(detailedStats.lastActivity).toLocaleDateString('fr-FR')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Date</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-center mb-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Session moyenne</span>
            </div>
            <div className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white mb-1">
              {formatPlayTime(detailedStats.averageSessionTime)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Durée</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Niveau actuel</span>
            </div>
            <div className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white mb-1 capitalize">
              {detailedStats.levelProgress.current}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Statut</div>
          </div>
        </div>
      )}

      {/* Ressources du joueur avec barres de progression */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Ressources actuelles
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {detailedStats?.resourcesProgress?.map((resource: any, idx: number) => (
            <div key={resource.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {resource.name}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {resource.current} / {resource.max}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                  style={{ width: `${resource.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-right text-gray-500 dark:text-gray-400">
                {Math.round(resource.percentage)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphiques d'évolution */}
      {historyData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Évolution de l'expérience */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Évolution de l'Expérience
            </h3>
            <ResponsiveContainer width="100%" height={240} className="sm:min-h-[300px]">
              <AreaChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    fontSize: '12px',
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="experience" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Évolution des ressources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Évolution des Ressources
            </h3>
            <ResponsiveContainer width="100%" height={250} className="sm:min-h-[300px]">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    fontSize: '12px',
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="faaida" stroke="#F59E0B" name="Faaïda" strokeWidth={2} />
                <Line type="monotone" dataKey="baraka" stroke="#3B82F6" name="Baraka" strokeWidth={2} />
                <Line type="monotone" dataKey="leveil" stroke="#8B5CF6" name="L'Éveil" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
            Achievements ({achievements.length})
          </h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 touch-manipulation hover:shadow-md transition-all duration-300">
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">{achievement.icon || '⭐'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base mb-1 line-clamp-1">
                      {achievement.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {achievement.description}
                    </div>
                    {achievement.date_earned && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(achievement.date_earned).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si pas d'achievements */}
      {achievements.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg text-center">
          <Award className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-2">
            Pas d'achievements encore
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Continuez à jouer pour débloquer vos premiers achievements !
          </p>
        </div>
      )}
    </div>
  );
}