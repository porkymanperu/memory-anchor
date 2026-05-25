import { MemoryItem, UserProgress, PracticeSession, CategoryId } from './types';

export interface ItemPerformance {
  itemId: string;
  totalAttempts: number;
  correctAttempts: number;
  lastSeen: string | null;
  sessionsSinceLastSeen: number;
  consecutiveCorrect: number;
  consecutiveFails: number;
  averageHintsUsed: number;
  recallStrength: number;
}

export interface QuestionSelectionResult {
  newQuestions: MemoryItem[];
  failedQuestions: MemoryItem[];
  reviewQuestions: MemoryItem[];
  selectedItems: MemoryItem[];
}

export function calculateItemPerformance(
  itemId: string,
  userProgress: UserProgress
): ItemPerformance {
  const sessions = userProgress.sessions || [];
  
  let totalAttempts = 0;
  let correctAttempts = 0;
  let lastSeen: string | null = null;
  let consecutiveCorrect = 0;
  let consecutiveFails = 0;
  let totalHints = 0;
  let sessionsSinceLastSeen = 0;
  
  let foundLastSeen = false;
  
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    const questions = session.questions || [];
    
    const itemQuestions = questions.filter(q => q.itemId === itemId);
    
    if (itemQuestions.length > 0) {
      if (!foundLastSeen) {
        lastSeen = session.date;
        foundLastSeen = true;
      }
      
      for (const question of itemQuestions) {
        totalAttempts++;
        totalHints += question.hintsUsed || 0;
        
        if (question.wasCorrect) {
          correctAttempts++;
          if (!foundLastSeen || i === 0) {
            consecutiveCorrect++;
          }
          consecutiveFails = 0;
        } else {
          if (!foundLastSeen || i === 0) {
            consecutiveFails++;
          }
          consecutiveCorrect = 0;
        }
      }
    } else if (foundLastSeen) {
      sessionsSinceLastSeen++;
    }
  }
  
  const averageHintsUsed = totalAttempts > 0 ? totalHints / totalAttempts : 0;
  const accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;
  
  const recallStrength = calculateRecallStrength(
    accuracy,
    consecutiveCorrect,
    consecutiveFails,
    averageHintsUsed,
    sessionsSinceLastSeen
  );
  
  return {
    itemId,
    totalAttempts,
    correctAttempts,
    lastSeen,
    sessionsSinceLastSeen,
    consecutiveCorrect,
    consecutiveFails,
    averageHintsUsed,
    recallStrength
  };
}

function calculateRecallStrength(
  accuracy: number,
  consecutiveCorrect: number,
  consecutiveFails: number,
  averageHintsUsed: number,
  sessionsSinceLastSeen: number
): number {
  let strength = accuracy * 100;
  
  strength += consecutiveCorrect * 15;
  
  strength -= consecutiveFails * 20;
  
  strength -= averageHintsUsed * 10;
  
  const decayFactor = Math.min(sessionsSinceLastSeen * 5, 30);
  strength -= decayFactor;
  
  return Math.max(0, Math.min(100, strength));
}

