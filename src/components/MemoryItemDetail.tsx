import { motion } from 'framer-motion';
import { MemoryItem, CategoryId } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from '@phosphor-icons/react';
import { categories } from '@/lib/data';

interface MemoryItemDetailProps {
  item: MemoryItem;
  onBack: () => void;
}

export function MemoryItemDetail({ item, onBack }: MemoryItemDetailProps) {
  const getCategoryName = (categoryId: CategoryId) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const displayAnswer = item.answerType === 'multiple' && item.validAnswers
    ? item.validAnswers.join(', ')
    : item.answer;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20 min-h-screen bg-gradient-to-b from-background to-muted/20"
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 -ml-2 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Library
        </Button>

        <Card className="border-2 overflow-hidden shadow-lg">
          {item.answerImageUrl && (
            <div className="relative w-full bg-muted/30 border-b-2 border-primary/20">
              <img
                src={item.answerImageUrl}
                alt={displayAnswer}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <Badge 
                className="absolute top-4 left-4 font-medium"
                style={{ 
                  backgroundColor: categories.find(c => c.id === item.categoryId)?.color,
                  color: 'white',
                }}
              >
                {getCategoryName(item.categoryId)}
              </Badge>
            </div>
          )}

          <CardContent className="p-6 space-y-6">
            {!item.answerImageUrl && (
              <Badge 
                variant="secondary" 
                className="mb-2 w-fit font-medium"
                style={{ 
                  backgroundColor: `${categories.find(c => c.id === item.categoryId)?.color}15`, 
                  color: categories.find(c => c.id === item.categoryId)?.color,
                  borderColor: `${categories.find(c => c.id === item.categoryId)?.color}30`,
                }}
              >
                {getCategoryName(item.categoryId)}
              </Badge>
            )}

            <div>
              <h1 className="text-3xl font-bold mb-4 leading-tight">{displayAnswer}</h1>
            </div>

            {item.questions && item.questions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
                    Practice Questions
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {item.questions.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {item.questions.map((question, index) => (
                    <div
                      key={index}
                      className="bg-muted/50 rounded-lg p-3.5 border-l-4 border-primary"
                    >
                      <p className="text-sm leading-relaxed">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
                Hints
              </h3>
              <div className="space-y-2">
                {item.hints.map((hint, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-accent/10 to-transparent rounded-lg p-3 border-l-2 border-accent"
                  >
                    <p className="text-sm">
                      <span className="font-semibold text-accent mr-2">Hint {index + 1}:</span>
                      {hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
