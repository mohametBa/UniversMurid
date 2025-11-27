// Constantes centralisées pour "Le Sentier de la Khidma" - Serious Game éducatif spirituel

import { LearningPortal, QuizQuestion, KhidmaTask, DiscipleLevel, FarmPlot, KhidmaGameState } from './types';

// ============================================================================
// TYPES DE CULTURES (CROP_TYPES)
// ============================================================================
export const CROP_TYPES = {
  arachide: {
    name: 'Arachide',
    description: 'Culture traditionnelle symbole du travail patient',
    plantingTime: 7, // jours pour pousser
    waterNeeded: 2,
    yield: 15, // quantités récoltées
    season: 'planting',
    barakaReward: 8,
    faaidaReward: 25,
    icon: '🥜'
  },
  mais: {
    name: 'Maïs',
    description: 'Culture robuste et productive',
    plantingTime: 10,
    waterNeeded: 3,
    yield: 20,
    season: 'planting',
    barakaReward: 10,
    faaidaReward: 30,
    icon: '🌽'
  },
  mil: {
    name: 'Mil',
    description: 'Céréale adaptée au climat local',
    plantingTime: 8,
    waterNeeded: 1,
    yield: 12,
    season: 'planting',
    barakaReward: 6,
    faaidaReward: 20,
    icon: '🌾'
  },
  empty: {
    name: 'Parcelle vide',
    description: 'Terrain prêt à être cultivé',
    plantingTime: 0,
    waterNeeded: 0,
    yield: 0,
    season: 'none',
    barakaReward: 0,
    faaidaReward: 0,
    icon: '🟫'
  }
};

// ============================================================================
// SAISONS (SEASONS)
// ============================================================================
export const SEASONS = {
  planting: {
    name: 'Saison des semis',
    description: 'Période idéale pour planter les cultures',
    duration: 90, // jours
    cropCompatibility: ['arachide', 'mais', 'mil'],
    weatherBonus: 1.2, // bonus de productivité
    icon: '🌱'
  },
  growing: {
    name: 'Saison de croissance',
    description: 'Les cultures se développent',
    duration: 60,
    cropCompatibility: ['arachide', 'mais', 'mil'],
    weatherBonus: 1.0,
    icon: '🌿'
  },
  harvest: {
    name: 'Saison des récoltes',
    description: 'Temps de récolte et de moisson',
    duration: 30,
    cropCompatibility: ['arachide', 'mais', 'mil'],
    weatherBonus: 1.1,
    icon: '🌾'
  },
  dry: {
    name: 'Saison sèche',
    description: 'Période de repos et d\'entretien',
    duration: 120,
    cropCompatibility: [],
    weatherBonus: 0.8,
    icon: '☀️'
  }
};

// ============================================================================
// TÂCHES DE KHIDMA (KHIDMA_TASKS)
// ============================================================================
export const KHIDMA_TASKS: KhidmaTask[] = [
  {
    id: 'daara-teaching',
    title: 'Enseignement à la Daara',
    description: 'Aider à enseigner les valeurs spirituelles aux jeunes talibés',
    type: 'daara',
    difficulty: 'medium',
    barakaReward: 15,
    faaidaReward: 20,
    timeRequired: 60,
    isCompleted: false
  },
  {
    id: 'community-cleaning',
    title: 'Nettoyage communautaire',
    description: 'Participer au nettoyage des espaces communs du quartier',
    type: 'travaux_collectifs',
    difficulty: 'easy',
    barakaReward: 10,
    faaidaReward: 15,
    timeRequired: 45,
    isCompleted: false
  },
  {
    id: 'elderly-assistance',
    title: 'Assistance aux personnes âgées',
    description: 'Aider les anciens dans leurs tâches quotidiennes',
    type: 'aide_communaute',
    difficulty: 'easy',
    barakaReward: 12,
    faaidaReward: 18,
    timeRequired: 30,
    isCompleted: false
  },
  {
    id: 'magal-preparation',
    title: 'Préparation du Magal',
    description: 'Contribuer à l\'organisation du Magal de Touba',
    type: 'magal',
    difficulty: 'hard',
    barakaReward: 25,
    faaidaReward: 35,
    timeRequired: 120,
    isCompleted: false
  },
  {
    id: 'well-maintenance',
    title: 'Entretien des puits',
    description: 'Nettoyer et maintenir les puits communautaires',
    type: 'travaux_collectifs',
    difficulty: 'medium',
    barakaReward: 18,
    faaidaReward: 22,
    timeRequired: 90,
    isCompleted: false
  },
  {
    id: 'children-education',
    title: 'Éducation des enfants',
    description: 'Donner des cours de soutien aux enfants du quartier',
    type: 'daara',
    difficulty: 'hard',
    barakaReward: 20,
    faaidaReward: 28,
    timeRequired: 75,
    isCompleted: false
  },
  {
    id: 'mosque-maintenance',
    title: 'Entretien de la mosquée',
    description: 'Maintenir la propreté et l\'entretien de la mosquée',
    type: 'aide_communaute',
    difficulty: 'medium',
    barakaReward: 14,
    faaidaReward: 19,
    timeRequired: 40,
    isCompleted: false
  },
  {
    id: 'road-repair',
    title: 'Réparation des routes',
    description: 'Participer aux travaux de réparation des chemins',
    type: 'travaux_collectifs',
    difficulty: 'hard',
    barakaReward: 22,
    faaidaReward: 30,
    timeRequired: 100,
    isCompleted: false
  },
  {
    id: 'medical-assistance',
    title: 'Assistance médicale',
    description: 'Aider dans les activités de santé communautaire',
    type: 'aide_communaute',
    difficulty: 'medium',
    barakaReward: 16,
    faaidaReward: 24,
    timeRequired: 80,
    isCompleted: false
  },
  {
    id: 'cultural-event',
    title: 'Organisation d\'événement culturel',
    description: 'Contribuer à l\'organisation d\'activités culturelles',
    type: 'magal',
    difficulty: 'medium',
    barakaReward: 19,
    faaidaReward: 26,
    timeRequired: 95,
    isCompleted: false
  }
];

