import { CategoryId, MemoryItem } from './types';

// ─── Column definitions ────────────────────────────────────────────────────

export const CSV_COLUMNS = [
  'categoryId',
  'answer',
  'answerType',
  'validAnswers',
  'question',
  'questions',
  'hint1',
  'hint2',
  'difficulty',
  'answerImageUrl',
] as const;

export type CsvColumn = (typeof CSV_COLUMNS)[number];

const REQUIRED_COLUMNS: CsvColumn[] = ['categoryId', 'answer', 'question', 'hint1', 'hint2'];

export const VALID_CATEGORY_IDS: CategoryId[] = [
  'actors',
  'movies',
  'musicians',
  'songs',
  'albums',
  'cities',
  'restaurants',
  'streets',
  'clothing-brands',
  'shoe-brands',
  'watch-brands',
  'perfume-brands',
  'luxury-brands',
];

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
const VALID_ANSWER_TYPES = ['single', 'multiple'] as const;

// ─── Types ─────────────────────────────────────────────────────────────────

export type RowStatus = 'valid' | 'invalid' | 'duplicate';

export interface ParsedCsvRow {
  /** 1-based line number in the original file */
  rowNumber: number;
  status: RowStatus;
  errors: string[];
  /** Undefined when row has errors */
  item?: Omit<MemoryItem, 'id'>;
  raw: Record<string, string>;
}

export interface CsvParseResult {
  rows: ParsedCsvRow[];
  missingColumns: string[];
  unknownColumns: string[];
  totalRows: number;
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
}

// ─── RFC-4180 CSV tokenizer ────────────────────────────────────────────────

function tokenize(text: string): string[][] {
  const rows: string[][] = [];
  let col = '';
  let row: string[] = [];
  let inQuotes = false;
  let i = 0;

  // Normalise line endings
  const s = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  while (i < s.length) {
    const ch = s[i];
    const next = s[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        // Escaped quote
        col += '"';
        i += 2;
      } else if (ch === '"') {
        inQuotes = false;
        i++;
      } else {
        col += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(col);
        col = '';
        i++;
      } else if (ch === '\n') {
        row.push(col);
        col = '';
        rows.push(row);
        row = [];
        i++;
      } else {
        col += ch;
        i++;
      }
    }
  }

  // Flush last field / row
  row.push(col);
  if (row.some(c => c !== '')) {
    rows.push(row);
  }

  return rows;
}

// ─── Template generator ────────────────────────────────────────────────────

function quoteField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsvLine(fields: string[]): string {
  return fields.map(quoteField).join(',');
}

