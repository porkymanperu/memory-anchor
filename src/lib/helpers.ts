import { MemoryItem, CategoryId, PracticeSession, UserProgress } from './types';
import { User, FilmReel, MusicNotes, Microphone, Disc, Buildings, ForkKnife, Signpost, TShirt, Sneaker, Watch, Drop, Diamond } from '@phosphor-icons/react';

const iconMap = {
  'user': User,
  'film': FilmReel,
  'music-notes': MusicNotes,
  'microphone': Microphone,
  'disc': Disc,
  'buildings': Buildings,
  'fork-knife': ForkKnife,
  'signpost': Signpost,
  't-shirt': TShirt,
  'sneaker': Sneaker,
  'watch': Watch,
  'drop': Drop,
  'diamond': Diamond,
};

export function getCategoryIcon(iconName: string) {
  return iconMap[iconName as keyof typeof iconMap] || User;
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getRandomQuestion(item: MemoryItem): string {
  if (item.questions && item.questions.length > 0) {
    const randomIndex = Math.floor(Math.random() * item.questions.length);
    return item.questions[randomIndex];
  }
  return item.question;
}

export function getItemsByCategories(
  items: MemoryItem[],
  categoryIds: CategoryId[]
): MemoryItem[] {
  return items.filter(item => categoryIds.includes(item.categoryId));
}

export function calculateAccuracy(progress: UserProgress): number {
  if (progress.totalQuestionsAnswered === 0) return 0;
  return Math.round((progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100);
}

export function isStreakActive(lastPracticeDate: string): boolean {
  if (!lastPracticeDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastPractice = new Date(lastPracticeDate);
  lastPractice.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysDiff <= 1;
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  
  if (progress.lastPracticeDate === today) {
    return progress;
  }
  
  const streakActive = isStreakActive(progress.lastPracticeDate);
  
  return {
    ...progress,
    currentStreak: streakActive ? progress.currentStreak + 1 : 1,
    longestStreak: Math.max(
      progress.longestStreak,
      streakActive ? progress.currentStreak + 1 : 1
    ),
    lastPracticeDate: today
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Yesterday';
  if (daysDiff < 7) return `${daysDiff} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function generateMemoryAssociation(item: MemoryItem): Promise<any> {
  const promptText = `You are a memory association expert helping people remember names, places, and information using cognitive science techniques.

Given this memory item:
- Answer: ${item.answer}
- Question: ${item.question}
- Category: ${item.categoryId}

Generate a powerful memory association using ONE of these techniques:
1. Concrete Object Association - Convert abstract names into tangible, physical objects
2. Sound Association - Use rhymes, alliteration, or similar-sounding words
3. Visual Imagery - Create vivid, unusual, or exaggerated mental images
4. Story-Based Connection - Create a short memorable narrative
5. Emotional Connection - Link to feelings or personal experiences

Return a JSON object with this structure:
{
  "technique": "Name of the technique used",
  "explanation": "Brief explanation of why this helps memory (1-2 sentences)",
  "imagery": "Vivid description of what to visualize or imagine (2-3 sentences)",
  "mnemonic": "Optional short mnemonic phrase or memory trick"
}

Make it creative, memorable, and tailored to the specific name or item.`;

  try {
    const response = await window.spark.llm(promptText, 'gpt-4o-mini', true);
    const result = JSON.parse(response);
    return result;
  } catch (error) {
    return {
      technique: 'Visual Association',
      explanation: 'Creating a mental image helps anchor this memory.',
      imagery: `Imagine ${item.answer} in a memorable context related to: ${item.question}`,
      mnemonic: ''
    };
  }
}

export async function generateHints(item: MemoryItem): Promise<[string, string]> {
  const promptText = `You are helping create progressive hints for a memory training app.

Given this memory item:
- Question: ${item.question}
- Answer: ${item.answer}
- Category: ${item.categoryId}

Generate exactly 2 progressive hints:
- Hint 1: Subtle clue that points toward the answer without giving it away
- Hint 2: More obvious clue that makes the answer easier to guess

Return as a JSON object with a "hints" property containing exactly 2 hints in an array:
{
  "hints": ["hint 1 text here", "hint 2 text here"]
}`;

  try {
    const response = await window.spark.llm(promptText, 'gpt-4o-mini', true);
    const result = JSON.parse(response);
    return result.hints as [string, string];
  } catch (error) {
    return [
      'Think about the key words in the question',
      `The answer starts with "${item.answer.charAt(0)}"`
    ];
  }
}

export async function generateQuestion(answer: string, categoryId: CategoryId): Promise<string> {
  const promptText = `You are creating conversational memory questions for a name recall training app.

Generate a natural, conversational question that would help someone recall this answer:
- Answer: ${answer}
- Category: ${categoryId}

The question should:
- Sound like something a friend would ask in real conversation
- Not directly state the answer
- Provide context clues that trigger memory
- Be engaging and natural

Return ONLY the question text, nothing else.`;

  try {
    const response = await window.spark.llm(promptText, 'gpt-4o-mini', false);
    return response.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    return `What is the name related to ${answer}?`;
  }
}
