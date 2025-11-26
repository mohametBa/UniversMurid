import { NextRequest, NextResponse } from 'next/server';

// Questions de démonstration pour l'API selon la documentation
const quizQuestions = [
  // Questions sur Cheikh Ahmadou Bamba
  {
    id: '1',
    category: 'bamba',
    difficulty: 'easy',
    question: 'En quelle année est né Cheikh Ahmadou Bamba ?',
    type: 'mcq',
    options: ['1853', '1843', '1863', '1873'],
    correctAnswer: '1853',
    explanation: 'Cheikh Ahmadou Bamba est né en 1853 à Mbacké.',
    points: 10
  },
  {
    id: '2',
    category: 'bamba',
    difficulty: 'medium',
    question: 'Vrai ou Faux : Cheikh Ahmadou Bamba a fondé la Tariqa Mouride.',
    type: 'truefalse',
    options: ['Vrai', 'Faux'],
    correctAnswer: 'Vrai',
    explanation: 'Il a effectivement fondé la Tariqa Mouride en 1895.',
    points: 10
  },
  {
    id: '3',
    category: 'culture',
    difficulty: 'hard',
    question: 'Classez ces événements dans l\'ordre chronologique :',
    type: 'ranking',
    options: [
      'Fondation du mouridisme (1895)',
      'Retour du Gabon (1902)',
      'Mort de Cheikh Ahmadou Bamba (1927)',
      'Début de l\'exil au Gabon (1895)'
    ],
    correctAnswer: '1895-1902-1927-1895',
    explanation: '1895 : Fondation du mouridisme et début exil, 1902 : Retour, 1927 : Mort.',
    points: 15
  },
  // Questions culture générale
  {
    id: '4',
    category: 'culture',
    difficulty: 'easy',
    question: 'Que signifie "mouride" en arabe ?',
    type: 'mcq',
    options: ['Disciple', 'Guide', 'Sage', 'Protecteur'],
    correctAnswer: 'Disciple',
    explanation: '"Mouride" vient de l\'arabe et signifie "disciple" ou "ami".',
    points: 10
  },
  {
    id: '5',
    category: 'senegal',
    difficulty: 'medium',
    question: 'Dans quelle région du Sénégal se trouve Touba ?',
    type: 'mcq',
    options: ['Dakar', 'Thiès', 'Diourbel', 'Kaolack'],
    correctAnswer: 'Diourbel',
    explanation: 'Touba est situé dans la région de Diourbel.',
    points: 10
  },
  {
    id: '6',
    category: 'bamba',
    difficulty: 'medium',
    question: 'Combien de temps a durée l\'exil de Cheikh Ahmadou Bamba au Gabon ?',
    type: 'mcq',
    options: ['5 ans', '7 ans', '9 ans', '10 ans'],
    correctAnswer: '7 ans',
    explanation: 'Son exil a durée 7 ans, de 1895 à 1902.',
    points: 15
  },
  {
    id: '7',
    category: 'senegal',
    difficulty: 'easy',
    question: 'Vrai ou Faux : Touba est la deuxième plus grande ville du Sénégal.',
    type: 'truefalse',
    options: ['Vrai', 'Faux'],
    correctAnswer: 'Vrai',
    explanation: 'Touba est effectivement la deuxième ville du Sénégal après Dakar.',
    points: 10
  },
  {
    id: '8',
    category: 'culture',
    difficulty: 'hard',
    question: 'Quel était le métier de Cheikh Ahmadou Bamba avant sa mission spirituelle ?',
    type: 'mcq',
    options: ['Marchand', 'Copiste et calligraphe', 'Agriculteur', 'Prêcheur'],
    correctAnswer: 'Copiste et calligraphe',
    explanation: 'Il était reconnu pour ses talents de copiste et calligraphe de manuscrits religieux.',
    points: 20
  },
  {
    id: '9',
    category: 'bamba',
    difficulty: 'medium',
    question: 'Qui était le premier Khalife général de la confrérie mouride ?',
    type: 'mcq',
    options: ['Cheikh Moustapha Mbacké', 'Serigne Ibrahima Mbacké', 'Serigne Fallou Mbacké', 'Serigne Mountakha'],
    correctAnswer: 'Cheikh Moustapha Mbacké',
    explanation: 'C\'était le fils de Cheikh Ahmadou Bamba, Cheikh Moustapha Mbacké.',
    points: 15
  },
  {
    id: '10',
    category: 'senegal',
    difficulty: 'easy',
    question: 'En quelle année a été construite la Grande Mosquée de Touba ?',
    type: 'mcq',
    options: ['1927', '1930', '1932', '1935'],
    correctAnswer: '1932',
    explanation: 'La Grande Mosquée de Touba a été construite en 1932.',
    points: 10
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredQuestions = [...quizQuestions];

    // Filtrer par catégorie si spécifiée
    if (category && category !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }

    // Filtrer par difficulté si spécifiée
    if (difficulty && difficulty !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }

    // Mélanger et limiter les questions
    filteredQuestions.sort(() => Math.random() - 0.5);
    const questions = filteredQuestions.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: questions,
      meta: {
        total: questions.length,
        category: category || 'all',
        difficulty: difficulty || 'all'
      }
    });

  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des questions',
        data: []
      },
      { status: 500 }
    );
  }
}