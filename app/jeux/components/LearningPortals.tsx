'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, 
  BookOpen, 
  Lock, 
  Star,
  CheckCircle,
  Clock,
  Trophy,
  Sparkles,
  Scroll,
  Crown,
  Heart,
  Lightbulb,
  Award,
  ArrowRight
} from 'lucide-react';
import { LearningPortal, QuizQuestion, KhidmaGameState } from '../types';
import { LEARNING_PORTALS } from '../constants';

interface LearningPortalsProps {
  gameState: KhidmaGameState;
  onGameStateUpdate: (newState: KhidmaGameState) => void;
}



export default function LearningPortals({ gameState, onGameStateUpdate }: LearningPortalsProps) {
  const [selectedPortal, setSelectedPortal] = useState<LearningPortal | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const updateGameState = (newState: KhidmaGameState) => {
    onGameStateUpdate(newState);
  };

  // Débloquer les portails basés sur la Baraka
  useEffect(() => {
    const updatedPortals = LEARNING_PORTALS.map(portal => ({
      ...portal,
      isUnlocked: gameState.player.resources.baraka >= portal.requiredBaraka
    }));
    
    // Stocker les portails mis à jour
    (LearningPortals as any).updated = updatedPortals;
  }, [gameState.player.resources.baraka]);

  const getCurrentPortals = () => {
    return (LearningPortals as any).updated || LEARNING_PORTALS;
  };

  const startQuiz = (portal: LearningPortal) => {
    setSelectedPortal(portal);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
    setShowReview(false);
  };

  const answerQuestion = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (!selectedPortal) return;
    
    if (currentQuestionIndex + 1 >= selectedPortal.questions.length) {
      completeQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    setShowResults(true);
    
    if (!selectedPortal) return;

    // Calculer les résultats
    let correctAnswers = 0;
    let totalLeveil = 0;
    
    selectedPortal.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
        totalLeveil += question.leveilReward;
      }
    });

    // Attribuer les récompenses
    const newResources = {
      ...gameState.player.resources,
      leveil: gameState.player.resources.leveil + totalLeveil
    };

    updateGameState({
      ...gameState,
      player: {
        ...gameState.player,
        resources: newResources,
        experience: gameState.player.experience + (correctAnswers * 10)
      }
    });
  };

  const getScorePercentage = () => {
    if (!selectedPortal) return 0;
    const correctAnswers = selectedPortal.questions.filter(q => 
      userAnswers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctAnswers / selectedPortal.questions.length) * 100);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (selectedPortal && !showReview) {
    const currentQuestion = selectedPortal.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === selectedPortal.questions.length - 1;
    
    return (
      <div className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-cyan-200 dark:border-gray-700">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-cyan-800 flex items-center">
              <BookOpen className="w-7 h-7 mr-3" />
              {selectedPortal.title}
            </h2>
            <button
              onClick={() => setSelectedPortal(null)}
              className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
            >
              ← Retour aux portails
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-cyan-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-cyan-800">
                Question {currentQuestionIndex + 1} sur {selectedPortal.questions.length}
              </span>
              <span className="text-sm text-slate-600">
                +{currentQuestion.leveilReward} L'Éveil
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / selectedPortal.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-cyan-200 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => answerQuestion(currentQuestion.id, option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  userAnswers[currentQuestion.id] === option
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-slate-200 hover:border-cyan-300 bg-slate-50 hover:bg-cyan-25'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-bold ${
                    userAnswers[currentQuestion.id] === option
                      ? 'border-cyan-500 bg-cyan-500 text-white'
                      : 'border-slate-400 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-slate-800">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-600 disabled:text-slate-400 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            ← Précédent
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={!userAnswers[currentQuestion.id]}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white disabled:text-slate-500 font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
          >
            {isLastQuestion ? 'Terminer' : 'Suivant'} →
          </button>
        </div>

        {/* Résultats finaux */}
        {showResults && quizCompleted && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {getScorePercentage() >= 80 ? '🎉' : getScorePercentage() >= 60 ? '👏' : '📚'}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Quiz Terminé !</h3>
                
                <div className={`text-4xl font-bold mb-4 ${getScoreColor(getScorePercentage())}`}>
                  {getScorePercentage()}%
                </div>
                
                <p className="text-slate-600 mb-6">
                  {getScorePercentage() >= 80 
                    ? 'Excellent ! Vous maîtrisez bien ce sujet.' 
                    : getScorePercentage() >= 60 
                    ? 'Bien joué ! Continuez vos études.' 
                    : 'Continuez à apprendre, la connaissance s\'acquiert avec le temps.'}
                </p>
                
                <div className="bg-cyan-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <Sparkles className="w-5 h-5 text-cyan-600 mr-2" />
                    <span className="font-semibold text-cyan-800">Récompense d'Éveil</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-700">
                    +{selectedPortal.questions.filter(q => userAnswers[q.id] === q.correctAnswer).reduce((sum, q) => sum + q.leveilReward, 0)} L'Éveil
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowReview(true)}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Voir les réponses
                  </button>
                  <button
                    onClick={() => setSelectedPortal(null)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vue d'ensemble des portails
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 sm:p-6 border border-cyan-200 dark:border-gray-700 shadow-xl">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-cyan-800 dark:text-cyan-300 flex items-center mb-2">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg mr-2 sm:mr-3">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white" />
              </div>
              <span className="hidden xs:inline">Portails d'Apprentissage</span>
              <span className="xs:hidden">Portails</span>
            </h2>
            <p className="text-cyan-600 dark:text-cyan-400 text-sm sm:text-base">Développez votre connaissance spirituelle</p>
          </div>
          <div className="lg:ml-4 flex-shrink-0">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 shadow-lg border border-cyan-200 dark:border-gray-700">
              <div className="text-xs text-cyan-600 dark:text-cyan-400 mb-1">Points d'Éveil</div>
              <div className="text-xl sm:text-2xl font-bold text-cyan-800 dark:text-cyan-300 flex items-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
                {gameState.player.resources.leveil}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques d'apprentissage */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg border border-cyan-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-cyan-600 mb-2 flex items-center">
            <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg mr-2 sm:mr-3">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-cyan-600" />
            </div>
            <span className="text-responsive-base">{getCurrentPortals().filter((p: LearningPortal) => p.isUnlocked).length}</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Portails débloqués</div>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg border border-yellow-200 dark:border-yellow-800 hover:shadow-xl transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-yellow-600 mb-2 flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-2 sm:mr-3">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-600" />
            </div>
            <span className="text-responsive-base">{gameState.player.resources.leveil}</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Points d'Éveil</div>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-green-600 mb-2 flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-2 sm:mr-3">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600" />
            </div>
            <span className="text-responsive-base">0</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Quizz terminés</div>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 touch-manipulation min-h-[100px] sm:min-h-[120px]">
          <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-600 mb-2 flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-2 sm:mr-3">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
            <span className="text-responsive-base">0%</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Taux de réussite</div>
        </div>
      </div>

      {/* Grille des portails */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {getCurrentPortals().map((portal: LearningPortal) => {
          const isUnlocked = portal.isUnlocked;
          const requiredBaraka = portal.requiredBaraka;
          const currentBaraka = gameState.player.resources.baraka;
          
          return (
            <div
              key={portal.id}
              className={`group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl touch-manipulation min-h-[200px] sm:min-h-[220px] ${
                isUnlocked 
                  ? 'border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 cursor-pointer' 
                  : 'border-slate-200 dark:border-gray-700 opacity-60'
              }`}
              onClick={() => isUnlocked && startQuiz(portal)}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-slate-100 dark:bg-gray-700'
                }`}>
                  {isUnlocked ? (
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  ) : (
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-400" />
                  )}
                </div>
                
                <div className="text-right">
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                    isUnlocked 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400'
                  }`}>
                    {isUnlocked ? '✓ Débloqué' : '🔒 Verrouillé'}
                  </div>
                </div>
              </div>
              
              <h3 className={`text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 ${
                isUnlocked ? 'text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400' : 'text-slate-500 dark:text-gray-400'
              }`}>
                {portal.title}
              </h3>
              
              <p className={`text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-2 ${
                isUnlocked ? 'text-slate-600 dark:text-gray-300' : 'text-slate-400 dark:text-gray-500'
              }`}>
                {portal.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center text-xs font-medium text-slate-600 dark:text-gray-400">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded-lg mr-2">
                    <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-600" />
                  </div>
                  <span className="text-responsive-xs">{requiredBaraka} Baraka requis</span>
                </div>
                
                {isUnlocked && (
                  <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-semibold">
                    <span className="mr-1 hidden sm:inline">Commencer</span>
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-lg">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
              
              {!isUnlocked && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-gray-600">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 mb-2">
                    <span>Progression</span>
                    <span>{currentBaraka}/{requiredBaraka}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((currentBaraka / requiredBaraka) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    Besoin de {requiredBaraka - currentBaraka} Baraka supplémentaires
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message d'information */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">Comment progresser</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <p className="text-purple-100 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
              Pour débloquer les portails d'apprentissage, accumulez de la <strong className="text-yellow-300">Baraka</strong> en servant 
              votre communauté. Chaque portail nécessite un seuil minimum de Baraka et offre des récompenses 
              en <strong className="text-yellow-300">L'Éveil</strong> pour réussir les quizz.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 mr-2" />
                <span className="font-semibold text-yellow-300 text-sm sm:text-base">Conseil</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100">
                Plus vous accumulez de Baraka, plus vous débloquez de connaissances spirituelles avancées.
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center mb-3 sm:mb-4">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg font-semibold text-yellow-300">Principe Fondamental</span>
            </div>
            <p className="text-purple-100 italic text-center text-sm sm:text-base lg:text-lg leading-relaxed">
              "L'Éveil est obligatoire pour les grosses améliorations matérielles"
            </p>
            <div className="mt-3 sm:mt-4 text-center">
              <div className="text-xs sm:text-sm text-purple-200">- Sagesse du jeu -</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}