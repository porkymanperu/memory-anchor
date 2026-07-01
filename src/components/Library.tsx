import { useState, useRef, useMemo, useEffect } from 'react';
import { CategoryId, DeletedMemoryItem, MemoryItem, UserProgress, CategoryGroup } from '@/lib/types';
import { useCustomCategoriesKV } from '@/hooks/queries';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagnifyingGlass, Star, X, Sparkle, FilmStrip, MapPin, ShoppingBag, Plus, Image as ImageIcon, Upload, CaretLeft, CaretRight, CaretDoubleLeft, CaretDoubleRight, Trash, FileCsv } from '@phosphor-icons/react';
import { categories as defaultCategories } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryIcon } from '@/lib/helpers';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { MemoryItemDetail } from './MemoryItemDetail';
import { CsvImportDialog } from './CsvImportDialog';

const CATEGORY_CREATE_OPTION_VALUE = '__create_new_category__';
const CATEGORY_NAME_REGEX = /^[A-Za-z0-9À-ÿ\s'&-]+$/;
const CATEGORY_ID_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type StoredCategory = {
  id: string;
  name: string;
  group: CategoryGroup;
  icon: string;
  color: string;
};

interface LibraryProps {
  allItems: MemoryItem[];
  recycleBinItems: DeletedMemoryItem[];
  userProgress: UserProgress;
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  setAllItems: (updater: (prev: MemoryItem[]) => MemoryItem[]) => void;
  setRecycleBinItems: (updater: (prev: DeletedMemoryItem[]) => DeletedMemoryItem[]) => void;
}

export function Library({ allItems, recycleBinItems, userProgress, setUserProgress, setAllItems, setRecycleBinItems }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [customCategories, setCustomCategories] = useCustomCategoriesKV();
  const [selectedItem, setSelectedItem] = useState<MemoryItem | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryGroup, setNewCategoryGroup] = useState<CategoryGroup>('entertainment');
  const [newCategoryError, setNewCategoryError] = useState('');
  const [newCategoryIdError, setNewCategoryIdError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isGeneratingHints, setIsGeneratingHints] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MemoryItem | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [selectedRecycleBinIds, setSelectedRecycleBinIds] = useState<Set<string>>(new Set());
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);

  const allCategories = useMemo(() => {
    const merged = [...defaultCategories, ...(customCategories || [])];
    const deduped = new Map<string, StoredCategory>();
    merged.forEach((category) => {
      deduped.set(category.id, category as StoredCategory);
    });
    return [...deduped.values()];
  }, [customCategories]);

  const categoryNameSet = useMemo(() => {
    return new Set(allCategories.map(category => category.name.trim().toLowerCase()));
  }, [allCategories]);
  
  const [newItemForm, setNewItemForm] = useState({
    categoryId: (allCategories[0]?.id || 'actors') as CategoryId,
    answerType: 'single' as 'single' | 'multiple',
    answer: '',
    validAnswers: [''],
    questions: [''],
    hint1: '',
    hint2: '',
    answerImageUrl: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  const normalizeCategoryId = (name: string) => {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const getCategoryDefaultsByGroup = (group: CategoryGroup) => {
    if (group === 'entertainment') {
      return { icon: 'film', color: 'oklch(0.62 0.22 24)' };
    }
    if (group === 'places') {
      return { icon: 'buildings', color: 'oklch(0.56 0.16 238)' };
    }
    return { icon: 'diamond', color: 'oklch(0.6 0.18 40)' };
  };

  const validateCategoryName = (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) return 'Category name cannot be empty';
    if (trimmed.length < 2) return 'Category name must be at least 2 characters';
    if (trimmed.length > 40) return 'Category name must be 40 characters or less';
    if (!CATEGORY_NAME_REGEX.test(trimmed)) {
      return 'Only letters, numbers, spaces, apostrophes, hyphens, and & are allowed';
    }
    if (categoryNameSet.has(trimmed.toLowerCase())) {
      return 'A category with this name already exists';
    }
    return null;
  };

  const validateCategoryId = (id: string): string | null => {
    const trimmed = id.trim().toLowerCase();
    if (!trimmed) return 'Category ID cannot be empty';
    if (trimmed.length < 2) return 'Category ID must be at least 2 characters';
    if (trimmed.length > 40) return 'Category ID must be 40 characters or less';
    if (!CATEGORY_ID_REGEX.test(trimmed)) {
      return 'Use lowercase letters, numbers, and hyphens only';
    }
    if (allCategories.some(category => category.id === trimmed)) {
      return 'A category with this ID already exists';
    }
    return null;
  };

  const resetCategoryDialog = () => {
    setNewCategoryName('');
    setNewCategoryId('');
    setNewCategoryGroup('entertainment');
    setNewCategoryError('');
    setNewCategoryIdError('');
  };

  const createCategory = () => {
    const nameError = validateCategoryName(newCategoryName);
    const idError = validateCategoryId(newCategoryId);

    setNewCategoryError(nameError || '');
    setNewCategoryIdError(idError || '');

    if (nameError || idError) {
      return;
    }

    const trimmedName = newCategoryName.trim();
    const categoryId = newCategoryId.trim().toLowerCase();
    const defaults = getCategoryDefaultsByGroup(newCategoryGroup);

    const createdCategory: StoredCategory = {
      id: categoryId,
      name: trimmedName,
      group: newCategoryGroup,
      icon: defaults.icon,
      color: defaults.color,
    };

    setCustomCategories((prev) => [...(prev || []), createdCategory]);
    setNewItemForm(prev => ({ ...prev, categoryId: createdCategory.id as CategoryId }));
    setSelectedCategory(createdCategory.id as CategoryId);
    toast.success('Category created');
    setIsCategoryDialogOpen(false);
    resetCategoryDialog();
  };

  const handleOpenCategoryDialog = () => {
    resetCategoryDialog();
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCustomCategory = (categoryId: string) => {
    const hasItemsInCategory = allItems.some(item => item.categoryId === categoryId);
    if (hasItemsInCategory) {
      toast.error('Move or delete items in this category before removing it');
      return;
    }

    setCustomCategories((prev) => (prev || []).filter(category => category.id !== categoryId));

    if (selectedCategory === categoryId) {
      setSelectedCategory('all');
    }

    setNewItemForm((prev) => {
      if (prev.categoryId !== categoryId) return prev;
      return { ...prev, categoryId: (allCategories[0]?.id || 'actors') as CategoryId };
    });

    toast.success('Category removed');
  };

  useEffect(() => {
    if (!allCategories.some(category => category.id === newItemForm.categoryId)) {
      setNewItemForm((prev) => ({
        ...prev,
        categoryId: (allCategories[0]?.id || 'actors') as CategoryId,
      }));
    }
  }, [allCategories, newItemForm.categoryId]);

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
      const categoryName = allCategories.find(c => c.id === newItemForm.categoryId)?.name || 'general topic';
      
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
      categoryId: (allCategories[0]?.id || 'actors') as CategoryId,
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

  useEffect(() => {
    const validIds = new Set(allItems.map(item => item.id));
    setSelectedItemIds((prev) => {
      const next = new Set([...prev].filter(id => validIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [allItems]);

  useEffect(() => {
    const validRecycleIds = new Set(recycleBinItems.map(entry => entry.item.id));
    setSelectedRecycleBinIds((prev) => {
      const next = new Set([...prev].filter(id => validRecycleIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [recycleBinItems]);

  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => {
      if (prev) {
        setSelectedItemIds(new Set());
      }
      return !prev;
    });
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const selectAllFilteredItems = () => {
    setSelectedItemIds(new Set(filteredItems.map(item => item.id)));
  };

  const clearSelection = () => {
    setSelectedItemIds(new Set());
  };

  const upsertRecycleBinItems = (items: MemoryItem[]) => {
    if (items.length === 0) return;

    const deletedAt = new Date().toISOString();
    const deletedIds = new Set(items.map(item => item.id));
    const recycleEntries = items.map(item => ({ item, deletedAt }));

    setRecycleBinItems((prev) => [
      ...recycleEntries,
      ...prev.filter(entry => !deletedIds.has(entry.item.id)),
    ]);
  };

  const handleDeleteItem = (itemId: string) => {
    const itemToMove = allItems.find(item => item.id === itemId);
    if (!itemToMove) {
      setItemToDelete(null);
      return;
    }

    setAllItems((prev) => prev.filter(item => item.id !== itemId));
    upsertRecycleBinItems([itemToMove]);

    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }

    toast.success('Memory item moved to Recycle Bin');
    setItemToDelete(null);
  };

  const handleBulkDelete = () => {
    const itemIdsToDelete = new Set(selectedItemIds);
    const deletedCount = itemIdsToDelete.size;

    if (deletedCount === 0) {
      setIsBulkDeleteDialogOpen(false);
      return;
    }

    const itemsToMove = allItems.filter(item => itemIdsToDelete.has(item.id));

    setAllItems((prev) => prev.filter(item => !itemIdsToDelete.has(item.id)));
    upsertRecycleBinItems(itemsToMove);

    if (selectedItem && itemIdsToDelete.has(selectedItem.id)) {
      setSelectedItem(null);
    }

    setSelectedItemIds(new Set());
    setIsSelectionMode(false);
    setIsBulkDeleteDialogOpen(false);
    toast.success(`${deletedCount} memory ${deletedCount === 1 ? 'item' : 'items'} moved to Recycle Bin`);
  };

  const toggleRecycleBinSelection = (itemId: string) => {
    setSelectedRecycleBinIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const restoreSelectedItems = () => {
    const idsToRestore = new Set(selectedRecycleBinIds);
    const restoreCount = idsToRestore.size;

    if (restoreCount === 0) {
      setIsRestoreConfirmOpen(false);
      return;
    }

    const itemsToRestore = recycleBinItems
      .filter(entry => idsToRestore.has(entry.item.id))
      .map(entry => entry.item);

    setAllItems((prev) => {
      const existingIds = new Set(prev.map(item => item.id));
      const uniqueItems = itemsToRestore.filter(item => !existingIds.has(item.id));
      return [...prev, ...uniqueItems];
    });

    setRecycleBinItems((prev) => prev.filter(entry => !idsToRestore.has(entry.item.id)));
    setSelectedRecycleBinIds(new Set());
    setIsRestoreConfirmOpen(false);
    toast.success(`${restoreCount} memory ${restoreCount === 1 ? 'item' : 'items'} restored`);
  };

  const handleRestoreAction = () => {
    if (selectedRecycleBinIds.size > 1) {
      setIsRestoreConfirmOpen(true);
      return;
    }

    restoreSelectedItems();
  };

  const filteredItems = useMemo(() => {
    const items = allItems.filter(item => {
      const matchesSearch = 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.questions && item.questions.some(q => q.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const itemCategory = allCategories.find(c => c.id === item.categoryId);
      const matchesGroup = selectedGroup === 'all' || itemCategory?.group === selectedGroup;
      return matchesSearch && matchesCategory && matchesGroup;
    });
    return items;
  }, [allItems, searchQuery, selectedCategory, selectedGroup, allCategories]);

  // Reset pagination when the active filter set changes. Doing this in an
  // effect (rather than inside the useMemo above) avoids "Too many re-renders"
  // by ensuring setState never runs during render.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedGroup]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const selectedCount = selectedItemIds.size;
  const isAllFilteredSelected = filteredItems.length > 0 && filteredItems.every(item => selectedItemIds.has(item.id));
  const selectedRecycleCount = selectedRecycleBinIds.size;
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
    return allCategories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    return allCategories.find(c => c.id === categoryId)?.color || 'oklch(0.5 0.1 200)';
  };

  const getCategoryIconComponent = (categoryId: string) => {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return Sparkle;
    return getCategoryIcon(category.icon);
  };

  const itemsByCategory = allCategories.map(cat => ({
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
    entertainment: allItems.filter(item => allCategories.find(c => c.id === item.categoryId)?.group === 'entertainment').length,
    places: allItems.filter(item => allCategories.find(c => c.id === item.categoryId)?.group === 'places').length,
    brands: allItems.filter(item => allCategories.find(c => c.id === item.categoryId)?.group === 'brands').length
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
                Explore {allItems.length} memory items across {allCategories.length} categories
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Button
                variant={isSelectionMode ? 'default' : 'outline'}
                onClick={toggleSelectionMode}
                className="flex-shrink-0"
              >
                {isSelectionMode ? 'Done' : 'Select'}
              </Button>

              <Dialog open={isRecycleBinOpen} onOpenChange={setIsRecycleBinOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-shrink-0 gap-2">
                    <Trash size={18} weight="bold" />
                    Recycle Bin
                    {recycleBinItems.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {recycleBinItems.length}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Recycle Bin</DialogTitle>
                    <DialogDescription>
                      Restore deleted memory items back to your main library.
                    </DialogDescription>
                  </DialogHeader>

                  {recycleBinItems.length === 0 ? (
                    <Card className="border-2 border-dashed mt-2">
                      <CardContent className="pt-12 pb-12 text-center">
                        <Trash size={40} className="mx-auto mb-3 text-muted-foreground opacity-60" />
                        <p className="text-muted-foreground text-lg font-medium mb-1">Recycle Bin is empty</p>
                        <p className="text-sm text-muted-foreground">Deleted memory items will appear here.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4 mt-2">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <p className="text-sm text-muted-foreground">
                          {selectedRecycleCount} selected of {recycleBinItems.length}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (selectedRecycleCount === recycleBinItems.length) {
                                setSelectedRecycleBinIds(new Set());
                              } else {
                                setSelectedRecycleBinIds(new Set(recycleBinItems.map(entry => entry.item.id)));
                              }
                            }}
                          >
                            {selectedRecycleCount === recycleBinItems.length ? 'Clear' : 'Select all'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleRestoreAction}
                            disabled={selectedRecycleCount === 0}
                          >
                            Restore Selected
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {recycleBinItems.map((entry) => {
                          const { item, deletedAt } = entry;
                          const isSelected = selectedRecycleBinIds.has(item.id);
                          const ItemIcon = getCategoryIconComponent(item.categoryId);

                          return (
                            <div
                              key={item.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleRecycleBinSelection(item.id)}
                                aria-label={`Select deleted item ${item.answer}`}
                                className="mt-1"
                              />
                              <ItemIcon
                                size={18}
                                weight="duotone"
                                className="flex-shrink-0 mt-0.5"
                                style={{ color: getCategoryColor(item.categoryId) }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.answer}</p>
                                <p className="text-xs text-muted-foreground truncate">{item.question}</p>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                  Deleted {new Date(deletedAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="flex-shrink-0 gap-2"
                onClick={() => setIsCsvImportOpen(true)}
              >
                <FileCsv size={18} weight="bold" />
                Import CSV
              </Button>

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
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenCategoryDialog}
                        className="h-7 gap-1 text-xs"
                      >
                        <Plus size={12} weight="bold" />
                        New Category
                      </Button>
                    </div>
                    <Select
                      value={newItemForm.categoryId}
                      onValueChange={(value) => {
                        if (value === CATEGORY_CREATE_OPTION_VALUE) {
                          handleOpenCategoryDialog();
                          return;
                        }
                        setNewItemForm({ ...newItemForm, categoryId: value as CategoryId });
                      }}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map(cat => {
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
                        <SelectItem value={CATEGORY_CREATE_OPTION_VALUE}>
                          <div className="flex items-center gap-2 text-primary font-medium">
                            <Plus size={14} weight="bold" />
                            Create new category
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Categories you create are saved and available next time you open the app.
                    </p>
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
            onValueChange={(value) => {
              if (value === CATEGORY_CREATE_OPTION_VALUE) {
                handleOpenCategoryDialog();
                return;
              }
              setSelectedCategory(value as CategoryId | 'all');
            }}
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
              <SelectItem value={CATEGORY_CREATE_OPTION_VALUE}>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Plus size={14} weight="bold" />
                  Create new category
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
          setIsCategoryDialogOpen(open);
          if (!open) {
            resetCategoryDialog();
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a custom category without leaving the Memory Library.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="new-category-name">Category name</Label>
                <Input
                  id="new-category-name"
                  value={newCategoryName}
                  onChange={(event) => {
                    setNewCategoryName(event.target.value);

                    if (!newCategoryId.trim()) {
                      setNewCategoryId(normalizeCategoryId(event.target.value));
                    }

                    if (newCategoryError) {
                      setNewCategoryError('');
                    }
                  }}
                  placeholder="e.g., Podcasts"
                />
                {newCategoryError && (
                  <p className="text-sm text-destructive">{newCategoryError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Use letters, numbers, spaces, apostrophes, hyphens, or &.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-category-id">Category ID</Label>
                <Input
                  id="new-category-id"
                  value={newCategoryId}
                  onChange={(event) => {
                    setNewCategoryId(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    if (newCategoryIdError) {
                      setNewCategoryIdError('');
                    }
                  }}
                  placeholder="e.g., podcasts"
                />
                {newCategoryIdError && (
                  <p className="text-sm text-destructive">{newCategoryIdError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and hyphens only.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-category-group">Group</Label>
                <Select
                  value={newCategoryGroup}
                  onValueChange={(value) => setNewCategoryGroup(value as CategoryGroup)}
                >
                  <SelectTrigger id="new-category-group">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="places">Places</SelectItem>
                    <SelectItem value="brands">Brands</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 rounded-lg border border-border p-3">
                <h4 className="text-sm font-semibold">Custom Categories</h4>
                {(customCategories || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No custom categories yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {(customCategories || []).map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-1.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{category.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{category.group}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteCustomCategory(category.id)}
                        >
                          <Trash size={14} weight="bold" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCategoryDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={createCategory}>
                  Create Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
                  {allItems.length === 0 ? (
                    <>
                      <Sparkle size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground text-lg font-medium mb-1">Your Memory Library is empty</p>
                      <p className="text-sm text-muted-foreground mb-4">Add a new memory item or open Recycle Bin to restore deleted items.</p>
                      <Button variant="outline" onClick={() => setIsRecycleBinOpen(true)} className="gap-2">
                        <Trash size={16} weight="bold" />
                        Open Recycle Bin
                      </Button>
                    </>
                  ) : (
                    <>
                      <MagnifyingGlass size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground text-lg font-medium mb-1">No items found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                    </>
                  )}
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
                    const isSelected = selectedItemIds.has(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        className="w-full group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                      >
                        <div className={`flex items-center gap-2 px-3 py-2 bg-card border rounded-lg transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/5'}`}>
                          <button
                            type="button"
                            onClick={() => isSelectionMode ? toggleItemSelection(item.id) : setSelectedItem(item)}
                            className="flex-1 min-w-0 flex items-center gap-3 text-left"
                          >
                            {isSelectionMode && (
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleItemSelection(item.id)}
                                onClick={(event) => event.stopPropagation()}
                                aria-label={`Select ${item.answer}`}
                              />
                            )}
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
                          </button>

                          {!isSelectionMode && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={(event) => {
                                event.stopPropagation();
                                setItemToDelete(item);
                              }}
                              aria-label={`Delete ${item.answer}`}
                            >
                              <Trash size={16} weight="bold" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
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

        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete memory item?</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{itemToDelete?.answer}&quot; will be moved to Recycle Bin. You can restore it later from the Recycle Bin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setItemToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => itemToDelete && handleDeleteItem(itemToDelete.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete {selectedCount} memory {selectedCount === 1 ? 'item' : 'items'}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                The selected memory {selectedCount === 1 ? 'item will' : 'items will'} be moved to Recycle Bin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isRestoreConfirmOpen} onOpenChange={setIsRestoreConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Restore {selectedRecycleCount} memory items?
              </AlertDialogTitle>
              <AlertDialogDescription>
                The selected items will be moved back to your Memory Library.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={restoreSelectedItems}>
                Restore
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {isSelectionMode && selectedCount > 0 && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="fixed bottom-24 left-0 right-0 z-40 px-4"
          >
            <div className="max-w-2xl mx-auto bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-lg p-3 flex items-center gap-2">
              <p className="text-sm font-medium flex-1 min-w-0">
                {selectedCount} selected
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={isAllFilteredSelected ? clearSelection : selectAllFilteredItems}
              >
                {isAllFilteredSelected ? 'Clear' : 'Select all'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
                className="gap-1"
                disabled={selectedCount === 0}
              >
                <Trash size={14} weight="bold" />
                Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
        <CsvImportDialog
          open={isCsvImportOpen}
          onOpenChange={setIsCsvImportOpen}
          allItems={allItems}
          onImport={(newItems) => {
            setAllItems((prev) => [...prev, ...newItems]);
            toast.success(`${newItems.length} memory ${newItems.length === 1 ? 'item' : 'items'} imported`);
          }}
        />
      </div>
    </div>
  );
}
