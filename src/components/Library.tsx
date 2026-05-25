import { useState, useRef, useMemo } from 'react';
import { CategoryId, MemoryItem, UserProgress, CategoryGroup } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagnifyingGlass, Star, X, Sparkle, FilmStrip, MapPin, ShoppingBag, Plus, Image as ImageIcon, Upload, CaretLeft, CaretRight, CaretDoubleLeft, CaretDoubleRight } from '@phosphor-icons/react';
import { categories } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryIcon } from '@/lib/helpers';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MemoryItemDetail } from './MemoryItemDetail';

interface LibraryProps {
  allItems: MemoryItem[];
  userProgress: UserProgress;
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  setAllItems: (updater: (prev: MemoryItem[]) => MemoryItem[]) => void;
}

export function Library({ allItems, userProgress, setAllItems }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<MemoryItem | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isGeneratingHints, setIsGeneratingHints] = useState(false);
  
  const [newItemForm, setNewItemForm] = useState({
    categoryId: 'actors' as CategoryId,
    answerType: 'single' as 'single' | 'multiple',
    answer: '',
    validAnswers: [''],
    questions: [''],
    hint1: '',
    hint2: '',
    answerImageUrl: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setNewItemForm({ ...newItemForm, answerImageUrl: dataUrl });
      setImagePreview(dataUrl);
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setNewItemForm({ ...newItemForm, answerImageUrl: '' });
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateHints = async () => {
    let answerValue = '';
    
    if (newItemForm.answerType === 'single') {
      answerValue = newItemForm.answer.trim();
      if (!answerValue) {
        toast.error('Please enter an answer first');
        return;
      }
    } else {
      const validAnswers = newItemForm.validAnswers.filter(a => a.trim() !== '');
      if (validAnswers.length === 0) {
        toast.error('Please enter at least one valid answer first');
        return;
      }
      answerValue = validAnswers.join(', ');
    }

    setIsGeneratingHints(true);
    
    try {
      const categoryName = categories.find(c => c.id === newItemForm.categoryId)?.name || 'general topic';
      
      const contextType = newItemForm.answerType === 'multiple' 
        ? 'múltiples respuestas: ' + answerValue 
        : 'respuesta: ' + answerValue;
      
      const promptText = `Eres un asistente de entrenamiento de memoria. Tu tarea es generar exactamente DOS pistas progresivas en español para ayudar a recordar ${contextType} en la categoría "${categoryName}".

Las pistas deben ser:
- Disparadores de memoria útiles que NO revelen directamente la respuesta
- Progresivas (la primera más sutil, la segunda más obvia)
- Concisas (máximo 2 oraciones cada una)
- Apropiadas y comprensibles
- Completamente en español

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura:
{
  "hints": ["Primera pista aquí", "Segunda pista aquí"],
  "valid": true
}

Solo responde con el JSON, sin texto adicional.`;

      const response = await window.spark.llm(promptText, 'gpt-4o', true);
      const result = JSON.parse(response);
      
      if (result.hints && Array.isArray(result.hints) && result.hints.length >= 2) {
        setNewItemForm({
          ...newItemForm,
          hint1: result.hints[0],
          hint2: result.hints[1]
        });
        toast.success('¡Pistas generadas exitosamente!');
      } else {
        toast.error('Formato de respuesta inesperado. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error generating hints:', error);
      toast.error('Failed to generate hints. Please try again.');
    } finally {
      setIsGeneratingHints(false);
    }
  };

  const handleAddItem = () => {
    const validQuestions = newItemForm.questions.filter(q => q.trim() !== '');
    if (validQuestions.length === 0) {
      toast.error('Please provide at least one question');
      return;
    }

    if (!newItemForm.hint1.trim() || !newItemForm.hint2.trim()) {
      toast.error('Please provide two hints');
      return;
    }

    if (newItemForm.answerType === 'single') {
      if (!newItemForm.answer.trim()) {
        toast.error('Please fill in the answer field');
        return;
      }
    } else {
      const validAnswers = newItemForm.validAnswers.filter(a => a.trim() !== '');
      if (validAnswers.length === 0) {
        toast.error('Please provide at least one valid answer');
        return;
      }
    }

    const trimmedQuestions = validQuestions.map(q => q.trim());
    
    const newItem: MemoryItem = {
      id: `custom-${Date.now()}`,
      categoryId: newItemForm.categoryId,
      answerType: newItemForm.answerType,
      answer: newItemForm.answerType === 'single' ? newItemForm.answer.trim() : '',
      validAnswers: newItemForm.answerType === 'multiple' 
        ? newItemForm.validAnswers.filter(a => a.trim() !== '').map(a => a.trim())
        : undefined,
      question: trimmedQuestions[0],
      questions: trimmedQuestions.length > 1 ? trimmedQuestions : undefined,
      hints: [newItemForm.hint1.trim(), newItemForm.hint2.trim()],
      answerImageUrl: newItemForm.answerImageUrl.trim() || undefined,
      isCustom: true,
      difficulty: newItemForm.difficulty,
    };

    setAllItems((prev) => [...prev, newItem]);
    
    toast.success('Memory item added successfully!');
    setIsAddDialogOpen(false);
    
    setNewItemForm({
      categoryId: 'actors',
      answerType: 'single',
      answer: '',
      validAnswers: [''],
      questions: [''],
      hint1: '',
      hint2: '',
      answerImageUrl: '',
      difficulty: 'medium',
    });
    setImagePreview('');
    setUploadMode('url');
  };

  const filteredItems = useMemo(() => {
    const items = allItems.filter(item => {
      const matchesSearch = 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.questions && item.questions.some(q => q.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const itemCategory = categories.find(c => c.id === item.categoryId);
      const matchesGroup = selectedGroup === 'all' || itemCategory?.group === selectedGroup;
      return matchesSearch && matchesCategory && matchesGroup;
    });
    setCurrentPage(1);
    return items;
  }, [allItems, searchQuery, selectedCategory, selectedGroup]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || 'oklch(0.5 0.1 200)';
  };

  const getCategoryIconComponent = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return Sparkle;
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
    return <MemoryItemDetail item={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Memory Library
              </h1>
              <p className="text-muted-foreground text-lg">
                Explore {allItems.length} memory items across {categories.length} categories
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-shrink-0 gap-2 shadow-md">
                  <Plus size={20} weight="bold" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Add New Memory Item</DialogTitle>
                  <DialogDescription>
                    Create a custom memory item to practice with. Fill in all fields to create an effective memory aid.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItemForm.categoryId}
                      onValueChange={(value) => setNewItemForm({ ...newItemForm, categoryId: value as CategoryId })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => {
                          const CategoryIcon = getCategoryIcon(cat.icon);
                          return (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                <CategoryIcon 
                                  size={16} 
                                  weight="duotone"
                                  style={{ color: cat.color }}
                                />
                                <span>{cat.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="answerType">Answer Type</Label>
                    <Select
                      value={newItemForm.answerType}
                      onValueChange={(value) => setNewItemForm({ ...newItemForm, answerType: value as 'single' | 'multiple' })}
                    >
                      <SelectTrigger id="answerType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Answer</SelectItem>
                        <SelectItem value="multiple">Multiple-Value Answer</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {newItemForm.answerType === 'single' 
                        ? 'For questions with one specific answer (e.g., "Who is the lead singer of Foo Fighters?")'
                        : 'For questions requiring multiple answers (e.g., "Tell me 5 songs by Foo Fighters")'}
                    </p>
                  </div>

                  {newItemForm.answerType === 'single' ? (
                    <div className="space-y-2">
                      <Label htmlFor="answer">Answer (What you're trying to remember) *</Label>
                      <Input
                        id="answer"
                        placeholder="e.g., Leonardo DiCaprio"
                        value={newItemForm.answer}
                        onChange={(e) => setNewItemForm({ ...newItemForm, answer: e.target.value })}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Valid Answers * (All acceptable answers)</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNewItemForm({ ...newItemForm, validAnswers: [...newItemForm.validAnswers, ''] })}
                          className="gap-1 h-7 text-xs"
                        >
                          <Plus size={14} weight="bold" />
                          Add Answer
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {newItemForm.validAnswers.map((answer, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex-1">
                              <Input
                                id={`answer-${index}`}
                                placeholder={`Answer ${index + 1}: e.g., Everlong`}
                                value={answer}
                                onChange={(e) => {
                                  const newAnswers = [...newItemForm.validAnswers];
                                  newAnswers[index] = e.target.value;
                                  setNewItemForm({ ...newItemForm, validAnswers: newAnswers });
                                }}
                              />
                            </div>
                            {newItemForm.validAnswers.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newAnswers = newItemForm.validAnswers.filter((_, i) => i !== index);
                                  setNewItemForm({ ...newItemForm, validAnswers: newAnswers });
                                }}
                                className="flex-shrink-0 h-auto px-2 text-muted-foreground hover:text-destructive"
                              >
                                <X size={18} />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Add all valid answers. During practice, users will self-assess how many they remembered.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Questions * (Add multiple for random variation)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setNewItemForm({ ...newItemForm, questions: [...newItemForm.questions, ''] })}
                        className="gap-1 h-7 text-xs"
                      >
                        <Plus size={14} weight="bold" />
                        Add Question
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {newItemForm.questions.map((question, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex-1">
                            <Textarea
                              id={`question-${index}`}
                              placeholder={`Question ${index + 1}: e.g., Who played Jack in Titanic?`}
                              value={question}
                              onChange={(e) => {
                                const newQuestions = [...newItemForm.questions];
                                newQuestions[index] = e.target.value;
                                setNewItemForm({ ...newItemForm, questions: newQuestions });
                              }}
                              rows={2}
                              className={index > 0 ? 'border-accent/30' : ''}
                            />
                          </div>
                          {newItemForm.questions.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newQuestions = newItemForm.questions.filter((_, i) => i !== index);
                                setNewItemForm({ ...newItemForm, questions: newQuestions });
                              }}
                              className="flex-shrink-0 h-auto px-2 text-muted-foreground hover:text-destructive"
                            >
                              <X size={18} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add multiple questions to practice different ways of recalling the same answer. During practice, one will be randomly selected.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Hints *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateHints}
                        disabled={
                          isGeneratingHints || 
                          (newItemForm.answerType === 'single' && !newItemForm.answer.trim()) ||
                          (newItemForm.answerType === 'multiple' && newItemForm.validAnswers.filter(a => a.trim()).length === 0)
                        }
                        className="gap-2 h-8 text-xs"
                      >
                        <Sparkle size={16} weight={isGeneratingHints ? 'regular' : 'fill'} className={isGeneratingHints ? 'animate-spin' : ''} />
                        {isGeneratingHints ? 'Generating...' : 'Generate with AI'}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hint1">Hint 1 *</Label>
                      <Textarea
                        id="hint1"
                        placeholder="First hint"
                        value={newItemForm.hint1}
                        onChange={(e) => setNewItemForm({ ...newItemForm, hint1: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hint2">Hint 2 *</Label>
                      <Textarea
                        id="hint2"
                        placeholder="Second hint"
                        value={newItemForm.hint2}
                        onChange={(e) => setNewItemForm({ ...newItemForm, hint2: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={newItemForm.difficulty}
                      onValueChange={(value) => setNewItemForm({ ...newItemForm, difficulty: value as 'easy' | 'medium' | 'hard' })}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <ImageIcon size={18} weight="fill" className="text-accent" />
                      Answer Image
                    </h3>

                    <div className="space-y-3">
                      <Label>Answer Image (optional)</Label>
                      <div className="flex gap-2 mb-3">
                        <Button
                          type="button"
                          variant={uploadMode === 'url' ? 'default' : 'outline'}
                          onClick={() => setUploadMode('url')}
                          className="flex-1 gap-2"
                          size="sm"
                        >
                          <ImageIcon size={16} />
                          URL
                        </Button>
                        <Button
                          type="button"
                          variant={uploadMode === 'upload' ? 'default' : 'outline'}
                          onClick={() => setUploadMode('upload')}
                          className="flex-1 gap-2"
                          size="sm"
                        >
                          <Upload size={16} />
                          Upload
                        </Button>
                      </div>

                      {uploadMode === 'url' ? (
                        <Input
                          id="answerImageUrl"
                          placeholder="e.g., https://example.com/image.jpg"
                          value={newItemForm.answerImageUrl}
                          onChange={(e) => setNewItemForm({ ...newItemForm, answerImageUrl: e.target.value })}
                        />
                      ) : (
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full gap-2"
                          >
                            <Upload size={18} />
                            Choose Image
                          </Button>
                        </div>
                      )}

                      {(imagePreview || (uploadMode === 'url' && newItemForm.answerImageUrl)) && (
                        <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 bg-muted/30">
                          <img
                            src={imagePreview || newItemForm.answerImageUrl}
                            alt="Preview"
                            className="w-full h-48 object-contain"
                            onError={() => {
                              if (uploadMode === 'url') {
                                toast.error('Failed to load image from URL');
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 gap-1"
                          >
                            <X size={14} />
                            Remove
                          </Button>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        This image will appear when the answer is revealed to help reinforce memory. Max file size: 5MB
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddItem}
                      className="flex-1 gap-2"
                    >
                      <Plus size={18} weight="bold" />
                      Add Memory Item
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                    Showing <span className="font-semibold text-foreground">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> of <span className="font-semibold text-foreground">{filteredItems.length}</span> {filteredItems.length === 1 ? 'item' : 'items'}
                  </p>
                  {totalPages > 1 && (
                    <p className="text-xs text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  {paginatedItems.map((item, index) => {
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
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                {item.answer}
                              </span>
                              {userProgress.favoriteItems?.includes(item.id) && (
                                <Star size={14} weight="fill" className="text-accent flex-shrink-0" />
                              )}
                              {item.questions && item.questions.length > 1 && (
                                <Badge 
                                  variant="secondary" 
                                  className="text-[10px] h-4 px-1.5 flex-shrink-0 bg-primary/10 text-primary border-primary/20"
                                >
                                  {item.questions.length} questions
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground truncate">
                              {item.question}
                            </span>
                          </div>
                          <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 pt-4 border-t border-border"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0"
                      >
                        <CaretDoubleLeft size={16} weight="bold" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0"
                      >
                        <CaretLeft size={16} weight="bold" />
                      </Button>
                      
                      <div className="flex items-center gap-1 mx-1">
                        {getPageNumbers().map((page, idx) => (
                          page === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">
                              •••
                            </span>
                          ) : (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(page as number)}
                              className="h-9 min-w-9 px-2 font-medium"
                            >
                              {page}
                            </Button>
                          )
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9 p-0"
                      >
                        <CaretRight size={16} weight="bold" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9 p-0"
                      >
                        <CaretDoubleRight size={16} weight="bold" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
