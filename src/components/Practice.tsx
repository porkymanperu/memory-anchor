import { useState, useEffect } from 'react';
import { CategoryId, MemoryItem, UserProgress, SessionQuestion } from '@/lib/types';
import { shuffleArray, getItemsByCategories, updateStreak, getRandomQuestion } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, X, CheckCircle, ArrowRight, Sparkle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface PracticeProps {
  selectedCategories: CategoryId[];
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  allItems: MemoryItem[];
  userProgress: UserProgress;
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onExit: () => void;
}

type SessionItem = MemoryItem & { displayQuestion: string };

export function Practice({
  selectedCategories,
  selectedDifficulty,
  allItems,
  userProgress,
  setUserProgress,
  onExit
}: PracticeProps) {
  const [sessionItems, setSessionItems] = useState<SessionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [aiAssociation, setAiAssociation] = useState<{
    technique: string;
    explanation: string;
    imagery: string;
    mnemonic?: string;
  } | null>(null);
  const [isGeneratingAssociation, setIsGeneratingAssociation] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    hintsUsed: 0,
    startTime: Date.now()
  });
  const [rememberedCount, setRememberedCount] = useState<number | null>(null);
  const [questionResults, setQuestionResults] = useState<SessionQuestion[]>([]);

  useEffect(() => {
    let items = getItemsByCategories(allItems, selectedCategories);
    
    items = items.filter(item => item.difficulty === selectedDifficulty);
    
    const getQuestionCount = (difficulty: 'easy' | 'medium' | 'hard') => {
      if (difficulty === 'easy') {
        return Math.floor(Math.random() * 6) + 10;
      } else if (difficulty === 'medium') {
        return Math.floor(Math.random() * 6) + 15;
      } else if (difficulty === 'hard') {
        return Math.floor(Math.random() * 11) + 20;
      }
      return 10;
    };
    
    const questionCount = getQuestionCount(selectedDifficulty);
    const shuffled = shuffleArray(items).slice(0, questionCount);
    const withDisplayQuestions = shuffled.map(item => ({
      ...item,
      displayQuestion: getRandomQuestion(item)
    }));
    setSessionItems(withDisplayQuestions);
  }, [allItems, selectedCategories, selectedDifficulty]);

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

  const generateMemoryAssociation = async () => {
    if (isGeneratingAssociation || !currentItem) return;
    
    setIsGeneratingAssociation(true);
    
    try {
      const answerText = currentItem.answerType === 'multiple' && currentItem.validAnswers
        ? `Multiple answers: ${currentItem.validAnswers.join(', ')}`
        : currentItem.answer;
      
      const promptText = `You are a memory expert helping users create memorable associations.

Generate a personalized memory association for the following:
- Question: ${currentItem.displayQuestion}
- Answer: ${answerText}
- Category: ${currentItem.categoryId}

Create a memory association that:
1. Uses creative techniques like phonetics, visual similarity, emotions, or storytelling
2. Provides a short explanation of why the association works
3. Includes vivid mental imagery or a memorable scenario
4. Is conversational, engaging, and helps strengthen long-term recall

Return the result as JSON with this structure:
{
  "technique": "Name of the memory technique (e.g., 'Visual Association', 'Phonetic Link', 'Emotional Story')",
  "explanation": "A brief 1-2 sentence explanation of why this association works",
  "imagery": "A vivid, detailed mental image or scenario (2-3 sentences)",
  "mnemonic": "Optional: A short memorable phrase or acronym if applicable"
}`;

      const response = await window.spark.llm(promptText, 'gpt-4o', true);
      const association = JSON.parse(response);
      
      setAiAssociation(association);
      toast.success('Memory association generated!');
    } catch (error) {
      console.error('Error generating association:', error);
      toast.error('Failed to generate memory association. Please try again.');
    } finally {
      setIsGeneratingAssociation(false);
    }
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
      setAiAssociation(null);
      setRememberedCount(null);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    const newProgress = updateStreak(userProgress);
    const totalTime = Date.now() - sessionStats.startTime;
    const averageTime = Math.round(totalTime / sessionItems.length / 1000);
    
    const newSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      categoryIds: selectedCategories,
      questionsAsked: sessionItems.length,
      questionsCorrect: sessionStats.correct,
      hintsUsed: sessionStats.hintsUsed,
      averageTime: averageTime,
      itemsReviewed: sessionItems.map(item => item.id),
      questions: questionResults
    };
    
    setUserProgress(prev => ({
      ...newProgress,
      totalSessions: prev.totalSessions + 1,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + sessionItems.length,
      totalCorrectAnswers: prev.totalCorrectAnswers + sessionStats.correct,
      sessions: [newSession, ...(Array.isArray(prev.sessions) ? prev.sessions : [])]
    }));

    const accuracy = Math.round((sessionStats.correct / sessionItems.length) * 100);
    
    toast.success(`Session Complete! ${accuracy}% accuracy`, {
      description: `You got ${sessionStats.correct} out of ${sessionItems.length} correct.`
    });

    onExit();
  };

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  };

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

                    {!aiAssociation && (
                      <div className="flex justify-center">
                        <Button
                          onClick={generateMemoryAssociation}
                          disabled={isGeneratingAssociation}
                          variant="outline"
                          className="gap-2 border-2 border-dashed border-accent/40 hover:border-accent hover:bg-accent/10"
                        >
                          {isGeneratingAssociation ? (
                            <>
                              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkle size={20} weight="duotone" className="text-accent" />
                              Generate AI Memory Tip
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {aiAssociation && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 rounded-xl p-6 space-y-4 border-2 border-accent/30 shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkle size={24} weight="duotone" className="text-accent" />
                          <p className="font-bold text-lg text-accent">AI-Generated Memory Tip</p>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-sm text-accent-foreground uppercase tracking-wide mb-3">
                            {aiAssociation.technique}
                          </p>
                        </div>

                        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border-l-4 border-accent">
                          <p className="font-secondary text-lg leading-relaxed text-foreground">
                            {aiAssociation.imagery}
                          </p>
                        </div>

                        {aiAssociation.mnemonic && (
                          <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                            <p className="text-sm font-medium text-accent mb-1">Memory Trick</p>
                            <p className="text-foreground italic">"{aiAssociation.mnemonic}"</p>
                          </div>
                        )}
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
