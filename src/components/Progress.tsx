import { useState } from 'react';
import { UserProgress, PracticeSession } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Fire, Trophy, Target, TrendUp, Clock, CheckCircle, XCircle, Lightbulb } from '@phosphor-icons/react';
import { formatDate } from '@/lib/helpers';
import { categories } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

interface ProgressProps {
  userProgress: UserProgress;
}

export function Progress({ userProgress }: ProgressProps) {
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);
  const accuracy = userProgress.totalQuestionsAnswered > 0
    ? Math.round((userProgress.totalCorrectAnswers / userProgress.totalQuestionsAnswered) * 100)
    : 0;

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <div className="pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your memory training journey
          </p>
        </div>

        <div className="grid gap-4 mb-6">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Fire size={32} weight="fill" className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-4xl font-bold text-primary mb-1">
                    {userProgress.currentStreak}
                  </p>
                  <p className="text-sm text-muted-foreground">days in a row</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy size={28} weight="duotone" className="text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">{userProgress.longestStreak}</p>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Target size={28} weight="duotone" className="text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">{userProgress.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp size={24} weight="duotone" className="text-primary" />
              Overall Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Questions Answered</span>
              <span className="text-2xl font-bold">{userProgress.totalQuestionsAnswered}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Correct Answers</span>
              <span className="text-2xl font-bold text-primary">{userProgress.totalCorrectAnswers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Overall Accuracy</span>
              <span className="text-2xl font-bold text-accent">{accuracy}%</span>
            </div>
          </CardContent>
        </Card>

        {userProgress.sessions && userProgress.sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>
                Tap any session to view details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userProgress.sessions.slice(0, 10).map((session) => {
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
              })}
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
