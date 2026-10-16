export const gameTools = [
  {
    id: 'chess',
    name: 'Chess vs AI',
    slug: '/games/chess',
    categoryId: 'games',
    shortDesc: 'Challenge a Minimax AI at chess or play local 2-player with full legal rules.',
    fullDesc: 'Full-featured browser chess engine with Minimax AI, legal moves, castling, en passant, checkmate, and move history.',
    icon: '♟️',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: false,
    isAI: true,
    seoTitle: 'Play Chess Online Free - Smart AI Bot | ConverterAllAI',
    seoDescription: 'Play chess online free against smart AI bots or challenge friends locally. Complete legal rules with castling, en passant, undo moves, and zero downloads.',
    keywords: 'play chess online free, chess vs ai, online chess game, play chess against computer, 2 player chess free',
    h1: 'Play Chess Online Against Smart AI or Local Friend',
    intro: 'Sharpen your strategic intellect on the 64-square board. Test your opening repertoire and tactical endgames against our challenging Minimax AI engine, or enjoy a casual pass-and-play match with a friend directly in your browser.',
    howToSteps: [
      'Choose your preferred playing side (White or Black) and AI difficulty.',
      'Click or drag any piece to view highlighted legal destination squares.',
      'Execute your move and watch the AI engine counter-attack in real time.',
      'Utilize Undo or Flip Board buttons to analyze tactical opportunities.'
    ],
    features: [
      'Configurable AI difficulty levels utilizing Minimax search algorithms',
      'Full legal chess rules: castling, en passant, pawn promotion, checkmate',
      'Interactive move log history displaying standard algebraic notation',
      'Pass-and-play 2-player mode on the same desktop or mobile screen'
    ],
    faqs: [
      { q: 'How does the chess computer calculate its moves?', a: 'The computer evaluates board positions and calculates candidate moves ahead using the Minimax search algorithm with alpha-beta pruning.' },
      { q: 'Can I undo accidental blunders during a game?', a: 'Yes, an Undo button allows you to take back moves when practicing tactics or learning openings.' },
      { q: 'Does this chess game support standard tournament rules?', a: 'Yes, full FIDE rules including castling, en passant captures, pawn promotions to Queen/Rook/Bishop/Knight, and 50-move draws are implemented.' },
      { q: 'Do I need to install any software or plugins to play?', a: 'No, the entire chess game is coded in lightweight modern JavaScript and runs instantly in any web browser.' }
    ],
    relatedToolPaths: ['/games/sudoku', '/games/tic-tac-toe', '/games/memory-match', '/games/ludo']
  },
  {
    id: 'ludo',
    name: 'Ludo King Game',
    slug: '/games/ludo',
    categoryId: 'games',
    shortDesc: 'Classic Ludo board game for 2 to 4 players. Roll the dice and race tokens home.',
    fullDesc: 'Play the beloved Indian Ludo board game with friends or smart bots with authentic token captures and safety stars.',
    icon: '🎲',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: true,
    isAI: true,
    seoTitle: 'Play Ludo Online Free - Classic Board | ConverterAllAI',
    seoDescription: 'Play Ludo online free against smart AI bots or with friends. Roll the dice, capture tokens on the star board, and race home with no downloads required.',
    keywords: 'play ludo online free, ludo board game, ludo with friends, ludo game online, classic ludo india',
    h1: 'Classic Ludo Board Game - Play Against AI or Friends',
    intro: 'Relive the nostalgic thrill of India’s most beloved family board game. Roll the dice, unlock your tokens on a roll of six, knock opponents back to their base, and navigate the colored home straight to claim victory.',
    howToSteps: [
      'Select player count (2 to 4 players) and assign human or AI bot controllers.',
      'Click the 3D dice shaker to roll a number from 1 to 6 on your turn.',
      'Tap an eligible token to advance it clockwise along the colorful track.',
      'Safely reach the home triangle with all four tokens to win the match.'
    ],
    features: [
      'Authentic 4-color board layout (Red, Green, Yellow, Blue) with safety star squares',
      'Support for 2, 3, or 4 players with intelligent AI bot opponents',
      'Automated rule enforcement: rolling a 6 grants an extra bonus roll',
      'Responsive board scaling beautifully on mobile phones, tablets, and desktops'
    ],
    faqs: [
      { q: 'What is required to move a Ludo token out of the starting base?', a: 'You must roll a six on the dice to mobilize a token from the base onto the active track.' },
      { q: 'Can a token be captured while resting on a star square?', a: 'No, star squares are designated safe zones where tokens cannot be captured by opposing players.' },
      { q: 'What bonus happens when I capture an opponent’s token?', a: 'Capturing an opponent token sends their piece back to base and rewards you with an immediate bonus dice roll.' },
      { q: 'Can I play Ludo offline without an internet connection?', a: 'Once the page loads, local pass-and-play with friends or against AI bots operates without needing continuous internet.' }
    ],
    relatedToolPaths: ['/games/snakes-ladders', '/games/teen-do-paanch', '/games/teen-patti', '/games/chess']
  },
  {
    id: 'teen-patti',
    name: 'Teen Patti (3 Patti)',
    slug: '/games/teen-patti',
    categoryId: 'games',
    shortDesc: 'Play classic Indian 3 Patti card game against AI with Chaal and Blind bets.',
    fullDesc: 'Authentic Teen Patti card game with Trail, Pure Sequence, Color, and Pair hand rankings.',
    icon: '🃏',
    badge: 'HOT',
    isPopular: true,
    isLatest: false,
    isAI: true,
    seoTitle: 'Play Teen Patti Online Free - 3 Patti | ConverterAllAI',
    seoDescription: 'Play Teen Patti (3 Patti) card game online free against AI bots. Enjoy classic Chaal, Blind, Trail, and Sequence betting with zero real money risk.',
    keywords: 'play teen patti online free, 3 patti game, teen patti vs bot, indian poker game, flash card game free',
    h1: 'Play Classic Teen Patti (3 Patti) Card Game Free',
    intro: 'Enjoy India’s favorite festival card game risk-free. Challenge smart AI players in realistic rounds of Teen Patti, mastering Blind betting, Chaal raises, and hand rankings from High Card all the way to a rare Trio (Trail).',
    howToSteps: [
      'Receive your 3 dealt cards face down on the virtual felt table.',
      'Choose to play Blind for smaller bets or See your cards to play Chaal.',
      'Raise bets or Pack (fold) depending on the strength of your 3-card hand.',
      'Call for a Showdown when down to two players to reveal the winner and scoop the pot.'
    ],
    features: [
      'Authentic hand hierarchy: Trail (Set), Pure Sequence, Sequence, Color, Pair, High Card',
      'Realistic chip pot mechanics with Blind and Chaal betting controls',
      'Smart bot behaviors that bluff and calculate pot odds realistically',
      '100% free virtual chips with zero real-money gambling risk'
    ],
    faqs: [
      { q: 'What is the highest-ranking hand in Teen Patti?', a: 'The highest hand is a Trail (Trio/Set), consisting of three cards of the same rank (e.g., three Aces).' },
      { q: 'What is the difference between a Pure Sequence and a Sequence?', a: 'A Pure Sequence (Straight Flush) has three consecutive cards of the exact same suit; a regular Sequence has consecutive ranks in mixed suits.' },
      { q: 'Does this Teen Patti game involve real currency or gambling?', a: 'No. This is purely an entertainment and skill-building card game using free virtual points; no real money is ever involved.' },
      { q: 'Can I play Teen Patti on my smartphone browser?', a: 'Yes, the interface is touch-optimized for smooth gaming on Android and iPhone browsers.' }
    ],
    relatedToolPaths: ['/games/teen-do-paanch', '/games/chess', '/games/ludo', '/games/spelling-bee']
  },
  {
    id: 'teen-do-paanch',
    name: '3-2-5 Patte Wala',
    slug: '/games/teen-do-paanch',
    categoryId: 'games',
    shortDesc: 'Play classic Indian trick-taking card game 3-2-5 (Teen Do Paanch) with AI.',
    fullDesc: 'Authentic 30-card Indian trick-taking game where players must make 3, 2, and 5 hands respectively.',
    icon: '🂡',
    badge: 'NEW',
    isPopular: true,
    isLatest: true,
    isAI: true,
    seoTitle: 'Play 3-2-5 Card Game Online Free - Teen Do | ConverterAllAI',
    seoDescription: 'Play 3-2-5 (Teen Do Paanch) card game online free. Traditional Indian 30-card trick taking game against AI bots with trump bidding and zero signup.',
    keywords: 'play 3 2 5 online free, teen do paanch, 3 2 5 card game, indian trick taking card game, 30 card game india',
    h1: '3-2-5 (Teen Do Paanch) Traditional Indian Card Game',
    intro: 'Master the classic Indian trick-taking card game 3-2-5 (Teen Do Paanch). Played with a specialized 30-card deck, three players compete to capture their mandatory quota of 5, 3, and 2 tricks using trump suit strategy.',
    howToSteps: [
      'Check your assigned hand quota: Dealer must make 2, cutter makes 5, third player makes 3.',
      'The 5-hand player bids and selects the trump suit (Hukum).',
      'Follow suit on every trick or play trump cards when void in the lead suit.',
      'Capture your required trick quota or pull bonus cards from deficit players next round.'
    ],
    features: [
      'Authentic 30-card deck: 7s through Aces of all suits plus 7 of Hearts & 7 of Spades',
      'Accurate quota distribution: 5 (Cutter), 3 (Sharer), and 2 (Dealer)',
      'Intelligent trump selection and trick management by AI bot players',
      'Traditional card stealing rules when opponents fail their quota targets'
    ],
    faqs: [
      { q: 'Which cards are used in the 3-2-5 deck?', a: 'The game uses 30 cards: 8s, 9s, 10s, Jacks, Queens, Kings, and Aces across all four suits, plus the 7 of Hearts and 7 of Spades.' },
      { q: 'Who decides the trump suit in Teen Do Paanch?', a: 'The player required to make 5 hands has the privilege of selecting the trump suit after seeing their first 5 dealt cards.' },
      { q: 'What happens if a player wins more tricks than their quota?', a: 'Excess tricks allow that player to draw cards from any opponent who failed to meet their mandatory quota in the subsequent round.' },
      { q: 'Can I play this game solo against computer bots?', a: 'Yes, you play alongside two responsive computer bots that follow authentic Indian card play rules.' }
    ],
    relatedToolPaths: ['/games/teen-patti', '/games/ludo', '/games/snakes-ladders', '/games/chess']
  },
  {
    id: 'snakes-ladders',
    name: 'Saanp Seedi (Snakes & Ladders)',
    slug: '/games/snakes-ladders',
    categoryId: 'games',
    shortDesc: 'Classic Indian board game of Snakes & Ladders. Roll the dice and reach 100!',
    fullDesc: 'Traditional Saanp Seedi board game with animated dice rolls, climbing ladders, and sliding snakes.',
    icon: '🐍',
    badge: 'NEW',
    isPopular: true,
    isLatest: true,
    isAI: true,
    seoTitle: 'Play Snakes and Ladders Online Free - Saanp | ConverterAllAI',
    seoDescription: 'Play Snakes and Ladders (Saanp Seedi) online free. Climb ladders, dodge snakes, and race to 100 against smart AI bots with zero downloads needed.',
    keywords: 'play snakes and ladders online free, saanp seedi online, snakes and ladders board game, classic board game india, race to 100 game',
    h1: 'Saanp Seedi (Snakes & Ladders) Online Board Game',
    intro: 'Climb high on helpful ladders and watch out for sneaky snakes on square 99! Experience the classic 100-square Indian board game of Saanp Seedi against friends or friendly computer bots in your web browser.',
    howToSteps: [
      'Choose whether to play against the computer bot or a local friend.',
      'Click the dice to roll a number between 1 and 6.',
      'Watch your game token march forward across the numbered squares.',
      'Land precisely on square 100 to win the championship match.'
    ],
    features: [
      'Authentic 10x10 numbered grid with 100 colorful squares',
      'Animated ladders that shoot you upward and slippery snakes that drop you down',
      'Support for single-player against AI or pass-and-play multiplayer',
      'Realistic rolling sound effects and lively celebration animations'
    ],
    faqs: [
      { q: 'Where did the game Snakes and Ladders originate?', a: 'The game originated in ancient India as Moksha Patam, where ladders represented virtues and snakes represented vices.' },
      { q: 'Do you need an exact roll to land on square 100 and win?', a: 'Yes, you must roll the exact number needed to land directly on 100; higher rolls bounce backward.' },
      { q: 'Can I play with family members on the same tablet or laptop?', a: 'Yes, the turn-based design makes it perfect for sharing a single screen with children and friends.' },
      { q: 'Does this game require any software download?', a: 'No, it loads and plays instantly in any modern web browser.' }
    ],
    relatedToolPaths: ['/games/ludo', '/games/teen-do-paanch', '/games/tic-tac-toe', '/games/memory-match']
  },
  {
    id: 'spelling-bee',
    name: 'Spelling Master (Word Game)',
    slug: '/games/spelling-bee',
    categoryId: 'games',
    shortDesc: 'Test your vocabulary and spelling skills by guessing hidden words.',
    fullDesc: 'Engaging daily vocabulary and spelling challenge with letter hints, anagram puzzles, and score tracking.',
    icon: '🐝',
    badge: 'NEW',
    isPopular: true,
    isLatest: true,
    isAI: false,
    seoTitle: 'Play Spelling Bee Online Free - Word Game | ConverterAllAI',
    seoDescription: 'Play Spelling Bee and vocabulary word games online for free. Test spelling skills, solve anagrams, and expand your lexicon with instant browser scoring.',
    keywords: 'play spelling bee online free, word puzzle game, spelling master online, vocabulary game free, anagram word game',
    h1: 'Spelling Master & Daily Vocabulary Word Puzzle Game',
    intro: 'Put your language dexterity to the test. Combine letters to discover hidden words, sharpen your English spelling, and climb through apprentice to genius difficulty rankings in this stimulating daily word puzzle.',
    howToSteps: [
      'Examine the center mandatory letter and outer surrounding letter hive.',
      'Type or click letters to form words of 4 or more letters.',
      'Submit valid English words to earn score points and discover the Pangram.',
      'Track your progress bar from Beginner up to Genius master ranking.'
    ],
    features: [
      'Comprehensive verified English dictionary recognizing thousands of words',
      'Pangram bonus scoring when you utilize every hive letter in a single word',
      'Instant feedback on valid words, duplicates, and spelling errors',
      'Daily curated letter sets providing endless brain training fun'
    ],
    faqs: [
      { q: 'What is a Pangram in a spelling bee game?', a: 'A Pangram is a special word that uses every single letter in the game hive at least once, scoring major bonus points.' },
      { q: 'What are the core rules for valid words?', a: 'Words must be at least 4 letters long, must contain the center letter, and letters can be reused multiple times.' },
      { q: 'Can this game help students improve English vocabulary?', a: 'Yes, it is a fun, proven way for students and language learners to discover new words and reinforce accurate spelling.' },
      { q: 'Does the game save my progress if I close the tab?', a: 'Your current session score and discovered words are saved in your browser so you can resume anytime.' }
    ],
    relatedToolPaths: ['/games/sudoku', '/typing-master', '/games/memory-match', '/games/chess']
  },
  {
    id: 'sudoku',
    name: 'Sudoku Master',
    slug: '/games/sudoku',
    categoryId: 'games',
    shortDesc: 'Solve classic 9x9 Sudoku puzzles with notes, hints, and error checking.',
    fullDesc: 'Interactive logic puzzle game with Easy, Medium, Hard, and Expert difficulties, pencil marks, and timer.',
    icon: '🔢',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: false,
    isAI: false,
    seoTitle: 'Play Sudoku Online Free - Easy to Expert | ConverterAllAI',
    seoDescription: 'Play classic 9x9 Sudoku puzzles online free. Enjoy Easy, Medium, Hard, and Expert levels with pencil notes, auto error checking, and timer tracking.',
    keywords: 'play sudoku online free, 9x9 sudoku puzzle, daily sudoku free, sudoku easy to expert, number logic game',
    h1: 'Classic 9x9 Sudoku Logic Puzzle - Easy to Expert',
    intro: 'Exercise your logical reasoning with classic 9x9 Sudoku puzzles. With pencil notes, smart conflict highlighting, and four balanced difficulty levels from beginner to master, enjoying daily brain puzzles has never been easier.',
    howToSteps: [
      'Select your challenge level (Easy, Medium, Hard, or Expert).',
      'Click an empty cell and type digits 1 through 9 using keypad or keyboard.',
      'Toggle Pencil Mode to jot down tentative candidate numbers in cells.',
      'Fill all 81 squares without repeating any digit in any row, column, or 3x3 box.'
    ],
    features: [
      'Four balanced difficulty tiers: Easy, Medium, Hard, and Expert',
      'Pencil note taking mode with automatic candidate cleanup on entry',
      'Duplicate conflict highlighting preventing unintentional rule violations',
      'Built-in timer and mistake counter for personal achievement tracking'
    ],
    faqs: [
      { q: 'What are the basic rules of Sudoku?', a: 'You must fill the 9x9 grid so that every row, every column, and each of the nine 3x3 subgrids contains all digits from 1 to 9 without repetition.' },
      { q: 'Do all generated puzzles have a unique solution?', a: 'Yes, all boards are guaranteed to possess a single, unique, logically deducible solution.' },
      { q: 'How does Pencil Mode assist in solving hard Sudokus?', a: 'Pencil Mode lets you write multiple tiny candidate digits inside a cell to track possibilities before committing to a final number.' },
      { q: 'Can I play Sudoku offline on my mobile device?', a: 'Yes, once loaded the puzzle engine works completely offline in your browser.' }
    ],
    relatedToolPaths: ['/games/chess', '/games/spelling-bee', '/games/memory-match', '/games/tic-tac-toe']
  },
  {
    id: 'snake',
    name: 'Classic Snake Game',
    slug: '/games/snake',
    categoryId: 'games',
    shortDesc: 'Retro arcade snake game. Eat apples, grow longer, and beat your high score.',
    fullDesc: 'Nostalgic Nokia-style snake game with smooth 60fps controls, wall wrap options, and high score tracking.',
    icon: '🐍',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: false,
    isAI: false,
    seoTitle: 'Play Snake Online Free - Retro 60FPS Game | ConverterAllAI',
    seoDescription: 'Play classic retro Snake game online free. Guide the hungry snake, gobble apples, grow longer, and beat high scores with smooth arrow or swipe controls.',
    keywords: 'play snake online free, retro snake game, nokia snake classic, snake arcade 60fps, eat apple snake game',
    h1: 'Retro Arcade Snake Game - Classic Nokia Nostalgia',
    intro: 'Relive the golden era of arcade gaming. Slither across the screen, munch bright red apples to grow longer, and test your reflexes to see how long you can survive without colliding into walls or your own tail.',
    howToSteps: [
      'Use arrow keys (or W, A, S, D) or swipe gestures on touchscreens to steer.',
      'Direct your snake toward apples to grow in length and boost your score.',
      'Avoid running into screen boundaries or crashing into your own coiled tail.',
      'Beat your personal best score and challenge your friends.'
    ],
    features: [
      'Crisp 60 FPS retro graphics with authentic arcade sound effects',
      'Responsive keyboard controls and mobile touch swipe steering',
      'Local high score persistence to track all-time personal records',
      'Progressive speed acceleration as your snake grows longer'
    ],
    faqs: [
      { q: 'How do I steer the snake on mobile devices?', a: 'Swipe your finger up, down, left, or right on the game canvas to change direction.' },
      { q: 'Does the snake speed up as the score increases?', a: 'Yes, every time the snake consumes food, it slightly accelerates, raising the adrenaline and challenge.' },
      { q: 'What happens when the snake crashes into itself?', a: 'Colliding with your own body ends the round and records your final score.' },
      { q: 'Can I pause the game mid-session?', a: 'Yes, pressing the Spacebar pauses and resumes gameplay instantly.' }
    ],
    relatedToolPaths: ['/games/brick-breaker', '/games/pong', '/games/frontline-survivor', '/games/warfare-3000']
  },
  {
    id: 'memory-match',
    name: 'Memory Card Match',
    slug: '/games/memory-match',
    categoryId: 'games',
    shortDesc: 'Flip cards and match pairs to test and train your visual memory.',
    fullDesc: 'Cognitive brain trainer with colorful emoji card pairs, move counters, and star rating evaluations.',
    icon: '🃏',
    badge: 'FREE',
    isPopular: false,
    isLatest: false,
    isAI: false,
    seoTitle: 'Play Memory Match Online Free - Brain Cards | ConverterAllAI',
    seoDescription: 'Play Memory Match card game online free. Flip cards, find matching pairs, and sharpen visual memory with fun brain training puzzles for all ages.',
    keywords: 'play memory match online free, memory card game, brain training game, matching pairs puzzle, concentration card game',
    h1: 'Memory Card Match - Visual Brain Training Game',
    intro: 'Give your brain a fun workout with our interactive Memory Card Match puzzle. Flip hidden cards, memorize their positions, and match identical pairs in the fewest moves possible to earn a 3-star rating.',
    howToSteps: [
      'Click or tap any face-down card to reveal its hidden illustration.',
      'Tap a second card to see if it matches the first card.',
      'If matching, the pair stays open; otherwise, both cards flip back down.',
      'Clear the entire board in minimum moves to earn a high score.'
    ],
    features: [
      'Engaging emoji and icon card decks that delight players of all ages',
      'Move counter and timer tracking your cognitive efficiency',
      '3-star performance grading based on speed and move economy',
      'Clean interface running smoothly on phones, tablets, and computers'
    ],
    faqs: [
      { q: 'How does playing memory card games benefit the brain?', a: 'Matching games enhance short-term visual memory, focus, pattern recognition, and cognitive concentration.' },
      { q: 'Are cards reshuffled every time I play a new game?', a: 'Yes, board grids are randomized dynamically so every game presents a fresh challenge.' },
      { q: 'Can children play this memory game easily?', a: 'Yes, the simple rules and vibrant card icons make it suitable and educational for young kids.' },
      { q: 'Does this game require any software download?', a: 'No, it loads and plays instantly in any modern web browser.' }
    ],
    relatedToolPaths: ['/games/spelling-bee', '/games/sudoku', '/games/tic-tac-toe', '/games/chess']
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe Pro',
    slug: '/games/tic-tac-toe',
    categoryId: 'games',
    shortDesc: 'Play classic Xs and Os against unbeatable AI or challenge a friend.',
    fullDesc: 'Quick 3x3 strategy game featuring smart Minimax bot, score counters, and local two-player mode.',
    icon: '❌',
    badge: 'FREE',
    isPopular: false,
    isLatest: false,
    isAI: true,
    seoTitle: 'Play Tic Tac Toe Online Free - Xs and Os | ConverterAllAI',
    seoDescription: 'Play Tic Tac Toe online free against unbeatable AI or play 2-player with a friend. Classic Xs and Os puzzle with score tracking and zero downloads.',
    keywords: 'play tic tac toe online free, xs and os online, noughts and crosses, tic tac toe vs ai, 2 player tic tac toe',
    h1: 'Tic Tac Toe Pro - Play Xs and Os vs AI or Friend',
    intro: 'The quintessential game of Xs and Os in your browser. Test whether you can outsmart our mathematically unbeatable Minimax computer, or enjoy quick 2-player duels with friends on the same screen.',
    howToSteps: [
      'Choose your playing symbol (X goes first, O goes second).',
      'Select single player mode vs AI or two-player local match.',
      'Take turns clicking empty grid squares to place your mark.',
      'Align three marks in a horizontal, vertical, or diagonal line to win.'
    ],
    features: [
      'Unbeatable AI mode powered by Minimax game theory',
      'Casual 2-player pass-and-play mode on the same device',
      'Continuous match scoreboard tracking Wins, Losses, and Draws',
      'Instant restart button for fast-paced rematches'
    ],
    faqs: [
      { q: 'Can the Hard AI in Tic Tac Toe ever be beaten?', a: 'Under optimal Minimax play, Tic Tac Toe is a solved game; the best human result against perfect play is a tie/draw.' },
      { q: 'Who goes first in standard Tic Tac Toe?', a: 'Traditionally, the player placing X takes the first move.' },
      { q: 'How many total winning lines exist on a 3x3 grid?', a: 'There are 8 possible winning alignments: 3 horizontal rows, 3 vertical columns, and 2 diagonals.' },
      { q: 'Does this game work on smartphones?', a: 'Yes, big touchable buttons provide a great playing experience on mobile screens.' }
    ],
    relatedToolPaths: ['/games/chess', '/games/memory-match', '/games/ludo', '/games/snakes-ladders']
  },
  {
    id: 'brick-breaker',
    name: 'Brick Breaker Arcade',
    slug: '/games/brick-breaker',
    categoryId: 'games',
    shortDesc: 'Classic arcade paddle & ball game. Smash colorful bricks and catch powerups.',
    fullDesc: 'High-energy Breakout arcade game with bouncy physics, multi-hit bricks, and power-up drops.',
    icon: '🧱',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: false,
    isAI: false,
    seoTitle: 'Play Brick Breaker Free - Arcade Ball | ConverterAllAI',
    seoDescription: 'Play Brick Breaker arcade game online free. Bounce balls, smash colorful bricks, collect power-ups, and beat levels with smooth mouse or touch controls.',
    keywords: 'play brick breaker online free, breakout arcade game, smash bricks game, paddle and ball game, retro brick breaker',
    h1: 'Classic Brick Breaker & Breakout Arcade Game',
    intro: 'Relive the high-speed thrill of classic 80s arcade action. Steer your paddle with mouse or touch, rebound bouncing balls, demolish walls of colorful bricks, and grab falling power-up capsules.',
    howToSteps: [
      'Move your paddle left and right using your mouse, arrow keys, or touch.',
      'Launch the ball to shatter bricks at the top of the arena.',
      'Prevent the ball from dropping beneath your bottom paddle.',
      'Clear all bricks to advance to higher and faster levels.'
    ],
    features: [
      'Dynamic physics rebounding balls based on paddle strike angle',
      'Exciting power-ups: multi-ball, wide paddle, laser blaster, and speed boost',
      'Multi-hit armored bricks requiring multiple impacts to destroy',
      '60 FPS canvas rendering with retro arcade sound effects'
    ],
    faqs: [
      { q: 'How do I aim the ball in Brick Breaker?', a: 'Hitting the ball with the outer edges of your paddle angles it sharply sideways; hitting with the center rebounds it straighter.' },
      { q: 'What happens when I miss the ball?', a: 'Missing the ball costs you one life; you typically have 3 lives before game over.' },
      { q: 'Can I control the paddle with touch on mobile phones?', a: 'Yes, dragging your finger smoothly slides the paddle beneath the ball on mobile touchscreens.' },
      { q: 'Are there multiple levels to complete?', a: 'Yes, clearing the brick formation advances you to more challenging brick layouts with faster ball speeds.' }
    ],
    relatedToolPaths: ['/games/pong', '/games/snake', '/games/frontline-survivor', '/games/warfare-3000']
  },
  {
    id: 'pong',
    name: 'Retro Pong',
    slug: '/games/pong',
    categoryId: 'games',
    shortDesc: 'The grandfather of video games. Play table tennis against AI or a friend.',
    fullDesc: 'Faithful recreation of the 1972 arcade classic with smooth physics, paddle spin, and sound.',
    icon: '🏓',
    badge: 'FREE',
    isPopular: false,
    isLatest: false,
    isAI: true,
    seoTitle: 'Play Pong Online Free - Retro Table Tennis | ConverterAllAI',
    seoDescription: 'Play classic retro Pong game online free. Compete in vintage table tennis against computer AI or challenge a friend in 2-player mode with zero downloads.',
    keywords: 'play pong online free, retro pong game, 1972 pong arcade, table tennis video game, 2 player pong free',
    h1: 'Retro Pong - The Original 1972 Arcade Table Tennis',
    intro: 'Step back to the dawn of electronic gaming. Control digital paddles, return high-speed balls with tactical English spin, and battle against the computer or a friend in this timeless table tennis duel.',
    howToSteps: [
      'Choose between 1-Player vs AI or 2-Player local match.',
      'Control your paddle using Up/Down arrow keys or touch slider.',
      'Deflect the bouncing ball past your opponent’s goal line to score.',
      'First player to reach 10 points wins the championship.'
    ],
    features: [
      'Faithful retro aesthetic honoring the classic 1972 arcade sensation',
      'Authentic paddle collision physics allowing sharp angle returns',
      'Smooth single-player computer opponent that adjusts to your rallies',
      'Split-keyboard 2-player mode for instant local tabletop faceoffs'
    ],
    faqs: [
      { q: 'How do you create ball spin or steep angles in Pong?', a: 'Move your paddle while making contact with the ball; striking while in motion imparts velocity and alters the return angle.' },
      { q: 'Can two people play on the same keyboard?', a: 'Yes, Player 1 uses W/S keys on the left and Player 2 uses Up/Down arrow keys on the right.' },
      { q: 'Does the ball speed up during long rallies?', a: 'Yes, each consecutive paddle volley slightly increases ball speed until someone scores.' },
      { q: 'Does this game require high computer specs?', a: 'No, it runs at flawless 60 FPS on virtually any device or browser.' }
    ],
    relatedToolPaths: ['/games/brick-breaker', '/games/snake', '/games/tic-tac-toe', '/games/chess']
  },
  {
    id: 'frontline-survivor',
    name: 'Frontline Survivor (3D FPS)',
    slug: '/games/frontline-survivor',
    categoryId: 'games',
    shortDesc: '3D first-person survival shooter with pointer-lock aim and laser shooting.',
    fullDesc: 'First-person 3D survival arena shooter powered by Three.js with pointer-lock mouse aim, WASD movement, and sentry bot waves.',
    icon: '🪖',
    badge: '3D FPS',
    isPopular: true,
    isLatest: true,
    isAI: true,
    seoTitle: 'Play 3D FPS Online Free - Survival Shooter | ConverterAllAI',
    seoDescription: 'Play Frontline Survivor 3D FPS game online free in browser. Experience pointer-lock mouse aim, WASD movement, and intense robot wave survival with Three.js.',
    keywords: 'play 3d fps online free, browser first person shooter, three js 3d game, survival shooter web, free 3d fps game',
    h1: 'Frontline Survivor - 3D First-Person Survival Shooter',
    intro: 'Immerse yourself in full 3D combat directly inside your web browser. Built on Three.js, Frontline Survivor gives you genuine first-person shooter controls with pointer-lock mouse aim, sprinting, jumping, and raycast shooting against waves of robotic sentries.',
    howToSteps: [
      'Click Play to engage Pointer-Lock mouse aim in your browser.',
      'Use WASD keys to move, Shift to sprint, and Spacebar to jump.',
      'Left-click to fire your plasma rifle at incoming enemy bot waves.',
      'Collect dropped health packs and survive as many combat waves as possible.'
    ],
    features: [
      'Real 3D graphics and spatial audio powered by WebGL and Three.js',
      'True first-person camera with smooth pointer-lock mouse aim',
      'Dynamic wave-based enemy bot AI pathfinding and laser attacks',
      'Runs completely in browser with no executable downloads required'
    ],
    faqs: [
      { q: 'What is Pointer Lock and why is it needed for 3D FPS games?', a: 'Pointer Lock locks your mouse cursor to the game window, enabling infinite 360-degree camera rotation just like desktop shooters.' },
      { q: 'How do I release my mouse cursor from the game?', a: 'Press the Escape (Esc) key on your keyboard at any time to unlock your mouse.' },
      { q: 'Does this 3D shooter require a dedicated graphics card?', a: 'Any modern laptop, desktop, or tablet with WebGL hardware acceleration can run it smoothly.' },
      { q: 'Do I have to install Steam or any launcher to play?', a: 'No, it launches and plays directly inside your web browser.' }
    ],
    relatedToolPaths: ['/games/warfare-3000', '/games/snake', '/games/brick-breaker', '/games/chess']
  },
  {
    id: 'warfare-3000',
    name: 'Warfare 3000 (Tank Arena)',
    slug: '/games/warfare-3000',
    categoryId: 'games',
    shortDesc: '2D arena multiplayer tank battle. Drive, aim cannon & climb leaderboard.',
    fullDesc: 'Real-time 2D tank battle arena with live multiplayer leaderboard, twin-stick controls, and explosive combat.',
    icon: '⚔️',
    badge: 'NEW',
    isPopular: true,
    isLatest: true,
    isAI: true,
    seoTitle: 'Play Tank Arena Online Free - 2D Combat | ConverterAllAI',
    seoDescription: 'Play Warfare 3000 tank arena battle online free. Steer armored tanks, blast enemy cannons, and climb the live combat leaderboard with zero downloads.',
    keywords: 'play tank game online free, tank arena battle, 2d multiplayer shooter, armored tank combat, war tank io game',
    h1: 'Warfare 3000 - 2D Armored Tank Arena Shooter',
    intro: 'Command an armored tank in an explosive 2D combat arena. Maneuver through obstacle mazes, bounce cannon shells off barriers, outflank rival tanks, and climb to the top of the live combat leaderboard.',
    howToSteps: [
      'Steer your tank using WASD keys or virtual on-screen joystick.',
      'Aim your cannon turret with the mouse or secondary touch stick.',
      'Fire explosive shells to obliterate enemy armor before they corner you.',
      'Score combat kills to upgrade tank firepower and claim the #1 ranking.'
    ],
    features: [
      'Fast-paced 60 FPS 2D tank physics with turret rotation',
      'Interactive arena walls that ricochet cannon projectiles',
      'Live battle leaderboard displaying top tank commanders',
      'Twin-stick virtual gamepad support on mobile touchscreen devices'
    ],
    faqs: [
      { q: 'Can cannon shells bounce off arena walls?', a: 'Yes, shells ricochet off solid bunker walls once, allowing clever trick-shot bank angles around corners.' },
      { q: 'How do I aim and steer independently?', a: 'Your chassis moves with keyboard WASD while your turret independently tracks your mouse cursor position.' },
      { q: 'Can I play Warfare 3000 on mobile devices?', a: 'Yes, twin-stick on-screen controls appear automatically on mobile touchscreens.' },
      { q: 'Are there any registration fees or downloads?', a: 'No, it is completely free to play directly in your web browser.' }
    ],
    relatedToolPaths: ['/games/frontline-survivor', '/games/brick-breaker', '/games/snake', '/games/pong']
  }
];
