import { useState } from 'react';
import { CategoryId, MemoryItem, UserProgress, CategoryGroup } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagnifyingGlass, Star, X, ArrowLeft, Sparkle, FilmStrip, MusicNote, MapPin, ShoppingBag, User, FilmReel, MusicNotes, Microphone, Disc, Buildings, ForkKnife, Signpost, TShirt, Sneaker, Watch, Drop, Diamond } from '@phosphor-icons/react';
import { categories } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryIcon } from '@/lib/helpers';

interface LibraryProps {
  allItems: MemoryItem[];
  userProgress: UserProgress;
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export function Library({ allItems, userProgress }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<MemoryItem | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | 'all'>('all');

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

  const getCategoryIconComponent = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return User;
    return getCategoryIcon(category.icon);
  };

  const itemsByCategory = categories.map(cat => ({
    ...cat,
    count: allItems.filter(item => item.categoryId === cat.id).length
  }));

  const filteredCategories = selectedGroup === 'all' 
    ? itemsByCategory 
    : itemsByCategory.filter(cat => cat.group === selectedGroup);

  const groupIcons = {
    entertainment: FilmStrip,
    places: MapPin,
    brands: ShoppingBag
  };

  const groupCounts = {
    entertainment: allItems.filter(item => categories.find(c => c.id === item.categoryId)?.group === 'entertainment').length,
    places: allItems.filter(item => categories.find(c => c.id === item.categoryId)?.group === 'places').length,
    brands: allItems.filter(item => categories.find(c => c.id === item.categoryId)?.group === 'brands').length
  };

