import { NextRequest, NextResponse } from 'next/server';

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  totalScore: number;
  gamesPlayed: number;
  bestScore: number;
  rank: number;
  avatar?: string;
  lastActive: string;
}

// Données de démonstration du leaderboard
const leaderboardData: LeaderboardEntry[] = [
  { id: '1', userId: 'user1', username: 'Ahmadou_Mouride', totalScore: 2850, gamesPlayed: 78, bestScore: 245, rank: 1, lastActive: '2025-11-24T15:30:00Z' },
  { id: '2', userId: 'user2', username: 'Fatou_Touba', totalScore: 2650, gamesPlayed: 65, bestScore: 230, rank: 2, lastActive: '2025-11-24T14:45:00Z' },
  { id: '3', userId: 'user3', username: 'Modou_Serigne', totalScore: 2480, gamesPlayed: 72, bestScore: 220, rank: 3, lastActive: '2025-11-24T13:20:00Z' },
  { id: '4', userId: 'user4', username: 'Aïssatou_Khassida', totalScore: 2350, gamesPlayed: 58, bestScore: 210, rank: 4, lastActive: '2025-11-24T12:10:00Z' },
  { id: '5', userId: 'user5', username: 'Ousmane_Bamba', totalScore: 2280, gamesPlayed: 62, bestScore: 205, rank: 5, lastActive: '2025-11-24T11:55:00Z' },
  { id: '6', userId: 'user6', username: 'Mame_Diourbel', totalScore: 2190, gamesPlayed: 55, bestScore: 198, rank: 6, lastActive: '2025-11-24T10:30:00Z' },
  { id: '7', userId: 'user7', username: 'Cheikh_Mbacké', totalScore: 2100, gamesPlayed: 68, bestScore: 195, rank: 7, lastActive: '2025-11-24T09:15:00Z' },
  { id: '8', userId: 'user8', username: 'Khadija_Tariqa', totalScore: 2050, gamesPlayed: 51, bestScore: 190, rank: 8, lastActive: '2025-11-24T08:45:00Z' },
  { id: '9', userId: 'user9', username: 'Ibrahima_Spiritual', totalScore: 1980, gamesPlayed: 59, bestScore: 185, rank: 9, lastActive: '2025-11-23T20:30:00Z' },
  { id: '10', userId: 'user10', username: 'Awa_Mouridisme', totalScore: 1920, gamesPlayed: 48, bestScore: 180, rank: 10, lastActive: '2025-11-23T19:20:00Z' },
  
  // Plus d'entrées pour simuler un classement complet
  ...Array.from({ length: 90 }, (_, i) => {
    const baseScore = 1500 - (i * 15); // Décroissance progressive
    const randomVariation = Math.floor(Math.random() * 200) - 100;
    const totalScore = Math.max(300, baseScore + randomVariation);
    
    return {
      id: `user${i + 11}`,
      userId: `user${i + 11}`,
      username: `Joueur_${i + 11}`,
      totalScore,
      gamesPlayed: Math.floor(Math.random() * 50) + 10,
      bestScore: Math.floor(totalScore * 0.3) + Math.floor(Math.random() * 50),
      rank: i + 11,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  })
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'global'; // global, weekly, friends
    const limit = parseInt(searchParams.get('limit') || '100');
    const userId = searchParams.get('userId');

    let filteredData = [...leaderboardData];

    // Filtrer selon le type de classement
    if (type === 'weekly') {
      // Classement hebdomadaire (simulation)
      filteredData = leaderboardData
        .slice(0, 50) // Limiter à 50 pour le hebdo
        .map(entry => ({
          ...entry,
          totalScore: Math.floor(entry.totalScore * 0.7), // Scores plus bas pour le hebdo
          rank: 0 // Sera recalculé
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
    } else if (type === 'friends') {
      // Classement amis (simulation avec les 8 premiers)
      filteredData = leaderboardData.slice(0, 8);
    }
    // Pour 'global', on garde toutes les données

    // Limiter les résultats
    filteredData = filteredData.slice(0, limit);

    // Recalculer les rangs si nécessaire
    filteredData = filteredData
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    // Trouver la position de l'utilisateur si spécifié
    let userPosition = null;
    if (userId) {
      const userEntry = leaderboardData.find(entry => entry.userId === userId);
      if (userEntry) {
        const userRank = leaderboardData
          .sort((a, b) => b.totalScore - a.totalScore)
          .findIndex(entry => entry.userId === userId) + 1;
        
        userPosition = {
          ...userEntry,
          rank: userRank
        };
      }
    }

    // Statistiques globales
    const totalPlayers = leaderboardData.length;
    const activePlayers = leaderboardData.filter(entry => {
      const lastActive = new Date(entry.lastActive);
      const daysDiff = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7; // Joueurs actifs dans les 7 derniers jours
    }).length;

    const averageScore = Math.round(
      leaderboardData.reduce((sum, entry) => sum + entry.totalScore, 0) / totalPlayers
    );

    return NextResponse.json({
      success: true,
      data: {
        leaderboard: filteredData,
        userPosition,
        stats: {
          totalPlayers,
          activePlayers,
          averageScore,
          highestScore: Math.max(...leaderboardData.map(e => e.totalScore)),
          totalGamesPlayed: leaderboardData.reduce((sum, entry) => sum + entry.gamesPlayed, 0)
        }
      },
      meta: {
        type,
        total: filteredData.length,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération du classement' 
      },
      { status: 500 }
    );
  }
}