// ============================================================================
// CONFIGURATION DES DIFFICULTÉS (DIFFICULTY_CONFIG)
// ============================================================================
export const DIFFICULTY_CONFIG = {
  easy: {
    timeMultiplier: 0.8, // 20% plus rapide
    rewardMultiplier: 1.0, // récompense de base
    barakaMultiplier: 1.0,
    faaidaMultiplier: 1.0,
    leveilMultiplier: 0.8,
    icon: '🟢',
    color: 'green',
    description: 'Tâches simples et accessibles'
  },
  medium: {
    timeMultiplier: 1.0, // temps de base
    rewardMultiplier: 1.2, // 20% de récompense en plus
    barakaMultiplier: 1.2,
    faaidaMultiplier: 1.2,
    leveilMultiplier: 1.0,
    icon: '🟡',
    color: 'yellow',
    description: 'Tâches modérées demandant plus d\'effort'
  },
  hard: {
    timeMultiplier: 1.5, // 50% plus de temps requis
    rewardMultiplier: 1.8, // 80% de récompense en plus
    barakaMultiplier: 1.8,
    faaidaMultiplier: 1.8,
    leveilMultiplier: 1.5,
    icon: '🔴',
    color: 'red',
    description: 'Tâches exigeantes avec grandes récompenses'
  }
};

