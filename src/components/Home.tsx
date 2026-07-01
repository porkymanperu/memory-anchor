import { useState } from 'react';
import { CategoryId, UserProgress } from '@/lib/types';
import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, SignOut } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface HomeProps {
  onStartPractice: (categories: CategoryId[], difficulty?: 'easy' | 'medium' | 'hard', questionCount?: number) => void;
  userProgress: UserProgress;
  onSignOut?: () => void;
}

export function Home({ onStartPractice, userProgress, onSignOut }: HomeProps) {
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionCount, setQuestionCount] = useState(10);

  const toggleCategory = (categoryId: CategoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleStartPractice = () => {
    if (selectedCategories.length > 0) {
      onStartPractice(selectedCategories, selectedDifficulty, questionCount);
    }
  };

  const getQuestionRange = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (difficulty === 'easy') return { min: 10, max: 15 };
    if (difficulty === 'medium') return { min: 15, max: 20 };
    return { min: 20, max: 30 };
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    const range = getQuestionRange(difficulty);
    setQuestionCount(range.min);
  };

  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.group]) {
      acc[category.group] = [];
    }
    acc[category.group].push(category);
    return acc;
  }, {} as Record<string, typeof categories>);

  const todaysSessions = userProgress.sessions?.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  }) || [];

  const hasCompletedToday = todaysSessions.length > 0;
  
  const recentSessions = userProgress.sessions?.slice(-3).reverse() || [];

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-5 pt-8 pb-6 space-y-6">
        {onSignOut && (
          <div className="flex justify-end -mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="text-muted-foreground hover:text-foreground gap-1.5 h-8 px-2"
              aria-label="Sign out"
            >
              <SignOut size={16} weight="regular" />
              <span className="text-xs font-medium">Sign out</span>
            </Button>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent mb-2 glow-primary">
            <Brain size={40} weight="duotone" className="text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">Memory Trainer</h1>
          <p className="text-muted-foreground text-base max-w-sm mx-auto">
            Entrena tu memoria con práctica conversacional inteligente
          </p>
        </motion.div>

        <div className="flex justify-center py-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCategoryDialog(true)}
            className="w-52 h-52 rounded-full bg-gradient-accent text-white shadow-2xl flex flex-col items-center justify-center group gap-3 glow-accent"
          >
            <Play size={48} weight="fill" className="ml-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl">Start Session</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${hasCompletedToday ? 'bg-success' : 'bg-muted'}`} />
            <h2 className="text-xl font-bold">Sesión de Hoy</h2>
          </div>
          
          {hasCompletedToday ? (
            <div className="space-y-3">
              <p className="text-success-foreground bg-success/20 px-4 py-3 rounded-xl text-sm font-semibold">
                ✓ Completada - ¡Excelente trabajo!
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-background-elevated rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-accent">{todaysSessions[0]?.questionsCorrect || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Correctas</p>
                </div>
                <div className="bg-background-elevated rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{todaysSessions[0]?.questionsAsked || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Total</p>
                </div>
                <div className="bg-background-elevated rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {todaysSessions[0]?.questionsAsked > 0 
                      ? Math.round((todaysSessions[0].questionsCorrect / todaysSessions[0].questionsAsked) * 100) 
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Precisión</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-background-elevated rounded-xl p-4 border border-border/50">
              <p className="text-muted-foreground text-sm text-center">
                Aún no has completado tu sesión de hoy
              </p>
            </div>
          )}
        </motion.div>

        {recentSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-premium space-y-4"
          >
            <h2 className="text-xl font-bold">Sesiones Recientes</h2>
            <div className="space-y-2">
              {recentSessions.map((session, index) => {
                const accuracy = session.questionsAsked > 0 
                  ? Math.round((session.questionsCorrect / session.questionsAsked) * 100) 
                  : 0;
                const sessionDate = new Date(session.date);
                
                return (
                  <div key={index} className="bg-background-elevated rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {sessionDate.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {session.questionsCorrect}/{session.questionsAsked} correctas
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-lg font-bold ${
                        accuracy >= 80 ? 'text-success' : 
                        accuracy >= 60 ? 'text-accent' : 
                        'text-muted-foreground'
                      }`}>
                        {accuracy}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Configurar Sesión</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Elige categorías y nivel de dificultad
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Nivel de Dificultad
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                  <motion.button
                    key={difficulty}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDifficultyChange(difficulty)}
                    className={`px-4 py-4 rounded-2xl transition-all font-bold text-sm capitalize ${
                      selectedDifficulty === difficulty
                        ? 'bg-gradient-accent text-white shadow-lg glow-accent'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 px-1">
                {selectedDifficulty === 'easy' && 'Preguntas simples, perfecto para empezar'}
                {selectedDifficulty === 'medium' && 'Desafío moderado, ideal para practicar'}
                {selectedDifficulty === 'hard' && 'Preguntas avanzadas para expertos'}
              </p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Cantidad de Preguntas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-4xl font-extrabold text-accent">{questionCount}</span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                    Rango: {getQuestionRange(selectedDifficulty).min}-{getQuestionRange(selectedDifficulty).max}
                  </span>
                </div>
                <div className="relative pt-1 px-1">
                  <input
                    type="range"
                    min={getQuestionRange(selectedDifficulty).min}
                    max={getQuestionRange(selectedDifficulty).max}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary"
                  />
                  <style>{`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: linear-gradient(135deg, oklch(0.65 0.22 220) 0%, oklch(0.70 0.25 250) 100%);
                      cursor: pointer;
                      box-shadow: 0 0 20px oklch(0.65 0.22 220 / 0.5);
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: linear-gradient(135deg, oklch(0.65 0.22 220) 0%, oklch(0.70 0.25 250) 100%);
                      cursor: pointer;
                      border: none;
                      box-shadow: 0 0 20px oklch(0.65 0.22 220 / 0.5);
                    }
                  `}</style>
                </div>
              </div>
            </div>
            {Object.entries(groupedCategories).map(([group, cats]) => (
              <div key={group}>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  {group}
                </h3>
                <div className="grid gap-3">
                  {cats.map(category => (
                    <motion.button
                      key={category.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCategory(category.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        selectedCategories.includes(category.id)
                          ? 'bg-accent/20 border-2 border-accent'
                          : 'bg-secondary border-2 border-transparent hover:border-border'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${category.color}30` }}
                        >
                          <span>
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
                        <span className="font-semibold">{category.name}</span>
                      </div>
                      {selectedCategories.includes(category.id) && (
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-2xl font-bold text-base"
              onClick={() => {
                setSelectedCategories([]);
                setShowCategoryDialog(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 h-14 rounded-2xl font-bold text-base bg-gradient-accent text-white glow-accent"
              onClick={handleStartPractice}
              disabled={selectedCategories.length === 0}
            >
              Comenzar ({selectedCategories.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
