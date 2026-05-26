export type CategoryId = 
  | 'actors'
  | 'movies'
  | 'musicians'
  | 'songs'
  | 'albums'
  | 'cities'
  | 'restaurants'
  | 'streets'
  | 'clothing-brands'
  | 'shoe-brands'
  | 'watch-brands'
  | 'perfume-brands'
  | 'luxury-brands';

export type CategoryGroup = 'entertainment' | 'places' | 'brands';

export interface Category {
  id: CategoryId;
  name: string;
  group: CategoryGroup;
  icon: string;
  color: string;
}

export interface MemoryItem {
  id: string;
  categoryId: CategoryId;
  question: string;
  questions?: string[];
  answer: string;
  answerType?: 'single' | 'multiple';
  validAnswers?: string[];
  hints: [string, string];
  association?: MemoryAssociation;
  imageUrl?: string;
  answerImageUrl?: string;
  relatedItems?: string[];
  isCustom: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface MemoryAssociation {
  technique: string;
  explanation: string;
  imagery: string;
  mnemonic?: string;
}

export interface SessionQuestion {
  itemId: string;
  question: string;
  answer: string;
  answerType?: 'single' | 'multiple';
  validAnswers?: string[];
  wasCorrect: boolean;
  hintsUsed: number;
}

export interface PracticeSession {
  id: string;
  date: string;
  categoryIds: CategoryId[];
  difficulty?: 'easy' | 'medium' | 'hard';
  questionsAsked: number;
  questionsCorrect: number;
  hintsUsed: number;
  averageTime: number;
  totalTimeSeconds?: number;
  itemsReviewed: string[];
  questions?: SessionQuestion[];
}

export interface ItemHistory {
  itemId: string;
  lastSeenDate: string | null;
  totalAttempts: number;
  correctAttempts: number;
  consecutiveCorrect: number;
  consecutiveFails: number;
  totalHintsUsed: number;
  lastWasCorrect: boolean;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
  totalSessions: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  difficultItems: string[];
  favoriteItems: string[];
  customItems: string[];
  sessions: PracticeSession[];
  itemHistory?: Record<string, ItemHistory>;
}

export interface PracticeState {
  currentIndex: number;
  currentItem: MemoryItem;
  hintsRevealed: number;
  answerRevealed: boolean;
  sessionItems: MemoryItem[];
  sessionStats: {
    correct: number;
    hintsUsed: number;
    startTime: number;
  };
}

export type GoalCategory = 'consistency' | 'accuracy' | 'speed';

export type GoalStatus = 'not-started' | 'in-progress' | 'achieved' | 'missed';

export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  category: GoalCategory;
  configurableFields: {
    difficultyLevel?: boolean;
    categoryId?: boolean;
    numberOfDays?: boolean;
    accuracyPercentage?: boolean;
    sessionDuration?: boolean;
    improvementPercentage?: boolean;
  };
  defaultValues: {
    difficultyLevel?: 'easy' | 'medium' | 'hard';
    categoryId?: CategoryId;
    numberOfDays?: number;
    accuracyPercentage?: number;
    sessionDuration?: number;
    improvementPercentage?: number;
  };
  validationRules: {
    minDays?: number;
    maxDays?: number;
    minAccuracy?: number;
    maxAccuracy?: number;
    minDuration?: number;
    maxDuration?: number;
    minImprovement?: number;
    maxImprovement?: number;
  };
}

export interface UserGoal {
  id: string;
  templateId: string;
  customName?: string;
  startDate: string;
  scheduledStartDate?: string;
  status: GoalStatus;
  configuration: {
    difficultyLevel?: 'easy' | 'medium' | 'hard';
    categoryId?: CategoryId;
    numberOfDays?: number;
    accuracyPercentage?: number;
    sessionDuration?: number;
    improvementPercentage?: number;
  };
  progress: {
    currentValue: number;
    targetValue: number;
    percentage: number;
  };
  achievedDate?: string;
  missedDate?: string;
}
