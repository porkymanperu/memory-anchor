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
    categoryId: 'actors',
    question: "Who played Gandalf and Magneto?",
    questions: ["Who played Gandalf and Magneto?", "Which British knight starred in Lord of the Rings?"],
    answer: 'Ian McKellen',
    hints: ["First name rhymes with 'man'", "He played two iconic wizards"],
    association: {
      technique: 'Role Association',
      explanation: "Connect the actor to iconic roles.",
      imagery: "Picture Gandalf and Magneto back-to-back with 'IAN McKELLEN' between them.",
      mnemonic: "I-CAN Mc-KELLEN cast spells"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '2',
    categoryId: 'actors',
    question: "Who played Rocky and Rambo?",
    questions: ["Who played Rocky Balboa?", "Which actor starred in First Blood?"],
    answer: 'Sylvester Stallone',
    hints: ["First name is a cartoon cat", "Last name sounds like Italian stallion"],
    association: {
      technique: 'Character Fusion',
      explanation: "Both roles start with R.",
      imagery: "Sylvester the cat as a stallion in boxing gloves.",
      mnemonic: "SLY STALLion"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '3',
    categoryId: 'actors',
    question: "Who played the Joker and died before The Dark Knight premiered?",
    questions: ["Who won a posthumous Oscar for playing the Joker?"],
    answer: 'Heath Ledger',
    hints: ["First name is a type of landscape", "Last name is an accounting book"],
    association: {
      technique: 'Name Components',
      explanation: "Heath (moorland) + Ledger (book).",
      imagery: "Joker on a heath writing in a ledger.",
      mnemonic: "LEDGER on the HEATH"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '4',
    categoryId: 'actors',
    question: "Who played Hermione in Harry Potter?",
    questions: ["Who starred as Hermione Granger?", "Which actress played Belle in Beauty and the Beast (2017)?"],
    answer: 'Emma Watson',
    hints: ["First name is Emma", "Last name is Sherlock's sidekick"],
    association: {
      technique: 'Character Connection',
      explanation: "Watson like Sherlock's friend.",
      imagery: "Hermione waving wand at Dr. Watson.",
      mnemonic: "EMMA the clever WATSON"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '5',
    categoryId: 'actors',
    question: "Who starred in Kill Bill and Pulp Fiction?",
    questions: ["Who played The Bride?", "Which actress is Tarantino's muse?"],
    answer: 'Uma Thurman',
    hints: ["First name is three letters", "Last name sounds like 'Thursday man'"],
    association: {
      technique: 'Sound Association',
      explanation: "Uma sounds like umami.",
      imagery: "Yellow-suited Bride thirsty on Thursday.",
      mnemonic: "UMA on THURsday"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '6',
    categoryId: 'actors',
    question: "Who played Jack in Titanic?",
    questions: ["Who won an Oscar for The Revenant?", "Who starred in Inception?"],
    answer: 'Leonardo DiCaprio',
    hints: ["First name is a Renaissance artist", "Italian last name"],
    association: {
      technique: 'Famous Name',
      explanation: "Leonardo like da Vinci.",
      imagery: "Da Vinci painting Jack on Titanic.",
      mnemonic: "LEONARDO like da Vinci"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '7',
    categoryId: 'actors',
    question: "Who played Iron Man?",
    questions: ["Who starred as Tony Stark?", "Who played Sherlock Holmes in Guy Ritchie films?"],
    answer: 'Robert Downey Jr.',
    hints: ["Nicknamed RDJ", "Last name means soft and fluffy"],
    association: {
      technique: 'Character Fusion',
      explanation: "RDJ = Robert Downey Jr.",
      imagery: "Iron Man suit made of downy feathers.",
      mnemonic: "ROBERT DOWNY JR."
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '8',
    categoryId: 'actors',
    question: "Who starred in La La Land?",
    questions: ["Who played Mia in La La Land?", "Who played Gwen Stacy?"],
    answer: 'Emma Stone',
    hints: ["First name is Emma", "Last name is a rock"],
    association: {
      technique: 'Concrete Object',
      explanation: "Stone is tangible.",
      imagery: "Emma dancing on a giant stone.",
      mnemonic: "EMMA on a STONE"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '9',
    categoryId: 'musicians',
    question: "Who is the Pearl Jam guitarist with a rock name?",
    questions: ["Which Pearl Jam member is named after a rock?"],
    answer: 'Stone Gossard',
    hints: ["First name is a rock", "Last name sounds like gossip yard"],
    association: {
      technique: 'Concrete Object',
      explanation: "Stone is tangible.",
      imagery: "A stone gossiping while playing guitar.",
      mnemonic: "STONE GOSSips"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '10',
    categoryId: 'musicians',
    question: "Which band is named after hot peppers?",
    questions: ["Who sang Californication?", "Which funk rock band has Flea?"],
    answer: 'Red Hot Chili Peppers',
    hints: ["They're red and hot", "Named after spicy vegetables"],
    association: {
      technique: 'Literal Visualization',
      explanation: "Visualize the name literally.",
      imagery: "Red chili peppers on fire playing music.",
      mnemonic: "Hot peppers performing"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '11',
    categoryId: 'musicians',
    question: "Who is the Queen of Pop?",
    questions: ["Who sang Like a Virgin?", "Who performed at the Super Bowl with Britney and Christina?"],
    answer: 'Madonna',
    hints: ["Same name as Virgin Mary", "One-word stage name"],
    association: {
      technique: 'Religious Connection',
      explanation: "Madonna = Mary.",
      imagery: "Pop star with religious iconography.",
      mnemonic: "Queen MADONNA"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '12',
    categoryId: 'musicians',
    question: "Who is the King of Pop?",
    questions: ["Who did the moonwalk?", "Who sang Thriller?"],
    answer: 'Michael Jackson',
    hints: ["MJ initials", "Moonwalker"],
    association: {
      technique: 'Signature Move',
      explanation: "Known for moonwalk.",
      imagery: "King doing moonwalk in sparkly glove.",
      mnemonic: "MJ moonwalks"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '13',
    categoryId: 'musicians',
    question: "Who sang Purple Rain?",
    questions: ["Who was known as The Purple One?", "Which musician had a symbol as a name?"],
    answer: 'Prince',
    hints: ["Royal title", "Changed name to a symbol"],
    association: {
      technique: 'Color Association',
      explanation: "Purple = Prince.",
      imagery: "Purple rain falling on a prince.",
      mnemonic: "Purple PRINCE"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '14',
    categoryId: 'musicians',
    question: "Who is the lead singer of U2?",
    questions: ["Who wears colored sunglasses and is an activist?"],
    answer: 'Bono',
    hints: ["Four-letter name", "Rhymes with pro"],
    association: {
      technique: 'Distinctive Feature',
      explanation: "Known for sunglasses.",
      imagery: "Sunglasses with 'BONO' on them.",
      mnemonic: "BONO in shades"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '15',
    categoryId: 'musicians',
    question: "Who sang Hotel California?",
    questions: ["Which band is known for Hotel California?"],
    answer: 'Eagles',
    hints: ["Named after a bird", "American rock band"],
    association: {
      technique: 'Animal Symbol',
      explanation: "Eagles soaring.",
      imagery: "Eagles flying over California hotel.",
      mnemonic: "EAGLES in California"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '16',
    categoryId: 'musicians',
    question: "Who sang Stairway to Heaven?",
    questions: ["Which band had Robert Plant as lead singer?"],
    answer: 'Led Zeppelin',
    hints: ["Named after a lead balloon", "British rock band"],
    association: {
      technique: 'Metal Association',
      explanation: "Led = lead metal.",
      imagery: "Lead zeppelin flying to heaven.",
      mnemonic: "LED airship"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '17',
    categoryId: 'musicians',
    question: "Who sang Sweet Child O' Mine?",
    questions: ["Which band is Slash from?", "Who sang Welcome to the Jungle?"],
    answer: "Guns N' Roses",
    hints: ["Named after weapons and flowers", "Slash is the guitarist"],
    association: {
      technique: 'Contrast Association',
      explanation: "Guns and roses contrast.",
      imagery: "Guns shooting roses.",
      mnemonic: "GUNS shoot ROSES"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '18',
    categoryId: 'movies',
    question: "What movie has Leo going into dreams?",
    questions: ["Which Nolan film is about dream heists?"],
    answer: 'Inception',
    hints: ["Title means beginning", "Stars Leonardo DiCaprio"],
    association: {
      technique: 'Semantic Connection',
      explanation: "Inception = beginning.",
      imagery: "Leo diving into a brain.",
      mnemonic: "Go IN for INCEPTION"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '19',
    categoryId: 'movies',
    question: "What's the Spielberg movie with E.T.?",
    questions: ["Which movie has the alien that wants to phone home?"],
    answer: 'E.T. the Extra-Terrestrial',
    hints: ["Abbreviated title", "E.T. stands for Extra-Terrestrial"],
    association: {
      technique: 'Acronym',
      explanation: "E.T. = Extra-Terrestrial.",
      imagery: "Alien with glowing finger holding phone.",
      mnemonic: "E.T. phone home"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '20',
    categoryId: 'movies',
    question: "Which movie has a ship hitting an iceberg?",
    questions: ["What's the James Cameron romance on a ship?"],
    answer: 'Titanic',
    hints: ["Named after the ship", "Stars Leo and Kate"],
    association: {
      technique: 'Historical Event',
      explanation: "Based on real ship.",
      imagery: "Leo on ship's bow with iceberg ahead.",
      mnemonic: "TITANIC iceberg"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '21',
    categoryId: 'movies',
    question: "Which movie has Forrest sitting on a bench?",
    questions: ["Life is like a box of chocolates?"],
    answer: 'Forrest Gump',
    hints: ["Named after the main character", "Stars Tom Hanks"],
    association: {
      technique: 'Catchphrase',
      explanation: "Famous chocolate quote.",
      imagery: "Man on bench with box of chocolates.",
      mnemonic: "FORREST's chocolates"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '22',
    categoryId: 'movies',
    question: "Which trilogy has Frodo?",
    questions: ["Which movies are about destroying a ring?"],
    answer: 'Lord of the Rings',
    hints: ["Based on Tolkien books", "Three movies"],
    association: {
      technique: 'Object Focus',
      explanation: "All about the ring.",
      imagery: "Frodo carrying ring to mountain.",
      mnemonic: "LORD of the RINGS"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '23',
    categoryId: 'movies',
    question: "Which movie has Neo taking pills?",
    questions: ["Red pill or blue pill movie?"],
    answer: 'The Matrix',
    hints: ["Sci-fi about simulated reality", "Stars Keanu Reeves"],
    association: {
      technique: 'Philosophical Concept',
      explanation: "Reality is a matrix.",
      imagery: "Neo dodging bullets in green code.",
      mnemonic: "Red pill MATRIX"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '24',
    categoryId: 'movies',
    question: "Which movie has a guy in a mask saying 'I am your father'?",
    questions: ["Luke, I am your father?"],
    answer: 'The Empire Strikes Back',
    hints: ["Star Wars Episode V", "Darth Vader reveal"],
    association: {
      technique: 'Famous Quote',
      explanation: "Most famous twist.",
      imagery: "Vader's mask saying the line.",
      mnemonic: "EMPIRE father reveal"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '25',
    categoryId: 'movies',
    question: "Which movie has a clownfish lost in the ocean?",
    questions: ["Which Pixar movie is about finding a fish?"],
    answer: 'Finding Nemo',
    hints: ["The fish's name is in the title", "Pixar animation"],
    association: {
      technique: 'Title Character',
      explanation: "Finding the fish Nemo.",
      imagery: "Clownfish swimming in ocean.",
      mnemonic: "FINDING NEMO"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '26',
    categoryId: 'songs',
    question: "Which Queen song has Galileo Galileo?",
    questions: ["Is this the real life? Is this just fantasy?"],
    answer: 'Bohemian Rhapsody',
    hints: ["Six-minute rock opera", "Freddie Mercury's masterpiece"],
    association: {
      technique: 'Opera Structure',
      explanation: "Unique song structure.",
      imagery: "Freddie in bohemian clothes singing opera.",
      mnemonic: "BOHEMIAN opera"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '27',
    categoryId: 'songs',
    question: "Which Beatles song is about letting things be?",
    questions: ["Speaking words of wisdom?"],
    answer: 'Let It Be',
    hints: ["Two-word title", "Paul McCartney song"],
    association: {
      technique: 'Philosophy',
      explanation: "About acceptance.",
      imagery: "Beatles letting go of worries.",
      mnemonic: "LET IT BE"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '28',
    categoryId: 'songs',
    question: "Which Nirvana song is about teen spirit?",
    questions: ["Load up on guns, bring your friends?"],
    answer: 'Smells Like Teen Spirit',
    hints: ["Grunge anthem", "Kurt Cobain"],
    association: {
      technique: 'Sensory Memory',
      explanation: "About smell.",
      imagery: "Teens at concert with deodorant.",
      mnemonic: "SMELLS like TEEN"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '29',
    categoryId: 'songs',
    question: "Which song is about a hotel in California?",
    questions: ["You can check out any time you like?"],
    answer: 'Hotel California',
    hints: ["Eagles song", "About a mysterious hotel"],
    association: {
      technique: 'Place Memory',
      explanation: "California hotel.",
      imagery: "Desert highway with hotel sign.",
      mnemonic: "HOTEL in California"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '30',
    categoryId: 'songs',
    question: "Which Michael Jackson song has a zombie dance?",
    questions: ["Which MJ song has Vincent Price?"],
    answer: 'Thriller',
    hints: ["Famous music video", "Horror theme"],
    association: {
      technique: 'Visual Spectacle',
      explanation: "Iconic dance.",
      imagery: "MJ dancing with zombies.",
      mnemonic: "THRILLER zombies"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '31',
    categoryId: 'songs',
    question: "Which song is about a stairway to heaven?",
    questions: ["Led Zeppelin's most famous song?"],
    answer: 'Stairway to Heaven',
    hints: ["Eight-minute epic", "Guitar solo"],
    association: {
      technique: 'Journey Metaphor',
      explanation: "Climbing to heaven.",
      imagery: "Stairway rising to clouds.",
      mnemonic: "STAIRWAY up"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '32',
    categoryId: 'songs',
    question: "Which song is about imagine no possessions?",
    questions: ["John Lennon's peace song?"],
    answer: 'Imagine',
    hints: ["One-word title", "Peaceful message"],
    association: {
      technique: 'Philosophy',
      explanation: "About imagination.",
      imagery: "Lennon at white piano imagining peace.",
      mnemonic: "IMAGINE peace"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '33',
    categoryId: 'albums',
    question: "Which Nirvana album has a baby underwater?",
    questions: ["Which album has a dollar bill underwater?"],
    answer: 'Nevermind',
    hints: ["Baby reaching for money", "Contains Smells Like Teen Spirit"],
    association: {
      technique: 'Visual + Title',
      explanation: "Baby says nevermind to money.",
      imagery: "Baby swimming saying nevermind.",
      mnemonic: "NEVERMIND the money"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '34',
    categoryId: 'albums',
    question: "Which Pink Floyd album has a prism?",
    questions: ["Which album cover shows light splitting?"],
    answer: 'The Dark Side of the Moon',
    hints: ["Rainbow through prism", "1973 album"],
    association: {
      technique: 'Visual Icon',
      explanation: "Prism splitting light.",
      imagery: "Light beam through prism on dark side.",
      mnemonic: "DARK SIDE prism"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '35',
    categoryId: 'albums',
    question: "Which Beatles album has them crossing a street?",
    questions: ["Which album cover shows a zebra crossing?"],
    answer: 'Abbey Road',
    hints: ["Named after the studio street", "Four Beatles walking"],
    association: {
      technique: 'Location',
      explanation: "Abbey Road studios.",
      imagery: "Beatles crossing Abbey Road.",
      mnemonic: "ABBEY ROAD crossing"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '36',
    categoryId: 'albums',
    question: "Which Radiohead album has a crying bear?",
    questions: ["Which album has a sad teddy bear?"],
    answer: 'Kid A',
    hints: ["Two-word short title", "Electronic sound"],
    association: {
      technique: 'Visual Emotion',
      explanation: "Bear represents kid.",
      imagery: "Crying bear as Kid A.",
      mnemonic: "KID A crying"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '37',
    categoryId: 'albums',
    question: "Which Michael Jackson album is the best-selling?",
    questions: ["Which MJ album has Billie Jean?"],
    answer: 'Thriller',
    hints: ["Same as the hit song", "Best-selling album ever"],
    association: {
      technique: 'Record Breaker',
      explanation: "Most sold album.",
      imagery: "MJ in red jacket as zombie.",
      mnemonic: "THRILLER record"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '38',
    categoryId: 'albums',
    question: "Which Fleetwood Mac album has rumors?",
    questions: ["Which album has Go Your Own Way?"],
    answer: 'Rumours',
    hints: ["British spelling with U", "About band breakups"],
    association: {
      technique: 'Drama Context',
      explanation: "Album about band rumors.",
      imagery: "Band members whispering rumors.",
      mnemonic: "RUMOURS flying"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '39',
    categoryId: 'albums',
    question: "Which Led Zeppelin album has four symbols?",
    questions: ["Which album is also called Led Zeppelin IV?"],
    answer: 'Led Zeppelin IV',
    hints: ["Four symbols for members", "Contains Stairway to Heaven"],
    association: {
      technique: 'Symbol System',
      explanation: "Each member has symbol.",
      imagery: "Four mystical symbols.",
      mnemonic: "IV symbols"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '40',
    categoryId: 'cities',
    question: "Which Japanese city has red torii gates?",
    questions: ["Which city has Fushimi Inari Shrine?"],
    answer: 'Kyoto',
    hints: ["Former capital of Japan", "Sounds like 'key to'"],
    association: {
      technique: 'Sound + Visual',
      explanation: "Key to the gates.",
      imagery: "Key unlocking red torii gates.",
      mnemonic: "KEY TO (Kyoto)"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '41',
    categoryId: 'cities',
    question: "Which French city has the Eiffel Tower?",
    questions: ["Capital of France?"],
    answer: 'Paris',
    hints: ["City of Light", "Famous for romance"],
    association: {
      technique: 'Landmark',
      explanation: "Eiffel Tower.",
      imagery: "Eiffel Tower lighting up Paris.",
      mnemonic: "PARIS tower"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '42',
    categoryId: 'cities',
    question: "Which Italian city has canals instead of roads?",
    questions: ["Which city has gondolas?"],
    answer: 'Venice',
    hints: ["Floating city", "Sinking city"],
    association: {
      technique: 'Unique Feature',
      explanation: "Water streets.",
      imagery: "Gondolas on canals.",
      mnemonic: "VENICE canals"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '43',
    categoryId: 'cities',
    question: "Which city has the Statue of Liberty?",
    questions: ["Which city is the Big Apple?"],
    answer: 'New York',
    hints: ["NYC", "Manhattan"],
    association: {
      technique: 'Icon',
      explanation: "Liberty statue.",
      imagery: "Statue holding torch.",
      mnemonic: "NEW YORK Liberty"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '44',
    categoryId: 'cities',
    question: "Which city has Big Ben?",
    questions: ["Capital of England?"],
    answer: 'London',
    hints: ["Thames River", "UK capital"],
    association: {
      technique: 'Clock Tower',
      explanation: "Big Ben chimes.",
      imagery: "Big Ben over London.",
      mnemonic: "LONDON Ben"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '45',
    categoryId: 'cities',
    question: "Which Australian city has the Opera House?",
    questions: ["Which city has the Harbour Bridge?"],
    answer: 'Sydney',
    hints: ["Not the capital", "White sail-shaped building"],
    association: {
      technique: 'Building Shape',
      explanation: "Sail-shaped opera house.",
      imagery: "White sails by harbor.",
      mnemonic: "SYDNEY sails"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '46',
    categoryId: 'cities',
    question: "Which Egyptian city has the pyramids?",
    questions: ["Which city has the Sphinx?"],
    answer: 'Cairo',
    hints: ["Capital of Egypt", "Near Giza"],
    association: {
      technique: 'Ancient Wonder',
      explanation: "Pyramids nearby.",
      imagery: "Pyramids overlooking Cairo.",
      mnemonic: "CAIRO pyramids"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '47',
    categoryId: 'cities',
    question: "Which city is called the Eternal City?",
    questions: ["Which city has the Colosseum?"],
    answer: 'Rome',
    hints: ["Capital of Italy", "All roads lead here"],
    association: {
      technique: 'Historical Nickname',
      explanation: "Eternal City.",
      imagery: "Ancient ruins in Rome.",
      mnemonic: "ROME eternal"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '48',
    categoryId: 'restaurants',
    question: "Which Tokyo sushi restaurant has 3 Michelin stars?",
    questions: ["Which restaurant is in Jiro Dreams of Sushi?"],
    answer: 'Sukiyabashi Jiro',
    hints: ["Named after chef Jiro", "10 seats only"],
    association: {
      technique: 'Documentary',
      explanation: "Jiro dreams of sushi.",
      imagery: "Jiro on sushi bridge.",
      mnemonic: "JIRO dreams"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '49',
    categoryId: 'restaurants',
    question: "Which Copenhagen restaurant was voted best in the world?",
    questions: ["Which restaurant has Nordic cuisine?"],
    answer: 'Noma',
    hints: ["Four letters", "New Nordic cuisine"],
    association: {
      technique: 'Awards',
      explanation: "World's best restaurant.",
      imagery: "Nordic ingredients arranged artistically.",
      mnemonic: "NOMA Nordic"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '50',
    categoryId: 'restaurants',
    question: "Which French restaurant has the most Michelin stars?",
    questions: ["Which restaurant is in Paris with Guy Savoy?"],
    answer: 'Guy Savoy',
    hints: ["Named after the chef", "Three Michelin stars"],
    association: {
      technique: 'Chef Name',
      explanation: "Guy Savoy's restaurant.",
      imagery: "French chef Guy Savoy.",
      mnemonic: "GUY SAVOY"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '51',
    categoryId: 'streets',
    question: "Which Los Angeles street has the Walk of Fame?",
    questions: ["Which street has stars on the sidewalk?"],
    answer: 'Hollywood Boulevard',
    hints: ["In Hollywood", "Famous for entertainment"],
    association: {
      technique: 'Star Connection',
      explanation: "Stars on ground.",
      imagery: "Gold stars on Hollywood pavement.",
      mnemonic: "HOLLYWOOD stars"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '52',
    categoryId: 'streets',
    question: "Which Paris avenue leads to Arc de Triomphe?",
    questions: ["Which is the most famous street in Paris?"],
    answer: 'Champs-Élysées',
    hints: ["Very long avenue", "Luxury shops"],
    association: {
      technique: 'Monument Connection',
      explanation: "Leads to Arc.",
      imagery: "Wide avenue to Arc de Triomphe.",
      mnemonic: "CHAMPS to Arc"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '53',
    categoryId: 'streets',
    question: "Which London street is famous for shopping?",
    questions: ["Which street has the Christmas lights?"],
    answer: 'Oxford Street',
    hints: ["Named after Oxford", "Retail paradise"],
    association: {
      technique: 'Shopping',
      explanation: "Main shopping street.",
      imagery: "Busy shoppers on Oxford Street.",
      mnemonic: "OXFORD shopping"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '54',
    categoryId: 'streets',
    question: "Which New York street is famous for theater?",
    questions: ["Which street has all the musicals?"],
    answer: 'Broadway',
    hints: ["Theater district", "Wide way"],
    association: {
      technique: 'Entertainment',
      explanation: "Theater central.",
      imagery: "Marquee lights on Broadway.",
      mnemonic: "BROADWAY shows"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '55',
    categoryId: 'streets',
    question: "Which street in San Francisco has steep hills and cable cars?",
    questions: ["Which is the crookedest street?"],
    answer: 'Lombard Street',
    hints: ["Eight hairpin turns", "Very curvy"],
    association: {
      technique: 'Shape',
      explanation: "Zigzag street.",
      imagery: "Cars zigzagging down steep hill.",
      mnemonic: "LOMBARD zigzag"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '56',
    categoryId: 'clothing-brands',
    question: "Which brand has a swoosh logo?",
    questions: ["Just Do It slogan?"],
    answer: 'Nike',
    hints: ["Greek goddess", "Athletic wear"],
    association: {
      technique: 'Logo',
      explanation: "Swoosh symbol.",
      imagery: "Swoosh with Just Do It.",
      mnemonic: "NIKE swoosh"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '57',
    categoryId: 'clothing-brands',
    question: "Which brand has three stripes?",
    questions: ["Which German sportswear brand?"],
    answer: 'Adidas',
    hints: ["Three stripes logo", "Founded by Adi Dassler"],
    association: {
      technique: 'Stripes',
      explanation: "Three parallel stripes.",
      imagery: "Three stripes on shoes.",
      mnemonic: "ADIDAS stripes"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '58',
    categoryId: 'clothing-brands',
    question: "Which brand has a polo player logo?",
    questions: ["Which preppy American brand?"],
    answer: 'Ralph Lauren',
    hints: ["Polo shirts", "American designer"],
    association: {
      technique: 'Sport Icon',
      explanation: "Polo player on horse.",
      imagery: "Polo player logo.",
      mnemonic: "RALPH LAUREN polo"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '59',
    categoryId: 'clothing-brands',
    question: "Which brand has interlocking C's?",
    questions: ["Which French luxury fashion house?"],
    answer: 'Chanel',
    hints: ["Founded by Coco", "French luxury"],
    association: {
      technique: 'Initials',
      explanation: "CC logo.",
      imagery: "Interlocking C's.",
      mnemonic: "CHANEL CC"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '60',
    categoryId: 'clothing-brands',
    question: "Which brand has a crocodile logo?",
    questions: ["Which French tennis brand?"],
    answer: 'Lacoste',
    hints: ["Green crocodile", "Polo shirts"],
    association: {
      technique: 'Animal Logo',
      explanation: "Crocodile symbol.",
      imagery: "Green croc on chest.",
      mnemonic: "LACOSTE croc"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '61',
    categoryId: 'clothing-brands',
    question: "Which Swedish brand has affordable fashion?",
    questions: ["Which fast fashion retailer?"],
    answer: 'H&M',
    hints: ["Hennes & Mauritz", "Red logo"],
    association: {
      technique: 'Initials',
      explanation: "H&M abbreviation.",
      imagery: "Red H&M sign.",
      mnemonic: "H&M Swedish"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '62',
    categoryId: 'clothing-brands',
    question: "Which Spanish brand has fast fashion?",
    questions: ["Which brand has new items weekly?"],
    answer: 'Zara',
    hints: ["Four letters", "Owned by Inditex"],
    association: {
      technique: 'Speed',
      explanation: "Fast fashion.",
      imagery: "Clothes moving fast through Zara.",
      mnemonic: "ZARA fast"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '63',
    categoryId: 'shoe-brands',
    question: "Which brand has a jumping man logo?",
    questions: ["Which Michael Jordan brand?"],
    answer: 'Air Jordan',
    hints: ["Basketball legend", "Nike sub-brand"],
    association: {
      technique: 'Athlete',
      explanation: "MJ jumping.",
      imagery: "Jordan dunking silhouette.",
      mnemonic: "AIR JORDAN jumps"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '64',
    categoryId: 'shoe-brands',
    question: "Which brand has a mountain with stars?",
    questions: ["Which Chuck Taylor brand?"],
    answer: 'Converse',
    hints: ["All Star logo", "Canvas sneakers"],
    association: {
      technique: 'Star Logo',
      explanation: "Star in circle.",
      imagery: "Star on ankle patch.",
      mnemonic: "CONVERSE stars"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '65',
    categoryId: 'shoe-brands',
    question: "Which brand has a leaping puma?",
    questions: ["Which German athletic brand?"],
    answer: 'Puma',
    hints: ["Wild cat logo", "Founded by Rudolf Dassler"],
    association: {
      technique: 'Animal',
      explanation: "Puma cat leaping.",
      imagery: "Puma jumping.",
      mnemonic: "PUMA leaps"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '66',
    categoryId: 'shoe-brands',
    question: "Which brand has N on the side?",
    questions: ["Which Boston-based running brand?"],
    answer: 'New Balance',
    hints: ["NB initials", "American brand"],
    association: {
      technique: 'Letter Logo',
      explanation: "Big N.",
      imagery: "Large N on shoe side.",
      mnemonic: "NEW BALANCE N"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '67',
    categoryId: 'shoe-brands',
    question: "Which brand makes Timberland boots?",
    questions: ["Which yellow work boot brand?"],
    answer: 'Timberland',
    hints: ["Tree logo", "Wheat-colored boots"],
    association: {
      technique: 'Nature',
      explanation: "Timber = wood.",
      imagery: "Tree logo on boots.",
      mnemonic: "TIMBERLAND tree"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '68',
    categoryId: 'shoe-brands',
    question: "Which brand has the wavy line?",
    questions: ["Which skateboard shoe brand?"],
    answer: 'Vans',
    hints: ["Checkerboard pattern", "Off the Wall"],
    association: {
      technique: 'Pattern',
      explanation: "Wavy stripe.",
      imagery: "Wavy line on side.",
      mnemonic: "VANS wave"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '69',
    categoryId: 'watch-brands',
    question: "Which Swiss brand has a crown logo?",
    questions: ["Which luxury watch brand is most famous?"],
    answer: 'Rolex',
    hints: ["Crown symbol", "Submariner model"],
    association: {
      technique: 'Crown',
      explanation: "Royal crown.",
      imagery: "Gold crown on watch.",
      mnemonic: "ROLEX crown"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '70',
    categoryId: 'watch-brands',
    question: "Which brand has a plus sign logo?",
    questions: ["Which Swiss Army brand?"],
    answer: 'Swiss Army',
    hints: ["Red Swiss cross", "Victorinox"],
    association: {
      technique: 'Cross Symbol',
      explanation: "Swiss flag cross.",
      imagery: "White cross on red.",
      mnemonic: "SWISS cross"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '71',
    categoryId: 'watch-brands',
    question: "Which brand makes Speedmaster watches?",
    questions: ["Which watch went to the moon?"],
    answer: 'Omega',
    hints: ["Greek letter", "Moon watch"],
    association: {
      technique: 'Space',
      explanation: "Moon landing watch.",
      imagery: "Watch on moon.",
      mnemonic: "OMEGA moon"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '72',
    categoryId: 'watch-brands',
    question: "Which brand has a star logo?",
    questions: ["Which German precision brand?"],
    answer: 'Zenith',
    hints: ["Star symbol", "El Primero movement"],
    association: {
      technique: 'Star',
      explanation: "Zenith = highest point.",
      imagery: "Star at peak.",
      mnemonic: "ZENITH star"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '73',
    categoryId: 'watch-brands',
    question: "Which brand has nautilus model?",
    questions: ["Which brand has integrated bracelet?"],
    answer: 'Patek Philippe',
    hints: ["Swiss luxury", "Most expensive watches"],
    association: {
      technique: 'Prestige',
      explanation: "Ultra luxury.",
      imagery: "Nautilus shell-shaped watch.",
      mnemonic: "PATEK prestige"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '74',
    categoryId: 'perfume-brands',
    question: "Which French brand makes N°5?",
    questions: ["Which perfume did Marilyn Monroe wear?"],
    answer: 'Chanel',
    hints: ["Number 5", "Coco's brand"],
    association: {
      technique: 'Iconic Number',
      explanation: "N°5 is legendary.",
      imagery: "Marilyn with Chanel No 5.",
      mnemonic: "CHANEL 5"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '75',
    categoryId: 'perfume-brands',
    question: "Which brand makes La Vie Est Belle?",
    questions: ["Which French luxury beauty brand?"],
    answer: 'Lancôme',
    hints: ["Rose symbol", "French pronunciation"],
    association: {
      technique: 'French Beauty',
      explanation: "Life is beautiful.",
      imagery: "Rose perfume bottle.",
      mnemonic: "LANCOME rose"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '76',
    categoryId: 'perfume-brands',
    question: "Which brand makes J'adore?",
    questions: ["Which brand has gold bottle neck?"],
    answer: 'Dior',
    hints: ["French fashion house", "Gold amphora bottle"],
    association: {
      technique: 'Bottle Shape',
      explanation: "J'adore gold.",
      imagery: "Gold J'adore bottle.",
      mnemonic: "DIOR gold"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '77',
    categoryId: 'perfume-brands',
    question: "Which brand makes Sauvage?",
    questions: ["Which Johnny Depp perfume?"],
    answer: 'Dior',
    hints: ["Same as J'adore", "Means wild/savage"],
    association: {
      technique: 'Celebrity',
      explanation: "Johnny Depp ads.",
      imagery: "Depp in desert for Sauvage.",
      mnemonic: "DIOR Sauvage"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '78',
    categoryId: 'perfume-brands',
    question: "Which brand makes Flower Bomb?",
    questions: ["Which Dutch fashion house perfume?"],
    answer: 'Viktor & Rolf',
    hints: ["Grenade-shaped bottle", "Designer duo"],
    association: {
      technique: 'Bomb Shape',
      explanation: "Flower bomb grenade.",
      imagery: "Pink grenade bottle.",
      mnemonic: "VIKTOR bomb"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '79',
    categoryId: 'luxury-brands',
    question: "Which Italian brand has a prancing horse?",
    questions: ["Which supercar brand?"],
    answer: 'Ferrari',
    hints: ["Yellow background", "F1 racing"],
    association: {
      technique: 'Horse Logo',
      explanation: "Prancing stallion.",
      imagery: "Black horse on yellow shield.",
      mnemonic: "FERRARI horse"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '80',
    categoryId: 'luxury-brands',
    question: "Which Italian brand has a bull logo?",
    questions: ["Which supercar is named after bulls?"],
    answer: 'Lamborghini',
    hints: ["Bulls and bullfighting", "Italian founder"],
    association: {
      technique: 'Bull Symbol',
      explanation: "Charging bull.",
      imagery: "Gold bull logo.",
      mnemonic: "LAMBO bull"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '81',
    categoryId: 'luxury-brands',
    question: "Which French brand has interlocking L's?",
    questions: ["Which brand has monogram canvas?"],
    answer: 'Louis Vuitton',
    hints: ["LV monogram", "French trunk maker"],
    association: {
      technique: 'Monogram',
      explanation: "LV pattern.",
      imagery: "Brown LV monogram.",
      mnemonic: "LV VUITTON"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '82',
    categoryId: 'luxury-brands',
    question: "Which brand has double G logo?",
    questions: ["Which Italian fashion house?"],
    answer: 'Gucci',
    hints: ["GG logo", "Italian luxury"],
    association: {
      technique: 'Double Letter',
      explanation: "Two G's.",
      imagery: "Interlocking GG.",
      mnemonic: "GUCCI GG"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '83',
    categoryId: 'luxury-brands',
    question: "Which brand has Medusa head logo?",
    questions: ["Which Italian luxury brand?"],
    answer: 'Versace',
    hints: ["Greek mythology", "Italian designer"],
    association: {
      technique: 'Mythology',
      explanation: "Medusa face.",
      imagery: "Golden Medusa head.",
      mnemonic: "VERSACE Medusa"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '84',
    categoryId: 'luxury-brands',
    question: "Which brand has a trident logo?",
    questions: ["Which Italian car brand?"],
    answer: 'Maserati',
    hints: ["Neptune's trident", "Italian luxury cars"],
    association: {
      technique: 'Trident',
      explanation: "Three-pronged spear.",
      imagery: "Trident on grille.",
      mnemonic: "MASERATI trident"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '85',
    categoryId: 'luxury-brands',
    question: "Which brand has a flying B logo?",
    questions: ["Which British luxury car?"],
    answer: 'Bentley',
    hints: ["Winged B", "British heritage"],
    association: {
      technique: 'Wings',
      explanation: "B with wings.",
      imagery: "Flying B emblem.",
      mnemonic: "BENTLEY wings"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '86',
    categoryId: 'luxury-brands',
    question: "Which brand has orange boxes?",
    questions: ["Which French leather goods brand?"],
    answer: 'Hermès',
    hints: ["Orange packaging", "Birkin bags"],
    association: {
      technique: 'Color Brand',
      explanation: "Orange = Hermès.",
      imagery: "Orange box with ribbon.",
      mnemonic: "HERMES orange"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '87',
    categoryId: 'albums',
    question: "Which album has a banana sticker?",
    questions: ["Which Velvet Underground album has Warhol art?"],
    answer: 'The Velvet Underground & Nico',
    hints: ["Andy Warhol designed it", "Yellow banana"],
    association: {
      technique: 'Pop Art',
      explanation: "Warhol banana.",
      imagery: "Yellow peelable banana.",
      mnemonic: "VELVET banana"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '88',
    categoryId: 'movies',
    question: "Which movie has dinosaurs in a park?",
    questions: ["Which Spielberg movie has T-Rex?"],
    answer: 'Jurassic Park',
    hints: ["Based on Crichton book", "Dinosaur theme park"],
    association: {
      technique: 'Concept',
      explanation: "Dinosaurs brought back.",
      imagery: "T-Rex roaring at jeep.",
      mnemonic: "JURASSIC dinos"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '89',
    categoryId: 'movies',
    question: "Which movie has a tornado in Kansas?",
    questions: ["Which movie has ruby slippers?"],
    answer: 'The Wizard of Oz',
    hints: ["Follow yellow brick road", "Dorothy clicks heels"],
    association: {
      technique: 'Journey',
      explanation: "To see the wizard.",
      imagery: "Dorothy on yellow road.",
      mnemonic: "OZ yellow road"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '90',
    categoryId: 'movies',
    question: "Which movie has a masked vigilante in Gotham?",
    questions: ["Which superhero is the Dark Knight?"],
    answer: 'The Dark Knight',
    hints: ["Batman movie", "Heath Ledger's Joker"],
    association: {
      technique: 'Hero Identity',
      explanation: "Batman's title.",
      imagery: "Batman in shadows.",
      mnemonic: "DARK KNIGHT Batman"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '91',
    categoryId: 'songs',
    question: "Which song is about dancing in September?",
    questions: ["Which Earth Wind & Fire song?"],
    answer: 'September',
    hints: ["Do you remember?", "Disco classic"],
    association: {
      technique: 'Date Memory',
      explanation: "21st night.",
      imagery: "Calendar showing September.",
      mnemonic: "Remember SEPTEMBER"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '92',
    categoryId: 'songs',
    question: "Which song is about a killing someone?",
    questions: ["Which Queen song starts with Mama?"],
    answer: 'Bohemian Rhapsody',
    hints: ["Same as earlier", "Mama, just killed a man"],
    association: {
      technique: 'Dramatic Opening',
      explanation: "Mama confession.",
      imagery: "Freddie singing to mama.",
      mnemonic: "BOHEMIAN mama"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '93',
    categoryId: 'musicians',
    question: "Who is the Piano Man?",
    questions: ["Who sang Uptown Girl?"],
    answer: 'Billy Joel',
    hints: ["New York musician", "Piano Man song"],
    association: {
      technique: 'Instrument',
      explanation: "Piano player.",
      imagery: "Billy at piano bar.",
      mnemonic: "BILLY piano"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '94',
    categoryId: 'musicians',
    question: "Who sang Born in the USA?",
    questions: ["Who is The Boss?"],
    answer: 'Bruce Springsteen',
    hints: ["The Boss", "New Jersey rocker"],
    association: {
      technique: 'Nickname',
      explanation: "Called The Boss.",
      imagery: "American flag and Springsteen.",
      mnemonic: "BOSS Springsteen"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '95',
    categoryId: 'actors',
    question: "Who played Captain Jack Sparrow?",
    questions: ["Who starred in Pirates of the Caribbean?"],
    answer: 'Johnny Depp',
    hints: ["Also played Sweeney Todd", "Worked with Tim Burton"],
    association: {
      technique: 'Pirate Role',
      explanation: "Drunken pirate.",
      imagery: "Depp with dreadlocks and eyeliner.",
      mnemonic: "DEPP pirate"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '96',
    categoryId: 'actors',
    question: "Who played Forrest Gump?",
    questions: ["Who said life is like a box of chocolates?"],
    answer: 'Tom Hanks',
    hints: ["Also played Woody", "Two-time Oscar winner"],
    association: {
      technique: 'Everyman',
      explanation: "Likable actor.",
      imagery: "Hanks on bench with chocolates.",
      mnemonic: "HANKS chocolates"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '97',
    categoryId: 'cities',
    question: "Which city is called Sin City?",
    questions: ["Which city has casinos on the strip?"],
    answer: 'Las Vegas',
    hints: ["Nevada desert", "Gambling capital"],
    association: {
      technique: 'Nickname',
      explanation: "Sin City.",
      imagery: "Neon casino lights.",
      mnemonic: "VEGAS sin"
    },
    isCustom: false,
    difficulty: 'easy'
  },
  {
    id: '98',
    categoryId: 'cities',
    question: "Which city has Christ the Redeemer statue?",
    questions: ["Which Brazilian city has carnival?"],
    answer: 'Rio de Janeiro',
    hints: ["Beach city", "Famous statue on mountain"],
    association: {
      technique: 'Monument',
      explanation: "Christ statue.",
      imagery: "Statue with arms spread over Rio.",
      mnemonic: "RIO Christ"
    },
    isCustom: false,
    difficulty: 'medium'
  },
  {
    id: '99',
    categoryId: 'restaurants',
    question: "Which NYC restaurant has a tasting menu?",
    questions: ["Which restaurant has molecular gastronomy?"],
    answer: 'Eleven Madison Park',
    hints: ["In Madison Square Park", "Three Michelin stars"],
    association: {
      technique: 'Location',
      explanation: "Named after location.",
      imagery: "Elegant NYC dining room.",
      mnemonic: "ELEVEN Madison"
    },
    isCustom: false,
    difficulty: 'hard'
  },
  {
    id: '100',
    categoryId: 'streets',
    question: "Which Las Vegas street has all the casinos?",
    questions: ["Which street is the heart of Vegas?"],
    answer: 'The Strip',
    hints: ["Las Vegas Boulevard", "Neon lights"],
    association: {
      technique: 'Nickname',
      explanation: "The Strip.",
      imagery: "Long street with giant casinos.",
      mnemonic: "VEGAS Strip"
    },
    isCustom: false,
    difficulty: 'easy'
  }
];