export function selectQuestionsWithSpacedRepetition(
  availableItems: MemoryItem[],
  userProgress: UserProgress,
  targetCount: number
): QuestionSelectionResult {
  const performances = new Map<string, ItemPerformance>();
  
  for (const item of availableItems) {
    const performance = calculateItemPerformance(item.id, userProgress);
    performances.set(item.id, performance);
  }
  
  const newItems = availableItems.filter(item => {
    const perf = performances.get(item.id)!;
    return perf.totalAttempts === 0;
  });
  
  const seenItems = availableItems.filter(item => {
    const perf = performances.get(item.id)!;
    return perf.totalAttempts > 0;
  });
  
  const failedItems = seenItems.filter(item => {
    const perf = performances.get(item.id)!;
    return perf.recallStrength < 40 || perf.consecutiveFails > 0;
  });
  
  const recentlyAnsweredCorrectly = seenItems.filter(item => {
    const perf = performances.get(item.id)!;
    return (
      perf.sessionsSinceLastSeen < 2 &&
      perf.consecutiveFails === 0 &&
      perf.lastSeen !== null
    );
  });
  
  const needsReviewItems = seenItems.filter(item => {
    const perf = performances.get(item.id)!;
    return (
      perf.recallStrength >= 40 &&
      perf.consecutiveFails === 0 &&
      perf.sessionsSinceLastSeen >= 2
    );
  });
  
  const strongItems = seenItems.filter(item => {
    const perf = performances.get(item.id)!;
    return (
      perf.recallStrength >= 70 &&
      perf.consecutiveCorrect >= 2 &&
      perf.sessionsSinceLastSeen >= 3
    );
  });
  
  const newQuestionCount = Math.min(
    Math.max(3, Math.floor(targetCount * 0.3)),
    5,
    newItems.length
  );
  
  const failedQuestionCount = Math.min(
    failedItems.length,
    Math.ceil(targetCount * 0.4)
  );
  
  const remainingSlots = targetCount - newQuestionCount - failedQuestionCount;
  
  const reviewQuestionCount = Math.min(remainingSlots, needsReviewItems.length);
  const strongQuestionCount = remainingSlots - reviewQuestionCount;
  
  failedItems.sort((a, b) => {
    const perfA = performances.get(a.id)!;
    const perfB = performances.get(b.id)!;
    
    if (perfA.consecutiveFails !== perfB.consecutiveFails) {
      return perfB.consecutiveFails - perfA.consecutiveFails;
    }
    
    if (perfA.sessionsSinceLastSeen !== perfB.sessionsSinceLastSeen) {
      return perfA.sessionsSinceLastSeen - perfB.sessionsSinceLastSeen;
    }
    
    return perfA.recallStrength - perfB.recallStrength;
  });
  
  needsReviewItems.sort((a, b) => {
    const perfA = performances.get(a.id)!;
    const perfB = performances.get(b.id)!;
    
    if (perfA.sessionsSinceLastSeen !== perfB.sessionsSinceLastSeen) {
      return perfB.sessionsSinceLastSeen - perfA.sessionsSinceLastSeen;
    }
    
    return perfA.recallStrength - perfB.recallStrength;
  });
  
  strongItems.sort((a, b) => {
    const perfA = performances.get(a.id)!;
    const perfB = performances.get(b.id)!;
    
    return perfB.sessionsSinceLastSeen - perfA.sessionsSinceLastSeen;
  });
  
  const selectedNew = shuffleArray(newItems).slice(0, newQuestionCount);
  const selectedFailed = failedItems.slice(0, failedQuestionCount);
  const selectedReview = needsReviewItems.slice(0, reviewQuestionCount);
  const selectedStrong = strongItems.slice(0, strongQuestionCount);
  
  let allSelected = [
    ...selectedFailed,
    ...selectedNew,
    ...selectedReview,
    ...selectedStrong
  ];
  
  if (allSelected.length < targetCount) {
    const recentlyAnsweredIds = new Set(recentlyAnsweredCorrectly.map(item => item.id));
    const remaining = seenItems.filter(
      item => !allSelected.find(s => s.id === item.id) && !recentlyAnsweredIds.has(item.id)
    );
    const needed = targetCount - allSelected.length;
    const additional = shuffleArray(remaining).slice(0, needed);
    allSelected = [...allSelected, ...additional];
  }
  
  if (allSelected.length < targetCount && newItems.length > newQuestionCount) {
    const additionalNew = newItems
      .filter(item => !allSelected.find(s => s.id === item.id))
      .slice(0, targetCount - allSelected.length);
    allSelected = [...allSelected, ...additionalNew];
  }
  
  const finalSelected = shuffleArray(allSelected).slice(0, targetCount);
  
  return {
    newQuestions: selectedNew,
    failedQuestions: selectedFailed,
    reviewQuestions: [...selectedReview, ...selectedStrong],
    selectedItems: finalSelected
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getItemsDueForReview(
  allItems: MemoryItem[],
  userProgress: UserProgress,
  categories: CategoryId[]
): MemoryItem[] {
  const filteredItems = allItems.filter(item => 
    categories.includes(item.categoryId)
  );
  
  const dueItems: Array<{ item: MemoryItem; priority: number }> = [];
  
  for (const item of filteredItems) {
    const performance = calculateItemPerformance(item.id, userProgress);
    
    if (performance.totalAttempts === 0) {
      dueItems.push({ item, priority: 50 });
      continue;
    }
    
    let priority = 0;
    
    if (performance.consecutiveFails > 0) {
      priority = 100 - (performance.sessionsSinceLastSeen * 5);
    } else if (performance.recallStrength < 40) {
      priority = 80 - (performance.sessionsSinceLastSeen * 5);
    } else if (performance.sessionsSinceLastSeen >= 2) {
      priority = Math.max(20, 60 - (performance.recallStrength / 2));
    } else if (performance.sessionsSinceLastSeen >= 3) {
      priority = 30;
    }
    
    if (priority > 0) {
      dueItems.push({ item, priority });
    }
  }
  
  dueItems.sort((a, b) => b.priority - a.priority);
  
  return dueItems.map(d => d.item);
}
