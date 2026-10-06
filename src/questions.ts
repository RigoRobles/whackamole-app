export interface Question {
  id: string;
  topic: 'verb-tenses' | 'subject-verb-agreement' | 'comparatives-superlatives' | 'prepositions';
  difficulty: 'beginner' | 'normal' | 'hard';
  sentence: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export const QUESTIONS: Question[] = [
  // ==================== VERB TENSES (20 questions) ====================
  // Beginner
  {
    id: "vt_001",
    topic: "verb-tenses",
    difficulty: "beginner",
    sentence: "I usually ____ a cup of coffee in the morning.",
    options: ["drink", "drinks", "drinking"],
    correct_answer: "drink",
    explanation: "We use 'drink' (base form) with 'I' in the present simple tense for habit or routine."
  },
  {
    id: "vt_002",
    topic: "verb-tenses",
    difficulty: "beginner",
    sentence: "Look! The dog ____ in the swimming pool right now.",
    options: ["is swimming", "swims", "swam"],
    correct_answer: "is swimming",
    explanation: "'Right now' and 'Look!' tell us this is happening at this very moment (present continuous)."
  },
  {
    id: "vt_003",
    topic: "verb-tenses",
    difficulty: "beginner",
    sentence: "Yesterday, we ____ a very interesting movie at the cinema.",
    options: ["watched", "watch", "watches"],
    correct_answer: "watched",
    explanation: "'Yesterday' indicates a completed action in the past, so we use the past simple 'watched'."
  },
  {
    id: "vt_004",
    topic: "verb-tenses",
    difficulty: "beginner",
    sentence: "They ____ their homework yet. Can you help them?",
    options: ["haven't finished", "don't finish", "didn't finished"],
    correct_answer: "haven't finished",
    explanation: "'Yet' is a keyword for the present perfect tense in negative sentences. We use 'have/has not + past participle'."
  },
  {
    id: "vt_005",
    topic: "verb-tenses",
    difficulty: "beginner",
    sentence: "She ____ to school by bus every day.",
    options: ["goes", "go", "going"],
    correct_answer: "goes",
    explanation: "With third-person singular (she/he/it), we add '-s' or '-es' to the verb in the present simple."
  },
  {
    id: "vt_006",
    topic: "verb-tenses",
    difficulty: "beginner",
    sentence: "Last night, I ____ a strange sound outside my window.",
    options: ["heard", "hear", "hears"],
    correct_answer: "heard",
    explanation: "We use the irregular past simple form 'heard' because the action happened 'last night'."
  },
  // Normal
  {
    id: "vt_007",
    topic: "verb-tenses",
    difficulty: "normal",
    sentence: "While she was cooking dinner, the phone suddenly ____.",
    options: ["rang", "was ringing", "rings", "has rung"],
    correct_answer: "rang",
    explanation: "We use the past simple ('rang') for a short, interrupting action during a longer past action ('was cooking')."
  },
  {
    id: "vt_008",
    topic: "verb-tenses",
    difficulty: "normal",
    sentence: "We ____ each other since we were in elementary school.",
    options: ["have known", "know", "knew", "are knowing"],
    correct_answer: "have known",
    explanation: "The keyword 'since' requires the present perfect. Remember, 'know' is a stative verb and is not used in continuous forms!"
  },
  {
    id: "vt_009",
    topic: "verb-tenses",
    difficulty: "normal",
    sentence: "Please be quiet! My baby brother ____ at the moment.",
    options: ["is sleeping", "sleeps", "slept", "has slept"],
    correct_answer: "is sleeping",
    explanation: "'At the moment' tells us the action is in progress right now, requiring the present continuous tense."
  },
  {
    id: "vt_010",
    topic: "verb-tenses",
    difficulty: "normal",
    sentence: "He ____ in London for five years, but now he lives in New York.",
    options: ["lived", "has lived", "lives", "is living"],
    correct_answer: "lived",
    explanation: "Use past simple ('lived') because the action is fully completed and he no longer lives in London."
  },
  {
    id: "vt_011",
    topic: "verb-tenses",
    difficulty: "normal",
    sentence: "I am so tired. I ____ soccer with my friends for three hours.",
    options: ["have been playing", "played", "am playing", "play"],
    correct_answer: "have been playing",
    explanation: "The present perfect continuous ('have been playing') emphasizes the duration of an activity connected to the present."
  },
  {
    id: "vt_012",
    topic: "verb-tenses",
    difficulty: "normal",
    sentence: "My parents ____ to Paris three times so far.",
    options: ["have been", "were", "go", "have gone"],
    correct_answer: "have been",
    explanation: "'So far' indicates life experience from the past up to now. We use 'have been' to show they visited and returned."
  },
  {
    id: "vt_013",
    topic: "verb-tenses",
    difficulty: "normal",
    sentence: "They ____ English when they moved to Canada.",
    options: ["were studying", "have studied", "studies", "study"],
    correct_answer: "were studying",
    explanation: "They were in the middle of a continuous past action ('were studying') when a specific point in time occurred ('when they moved')."
  },
  // Hard
  {
    id: "vt_014",
    topic: "verb-tenses",
    difficulty: "hard",
    sentence: "By the time the train arrived, we ____ for over an hour.",
    options: ["had been waiting", "were waiting", "have waited", "waited"],
    correct_answer: "had been waiting",
    explanation: "We use the past perfect continuous to describe an action that was ongoing up to another point in the past."
  },
  {
    id: "vt_015",
    topic: "verb-tenses",
    difficulty: "hard",
    sentence: "I will call you as soon as I ____ my exams.",
    options: ["finish", "will finish", "finished", "am finishing"],
    correct_answer: "finish",
    explanation: "In time clauses introducing future actions (using 'as soon as', 'when', 'if'), we use the simple present instead of 'will'."
  },
  {
    id: "vt_016",
    topic: "verb-tenses",
    difficulty: "hard",
    sentence: "If I ____ more time, I would have traveled around the world.",
    options: ["had had", "had", "would have", "have had"],
    correct_answer: "had had",
    explanation: "This is a third conditional (unreal past). The 'if'-clause takes the past perfect ('had had' - auxiliary 'had' + past participle 'had')."
  },
  {
    id: "vt_017",
    topic: "verb-tenses",
    difficulty: "hard",
    sentence: "It's high time we ____ home. It's getting dark.",
    options: ["went", "go", "should go", "have gone"],
    correct_answer: "went",
    explanation: "The expression 'It's high time / It's about time' is followed by a subject and a past simple verb to express urgency."
  },
  {
    id: "vt_018",
    topic: "verb-tenses",
    difficulty: "hard",
    sentence: "This time tomorrow, we ____ across the Atlantic Ocean.",
    options: ["will be flying", "fly", "will fly", "are flying"],
    correct_answer: "will be flying",
    explanation: "We use the future continuous ('will be flying') for an action that will be in progress at a specific time in the future."
  },
  {
    id: "vt_019",
    topic: "verb-tenses",
    difficulty: "hard",
    sentence: "She behaved as though she ____ the queen of England.",
    options: ["were", "is", "was being", "has been"],
    correct_answer: "were",
    explanation: "We use 'as though' with past subjunctive ('were') to express an imaginary or contrary-to-fact situation."
  },
  {
    id: "vt_020",
    topic: "verb-tenses",
    difficulty: "hard",
    sentence: "Rarely ____ such a beautiful performance by high schoolers.",
    options: ["have I seen", "I have seen", "did I saw", "had I saw"],
    correct_answer: "have I seen",
    explanation: "When starting a sentence with a negative adverb like 'Rarely' or 'Seldom', we must invert the subject and auxiliary verb."
  },

  // ==================== SUBJECT-VERB AGREEMENT (20 questions) ====================
  // Beginner
  {
    id: "sva_001",
    topic: "subject-verb-agreement",
    difficulty: "beginner",
    sentence: "They ____ excellent students in my English class.",
    options: ["are", "is", "am"],
    correct_answer: "are",
    explanation: "We use 'are' with plural subject pronouns like 'they', 'we', and 'you'."
  },
  {
    id: "sva_002",
    topic: "subject-verb-agreement",
    difficulty: "beginner",
    sentence: "He ____ video games on his computer after school.",
    options: ["plays", "play", "playing"],
    correct_answer: "plays",
    explanation: "For singular subjects like 'he', 'she', or 'it', we add '-s' to the verb in the simple present."
  },
  {
    id: "sva_003",
    topic: "subject-verb-agreement",
    difficulty: "beginner",
    sentence: "I ____ a very fast runner on our sports team.",
    options: ["am", "is", "are"],
    correct_answer: "am",
    explanation: "The pronoun 'I' always pairs with 'am' in the present tense of the verb 'to be'."
  },
  {
    id: "sva_004",
    topic: "subject-verb-agreement",
    difficulty: "beginner",
    sentence: "My dogs ____ in the backyard when it is sunny.",
    options: ["run", "runs", "running"],
    correct_answer: "run",
    explanation: "The subject 'My dogs' is plural, so we use the base form 'run' in the present simple."
  },
  {
    id: "sva_005",
    topic: "subject-verb-agreement",
    difficulty: "beginner",
    sentence: "A cat ____ to sleep on warm surfaces like laptops.",
    options: ["likes", "like", "liking"],
    correct_answer: "likes",
    explanation: "'A cat' is a singular noun (it), so it requires the verb 'likes' with an '-s'."
  },
  {
    id: "sva_006",
    topic: "subject-verb-agreement",
    difficulty: "beginner",
    sentence: "You ____ the best player on our soccer squad!",
    options: ["are", "is", "am"],
    correct_answer: "are",
    explanation: "The pronoun 'you' always takes a plural verb ('are'), whether it refers to one person or many."
  },
  // Normal
  {
    id: "sva_007",
    topic: "subject-verb-agreement",
    difficulty: "normal",
    sentence: "The container of freshly baked cookies ____ on the kitchen table.",
    options: ["is", "are", "were", "be"],
    correct_answer: "is",
    explanation: "The true subject of the sentence is the singular noun 'container', not the plural 'cookies' in the prepositional phrase."
  },
  {
    id: "sva_008",
    topic: "subject-verb-agreement",
    difficulty: "normal",
    sentence: "Either my sisters or my brother ____ to feed the dog tonight.",
    options: ["has", "have", "having", "has to"],
    correct_answer: "has",
    explanation: "When subjects are joined by 'either... or', the verb must agree with the subject closest to it ('my brother' is singular)."
  },
  {
    id: "sva_009",
    topic: "subject-verb-agreement",
    difficulty: "normal",
    sentence: "Everyone in the class ____ excited about the grammar arcade game.",
    options: ["is", "are", "were", "be"],
    correct_answer: "is",
    explanation: "Indefinite pronouns like 'everyone', 'someone', 'everybody', and 'nobody' are singular and take singular verbs."
  },
  {
    id: "sva_010",
    topic: "subject-verb-agreement",
    difficulty: "normal",
    sentence: "My mom and my dad ____ as English teachers at the academy.",
    options: ["work", "works", "working", "does work"],
    correct_answer: "work",
    explanation: "Two subjects joined by 'and' form a compound plural subject, so they take a plural verb ('work')."
  },
  {
    id: "sva_011",
    topic: "subject-verb-agreement",
    difficulty: "normal",
    sentence: "The news about the school field trip ____ very surprising.",
    options: ["is", "are", "were", "be"],
    correct_answer: "is",
    explanation: "Although 'news' ends in '-s', it is an uncountable singular noun and requires a singular verb."
  },
  {
    id: "sva_012",
    topic: "subject-verb-agreement",
    difficulty: "normal",
    sentence: "There ____ several books on the desk that you need to read.",
    options: ["are", "is", "was", "has been"],
    correct_answer: "are",
    explanation: "In 'there is/there are' sentences, the verb agrees with the noun that follows it ('several books' is plural)."
  },
  {
    id: "sva_013",
    topic: "subject-verb-agreement",
    difficulty: "normal",
    sentence: "The team ____ celebrating its championship win in the locker room.",
    options: ["is", "are", "were", "be"],
    correct_answer: "is",
    explanation: "Collective nouns like 'team' or 'family' are singular when they act as a single unit. The clue 'its' confirms it is singular."
  },
  // Hard
  {
    id: "sva_014",
    topic: "subject-verb-agreement",
    difficulty: "hard",
    sentence: "Ten miles ____ a long distance to walk to school.",
    options: ["is", "are", "were", "be"],
    correct_answer: "is",
    explanation: "Amounts of distance, time, or money (e.g., 'ten miles', 'five dollars') are treated as a single singular unit of measurement."
  },
  {
    id: "sva_015",
    topic: "subject-verb-agreement",
    difficulty: "hard",
    sentence: "The list of students who passed the exams ____ not been published.",
    options: ["has", "have", "having", "are"],
    correct_answer: "has",
    explanation: "The subject of the sentence is 'The list' (singular), so the singular auxiliary verb 'has' must be used."
  },
  {
    id: "sva_016",
    topic: "subject-verb-agreement",
    difficulty: "hard",
    sentence: "Physics ____ my favorite subject in high school.",
    options: ["is", "are", "were", "be"],
    correct_answer: "is",
    explanation: "Subjects of study ending in '-ics' (physics, mathematics, economics) are singular nouns and take singular verbs."
  },
  {
    id: "sva_017",
    topic: "subject-verb-agreement",
    difficulty: "hard",
    sentence: "A number of students ____ registered for the grammar garden competition.",
    options: ["have", "has", "is", "was"],
    correct_answer: "have",
    explanation: "The phrase 'a number of' is plural and takes a plural verb, whereas 'the number of' is singular."
  },
  {
    id: "sva_018",
    topic: "subject-verb-agreement",
    difficulty: "hard",
    sentence: "Neither the teacher nor the students ____ prepared for the sudden pop quiz.",
    options: ["were", "was", "is", "has been"],
    correct_answer: "were",
    explanation: "With 'neither... nor', the verb agrees with the closer subject. 'The students' is plural, so we use 'were'."
  },
  {
    id: "sva_019",
    topic: "subject-verb-agreement",
    difficulty: "hard",
    sentence: "The scissors ____ on the table, but they are dull.",
    options: ["are", "is", "was", "has been"],
    correct_answer: "are",
    explanation: "Nouns like 'scissors', 'pants', and 'glasses' are always plural unless preceded by the phrase 'a pair of'."
  },
  {
    id: "sva_020",
    topic: "subject-verb-agreement",
    difficulty: "hard",
    sentence: "Not only the players but also the coach ____ hard every day.",
    options: ["works", "work", "working", "do work"],
    correct_answer: "works",
    explanation: "With 'not only... but also', the verb agrees with the closer subject ('the coach' is singular)."
  },

  // ==================== COMPARATIVES AND SUPERLATIVES (20 questions) ====================
  // Beginner
  {
    id: "cs_001",
    topic: "comparatives-superlatives",
    difficulty: "beginner",
    sentence: "My new phone is ____ than my old one.",
    options: ["bigger", "biggest", "more big"],
    correct_answer: "bigger",
    explanation: "For short one-syllable adjectives, we add '-er' to form the comparative, followed by 'than'."
  },
  {
    id: "cs_002",
    topic: "comparatives-superlatives",
    difficulty: "beginner",
    sentence: "Mount Everest is the ____ mountain in the world.",
    options: ["highest", "higher", "most high"],
    correct_answer: "highest",
    explanation: "We use 'the' + adjective-est for superlatives of short adjectives."
  },
  {
    id: "cs_003",
    topic: "comparatives-superlatives",
    difficulty: "beginner",
    sentence: "This grammar test is ____ than last week's exam.",
    options: ["easier", "easyer", "more easy"],
    correct_answer: "easier",
    explanation: "For two-syllable adjectives ending in '-y', we change the 'y' to 'i' and add '-er'."
  },
  {
    id: "cs_004",
    topic: "comparatives-superlatives",
    difficulty: "beginner",
    sentence: "She is the ____ dancer in our entire school crew.",
    options: ["best", "goodest", "better"],
    correct_answer: "best",
    explanation: "'Good' has an irregular superlative form: 'the best'."
  },
  {
    id: "cs_005",
    topic: "comparatives-superlatives",
    difficulty: "beginner",
    sentence: "A Ferrari is ____ than an old tractor.",
    options: ["faster", "fastest", "more fast"],
    correct_answer: "faster",
    explanation: "'Fast' is a short adjective, so we add '-er' to make it a comparative."
  },
  {
    id: "cs_006",
    topic: "comparatives-superlatives",
    difficulty: "beginner",
    sentence: "This is the ____ game I have ever played!",
    options: ["funniest", "funnyer", "most funny"],
    correct_answer: "funniest",
    explanation: "The superlative of 'funny' is 'the funniest' (y changes to i, then add -est)."
  },
  // Normal
  {
    id: "cs_007",
    topic: "comparatives-superlatives",
    difficulty: "normal",
    sentence: "Math is ____ than history, in my personal opinion.",
    options: ["more difficult", "difficultier", "most difficult", "as difficult"],
    correct_answer: "more difficult",
    explanation: "For long adjectives (three or more syllables), we use 'more + adjective' to make comparatives."
  },
  {
    id: "cs_008",
    topic: "comparatives-superlatives",
    difficulty: "normal",
    sentence: "This is the ____ movie of the entire year; don't watch it.",
    options: ["worst", "baddest", "worse", "most bad"],
    correct_answer: "worst",
    explanation: "'Bad' is irregular: comparative is 'worse' and superlative is 'the worst'."
  },
  {
    id: "cs_009",
    topic: "comparatives-superlatives",
    difficulty: "normal",
    sentence: "Rigo is ____ at playing basketball than soccer.",
    options: ["better", "gooder", "best", "more good"],
    correct_answer: "better",
    explanation: "'Good' is irregular: its comparative form is 'better'."
  },
  {
    id: "cs_010",
    topic: "comparatives-superlatives",
    difficulty: "normal",
    sentence: "Who is the ____ person in your entire family?",
    options: ["tallest", "taller", "most tall", "most tallest"],
    correct_answer: "tallest",
    explanation: "For short adjectives, the superlative is formed with 'the + adjective-est' ('the tallest')."
  },
  {
    id: "cs_011",
    topic: "comparatives-superlatives",
    difficulty: "normal",
    sentence: "My grade is ____ than yours, so I need to study harder.",
    options: ["worse", "worst", "badder", "more bad"],
    correct_answer: "worse",
    explanation: "We use the irregular comparative form 'worse' when comparing two grades."
  },
  {
    id: "cs_012",
    topic: "comparatives-superlatives",
    difficulty: "normal",
    sentence: "A silver ring is ____ than a golden crown.",
    options: ["less expensive", "least expensive", "more cheap", "cheapest"],
    correct_answer: "less expensive",
    explanation: "We use 'less + long adjective' to show that something has a lower degree than something else."
  },
  {
    id: "cs_013",
    topic: "comparatives-superlatives",
    difficulty: "normal",
    sentence: "This is the ____ question in this entire level of the arcade.",
    options: ["most interesting", "more interesting", "interestingest", "least interesting"],
    correct_answer: "most interesting",
    explanation: "Superlatives of long adjectives use 'the most + adjective' ('the most interesting')."
  },
  // Hard
  {
    id: "cs_014",
    topic: "comparatives-superlatives",
    difficulty: "hard",
    sentence: "The ____ you study grammar, the easier the moles are to hit.",
    options: ["more", "most", "better", "harder"],
    correct_answer: "more",
    explanation: "This is a double comparative structure: 'The + comparative (more), the + comparative (easier)'."
  },
  {
    id: "cs_015",
    topic: "comparatives-superlatives",
    difficulty: "hard",
    sentence: "This book is by far the ____ of all the novels we've read.",
    options: ["most exciting", "more exciting", "excitingest", "as exciting"],
    correct_answer: "most exciting",
    explanation: "'By far' is used with superlative adjectives ('the most exciting') to emphasize a large difference."
  },
  {
    id: "cs_016",
    topic: "comparatives-superlatives",
    difficulty: "hard",
    sentence: "The weather today is slightly ____ than it was yesterday.",
    options: ["warmer", "warmest", "more warm", "as warm"],
    correct_answer: "warmer",
    explanation: "Adverbs of degree like 'slightly', 'much', or 'far' can modify comparative adjectives ('slightly warmer')."
  },
  {
    id: "cs_017",
    topic: "comparatives-superlatives",
    difficulty: "hard",
    sentence: "The new building is three times ____ than our old high school.",
    options: ["taller", "tallest", "more tall", "as tall"],
    correct_answer: "taller",
    explanation: "We use comparative adjectives with multiplier expressions like 'three times' to compare sizes."
  },
  {
    id: "cs_018",
    topic: "comparatives-superlatives",
    difficulty: "hard",
    sentence: "She was the ____ of the two candidates interviewed.",
    options: ["smarter", "smartest", "most smart", "more smarter"],
    correct_answer: "smarter",
    explanation: "Grammar rule: When comparing exactly TWO items or people, use the comparative ('smarter'), not the superlative."
  },
  {
    id: "cs_019",
    topic: "comparatives-superlatives",
    difficulty: "hard",
    sentence: "This is a ____ issue than you realize; we must fix it.",
    options: ["far more serious", "far seriouser", "most serious", "more seriouser"],
    correct_answer: "far more serious",
    explanation: "'Far' is used as an intensifier before comparative forms of long adjectives ('far more serious')."
  },
  {
    id: "cs_020",
    topic: "comparatives-superlatives",
    difficulty: "hard",
    sentence: "He is easily the ____ skilled carpenter in the local guild.",
    options: ["most", "more", "least", "best"],
    correct_answer: "most",
    explanation: "'Easily' is commonly used to intensify superlatives ('easily the most skilled')."
  },

  // ==================== BASIC PREPOSITIONS (20 questions) ====================
  // Beginner
  {
    id: "prep_001",
    topic: "prepositions",
    difficulty: "beginner",
    sentence: "The textbook is ____ the wooden table.",
    options: ["on", "in", "at"],
    correct_answer: "on",
    explanation: "We use 'on' for items supported by a surface (like a table or desk)."
  },
  {
    id: "prep_002",
    topic: "prepositions",
    difficulty: "beginner",
    sentence: "My birthday party is ____ October 24th.",
    options: ["on", "in", "at"],
    correct_answer: "on",
    explanation: "We use the preposition 'on' with specific days and calendar dates."
  },
  {
    id: "prep_003",
    topic: "prepositions",
    difficulty: "beginner",
    sentence: "The students are sitting ____ the classroom.",
    options: ["in", "on", "at"],
    correct_answer: "in",
    explanation: "We use 'in' for closed spaces or defined areas like 'the classroom' or 'the garden'."
  },
  {
    id: "prep_004",
    topic: "prepositions",
    difficulty: "beginner",
    sentence: "We usually wake up ____ 7:00 AM.",
    options: ["at", "on", "in"],
    correct_answer: "at",
    explanation: "We use 'at' for precise, specific times of the day."
  },
  {
    id: "prep_005",
    topic: "prepositions",
    difficulty: "beginner",
    sentence: "The cat is sleeping ____ the blanket on the cold night.",
    options: ["under", "on top", "at"],
    correct_answer: "under",
    explanation: "'Under' means directly below or covered by something (like a blanket or a roof)."
  },
  {
    id: "prep_006",
    topic: "prepositions",
    difficulty: "beginner",
    sentence: "Rigo is standing ____ the whiteboard, explaining grammar rules.",
    options: ["in front of", "under", "between"],
    correct_answer: "in front of",
    explanation: "'In front of' means facing something or closer to the front part of it (the whiteboard)."
  },
  // Normal
  {
    id: "prep_007",
    topic: "prepositions",
    difficulty: "normal",
    sentence: "The school library is situated ____ the cafeteria and the gym.",
    options: ["between", "behind", "next to", "under"],
    correct_answer: "between",
    explanation: "We use 'between' when referring to a position with objects/places on both sides (cafeteria and gym)."
  },
  {
    id: "prep_008",
    topic: "prepositions",
    difficulty: "normal",
    sentence: "I met my best friend ____ the school entrance yesterday.",
    options: ["at", "in", "on", "under"],
    correct_answer: "at",
    explanation: "We use 'at' to refer to a specific point, spot, or location in space."
  },
  {
    id: "prep_009",
    topic: "prepositions",
    difficulty: "normal",
    sentence: "The park is located directly ____ the high school, just cross the street.",
    options: ["behind", "between", "on", "under"],
    correct_answer: "behind",
    explanation: "'Behind' means at the back of something. Crossing the street behind the school reveals the park."
  },
  {
    id: "prep_010",
    topic: "prepositions",
    difficulty: "normal",
    sentence: "My keys fell ____ the couch cushions, so I couldn't find them.",
    options: ["between", "on", "at", "underneath"],
    correct_answer: "between",
    explanation: "The keys fell into the space separating the cushions, so we use 'between'."
  },
  {
    id: "prep_011",
    topic: "prepositions",
    difficulty: "normal",
    sentence: "We love to swim in the lake ____ summer.",
    options: ["in", "on", "at", "under"],
    correct_answer: "in",
    explanation: "We use 'in' for long periods of time like seasons (summer, winter) and years (2026)."
  },
  {
    id: "prep_012",
    topic: "prepositions",
    difficulty: "normal",
    sentence: "Who is that boy standing ____ the principal in the picture?",
    options: ["next to", "at", "on", "between"],
    correct_answer: "next to",
    explanation: "'Next to' means at the side of someone or something."
  },
  {
    id: "prep_013",
    topic: "prepositions",
    difficulty: "normal",
    sentence: "Don't leave your trash ____ your school desk; put it in the bin.",
    options: ["under", "in", "between", "at"],
    correct_answer: "under",
    explanation: "'Under' fits perfectly here because students sometimes leave trash below their desks."
  },
  // Hard
  {
    id: "prep_014",
    topic: "prepositions",
    difficulty: "hard",
    sentence: "She is extremely good ____ solving advanced grammar puzzles.",
    options: ["at", "in", "on", "with"],
    correct_answer: "at",
    explanation: "The adjective 'good' takes the preposition 'at' when describing abilities or skills (good at something)."
  },
  {
    id: "prep_015",
    topic: "prepositions",
    difficulty: "hard",
    sentence: "The meeting has been rescheduled ____ next Monday morning.",
    options: ["for", "at", "on", "in"],
    correct_answer: "for",
    explanation: "We say 'rescheduled for' a specific day/time when planning or shifting appointments."
  },
  {
    id: "prep_016",
    topic: "prepositions",
    difficulty: "hard",
    sentence: "We succeeded ____ passing the difficult level on our first try.",
    options: ["in", "at", "on", "to"],
    correct_answer: "in",
    explanation: "The verb 'succeed' is paired with the preposition 'in' + gerund verb form ('succeeded in passing')."
  },
  {
    id: "prep_017",
    topic: "prepositions",
    difficulty: "hard",
    sentence: "Are you interested ____ joining the school's English drama club?",
    options: ["in", "on", "at", "about"],
    correct_answer: "in",
    explanation: "The adjective 'interested' is always paired with the preposition 'in'."
  },
  {
    id: "prep_018",
    topic: "prepositions",
    difficulty: "hard",
    sentence: "He apologized ____ his teacher for arriving late to class.",
    options: ["to", "for", "with", "at"],
    correct_answer: "to",
    explanation: "We apologize TO someone (recipient of apology) FOR something (the reason)."
  },
  {
    id: "prep_019",
    topic: "prepositions",
    difficulty: "hard",
    sentence: "Your results depend ____ how much effort you put into the game.",
    options: ["on", "of", "in", "at"],
    correct_answer: "on",
    explanation: "The verb 'depend' is always followed by the preposition 'on'."
  },
  {
    id: "prep_020",
    topic: "prepositions",
    difficulty: "hard",
    sentence: "They walked ____ the dense forest to reach the magical school.",
    options: ["through", "across", "over", "along"],
    correct_answer: "through",
    explanation: "We use 'through' when moving in a three-dimensional space surrounded by objects (like trees in a forest)."
  }
];
