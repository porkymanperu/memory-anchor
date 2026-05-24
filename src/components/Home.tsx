import { useState } from 'react';
import { CategoryId, UserProgress } from '@/lib/types';
import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, CheckCircle, XCircle, Calendar, Target } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { format, isToday, parseISO } from 'date-fns';

interface HomeProps {
  onStartPractice: (categories: CategoryId[], difficulty?: 'easy' | 'medium' | 'hard') => void;
  userProgress: UserProgress;
}

export function Home({ onStartPractice, userProgress }: HomeProps) {
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const toggleCategory = (categoryId: CategoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleStartPractice = () => {
    if (selectedCategories.length > 0) {
      onStartPractice(selectedCategories, selectedDifficulty);
    }
  };

  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.group]) {
      acc[category.group] = [];
    }
    acc[category.group].push(category);
    return acc;
  }, {} as Record<string, typeof categories>);

  const hasCompletedToday = userProgress.sessions.some((session) => {
    try {
      return isToday(parseISO(session.date));
    } catch {
      return false;
    }
  });

  const recentSessions = userProgress.sessions
    .slice(-5)
    .reverse()
    .map((session) => {
      const accuracy = session.questionsAsked > 0 
        ? Math.round((session.questionsCorrect / session.questionsAsked) * 100)
        : 0;
      return { ...session, accuracy };
    });

  return (
    <div className="pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Brain size={32} weight="duotone" className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Memory Trainer</h1>
          <p className="text-muted-foreground text-lg">
            Train your memory through conversational recall
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCategoryDialog(true)}
            className="w-48 h-48 rounded-full bg-white text-primary shadow-2xl hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center group gap-2"
          >
            <Play size={40} weight="fill" className="ml-1 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-lg">Start Session</span>
          </motion.button>
        </div>

        <Card className="mt-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-background">
              {hasCompletedToday ? (
                <>
                  <CheckCircle size={32} weight="fill" className="text-success flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-success">Session Complete!</p>
                    <p className="text-sm text-muted-foreground">Great work today! Keep up your streak.</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={32} weight="fill" className="text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">No Session Yet</p>
                    <p className="text-sm text-muted-foreground">Start your practice session today!</p>
                  </div>
                </>
              )}
            </div>

            {recentSessions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Recent Sessions
                  </h3>
                </div>
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {format(parseISO(session.date), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.questionsCorrect}/{session.questionsAsked} correct
                      </p>
                    </div>
                    <Badge 
                      variant={session.accuracy >= 80 ? 'default' : session.accuracy >= 60 ? 'secondary' : 'outline'}
                      className="font-semibold"
                    >
                      {session.accuracy}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {recentSessions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No sessions yet. Start your first one!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Practice Categories</DialogTitle>
            <DialogDescription>
              Choose categories and difficulty level
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Difficulty Level
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm capitalize ${
                      selectedDifficulty === difficulty
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedDifficulty === 'easy' && 'Simple questions, perfect for beginners'}
                {selectedDifficulty === 'medium' && 'Moderate challenge, good for practice'}
                {selectedDifficulty === 'hard' && 'Advanced questions for experienced learners'}
              </p>
            </div>
            {Object.entries(groupedCategories).map(([group, cats]) => (
              <div key={group}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {group}
                </h3>
                <div className="grid gap-2">
                  {cats.map(category => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        selectedCategories.includes(category.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <span className="text-xl">
                            {category.icon === 'user' && '👤'}
                            {category.icon === 'film' && '🎬'}
                            {category.icon === 'music-notes' && '🎵'}
                            {category.icon === 'microphone' && '🎤'}
                            {category.icon === 'disc' && '💿'}
                            {category.icon === 'buildings' && '🏙️'}
                            {category.icon === 'fork-knife' && '🍽️'}
                            {category.icon === 'signpost' && '🪧'}
                            {category.icon === 't-shirt' && '👕'}
                            {category.icon === 'sneaker' && '👟'}
                            {category.icon === 'watch' && '⌚'}
                            {category.icon === 'drop' && '💧'}
                            {category.icon === 'diamond' && '💎'}
                          </span>
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      {selectedCategories.includes(category.id) && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedCategories([]);
                setShowCategoryDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleStartPractice}
              disabled={selectedCategories.length === 0}
            >
              Start ({selectedCategories.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
