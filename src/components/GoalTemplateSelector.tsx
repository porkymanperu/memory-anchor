import { goalTemplates, goalCategoryNames, goalCategoryDescriptions } from '@/lib/goal-templates';
import { GoalCategory } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, TrendUp, Lightning } from '@phosphor-icons/react';

interface GoalTemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

export function GoalTemplateSelector({ onSelect }: GoalTemplateSelectorProps) {
  const categories: GoalCategory[] = ['consistency', 'accuracy', 'speed'];

  const getCategoryIcon = (category: GoalCategory) => {
    switch (category) {
      case 'consistency':
        return <Target size={24} weight="duotone" className="text-primary" />;
      case 'accuracy':
        return <TrendUp size={24} weight="duotone" className="text-primary" />;
      case 'speed':
        return <Lightning size={24} weight="duotone" className="text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const templates = goalTemplates.filter((t) => t.category === category);
        if (templates.length === 0) return null;

        return (
          <div key={category}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                {getCategoryIcon(category)}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{goalCategoryNames[category]}</h3>
                <p className="text-sm text-muted-foreground">{goalCategoryDescriptions[category]}</p>
              </div>
            </div>

            <div className="grid gap-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="p-4 hover:border-primary cursor-pointer transition-colors"
                  onClick={() => onSelect(template.id)}
                >
                  <h4 className="font-medium text-foreground mb-1">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
