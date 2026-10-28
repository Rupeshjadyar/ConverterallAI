export interface QuoteItem {
  id: string;
  category: 'short' | 'medium' | 'long';
  text: string;
  author: string;
}

export const EASY_ENGLISH_WORDS: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "water", "long", "find", "very", "world", "still", "down", "call", "should", "place",
  "over", "little", "live", "side", "may", "here", "where", "tell", "much", "turn",
  "real", "help", "great", "play", "run", "small", "number", "off", "always", "next",
  "keep", "hand", "high", "house", "ask", "part", "read", "line", "end", "move",
  "light", "again", "home", "point", "need", "word", "air", "try", "set", "own",
  "under", "last", "right", "left", "night", "while", "head", "far", "tree", "open",
  "seem", "face", "together", "next", "white", "black", "walk", "learn", "start", "city",
  "study", "book", "eye", "food", "car", "stop", "hear", "never", "late", "grow",
  "story", "few", "hard", "both", "close", "life", "might", "clean", "talk", "sure",
  "friend", "begin", "river", "four", "carry", "state", "once", "walk", "press", "true"
];

export const MEDIUM_ENGLISH_WORDS: string[] = [
  ...EASY_ENGLISH_WORDS,
  "ability", "able", "aboard", "about", "above", "accept", "accident", "accord", "account", "across",
  "act", "action", "active", "actor", "actress", "actual", "adapt", "address", "admire", "admit",
  "adopt", "adult", "advance", "advantage", "adventure", "advice", "advise", "affair", "affect", "afford",
  "afraid", "afternoon", "agent", "agree", "agreement", "ahead", "airport", "alarm", "album", "alike",
  "alive", "allow", "almost", "alone", "along", "aloud", "alphabet", "already", "alter", "although",
  "altitude", "amaze", "ambition", "amount", "amuse", "ancient", "angel", "anger", "angle", "angry",
  "animal", "announce", "annoy", "annual", "answer", "anxious", "anybody", "anyhow", "anymore", "anyone",
  "anyplace", "anything", "anyway", "anywhere", "apart", "apartment", "apology", "appear", "appearance", "apple",
  "apply", "appoint", "approve", "apron", "arch", "arctic", "area", "argue", "argument", "arithmetic",
  "arm", "armor", "army", "around", "arrange", "arrangement", "arrest", "arrival", "arrive", "arrow",
  "article", "artificial", "artist", "ash", "ashamed", "aside", "asleep", "aspect", "assist", "assistance",
  "assistant", "associate", "association", "assume", "astonish", "athlete", "atmosphere", "attach", "attack", "attempt",
  "attend", "attention", "attitude", "attract", "attraction", "attractive", "audience", "author", "authority", "automatic",
  "automobile", "autumn", "avenue", "average", "avoid", "awake", "award", "aware", "awareness", "awkward",
  "dense", "density", "dentist", "depart", "depend", "deposit", "depress", "depth", "deputy", "derive",
  "descend", "describe", "description", "desert", "deserve", "design", "desire", "despair", "destination", "destroy",
  "detail", "detect", "determine", "develop", "device", "devote", "dialogue", "diamond", "diary", "dictate",
  "differ", "difference", "difficult", "digest", "digital", "dignity", "diminish", "dinner", "diplomat", "direct",
  "director", "disable", "disagree", "disaster", "discipline", "discover", "discuss", "disease", "disguise", "disgust",
  "dish", "dismiss", "disorder", "display", "dispute", "distance", "distant", "distinct", "distribute", "district",
  "disturb", "diverse", "divide", "division", "divorce", "doctrine", "document", "domain", "domestic", "dominant",
  "dominate", "donate", "doorway", "dormitory", "double", "doubt", "draft", "dragon", "drain", "drama",
  "drastic", "drawer", "dream", "dress", "drift", "drill", "drive", "driver", "drop", "drought",
  "drown", "drum", "drunk", "duplicate", "durable", "duration", "during", "dynamic", "eager", "early",
  "earnest", "earthquake", "eastern", "echo", "eclipse", "economy", "edge", "editor", "educate", "effect",
  "efficient", "effort", "elastic", "elder", "elect", "electric", "elegant", "element", "elephant", "elevate",
  "eligible", "eliminate", "elite", "embark", "embarrass", "embassy", "embrace", "emerge", "emergency", "emotion",
  "emphasis", "empire", "employ", "employee", "enable", "enclose", "encounter", "encourage", "endeavor", "endless",
  "endorse", "endure", "enemy", "energy", "enforce", "engage", "engine", "engineer", "enhance", "enormous",
  "enterprise", "entertain", "enthusiasm", "entire", "entitle", "envelope", "environment", "episode", "equal", "equip",
  "equity", "equivalent", "era", "erase", "erect", "erode", "errand", "error", "escape", "escort",
  "essence", "essential", "establish", "estate", "esteem", "estimate", "eternal", "evaluate", "evaporate", "event",
  "eventual", "everybody", "evidence", "evident", "evolution", "exact", "exaggerate", "examine", "example", "exceed",
  "excellent", "excess", "exchange", "excite", "exclude", "exclusive", "excursion", "execute", "executive", "exempt",
  "exercise", "exhaust", "exhibit", "exist", "existence", "expand", "expect", "expense", "expensive", "experience",
  "experiment", "expert", "explain", "explode", "explore", "export", "expose", "express", "extend", "extensive",
  "extent", "external", "extinct", "extra", "extract", "extreme", "fabric", "facility", "factor", "factory",
  "faculty", "fade", "failure", "faint", "fairly", "faith", "faithful", "familiar", "famous", "fancy",
  "fantastic", "farewell", "fascinate", "fashion", "fasten", "fatal", "fate", "fatigue", "favorable", "fearless",
  "feather", "feature", "federal", "feedback", "fellow", "female", "festival", "fiction", "fierce", "filter",
  "finance", "finger", "finish", "firm", "fiscal", "flame", "flash", "flat", "flavor", "flexible",
  "flight", "float", "flock", "flood", "floor", "flourish", "fluid", "flush", "focus", "folder",
  "folk", "follow", "fond", "footage", "forbid", "forecast", "forehead", "foreign", "forest", "forever",
  "forge", "forgive", "format", "formation", "former", "formula", "fortune", "forward", "fossil", "foster",
  "foundation", "fountain", "fraction", "fragment", "frame", "framework", "frank", "fraud", "freight", "frequency",
  "frequent", "friction", "frontier", "frost", "frown", "fruit", "frustrate", "fulfill", "function", "fundamental",
  "funeral", "furnace", "furnish", "furniture", "further", "futile", "gallery", "gamble", "garment", "gateway"
];

