import { useState } from 'react';
import { CategoryId, UserProgress } from '@/lib/types';
import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Brain, Fire, Trophy } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface HomeProps {
  onStartPractice: (categories: CategoryId[]) => void;
  userProgress: UserProgress;
}

export function Home({ onStartPractice, userProgress }: HomeProps) {
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);

  const toggleCategory = (categoryId: CategoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleStartPractice = () => {
    if (selectedCategories.length > 0) {
      onStartPractice(selectedCategories);
    }
  };

  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.group]) {
      acc[category.group] = [];
    }
    acc[category.group].push(category);
    return acc;
  }, {} as Record<string, typeof categories>);

  return (
    <div className="pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Brain size={32} weight="duotone" className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Memory Trainer</h1>
          <p className="text-muted-foreground text-lg">
            Train your memory through conversational recall
          </p>
        </motion.div>

        <div className="grid gap-4 mb-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Fire size={24} weight="fill" className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold">{userProgress.currentStreak} days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Best</p>
                  <p className="text-xl font-semibold text-muted-foreground">{userProgress.longestStreak}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <Trophy size={24} className="text-primary mb-2" weight="duotone" />
                <p className="text-2xl font-bold">{userProgress.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Sessions</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold mb-2">
                  {userProgress.totalQuestionsAnswered > 0
                    ? Math.round((userProgress.totalCorrectAnswers / userProgress.totalQuestionsAnswered) * 100)
                    : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-14 text-lg font-semibold"
          onClick={() => setShowCategoryDialog(true)}
        >
          <Brain size={24} weight="duotone" className="mr-2" />
          Start Practice Session
        </Button>

        <Card className="mt-8 bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="text-lg">How it Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium">Choose Categories</p>
                <p className="text-sm text-muted-foreground">Select topics you want to practice</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium">Answer Questions</p>
                <p className="text-sm text-muted-foreground">Recall names through conversational prompts</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium">Learn Associations</p>
                <p className="text-sm text-muted-foreground">Discover memory techniques for each answer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Practice Categories</DialogTitle>
            <DialogDescription>
              Choose one or more categories to practice
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
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
