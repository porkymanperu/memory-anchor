import { useState } from 'react';
import { UserProgress, PracticeSession } from '@/lib/types';
import { Button } from '@/components/ui/
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
  DialogT
  Dialog, 
  AlertDialogActi
  AlertDialogContent,
  AlertDialogFoo
  AlertDialogTit
import { 
  Clock, 
  Lightb
  XCircle, 
  WarningCircle
import { formatDate 
  AlertDialogContent,
  userProgress: UserProgr
}
export function Sess
  const [sessionToD

import { 

  Clock, 
      tota
      session

  XCircle, 
  };
  WarningCircle
      ...prev,
    }));
    toast.success('All session 

  const formatDuration = (ms: n
    const seconds = Math.floo
      return `${minutes}m ${seconds}s`;
}

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
    }
      .map(id => categories.find(c => c.id === id)?.name)
      .join(', ') || 'No categories';

    switch (difficulty) {
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg

  if (userProgress.sessionHist
      <div cla
          <div className="mb-8">
            <p className="text-muted-foreground">
            </p>

        

              <p className="text-lg f
                Complete prac
            </CardContent>
  };


    <div className="pb-20 min-
      ...prev,
            <h1 classNam
    }));

            <Button
              size="sm"
    

            </Button>
        </div>
        <div className="space-y-4">
            const accu
      return `${minutes}m ${seconds}s`;
     
                onClick={
    

                        <CalendarBlank size={16} className="text-mu
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
                      </div>
    }
                    </
      .map(id => categories.find(c => c.id === id)?.name)
                    >
      .join(', ') || 'No categories';


                        <Target size={16} className="t
    switch (difficulty) {
                    </div>
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        <span className="text-2xl font-bold">{sessi
                      <p className="text-xs text-muted-foreground"
     
    

                    </div>
            
            );
        </div>
          <div className="mb-8">
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto"
            <p className="text-muted-foreground">
                <DialogTitle>Session Details</Dialog
            </p>
              </

                  <Card>
                      <div className="text-3xl font-bold text
                      </div>
                    </CardContent>
                  <C
                      <div className="flex items-center justify-center ga
                        <div className="text-3xl font-bold"
                      <p className="text-sm text-muted-foreground">
                  
            </CardContent>
                 
              
            
      
   

  return (
    <div className="pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Session History</h1>
            <p className="text-muted-foreground">
              {userProgress.sessionHistory.length} session{userProgress.sessionHistory.length !== 1 ? 's' : ''}
            </p>
          </div>
          {userProgress.sessionHistory.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearAllDialog(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash size={16} className="mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {userProgress.sessionHistory.map((session) => {
            const accuracy = Math.round((session.questionsCorrect / session.questionsAsked) * 100);
            
            return (
              <Card 
                key={session.id}
                className="hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedSession(session)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarBlank size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formatDate(session.date)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {getCategoryNames(session.categoryIds)}
                      </p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={getDifficultyColor(session.difficulty)}
                    >
                      {session.difficulty}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target size={16} className="text-primary" />
                        <span className="text-2xl font-bold text-primary">{accuracy}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle size={16} className="text-success" />
                        <span className="text-2xl font-bold">{session.questionsCorrect}/{session.questionsAsked}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Correct</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock size={16} className="text-muted-foreground" />
                        <span className="text-2xl font-bold">{formatDuration(session.durationMs)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle>Session Details</DialogTitle>
                <DialogDescription>
                  {formatDate(selectedSession.date)} • {formatDuration(selectedSession.durationMs)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {Math.round((selectedSession.questionsCorrect / selectedSession.questionsAsked) * 100)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Lightbulb size={20} className="text-accent" />
                        <div className="text-3xl font-bold">{selectedSession.hintsUsed}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">Hints Used</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Questions</h4>
                  <div className="space-y-2">
                    {selectedSession.questions && Array.isArray(selectedSession.questions) && selectedSession.questions.length > 0 ? (
                      selectedSession.questions.map((q, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-lg border-2 ${
                            q.wasCorrect 
                              ? 'bg-success/5 border-success/20' 
                              : 'bg-destructive/5 border-destructive/20'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {q.wasCorrect ? (
                              <CheckCircle size={20} weight="fill" className="text-success flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle size={20} weight="fill" className="text-destructive flex-shrink-0 mt-0.5" />
                            )}

                              <p className="text-sm font-medium mb-1">{q.question}</p>
                              <p className="text-sm text-muted-foreground">
                                Answer: <span className="font-semibold">{q.answer}</span>

                              {q.hintsUsed > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {q.hintsUsed} hint{q.hintsUsed !== 1 ? 's' : ''} used

                              )}
                            </div>
                          </div>
                        </div>
                      ))

                      <p className="text-sm text-muted-foreground text-center py-4">
                        No question details available for this session
                      </p>

                  </div>


                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Session Info</h4>

                    <p><span className="text-muted-foreground">Categories:</span> {getCategoryNames(selectedSession.categoryIds)}</p>
                    <p><span className="text-muted-foreground">Difficulty:</span> <span className="capitalize">{selectedSession.difficulty}</span></p>
                    <p><span className="text-muted-foreground">Date:</span> {new Date(selectedSession.date).toLocaleString()}</p>

                </div>


              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="destructive"
                  onClick={() => setSessionToDelete(selectedSession.id)}
                  className="w-full sm:w-auto"
                >
                  <Trash size={16} className="mr-2" />
                  Delete Session

                <Button

                  onClick={() => setSelectedSession(null)}

                >
                  Close
                </Button>
              </DialogFooter>
            </>

        </DialogContent>


      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>

            <AlertDialogTitle>Delete this session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the session from your history and adjust your stats accordingly. This action cannot be undone.

          </AlertDialogHeader>

            <AlertDialogCancel>Cancel</AlertDialogCancel>

              onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >

            </AlertDialogAction>

        </AlertDialogContent>


      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <WarningCircle size={24} className="text-destructive" weight="fill" />

              <AlertDialogTitle>Clear all history?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete all {userProgress.sessionHistory.length} session{userProgress.sessionHistory.length !== 1 ? 's' : ''} from your history. Your overall stats will not be affected. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction

              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"

              Clear All

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

  );
}
