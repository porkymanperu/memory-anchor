import { UserProgress } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fire, Trophy, Target, TrendUp } from '@phosphor-icons/react';
import { formatDate } from '@/lib/helpers';

interface ProgressProps {
  userProgress: UserProgress;
}

export function Progress({ userProgress }: ProgressProps) {
  const accuracy = userProgress.totalQuestionsAnswered > 0
    ? Math.round((userProgress.totalCorrectAnswers / userProgress.totalQuestionsAnswered) * 100)
    : 0;

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

        {userProgress.lastPracticeDate && (
          <Card className="bg-secondary/30 border-secondary">
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
    </div>
  );
}
