import { useState } from 'react';
import { motion } from 'framer-motion';
import { MemoryItem, CategoryId } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkle } from '@phosphor-icons/react';
import { categories } from '@/lib/data';
import { toast } from 'sonner';

interface MemoryItemDetailProps {
  item: MemoryItem;
  onBack: () => void;
}

interface MemoryTip {
  technique: string;
  suggestion: string;
}

export function MemoryItemDetail({ item, onBack }: MemoryItemDetailProps) {
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);
  const [memoryTip, setMemoryTip] = useState<MemoryTip | null>(null);

  const getCategoryName = (categoryId: CategoryId) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const handleGenerateMemoryTip = async () => {
    setIsGeneratingTip(true);
    
    try {
      const answerValue = item.answerType === 'multiple' && item.validAnswers
        ? item.validAnswers.join(', ')
        : item.answer;
      
      const categoryName = getCategoryName(item.categoryId);
      
      const promptText = `Eres un asistente de entrenamiento de memoria especializado en crear asociaciones memorables.

Crea un consejo de asociación de memoria para recordar: "${answerValue}" en la categoría "${categoryName}"

La técnica de memoria debe usar uno de estos enfoques:
- Imágenes visuales (imágenes mentales vívidas)
- Asociaciones fonéticas (palabras que suenan similar)
- Conexiones emocionales (sentimientos o historias)
- Asociaciones con objetos físicos (elementos concretos)
- Rimas o juegos de palabras
- Asociaciones basadas en historias

Devuelve SOLO un objeto JSON válido con esta estructura exacta:
{
  "technique": "Nombre breve de la técnica (ej., 'Historia Visual y Emocional', 'Asociación Fonética', 'Memoria Basada en Objetos')",
  "suggestion": "Una sugerencia creativa, vívida y memorable que ayude a reforzar el recuerdo. Hazla conversacional, específica y fácil de visualizar. Enfócate en la imagen mental o escenario, no en explicar por qué funciona."
}

Haz que la sugerencia sea creativa, memorable y conversacional. Manténla concisa pero impactante (máximo 2-4 oraciones).`;

      const response = await window.spark.llm(promptText, 'gpt-4o', true);
      const result = JSON.parse(response) as MemoryTip;
      
      if (result.technique && result.suggestion) {
        setMemoryTip(result);
        toast.success('Memory tip generated!');
      } else {
        toast.error('Unexpected response format. Please try again.');
      }
    } catch (error) {
      console.error('Error generating memory tip:', error);
      toast.error('Failed to generate memory tip. Please try again.');
    } finally {
      setIsGeneratingTip(false);
    }
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

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
                  Memory Association
                </h3>
                <Button
                  onClick={handleGenerateMemoryTip}
                  disabled={isGeneratingTip}
                  className="gap-2"
                  size="sm"
                >
                  <Sparkle size={16} weight={isGeneratingTip ? 'regular' : 'fill'} className={isGeneratingTip ? 'animate-spin' : ''} />
                  {isGeneratingTip ? 'Generating...' : memoryTip ? 'Regenerate Tip' : 'Generate Memory Tip'}
                </Button>
              </div>

              {memoryTip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-5 border-2 border-primary/20 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Sparkle size={18} weight="fill" className="text-primary" />
                    <h4 className="text-base font-bold text-primary">
                      {memoryTip.technique}
                    </h4>
                  </div>
                  <p className="text-base leading-relaxed text-foreground/90 font-secondary italic">
                    {memoryTip.suggestion}
                  </p>
                </motion.div>
              )}

              {!memoryTip && !isGeneratingTip && (
                <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-muted-foreground/30 text-center">
                  <p className="text-sm text-muted-foreground">
                    Click the button above to generate an AI-powered memory tip
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
