# Memory Training App - Product Requirements Document

A mobile-first premium dark mode memory training application that helps users improve name recall through conversational practice exercises, progressive hints, and intelligent memory associations. The experience feels immersive, elegant, intelligent, and calming with a modern neuroscience-inspired aesthetic.

**Experience Qualities**:
1. **Immersive & Premium** - Dark layered UI with soft gradients, glows, and elegant typography that feels like a high-end cognitive training platform
2. **Intelligent & Futuristic** - Clean modern aesthetics with subtle sci-fi influences, progress tracking, and data visualization that emphasizes improvement
3. **Calming & Focused** - Generous spacing, smooth animations, muted colors with accent highlights that reduce cognitive load and encourage daily engagement

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-feature application with practice modes, AI-generated associations, searchable database, analytics dashboard, user-generated content, sophisticated spaced repetition algorithms, and goal tracking across multiple interconnected views.

## Essential Features

### Daily Practice Mode with Spaced Repetition
- **Functionality**: Generates conversational memory questions from selected categories using intelligent spaced repetition algorithm that prioritizes failed questions, introduces new content, and reviews previously successful items at optimal intervals
- **Purpose**: Core training experience that simulates real-world name recall situations while optimizing long-term memory retention through scientifically-backed spacing effects
- **Trigger**: User taps "Start Practice" after selecting categories and difficulty level
- **Progression**: Category selection → Question display → "Need a Hint" (optional, up to 2 hints) → "Show Answer" → Memory association reveal → Performance tracking → Next question
- **Success criteria**: Sessions include mix of new (30%), failed (40%), and review questions (30%); failed questions reappear sooner; successful questions space out over multiple sessions; no repetitive consecutive sessions

### Memory Association Engine
- **Functionality**: AI-generated associations using concrete imagery, sounds, rhymes, visual anchors, and story-based connections
- **Purpose**: Helps users build strong mental anchors for difficult-to-remember names
- **Trigger**: Displayed after answer reveal or when browsing items in search module
- **Progression**: Answer revealed → Association explanation appears → Visual imagery suggestion → Optional mnemonic phrase
- **Success criteria**: Associations feel personalized, use concrete imagery, explain why the technique works

### Progressive Hint System
- **Functionality**: Two-level hint system that gradually reveals more information before showing the answer
- **Purpose**: Encourages active recall before giving up, builds memory strength through retrieval practice
- **Trigger**: User taps "Need a Hint" button during practice
- **Progression**: Question → Hint 1 (subtle clue) → Hint 2 (more obvious) → Full answer + association
- **Success criteria**: Hints are contextually relevant, progressively more obvious, don't immediately give away answer

### Searchable Knowledge Library
- **Functionality**: Browse, search, and filter all memory items across categories with images and associations
- **Purpose**: Acts as personal memory reference, allows review without practice pressure
- **Trigger**: User taps "Library" or "Browse" from main navigation
- **Progression**: Library view → Search/filter → Select item → View details with image + association → Mark as favorite or difficult
- **Success criteria**: Fast search, smooth filtering, all items browsable, images display properly

### Category System
- **Functionality**: Organized memory items into Entertainment, Places, Brands categories with extensible architecture
- **Purpose**: Allows focused practice on specific memory challenges user faces
- **Trigger**: User selects categories before starting practice session
- **Progression**: Practice start → Category selector → Multi-select categories → Confirm → Begin questions
- **Success criteria**: Categories display clearly, multi-select works, questions pull from selected categories only

### Progress Dashboard & Performance Tracking
- **Functionality**: Tracks daily streaks, correct recall percentage, difficult items, improvement trends, and per-item performance history with recall strength scoring
- **Purpose**: Motivates daily practice, shows measurable improvement, identifies weak areas, provides insight into memory retention patterns
- **Trigger**: User taps "Progress" or views home dashboard
- **Progression**: View dashboard → See streak counter → Review recent performance → Identify difficult categories → View trends → Analyze item-level performance
- **Success criteria**: Data persists between sessions, calculations accurate, visualizations clear, per-item history tracks attempts/success rate/last seen date

