import { NextRequest, NextResponse } from 'next/server';

interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  streaks: number;
  bestScores: {
    quiz: number;
    memory: number;
    flashcard: number;
  };
  recentActivity: {
    date: string;
    gameType: string;
    score: number;
  }[];
  achievements: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'userId requis' 
        },
        { status: 400 }
      );
    }

    // Simuler les statistiques utilisateur
    const mockStats: GameStats = {
      gamesPlayed: Math.floor(Math.random() * 100) + 20,
      totalScore: Math.floor(Math.random() * 3000) + 500,
      streaks: Math.floor(Math.random() * 15) + 1,
      bestScores: {
        quiz: Math.floor(Math.random() * 150) + 50,
        memory: Math.floor(Math.random() * 80) + 20,
        flashcard: Math.floor(Math.random() * 100) + 30
      },
      recentActivity: [
        {
          date: '2025-11-24T15:30:00Z',
          gameType: 'quiz',
          score: 125
        },
        {
          date: '2025-11-24T14:15:00Z',
          gameType: 'memory',
          score: 75
        },
        {
          date: '2025-11-23T16:45:00Z',
          gameType: 'flashcard',
          score: 45
        },
        {
          date: '2025-11-23T10:20:00Z',
          gameType: 'quiz',
          score: 140
        },
        {
          date: '2025-11-22T19:30:00Z',
          gameType: 'memory',
          score: 80
        }
      ],
      achievements: [
        {
          id: 'first_quiz',
          name: 'Premier Quiz',
          description: 'Terminez votre premier quiz',
          icon: '🎯',
          unlockedAt: '2025-11-20T10:00:00Z'
        },
        {
          id: 'quiz_master',
          name: 'Maître du Quiz',
          description: 'Obtenez plus de 120 points au quiz',
          icon: '🧠',
          unlockedAt: '2025-11-22T15:30:00Z'
        },
        {
          id: 'memory_expert',
          name: 'Expert Mémoire',
          description: 'Terminez un jeu de mémoire en moins de 90 secondes',
          icon: '🎯',
          unlockedAt: '2025-11-23T14:20:00Z'
        },
        {
          id: 'culture_buff',
          name: 'Cultivé',
          description: 'Répondez correctement à 50 questions sur la culture',
          icon: '📚'
        },
        {
          id: 'bamba_scholar',
          name: 'Érudit Bamba',
          description: 'Maîtrisez toutes les questions sur Cheikh Ahmadou Bamba',
          icon: '🕌'
        },
        {
          id: 'streak_week',
          name: 'Semaine streak',
          description: 'Jouez 7 jours consécutifs',
          icon: '🔥'
        }
      ]
    };

    // Calculer des statistiques additionnelles
    const weeklyStats = {
      gamesThisWeek: Math.floor(Math.random() * 15) + 5,
      bestStreak: Math.floor(Math.random() * 10) + 3,
      averageScore: Math.round(mockStats.totalScore / mockStats.gamesPlayed),
      improvementRate: Math.floor(Math.random() * 20) + 5 // % d'amélioration
    };

    // Distribution des performances par catégorie
    const categoryStats = {
      bamba: {
        gamesPlayed: Math.floor(mockStats.gamesPlayed * 0.4),
        averageScore: Math.floor(Math.random() * 50) + 70,
        bestScore: Math.floor(Math.random() * 30) + 120
      },
      culture: {
        gamesPlayed: Math.floor(mockStats.gamesPlayed * 0.35),
        averageScore: Math.floor(Math.random() * 40) + 75,
        bestScore: Math.floor(Math.random() * 25) + 115
      },
      senegal: {
        gamesPlayed: Math.floor(mockStats.gamesPlayed * 0.25),
        averageScore: Math.floor(Math.random() * 45) + 65,
        bestScore: Math.floor(Math.random() * 35) + 110
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        ...mockStats,
        weeklyStats,
        categoryStats,
        lastUpdated: new Date().toISOString()
      },
      meta: {
        userId,
        totalAchievements: mockStats.achievements.length,
        unlockedAchievements: mockStats.achievements.filter(a => a.unlockedAt).length
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des statistiques' 
      },
      { status: 500 }
    );
  }
}