export const HARD_ENGLISH_WORDS: string[] = [
  "aberration", "acquiesce", "anachronistic", "antediluvian", "antithetical", "apprehensive",
  "archipelago", "assiduous", "belligerent", "cacophony", "capricious", "cathartic",
  "circumlocution", "clandestine", "commensurate", "concupiscence", "conflagration", "connoisseur",
  "conscientious", "deleterious", "demagogue", "diaphanous", "discomfiture", "disingenuous",
  "effervescent", "egregious", "elucidate", "ephemeral", "epistemology", "equivocal",
  "esoteric", "evanescent", "exacerbate", "exemplary", "fastidious", "grandiloquent",
  "harangue", "idiosyncrasy", "ignominious", "impecunious", "inchoate", "indefatigable",
  "ineffable", "ineluctable", "inexorable", "ingenious", "inimical", "insouciant",
  "intransigent", "inveterate", "juxtaposition", "laconic", "magnanimous", "malevolent",
  "mellifluous", "mendacious", "meretricious", "metamorphosis", "munificent", "nefarious",
  "obfuscate", "obsequious", "obstetrical", "omnipotent", "panacea", "paradigm",
  "parsimonious", "pedantic", "perfidious", "perfunctory", "perspicacious", "philanthropic",
  "plethora", "precocious", "prescience", "proclivity", "prognosticate", "propensity",
  "quagmire", "quandary", "querulous", "quixotic", "recalcitrant", "reciprocity",
  "redoubtable", "refulgent", "remonstrate", "reprehensible", "sagacious", "salubrious",
  "sanguine", "scintillating", "serendipity", "sycophant", "taciturn", "tautology",
  "ubiquitous", "umbrage", "unconscionable", "vacillate", "venerable", "verisimilitude",
  "vicissitude", "vilify", "vindicate", "vituperative", "vociferous", "zeitgeist"
];

