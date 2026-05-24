import { Category, MemoryItem } from './types';

export const categories: Category[] = [
  {
    id: 'actors',
    name: 'Actors & Actresses',
    group: 'entertainment',
    icon: 'user',
    color: 'oklch(0.65 0.20 330)'
  },
  {
    id: 'movies',
    name: 'Movies',
    group: 'entertainment',
    icon: 'film',
    color: 'oklch(0.60 0.22 20)'
  },
  {
    id: 'musicians',
    name: 'Musicians',
    group: 'entertainment',
    icon: 'music-notes',
    color: 'oklch(0.68 0.20 280)'
  },
  {
    id: 'songs',
    name: 'Songs',
    group: 'entertainment',
    icon: 'microphone',
    color: 'oklch(0.70 0.18 140)'
  },
  {
    id: 'albums',
    name: 'Albums',
    group: 'entertainment',
    icon: 'disc',
    color: 'oklch(0.62 0.24 50)'
  },
  {
    id: 'cities',
    name: 'Cities',
    group: 'places',
    icon: 'buildings',
    color: 'oklch(0.55 0.18 240)'
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    group: 'places',
    icon: 'fork-knife',
    color: 'oklch(0.70 0.22 80)'
  },
  {
    id: 'streets',
    name: 'Streets',
    group: 'places',
    icon: 'signpost',
    color: 'oklch(0.58 0.15 220)'
  },
  {
    id: 'clothing-brands',
    name: 'Clothing Brands',
    group: 'brands',
    icon: 't-shirt',
    color: 'oklch(0.65 0.20 160)'
  },
  {
    id: 'shoe-brands',
    name: 'Shoe Brands',
    group: 'brands',
    icon: 'sneaker',
    color: 'oklch(0.60 0.22 200)'
  },
  {
    id: 'watch-brands',
    name: 'Watch Brands',
    group: 'brands',
    icon: 'watch',
    color: 'oklch(0.50 0.18 260)'
  },
  {
    id: 'perfume-brands',
    name: 'Perfume Brands',
    group: 'brands',
    icon: 'drop',
    color: 'oklch(0.72 0.18 320)'
  },
  {
    id: 'luxury-brands',
    name: 'Luxury Brands',
    group: 'brands',
    icon: 'diamond',
    color: 'oklch(0.58 0.20 40)'
  }
];