// ============================================================================
// PORTAILS D'APPRENTISSAGE (LEARNING_PORTALS)
// ============================================================================
export const LEARNING_PORTALS: LearningPortal[] = [
  {
    id: 'vie-cheikh-bamba',
    theme: 'vie_cheikh_bamba',
    title: 'Vie du Cheikh Ahmadou Bamba',
    description: 'Découvrez la chronologie et les épreuves du Guide spirituel',
    requiredBaraka: 10,
    isUnlocked: false,
    questions: [
      {
        id: 'b1',
        question: 'En quelle année est né Cheikh Ahmadou Bamba ?',
        options: ['1853', '1843', '1863', '1873'],
        correctAnswer: '1853',
        explanation: 'Cheikh Ahmadou Bamba est né en 1853 à Mbacké.',
        leveilReward: 5
      },
      {
        id: 'b2',
        question: 'Où Cheikh Ahmadou Bamba fut-il arrêté pour la première fois ?',
        options: ['Saint-Louis', 'Dakar', 'Gabon', 'Côte d\'Ivoire'],
        correctAnswer: 'Saint-Louis',
        explanation: 'Il fut arrêté pour la première fois à Saint-Louis en 1895.',
        leveilReward: 8
      },
      {
        id: 'b3',
        question: 'En quelle année Cheikh Ahmadou Bamba est-il décédé ?',
        options: ['1927', '1925', '1930', '1929'],
        correctAnswer: '1927',
        explanation: 'Le Cheikh est décédé en 1927 à Diourbel.',
        leveilReward: 5
      },
      {
        id: 'b4',
        question: 'Quel est le nom complet de Cheikh Ahmadou Bamba ?',
        options: ['Ahmadou Bamba Mbacké', 'Ahmadou Moustapha Bamba', 'Sidi Muhammad Bamba', 'Cheikh Mbacké'],
        correctAnswer: 'Ahmadou Bamba Mbacké',
        explanation: 'Son nom complet est Ahmadou Bamba Kharagné Diop.',
        leveilReward: 6
      }
    ]
  },
  {
    id: 'pilier-travail',
    theme: 'pilier_travail',
    title: 'Pilier du Travail (Al Amal)',
    description: 'L\'importance du travail et de l\'autosuffisance',
    requiredBaraka: 25,
    isUnlocked: false,
    questions: [
      {
        id: 't1',
        question: 'Quel est le meilleur moment pour semer l\'arachide ?',
        options: ['Saison des pluies', 'Saison sèche', 'N\'importe quand', 'En hiver'],
        correctAnswer: 'Saison des pluies',
        explanation: 'L\'arachide se sème traditionnellement au début de la saison des pluies.',
        leveilReward: 8
      },
      {
        id: 't2',
        question: 'Que signifie "Dahir" dans la tradition mouride ?',
        options: ['Travail', 'Prière', 'Jeûne', 'Pèlerinage'],
        correctAnswer: 'Travail',
        explanation: 'Dahir signifie "effort" et "travail" dans la voie mouride.',
        leveilReward: 10
      },
      {
        id: 't3',
        question: 'Quel fruit symbolise le travail fructueux chez les mourides ?',
        options: ['Mangue', 'Arachide', 'Bananier', 'Orange'],
        correctAnswer: 'Arachide',
        explanation: 'L\'arachide symbolise le travail patient et fructueux.',
        leveilReward: 7
      }
    ]
  },
  {
    id: 'voie-baye-fall',
    theme: 'voie_baye_fall',
    title: 'Voie des Baye Fall',
    description: 'Rôle et signification de la Khidma',
    requiredBaraka: 40,
    isUnlocked: false,
    questions: [
      {
        id: 'f1',
        question: 'Qui était Baye Fall ?',
        options: ['Un disciple de Bamba', 'Le frère de Bamba', 'Un marabout', 'Un Khalife'],
        correctAnswer: 'Un disciple de Bamba',
        explanation: 'Baye Fall était le disciple préféré du Cheikh Ahmadou Bamba.',
        leveilReward: 10
      },
      {
        id: 'f2',
        question: 'Quel acte symbolise la dévotion totale des Baye Fall ?',
        options: ['Le travail continu', 'La prière permanence', 'Le jeûne strict', 'Le silence'],
        correctAnswer: 'Le travail continu',
        explanation: 'La formule "Mame Cheikh Ibrah Fall" symbolise le travail sans relâche.',
        leveilReward: 12
      },
      {
        id: 'f3',
        question: 'Que signifie "Mame Cheikh Ibrah Fall" ?',
        options: ['Mon père Bamba', 'J\'aide Bamba', 'Je sers Bamba', 'Bamba est là'],
        correctAnswer: 'Je sers Bamba',
        explanation: 'C\'est la formule sacred qui signifie "Je sers le Cheikh".',
        leveilReward: 15
      }
    ]
  },
  {
    id: 'poesie-mystique',
    theme: 'poesie_mystique',
    title: 'Poésie mystique (Khassaïdes)',
    description: 'Mémoriser et comprendre les écrits sacrés',
    requiredBaraka: 60,
    isUnlocked: false,
    questions: [
      {
        id: 'p1',
        question: 'Complétez : "Moussa tchiladiine..."',
        options: ['Baïna naat', 'Barik All', 'Baïda wop', 'Baïna maak'],
        correctAnswer: 'Baïna naat',
        explanation: 'Ce verset est de la poésie mystique du Cheikh.',
        leveilReward: 15
      },
      {
        id: 'p2',
        question: 'Que sont les Khassaïdes ?',
        options: ['Des prières', 'Des poèmes mystiques', 'Des lois', 'Des chants'],
        correctAnswer: 'Des poèmes mystiques',
        explanation: 'Les Khassaïdes sont les poèmes mystiques du Cheikh Ahmadou Bamba.',
        leveilReward: 12
      },
      {
        id: 'p3',
        question: 'Quel est le thème principal des Khassaïdes ?',
        options: ['L\'amour divin', 'L\'argent', 'La guerre', 'La politique'],
        correctAnswer: 'L\'amour divin',
        explanation: 'Les Khassaïdes chantent l\'amour de Dieu et la voie spirituelle.',
        leveilReward: 10
      }
    ]
  },
  {
    id: 'guide-murshid',
    theme: 'guide_murshid',
    title: 'Le Guide (Al Murshid / Daara)',
    description: 'Rôle du Khalife et organisation spirituelle',
    requiredBaraka: 80,
    isUnlocked: false,
    questions: [
      {
        id: 'g1',
        question: 'Quel est le rôle du Khalife Général des Mourides ?',
        options: ['Gouverner le Sénégal', 'guida les mourides', 'Enseigner', 'Prédire l\'avenir'],
        correctAnswer: 'guida les mourides',
        explanation: 'Le Khalife est le guide spirituel de tous les mourides.',
        leveilReward: 12
      },
      {
        id: 'g2',
        question: 'Que signifie "Daara" ?',
        options: ['École', 'Mosquée', 'Village', 'Travail'],
        correctAnswer: 'École',
        explanation: 'La Daara est l\'école coranique où l\'on étudier.',
        leveilReward: 10
      },
      {
        id: 'g3',
        question: 'Qui est l\'actuel Khalife Général des Mourides ?',
        options: ['Serigne Mountakha', 'Serigne Sidy', 'Serigne Mouhamadou', 'Serigne Cheikh'],
        correctAnswer: 'Serigne Mountakha',
        explanation: 'Serigne Mountakha Mbacké est l\'actuel Khalife.',
        leveilReward: 8
      }
    ]
  }
];

