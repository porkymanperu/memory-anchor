import { GoalTemplate } from './types';

export const goalTemplates: GoalTemplate[] = [
  {
    id: 'consistency-easy-7days',
    name: 'Racha de 7 Días - Modo Fácil',
    description: 'Completa sesiones en modo Fácil durante 7 días consecutivos',
    category: 'consistency',
    configurableFields: {
      numberOfDays: true,
    },
    defaultValues: {
      difficultyLevel: 'easy',
      numberOfDays: 7,
    },
    validationRules: {
      minDays: 3,
      maxDays: 30,
    },
  },
  {
    id: 'consistency-medium-14days',
    name: 'Racha de 14 Días - Modo Medio',
    description: 'Completa sesiones en modo Medio durante 14 días consecutivos',
    category: 'consistency',
    configurableFields: {
      numberOfDays: true,
    },
    defaultValues: {
      difficultyLevel: 'medium',
      numberOfDays: 14,
    },
    validationRules: {
      minDays: 7,
      maxDays: 60,
    },
  },
  {
    id: 'consistency-hard-7days',
    name: 'Racha de 7 Días - Modo Difícil',
    description: 'Completa sesiones en modo Difícil durante 7 días consecutivos',
    category: 'consistency',
    configurableFields: {
      numberOfDays: true,
    },
    defaultValues: {
      difficultyLevel: 'hard',
      numberOfDays: 7,
    },
    validationRules: {
      minDays: 3,
      maxDays: 30,
    },
  },
  {
    id: 'consistency-weekly-sessions',
    name: 'Práctica Semanal',
    description: 'Completa al menos 5 sesiones esta semana',
    category: 'consistency',
    configurableFields: {
      numberOfDays: true,
    },
    defaultValues: {
      numberOfDays: 5,
    },
    validationRules: {
      minDays: 3,
      maxDays: 7,
    },
  },
  {
    id: 'accuracy-easy-80',
    name: 'Precisión del 80% - Modo Fácil',
    description: 'Alcanza 80% de precisión en una sesión en modo Fácil',
    category: 'accuracy',
    configurableFields: {
      accuracyPercentage: true,
    },
    defaultValues: {
      difficultyLevel: 'easy',
      accuracyPercentage: 80,
    },
    validationRules: {
      minAccuracy: 50,
      maxAccuracy: 100,
    },
  },
  {
    id: 'accuracy-medium-75',
    name: 'Precisión del 75% - Modo Medio',
    description: 'Alcanza 75% de precisión en una sesión en modo Medio',
    category: 'accuracy',
    configurableFields: {
      accuracyPercentage: true,
    },
    defaultValues: {
      difficultyLevel: 'medium',
      accuracyPercentage: 75,
    },
    validationRules: {
      minAccuracy: 50,
      maxAccuracy: 100,
    },
  },
  {
    id: 'accuracy-hard-70',
    name: 'Precisión del 70% - Modo Difícil',
    description: 'Alcanza 70% de precisión en una sesión en modo Difícil',
    category: 'accuracy',
    configurableFields: {
      accuracyPercentage: true,
    },
    defaultValues: {
      difficultyLevel: 'hard',
      accuracyPercentage: 70,
    },
    validationRules: {
      minAccuracy: 50,
      maxAccuracy: 100,
    },
  },
  {
    id: 'accuracy-category',
    name: 'Precisión por Categoría',
    description: 'Alcanza una precisión específica en una categoría',
    category: 'accuracy',
    configurableFields: {
      categoryId: true,
      accuracyPercentage: true,
    },
    defaultValues: {
      accuracyPercentage: 85,
    },
    validationRules: {
      minAccuracy: 50,
      maxAccuracy: 100,
    },
  },
  {
    id: 'accuracy-perfect-session',
    name: 'Sesión Perfecta',
    description: 'Completa una sesión con 100% de precisión',
    category: 'accuracy',
    configurableFields: {
      difficultyLevel: true,
    },
    defaultValues: {
      difficultyLevel: 'easy',
      accuracyPercentage: 100,
    },
    validationRules: {
      minAccuracy: 100,
      maxAccuracy: 100,
    },
  },
  {
    id: 'speed-session-under-5min',
    name: 'Sesión Rápida - Menos de 5 Minutos',
    description: 'Completa una sesión en menos de 5 minutos',
    category: 'speed',
    configurableFields: {
      sessionDuration: true,
    },
    defaultValues: {
      sessionDuration: 5,
    },
    validationRules: {
      minDuration: 1,
      maxDuration: 15,
    },
  },
  {
    id: 'speed-session-under-8min',
    name: 'Sesión Rápida - Menos de 8 Minutos',
    description: 'Completa una sesión en menos de 8 minutos',
    category: 'speed',
    configurableFields: {
      sessionDuration: true,
    },
    defaultValues: {
      sessionDuration: 8,
    },
    validationRules: {
      minDuration: 1,
      maxDuration: 20,
    },
  },
  {
    id: 'speed-improvement',
    name: 'Mejora de Velocidad',
    description: 'Reduce tu tiempo promedio de sesión en un porcentaje',
    category: 'speed',
    configurableFields: {
      improvementPercentage: true,
    },
    defaultValues: {
      improvementPercentage: 20,
    },
    validationRules: {
      minImprovement: 10,
      maxImprovement: 50,
    },
  },
];

export const goalCategoryNames: Record<string, string> = {
  consistency: 'Consistencia Diaria',
  accuracy: 'Precisión de Recuerdo',
  speed: 'Velocidad de Recuerdo',
};

export const goalCategoryDescriptions: Record<string, string> = {
  consistency: 'Mide qué tan consistentemente practicas',
  accuracy: 'Mide la calidad de tu memoria según tu desempeño',
  speed: 'Mide qué tan rápido recuerdas las respuestas',
};
