import { UserGoal, UserProgress, GoalTemplate, CategoryId } from './types';
import { goalTemplates } from './goal-templates';
import { parseISO, isAfter, isBefore, differenceInDays, startOfDay, format } from 'date-fns';

export function validateGoalProgress(
  goal: UserGoal,
  template: GoalTemplate,
  userProgress: UserProgress
): { currentValue: number; targetValue: number; percentage: number; isAchieved: boolean } {
  switch (template.category) {
    case 'consistency':
      return validateConsistencyGoal(goal, template, userProgress);
    case 'accuracy':
      return validateAccuracyGoal(goal, template, userProgress);
    case 'speed':
      return validateSpeedGoal(goal, template, userProgress);
    default:
      return { currentValue: 0, targetValue: 100, percentage: 0, isAchieved: false };
  }
}

function validateConsistencyGoal(
  goal: UserGoal,
  template: GoalTemplate,
  userProgress: UserProgress
): { currentValue: number; targetValue: number; percentage: number; isAchieved: boolean } {
  const targetDays = goal.configuration.numberOfDays || 7;
  const difficultyLevel = goal.configuration.difficultyLevel;
  
  const effectiveStartDate = goal.scheduledStartDate 
    ? startOfDay(parseISO(goal.scheduledStartDate))
    : startOfDay(parseISO(goal.startDate));
  
  if (isAfter(effectiveStartDate, startOfDay(new Date()))) {
    return {
      currentValue: 0,
      targetValue: targetDays,
      percentage: 0,
      isAchieved: false,
    };
  }

  const relevantSessions = userProgress.sessions.filter((session) => {
    const sessionDate = startOfDay(parseISO(session.date));
    const isAfterStart = isAfter(sessionDate, effectiveStartDate) || sessionDate.getTime() === effectiveStartDate.getTime();

    if (difficultyLevel) {
      const sessionDifficulty = getSessionDifficulty(session);
      return isAfterStart && sessionDifficulty === difficultyLevel;
    }
    return isAfterStart;
  });

  const uniqueDates = new Set(
    relevantSessions.map((session) => format(parseISO(session.date), 'yyyy-MM-dd'))
  );

  const completedDays = uniqueDates.size;
  const percentage = Math.min(100, Math.round((completedDays / targetDays) * 100));
  const isAchieved = completedDays >= targetDays;

  return {
    currentValue: completedDays,
    targetValue: targetDays,
    percentage,
    isAchieved,
  };
}

function validateAccuracyGoal(
  goal: UserGoal,
  template: GoalTemplate,
  userProgress: UserProgress
): { currentValue: number; targetValue: number; percentage: number; isAchieved: boolean } {
  const targetAccuracy = goal.configuration.accuracyPercentage || 80;
  const difficultyLevel = goal.configuration.difficultyLevel;
  const categoryId = goal.configuration.categoryId;
  
  const effectiveStartDate = goal.scheduledStartDate 
    ? startOfDay(parseISO(goal.scheduledStartDate))
    : startOfDay(parseISO(goal.startDate));
  
  if (isAfter(effectiveStartDate, startOfDay(new Date()))) {
    return {
      currentValue: 0,
      targetValue: targetAccuracy,
      percentage: 0,
      isAchieved: false,
    };
  }

  const relevantSessions = userProgress.sessions.filter((session) => {
    const sessionDate = startOfDay(parseISO(session.date));
    const isAfterStart = isAfter(sessionDate, effectiveStartDate) || sessionDate.getTime() === effectiveStartDate.getTime();

    let matchesCriteria = isAfterStart;

    if (difficultyLevel) {
      const sessionDifficulty = getSessionDifficulty(session);
      matchesCriteria = matchesCriteria && sessionDifficulty === difficultyLevel;
    }

    if (categoryId) {
      matchesCriteria = matchesCriteria && session.categoryIds.includes(categoryId);
    }

    return matchesCriteria;
  });

  let bestAccuracy = 0;
  relevantSessions.forEach((session) => {
    if (session.questionsAsked > 0) {
      const accuracy = (session.questionsCorrect / session.questionsAsked) * 100;
      if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
      }
    }
  });

  const percentage = Math.min(100, Math.round((bestAccuracy / targetAccuracy) * 100));
  const isAchieved = bestAccuracy >= targetAccuracy;

  return {
    currentValue: Math.round(bestAccuracy),
    targetValue: targetAccuracy,
    percentage,
    isAchieved,
  };
}

