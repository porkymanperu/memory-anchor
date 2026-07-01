import { useState, useEffect } from 'react';
import { CategoryId, MemoryItem, UserProgress, SessionQuestion } from '@/lib/types';
import { shuffleArray, getItemsByCategories, updateStreak, getRandomQuestion } from '@/lib/helpers';
import { selectQuestionsWithSpacedRepetition } from '@/lib/spaced-repetition';
import { insertSession } from '@/lib/repository';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, X, CheckCircle, ArrowRight, Trophy, Target, Clock } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface PracticeProps {
  selectedCategories: CategoryId[];
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  allItems: MemoryItem[];
  userProgress: UserProgress;
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onExit: () => void;
}

type SessionItem = MemoryItem & { displayQuestion: string };

type ViewMode = 'practice' | 'completed';

export function Practice({
  selectedCategories,
  selectedDifficulty,
  questionCount,
  allItems,
  userProgress,
  setUserProgress,
  onExit
}: PracticeProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('practice');
  const [sessionItems, setSessionItems] = useState<SessionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    hintsUsed: 0,
    startTime: Date.now()
  });
  const [rememberedCount, setRememberedCount] = useState<number | null>(null);
  const [questionResults, setQuestionResults] = useState<SessionQuestion[]>([]);
  const [completedSessionData, setCompletedSessionData] = useState<{
    accuracy: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
  } | null>(null);

  useEffect(() => {
    if (viewMode !== 'practice') return;
    if (sessionItems.length > 0) return;
    let items = getItemsByCategories(allItems, selectedCategories);
    
    items = items.filter(item => item.difficulty === selectedDifficulty);
    
    const selectionResult = selectQuestionsWithSpacedRepetition(
      items,
      userProgress,
      questionCount
    );
    
    const withDisplayQuestions = selectionResult.selectedItems.map(item => ({
      ...item,
      displayQuestion: getRandomQuestion(item)
    }));
    setSessionItems(withDisplayQuestions);
  }, [allItems, selectedCategories, selectedDifficulty, questionCount, userProgress, viewMode, sessionItems.length]);

  const currentItem = sessionItems[currentIndex];
  const progressPercent = sessionItems.length > 0 ? ((currentIndex + 1) / sessionItems.length) * 100 : 0;

  const handleHintReveal = () => {
    if (hintsRevealed < 2) {
      setHintsRevealed(hintsRevealed + 1);
      setSessionStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
    }
  };

  const handleShowAnswer = () => {
    setAnswerRevealed(true);
  };

  const recordQuestionResult = (wasCorrect: boolean) => {
    const questionResult: SessionQuestion = {
      itemId: currentItem.id,
      question: currentItem.displayQuestion,
      answer: currentItem.answer,
      answerType: currentItem.answerType,
      validAnswers: currentItem.validAnswers,
      wasCorrect,
      hintsUsed: hintsRevealed
    };
    
    setQuestionResults(prev => [...prev, questionResult]);
  };

  const handleMarkCorrect = () => {
    const isMultipleValueAnswer = currentItem.answerType === 'multiple' && currentItem.validAnswers;
    
    let wasCorrect = false;
    
    if (isMultipleValueAnswer) {
      if (rememberedCount === null) {
        toast.error('Please select how many answers you remembered');
        return;
      }
      const totalAnswers = currentItem.validAnswers!.length;
      const partialCorrect = rememberedCount / totalAnswers;
      setSessionStats(prev => ({ ...prev, correct: prev.correct + partialCorrect }));
      wasCorrect = rememberedCount === totalAnswers;
    } else {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      wasCorrect = true;
    }
    
    recordQuestionResult(wasCorrect);
    handleNext();
  };

  const handleSkip = () => {
    recordQuestionResult(false);
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < sessionItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHintsRevealed(0);
      setAnswerRevealed(false);
      setRememberedCount(null);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    const newProgress = updateStreak(userProgress);
    const totalTime = Date.now() - sessionStats.startTime;
    const totalTimeSeconds = Math.round(totalTime / 1000);
    const averageTime = Math.round(totalTime / sessionItems.length / 1000);
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const localDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    
    const newSession = {
      id: Date.now().toString(),
      date: localDateString,
      categoryIds: selectedCategories,
      difficulty: selectedDifficulty,
      questionsAsked: sessionItems.length,
      questionsCorrect: sessionStats.correct,
      hintsUsed: sessionStats.hintsUsed,
      averageTime: averageTime,
      totalTimeSeconds: totalTimeSeconds,
      itemsReviewed: sessionItems.map(item => item.id),
      questions: questionResults
    };
    
    const updatedItemHistory = { ...(userProgress.itemHistory || {}) };
    
    for (const result of questionResults) {
      const itemId = result.itemId;
      const existing = updatedItemHistory[itemId];
      
      if (existing) {
        const newConsecutiveCorrect = result.wasCorrect ? existing.consecutiveCorrect + 1 : 0;
        const newConsecutiveFails = !result.wasCorrect ? existing.consecutiveFails + 1 : 0;
        
        updatedItemHistory[itemId] = {
          itemId,
          lastSeenDate: localDateString,
          totalAttempts: existing.totalAttempts + 1,
          correctAttempts: existing.correctAttempts + (result.wasCorrect ? 1 : 0),
          consecutiveCorrect: newConsecutiveCorrect,
          consecutiveFails: newConsecutiveFails,
          totalHintsUsed: existing.totalHintsUsed + result.hintsUsed,
          lastWasCorrect: result.wasCorrect
        };
      } else {
        updatedItemHistory[itemId] = {
          itemId,
          lastSeenDate: localDateString,
          totalAttempts: 1,
          correctAttempts: result.wasCorrect ? 1 : 0,
          consecutiveCorrect: result.wasCorrect ? 1 : 0,
          consecutiveFails: result.wasCorrect ? 0 : 1,
          totalHintsUsed: result.hintsUsed,
          lastWasCorrect: result.wasCorrect
        };
      }
    }

    // Persist the session row separately. `setUserProgress` writes only the
    // scalar `user_progress` columns — the `sessions` array is derived at read
    // time by joining `practice_sessions`, so a session won't appear after
    // refresh unless we insert it here.
    insertSession(newSession).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[Practice] insertSession failed', err);
      const message =
        err instanceof Error ? err.message : 'Could not save practice session.';
      toast.error(message);
    });

    setUserProgress(prev => ({
      ...newProgress,
      totalSessions: prev.totalSessions + 1,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + sessionItems.length,
      totalCorrectAnswers: prev.totalCorrectAnswers + sessionStats.correct,
      sessions: [newSession, ...(Array.isArray(prev.sessions) ? prev.sessions : [])],
      itemHistory: updatedItemHistory
    }));

    const accuracy = Math.round((sessionStats.correct / sessionItems.length) * 100);
    
    setCompletedSessionData({
      accuracy,
      totalQuestions: sessionItems.length,
      correctAnswers: Math.round(sessionStats.correct),
      timeSpent: totalTimeSeconds
    });
    
    setViewMode('completed');
  };

  if (viewMode === 'completed' && completedSessionData) {
    const minutes = Math.floor(completedSessionData.timeSpent / 60);
    const seconds = completedSessionData.timeSpent % 60;
    const timeDisplay = minutes > 0 
      ? `${minutes} min ${seconds} sec`
      : `${seconds} sec`;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="border-2 shadow-xl">
            <CardContent className="pt-12 pb-10 px-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-primary to-accent rounded-full p-6">
                    <Trophy size={64} weight="duotone" className="text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-center mb-2"
              >
                Session Complete!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-muted-foreground mb-8"
              >
                Great job on completing your practice
              </motion.p>

              <div className="space-y-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 flex items-center justify-between border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 rounded-full p-3">
                      <Target size={24} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="text-2xl font-bold text-primary">{completedSessionData.accuracy}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-lg font-semibold">{completedSessionData.correctAnswers}/{completedSessionData.totalQuestions}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl p-4 flex items-center gap-3 border border-accent/20"
                >
                  <div className="bg-accent/20 rounded-full p-3">
                    <Clock size={24} weight="duotone" className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                    <p className="text-xl font-bold">{timeDisplay}</p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={onExit}
                  size="lg"
                  className="w-full text-lg"
                >
                  Back to Home
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentIndex + 1} of {sessionItems.length}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="ml-4"
          >
            <X size={24} />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 border-2">
              <CardContent className="pt-8 pb-8">
                <p className="text-2xl font-semibold leading-relaxed text-center mb-6">
                  {currentItem.displayQuestion}
                </p>

                {currentItem.imageUrl && (
                  <div className="my-6 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <img
                      src={currentItem.imageUrl}
                      alt="Memory prompt"
                      className="max-h-64 object-contain"
                    />
                  </div>
                )}

                {!answerRevealed && (
                  <div className="space-y-4 mt-8">
                    <AnimatePresence>
                      {hintsRevealed >= 1 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4"
                        >
                          <div className="flex gap-2">
                            <Lightbulb size={20} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-accent mb-1">Hint 1</p>
                              <p className="text-foreground">{currentItem.hints[0]}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {hintsRevealed >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4"
                        >
                          <div className="flex gap-2">
                            <Lightbulb size={20} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-accent mb-1">Hint 2</p>
                              <p className="text-foreground">{currentItem.hints[1]}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3 pt-4">
                      {hintsRevealed < 2 && (
                        <Button
                          variant="outline"
                          onClick={handleHintReveal}
                          className="flex-1"
                        >
                          <Lightbulb size={20} weight="duotone" className="mr-2" />
                          {hintsRevealed === 0 ? 'Need a Hint' : 'Another Hint'}
                        </Button>
                      )}
                      <Button
                        onClick={handleShowAnswer}
                        className="flex-1"
                        variant={hintsRevealed < 2 ? 'outline' : 'default'}
                      >
                        Show Answer
                      </Button>
                    </div>
                  </div>
                )}

                {answerRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 space-y-6"
                  >
                    {currentItem.answerType === 'multiple' && currentItem.validAnswers ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <CheckCircle size={32} weight="duotone" className="text-primary" />
                          </div>
                          <p className="text-lg font-bold text-primary mb-4">
                            Valid Answers
                          </p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border-2 border-primary/20 space-y-3">
                          {currentItem.validAnswers.map((answer, index) => (
                            <motion.div
                              key={index}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-3 bg-primary/5 rounded-lg p-3 border border-primary/20"
                            >
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                                {index + 1}
                              </div>
                              <p className="text-base font-medium text-foreground">
                                {answer}
                              </p>
                            </motion.div>
                          ))}
                        </div>

                        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-5 border-2 border-accent/30">
                          <p className="text-center text-sm font-semibold text-accent mb-4">
                            How many did you remember?
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from({ length: currentItem.validAnswers.length + 1 }, (_, i) => i).map((count) => (
                              <Button
                                key={count}
                                variant={rememberedCount === count ? 'default' : 'outline'}
                                size="lg"
                                onClick={() => setRememberedCount(count)}
                                className={`min-w-14 h-14 text-lg font-bold ${
                                  rememberedCount === count ? 'ring-2 ring-accent ring-offset-2' : ''
                                }`}
                              >
                                {count}
                              </Button>
                            ))}
                          </div>
                          {rememberedCount !== null && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center text-sm text-muted-foreground mt-4"
                            >
                              Score: {Math.round((rememberedCount / currentItem.validAnswers.length) * 100)}%
                            </motion.p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                          <CheckCircle size={32} weight="duotone" className="text-primary" />
                        </div>
                        <p className="text-3xl font-bold text-primary mb-2">
                          {currentItem.answer}
                        </p>
                      </div>
                    )}

                    {currentItem.answerImageUrl && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl overflow-hidden bg-muted/30 border-2 border-primary/20 shadow-lg"
                      >
                        <img
                          src={currentItem.answerImageUrl}
                          alt={`Visual aid for ${currentItem.answer || 'answers'}`}
                          className="w-full h-auto max-h-80 object-contain"
                        />
                      </motion.div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleSkip}
                        className="flex-1"
                      >
                        Skip
                      </Button>
                      <Button
                        onClick={handleMarkCorrect}
                        className="flex-1"
                      >
                        {currentItem.answerType === 'multiple' ? 'Continue' : 'I Got It Right'}
                        <ArrowRight size={20} weight="bold" className="ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center gap-2">
              {sessionItems.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx < currentIndex
                      ? 'w-8 bg-primary'
                      : idx === currentIndex
                      ? 'w-12 bg-primary'
                      : 'w-2 bg-border'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