export const HINGLISH_WORDS: string[] = [
  "namaste", "shukriya", "dost", "dosti", "yaar", "yaari", "pyaar", "mohabbat", "ishq", "dil",
  "zindagi", "safar", "musafir", "manzil", "sapna", "khwaab", "khwahish", "umeed", "bharosa", "vishwas",
  "mehnat", "kamyabi", "mushkil", "aasan", "khushi", "gham", "hasna", "rona", "sochna", "samajhna",
  "apna", "apnapan", "parivar", "ghar", "makaan", "gali", "mohalla", "shehar", "gao", "desh",
  "mitti", "khushboo", "hawa", "baarish", "badal", "bijli", "dhoop", "chhaon", "subah", "shaam",
  "raat", "chand", "suraj", "taare", "aasmaan", "zameen", "waqt", "zamaana", "pal", "lamha",
  "yaad", "yaadein", "baat", "baatein", "bolna", "sunna", "dekhna", "kehna", "puchhna", "batana",
  "chalna", "rukna", "daudna", "khelna", "jeet", "haar", "khiladi", "shuru", "khatam", "rasta",
  "mor", "kinara", "samandar", "lehar", "nadi", "jheel", "pahad", "choti", "darakht", "patta",
  "phool", "bahaar", "mausam", "chai", "coffee", "pani", "roti", "khana", "mithai", "swaad",
  "bhookh", "pyaas", "tazgi", "thand", "garmi", "sardi", "kapde", "rang", "roop", "tasveer",
  "aaina", "chehra", "aankhein", "muskaan", "hansi", "aansoo", "awaaz", "geet", "dhun", "sangeet",
  "kavita", "shayar", "shayari", "alfaaz", "lafz", "zubaan", "kalam", "kagaz", "kitaab", "kahani",
  "kissa", "sabak", "seekh", "gyan", "vidya", "guru", "shishya", "shiksha", "vidyalaya", "class",
  "dhyan", "lagan", "himmat", "hausla", "jazba", "junoon", "shauq", "irada", "hoshiyar", "samajhdar",
  "masoom", "seedha", "sach", "sachai", "jhooth", "farq", "fasla", "nazdeek", "door", "paas",
  "saath", "humsafar", "humdam", "rishta", "naata", "bandhan", "vachan", "kasam", "faisla", "kadam",
  "pehla", "aakhri", "koshish", "tajurba", "hunar", "kalakaar", "andaaz", "tevar", "shaan", "izzat",
  "adab", "tehzeeb", "tamiz", "suroor", "sukoon", "chain", "rahat", "dard", "marham", "dawa",
  "dua", "arzi", "ibadat", "khuda", "bhagwan", "kripa", "rehmat", "barkat", "nemat", "ehsaas",
  "ehsaan", "shukrana", "taarif", "sawaal", "jawaab", "paheli", "suljhana", "soch", "vichar", "nazaara",
  "drishti", "nazariya", "taaqat", "shakti", "bal", "shanti", "anand", "utsav", "tyohar",
  "masti", "mazaa", "hungama", "dhamaka", "jashn", "mehman", "khatir", "nawaazi", "daawat", "meetha",
  "namkeen", "chatpata", "tikha", "kadwa", "pankh", "udaan", "parwaz", "bulandi", "shikhar", "aagaaz",
  "anjaam", "dastak", "darwaza", "khidki", "chhat", "aangan", "roshni", "ujala", "andhera", "chhaya",
  "saaya", "khwaabida", "deewana", "mastana", "parwana", "shama", "jugnu", "veer",
  "yoddha", "dharohar", "parampara", "sanskaar", "maryada", "kartavya", "dharma", "karma", "kismat", "naseeb",
  "muqaddar", "taqdeer", "haath", "ungliyan", "pehchan", "wujood", "hasti", "duniya"
];