function validateSpeedGoal(
  goal: UserGoal,
  template: GoalTemplate,
  userProgress: UserProgress
): { currentValue: number; targetValue: number; percentage: number; isAchieved: boolean } {
  const effectiveStartDate = goal.scheduledStartDate 
    ? startOfDay(parseISO(goal.scheduledStartDate))
    : startOfDay(parseISO(goal.startDate));
  
  if (isAfter(effectiveStartDate, startOfDay(new Date()))) {
    if (goal.configuration.sessionDuration !== undefined) {
      return {
        currentValue: 0,
        targetValue: goal.configuration.sessionDuration,
        percentage: 0,
        isAchieved: false,
      };
    } else {
      return {
        currentValue: 0,
        targetValue: goal.configuration.improvementPercentage || 0,
        percentage: 0,
        isAchieved: false,
      };
    }
  }

  const relevantSessions = userProgress.sessions.filter((session) => {
    const sessionDate = startOfDay(parseISO(session.date));
    return isAfter(sessionDate, effectiveStartDate) || sessionDate.getTime() === effectiveStartDate.getTime();
  });

  if (goal.configuration.sessionDuration !== undefined) {
    const targetMinutes = goal.configuration.sessionDuration;
    const targetSeconds = targetMinutes * 60;

    let fastestSession = Number.MAX_SAFE_INTEGER;
    relevantSessions.forEach((session) => {
      if (session.totalTimeSeconds && session.totalTimeSeconds < fastestSession) {
        fastestSession = session.totalTimeSeconds;
      }
    });

    if (fastestSession === Number.MAX_SAFE_INTEGER) {
      return { currentValue: 0, targetValue: targetMinutes, percentage: 0, isAchieved: false };
    }

    const currentMinutes = Math.round(fastestSession / 60);
    const isAchieved = fastestSession <= targetSeconds;
    const percentage = isAchieved ? 100 : Math.min(100, Math.round((targetSeconds / fastestSession) * 100));

    return {
      currentValue: currentMinutes,
      targetValue: targetMinutes,
      percentage,
      isAchieved,
    };
  }

  if (goal.configuration.improvementPercentage !== undefined) {
    const targetImprovement = goal.configuration.improvementPercentage;

    const sessionsBeforeGoal = userProgress.sessions.filter((session) => {
      const sessionDate = startOfDay(parseISO(session.date));
      return isBefore(sessionDate, effectiveStartDate);
    });

    if (sessionsBeforeGoal.length === 0 || relevantSessions.length === 0) {
      return { currentValue: 0, targetValue: targetImprovement, percentage: 0, isAchieved: false };
    }

    const avgBefore = calculateAverageSessionTime(sessionsBeforeGoal);
    const avgAfter = calculateAverageSessionTime(relevantSessions);

    if (avgBefore === 0) {
      return { currentValue: 0, targetValue: targetImprovement, percentage: 0, isAchieved: false };
    }

    const improvement = ((avgBefore - avgAfter) / avgBefore) * 100;
    const percentage = Math.min(100, Math.round((improvement / targetImprovement) * 100));
    const isAchieved = improvement >= targetImprovement;

    return {
      currentValue: Math.round(improvement),
      targetValue: targetImprovement,
      percentage: Math.max(0, percentage),
      isAchieved,
    };
  }

  return { currentValue: 0, targetValue: 100, percentage: 0, isAchieved: false };
}

function getSessionDifficulty(session: any): 'easy' | 'medium' | 'hard' {
  const questionCount = session.questionsAsked;
  if (questionCount >= 20) return 'hard';
  if (questionCount >= 15) return 'medium';
  return 'easy';
}

function calculateAverageSessionTime(sessions: any[]): number {
  const validSessions = sessions.filter((s) => s.totalTimeSeconds && s.totalTimeSeconds > 0);
  if (validSessions.length === 0) return 0;

  const totalTime = validSessions.reduce((sum, s) => sum + s.totalTimeSeconds, 0);
  return totalTime / validSessions.length;
}

export function updateGoalStatuses(
  goals: UserGoal[],
  userProgress: UserProgress
): UserGoal[] {
  return goals.map((goal) => {
    const template = goalTemplates.find((t) => t.id === goal.templateId);
    if (!template) return goal;

    const validation = validateGoalProgress(goal, template, userProgress);

    const updatedGoal: UserGoal = {
      ...goal,
      progress: {
        currentValue: validation.currentValue,
        targetValue: validation.targetValue,
        percentage: validation.percentage,
      },
    };

    if (validation.isAchieved && goal.status !== 'achieved') {
      updatedGoal.status = 'achieved';
      updatedGoal.achievedDate = new Date().toISOString();
    } else if (validation.currentValue > 0 && goal.status === 'not-started') {
      updatedGoal.status = 'in-progress';
    }

    return updatedGoal;
  });
}
