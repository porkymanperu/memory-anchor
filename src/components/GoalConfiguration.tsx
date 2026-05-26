import { useState } from 'react';
import { goalTemplates } from '@/lib/goal-templates';
import { UserGoal, CategoryId } from '@/lib/types';
import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarBlank } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface GoalConfigurationProps {
  templateId: string;
  onSave: (goal: UserGoal) => void;
  onCancel: () => void;
}

export function GoalConfiguration({ templateId, onSave, onCancel }: GoalConfigurationProps) {
  const template = goalTemplates.find((t) => t.id === templateId);

  if (!template) {
    return <div>Template not found</div>;
  }

  const [customName, setCustomName] = useState(template.name);
  const [scheduledStartDate, setScheduledStartDate] = useState<Date>();
  const [configuration, setConfiguration] = useState({
    difficultyLevel: template.defaultValues.difficultyLevel,
    categoryId: template.defaultValues.categoryId,
    numberOfDays: template.defaultValues.numberOfDays,
    accuracyPercentage: template.defaultValues.accuracyPercentage,
    sessionDuration: template.defaultValues.sessionDuration,
    improvementPercentage: template.defaultValues.improvementPercentage,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (template.configurableFields.numberOfDays && configuration.numberOfDays !== undefined) {
      if (
        template.validationRules.minDays &&
        configuration.numberOfDays < template.validationRules.minDays
      ) {
        newErrors.numberOfDays = `Mínimo ${template.validationRules.minDays} días`;
      }
      if (
        template.validationRules.maxDays &&
        configuration.numberOfDays > template.validationRules.maxDays
      ) {
        newErrors.numberOfDays = `Máximo ${template.validationRules.maxDays} días`;
      }
    }

    if (
      template.configurableFields.accuracyPercentage &&
      configuration.accuracyPercentage !== undefined
    ) {
      if (
        template.validationRules.minAccuracy &&
        configuration.accuracyPercentage < template.validationRules.minAccuracy
      ) {
        newErrors.accuracyPercentage = `Mínimo ${template.validationRules.minAccuracy}%`;
      }
      if (
        template.validationRules.maxAccuracy &&
        configuration.accuracyPercentage > template.validationRules.maxAccuracy
      ) {
        newErrors.accuracyPercentage = `Máximo ${template.validationRules.maxAccuracy}%`;
      }
    }

    if (
      template.configurableFields.sessionDuration &&
      configuration.sessionDuration !== undefined
    ) {
      if (
        template.validationRules.minDuration &&
        configuration.sessionDuration < template.validationRules.minDuration
      ) {
        newErrors.sessionDuration = `Mínimo ${template.validationRules.minDuration} minutos`;
      }
      if (
        template.validationRules.maxDuration &&
        configuration.sessionDuration > template.validationRules.maxDuration
      ) {
        newErrors.sessionDuration = `Máximo ${template.validationRules.maxDuration} minutos`;
      }
    }

    if (
      template.configurableFields.improvementPercentage &&
      configuration.improvementPercentage !== undefined
    ) {
      if (
        template.validationRules.minImprovement &&
        configuration.improvementPercentage < template.validationRules.minImprovement
      ) {
        newErrors.improvementPercentage = `Mínimo ${template.validationRules.minImprovement}%`;
      }
      if (
        template.validationRules.maxImprovement &&
        configuration.improvementPercentage > template.validationRules.maxImprovement
      ) {
        newErrors.improvementPercentage = `Máximo ${template.validationRules.maxImprovement}%`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    let targetValue = 100;
    if (configuration.numberOfDays) targetValue = configuration.numberOfDays;
    else if (configuration.accuracyPercentage) targetValue = configuration.accuracyPercentage;
    else if (configuration.sessionDuration) targetValue = configuration.sessionDuration;
    else if (configuration.improvementPercentage) targetValue = configuration.improvementPercentage;

    const goal: UserGoal = {
      id: `goal-${Date.now()}`,
      templateId: template.id,
      customName: customName !== template.name ? customName : undefined,
      startDate: new Date().toISOString(),
      scheduledStartDate: scheduledStartDate?.toISOString(),
      status: 'not-started',
      configuration: {
        ...configuration,
      },
      progress: {
        currentValue: 0,
        targetValue,
        percentage: 0,
      },
    };

    onSave(goal);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-1">{template.name}</h4>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal-name">Nombre de la Meta</Label>
        <Input
          id="goal-name"
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder={template.name}
        />
        <p className="text-xs text-muted-foreground">
          Personaliza el nombre de tu meta o deja el predeterminado
        </p>
      </div>

      <div className="space-y-2">
        <Label>Programar Inicio (Opcional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarBlank size={16} className="mr-2" />
              {scheduledStartDate ? (
                format(scheduledStartDate, 'PPP', { locale: es })
              ) : (
                <span className="text-muted-foreground">Comenzar hoy</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <Calendar
              mode="single"
              selected={scheduledStartDate}
              onSelect={setScheduledStartDate}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground">
          Selecciona cuándo quieres que comience esta meta. Si no seleccionas una fecha, comenzará hoy.
        </p>
      </div>

      {template.configurableFields.difficultyLevel && (
        <div className="space-y-2">
          <Label htmlFor="difficulty">Nivel de Dificultad</Label>
          <Select
            value={configuration.difficultyLevel || 'easy'}
            onValueChange={(value) =>
              setConfiguration({ ...configuration, difficultyLevel: value as any })
            }
          >
            <SelectTrigger id="difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Fácil</SelectItem>
              <SelectItem value="medium">Medio</SelectItem>
              <SelectItem value="hard">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {template.configurableFields.categoryId && (
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={configuration.categoryId || ''}
            onValueChange={(value) =>
              setConfiguration({ ...configuration, categoryId: value as CategoryId })
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {template.configurableFields.numberOfDays && (
        <div className="space-y-2">
          <Label htmlFor="days">Número de Días</Label>
          <Input
            id="days"
            type="number"
            value={configuration.numberOfDays || ''}
            onChange={(e) =>
              setConfiguration({ ...configuration, numberOfDays: parseInt(e.target.value) || 0 })
            }
            min={template.validationRules.minDays}
            max={template.validationRules.maxDays}
          />
          {errors.numberOfDays && (
            <p className="text-sm text-destructive">{errors.numberOfDays}</p>
          )}
        </div>
      )}

      {template.configurableFields.accuracyPercentage && (
        <div className="space-y-2">
          <Label htmlFor="accuracy">Porcentaje de Precisión (%)</Label>
          <Input
            id="accuracy"
            type="number"
            value={configuration.accuracyPercentage || ''}
            onChange={(e) =>
              setConfiguration({
                ...configuration,
                accuracyPercentage: parseInt(e.target.value) || 0,
              })
            }
            min={template.validationRules.minAccuracy}
            max={template.validationRules.maxAccuracy}
          />
          {errors.accuracyPercentage && (
            <p className="text-sm text-destructive">{errors.accuracyPercentage}</p>
          )}
        </div>
      )}

      {template.configurableFields.sessionDuration && (
        <div className="space-y-2">
          <Label htmlFor="duration">Duración de Sesión (minutos)</Label>
          <Input
            id="duration"
            type="number"
            value={configuration.sessionDuration || ''}
            onChange={(e) =>
              setConfiguration({
                ...configuration,
                sessionDuration: parseInt(e.target.value) || 0,
              })
            }
            min={template.validationRules.minDuration}
            max={template.validationRules.maxDuration}
          />
          {errors.sessionDuration && (
            <p className="text-sm text-destructive">{errors.sessionDuration}</p>
          )}
        </div>
      )}

      {template.configurableFields.improvementPercentage && (
        <div className="space-y-2">
          <Label htmlFor="improvement">Porcentaje de Mejora (%)</Label>
          <Input
            id="improvement"
            type="number"
            value={configuration.improvementPercentage || ''}
            onChange={(e) =>
              setConfiguration({
                ...configuration,
                improvementPercentage: parseInt(e.target.value) || 0,
              })
            }
            min={template.validationRules.minImprovement}
            max={template.validationRules.maxImprovement}
          />
          {errors.improvementPercentage && (
            <p className="text-sm text-destructive">{errors.improvementPercentage}</p>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} className="flex-1">
          Crear Meta
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