export const sampleMemoryItems: MemoryItem[] = [
  {
    id: '1',
    categoryId: 'musicians',
    question: "What's the name of the guitarist from Pearl Jam whose name sounds like a physical object?",
    answer: 'Stone Gossard',
    hints: [
      "Think of something hard you might find on the ground",
      "The first name is a rock or pebble, the last name sounds like 'gossip' + 'yard'"
    ],
    association: {
      technique: 'Concrete Object Association',
      explanation: "The brain remembers concrete, tangible objects far better than abstract names. 'Stone' is a physical thing you can visualize and touch.",
      imagery: "Picture a giant smooth stone sitting on stage, shredding an electric guitar with Pearl Jam's logo on it. The stone is gossiping to the crowd between solos.",
      mnemonic: "A STONE that GOSSips in a yARD while playing guitar"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '2',
    categoryId: 'movies',
    question: "What's the movie where Leonardo DiCaprio goes inside people's dreams to plant ideas?",
    answer: 'Inception',
    hints: [
      "The title relates to the beginning of something",
      "It's a word that means the establishment or starting point of something"
    ],
    association: {
      technique: 'Semantic Connection',
      explanation: "The word 'inception' literally means 'the beginning.' The movie is about planting the inception of an idea in someone's mind.",
      imagery: "Visualize Leo DiCaprio literally diving INTO someone's head (inception = going IN). Picture him as an architect drawing the first line of a blueprint inside a glowing brain.",
      mnemonic: "DiCaprio goes IN to plant the INCEPTION"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '3',
    categoryId: 'musicians',
    question: "What's the name of the band with vegetables that are red, hot, and spicy?",
    answer: 'Red Hot Chili Peppers',
    hints: [
      "Think of the hottest peppers you can eat",
      "They're red, they're extremely hot, and they're a type of chili"
    ],
    association: {
      technique: 'Literal Visualization',
      explanation: "Converting abstract band names into literal, absurd visual scenes makes them unforgettable.",
      imagery: "Picture giant red chili peppers on fire, playing guitars and drums on stage. They're literally steaming hot, and the audience is sweating from the heat and the spicy aroma.",
      mnemonic: "Imagine burning hot peppers performing music"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '4',
    categoryId: 'albums',
    question: "What's the famous Nirvana album with a baby swimming underwater on the cover?",
    answer: 'Nevermind',
    hints: [
      "The title is a casual response you'd give when someone asks you to repeat something",
      "It's what you say when you decide something isn't worth explaining"
    ],
    association: {
      technique: 'Emotional + Visual Connection',
      explanation: "The album's dismissive title 'Nevermind' paired with the innocent image of a baby creates a powerful contrast that's easy to remember.",
      imagery: "Picture the baby reaching for a dollar bill underwater, but Kurt Cobain is above the water saying 'Nevermind' and pulling the money away. The baby's expression says 'nevermind, I don't care anyway.'",
      mnemonic: "Baby says NEVERMIND to the money"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '5',
    categoryId: 'actors',
    question: "Who's the British actor known for playing both a wizard headmaster and a mutant mentor?",
    answer: 'Ian McKellen',
    hints: [
      "His first name rhymes with 'man'",
      "He played Gandalf and Magneto"
    ],
    association: {
      technique: 'Role Association',
      explanation: "Connecting an actor's name to their iconic roles creates a strong neural pathway.",
      imagery: "Picture a wizard (Gandalf) and Magneto standing back-to-back. Between them is a sign that says 'IAN McKELLEN - Master of Magic.' Imagine him saying 'I CAN, Mc-KELLEN do magic!'",
      mnemonic: "I-CAN Mc-KELLEN cast spells and control metal"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '6',
    categoryId: 'cities',
    question: "What's the city in Japan famous for thousands of red torii gates on a mountain?",
    answer: 'Kyoto',
    hints: [
      "It's a two-syllable city name that starts with 'K'",
      "It was the ancient capital of Japan"
    ],
    association: {
      technique: 'Sound + Visual Imagery',
      explanation: "'Kyoto' sounds like 'key to' - imagine the red gates are the KEY TO entering the sacred mountain.",
      imagery: "Visualize a giant golden key unlocking the first red torii gate in Kyoto. As the gate opens, thousands more gates appear behind it, creating a red pathway up the mountain. The key has 'KYOTO' engraved on it.",
      mnemonic: "The red gates are the KEY TO (Kyoto) the sacred mountain"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '7',
    categoryId: 'luxury-brands',
    question: "What's the Italian luxury brand with a prancing horse logo?",
    answer: 'Ferrari',
    hints: [
      "The name starts with 'F' and is associated with supercars",
      "It's named after its founder Enzo _____"
    ],
    association: {
      technique: 'Animal + Sound Association',
      explanation: "The prancing horse logo is iconic. 'Ferrari' sounds fast, like a horse running at high speed.",
      imagery: "Picture a black prancing stallion on a yellow shield, making a 'FERR-RRRR-RI' engine roar sound as it gallops. The horse's hooves spark on Italian cobblestones. The sound matches the name.",
      mnemonic: "The horse FERRs (purrs) with a RARI (rare) roar"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '8',
    categoryId: 'movies',
    question: "What's the Spielberg movie about a friendly alien who wants to phone home?",
    answer: 'E.T. the Extra-Terrestrial',
    hints: [
      "The title is abbreviated to two letters",
      "E.T. stands for Extra-Terrestrial"
    ],
    association: {
      technique: 'Acronym + Catchphrase',
      explanation: "The acronym E.T. is easier to remember because it matches the character's famous phrase 'E.T. phone home.'",
      imagery: "Visualize a glowing-fingered alien holding an old telephone with a long cord stretching up to space. The phone's keypad spells out 'E.T.' in big letters. He's pressing the buttons saying 'Extra-Terrestrial phone home.'",
      mnemonic: "E.T. = Extra-Terrestrial = phone home"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '9',
    categoryId: 'songs',
    question: "What's the Queen song with Galileo's name repeated in the opera section?",
    answer: 'Bohemian Rhapsody',
    hints: [
      "The title has two words, both starting with 'B' and 'R'",
      "It's one of the most famous rock songs ever, over 6 minutes long"
    ],
    association: {
      technique: 'Musical Structure Memory',
      explanation: "The song's unique operatic structure makes it unforgettable. 'Bohemian' = free-spirited, 'Rhapsody' = emotional musical piece.",
      imagery: "Picture Freddie Mercury dressed as a Bohemian wanderer with flowing clothes, conducting a full orchestra while singing opera. Behind him, Galileo's portrait appears every time his name is sung. The scene shifts between rock, opera, and ballad like a rhapsody.",
      mnemonic: "A BOHEMIAN wanderer performs an emotional RHAPSODY with Galileo"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '10',
    categoryId: 'watch-brands',
    question: "What's the Swiss luxury watch brand with a crown logo?",
    answer: 'Rolex',
    hints: [
      "It's a five-letter name starting with 'R'",
      "It's one of the most recognized luxury watch brands in the world"
    ],
    association: {
      technique: 'Symbol + Status Association',
      explanation: "The crown logo represents royalty and prestige. 'Rolex' sounds like 'royal' and 'excellence' combined.",
      imagery: "Picture a golden crown sitting on top of a luxury watch. The crown's jewels spell out 'ROLEX.' The watch is being worn by royalty, and every time they check the time, the crown glows. RO(yal) + LEX(ury).",
      mnemonic: "ROyal + excelLEX = ROLEX with a crown"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '11',
    categoryId: 'actors',
    question: "Who's the actor famous for playing a boxer named Rocky and an action hero named Rambo?",
    answer: 'Sylvester Stallone',
    hints: [
      "His first name is shared with a cartoon cat",
      "His last name sounds like an Italian mobster name"
    ],
    association: {
      technique: 'Character + Name Fusion',
      explanation: "Both 'Rocky' and 'Rambo' start with 'R,' just like his nickname 'Sly.' His full name has a tough, Italian sound matching his roles.",
      imagery: "Picture Sylvester the cat from Looney Tunes wearing boxing gloves and a bandana, punching a giant stone (stallion statue). SYL-vester STAL-lone - the cat becomes a tough Italian stallion. The stallion runs up the Rocky steps.",
      mnemonic: "SLY cat becomes an Italian STALLion (Stallone)"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '12',
    categoryId: 'restaurants',
    question: "What's the name of the famous sushi restaurant in Ginza that has three Michelin stars?",
    answer: 'Sukiyabashi Jiro',
    hints: [
      "It's named after the master chef Jiro",
      "There's a famous documentary about this restaurant called 'Jiro Dreams of Sushi'"
    ],
    association: {
      technique: 'Documentary + Place Memory',
      explanation: "The documentary title creates a strong association. Breaking down 'Sukiyabashi' = Sukiya Bridge, where the restaurant is located.",
      imagery: "Picture an elderly sushi master named Jiro standing on a bridge made of sushi rolls. He's daydreaming (with thought bubbles) about perfect sushi. The bridge sign says 'SUKIYABASHI' and he's holding a plate labeled 'JIRO.' The bridge crosses over to his restaurant.",
      mnemonic: "JIRO dreams of sushi on SUKIYABASHI bridge"
    },
    isCustom: false,
    difficulty: 'hard'
  }
];
