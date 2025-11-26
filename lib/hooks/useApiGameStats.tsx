'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';
import type { KhidmaGameState } from '@/app/jeux/types';

export interface ApiGameStats {
  gameType: string;
  gameState: KhidmaGameState;
  totalPlayTime: number;
  sessionPlayTime: number;
  lastSaved?: string;
  version?: number;
}

export interface ApiAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_data: any;
  unlocked_at: string;
  points_earned: number;
}

export interface ApiGameHistory {
  id: string;
  user_id: string;
  game_type: string;
  game_state: KhidmaGameState;
  total_play_time: number;
  session_play_time: number;
  created_at: string;
}

export function useApiGameStats(gameType: string = 'khidma_sentier') {
  const { user } = useAuth();
  const [stats, setStats] = useState<ApiGameStats | null>(null);
  const [achievements, setAchievements] = useState<ApiAchievement[]>([]);
  const [history, setHistory] = useState<ApiGameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtenir le token d'accès pour les appels API
  const getAuthToken = async (): Promise<string | null> => {
    if (!user) return null;
    
    // Utiliser le token de session Supabase directement
    const supabase = (await import('@/lib/supabase/client')).createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  // Appel API générique avec gestion d'authentification
  const apiCall = async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Non authentifié');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(endpoint, {
      ...options,
      headers,
    });
  };

  // Charger les statistiques du jeu
  const loadStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiCall(`/api/game-stats?gameType=${gameType}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Pas de sauvegarde existante, c'est normal pour un nouveau joueur
          setStats(null);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors du chargement');
        }
      } else {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des stats:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user, gameType]);

  // Charger les achievements
  const loadAchievements = useCallback(async () => {
    if (!user) return;

    try {
      const response = await apiCall('/api/game-stats/achievements');
      
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des achievements:', err);
    }
  }, [user]);

  // Charger l'historique
  const loadHistory = useCallback(async () => {
    if (!user) return;

    try {
      const response = await apiCall(`/api/game-stats/history?gameType=${gameType}&limit=30`);
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
    }
  }, [user, gameType]);

  // Sauvegarder l'état du jeu
  const saveGameState = async (gameState: KhidmaGameState) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      setSaving(true);
      
      const sessionPlayTime = Math.floor((Date.now() - Date.now()) / 1000); // À ajuster
      
      const response = await apiCall('/api/game-stats', {
        method: 'POST',
        body: JSON.stringify({
          gameType,
          gameState,
          sessionPlayTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      const savedData = await response.json();
      setStats(savedData);
      return savedData;
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Charger toutes les données au montage
  useEffect(() => {
    loadStats();
    loadAchievements();
    loadHistory();
  }, [loadStats, loadAchievements, loadHistory]);

  // Recharger les données quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadStats();
      loadAchievements();
      loadHistory();
    } else {
      // Reset des données si pas d'utilisateur
      setStats(null);
      setAchievements([]);
      setHistory([]);
      setLoading(false);
    }
  }, [user, loadStats, loadAchievements, loadHistory]);

  return {
    stats,
    achievements,
    history,
    loading,
    saving,
    error,
    saveGameState,
    refreshStats: loadStats,
    refreshAchievements: loadAchievements,
    refreshHistory: loadHistory,
  };
}