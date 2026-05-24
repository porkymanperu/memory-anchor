import { useState } from 'react';
import { CategoryId, UserProgress } from '@/lib/types';
import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Brain, Play } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface HomeProps {
  onStartPractice: (categories: CategoryId[], difficulty?: 'easy' | 'medium' | 'hard' | 'all') => void;
  userProgress: UserProgress;
}

export function Home({ onStartPractice, userProgress }: HomeProps) {
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');

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
            className="w-32 h-32 rounded-full bg-primary text-primary-foreground shadow-2xl hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center group"
          >
            <Play size={48} weight="fill" className="ml-1 group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>

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
              Choose categories and difficulty level
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Difficulty Level
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {(['all', 'easy', 'medium', 'hard'] as const).map((difficulty) => (
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
                {selectedDifficulty === 'all' && 'Practice questions from all difficulty levels'}
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
