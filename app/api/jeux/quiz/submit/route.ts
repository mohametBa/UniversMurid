import { NextRequest, NextResponse } from 'next/server';

interface QuizAnswer {
  questionId: string;
  selected: string;
  correct: boolean;
  timeSpent: number;
}

interface QuizSubmission {
  userId: string;
  gameType: 'quiz' | 'memory' | 'flashcard';
  category: string;
  difficulty: string;
  answers: QuizAnswer[];
  score: number;
  timeSpent: number;
}

export async function POST(request: NextRequest) {
  try {
    const submission: QuizSubmission = await request.json();
    
    // Validation des données
    if (!submission.userId || !submission.answers || submission.answers.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données manquantes' 
        },
        { status: 400 }
      );
    }

    // Calculer les statistiques
    const totalQuestions = submission.answers.length;
    const correctAnswers = submission.answers.filter(a => a.correct).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const totalTime = submission.answers.reduce((sum, a) => sum + a.timeSpent, 0);
    const averageTime = totalTime / totalQuestions;

    // Déterminer le niveau de performance
    let performance = 'Débutant';
    let grade = 'D';
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    if (accuracy >= 90) {
      performance = 'Expert';
      grade = 'A+';
    } else if (accuracy >= 80) {
      performance = 'Avancé';
      grade = 'A';
    } else if (accuracy >= 70) {
      performance = 'Intermédiaire';
      grade = 'B';
    } else if (accuracy >= 60) {
      performance = 'En apprentissage';
      grade = 'C';
    }

    // Simuler la sauvegarde en base de données
    const gameSession = {
      id: `session_${Date.now()}`,
      ...submission,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      totalTime,
      averageTime,
      accuracy,
      performance,
      grade,
      completedAt: new Date().toISOString()
    };

    // Ici, on sauvegarderait en base de données (Supabase)
    // Pour la démonstration, on simule juste le succès

    console.log('Quiz session saved:', gameSession);

    return NextResponse.json({
      success: true,
      data: {
        sessionId: gameSession.id,
        score: submission.score,
        accuracy,
        performance,
        grade,
        correctAnswers,
        incorrectAnswers,
        totalQuestions,
        timeSpent: submission.timeSpent,
        averageTime
      },
      message: 'Réponses sauvegardées avec succès'
    });

  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la sauvegarde des réponses' 
      },
      { status: 500 }
    );
  }
}

// GET pour récupérer l'historique des sessions d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const gameType = searchParams.get('gameType');
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'userId requis' 
        },
        { status: 400 }
      );
    }

    // Simuler la récupération de l'historique
    const mockSessions = [
      {
        id: 'session_1',
        userId,
        gameType: 'quiz',
        category: 'bamba',
        difficulty: 'medium',
        score: 125,
        accuracy: 85,
        correctAnswers: 8,
        incorrectAnswers: 2,
        completedAt: '2025-11-23T10:30:00Z'
      },
      {
        id: 'session_2',
        userId,
        gameType: 'quiz',
        category: 'culture',
        difficulty: 'easy',
        score: 95,
        accuracy: 90,
        correctAnswers: 9,
        incorrectAnswers: 1,
        completedAt: '2025-11-22T15:45:00Z'
      }
    ];

    // Filtrer par type de jeu si spécifié
    let filteredSessions = mockSessions;
    if (gameType) {
      filteredSessions = mockSessions.filter(s => s.gameType === gameType);
    }

    return NextResponse.json({
      success: true,
      data: filteredSessions,
      meta: {
        total: filteredSessions.length,
        userId,
        gameType: gameType || 'all'
      }
    });

  } catch (error) {
    console.error('Error fetching quiz sessions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération de l\'historique' 
      },
      { status: 500 }
    );
  }
}