### Custom Memory Items
- **Functionality**: Users add their own items with custom questions, hints, answers, associations, and images
- **Purpose**: Makes app personally relevant to user's real-world memory challenges
- **Trigger**: User taps "Add Item" from library or settings
- **Progression**: Tap add → Select category → Enter question → Add hints → Provide answer → Generate/write association → Optional image upload → Save
- **Success criteria**: Custom items appear in practice and library, persist across sessions, support all features

### Image Support System
- **Functionality**: Display images throughout question, hint, answer, and library views for visual memory reinforcement
- **Purpose**: Leverages visual memory which is stronger than verbal memory alone
- **Trigger**: Images appear automatically when available for current item
- **Progression**: Question appears → Image shows (if available) → Hints may reference image → Answer shows with image → Association uses image context
- **Success criteria**: Images load quickly, display responsively, enhance rather than distract from recall

### Spaced Repetition Algorithm
- **Functionality**: Intelligent question selection system that analyzes user performance history to optimize memory retention through properly-timed repetition intervals
- **Purpose**: Maximizes long-term retention by presenting questions at scientifically optimal intervals based on individual performance
- **Trigger**: Automatically runs when user starts any practice session
- **Progression**: Session start → Analyze item history → Calculate recall strength per item → Prioritize failed questions → Include new questions → Add review questions due for reinforcement → Shuffle and present
- **Success criteria**: Failed questions (recall strength <40%) appear in next 1-2 sessions; Medium-confidence questions (40-70%) repeat after 2+ sessions; Strong questions (70+) repeat after 3+ sessions; Each session includes 3-5 new questions; Sessions feel varied without excessive repetition

## Edge Case Handling

- **No Categories Selected** - Disable practice start button with helpful message to select at least one category
- **Empty Category** - Show "No items yet" state with option to add custom items or browse other categories
- **Failed Image Load** - Gracefully fallback to placeholder or text-only view without breaking layout
- **Streak Break** - Show encouraging message about starting fresh, don't punish user
- **No Hints Available** - Skip hint buttons, go directly to answer reveal option
- **Offline Mode** - Cache recently practiced items, sync when connection restored
- **First Time User** - Show quick onboarding explaining practice flow and hint system
- **Perfect Recall Session** - Celebrate with special animation or message

## Design Direction

The design should evoke immersion, intelligence, and premium quality - like entering a personalized cognitive training lab. The interface should feel elegant and spacious to reduce cognitive load, with soft glowing accents that guide attention. The aesthetic balances serious neuroscience-backed training with calming, approachable design that encourages daily habit formation.

## Color Selection

A premium dark mode palette inspired by modern cognitive training and neuroscience applications, emphasizing depth, focus, and mental clarity.

- **Primary Color**: Deep Indigo Blue (oklch(0.60 0.20 250)) - Represents cognitive depth, memory, and neural activity
- **Primary Bright**: Brighter Indigo (oklch(0.70 0.25 250)) - Used for gradients and emphasis moments
- **Secondary Colors**: 
  - Dark Navy Surface (oklch(0.20 0.025 250)) - Main card backgrounds for layered depth
  - Elevated Surface (oklch(0.24 0.025 250)) - Raised cards and interactive elements
  - Deep Background (oklch(0.15 0.02 250)) - Base app background, creates depth
- **Accent Color**: Bright Cyan (oklch(0.65 0.22 220)) - Electric mental clarity, used for CTAs, success states, and active elements
- **Supporting Colors**:
  - Success Green (oklch(0.65 0.18 155)) - Correct answers, achievements
  - Destructive Red (oklch(0.55 0.22 25)) - Warnings, errors
  - Muted Gray (oklch(0.30 0.02 250)) - Disabled states, subtle backgrounds

**Foreground/Background Pairings**:
  - Background (Dark Navy): White text (oklch(0.98 0 0)) - Ratio 14.2:1 ✓
  - Card (Dark Surface): White text (oklch(0.98 0 0)) - Ratio 12.8:1 ✓
  - Primary (Deep Indigo): White text (oklch(1 0 0)) - Ratio 5.8:1 ✓
  - Accent (Bright Cyan): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓

## Font Selection

Typography conveys modern sophistication and premium quality while maintaining exceptional readability for cognitive training.

