import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface PlayerStats {
  id: string
  user_id: string
  total_quizzes_played: number
  total_correct_answers: number
  total_score: number
  best_score: number
  longest_streak: number
  current_streak: number
  total_time_played: number
  favorite_category: string
  achievements: string[]
  level: number
  experience_points: number
  created_at: string
  updated_at: string
}

interface GlobalStats {
  total_users: number
  active_players: number
  total_quizzes_played: number
  total_correct_answers: number
  average_best_score: number
  highest_score: number
  total_time_played_minutes: number
}

interface LeaderboardEntry {
  id: string
  full_name: string
  avatar_url: string
  level: number
  total_score: number
  best_score: number
  total_quizzes_played: number
  current_streak: number
  longest_streak: number
  experience_points: number
  rank: number
}

export function usePlayerStats(user: User | null) {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // Récupérer les stats du joueur connecté
  const fetchPlayerStats = async () => {
    if (!user) {
      setStats(null)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Erreur lors de la récupération des stats:', error)
        setError('Erreur lors du chargement des statistiques')
      } else {
        setStats(data)
      }
    } catch (err) {
      console.error('Erreur:', err)
      setError('Erreur lors du chargement des statistiques')
    }
  }

  // Récupérer les stats globales
  const fetchGlobalStats = async () => {
    try {
      const { data, error } = await supabase
        .from('global_stats')
        .select('*')
        .single()

      if (error) {
        console.error('Erreur lors de la récupération des stats globales:', error)
      } else {
        setGlobalStats(data)
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  // Récupérer le leaderboard
  const fetchLeaderboard = async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(limit)

      if (error) {
        console.error('Erreur lors de la récupération du leaderboard:', error)
      } else {
        setLeaderboard(data || [])
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  // Mettre à jour les stats après un quiz
  const updateStatsAfterQuiz = async (
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    timeSpent: number
  ) => {
    if (!user) return

    try {
      // Utiliser la fonction PostgreSQL pour mettre à jour les stats
      const { data, error } = await supabase.rpc('update_player_stats_after_quiz', {
        quiz_user_id: user.id,
        quiz_score: score,
        quiz_total_questions: totalQuestions,
        quiz_correct_answers: correctAnswers,
        quiz_time_spent: timeSpent,
      })

      if (error) {
        console.error('Erreur lors de la mise à jour des stats:', error)
      } else {
        // Actualiser les stats localement
        await fetchPlayerStats()
        
        // Enregistrer l'activité
        await recordUserActivity('quiz_completed', {
          score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          time_spent: timeSpent,
        }, score * 10)
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  // Enregistrer une activité utilisateur
  const recordUserActivity = async (
    activityType: string,
    activityData?: any,
    pointsEarned: number = 0
  ) => {
    if (!user) return

    try {
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: activityType,
        activity_data: activityData,
        points_earned: pointsEarned,
      })
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'activité:', err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      if (user) {
        await fetchPlayerStats()
      } else {
        setStats(null)
      }

      await fetchGlobalStats()
      await fetchLeaderboard()

      setLoading(false)
    }

    fetchData()
  }, [user])

  return {
    stats,
    globalStats,
    leaderboard,
    loading,
    error,
    updateStatsAfterQuiz,
    recordUserActivity,
    refreshStats: fetchPlayerStats,
  }
}