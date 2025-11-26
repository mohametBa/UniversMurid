'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useGameStats } from '@/lib/hooks/useGameStats';
import { 
  RotateCcw, 
  Play, 
  X, 
  Clock,
  Star,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GameProgressRecoveryProps {
  onGameSelect?: (gameType: string) => void;
}

interface ActiveGameSession {
  gameType: string;
  gameName: string;
  progressPercentage: number;
  lastActivity: string;
  estimatedTimeRemaining: number;
  icon: React.ReactNode;
}

export default function GameProgressRecovery({ onGameSelect }: GameProgressRecoveryProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [activeSessions, setActiveSessions] = useState<ActiveGameSession[]>([]);

  // Hooks pour chaque type de jeu
  const khidma = useGameStats({} as any, { gameType: 'khidma_sentier' });
  const quiz = useGameStats({} as any, { gameType: 'quiz' });
  const learning = useGameStats({} as any, { gameType: 'learning_portal' });

  // Vérifier s'il y a des sessions actives
  useEffect(() => {
    if (!user?.id) {
      setShowRecoveryModal(false);
      return;
    }

    const sessions: ActiveGameSession[] = [];

    // Vérifier Khidma
    if (khidma.activeTasks && khidma.activeTasks.length > 0) {
      const task = khidma.activeTasks[0];
      sessions.push({
        gameType: 'khidma',
        gameName: 'Khidma - Service Communautaire',
        progressPercentage: task.progress || 0,
        lastActivity: task.startTime,
        estimatedTimeRemaining: Math.max(5, 30 - ((task.progress || 0) / 100) * 30),
        icon: <Trophy className="w-5 h-5 text-blue-600" />
      });
    }

    // Vérifier Quiz
    if (quiz.activeTasks && quiz.activeTasks.length > 0) {
      const task = quiz.activeTasks[0];
      sessions.push({
        gameType: 'quiz',
        gameName: 'Quiz - Tests de Connaissance',
        progressPercentage: task.progress || 0,
        lastActivity: task.startTime,
        estimatedTimeRemaining: Math.max(5, 15 - ((task.progress || 0) / 100) * 15),
        icon: <Star className="w-5 h-5 text-yellow-600" />
      });
    }

    // Vérifier Learning Portal
    if (learning.activeTasks && learning.activeTasks.length > 0) {
      const task = learning.activeTasks[0];
      sessions.push({
        gameType: 'learning_portal',
        gameName: 'Portails d\'Apprentissage',
        progressPercentage: task.progress || 0,
        lastActivity: task.startTime,
        estimatedTimeRemaining: Math.max(5, 20 - ((task.progress || 0) / 100) * 20),
        icon: <CheckCircle className="w-5 h-5 text-green-600" />
      });
    }

    console.log('Sessions actives trouvées:', sessions);
    setActiveSessions(sessions);

    // Afficher la modal s'il y a des sessions actives
    if (sessions.length > 0) {
      setShowRecoveryModal(true);
    }
  }, [user?.id, khidma.activeTasks, quiz.activeTasks, learning.activeTasks]);

  // Formater le temps écoulé
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'À l\'instant';
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      
      return `Il y a ${Math.floor(diffHours / 24)} jour(s)`;
    } catch {
      return 'Récemment';
    }
  };

  // Reprendre une session spécifique
  const resumeSession = async (gameType: string) => {
    console.log('🎮 Reprise de session:', gameType);
    
    // Appeler le callback parent
    if (onGameSelect) {
      onGameSelect(gameType);
    }
    
    // Naviguer vers le jeu
    router.push(`/games/${gameType}`);
    
    // Fermer la modal
    setShowRecoveryModal(false);
  };

  // Fermer la modal
  const closeModal = () => {
    setShowRecoveryModal(false);
  };

  if (!showRecoveryModal || activeSessions.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Reprendre votre progression
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Nous avons détecté {activeSessions.length} session{activeSessions.length > 1 ? 's' : ''} de jeu en cours
          </p>
        </div>

        {/* Liste des sessions actives */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {activeSessions.map((session) => (
            <div 
              key={session.gameType}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {session.icon}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{session.gameName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(session.lastActivity)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(session.progressPercentage)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ~{Math.round(session.estimatedTimeRemaining)}min restantes
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(session.progressPercentage)}%` }}
                ></div>
              </div>

              <button
                onClick={() => resumeSession(session.gameType)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Reprendre cette session
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={closeModal}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center"
          >
            <X className="w-4 h-4 mr-2" />
            Continuer sans reprendre
          </button>
        </div>
      </div>
    </div>
  );
}