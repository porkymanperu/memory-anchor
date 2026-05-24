import { useState } from 'react';
import { CategoryId, MemoryItem, UserProgress } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagnifyingGlass, Star, X, ArrowLeft } from '@phosphor-icons/react';
import { categories } from '@/lib/data';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LibraryProps {
  allItems: MemoryItem[];
  userProgress: UserProgress;
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export function Library({ allItems, userProgress }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<MemoryItem | null>(null);

  const filteredItems = allItems.filter(item => {
    const matchesSearch = 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || 'oklch(0.5 0.1 200)';
  };

  const itemsByCategory = categories.map(cat => ({
    ...cat,
    count: allItems.filter(item => item.categoryId === cat.id).length
  }));

  if (selectedItem) {
    return (
      <div className="pb-20 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedItem(null)}
            className="mb-4 -ml-2"
          >
            <ArrowLeft size={20} />
            Back to Library
          </Button>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge 
                    variant="secondary" 
                    className="mb-3 w-fit"
                    style={{ backgroundColor: `${getCategoryColor(selectedItem.categoryId)}20`, color: getCategoryColor(selectedItem.categoryId) }}
                  >
                    {getCategoryName(selectedItem.categoryId)}
                  </Badge>
                  <CardTitle className="text-3xl mb-3">{selectedItem.answer}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {selectedItem.question}
                  </CardDescription>
                </div>
                {userProgress.favoriteItems?.includes(selectedItem.id) && (
                  <Star size={24} weight="fill" className="text-accent flex-shrink-0" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-2">
                    Hints
                  </h3>
                  <div className="space-y-2">
                    {selectedItem.hints.map((hint, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-3 border-l-2 border-accent">
                        <p className="text-sm">
                          <span className="font-semibold text-accent mr-2">Hint {index + 1}:</span>
                          {hint}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-lg p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-2">
                      {selectedItem.association.technique}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedItem.association.explanation}
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border-l-4 border-primary">
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                      Mental Imagery
                    </h4>
                    <p className="font-secondary text-sm leading-relaxed">
                      {selectedItem.association.imagery}
                    </p>
                  </div>
                  
                  {selectedItem.association.mnemonic && (
                    <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                      <h4 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                        Mnemonic
                      </h4>
                      <p className="text-sm italic text-foreground">
                        "{selectedItem.association.mnemonic}"
                      </p>
                    </div>
                  )}
                </div>

                {selectedItem.difficulty && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Difficulty:
                    </span>
                    <Badge 
                      variant={selectedItem.difficulty === 'easy' ? 'default' : selectedItem.difficulty === 'medium' ? 'secondary' : 'destructive'}
                      className="capitalize"
                    >
                      {selectedItem.difficulty}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Memory Library</h1>
          <p className="text-muted-foreground">
            Browse and search all memory items
          </p>
        </div>

        <div className="relative mb-4">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        <div className="mb-6 -mx-4 px-4">
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="whitespace-nowrap flex-shrink-0"
              >
                All ({allItems.length})
              </Button>
              {itemsByCategory.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="whitespace-nowrap flex-shrink-0"
                  style={
                    selectedCategory === cat.id
                      ? { backgroundColor: cat.color, borderColor: cat.color }
                      : {}
                  }
                >
                  {cat.name} ({cat.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No items found</p>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full text-left group"
              >
                <Card className="hover:border-primary/50 hover:bg-accent/5 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                            {item.answer}
                          </h3>
                          {userProgress.favoriteItems?.includes(item.id) && (
                            <Star size={16} weight="fill" className="text-accent flex-shrink-0" />
                          )}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: `${getCategoryColor(item.categoryId)}20`, color: getCategoryColor(item.categoryId) }}
                        >
                          {getCategoryName(item.categoryId)}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
