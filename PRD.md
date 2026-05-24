# Memory Training App - Product Requirements Document

A mobile-first memory training application that helps users improve name recall through conversational practice exercises, progressive hints, and intelligent memory associations.

**Experience Qualities**:
1. **Conversational** - Questions feel natural like real-world recall situations, not mechanical flashcards
2. **Progressive** - Hints build gradually, associations strengthen naturally, difficulty adapts to user performance
3. **Visual** - Strong image-based memory anchors, clean interface with bold visual hierarchy

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-feature application with practice modes, AI-generated associations, searchable database, analytics dashboard, user-generated content, and sophisticated state management across multiple interconnected views.

## Essential Features

### Daily Practice Mode
- **Functionality**: Generates random conversational memory questions from selected categories with progressive hint system
- **Purpose**: Core training experience that simulates real-world name recall situations
- **Trigger**: User taps "Start Practice" after selecting categories
- **Progression**: Category selection → Question display → "Need a Hint" (optional, up to 2 hints) → "Show Answer" → Memory association reveal → Performance tracking → Next question
- **Success criteria**: Users can complete practice sessions, hints progressively reveal information, answers show memory associations

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

### Progress Dashboard
- **Functionality**: Tracks daily streaks, correct recall percentage, difficult items, improvement trends
- **Purpose**: Motivates daily practice, shows measurable improvement, identifies weak areas
- **Trigger**: User taps "Progress" or views home dashboard
- **Progression**: View dashboard → See streak counter → Review recent performance → Identify difficult categories → View trends
- **Success criteria**: Data persists between sessions, calculations accurate, visualizations clear

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

The design should evoke focus, confidence, and mental clarity - like entering a personal training gym for your brain. The interface should feel clean and uncluttered to avoid cognitive overload, with bold visual moments during success states. The aesthetic should balance serious cognitive training with encouraging, approachable warmth.

## Color Selection

A focused cognitive training palette emphasizing clarity, memory, and mental energy.

- **Primary Color**: Deep Indigo (oklch(0.45 0.15 275)) - Represents memory, focus, and cognitive depth
- **Secondary Colors**: 
  - Soft Lavender (oklch(0.82 0.08 285)) - Calming background for practice sessions
  - Neural Slate (oklch(0.35 0.02 260)) - Grounding color for secondary UI elements
- **Accent Color**: Bright Cyan (oklch(0.75 0.15 195)) - Electric mental clarity, used for correct answers and achievements
- **Background**: Warm Off-White (oklch(0.97 0.01 90)) - Reduces eye strain, warmer than pure white
- **Foreground/Background Pairings**:
  - Primary (Deep Indigo): White text (oklch(1 0 0)) - Ratio 7.8:1 ✓
  - Accent (Bright Cyan): Black text (oklch(0.2 0 0)) - Ratio 9.2:1 ✓
  - Background (Warm Off-White): Neural Slate text (oklch(0.35 0.02 260)) - Ratio 8.5:1 ✓
  - Secondary (Soft Lavender): Deep Indigo text (oklch(0.45 0.15 275)) - Ratio 5.1:1 ✓

## Font Selection

Typography should convey modern clarity and cognitive precision while remaining highly readable during practice sessions.

- **Primary Font**: Space Grotesk - Technical precision with friendly approachability, excellent for UI labels and questions
- **Secondary Font**: Newsreader - Editorial elegance for memory associations and explanatory text, creates strong typographic contrast

**Typographic Hierarchy**:
- H1 (Screen Titles): Space Grotesk Bold / 32px / tight tracking (-0.02em)
- H2 (Category Headers): Space Grotesk Semibold / 24px / normal tracking
- H3 (Item Names): Space Grotesk Medium / 20px / normal tracking
- Question Text: Space Grotesk Medium / 20px / relaxed line-height (1.6)
- Body (Associations): Newsreader Regular / 17px / generous line-height (1.7)
- UI Labels: Space Grotesk Medium / 14px / slight tracking (0.01em)
- Caption: Space Grotesk Regular / 13px / muted color

## Animations

Animations should reinforce cognitive moments - the "aha!" of recall, the progression through hints, the satisfaction of correct answers. Use smooth, physics-based motion for screen transitions (300ms ease-out). Subtle scale transforms (1.0 → 1.02) on card interactions provide tactile feedback. Hint reveals should slide in with gentle bounce (spring physics). Correct answer celebrations deserve a quick confetti burst or scale pulse. Keep practice session animations minimal to maintain focus, but celebrate achievements boldly.

## Component Selection

**Components**:
- **Cards** (shadcn Card) - Primary container for questions, answers, memory items with elevated shadows for depth
- **Buttons** (shadcn Button) - Large touch targets (min 56px height) with primary variant for main actions, outline for hints
- **Dialog** (shadcn Dialog) - Category selection, settings, item details as full-screen mobile overlays
- **Progress** (shadcn Progress) - Session completion, daily goal tracking with accent color fills
- **Tabs** (shadcn Tabs) - Switch between practice types, library views, dashboard sections
- **Input** (shadcn Input) - Search in library, custom item creation with clear focus states
- **Badge** (shadcn Badge) - Category tags, difficulty indicators with color coding
- **Avatar** (shadcn Avatar) - Actor photos, user profile images with circular crops
- **Accordion** (shadcn Accordion) - Expandable hint sections, FAQ in settings
- **Toast** (Sonner) - Success feedback, streak notifications, error messages

**Customizations**:
- Custom PracticeCard component wrapping Card with flip animation for answer reveals
- Custom HintButton component with pulse animation when hints are available
- Custom StreakCounter component with flame icon and animated number increment
- Custom AssociationPanel component using Newsreader font with visual imagery emphasis
- Custom ImagePlaceholder for graceful loading states

**States**:
- Buttons: default, hover (lift shadow), active (scale 0.98), disabled (reduced opacity 0.5)
- Cards: neutral, correct (green border pulse), incorrect (shake animation), revealed (flip transition)
- Inputs: default border, focus (accent ring), filled (subtle background), error (destructive border)
- Hints: locked (gray), available (pulse), revealed (accent background)

**Icon Selection**:
- Brain (phosphor) - Practice mode
- Books (phosphor) - Library/Browse
- TrendUp (phosphor) - Progress/Analytics
- Lightbulb (phosphor) - Hints
- Plus (phosphor) - Add custom items
- MagnifyingGlass (phosphor) - Search
- Fire (phosphor) - Streak counter
- Star (phosphor) - Favorites
- Warning (phosphor) - Difficult items

**Spacing**:
- Card padding: p-6 (24px) on mobile, p-8 (32px) on desktop
- Section gaps: gap-4 (16px) for related items, gap-8 (32px) between major sections
- Button spacing: gap-3 (12px) between button groups
- Screen padding: px-4 (16px) on mobile, px-8 (32px) on tablet+
- Vertical rhythm: space-y-6 for stacked content sections

**Mobile**:
- Single column layout throughout
- Bottom navigation bar (fixed) with 4 main sections: Practice, Library, Progress, Settings
- Full-width cards with comfortable touch targets (56px min height)
- Large typography (18px+ for primary content)
- Swipe gestures: swipe left to skip, swipe up for hint, tap to reveal
- Collapsible navigation on desktop to maximize practice space
- Responsive images: full-width on mobile, max 600px centered on desktop
