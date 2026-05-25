import { useState, useMemo } from 'react';
import { UserProgress, PracticeSession, CategoryId, CategoryGroup } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Clock, CheckCircle, XCircle, Lightbulb, Funnel, X, Calendar, Target, Trash, StackSimple } from '@phosphor-icons/react';
import { formatDate, getLocalDateString } from '@/lib/helpers';
import { categories } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SessionCalendar } from '@/components/SessionCalendar';
import { isToday, parseISO, format } from 'date-fns';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProgressProps {
  userProgress: UserProgress;
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export function Progress({ userProgress, setUserProgress }: ProgressProps) {
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [questionFilter, setQuestionFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'none' | CategoryGroup>('none');

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const filteredSessions = useMemo(() => {
    if (!userProgress.sessions) return [];

    let filtered = [...userProgress.sessions];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(session => 
        session.categoryIds.some(catId => selectedCategories.includes(catId))
      );
    }

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.date);
        const sessionDateKey = getLocalDateString(sessionDate);
        
        if (dateRange.start && dateRange.end) {
          return sessionDateKey >= dateRange.start && sessionDateKey <= dateRange.end;
        }
        
        if (dateRange.start) {
          return sessionDateKey >= dateRange.start;
        }
        
        if (dateRange.end) {
          return sessionDateKey <= dateRange.end;
        }
        
        return true;
      });
    }

    return filtered;
  }, [userProgress.sessions, selectedCategories, dateRange]);

  const groupedSessions = useMemo(() => {
    if (groupBy === 'none') {
      return { none: filteredSessions };
    }

    const grouped: Record<string, PracticeSession[]> = {
      entertainment: [],
      places: [],
      brands: []
    };

    filteredSessions.forEach(session => {
      const sessionCategories = session.categoryIds.map(catId => 
        categories.find(c => c.id === catId)
      ).filter(Boolean);

      const groups = new Set(sessionCategories.map(cat => cat!.group));

      if (groups.has(groupBy)) {
        grouped[groupBy].push(session);
      }
    });

    return grouped;
  }, [filteredSessions, groupBy]);

  const toggleCategory = (categoryId: CategoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setDateRange({ start: '', end: '' });
  };

  const hasActiveFilters = selectedCategories.length > 0 || dateRange.start || dateRange.end;

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteSession = () => {
    if (!sessionToDelete) return;

    setUserProgress((prev) => {
      const updatedSessions = prev.sessions.filter(s => s.id !== sessionToDelete);
      const deletedSession = prev.sessions.find(s => s.id === sessionToDelete);

      if (!deletedSession) return prev;

      const newTotalSessions = Math.max(0, prev.totalSessions - 1);
      const newTotalQuestionsAnswered = Math.max(0, prev.totalQuestionsAnswered - deletedSession.questionsAsked);
      const newTotalCorrectAnswers = Math.max(0, prev.totalCorrectAnswers - deletedSession.questionsCorrect);

      return {
        ...prev,
        sessions: updatedSessions,
        totalSessions: newTotalSessions,
        totalQuestionsAnswered: newTotalQuestionsAnswered,
        totalCorrectAnswers: newTotalCorrectAnswers,
      };
    });

    if (selectedSession?.id === sessionToDelete) {
      setSelectedSession(null);
    }

    setShowDeleteDialog(false);
    setSessionToDelete(null);
    toast.success('Session deleted successfully');
  };

  const handleClearAllHistory = () => {
    setShowClearAllDialog(true);
  };

  const confirmClearAllHistory = () => {
    setUserProgress((prev) => ({
      ...prev,
      sessions: [],
      totalSessions: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      currentStreak: 0,
      lastPracticeDate: '',
    }));

    setSelectedSession(null);
    setShowClearAllDialog(false);
    clearFilters();
    toast.success('All session history cleared');
  };

  const hasCompletedToday = userProgress.sessions.some((session) => {
    try {
      const sessionDate = new Date(session.date);
      const sessionDateKey = getLocalDateString(sessionDate);
      const todayKey = getLocalDateString(new Date());
      return sessionDateKey === todayKey;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your memory training journey
          </p>
        </div>

        <Card className="mb-6 bg-card border-border">
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

        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Practice Calendar</CardTitle>
            <CardDescription>
              Visual overview of your practice sessions - tap any date to view details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userProgress.sessions && userProgress.sessions.length > 0 ? (
              <SessionCalendar 
                sessions={userProgress.sessions}
                onDateClick={(date, sessions) => {
                  if (sessions.length === 1) {
                    setSelectedSession(sessions[0]);
                  } else {
                    const dateKey = date.toISOString().split('T')[0];
                    setDateRange({ start: dateKey, end: dateKey });
                    setShowFilters(false);
                  }
                }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No sessions yet</p>
                <p className="text-sm text-muted-foreground">Complete your first practice session to see it appear on the calendar</p>
              </div>
            )}
          </CardContent>
        </Card>

        {userProgress.sessions && userProgress.sessions.length > 0 && (
          <Card className="mt-6">
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <CardTitle>Session History</CardTitle>
                    <CardDescription>
                      {filteredSessions.length === userProgress.sessions.length
                        ? 'Tap any session to view details'
                        : `Showing ${filteredSessions.length} of ${userProgress.sessions.length} sessions`
                      }
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={groupBy} onValueChange={(value) => setGroupBy(value as 'none' | CategoryGroup)}>
                      <SelectTrigger className="w-[160px] h-9">
                        <div className="flex items-center gap-2">
                          <StackSimple size={16} />
                          <SelectValue placeholder="Group by" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Grouping</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="places">Places</SelectItem>
                        <SelectItem value="brands">Brands</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllHistory}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash size={16} />
                      Clear All
                    </Button>
                <Popover open={showFilters} onOpenChange={setShowFilters}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={hasActiveFilters ? "default" : "outline"}
                      size="sm"
                      className="gap-2"
                    >
                      <Funnel size={16} weight={hasActiveFilters ? "fill" : "regular"} />
                      Filter
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                          {selectedCategories.length + (dateRange.start ? 1 : 0) + (dateRange.end ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Filter Sessions</h4>
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-auto p-1 text-xs"
                          >
                            Clear all
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Categories</Label>
                          <div className="max-h-48 overflow-y-auto space-y-2">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={`filter-${category.id}`}
                                  checked={selectedCategories.includes(category.id)}
                                  onCheckedChange={() => toggleCategory(category.id)}
                                />
                                <Label
                                  htmlFor={`filter-${category.id}`}
                                  className="text-sm font-normal cursor-pointer flex-1"
                                >
                                  {category.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t">
                          <Label className="text-sm font-medium">Date Range</Label>
                          <div className="space-y-2">
                            <div>
                              <Label htmlFor="date-start" className="text-xs text-muted-foreground">From</Label>
                              <Input
                                id="date-start"
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="date-end" className="text-xs text-muted-foreground">To</Label>
                              <Input
                                id="date-end"
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                  </div>
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((catId) => (
                    <Badge key={catId} variant="secondary" className="gap-1.5">
                      {getCategoryName(catId)}
                      <button
                        onClick={() => toggleCategory(catId)}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X size={12} weight="bold" />
                      </button>
                    </Badge>
                  ))}
                  {dateRange.start && (
                    <Badge variant="secondary" className="gap-1.5">
                      From: {new Date(dateRange.start).toLocaleDateString()}
                      <button
                        onClick={() => setDateRange(prev => ({ ...prev, start: '' }))}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X size={12} weight="bold" />
                      </button>
                    </Badge>
                  )}
                  {dateRange.end && (
                    <Badge variant="secondary" className="gap-1.5">
                      To: {new Date(dateRange.end).toLocaleDateString()}
                      <button
                        onClick={() => setDateRange(prev => ({ ...prev, end: '' }))}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X size={12} weight="bold" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sessions match your filters</p>
                  <Button
                    variant="link"
                    onClick={clearFilters}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                </div>
              ) : groupBy === 'none' ? (
                filteredSessions.slice(0, 10).map((session) => {
                  const sessionAccuracy = Math.round((session.questionsCorrect / session.questionsAsked) * 100);
                  return (
                    <div
                      key={session.id}
                      className="relative group"
                    >
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="w-full text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Card className="border-2 hover:border-primary/40 hover:bg-secondary/30">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(session.date)}
                                  </p>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <p className="text-sm text-muted-foreground">
                                    {session.questionsAsked} questions
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {session.categoryIds.map((catId) => (
                                    <Badge key={catId} variant="secondary" className="text-xs">
                                      {getCategoryName(catId)}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <CheckCircle size={16} weight="fill" className="text-success" />
                                    <span>{session.questionsCorrect} correct</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock size={16} weight="duotone" className="text-muted-foreground" />
                                    <span>{session.averageTime}s avg</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0 text-right">
                                <p className={`text-2xl font-bold ${
                                  sessionAccuracy >= 80 ? 'text-success' : 
                                  sessionAccuracy >= 60 ? 'text-accent' : 
                                  'text-muted-foreground'
                                }`}>
                                  {sessionAccuracy}%
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-destructive hover:text-destructive-foreground shadow-md"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="space-y-6">
                  {groupedSessions[groupBy] && groupedSessions[groupBy].length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 px-2">
                        <StackSimple size={20} className="text-primary" weight="duotone" />
                        <h3 className="text-lg font-semibold capitalize">{groupBy}</h3>
                        <Badge variant="secondary" className="ml-auto">
                          {groupedSessions[groupBy].length} {groupedSessions[groupBy].length === 1 ? 'session' : 'sessions'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {groupedSessions[groupBy].slice(0, 10).map((session) => {
                          const sessionAccuracy = Math.round((session.questionsCorrect / session.questionsAsked) * 100);
                          return (
                            <div
                              key={session.id}
                              className="relative group"
                            >
                              <button
                                onClick={() => setSelectedSession(session)}
                                className="w-full text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                              >
                                <Card className="border-2 hover:border-primary/40 hover:bg-secondary/30">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <p className="text-sm text-muted-foreground">
                                            {formatDate(session.date)}
                                          </p>
                                          <span className="text-xs text-muted-foreground">•</span>
                                          <p className="text-sm text-muted-foreground">
                                            {session.questionsAsked} questions
                                          </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                          {session.categoryIds.map((catId) => (
                                            <Badge key={catId} variant="secondary" className="text-xs">
                                              {getCategoryName(catId)}
                                            </Badge>
                                          ))}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                          <div className="flex items-center gap-1">
                                            <CheckCircle size={16} weight="fill" className="text-success" />
                                            <span>{session.questionsCorrect} correct</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Clock size={16} weight="duotone" className="text-muted-foreground" />
                                            <span>{session.averageTime}s avg</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex-shrink-0 text-right">
                                        <p className={`text-2xl font-bold ${
                                          sessionAccuracy >= 80 ? 'text-success' : 
                                          sessionAccuracy >= 60 ? 'text-accent' : 
                                          'text-muted-foreground'
                                        }`}>
                                          {sessionAccuracy}%
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session.id);
                                }}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-destructive hover:text-destructive-foreground shadow-md"
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No {groupBy} sessions found</p>
                      <Button
                        variant="link"
                        onClick={() => setGroupBy('none')}
                        className="mt-2"
                      >
                        Show all sessions
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {userProgress.totalSessions === 0 && (
          <Card className="bg-accent/10 border-accent/30">
            <CardHeader>
              <CardTitle className="text-lg">Get Started!</CardTitle>
              <CardDescription>
                Complete your first practice session to start tracking your progress.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      <Dialog open={selectedSession !== null} onOpenChange={(open) => {
        if (!open) {
          setSelectedSession(null);
          setQuestionFilter('all');
        }
      }}>
        <DialogContent className="max-w-lg h-[90vh] flex flex-col p-0">
          {selectedSession && (() => {
            const filteredQuestions = selectedSession.questions?.filter((q) => {
              if (questionFilter === 'correct') return q.wasCorrect;
              if (questionFilter === 'incorrect') return !q.wasCorrect;
              return true;
            }) || [];

            return (
              <>
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 flex-shrink-0 border-b">
                  <div className="flex-1">
                    <DialogTitle className="text-lg sm:text-xl">Session Details</DialogTitle>
                    <DialogDescription className="text-sm">
                      {formatDate(selectedSession.date)}
                    </DialogDescription>
                  </div>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Card>
                        <CardContent className="pt-4 pb-4 text-center px-2">
                          <p className="text-2xl font-bold text-success mb-1 break-words">
                            {Math.round((selectedSession.questionsCorrect / selectedSession.questionsAsked) * 100)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Accuracy</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-4 pb-4 text-center px-2">
                          <p className="text-2xl font-bold mb-1 break-words">{selectedSession.averageTime}s</p>
                          <p className="text-xs text-muted-foreground">Avg Time</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 p-2.5 bg-success/10 rounded-lg border border-success/20">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <CheckCircle size={18} weight="fill" className="text-success flex-shrink-0" />
                          <span className="font-medium text-sm truncate">Correct Answers</span>
                        </div>
                        <span className="text-base font-bold flex-shrink-0">{selectedSession.questionsCorrect}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 p-2.5 bg-destructive/10 rounded-lg border border-destructive/20">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <XCircle size={18} weight="fill" className="text-destructive flex-shrink-0" />
                          <span className="font-medium text-sm truncate">Incorrect</span>
                        </div>
                        <span className="text-base font-bold flex-shrink-0">
                          {selectedSession.questionsAsked - selectedSession.questionsCorrect}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 p-2.5 bg-accent/10 rounded-lg border border-accent/20">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Lightbulb size={18} weight="fill" className="text-accent flex-shrink-0" />
                          <span className="font-medium text-sm truncate">Hints Used</span>
                        </div>
                        <span className="text-base font-bold flex-shrink-0">{selectedSession.hintsUsed}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Categories Practiced</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSession.categoryIds.map((catId) => (
                          <Badge key={catId} variant="secondary" className="text-xs">
                            {getCategoryName(catId)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedSession.questions && selectedSession.questions.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <p className="text-xs font-medium text-muted-foreground">
                            Questions Asked ({filteredQuestions.length})
                          </p>
                        </div>
                        
                        <div className="flex gap-2 mb-3">
                          <Button
                            variant={questionFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setQuestionFilter('all')}
                            className="flex-1 text-xs h-8"
                          >
                            All ({selectedSession.questions.length})
                          </Button>
                          <Button
                            variant={questionFilter === 'correct' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setQuestionFilter('correct')}
                            className="flex-1 text-xs h-8"
                          >
                            <CheckCircle size={14} weight="fill" className="mr-1" />
                            Correct ({selectedSession.questions.filter(q => q.wasCorrect).length})
                          </Button>
                          <Button
                            variant={questionFilter === 'incorrect' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setQuestionFilter('incorrect')}
                            className="flex-1 text-xs h-8"
                          >
                            <XCircle size={14} weight="fill" className="mr-1" />
                            Failed ({selectedSession.questions.filter(q => !q.wasCorrect).length})
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {filteredQuestions.length > 0 ? (
                            filteredQuestions.map((q, index) => (
                              <Card key={index} className={`border ${q.wasCorrect ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                                <CardContent className="p-2.5">
                                  <div className="flex items-start gap-2">
                                    {q.wasCorrect ? (
                                      <CheckCircle size={16} weight="fill" className="text-success flex-shrink-0 mt-0.5" />
                                    ) : (
                                      <XCircle size={16} weight="fill" className="text-destructive flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium mb-1 break-words">{q.question}</p>
                                      <div className="text-xs">
                                        {q.answerType === 'multiple' && q.validAnswers ? (
                                          <div>
                                            <p className="text-muted-foreground mb-1">Valid answers:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {q.validAnswers.map((answer, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs break-all">
                                                  {answer}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-primary font-medium break-words">{q.answer}</p>
                                        )}
                                      </div>
                                      {q.hintsUsed > 0 && (
                                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                          <Lightbulb size={12} weight="fill" className="text-accent flex-shrink-0" />
                                          <span>{q.hintsUsed} hint{q.hintsUsed > 1 ? 's' : ''} used</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-sm text-muted-foreground">
                                No {questionFilter} questions in this session
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this practice session from your history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSession} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All History?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all practice sessions, stats, and progress data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAllHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear All History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
