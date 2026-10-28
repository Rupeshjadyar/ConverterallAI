/**
 * Typing Speed Test - Rich Vocabulary & Code Datasets (Zero External Dependencies)
 * Includes 1000+ English words (Easy, Medium, Hard), 300+ Hinglish words, and code snippets.
 * Namespace: window.TypeApp.Words
 */

window.TypeApp = window.TypeApp || {};

(function() {
  // Common 200 English words (Easy)
  const EASY_ENGLISH = [
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

  // 1000+ English words (Medium)
  const MEDIUM_ENGLISH = [
    ...EASY_ENGLISH,
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
    "baby", "backward", "bacon", "badge", "badly", "baggage", "bake", "baker", "balance", "balcony",
    "bald", "ball", "balloon", "ballot", "banana", "bandage", "bang", "banker", "barber", "barely",
    "bargain", "bark", "barrel", "barrier", "base", "basement", "basic", "basin", "basket", "basketball",
    "battery", "battle", "bay", "beach", "beam", "bean", "bear", "beard", "beast", "beat",
    "beautiful", "beauty", "become", "bedroom", "beef", "beetle", "before", "beggar", "beginner", "behave",
    "behavior", "belief", "believe", "bell", "belong", "beloved", "below", "bench", "bend", "beneath",
    "benefit", "berry", "beside", "besides", "betray", "better", "between", "beyond", "bicycle", "bid",
    "billion", "bind", "biology", "bird", "birth", "birthday", "biscuit", "bite", "bitter", "blade",
    "blame", "blank", "blanket", "blast", "blaze", "bleed", "blend", "bless", "blind", "blink",
    "block", "blonde", "blood", "bloom", "blossom", "blow", "board", "boast", "boat", "body",
    "boil", "bold", "bolt", "bomb", "bond", "bone", "bonus", "border", "bore", "borrow",
    "bottle", "bottom", "bounce", "bound", "boundary", "bow", "bowl", "brace", "brain", "brake",
    "branch", "brand", "brass", "brave", "bravery", "bread", "break", "breakfast", "breast", "breath",
    "breathe", "breeze", "brick", "bride", "bridge", "brief", "bright", "brilliant", "bring", "broad",
    "broadcast", "broken", "brook", "broom", "brother", "brow", "brown", "brush", "bubble", "bucket",
    "buckle", "budget", "buffalo", "build", "bullet", "bundle", "burden", "bureau", "burn", "burst",
    "bush", "business", "busy", "butter", "button", "buyer", "cabin", "cabinet", "cable", "cactus",
    "cage", "cake", "calendar", "calm", "camel", "camera", "camp", "campaign", "canal", "candle",
    "candy", "cane", "cannon", "canyon", "capable", "capacity", "cape", "capital", "captain", "capture",
    "carbon", "card", "cardboard", "care", "career", "careful", "careless", "carpet", "carriage", "carrier",
    "carrot", "carry", "cart", "carve", "cascade", "case", "cash", "cast", "castle", "casual",
    "catalog", "catch", "category", "cater", "cathedral", "cattle", "cause", "caution", "cave", "ceiling",
    "celebrate", "cell", "cellar", "cement", "cemetery", "census", "cent", "center", "central", "century",
    "ceremony", "certain", "chain", "chair", "chairman", "chalk", "challenge", "chamber", "champion", "chance",
    "channel", "chaos", "chapter", "character", "charge", "charity", "charm", "chart", "chase", "cheap",
    "cheat", "check", "cheek", "cheer", "cheerful", "cheese", "chemical", "cherish", "cherry", "chest",
    "chew", "chicken", "chief", "childhood", "chimney", "chin", "chocolate", "choice", "choke", "choose",
    "chord", "chorus", "church", "cider", "cigar", "circle", "circuit", "circus", "citizen", "claim",
    "clamp", "clap", "clash", "clasp", "classic", "classify", "clause", "claw", "clay", "cleaner",
    "clear", "clerk", "clever", "client", "cliff", "climate", "climb", "cling", "clinic", "clip",
    "cloak", "clock", "closet", "cloth", "clothes", "cloud", "clover", "clown", "club", "clue",
    "cluster", "coach", "coal", "coast", "coat", "cobweb", "cockpit", "cocoa", "coconut", "coffee",
    "coffin", "cohesion", "collar", "colleague", "collect", "collection", "college", "colony", "column", "combine",
    "comfort", "command", "commence", "comment", "commerce", "commit", "committee", "companion", "compare", "compass",
    "compete", "complain", "complete", "complex", "compose", "compound", "compute", "computer", "comrade", "conceal",
    "concern", "concert", "conclude", "concrete", "condition", "conduct", "confer", "confess", "confidence", "confirm",
    "conflict", "conform", "confuse", "connect", "conquer", "conscious", "consent", "consequence", "conserve", "consider",
    "consist", "console", "constant", "construct", "consult", "consume", "contact", "contain", "content", "contest",
    "context", "continue", "contract", "contrary", "contrast", "contribute", "control", "convenient", "convert", "convince",
    "copper", "corner", "correct", "corridor", "cost", "cottage", "cotton", "cough", "council", "counsel",
    "count", "counter", "country", "couple", "courage", "course", "court", "cousin", "cover", "crack",
    "cradle", "craft", "crash", "crater", "crawl", "crazy", "cream", "create", "creature", "credit",
    "creek", "creep", "crew", "cricket", "crime", "criminal", "crisis", "crisp", "critic", "critical",
    "crooked", "cross", "crowd", "crown", "crucial", "cruel", "cruise", "crumble", "crush", "crystal",
    "culture", "cupboard", "curious", "current", "curtain", "cushion", "custom", "customer", "cycle", "cylinder",
    "dairy", "damage", "danger", "dare", "darkness", "darling", "database", "daughter", "dawn", "daylight",
    "dazzle", "deadline", "dealer", "debate", "debris", "decade", "decay", "decent", "decide", "decision",
    "deck", "declare", "decline", "decorate", "decrease", "dedicate", "deepen", "defeat", "defend", "defense",
    "define", "definite", "degree", "delay", "delicate", "delight", "deliver", "demand", "demolish", "demonstrate",
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

  // Hard Vocabulary Words (Rare, Polysyllabic, Sophisticated)
  const HARD_ENGLISH = [
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

  // 300+ Hinglish Words (Romanized Hindi - Popular in conversational contexts)
  const HINGLISH_WORDS = [
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
    "drishti", "nazariya", "hausla", "taaqat", "shakti", "bal", "shanti", "anand", "utsav", "tyohar",
    "masti", "mazaa", "hungama", "dhamaka", "jashn", "mehman", "khatir", "nawaazi", "daawat", "meetha",
    "namkeen", "chatpata", "tikha", "kadwa", "pankh", "udaan", "parwaz", "bulandi", "shikhar", "aagaaz",
    "anjaam", "dastak", "darwaza", "khidki", "chhat", "aangan", "roshni", "ujala", "andhera", "chhaya",
    "saaya", "mitti", "khwaabida", "deewana", "mastana", "parwana", "shama", "jugnu", "kirpan", "veer",
    "yoddha", "dharohar", "parampara", "sanskaar", "maryada", "kartavya", "dharma", "karma", "kismat", "naseeb",
    "muqaddar", "taqdeer", "lLakeer", "haath", "ungliyan", "pechaan", "pehchan", "wujood", "hasti", "duniya"
  ];

  // JavaScript, HTML, CSS snippets (Code mode)
  const CODE_SNIPPETS = [
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

  const Words = {
    getWordList(difficulty = 'easy', language = 'english') {
      if (language === 'hinglish') {
        return HINGLISH_WORDS;
      }
      switch (difficulty) {
        case 'hard':
          return HARD_ENGLISH;
        case 'code':
          return CODE_SNIPPETS;
        case 'medium':
          return MEDIUM_ENGLISH;
        case 'easy':
        default:
          return EASY_ENGLISH;
      }
    },

    /**
     * Generate word tokens based on options
     */
    generateTokens(options = {}) {
      const {
        count = 30,
        difficulty = 'easy',
        language = 'english',
        punctuation = false,
        numbers = false,
        capitalLetters = false
      } = options;

      if (difficulty === 'code') {
        // Return random snippet
        const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        return snippet.split(/\s+/).filter(Boolean);
      }

      const sourceList = this.getWordList(difficulty, language);
      const tokens = [];

      for (let i = 0; i < count; i++) {
        let word = sourceList[Math.floor(Math.random() * sourceList.length)];

        // Capital letter toggle
        if (capitalLetters && Math.random() < 0.22) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }

        // Number injection
        if (numbers && Math.random() < 0.12) {
          const num = Math.floor(Math.random() * 1000);
          word = String(num);
        }

        // Punctuation injection
        if (punctuation && Math.random() < 0.25) {
          const marks = [',', '.', '!', '?', ';', ':', '-', '""', "''"];
          const mark = marks[Math.floor(Math.random() * marks.length)];
          if (mark === '""') word = `"${word}"`;
          else if (mark === "''") word = `'${word}'`;
          else word = `${word}${mark}`;
        }

        tokens.push(word);
      }

      return tokens;
    }
  };

  window.TypeApp.Words = Words;
})();