- **Primary Font**: Outfit - Modern geometric sans-serif with excellent legibility, confident and contemporary feel
- **Secondary Font**: Inter - Clean technical precision for data, labels, and UI elements

**Typographic Hierarchy**:
- H1 (Screen Titles): Outfit Extrabold / 48px / extra-tight tracking (-0.02em) / white
- H2 (Section Headers): Outfit Bold / 32px / tight tracking (-0.02em) / white
- H3 (Card Titles): Outfit Bold / 20px / normal tracking / white
- Question Text: Outfit Semibold / 18px / relaxed line-height (1.6) / white
- Body Text: Inter Regular / 16px / generous line-height (1.7) / muted white
- UI Labels: Inter Semibold / 12px / wide tracking (0.05em) / uppercase / muted
- Micro Labels: Inter Medium / 10px / wide tracking (0.08em) / uppercase / muted

## Animations

Animations emphasize premium quality and cognitive moments with smooth, purposeful motion. Screen transitions use 300-400ms ease-out curves. Interactive elements scale subtly (1.0 → 1.05) with soft glow effects on hover. Navigation tabs animate smoothly with color shifts and micro-movements. Cards fade in with gentle upward translation on load. Success states deserve satisfying feedback with scale pulses and glow intensification. All motion maintains a calm, sophisticated feel - responsive but never distracting from cognitive focus.

## Component Selection

**Components**:
- **Cards** (shadcn Card) - Large rounded (rounded-2xl) containers with elevated shadows and subtle glows for depth
- **Buttons** (shadcn Button) - Large pill-shaped (rounded-full) touch targets (56px+ height) with gradient fills for primary actions
- **Dialog** (shadcn Dialog) - Full-screen mobile modals with backdrop blur for settings, category selection, item details
- **Progress** (shadcn Progress) - Smooth animated progress bars with glowing accent fills for session tracking
- **Tabs** (shadcn Tabs) - Minimal bottom navigation with icon + label, smooth active state transitions
- **Input** (shadcn Input) - Large rounded inputs with subtle borders, focus states with accent glow rings
- **Badge** (shadcn Badge) - Small rounded pills for tags, difficulty indicators with soft color fills
- **Avatar** (shadcn Avatar) - Circular image containers with subtle border glows
- **Select** (shadcn Select) - Dropdown for category filtering with smooth animations

**Customizations**:
- Custom GradientButton component with dual-color gradients and glow shadow effects
- Custom StatCard component with large numbers, micro-labels, and background patterns
- Custom SessionCard component with elevated appearance and smooth hover states
- Custom ProgressRing component for circular progress indicators with gradient strokes
- Custom FloatingActionButton component (large circular) with gradient and glow for primary actions

**States**:
- Buttons: default (gradient), hover (scale 1.05 + glow), active (scale 0.95), disabled (opacity 0.5)
- Cards: default (subtle shadow), hover (elevated shadow + subtle scale), active (border glow)
- Navigation: inactive (muted), active (accent color + translate-up animation + scale 1.05)
- Inputs: default (border), focus (accent glow ring + border highlight), filled (subtle background change)

**Icon Selection** (Phosphor Icons):
- Brain - Practice/Training mode (primary action)
- Books - Library/Browse content
- ChartLine - Progress/Analytics dashboard
- Target - Goals and achievements
- Lightbulb - Hints and suggestions
- Plus - Add custom content
- MagnifyingGlass - Search functionality
- Fire - Streak counter and consistency

**Spacing**:
- Card padding: p-6 (24px) minimum, generous internal spacing
- Screen margins: px-5 (20px) on mobile for comfortable edge spacing
- Section gaps: gap-6 (24px) between major sections for clear separation
- Card gaps: gap-4 (16px) in card grids
- Large vertical spacing: py-8 (32px) between screen sections

**Mobile**:
- Mobile-first vertical scrolling layouts
- Bottom navigation bar (fixed, backdrop blur, 80px height) with 4 main sections
- Large circular primary action button (208px diameter) for starting sessions
- Full-width cards (max-w-2xl centered) with generous spacing
- Large touch targets (56px+ minimum)
- Single column layouts throughout
- Smooth scroll behavior with snap points where appropriate
- Responsive images: full-width on mobile, max 600px centered on desktop
