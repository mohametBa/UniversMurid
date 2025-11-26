// Domain Entities - Game related entities
// Ces entités représentent les concepts fondamentaux du domaine du jeu

// Système de ressources
export interface GameResources {
  faaida: number;        // Monnaie virtuelle (bénéfice, utilité)
  baraka: number;        // Points spirituels (bénédiction)
  leveil: number;        // Ressource rare (éveil spirituel)
}

// Niveaux de progression du disciple
export type DiscipleLevel = 'talib' | 'khadim' | 'salik' | 'murid';

// État du joueur
export interface PlayerProgress {
  level: DiscipleLevel;
  experience: number;
  completedTasks: string[];
  unlockedLocations: string[];
  resources: GameResources;
}

// Axe 1: Gestion agricole (Dahir - Travail)
export interface FarmPlot {
  id: string;
  cropType: 'arachide' | 'mais' | 'mil' | 'empty';
  plantedDate: Date;
  harvestDate: Date | null;
  isReady: boolean;
  productivity: number; // 1-100
}

export interface FarmState {
  plots: FarmPlot[];
  tools: {
    houe: boolean;
    tracteur: boolean;
    semences: number;
    eau: number;
  };
  animals: {
    poules: number;
    boeufs: number;
  };
}

// Axe 2: Khidma (Service communautaire)
export interface KhidmaTask {
  id: string;
  title: string;
  description: string;
  type: 'daara' | 'magal' | 'travaux_collectifs' | 'aide_communaute';
  difficulty: 'easy' | 'medium' | 'hard';
  barakaReward: number;
  faaidaReward: number;
  timeRequired: number; // en minutes
  isCompleted: boolean;
}

export interface KhidmaProgress {
  completedTasks: KhidmaTask[];
  currentStreak: number;
  totalBarakaEarned: number;
  reputationLevel: number; // 1-10
  lastCompletedAt?: string;
}

// Axe 3: Portails d'Apprentissage
export type LearningTheme =
  | 'vie_cheikh_bamba'
  | 'pilier_travail'
  | 'voie_baye_fall'
  | 'poesie_mystique'
  | 'guide_murshid';

export interface LearningPortal {
  id: string;
  theme: LearningTheme;
  title: string;
  description: string;
  requiredBaraka: number;
  isUnlocked: boolean;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  leveilReward: number;
}

// Lieux de Touba à débloquer
export interface ToubaLocation {
  id: string;
  name: string;
  description: string;
  type: 'champ' | 'mosque' | 'daara' | 'marche' | 'maison';
  unlockRequirements: {
    level?: DiscipleLevel;
    baraka?: number;
    faaida?: number;
    leveil?: number;
    tasks?: string[];
  };
  isUnlocked: boolean;
  activities: string[];
}

// Améliorations possibles
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: {
    faaida?: number;
    baraka?: number;
    leveil?: number;
  };
  category: 'agriculture' | 'service' | 'education' | 'infrastructure';
  effect: string;
  isPurchased: boolean;
}

// Événements spéciaux
export interface SpecialEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  requirements: {
    minLevel: DiscipleLevel;
    minBaraka: number;
  };
  rewards: {
    faaida: number;
    baraka: number;
    leveil: number;
  };
  isActive: boolean;
}

// État principal du jeu
export interface KhidmaGameState {
  player: PlayerProgress;
  farm: FarmState;
  khidma: KhidmaProgress;
  currentLocation: string;
  inventory: {
    tools: string[];
    seeds: number;
    water: number;
  };
  achievements: string[];
  dailyBonuses: {
    lastClaimed: Date;
    streakDays: number;
  };
}

// Actions possibles
export type GameAction =
  | { type: 'PLANT_CROP'; plotId: string; cropType: string }
  | { type: 'HARVEST_CROP'; plotId: string }
  | { type: 'COMPLETE_KHIDMA'; taskId: string }
  | { type: 'COMPLETE_QUIZ'; portalId: string; correctAnswers: number }
  | { type: 'PURCHASE_UPGRADE'; upgradeId: string }
  | { type: 'TRAVEL_TO_LOCATION'; locationId: string }
  | { type: 'CLAIM_DAILY_BONUS' }
  | { type: 'USE_TOOL'; toolName: string; targetId: string };

// Interface pour les résultats des actions
export interface ActionResult {
  success: boolean;
  message: string;
  resourceChanges?: Partial<GameResources>;
  experienceGained?: number;
  newUnlocks?: string[];
}

// Interface pour les entrées du classement
export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  totalScore: number;
  gamesPlayed: number;
  bestScore: number;
  rank: number;
}