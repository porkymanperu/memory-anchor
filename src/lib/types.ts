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
  hints: [string, string];
  association: MemoryAssociation;
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

export interface PracticeSession {
  id: string;
  date: string;
  categoryIds: CategoryId[];
  questionsAsked: number;
  questionsCorrect: number;
  hintsUsed: number;
  averageTime: number;
  itemsReviewed: string[];
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
