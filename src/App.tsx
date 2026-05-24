import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Home } from './components/Home';
import { Practice } from './components/Practice';
import { Library } from './components/Library';
import { Progress } from './components/Progress';
import { CategoryId, MemoryItem, UserProgress } from './lib/types';
import { sampleMemoryItems } from './lib/data';
import { Toaster } from './components/ui/sonner';

type View = 'home' | 'practice' | 'library' | 'progress';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [migrated, setMigrated] = useState(false);
  
  const [allItems, setAllItems] = useKV<MemoryItem[]>('memory-items', sampleMemoryItems);
  const [userProgress, setUserProgress] = useKV<UserProgress>('user-progress', {
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: '',
    totalSessions: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    difficultItems: [],
    favoriteItems: [],
    customItems: [],
    sessions: []
  });

  useEffect(() => {
    if (!migrated && allItems && allItems.length < 100) {
      const nonCustomIds = new Set(allItems.filter(item => !item.isCustom).map(item => item.id));
      const missingSampleItems = sampleMemoryItems.filter(item => !nonCustomIds.has(item.id));
      
      if (missingSampleItems.length > 0) {
        setAllItems((current) => [...(current || []), ...missingSampleItems]);
      }
      setMigrated(true);
    }
  }, [migrated, allItems, setAllItems]);

  const startPractice = (categories: CategoryId[], difficulty: 'easy' | 'medium' | 'hard' | 'all' = 'all') => {
    setSelectedCategories(categories);
    setSelectedDifficulty(difficulty);
    setCurrentView('practice');
  };

  const exitPractice = () => {
    setCurrentView('home');
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'home' && (
        <Home 
          onStartPractice={startPractice}
          userProgress={userProgress || {
            currentStreak: 0,
            longestStreak: 0,
            lastPracticeDate: '',
            totalSessions: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            difficultItems: [],
            favoriteItems: [],
            customItems: [],
            sessions: []
          }}
        />
      )}
      
      {currentView === 'practice' && allItems && userProgress && (
        <Practice 
          selectedCategories={selectedCategories}
          selectedDifficulty={selectedDifficulty}
          allItems={allItems}
          userProgress={userProgress}
          setUserProgress={setUserProgress as any}
          onExit={exitPractice}
        />
      )}
      
      {currentView === 'library' && allItems && userProgress && (
        <Library 
          allItems={allItems}
          userProgress={userProgress}
          setUserProgress={setUserProgress as any}
          setAllItems={setAllItems as any}
        />
      )}
      
      {currentView === 'progress' && userProgress && (
        <Progress 
          userProgress={userProgress}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-4">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              currentView === 'home' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentView('library')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              currentView === 'library' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs font-medium">Library</span>
          </button>
          
          <button
            onClick={() => setCurrentView('progress')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              currentView === 'progress' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-medium">Progress</span>
          </button>
        </div>
      </nav>
      
      <Toaster />
    </div>
  );
}

export default App;