// Each inner array maps 1-to-1 with CSV_COLUMNS:
// categoryId | answer | answerType | validAnswers | question | questions | hint1 | hint2 | difficulty | answerImageUrl
const TEMPLATE_ROWS: string[][] = [
  // ── actors — single / easy ──────────────────────────────────────────────
  [
    'actors',
    'Meryl Streep',
    'single',
    '',
    'Who played Miranda Priestly in The Devil Wears Prada?',
    'Who won the most Academy Awards of any actor in history?',
    'Three-time Oscar winner celebrated for her unparalleled range and accent work.',
    'Born in New Jersey in 1949; her first major film role was in Kramer vs. Kramer (1979).',
    'easy',
    '',
  ],
  // ── actors — single / medium (multiple questions, image URL) ───────────
  [
    'actors',
    'Leonardo DiCaprio',
    'single',
    '',
    'Who played Jack Dawson in Titanic?',
    'Who starred in Inception?|Who played Jordan Belfort in The Wolf of Wall Street?',
    'Passionate environmental activist who finally won an Oscar in 2016 for The Revenant.',
    'Born in Los Angeles in 1974; breakthrough role opposite Kate Winslet.',
    'medium',
    '',
  ],
  // ── movies — single / hard ──────────────────────────────────────────────
  [
    'movies',
    '2001: A Space Odyssey',
    'single',
    '',
    'Which Stanley Kubrick film features the supercomputer HAL 9000?',
    'Which 1968 science-fiction film was based on a story by Arthur C. Clarke?',
    'A slow, meditative journey from prehistoric apes to deep space; almost no dialogue.',
    'Released in 1968; its famous "Daisy Bell" scene directly inspired later AI depictions.',
    'hard',
    '',
  ],
  // ── movies — single / easy ──────────────────────────────────────────────
  [
    'movies',
    'The Lion King',
    'single',
    '',
    'Which Disney animated film features the song "Hakuna Matata"?',
    '',
    'A young lion cub must reclaim his kingdom after his father is murdered by his uncle.',
    'Released in 1994; loosely inspired by Shakespeare\'s Hamlet.',
    'easy',
    '',
  ],
  // ── musicians — single / medium ─────────────────────────────────────────
  [
    'musicians',
    'David Bowie',
    'single',
    '',
    'Which British musician created the alter ego Ziggy Stardust?',
    'Who recorded the albums "Heroes" and "Station to Station"?',
    'A glam-rock pioneer known for constant reinvention across five decades.',
    'Born David Robert Jones in London, 1947; died January 2016, two days after releasing Blackstar.',
    'medium',
    '',
  ],
  // ── songs — multiple / easy (validAnswers, pipe-separated) ─────────────
  [
    'songs',
    '',
    'multiple',
    'Bohemian Rhapsody|We Will Rock You|Don\'t Stop Me Now|Somebody to Love|We Are the Champions',
    'Name 3 famous songs by Queen.',
    'Can you name at least 3 hit songs from the band Queen?',
    'This British rock band was formed in London in 1970 and fronted by Freddie Mercury.',
    'Their 1975 operatic ballad ran nearly six minutes and was initially refused radio airplay.',
    'easy',
    '',
  ],
  // ── songs — single / hard ───────────────────────────────────────────────
  [
    'songs',
    'Clair de Lune',
    'single',
    '',
    'Which Claude Debussy piano piece translates to "light of the moon"?',
    '',
    'Third movement of Suite bergamasque; one of the most recognisable impressionist piano pieces.',
    'Composed around 1890 but not published until 1905; inspired by a Paul Verlaine poem.',
    'hard',
    '',
  ],
  // ── albums — single / medium ────────────────────────────────────────────
  [
    'albums',
    'Thriller',
    'single',
    '',
    'What is the best-selling music album of all time?',
    'Which Michael Jackson album contains the tracks "Beat It" and "Billie Jean"?',
    'Contains seven top-10 US hits — an unprecedented achievement for any album.',
    'Released in November 1982; the 14-minute "Thriller" music video transformed the industry.',
    'medium',
    '',
  ],
  // ── albums — multiple / hard ────────────────────────────────────────────
  [
    'albums',
    '',
    'multiple',
    'Abbey Road|Sgt. Pepper\'s Lonely Hearts Club Band|Revolver|The White Album|Help!',
    'Name 3 studio albums by The Beatles.',
    'Can you recall at least 3 Beatles studio albums?',
    'The Fab Four released 13 UK studio albums between 1963 and 1970.',
    'Their 1966 album Revolver is often cited by critics as one of the greatest records ever made.',
    'hard',
    '',
  ],
  // ── cities — single / easy ──────────────────────────────────────────────
  [
    'cities',
    'Kyoto',
    'single',
    '',
    'Which former Japanese imperial capital is known for its thousands of Shinto shrines?',
    'Which city hosts the famous Fushimi Inari Taisha shrine with thousands of torii gates?',
    'A city that served as Japan\'s capital for over a millennium and preserves many UNESCO sites.',
    'Located in the Kansai region; name literally means "capital city" in Japanese.',
    'easy',
    '',
  ],
  // ── cities — single / hard ──────────────────────────────────────────────
  [
    'cities',
    'Tbilisi',
    'single',
    '',
    'What is the capital city of Georgia (the country)?',
    '',
    'Situated on the Kura River; the old town features a distinctive mix of Persian and Russian architecture.',
    'Founded in the 5th century AD by King Vakhtang I; the name means "warm place" in Georgian.',
    'hard',
    '',
  ],
  // ── restaurants — single / medium ───────────────────────────────────────
  [
    'restaurants',
    'Noma',
    'single',
    '',
    'Which Copenhagen restaurant is famous for pioneering New Nordic cuisine?',
    'Which restaurant, led by René Redzepi, has topped the World\'s 50 Best Restaurants list four times?',
    'Known for foraging local Scandinavian ingredients and fermenting everything in its test kitchen.',
    'Opened in 2003 in a converted 18th-century warehouse on the Copenhagen waterfront.',
    'medium',
    '',
  ],
  // ── streets — single / hard ─────────────────────────────────────────────
  [
    'streets',
    'Champs-Élysées',
    'single',
    '',
    'Which Parisian avenue connects the Arc de Triomphe to the Place de la Concorde?',
    'On which famous Paris street is the Lido cabaret located?',
    'Often called "the most beautiful avenue in the world"; hosts the Tour de France finale.',
    'Runs 1.9 km through the 8th arrondissement; name translates to "Elysian Fields".',
    'hard',
    '',
  ],
  // ── clothing-brands — single / easy ─────────────────────────────────────
  [
    'clothing-brands',
    'Levi Strauss & Co.',
    'single',
    '',
    'Which American brand invented blue jeans in 1873?',
    'Which clothing brand is famous for its 501 denim jeans?',
    'Co-founded by a Bavarian immigrant who partnered with a Nevada tailor to patent riveted trousers.',
    'Established in San Francisco during the Gold Rush; the iconic red tab appeared in 1936.',
    'easy',
    '',
  ],
  // ── shoe-brands — single / medium ───────────────────────────────────────
  [
    'shoe-brands',
    'Salvatore Ferragamo',
    'single',
    '',
    'Which Italian luxury shoe brand was founded by the "shoemaker to the stars" in 1927?',
    '',
    'Its founder hand-crafted shoes for Hollywood stars including Greta Garbo and Marilyn Monroe.',
    'Based in Florence; founded in Hollywood but moved to Italy in 1927; famous for the wedge heel.',
    'medium',
    '',
  ],
  // ── shoe-brands — multiple / hard ───────────────────────────────────────
  [
    'shoe-brands',
    '',
    'multiple',
    'Nike|Adidas|New Balance|ASICS|Brooks|Saucony|Hoka|On Running',
    'Name 4 athletic running shoe brands.',
    'Can you recall at least 4 brands known primarily for running shoes?',
    'Running shoes have specialized features like drop, stack height, and carbon-fibre plates.',
    'One of these brands was founded in Japan in 1949 under the name Onitsuka Tiger.',
    'hard',
    '',
  ],
  // ── watch-brands — single / medium ──────────────────────────────────────
  [
    'watch-brands',
    'Patek Philippe',
    'single',
    '',
    'Which Swiss watch manufacturer created the Calatrava and Nautilus models?',
    'Which Geneva watchmaker has the slogan "You never actually own a Patek Philippe"?',
    'Founded in 1839; widely regarded as producing the most complicated mechanical watches in the world.',
    'Family-owned since 1932; their ref. 1518 perpetual calendar chronograph sold for a record price in 2016.',
    'medium',
    '',
  ],
  // ── watch-brands — single / hard ────────────────────────────────────────
  [
    'watch-brands',
    'A. Lange & Söhne',
    'single',
    '',
    'Which East German watchmaker was re-founded in Glashütte in 1990 after reunification?',
    '',
    'Known for outsize date displays and movements finished with hand-engraved balance cocks.',
    'Originally founded in 1845; nationalised and dissolved in East Germany; revived with German reunification.',
    'hard',
    '',
  ],
  // ── perfume-brands — single / easy ──────────────────────────────────────
  [
    'perfume-brands',
    'Chanel',
    'single',
    '',
    'Which French fashion house created the fragrance N°5?',
    'Which luxury brand launched the world\'s first abstract perfume in 1921?',
    'The fragrance was reportedly chosen by Coco herself as the fifth sample presented by Ernest Beaux.',
    'N°5 has been described as "the most famous perfume in the world" and has never been discontinued.',
    'easy',
    '',
  ],
  // ── perfume-brands — single / hard ──────────────────────────────────────
  [
    'perfume-brands',
    'Creed',
    'single',
    '',
    'Which perfume house, founded in 1760 in London, is famous for Aventus?',
    '',
    'A family-run maison that has supplied fragrances to European royal courts for centuries.',
    'Aventus, launched in 2010, became one of the most copied and discussed fragrances in the hobby community.',
    'hard',
    '',
  ],
  // ── luxury-brands — single / medium ─────────────────────────────────────
  [
    'luxury-brands',
    'Hermès',
    'single',
    '',
    'Which Parisian luxury house is famous for the Birkin and Kelly handbags?',
    'Which brand produces the iconic orange box and silk scarves called "carrés"?',
    'Founded as a harness workshop in 1837; still family-controlled after six generations.',
    'The Birkin bag originated from a chance conversation on a flight between Jane Birkin and the CEO in 1984.',
    'medium',
    '',
  ],
  // ── luxury-brands — multiple / easy ─────────────────────────────────────
  [
    'luxury-brands',
    '',
    'multiple',
    'Louis Vuitton|Gucci|Prada|Chanel|Hermès|Dior|Burberry|Balenciaga|Versace|Givenchy',
    'Name 5 luxury fashion brands.',
    'Can you recall at least 5 high-end fashion and accessories brands?',
    'These brands are characterised by craftsmanship, heritage, and premium pricing.',
    'Several of these houses are owned by the LVMH conglomerate, the world\'s largest luxury group.',
    'easy',
    '',
  ],
];

