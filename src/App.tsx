import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Home } from './components/Home';
import { Practice } from './components/Practice';
import { Library } from './components/Library';
import { Progress } from './components/Progress';
import { Goals } from './components/Goals';
import { SignIn } from './components/SignIn';
import { CategoryId, DeletedMemoryItem, MemoryItem, UserProgress } from './lib/types';
import { sampleMemoryItems, DATA_VERSION } from './lib/data';
import { getCurrentUser, onAuthChange, signOut } from './lib/auth';
import {
  bulkUpsertMemoryItems,
  getDataVersion,
  listMemoryItems,
  setDataVersion as writeDataVersion,
} from './lib/repository';
import {
  useDataVersionKV,
  useMemoryItemsKV,
  useRecycleBinKV,
  useUserProgressKV,
} from './hooks/queries';
import { Toaster } from './components/ui/sonner';

type View = 'home' | 'practice' | 'library' | 'progress' | 'goals';
type AuthStatus = 'loading' | 'signed-in' | 'signed-out';

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [currentView, setCurrentView] = useState<View>('home');
  const queryClient = useQueryClient();
  const seedAttemptedRef = useRef(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionCount, setQuestionCount] = useState<number>(10);

  useEffect(() => {
    let cancelled = false;

    getCurrentUser()
      .then((user) => {
        if (cancelled) return;
        setAuthStatus(user ? 'signed-in' : 'signed-out');
      })
      .catch(() => {
        if (!cancelled) setAuthStatus('signed-out');
      });

    const unsubscribe = onAuthChange((_event, session) => {
      setAuthStatus(session?.user ? 'signed-in' : 'signed-out');
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      seedAttemptedRef.current = false;
      setCurrentView('home');
      toast.success('Signed out.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not sign out.';
      toast.error(message);
    }
  };
  
  const [dataVersion, setDataVersion] = useDataVersionKV('1.0');
  const [allItems, setAllItems] = useMemoryItemsKV(sampleMemoryItems);
  const [recycleBinItems, setRecycleBinItems] = useRecycleBinKV();
  const [userProgress, setUserProgress] = useUserProgressKV({
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

  // Seed sample data on first sign-in (or after a DATA_VERSION bump).
  // Reads `getDataVersion()` directly from Supabase so the decision is based
  // on the authoritative server value rather than the hook's loading default.
  // Custom items (isCustom = true) are preserved across reseeds.
  useEffect(() => {
    if (authStatus !== 'signed-in') return;
    if (seedAttemptedRef.current) return;
    seedAttemptedRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const currentVersion = await getDataVersion();
        if (cancelled) return;
        if (currentVersion === DATA_VERSION) return;

        const existing = await listMemoryItems();
        if (cancelled) return;

        const customItems = existing.filter((item) => item.isCustom);
        const merged = [...sampleMemoryItems, ...customItems];

        await bulkUpsertMemoryItems(merged);
        if (cancelled) return;

        await writeDataVersion(DATA_VERSION);
        if (cancelled) return;

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['memory-items'] }),
          queryClient.invalidateQueries({ queryKey: ['data-version'] }),
        ]);
      } catch (err) {
        // Allow a retry on next mount / next auth change.
        seedAttemptedRef.current = false;
        const message =
          err instanceof Error ? err.message : 'Could not load sample data.';
        toast.error(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authStatus, queryClient]);

  const startPractice = (categories: CategoryId[], difficulty: 'easy' | 'medium' | 'hard' = 'easy', count?: number) => {
    setSelectedCategories(categories);
    setSelectedDifficulty(difficulty);
    setQuestionCount(count || 10);
    setCurrentView('practice');
  };

  const exitPractice = () => {
    setCurrentView('home');
    setSelectedCategories([]);
  };

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
        <Toaster />
      </div>
    );
  }

  if (authStatus === 'signed-out') {
    return (
      <>
        <SignIn />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20">
        {currentView === 'home' && (
          <Home 
            onStartPractice={startPractice}
            onSignOut={handleSignOut}
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
            questionCount={questionCount}
            allItems={allItems}
            userProgress={userProgress}
            setUserProgress={setUserProgress as any}
            onExit={exitPractice}
          />
        )}
        
        {currentView === 'library' && allItems && userProgress && (
          <Library 
            allItems={allItems}
            recycleBinItems={recycleBinItems || []}
            userProgress={userProgress}
            setUserProgress={setUserProgress as any}
            setAllItems={setAllItems as any}
            setRecycleBinItems={setRecycleBinItems as any}
          />
        )}
        
        {currentView === 'progress' && userProgress && (
          <Progress 
            userProgress={userProgress}
            setUserProgress={setUserProgress as any}
          />
        )}

        {currentView === 'goals' && userProgress && (
          <Goals userProgress={userProgress} />
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50 z-50">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-20 px-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 transition-all duration-200 ${
              currentView === 'home' 
                ? 'text-accent scale-105' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`transition-all duration-200 ${currentView === 'home' ? 'transform -translate-y-0.5' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={currentView === 'home' ? 2.5 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className={`text-xs font-semibold tracking-wide ${currentView === 'home' ? 'opacity-100' : 'opacity-70'}`}>Inicio</span>
          </button>
          
          <button
            onClick={() => setCurrentView('library')}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 transition-all duration-200 ${
              currentView === 'library' 
                ? 'text-accent scale-105' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`transition-all duration-200 ${currentView === 'library' ? 'transform -translate-y-0.5' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={currentView === 'library' ? 2.5 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className={`text-xs font-semibold tracking-wide ${currentView === 'library' ? 'opacity-100' : 'opacity-70'}`}>Biblioteca</span>
          </button>

          <button
            onClick={() => setCurrentView('goals')}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 transition-all duration-200 ${
              currentView === 'goals' 
                ? 'text-accent scale-105' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`transition-all duration-200 ${currentView === 'goals' ? 'transform -translate-y-0.5' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={currentView === 'goals' ? 2.5 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className={`text-xs font-semibold tracking-wide ${currentView === 'goals' ? 'opacity-100' : 'opacity-70'}`}>Metas</span>
          </button>
          
          <button
            onClick={() => setCurrentView('progress')}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 transition-all duration-200 ${
              currentView === 'progress' 
                ? 'text-accent scale-105' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`transition-all duration-200 ${currentView === 'progress' ? 'transform -translate-y-0.5' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={currentView === 'progress' ? 2.5 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className={`text-xs font-semibold tracking-wide ${currentView === 'progress' ? 'opacity-100' : 'opacity-70'}`}>Progreso</span>
          </button>
        </div>
      </nav>
      
      <Toaster />
    </div>
  );
}

export default App;
