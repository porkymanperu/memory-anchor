import { GoalTemplate } from './types';

export const goalTemplates: GoalTemplate[] = [
  {
    id: 'consistency-easy-7days',
    name: 'Racha de Días Consecutivos',
    description: 'Completa sesiones durante días consecutivos en el nivel de dificultad que prefieras',
    category: 'consistency',
    configurableFields: {
      difficultyLevel: true,
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
    name: 'Racha Extendida',
    description: 'Completa sesiones durante más días consecutivos con el nivel de dificultad que elijas',
    category: 'consistency',
    configurableFields: {
      difficultyLevel: true,
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
    name: 'Racha Desafiante',
    description: 'Completa sesiones durante días consecutivos con tu nivel de dificultad preferido',
    category: 'consistency',
    configurableFields: {
      difficultyLevel: true,
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
    description: 'Completa varias sesiones esta semana con cualquier nivel de dificultad',
    category: 'consistency',
    configurableFields: {
      difficultyLevel: true,
      numberOfDays: true,
    },
    defaultValues: {
      difficultyLevel: 'easy',
      numberOfDays: 5,
    },
    validationRules: {
      minDays: 3,
      maxDays: 7,
    },
  },
  {
    id: 'accuracy-easy-80',
    name: 'Alta Precisión',
    description: 'Alcanza un porcentaje de precisión en una sesión con tu nivel de dificultad',
    category: 'accuracy',
    configurableFields: {
      difficultyLevel: true,
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
    name: 'Precisión Consistente',
    description: 'Alcanza un porcentaje de precisión en tu nivel de dificultad preferido',
    category: 'accuracy',
    configurableFields: {
      difficultyLevel: true,
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
    name: 'Precisión Desafiante',
    description: 'Alcanza un buen porcentaje de precisión con el nivel de dificultad que elijas',
    category: 'accuracy',
    configurableFields: {
      difficultyLevel: true,
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
    description: 'Alcanza una precisión específica en una categoría con cualquier nivel de dificultad',
    category: 'accuracy',
    configurableFields: {
      difficultyLevel: true,
      categoryId: true,
      accuracyPercentage: true,
    },
    defaultValues: {
      difficultyLevel: 'easy',
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
    description: 'Completa una sesión con 100% de precisión en tu nivel de dificultad',
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
    name: 'Sesión Rápida Corta',
    description: 'Completa una sesión en menos de cierto tiempo con cualquier nivel de dificultad',
    category: 'speed',
    configurableFields: {
      difficultyLevel: true,
      sessionDuration: true,
    },
    defaultValues: {
      difficultyLevel: 'easy',
      sessionDuration: 5,
    },
    validationRules: {
      minDuration: 1,
      maxDuration: 15,
    },
  },
  {
    id: 'speed-session-under-8min',
    name: 'Sesión Rápida',
    description: 'Completa una sesión en un tiempo específico con tu nivel de dificultad preferido',
    category: 'speed',
    configurableFields: {
      difficultyLevel: true,
      sessionDuration: true,
    },
    defaultValues: {
      difficultyLevel: 'easy',
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
    description: 'Reduce tu tiempo promedio de sesión en un porcentaje con cualquier nivel de dificultad',
    category: 'speed',
    configurableFields: {
      difficultyLevel: true,
      improvementPercentage: true,
    },
    defaultValues: {
      difficultyLevel: 'easy',
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
