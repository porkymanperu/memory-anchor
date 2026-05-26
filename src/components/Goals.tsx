import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { UserGoal, UserProgress, GoalCategory } from '@/lib/types';
import { goalTemplates, goalCategoryNames, goalCategoryDescriptions } from '@/lib/goal-templates';
import { updateGoalStatuses } from '@/lib/goal-validation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Target, TrendUp, Lightning, Plus, Check, Clock, X } from '@phosphor-icons/react';
import { GoalTemplateSelector } from './GoalTemplateSelector';
import { GoalConfiguration } from './GoalConfiguration';
import { toast } from 'sonner';

interface GoalsProps {
  userProgress: UserProgress;
}

export function Goals({ userProgress }: GoalsProps) {
  const [userGoals, setUserGoals] = useKV<UserGoal[]>('user-goals', []);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (userGoals && userGoals.length > 0) {
      const updatedGoals = updateGoalStatuses(userGoals, userProgress);
      const hasChanges = updatedGoals.some((goal, index) => {
        const original = userGoals[index];
        return (
          goal.status !== original.status ||
          goal.progress.percentage !== original.progress.percentage
        );
      });

      if (hasChanges) {
        setUserGoals(updatedGoals);
      }
    }
  }, [userProgress.sessions.length]);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
    setShowConfiguration(true);
  };

  const handleSaveGoal = (goal: UserGoal) => {
    setUserGoals((current) => [...(current || []), goal]);
    setShowConfiguration(false);
    setSelectedTemplate(null);
    toast.success('Meta creada exitosamente');
  };

  const handleDeleteGoal = (goalId: string) => {
    setUserGoals((current) => (current || []).filter((g) => g.id !== goalId));
    setGoalToDelete(null);
    toast.success('Meta eliminada');
  };

  const confirmDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId);
  };

  const activeGoals = (userGoals || []).filter(
    (g) => g.status === 'in-progress' || g.status === 'not-started'
  );
  const achievedGoals = (userGoals || []).filter((g) => g.status === 'achieved');
  const missedGoals = (userGoals || []).filter((g) => g.status === 'missed');

  const getCategoryIcon = (category: GoalCategory) => {
    switch (category) {
      case 'consistency':
        return <Target size={20} weight="duotone" />;
      case 'accuracy':
        return <TrendUp size={20} weight="duotone" />;
      case 'speed':
        return <Lightning size={20} weight="duotone" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'text-success';
      case 'in-progress':
        return 'text-primary';
      case 'missed':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'Completada';
      case 'in-progress':
        return 'En progreso';
      case 'missed':
        return 'No alcanzada';
      default:
        return 'No iniciada';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Metas</h1>
            <p className="text-muted-foreground mt-1">
              Establece y alcanza tus objetivos de memoria
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setShowTemplateSelector(true)}
            className="rounded-full"
          >
            <Plus size={20} weight="bold" />
          </Button>
        </div>

        {activeGoals.length === 0 && achievedGoals.length === 0 && (
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Target size={32} weight="duotone" className="text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No tienes metas aún</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera meta para comenzar a medir tu progreso
            </p>
            <Button onClick={() => setShowTemplateSelector(true)}>
              <Plus size={20} weight="bold" className="mr-2" />
              Crear Meta
            </Button>
          </Card>
        )}

        {activeGoals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock size={24} weight="duotone" className="text-primary" />
              Metas Activas
            </h2>
            <div className="grid gap-4">
              {activeGoals.map((goal) => {
                const template = goalTemplates.find((t) => t.id === goal.templateId);
                if (!template) return null;

                return (
                  <Card key={goal.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getCategoryIcon(template.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDeleteGoal(goal.id)}
                        className="flex-shrink-0"
                      >
                        <X size={16} />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-semibold text-foreground">
                          {goal.progress.currentValue} / {goal.progress.targetValue}
                        </span>
                      </div>
                      <Progress value={goal.progress.percentage} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className={getStatusColor(goal.status)}>
                          {getStatusText(goal.status)}
                        </span>
                        <span className="text-muted-foreground">
                          {goal.progress.percentage}% completado
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {achievedGoals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Check size={24} weight="duotone" className="text-success" />
              Metas Completadas
            </h2>
            <div className="grid gap-4">
              {achievedGoals.map((goal) => {
                const template = goalTemplates.find((t) => t.id === goal.templateId);
                if (!template) return null;

                return (
                  <Card key={goal.id} className="p-4 border-success/20 bg-success/5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Check size={20} weight="duotone" className="text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDeleteGoal(goal.id)}
                        className="flex-shrink-0"
                      >
                        <X size={16} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Check size={16} weight="bold" className="text-success" />
                      <span className="text-success font-medium">Meta alcanzada</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selecciona una Meta</DialogTitle>
          </DialogHeader>
          <GoalTemplateSelector onSelect={handleSelectTemplate} />
        </DialogContent>
      </Dialog>

      {selectedTemplate && (
        <Dialog open={showConfiguration} onOpenChange={setShowConfiguration}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configura tu Meta</DialogTitle>
            </DialogHeader>
            <GoalConfiguration
              templateId={selectedTemplate}
              onSave={handleSaveGoal}
              onCancel={() => {
                setShowConfiguration(false);
                setSelectedTemplate(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!goalToDelete} onOpenChange={(open) => !open && setGoalToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar meta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La meta será eliminada permanentemente de tu lista.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGoalToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => goalToDelete && handleDeleteGoal(goalToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
