'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import type { KhidmaGameState } from '@/app/jeux/types';

export interface ActiveTask {
  id: string;
  taskId: string;
  taskType: string;
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  isCompleted: boolean;
}

export interface SavedGameStats {
  gameType: string;
  gameState: KhidmaGameState;
  totalPlayTime: number;
  sessionPlayTime: number;
  lastSaved?: string;
  version?: number;
}

interface UseGameProgressOptions {
  autoSaveInterval?: number;
  gameType?: string;
  onLoad?: (data: SavedGameStats) => void;
  onSaveSuccess?: (data: SavedGameStats) => void;
  onSaveError?: (error: Error) => void;
}

interface GameStatsReturn {
  gameState: KhidmaGameState;
  setGameState: React.Dispatch<React.SetStateAction<KhidmaGameState>>;
  activeTasks: ActiveTask[];
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
  saveProgress: (newGameState: KhidmaGameState) => Promise<KhidmaGameState | undefined>;
  scheduleAutoSave: (newGameState: KhidmaGameState) => void;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  sessionPlayTime: number;
  totalPlayTime: number;
  loadedStats: SavedGameStats | null;
  markAsChanged: (newGameState: KhidmaGameState) => void;
  saveTaskProgress: (taskId: string, taskType: string, progress: number, isCompleted?: boolean) => Promise<void>;
  currentSession: boolean;
}

export function useGameStats(
  initialGameState: KhidmaGameState,
  options: UseGameProgressOptions = {}
): GameStatsReturn {
  const {
    autoSaveInterval = 30000,
    gameType = 'khidma_sentier',
    onLoad,
    onSaveSuccess,
    onSaveError
  } = options;

  const { user } = useAuth();
  const supabase = createClient();

  const [gameState, setGameState] = useState<KhidmaGameState>(initialGameState);
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [savedStats, setSavedStats] = useState<SavedGameStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionPlayTime, setSessionPlayTime] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const sessionStartRef = useRef(Date.now());
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<KhidmaGameState | null>(null);
  const lastSaveRef = useRef<number>(0);

  // Obtenir le token d'accès pour les appels API
  const getAuthToken = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  };

  // Extraire les tâches actives
  const extractActiveTasks = useCallback((state: KhidmaGameState) => {
    const tasks: ActiveTask[] = [];

    if (state?.khidma?.completedTasks) {
      state.khidma.completedTasks.forEach((task: any, idx: number) => {
        if (!task.isCompleted) {
          tasks.push({
            id: `khidma-${idx}`,
            taskId: task.id || `task-${idx}`,
            taskType: 'khidma',
            progress: task.progress || 0,
            startTime: task.startTime || new Date().toISOString(),
            estimatedCompletion: task.estimatedCompletion,
            isCompleted: false
          });
        }
      });
    }

    setActiveTasks(tasks);
  }, []);

  // Chargement de la sauvegarde existante
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);

      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Pas de token d\'authentification');
        }

        const response = await fetch(`/api/game-stats?gameType=${gameType}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setIsLoading(false);
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (data?.game_state) {
          setGameState(data.game_state);
          extractActiveTasks(data.game_state);
          setTotalPlayTime(data.total_play_time || 0);

          const sessionPlay = Math.floor((Date.now() - new Date(data.last_saved).getTime()) / 1000);

          const loaded: SavedGameStats = {
            gameType,
            gameState: data.game_state,
            totalPlayTime: data.total_play_time || 0,
            sessionPlayTime: Math.max(0, sessionPlay),
            lastSaved: data.last_saved,
            version: data.version || 1
          };

          setSavedStats(loaded);
          onLoad?.(loaded);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user?.id, gameType, extractActiveTasks, onLoad]);

  // Sauvegarde principale via API
  const saveProgress = useCallback(
    async (newGameState: KhidmaGameState): Promise<KhidmaGameState | undefined> => {
      try {
        setIsSaving(true);
        
        if (!user) {
          pendingDataRef.current = newGameState;
          return;
        }

        const token = await getAuthToken();
        if (!token) {
          throw new Error('Pas de token d\'authentification');
        }

        const response = await fetch('/api/game-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            gameType,
            gameState: newGameState,
            sessionPlayTime
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
        }

        const saved = await response.json();

        lastSaveRef.current = Date.now();
        pendingDataRef.current = null;
        setTotalPlayTime(saved.total_play_time || 0);

        onSaveSuccess?.({
          gameType,
          gameState: newGameState,
          totalPlayTime: saved.total_play_time || 0,
          sessionPlayTime: sessionPlayTime,
          lastSaved: new Date().toISOString()
        });

        return newGameState;
      } catch (err) {
        console.error('Erreur lors de la sauvegarde:', err);
        onSaveError?.(err as Error);
      } finally {
        setIsSaving(false);
      }
    },
    [user, gameType, sessionPlayTime]
  );

  // Auto-save intelligent
  const scheduleAutoSave = useCallback(
    (newGameState: KhidmaGameState) => {
      pendingDataRef.current = newGameState;
      setGameState(newGameState);

      const now = Date.now();

      if (now - lastSaveRef.current < 5000) {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(
          () => pendingDataRef.current && saveProgress(pendingDataRef.current),
          autoSaveInterval
        );
        return;
      }

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => saveProgress(newGameState), autoSaveInterval);
    },
    [autoSaveInterval, saveProgress]
  );

  // Temps de session
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionPlayTime(Math.floor((Date.now() - sessionStartRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (pendingDataRef.current) saveProgress(pendingDataRef.current);
    };
  }, [saveProgress]);

  // Fonctions pour la compatibilité
  const markAsChanged = useCallback((newGameState: KhidmaGameState) => {
    pendingDataRef.current = newGameState;
    setGameState(newGameState);
  }, []);

  const saveTaskProgress = useCallback(async (
    taskId: string, 
    taskType: string, 
    progress: number, 
    isCompleted = false
  ): Promise<void> => {
    console.log(`Task progress: ${taskId} - ${progress}% (${isCompleted ? 'completed' : 'in progress'})`);
  }, []);

  const currentSession = true;

  return {
    gameState,
    setGameState,
    activeTasks,
    isLoading,
    isSaving,
    error,
    saveProgress,
    scheduleAutoSave,
    hasUnsavedChanges: pendingDataRef.current !== null,
    lastSaved: lastSaveRef.current ? new Date(lastSaveRef.current) : null,
    sessionPlayTime,
    totalPlayTime,
    loadedStats: savedStats,
    markAsChanged,
    saveTaskProgress,
    currentSession
  };
}