// ============================================================================
// TYPES D'EXPORT POUR FACILITER L'UTILISATION
// ============================================================================
export type CropType = keyof typeof CROP_TYPES;
export type Season = keyof typeof SEASONS;
export type Difficulty = keyof typeof DIFFICULTY_CONFIG;

// ============================================================================
// NIVEAUX DE DISCIPLE (DISCIPLE_LEVELS)
// ============================================================================
export const DISCIPLE_LEVELS = {
  talib: { name: 'Tâlib (Étudiant)', icon: '🎓', color: 'from-emerald-500 to-teal-600', minExperience: 0 },
  khadim: { name: 'Khâdim (Serviteur)', icon: '🙏', color: 'from-blue-500 to-cyan-600', minExperience: 100 },
  salik: { name: 'Sâlik (Voyageur)', icon: '🚶‍♂️', color: 'from-purple-500 to-indigo-600', minExperience: 300 },
  murid: { name: 'Murid (Aspirant)', icon: '👑', color: 'from-amber-500 to-orange-600', minExperience: 600 }
};

// ============================================================================
// ÉTAT INITIAL DU JEU (INITIAL_GAME_STATE)
// ============================================================================
export const INITIAL_GAME_STATE: KhidmaGameState = {
  player: {
    level: 'talib' as DiscipleLevel,
    experience: 0,
    completedTasks: [],
    unlockedLocations: ['village'],
    resources: {
      faaida: 50,
      baraka: 0,
      leveil: 0
    }
  },
  farm: {
    plots: [
      { id: 'plot1', cropType: 'empty' as const, plantedDate: new Date(), harvestDate: null, isReady: false, productivity: 50 },
      { id: 'plot2', cropType: 'empty' as const, plantedDate: new Date(), harvestDate: null, isReady: false, productivity: 50 },
      { id: 'plot3', cropType: 'empty' as const, plantedDate: new Date(), harvestDate: null, isReady: false, productivity: 50 },
      { id: 'plot4', cropType: 'empty' as const, plantedDate: new Date(), harvestDate: null, isReady: false, productivity: 50 }
    ],
    tools: {
      houe: true,
      tracteur: false,
      semences: 10,
      eau: 100
    },
    animals: {
      poules: 2,
      boeufs: 0
    }
  },
  khidma: {
    completedTasks: [],
    currentStreak: 0,
    totalBarakaEarned: 0,
    reputationLevel: 1
  },
  currentLocation: 'village',
  inventory: {
    tools: ['houe'],
    seeds: 10,
    water: 100
  },
  achievements: [],
  dailyBonuses: {
    lastClaimed: new Date(),
    streakDays: 0
  }
};

// ============================================================================
// VALEURS DÉTACHABLES POUR FACILITER L'ACCÈS
// ============================================================================
export const CROP_TYPE_KEYS = Object.keys(CROP_TYPES) as CropType[];
export const SEASON_KEYS = Object.keys(SEASONS) as Season[];
export const DIFFICULTY_KEYS = Object.keys(DIFFICULTY_CONFIG) as Difficulty[];
export const PORTAL_THEMES = LEARNING_PORTALS.map(portal => portal.theme);
export const DISCIPLE_LEVEL_KEYS = Object.keys(DISCIPLE_LEVELS) as (keyof typeof DISCIPLE_LEVELS)[];