  if (selectedItem) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pb-20 min-h-screen"
      >
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedItem(null)}
            className="mb-4 -ml-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Library
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 overflow-hidden shadow-lg">
              <div 
                className="h-2 w-full"
                style={{ backgroundColor: getCategoryColor(selectedItem.categoryId) }}
              />
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge 
                      variant="secondary" 
                      className="mb-3 w-fit font-medium"
                      style={{ 
                        backgroundColor: `${getCategoryColor(selectedItem.categoryId)}15`, 
                        color: getCategoryColor(selectedItem.categoryId),
                        borderColor: `${getCategoryColor(selectedItem.categoryId)}30`,
                      }}
                    >
                      {getCategoryName(selectedItem.categoryId)}
                    </Badge>
                    <CardTitle className="text-3xl mb-3 leading-tight">{selectedItem.answer}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {selectedItem.question}
                    </CardDescription>
                  </div>
                  {userProgress.favoriteItems?.includes(selectedItem.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Star size={24} weight="fill" className="text-accent flex-shrink-0" />
                    </motion.div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {selectedItem.questions && selectedItem.questions.length > 0 && (
                    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-5 border-2 border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkle size={20} weight="fill" className="text-primary" />
                        <h3 className="text-base font-bold text-primary uppercase tracking-wide">
                          Question Variations
                        </h3>
                        <Badge variant="secondary" className="ml-auto text-xs font-semibold bg-primary/20 text-primary border-primary/30">
                          {selectedItem.questions.length} variations
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                        During practice, one of these questions will appear randomly to simulate real-world recall scenarios.
                      </p>
                      <div className="space-y-2">
                        {selectedItem.questions.map((q, index) => (
                          <motion.div
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="bg-card rounded-lg p-3.5 border-l-4 border-primary shadow-sm"
                          >
                            <p className="text-sm leading-relaxed">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs mr-2.5">{index + 1}</span>
                              {q}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkle size={16} weight="fill" className="text-accent" />
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
                        Hints
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {selectedItem.hints.map((hint, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: (selectedItem.questions?.length || 0) * 0.05 + 0.2 + index * 0.1 }}
                          className="bg-gradient-to-r from-accent/10 to-transparent rounded-lg p-3 border-l-2 border-accent"
                        >
                          <p className="text-sm">
                            <span className="font-semibold text-accent mr-2">Hint {index + 1}:</span>
                            {hint}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-secondary/20 rounded-xl p-5 space-y-4 border border-secondary/30"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-2">
                        {selectedItem.association.technique}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedItem.association.explanation}
                      </p>
                    </div>
                    
                    <div className="bg-card rounded-lg p-4 border-l-4 border-primary shadow-sm">
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 flex items-center gap-1">
                        Mental Imagery
                      </h4>
                      <p className="font-secondary text-sm leading-relaxed italic">
                        {selectedItem.association.imagery}
                      </p>
                    </div>
                    
                    {selectedItem.association.mnemonic && (
                      <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/30">
                        <h4 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                          Mnemonic Device
                        </h4>
                        <p className="text-sm italic text-foreground font-medium">
                          "{selectedItem.association.mnemonic}"
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {selectedItem.difficulty && (
                    <div className="flex items-center gap-2 pt-2">
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
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Memory Library
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore {allItems.length} memory items across {categories.length} categories
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" />
          <Input
            placeholder="Search by name or question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-base shadow-sm border-2 focus:border-primary transition-all"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X size={16} />
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Filter by Group</h2>
            {selectedGroup !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                {groupCounts[selectedGroup as CategoryGroup]} items
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={selectedGroup === 'all' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedGroup('all');
                setSelectedCategory('all');
              }}
              className="flex-col h-auto py-3 gap-1"
            >
              <Sparkle size={20} weight={selectedGroup === 'all' ? 'fill' : 'regular'} />
              <span className="text-xs font-medium">All</span>
              <span className="text-xs opacity-70">{allItems.length}</span>
            </Button>
            
            {(Object.keys(groupIcons) as CategoryGroup[]).map((group) => {
              const Icon = groupIcons[group];
              return (
                <Button
                  key={group}
                  variant={selectedGroup === group ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedGroup(group);
                    setSelectedCategory('all');
                  }}
                  className="flex-col h-auto py-3 gap-1"
                >
                  <Icon size={20} weight={selectedGroup === group ? 'fill' : 'regular'} />
                  <span className="text-xs font-medium capitalize">{group}</span>
                  <span className="text-xs opacity-70">{groupCounts[group]}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Category</h2>
            {selectedCategory !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="text-xs h-7"
              >
                Clear
              </Button>
            )}
          </div>
          
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as CategoryId | 'all')}
          >
            <SelectTrigger className="h-12 border-2 shadow-sm">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center justify-between w-full gap-3">
                  <span className="font-medium">All Categories</span>
                  <Badge variant="secondary" className="text-xs">
                    {filteredCategories.reduce((sum, cat) => sum + cat.count, 0)}
                  </Badge>
                </div>
              </SelectItem>
              {filteredCategories.map(cat => {
                const CategoryIcon = getCategoryIcon(cat.icon);
                return (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <CategoryIcon 
                          size={16} 
                          weight="duotone"
                          className="flex-shrink-0" 
                          style={{ color: cat.color }}
                        />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {cat.count}
                      </Badge>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory + searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {filteredItems.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="pt-16 pb-16 text-center">
                  <MagnifyingGlass size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-lg font-medium mb-1">No items found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredItems.length}</span> {filteredItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="grid gap-2">
                  {filteredItems.map((item, index) => {
                    const ItemIcon = getCategoryIconComponent(item.categoryId);
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="w-full text-left group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                      >
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-accent/5 transition-all">
                          <ItemIcon 
                            size={20} 
                            weight="duotone"
                            className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
                            style={{ color: getCategoryColor(item.categoryId) }}
                          />
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                              {item.answer}
                            </span>
                            {userProgress.favoriteItems?.includes(item.id) && (
                              <Star size={14} weight="fill" className="text-accent flex-shrink-0" />
                            )}
                            {item.questions && item.questions.length > 1 && (
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                ({item.questions.length})
                              </span>
                            )}
                          </div>
                          <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
