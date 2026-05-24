import { useState, useMemo } from 'react';
import { UserProgress, PracticeSession, CategoryId } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, CheckCircle, XCircle, Lightbulb, Funnel, X } from '@phosphor-icons/react';
import { formatDate } from '@/lib/helpers';
import { categories } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SessionCalendar } from '@/components/SessionCalendar';

interface ProgressProps {
  userProgress: UserProgress;
}

export function Progress({ userProgress }: ProgressProps) {
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

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
        const sessionDateKey = new Date(session.date).toISOString().split('T')[0];
        
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

  return (
    <div className="pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your memory training journey
          </p>
        </div>

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
              ) : (
                filteredSessions.slice(0, 10).map((session) => {
                  const sessionAccuracy = Math.round((session.questionsCorrect / session.questionsAsked) * 100);
                  return (
                    <button
                      key={session.id}
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
                  );
                })
              )}
            </CardContent>
          </Card>
        )}

        {userProgress.lastPracticeDate && (
          <Card className="bg-secondary/30 border-secondary mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Last Practice</CardTitle>
              <CardDescription>
                {formatDate(userProgress.lastPracticeDate)}
              </CardDescription>
            </CardHeader>
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

      <Dialog open={selectedSession !== null} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="max-w-lg">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle>Session Details</DialogTitle>
                <DialogDescription>
                  {formatDate(selectedSession.date)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-success mb-1">
                        {Math.round((selectedSession.questionsCorrect / selectedSession.questionsAsked) * 100)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold mb-1">{selectedSession.averageTime}s</p>
                      <p className="text-sm text-muted-foreground">Avg Time</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} weight="fill" className="text-success" />
                      <span className="font-medium">Correct Answers</span>
                    </div>
                    <span className="text-lg font-bold">{selectedSession.questionsCorrect}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="flex items-center gap-2">
                      <XCircle size={20} weight="fill" className="text-destructive" />
                      <span className="font-medium">Incorrect</span>
                    </div>
                    <span className="text-lg font-bold">
                      {selectedSession.questionsAsked - selectedSession.questionsCorrect}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2">
                      <Lightbulb size={20} weight="fill" className="text-accent" />
                      <span className="font-medium">Hints Used</span>
                    </div>
                    <span className="text-lg font-bold">{selectedSession.hintsUsed}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Categories Practiced</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.categoryIds.map((catId) => (
                      <Badge key={catId} variant="secondary">
                        {getCategoryName(catId)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Questions</p>
                  <p className="text-2xl font-bold">{selectedSession.questionsAsked}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