export function downloadCsvTemplate(): void {
  const header = toCsvLine([...CSV_COLUMNS]);
  const rows = TEMPLATE_ROWS.map(toCsvLine).join('\n');
  const csv = `${header}\n${rows}\n`;
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'memory-items-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Parser & validator ────────────────────────────────────────────────────

export function parseCsv(
  text: string,
  existingItems: MemoryItem[],
): CsvParseResult {
  const allRows = tokenize(text);

  if (allRows.length === 0) {
    return {
      rows: [],
      missingColumns: [...REQUIRED_COLUMNS],
      unknownColumns: [],
      totalRows: 0,
      validCount: 0,
      invalidCount: 0,
      duplicateCount: 0,
    };
  }

  const headerRow = allRows[0].map(h => h.trim().toLowerCase());
  const dataRows = allRows.slice(1);

  // ── Column analysis ─────────────────────────────────────────────────────
  const knownLower = CSV_COLUMNS.map(c => c.toLowerCase());
  const missingColumns = REQUIRED_COLUMNS.filter(
    col => !headerRow.includes(col.toLowerCase()),
  );
  const unknownColumns = headerRow.filter(
    h => h !== '' && !knownLower.includes(h),
  );

  // Build column index map (case-insensitive)
  const colIndex: Record<CsvColumn, number> = {} as Record<CsvColumn, number>;
  for (const col of CSV_COLUMNS) {
    const idx = headerRow.indexOf(col.toLowerCase());
    colIndex[col] = idx; // -1 means absent
  }

  // Build duplicate key set from existing items using the same three-part key
  // used during per-row validation so lookups stay consistent.
  const existingKeys = new Set(
    existingItems.map(item => {
      const isMultiple = item.answerType === 'multiple';
      const identity = isMultiple
        ? (item.validAnswers?.[0] ?? '').trim().toLowerCase()
        : item.answer.trim().toLowerCase();
      return `${item.categoryId}:${isMultiple ? 'multiple' : 'single'}:${identity}`;
    }),
  );

  // Track keys seen within this import batch to catch intra-batch dupes
  const seenKeys = new Set<string>();

  const getField = (cells: string[], col: CsvColumn): string => {
    const idx = colIndex[col];
    return idx >= 0 && idx < cells.length ? cells[idx].trim() : '';
  };

  let validCount = 0;
  let invalidCount = 0;
  let duplicateCount = 0;

  const rows: ParsedCsvRow[] = [];

  dataRows.forEach((cells, idx) => {
    // Skip entirely empty rows
    if (cells.every(c => c.trim() === '')) return;

    const rowNumber = idx + 2; // +1 for 0-index, +1 for header
    const errors: string[] = [];

    const raw: Record<string, string> = {};
    for (const col of CSV_COLUMNS) {
      raw[col] = getField(cells, col);
    }

    // ── answerType (resolve early — other checks depend on it) ───────────
    const rawAnswerType = raw.answerType || 'single';
    if (raw.answerType && !VALID_ANSWER_TYPES.includes(rawAnswerType as 'single' | 'multiple')) {
      errors.push(`"answerType" must be "single" or "multiple"`);
    }

    // ── Required field presence ───────────────────────────────────────────
    // "answer" is only required for single-answer items; for multiple-answer
    // items the canonical values live in "validAnswers" instead.
    const ALWAYS_REQUIRED: CsvColumn[] = ['categoryId', 'question', 'hint1', 'hint2'];
    for (const col of ALWAYS_REQUIRED) {
      if (!raw[col]) {
        errors.push(`"${col}" is required but empty`);
      }
    }
    if (rawAnswerType !== 'multiple' && !raw.answer) {
      errors.push(`"answer" is required but empty`);
    }

    // ── categoryId validation ─────────────────────────────────────────────
    if (raw.categoryId && !VALID_CATEGORY_IDS.includes(raw.categoryId as CategoryId)) {
      errors.push(
        `"${raw.categoryId}" is not a valid categoryId. Valid values: ${VALID_CATEGORY_IDS.join(', ')}`,
      );
    }

    // ── validAnswers for multiple type ────────────────────────────────────
    if (rawAnswerType === 'multiple') {
      const va = raw.validAnswers
        .split('|')
        .map(s => s.trim())
        .filter(Boolean);
      if (va.length === 0) {
        errors.push(`"validAnswers" is required when answerType is "multiple" (pipe-separated)`);
      }
    }

    // ── difficulty ────────────────────────────────────────────────────────
    const rawDifficulty = raw.difficulty || 'medium';
    if (raw.difficulty && !VALID_DIFFICULTIES.includes(rawDifficulty as 'easy' | 'medium' | 'hard')) {
      errors.push(`"difficulty" must be "easy", "medium", or "hard"`);
    }

    // ── Duplicate detection ───────────────────────────────────────────────
    // For multiple-answer items use the first validAnswer as the identity key
    // so each distinct question set still gets its own slot.
    const identityValue =
      rawAnswerType === 'multiple'
        ? raw.validAnswers.split('|')[0].trim().toLowerCase()
        : raw.answer.trim().toLowerCase();
    const dupKey = `${raw.categoryId}:${rawAnswerType}:${identityValue}`;
    const isDuplicate =
      errors.length === 0 &&
      (existingKeys.has(dupKey) || seenKeys.has(dupKey));

    if (isDuplicate) {
      duplicateCount++;
      const parsedRow: ParsedCsvRow = {
        rowNumber,
        status: 'duplicate',
        errors: ['This item already exists in the library or appeared earlier in this file'],
        raw,
      };
      rows.push(parsedRow);
      return;
    }

    if (errors.length > 0) {
      invalidCount++;
      rows.push({ rowNumber, status: 'invalid', errors, raw });
      return;
    }

    // ── Build MemoryItem (without id) ──────────────────────────────────────
    seenKeys.add(dupKey);

    const additionalQuestions = raw.questions
      .split('|')
      .map(q => q.trim())
      .filter(Boolean);

    const allQuestions = [raw.question, ...additionalQuestions];

    const validAnswers =
      rawAnswerType === 'multiple'
        ? raw.validAnswers.split('|').map(s => s.trim()).filter(Boolean)
        : undefined;

    const item: Omit<MemoryItem, 'id'> = {
      categoryId: raw.categoryId as CategoryId,
      answer: rawAnswerType === 'multiple' ? '' : raw.answer,
      answerType: rawAnswerType as 'single' | 'multiple',
      validAnswers,
      question: allQuestions[0],
      questions: allQuestions.length > 1 ? allQuestions : undefined,
      hints: [raw.hint1, raw.hint2],
      difficulty: rawDifficulty as 'easy' | 'medium' | 'hard',
      answerImageUrl: raw.answerImageUrl || undefined,
      isCustom: true,
    };

    validCount++;
    rows.push({ rowNumber, status: 'valid', errors: [], item, raw });
  });

  return {
    rows,
    missingColumns,
    unknownColumns,
    totalRows: rows.length,
    validCount,
    invalidCount,
    duplicateCount,
  };
}

// ─── Materialise items from parsed rows ───────────────────────────────────

export function buildMemoryItems(validRows: ParsedCsvRow[]): MemoryItem[] {
  return validRows
    .filter(r => r.status === 'valid' && r.item)
    .map(r => ({
      ...(r.item as Omit<MemoryItem, 'id'>),
      id: `csv-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    }));
}