export const CODE_SNIPPETS: string[] = [
  "const numbers = [1, 2, 3, 4, 5]; const evens = numbers.filter(n => n % 2 === 0);",
  "function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }",
  "document.addEventListener('DOMContentLoaded', () => { const root = document.getElementById('app'); root.innerHTML = '<p>Ready</p>'; });",
  "async function fetchData(url) { try { const res = await fetch(url); return await res.json(); } catch (err) { console.error(err); } }",
  "const calculateWpm = (chars, seconds) => Math.round((chars / 5) / (seconds / 60));",
  "export class EventEmitter { constructor() { this.events = {}; } on(e, fn) { (this.events[e] = this.events[e] || []).push(fn); } }",
  "const memoize = fn => { const cache = new Map(); return x => cache.has(x) ? cache.get(x) : cache.set(x, fn(x)).get(x); };",
  "<div class=\"container flex mx-auto items-center justify-between p-4\"><h1 class=\"text-xl font-bold\">Header</h1></div>",
  ".btn:hover { background-color: var(--primary); transform: translateY(-2px); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }",
  "const sum = array.reduce((acc, curr) => acc + curr, 0); const avg = sum / array.length;",
  "<button type=\"button\" aria-label=\"Close modal\" onclick=\"handleClose()\"><span>&times;</span></button>",
  "const deepClone = obj => JSON.parse(JSON.stringify(obj)); const copy = deepClone(originalState);",
  "display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem;",
  "const uniqueValues = [...new Set(inputList.map(item => item.category))]; return uniqueValues.sort();",
  "window.requestAnimationFrame(() => { element.style.opacity = '1'; element.style.transform = 'none'; });",
  "const isPalindrome = str => { const clean = str.toLowerCase().replace(/[^a-z0-9]/g, ''); return clean === clean.split('').reverse().join(''); };",
  "try { const data = JSON.parse(raw); return { success: true, data }; } catch (e) { return { success: false, error: e.message }; }",
  "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);",
  "const mergeSortedArrays = (a, b) => [...a, ...b].sort((x, y) => x - y);",
  "const isPrime = n => { if (n <= 1) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };"
];

