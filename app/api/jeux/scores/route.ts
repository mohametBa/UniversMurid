import { NextRequest, NextResponse } from 'next/server';

interface UserScore {
  id: string;
  userId: string;
  gameType: 'quiz' | 'memory' | 'flashcard';
  category: string;
  score: number;
  difficulty: string;
  timeSpent: number;
  completedAt: string;
  answers: any[];
}

// Mock data pour les scores utilisateur
const userScores: UserScore[] = [
  {
    id: '1',
    userId: 'user1',
    gameType: 'quiz',
    category: 'bamba',
    score: 145,
    difficulty: 'medium',
    timeSpent: 280,
    completedAt: '2025-11-24T10:30:00Z',
    answers: []
  },
  {
    id: '2',
    userId: 'user1',
    gameType: 'quiz',
    category: 'culture',
    score: 135,
    difficulty: 'easy',
    timeSpent: 250,
    completedAt: '2025-11-23T15:45:00Z',
    answers: []
  },
  {
    id: '3',
    userId: 'user1',
    gameType: 'memory',
    category: 'bamba',
    score: 75,
    difficulty: 'medium',
    timeSpent: 95,
    completedAt: '2025-11-24T08:20:00Z',
    answers: []
  },
  {
    id: '4',
    userId: 'user1',
    gameType: 'memory',
    category: 'senegal',
    score: 80,
    difficulty: 'hard',
    timeSpent: 85,
    completedAt: '2025-11-23T16:15:00Z',
    answers: []
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const gameType = searchParams.get('gameType');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'userId requis' 
        },
        { status: 400 }
      );
    }

    let scores = userScores.filter(score => score.userId === userId);

    // Filtrer par type de jeu
    if (gameType && gameType !== 'all') {
      scores = scores.filter(score => score.gameType === gameType);
    }

    // Trier par score décroissant
    scores.sort((a, b) => b.score - a.score);

    // Limiter le nombre de résultats
    scores = scores.slice(0, limit);

    // Calculer les statistiques
    const totalGames = scores.length;
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0;
    
    // Scores par jeu
    const quizScores = scores.filter(s => s.gameType === 'quiz');
    const memoryScores = scores.filter(s => s.gameType === 'memory');
    const flashcardScores = scores.filter(s => s.gameType === 'flashcard');

    return NextResponse.json({
      success: true,
      data: {
        scores,
        stats: {
          totalGames,
          totalScore,
          averageScore,
          bestScore,
          gameBreakdown: {
            quiz: {
              games: quizScores.length,
              bestScore: quizScores.length > 0 ? Math.max(...quizScores.map(s => s.score)) : 0,
              averageScore: quizScores.length > 0 ? Math.round(quizScores.reduce((sum, s) => sum + s.score, 0) / quizScores.length) : 0
            },
            memory: {
              games: memoryScores.length,
              bestScore: memoryScores.length > 0 ? Math.max(...memoryScores.map(s => s.score)) : 0,
              averageScore: memoryScores.length > 0 ? Math.round(memoryScores.reduce((sum, s) => sum + s.score, 0) / memoryScores.length) : 0
            },
            flashcard: {
              games: flashcardScores.length,
              bestScore: flashcardScores.length > 0 ? Math.max(...flashcardScores.map(s => s.score)) : 0,
              averageScore: flashcardScores.length > 0 ? Math.round(flashcardScores.reduce((sum, s) => sum + s.score, 0) / flashcardScores.length) : 0
            }
          }
        }
      },
      meta: {
        total: scores.length,
        userId,
        gameType: gameType || 'all'
      }
    });

  } catch (error) {
    console.error('Error fetching user scores:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des scores' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const scoreData: Omit<UserScore, 'id'> = await request.json();
    
    // Validation
    if (!scoreData.userId || !scoreData.gameType || scoreData.score === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données manquantes' 
        },
        { status: 400 }
      );
    }

    // Créer un nouveau score
    const newScore: UserScore = {
      id: `score_${Date.now()}`,
      ...scoreData,
      completedAt: new Date().toISOString()
    };

    // Ajouter à la liste (en production, sauvegarder en base)
    userScores.push(newScore);

    console.log('New score saved:', newScore);

    return NextResponse.json({
      success: true,
      data: newScore,
      message: 'Score sauvegardé avec succès'
    });

  } catch (error) {
    console.error('Error saving user score:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la sauvegarde du score' 
      },
      { status: 500 }
    );
  }
}