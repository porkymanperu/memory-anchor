import { useState } from 'react';
import { MemoryItem, UserProgress } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlass, Star } from '@phosphor-icons/react';
import { categories } from '@/lib/data';

interface LibraryProps {
  allItems: MemoryItem[];
  userProgress: UserProgress;
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export function Library({ allItems, userProgress }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = allItems.filter(item =>
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <div className="pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Memory Library</h1>
          <p className="text-muted-foreground">
            Browse and search all memory items
          </p>
        </div>

        <div className="relative mb-6">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No items found</p>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map(item => (
              <Card key={item.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{item.answer}</CardTitle>
                      <CardDescription className="text-base">
                        {item.question}
                      </CardDescription>
                    </div>
                    {userProgress.favoriteItems?.includes(item.id) && (
                      <Star size={20} weight="fill" className="text-accent flex-shrink-0" />
                    )}
                  </div>
                  <Badge variant="secondary" className="w-fit mt-2">
                    {getCategoryName(item.categoryId)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">
                        {item.association.technique}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.association.explanation}
                      </p>
                    </div>
                    <div className="bg-card rounded-md p-3 border-l-2 border-primary">
                      <p className="font-secondary text-sm leading-relaxed">
                        {item.association.imagery}
                      </p>
                    </div>
                    {item.association.mnemonic && (
                      <p className="text-sm italic text-muted-foreground">
                        "{item.association.mnemonic}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