export const QUOTES: QuoteItem[] = [
  { id: "s1", category: "short", text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { id: "s2", category: "short", text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { id: "s3", category: "short", text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { id: "s4", category: "short", text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { id: "s5", category: "short", text: "Knowledge is power, but enthusiasm pulls the switch.", author: "Ivern Ball" },
  { id: "s6", category: "short", text: "Speed is a byproduct of clarity and smooth muscle memory.", author: "Typing Maxim" },
  { id: "s7", category: "short", text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { id: "s8", category: "short", text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { id: "s9", category: "short", text: "Code never lies, comments sometimes do.", author: "Ron Jeffries" },
  { id: "s10", category: "short", text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
  { id: "s11", category: "short", text: "Curiosity is the engine of intellectual achievement.", author: "Ken Robinson" },
  { id: "s12", category: "short", text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { id: "s13", category: "short", text: "Discipline equals freedom in both craft and thought.", author: "Jocko Willink" },
  { id: "s14", category: "short", text: "Focus is a muscle; the more you exercise it, the sharper it cuts.", author: "Anonymous Artisan" },
  { id: "s15", category: "short", text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { id: "s16", category: "short", text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { id: "s17", category: "short", text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { id: "s18", category: "short", text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { id: "s19", category: "short", text: "Stay hungry, stay foolish, and never stop refining your keystrokes.", author: "Steve Jobs" },
  { id: "s20", category: "short", text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { id: "s21", category: "short", text: "To understand recursion, one must first understand recursion.", author: "Traditional Proverb" },
  { id: "s22", category: "short", text: "Smooth is fast, and fast is smooth.", author: "Navigation Principle" },

  { id: "m1", category: "medium", text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { id: "m2", category: "medium", text: "Give a person a program and you frustrate them for a day; teach them to program and you frustrate them for a lifetime.", author: "David Leinweber" },
  { id: "m3", category: "medium", text: "The most disastrous thing that you can ever learn is your first programming language, because you will measure everything against it.", author: "Alan Kay" },
  { id: "m4", category: "medium", text: "Typing is not just striking keys on a board; it is the instantaneous projection of consciousness directly into the digital realm.", author: "Digital Philosophy" },
  { id: "m5", category: "medium", text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit formed through deliberate and steady practice.", author: "Will Durant" },
  { id: "m6", category: "medium", text: "The computer was born to solve problems that did not exist before, yet it has become the mirror in which we see human potential reflected.", author: "Bill Gates" },
  { id: "m7", category: "medium", text: "Optimism is an essential ingredient for innovation. How else can the individual welcome change over the security of the status quo?", author: "Robert Noyce" },
  { id: "m8", category: "medium", text: "Walking on water and developing software from a specification are easy if both are frozen into complete immobility.", author: "Edward V. Berard" },
  { id: "m9", category: "medium", text: "Real confidence does not stem from always being correct, but from not fearing the possibility of making mistakes and correcting them swiftly.", author: "Peter T. McIntyre" },
  { id: "m10", category: "medium", text: "The greatest glory in living lies not in never falling, but in rising every time we fall, stronger, calmer, and more deliberate than before.", author: "Nelson Mandela" },
  { id: "m11", category: "medium", text: "Code craft resembles architecture: a single misaligned bracket or load-bearing wall may cause the entire majestic structure to tumble.", author: "Systems Architecture Journal" },
  { id: "m12", category: "medium", text: "Touch typing transforms words from physical obstacles into pure rhythmic thought, flowing effortlessly from mind to screen without friction.", author: "The Craft of Keys" },
  { id: "m13", category: "medium", text: "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies.", author: "C.A.R. Hoare" },
  { id: "m14", category: "medium", text: "It is not the critic who counts; not the man who points out how the strong man stumbles, but the one who is actually in the arena.", author: "Theodore Roosevelt" },
  { id: "m15", category: "medium", text: "Technology is best when it brings people together and removes barriers between our intentions and their tangible realization.", author: "Matt Mullenweg" },
  { id: "m16", category: "medium", text: "If you cannot explain it simply, you do not understand it well enough. True mastery reveals itself in effortless clarity.", author: "Richard Feynman" },
  { id: "m17", category: "medium", text: "The illiterate of the twenty-first century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.", author: "Alvin Toffler" },
  { id: "m18", category: "medium", text: "In the middle of difficulty lies opportunity. Every misplaced character on your keyboard is a signpost toward greater dexterity.", author: "Reflective Typist" },
  { id: "m19", category: "medium", text: "To build a great tool is to respect the user's precious time, granting them wings instead of weight and clarity instead of clutter.", author: "Modern Interface Essays" },
  { id: "m20", category: "medium", text: "Mastering keystrokes is like tuning an instrument: each finger finds its home, and the symphony of ideas plays without hesitation.", author: "Ergonomics Quarterly" },
  { id: "m21", category: "medium", text: "A complex system that works is invariably found to have evolved from a simple system that worked. Begin humble and iterate relentlessly.", author: "John Gall" },
  { id: "m22", category: "medium", text: "Patience and perseverance have a magical effect before which difficulties disappear and obstacles vanish into thin air.", author: "John Quincy Adams" },

  { id: "l1", category: "long", text: "You cannot connect the dots looking forward; you can only connect them looking backward. So you have to trust that the dots will somehow connect in your future. You have to trust in something: your gut, destiny, life, karma, whatever. This approach has never let me down, and it has made all the difference in my life.", author: "Steve Jobs" },
  { id: "l2", category: "long", text: "Look at a stone cutter hammering away at his rock, perhaps a hundred times without as much as a crack showing in it. Yet at the hundred and first blow it will split in two, and I know it was not that blow that did it, but all that had gone before.", author: "Jacob Riis" },
  { id: "l3", category: "long", text: "The beauty of a mechanical switch keyboard lies not merely in its audible feedback, but in the tactile certainty it provides to the fingertips. With every bottoming out and spring rebound, the brain registers certainty, establishing a subconscious tempo that accelerates thought into uninterrupted prose.", author: "Mechanics of Input" },
  { id: "l4", category: "long", text: "Software engineering is a discipline where intangible ideas materialize into working systems. We build towering castles in the sky out of pure logic, where a misplaced semicolon can shake the battlements, yet a well-crafted abstraction can withstand decades of evolving demands.", author: "Frederick P. Brooks Jr." },
  { id: "l5", category: "long", text: "Speed without precision is like an unguided rocket: impressive in its fury, yet utterly unreliable in reaching its destination. The true master typist seeks accuracy first, knowing that once accuracy becomes instinctual, velocity follows as an effortless consequence.", author: "Typing Mastery Treatise" },
  { id: "l6", category: "long", text: "Far better is it to dare mighty things, to win glorious triumphs, even though checkered by failure, than to rank with those poor spirits who neither enjoy much nor suffer much, because they live in a gray twilight that knows not victory nor defeat.", author: "Theodore Roosevelt" },
  { id: "l7", category: "long", text: "The universe does not require our permission to be complex. As engineers and thinkers, our duty is to distill this complexity into modular, comprehensible fragments that human minds can cultivate, debug, and expand across generations.", author: "Cosmic Computation" },
  { id: "l8", category: "long", text: "It is not enough for code to run; it must sing. It must communicate intent with such elegance and lucidity that any developer reading it five years hence can step into the author's boots and immediately comprehend the underlying rationale.", author: "Clean Architecture Principles" }
];

export function generateTestTokens(options: {
  count?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'code';
  language?: 'english' | 'hinglish';
  punctuation?: boolean;
  numbers?: boolean;
}): string[] {
  const {
    count = 35,
    difficulty = 'easy',
    language = 'english',
    punctuation = false,
    numbers = false
  } = options;

  if (difficulty === 'code') {
    const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    return snippet.split(/\s+/).filter(Boolean);
  }

  let source: string[] = EASY_ENGLISH_WORDS;
  if (language === 'hinglish') {
    source = HINGLISH_WORDS;
  } else if (difficulty === 'hard') {
    source = HARD_ENGLISH_WORDS;
  } else if (difficulty === 'medium') {
    source = MEDIUM_ENGLISH_WORDS;
  }

  const tokens: string[] = [];
  const punctChars = [',', '.', '!', '?', ';', ':'];

  for (let i = 0; i < count; i++) {
    let word = source[Math.floor(Math.random() * source.length)];

    // Inject number occasionally if numbers option enabled
    if (numbers && Math.random() < 0.15) {
      word = String(Math.floor(Math.random() * 900) + 10);
    } else {
      // Capitalize first letter of word occasionally if punctuation is enabled
      if (punctuation && Math.random() < 0.2) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Add punctuation mark to word
      if (punctuation && Math.random() < 0.25) {
        const p = punctChars[Math.floor(Math.random() * punctChars.length)];
        word = word + p;
      }
    }
    tokens.push(word);
  }

  return tokens;
}
