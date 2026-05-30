import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DownloadSimple,
  UploadSimple,
  FileCsv,
  CheckCircle,
  XCircle,
  Warning,
  ArrowCounterClockwise,
  Sparkle,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  parseCsv,
  buildMemoryItems,
  downloadCsvTemplate,
  type CsvParseResult,
  type ParsedCsvRow,
} from '@/lib/csv-import';
import { MemoryItem } from '@/lib/types';
import { getCategoryIcon } from '@/lib/helpers';
import { categories } from '@/lib/data';

interface CsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allItems: MemoryItem[];
  onImport: (items: MemoryItem[]) => void;
}

type Step = 'upload' | 'preview' | 'done';

const STATUS_CONFIG = {
  valid: {
    label: 'Valid',
    badgeClass: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30',
    icon: CheckCircle,
  },
  invalid: {
    label: 'Invalid',
    badgeClass: 'bg-destructive/15 text-destructive border-destructive/30',
    icon: XCircle,
  },
  duplicate: {
    label: 'Duplicate',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    icon: Warning,
  },
} as const;

export function CsvImportDialog({ open, onOpenChange, allItems, onImport }: CsvImportDialogProps) {
  const [step, setStep] = useState<Step>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [importedCount, setImportedCount] = useState(0);
  const [includeDuplicates, setIncludeDuplicates] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Reset when dialog closes ─────────────────────────────────────────────
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTimeout(() => {
        setStep('upload');
        setFileName('');
        setParseResult(null);
        setImportedCount(0);
        setIncludeDuplicates(false);
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 200);
    }
    onOpenChange(next);
  };

  // ── File processing ──────────────────────────────────────────────────────
  const processFile = useCallback(
    (file: File) => {
      if (!file.name.match(/\.csv$/i)) {
        toast.error('Please select a .csv file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File must be smaller than 5 MB');
        return;
      }

      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const result = parseCsv(text, allItems);
        setParseResult(result);
        setStep('preview');
      };
      reader.onerror = () => toast.error('Failed to read file');
      reader.readAsText(file, 'utf-8');
    },
    [allItems],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // ── Import ────────────────────────────────────────────────────────────────
  const handleImport = () => {
    if (!parseResult) return;

    setIsImporting(true);

    const rowsToImport = parseResult.rows.filter(
      r => r.status === 'valid' || (includeDuplicates && r.status === 'duplicate'),
    );

    // Give the UI a tick to update before heavy work
    setTimeout(() => {
      const newItems = buildMemoryItems(
        rowsToImport.map(r => ({ ...r, status: 'valid' as const })),
      );
      onImport(newItems);
      setImportedCount(newItems.length);
      setIsImporting(false);
      setStep('done');
    }, 60);
  };

  const rowsToImportCount =
    parseResult?.validCount ??
    0 + (includeDuplicates ? (parseResult?.duplicateCount ?? 0) : 0);

  const previewRowsToImport = parseResult
    ? parseResult.rows.filter(
        r => r.status === 'valid' || (includeDuplicates && r.status === 'duplicate'),
      ).length
    : 0;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getCategoryName = (id: string) =>
    categories.find(c => c.id === id)?.name ?? id;

  const getCategoryColor = (id: string) =>
    categories.find(c => c.id === id)?.color ?? 'oklch(0.5 0.1 200)';

  const getCategoryIconComponent = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return Sparkle;
    return getCategoryIcon(cat.icon);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // Render
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileCsv size={26} weight="duotone" className="text-primary" />
              Bulk CSV Import
            </DialogTitle>
            <DialogDescription>
              Import multiple memory items at once using a CSV file.
            </DialogDescription>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {(['upload', 'preview', 'done'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    step === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : i < (['upload', 'preview', 'done'] as Step[]).indexOf(step)
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {i < (['upload', 'preview', 'done'] as Step[]).indexOf(step) ? '✓' : i + 1}
                </div>
                <span
                  className={`text-xs font-medium capitalize ${
                    step === s ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {s}
                </span>
                {i < 2 && <div className="w-6 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: UPLOAD ─────────────────────────────────────────── */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="p-6 space-y-6"
              >
                {/* Download template */}
                <Card className="border-2 border-primary/20 bg-primary/5">
                  <CardContent className="p-4 flex items-start gap-3">
                    <DownloadSimple size={22} weight="bold" className="text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Start with the template</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Download the CSV template, fill it in, then upload it here. Includes a sample row and all valid column names.
                      </p>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-shrink-0 gap-1.5"
                      onClick={downloadCsvTemplate}
                    >
                      <DownloadSimple size={15} weight="bold" />
                      Template
                    </Button>
                  </CardContent>
                </Card>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }`}
                >
                  <UploadSimple
                    size={40}
                    weight="duotone"
                    className={`transition-colors ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <div className="text-center">
                    <p className="font-semibold text-sm">
                      {isDragOver ? 'Drop your CSV here' : 'Drag & drop your CSV file'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      or click to browse — UTF-8 .csv, max 5 MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Column reference */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    CSV columns
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['categoryId', 'answer', 'question', 'hint1', 'hint2'].map(col => (
                      <Badge key={col} variant="default" className="text-xs font-mono">
                        {col}
                      </Badge>
                    ))}
                    {['answerType', 'validAnswers', 'questions', 'difficulty', 'answerImageUrl'].map(col => (
                      <Badge key={col} variant="secondary" className="text-xs font-mono">
                        {col}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Bold</span> = required.
                    Use <code className="bg-muted px-1 rounded">|</code> to separate multiple questions or valid answers within a cell.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: PREVIEW ────────────────────────────────────────── */}
            {step === 'preview' && parseResult && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="p-6 space-y-4"
              >
                {/* Summary bar */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="border-green-500/30 bg-green-500/5">
                    <CardContent className="p-3 text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {parseResult.validCount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Valid</p>
                    </CardContent>
                  </Card>
                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardContent className="p-3 text-center">
                      <p className="text-2xl font-bold text-destructive">
                        {parseResult.invalidCount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Invalid</p>
                    </CardContent>
                  </Card>
                  <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {parseResult.duplicateCount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Duplicate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* File & column warnings */}
                {parseResult.missingColumns.length > 0 && (
                  <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="p-3 flex items-start gap-2">
                      <XCircle size={18} weight="fill" className="text-destructive flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-destructive">Missing required columns</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {parseResult.missingColumns.join(', ')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {parseResult.unknownColumns.length > 0 && (
                  <Card className="border-amber-500/40 bg-amber-500/5">
                    <CardContent className="p-3 flex items-start gap-2">
                      <Warning size={18} weight="fill" className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-amber-700 dark:text-amber-400">Unrecognised columns (ignored)</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {parseResult.unknownColumns.join(', ')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Duplicates option */}
                {parseResult.duplicateCount > 0 && (
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <Checkbox
                      checked={includeDuplicates}
                      onCheckedChange={(v) => setIncludeDuplicates(!!v)}
                    />
                    <span className="text-sm">
                      Also import {parseResult.duplicateCount} duplicate{parseResult.duplicateCount !== 1 ? 's' : ''}
                    </span>
                  </label>
                )}

                {/* File name + re-upload */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                    <FileCsv size={16} weight="duotone" className="flex-shrink-0" />
                    <span className="truncate">{fileName}</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="flex-shrink-0">{parseResult.totalRows} row{parseResult.totalRows !== 1 ? 's' : ''}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 gap-1 text-xs"
                    onClick={() => { setStep('upload'); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  >
                    <ArrowCounterClockwise size={14} />
                    Re-upload
                  </Button>
                </div>

                {/* Row list */}
                {parseResult.rows.length === 0 ? (
                  <Card className="border-2 border-dashed">
                    <CardContent className="py-10 text-center text-muted-foreground text-sm">
                      No data rows found in this file.
                    </CardContent>
                  </Card>
                ) : (
                  <ScrollArea className="h-[280px] rounded-lg border border-border">
                    <div className="divide-y divide-border">
                      {parseResult.rows.map((row) => (
                        <RowPreviewItem
                          key={row.rowNumber}
                          row={row}
                          getCategoryName={getCategoryName}
                          getCategoryColor={getCategoryColor}
                          getCategoryIconComponent={getCategoryIconComponent}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </motion.div>
            )}

            {/* ── STEP 3: DONE ───────────────────────────────────────────── */}
            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 flex flex-col items-center justify-center gap-4 py-16 text-center"
              >
                <CheckCircle size={56} weight="fill" className="text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {importedCount} item{importedCount !== 1 ? 's' : ''} imported!
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Your new memory items are now searchable in the Library.
                  </p>
                </div>
                <Button onClick={() => handleOpenChange(false)} className="mt-2">
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        {step === 'preview' && parseResult && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 flex-shrink-0 flex-wrap">
            <p className="text-sm text-muted-foreground">
              {previewRowsToImport} item{previewRowsToImport !== 1 ? 's' : ''} will be imported
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => { setStep('upload'); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              >
                Back
              </Button>
              <Button
                disabled={previewRowsToImport === 0 || isImporting}
                onClick={handleImport}
                className="gap-2 min-w-[130px]"
              >
                {isImporting ? (
                  <>
                    <Sparkle size={16} weight="regular" className="animate-spin" />
                    Importing…
                  </>
                ) : (
                  <>
                    <UploadSimple size={16} weight="bold" />
                    Import {previewRowsToImport} item{previewRowsToImport !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Row preview sub-component ─────────────────────────────────────────────

interface RowPreviewItemProps {
  row: ParsedCsvRow;
  getCategoryName: (id: string) => string;
  getCategoryColor: (id: string) => string;
  getCategoryIconComponent: (id: string) => React.ElementType;
}

function RowPreviewItem({ row, getCategoryName, getCategoryColor, getCategoryIconComponent }: RowPreviewItemProps) {
  const cfg = STATUS_CONFIG[row.status];
  const StatusIcon = cfg.icon;
  const ItemIcon = row.raw.categoryId ? getCategoryIconComponent(row.raw.categoryId) : Sparkle;

  return (
    <div className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors">
      {/* Row number */}
      <span className="text-xs text-muted-foreground font-mono w-8 flex-shrink-0 pt-0.5">
        {row.rowNumber}
      </span>

      {/* Category icon */}
      <ItemIcon
        size={18}
        weight="duotone"
        className="flex-shrink-0 mt-0.5"
        style={{
          color: row.raw.categoryId ? getCategoryColor(row.raw.categoryId) : undefined,
        }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="font-medium text-sm truncate">
          {row.raw.answer || <span className="text-muted-foreground italic">no answer</span>}
        </p>
        {row.raw.question && (
          <p className="text-xs text-muted-foreground truncate">{row.raw.question}</p>
        )}
        {row.raw.categoryId && (
          <p className="text-[11px] text-muted-foreground">{getCategoryName(row.raw.categoryId)}</p>
        )}
        {row.errors.length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {row.errors.map((err, i) => (
              <li key={i} className="text-xs text-destructive flex items-start gap-1">
                <span className="flex-shrink-0 mt-0.5">•</span>
                {err}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Status badge */}
      <Badge
        variant="outline"
        className={`flex-shrink-0 gap-1 text-[11px] font-semibold ${cfg.badgeClass}`}
      >
        <StatusIcon size={11} weight="fill" />
        {cfg.label}
      </Badge>
    </div>
  );
}
