/**
 * Typing Speed Test - Touch Typing Curriculum (32 Structured Lessons)
 * Covers home row, top row, bottom row, stretches, numbers, symbols, n-grams, and speed drills.
 * Namespace: window.TypeApp.Lessons
 */

window.TypeApp = window.TypeApp || {};

(function() {
  const LESSONS = [
    // --- STAGE 1: HOME ROW FUNDAMENTALS ---
    {
      id: 1,
      stage: "Stage 1: Home Row",
      title: "The Home Keys: F and J",
      keysCovered: ["f", "j", "space"],
      text: "f j fj jf ff jj fjf jfj ff jj f j f j ffjj jjff fff jjj fjfj jfjf",
      targetWpm: 15,
      targetAccuracy: 90,
      instructions: "Place your left index finger on F and right index finger on J. Feel the small raised bump on each key.",
      fingerTips: "Left Index (F), Right Index (J), Either Thumb (Space)."
    },
    {
      id: 2,
      stage: "Stage 1: Home Row",
      title: "D and K: Middle Fingers",
      keysCovered: ["d", "k", "f", "j"],
      text: "d k dk kd ddk kkd fjd kjf ddf kkj dfjk kjfd djkf fkd fjd fjk dkfj",
      targetWpm: 18,
      targetAccuracy: 90,
      instructions: "Keep index fingers on F and J. Place left middle finger on D, and right middle finger on K.",
      fingerTips: "Left Middle (D), Right Middle (K)."
    },
    {
      id: 3,
      stage: "Stage 1: Home Row",
      title: "S and L: Ring Fingers",
      keysCovered: ["s", "l", "d", "k", "f", "j"],
      text: "s l sl ls ssl lss sdk lkf fsl jls skld dlks lksd fjsl lsjf ss ll",
      targetWpm: 18,
      targetAccuracy: 90,
      instructions: "Left ring finger rests on S. Right ring finger rests on L.",
      fingerTips: "Left Ring (S), Right Ring (L)."
    },
    {
      id: 4,
      stage: "Stage 1: Home Row",
      title: "A and Semicolon: Pinky Fingers",
      keysCovered: ["a", ";", "s", "l", "d", "k", "f", "j"],
      text: "a ; a; ;a asdf ;lkj asdf ;lkj a s d f j k l ; asdf ;lkj fads jkl;",
      targetWpm: 20,
      targetAccuracy: 90,
      instructions: "Left pinky rests on A. Right pinky rests on semicolon (;). Your hands are now in the standard Home Row position!",
      fingerTips: "Left Pinky (A), Right Pinky (;)."
    },
    {
      id: 5,
      stage: "Stage 1: Home Row",
      title: "Home Row Words & Drills",
      keysCovered: ["a", "s", "d", "f", "j", "k", "l", ";"],
      text: "sad lad dad fall ask all salad flask salsa alas lad lass fall dads",
      targetWpm: 22,
      targetAccuracy: 92,
      instructions: "Type complete real words using only home row keys. Do not look down at the keyboard.",
      fingerTips: "Keep all eight fingers lightly resting above the home row."
    },

    // --- STAGE 2: TOP ROW EXPANSIONS ---
    {
      id: 6,
      stage: "Stage 2: Top Row",
      title: "E and I: Middle Finger Reach",
      keysCovered: ["e", "i"],
      text: "e i ed ik de ki ded kik fee led kid lie die dill seek leaf side",
      targetWpm: 22,
      targetAccuracy: 90,
      instructions: "Reach left middle finger up to E and right middle finger up to I. Return immediately to D and K.",
      fingerTips: "Left Middle moves D -> E. Right Middle moves K -> I."
    },
    {
      id: 7,
      stage: "Stage 2: Top Row",
      title: "R and U: Index Finger Reach",
      keysCovered: ["r", "u"],
      text: "r u fr ju rf uj red fur run jar sir rid air rule sure dark fire",
      targetWpm: 24,
      targetAccuracy: 90,
      instructions: "Reach left index finger up to R and right index finger up to U. Snap back to F and J.",
      fingerTips: "Left Index moves F -> R. Right Index moves J -> U."
    },
    {
      id: 8,
      stage: "Stage 2: Top Row",
      title: "T and Y: Extended Index Reach",
      keysCovered: ["t", "y"],
      text: "t y ft jy tf yj yet try day tea tray stay you dry tidy fact easy",
      targetWpm: 24,
      targetAccuracy: 90,
      instructions: "Reach left index up and right to T. Reach right index up and left to Y.",
      fingerTips: "Left Index moves F -> T. Right Index moves J -> Y."
    },
    {
      id: 9,
      stage: "Stage 2: Top Row",
      title: "W and O: Ring Finger Reach",
      keysCovered: ["w", "o"],
      text: "w o sw lo ws ol who how row low out wood work slow look word soil",
      targetWpm: 24,
      targetAccuracy: 90,
      instructions: "Left ring finger reaches up to W. Right ring finger reaches up to O.",
      fingerTips: "Left Ring moves S -> W. Right Ring moves L -> O."
    },
    {
      id: 10,
      stage: "Stage 2: Top Row",
      title: "Q and P: Pinky Finger Reach",
      keysCovered: ["q", "p"],
      text: "q p aq ;p qa p; quit play plot quiet open page drip push keep pass",
      targetWpm: 24,
      targetAccuracy: 90,
      instructions: "Left pinky reaches up to Q. Right pinky reaches up to P.",
      fingerTips: "Left Pinky moves A -> Q. Right Pinky moves ; -> P."
    },

    // --- STAGE 3: BOTTOM ROW EXPANSIONS ---
    {
      id: 11,
      stage: "Stage 3: Bottom Row",
      title: "V and M: Index Finger Down",
      keysCovered: ["v", "m"],
      text: "v m fv jm vf mj vim view move time make save calm form over farm",
      targetWpm: 25,
      targetAccuracy: 90,
      instructions: "Reach left index down to V. Reach right index down to M.",
      fingerTips: "Left Index moves F -> V. Right Index moves J -> M."
    },
    {
      id: 12,
      stage: "Stage 3: Bottom Row",
      title: "C and Comma: Middle Finger Down",
      keysCovered: ["c", ","],
      text: "c , dc k, cd ,k cat cold call care face race cup ice, fact, clean,",
      targetWpm: 25,
      targetAccuracy: 90,
      instructions: "Reach left middle finger down to C. Reach right middle finger down to comma (,).",
      fingerTips: "Left Middle moves D -> C. Right Middle moves K -> comma (,)."
    },
    {
      id: 13,
      stage: "Stage 3: Bottom Row",
      title: "X and Period: Ring Finger Down",
      keysCovered: ["x", "."],
      text: "x . sx l. xs .l mix fix next text exit wax box. six. fox. six tax.",
      targetWpm: 25,
      targetAccuracy: 90,
      instructions: "Reach left ring finger down to X. Reach right ring finger down to period (.).",
      fingerTips: "Left Ring moves S -> X. Right Ring moves L -> period (.)."
    },
    {
      id: 14,
      stage: "Stage 3: Bottom Row",
      title: "Z and Slash: Pinky Finger Down",
      keysCovered: ["z", "/"],
      text: "z / az ;/ za /; zip zero zoo maze zone gaze lazy size quiz freeze",
      targetWpm: 25,
      targetAccuracy: 90,
      instructions: "Reach left pinky down to Z. Reach right pinky down to slash (/).",
      fingerTips: "Left Pinky moves A -> Z. Right Pinky moves ; -> slash (/)."
    },

    // --- STAGE 4: INDEX STRETCHES & FULL ALPHABET ---
    {
      id: 15,
      stage: "Stage 4: Stretches",
      title: "G and H: Center Stretches",
      keysCovered: ["g", "h"],
      text: "g h fg jh gf hj good high half light glad give ghost night laugh",
      targetWpm: 28,
      targetAccuracy: 92,
      instructions: "Reach left index horizontally right to G. Reach right index horizontally left to H.",
      fingerTips: "Left Index moves F -> G. Right Index moves J -> H."
    },
    {
      id: 16,
      stage: "Stage 4: Stretches",
      title: "B and N: Bottom Center Stretches",
      keysCovered: ["b", "n"],
      text: "b n fb jn bf nj bean burn bank bone name find bend bond band blend",
      targetWpm: 28,
      targetAccuracy: 92,
      instructions: "Reach left index down and right to B. Reach right index down and left to N.",
      fingerTips: "Left Index moves F -> B. Right Index moves J -> N."
    },
    {
      id: 17,
      stage: "Stage 4: Stretches",
      title: "All Alphabet Fluency Drill",
      keysCovered: ["a-z"],
      text: "the quick brown fox jumps over a lazy dog packs my box with five dozen liquor jugs",
      targetWpm: 30,
      targetAccuracy: 94,
      instructions: "These classic pangrams exercise every letter of the alphabet from A to Z.",
      fingerTips: "Rely purely on muscle memory. Keep your gaze steady on the screen."
    },

    // --- STAGE 5: NUMBERS ROW ---
    {
      id: 18,
      stage: "Stage 5: Numbers",
      title: "Numbers 4, 5, 6, 7 (Index Fingers)",
      keysCovered: ["4", "5", "6", "7"],
      text: "4 5 6 7 45 67 47 56 456 567 474 575 645 765 44 55 66 77 4567 7654",
      targetWpm: 20,
      targetAccuracy: 90,
      instructions: "Left index reaches up to 4 and 5. Right index reaches up to 6 and 7.",
      fingerTips: "Left Index (4, 5), Right Index (6, 7)."
    },
    {
      id: 19,
      stage: "Stage 5: Numbers",
      title: "Numbers 2, 3, 8, 9 (Middle & Ring)",
      keysCovered: ["2", "3", "8", "9"],
      text: "2 3 8 9 23 89 38 29 238 389 283 932 22 33 88 99 2389 9832",
      targetWpm: 20,
      targetAccuracy: 90,
      instructions: "Left ring (2), left middle (3), right middle (8), right ring (9).",
      fingerTips: "Left Ring (2), Left Middle (3), Right Middle (8), Right Ring (9)."
    },
    {
      id: 20,
      stage: "Stage 5: Numbers",
      title: "Numbers 1 and 0 (Pinkies) & Full Digits",
      keysCovered: ["1", "0"],
      text: "1 0 10 100 1984 2024 365 720 1080 404 500 12345 67890 2048 31415",
      targetWpm: 22,
      targetAccuracy: 90,
      instructions: "Left pinky reaches up to 1. Right pinky reaches up to 0.",
      fingerTips: "Left Pinky (1), Right Pinky (0)."
    },

    // --- STAGE 6: CAPITAL LETTERS & SHIFT ---
    {
      id: 21,
      stage: "Stage 6: Capitals",
      title: "Opposite Shift Technique",
      keysCovered: ["Shift"],
      text: "London Paris Tokyo Delhi Berlin Rome Madrid Oslo Lima Dublin Cairo",
      targetWpm: 26,
      targetAccuracy: 92,
      instructions: "When typing a capital letter with your right hand, press the Left Shift key with your left pinky. When typing with your left hand, press Right Shift.",
      fingerTips: "Opposite Shift principle prevents hand contortions."
    },
    {
      id: 22,
      stage: "Stage 6: Capitals",
      title: "Capitalized Proper Names & Acronyms",
      keysCovered: ["Capitals"],
      text: "HTML CSS JSON NASA UNESCO ASCII UTF IBM MIT FBI ISO Apple Google",
      targetWpm: 26,
      targetAccuracy: 92,
      instructions: "Practice rapid alternate shift taps between hands.",
      fingerTips: "Release the Shift key immediately after typing the target letter."
    },

    // --- STAGE 7: SYMBOLS & PUNCTUATION ---
    {
      id: 23,
      stage: "Stage 7: Symbols",
      title: "Common Quotes & Hyphens",
      keysCovered: ["'", "\"", "-"],
      text: "don't can't it's we'll \"hello\" \"world\" fast-paced high-tech well-known",
      targetWpm: 28,
      targetAccuracy: 92,
      instructions: "Single quote (') and double quote (\") use the right pinky.",
      fingerTips: "Right Pinky handles both quotes and hyphens."
    },
    {
      id: 24,
      stage: "Stage 7: Symbols",
      title: "Exclamation, Question & Parentheses",
      keysCovered: ["!", "?", "(", ")"],
      text: "Really? Yes! What is that? (Code here) Are you ready? (Definitely!)",
      targetWpm: 26,
      targetAccuracy: 92,
      instructions: "Shift+1 = !, Shift+/ = ?, Shift+9 = (, Shift+0 = ).",
      fingerTips: "Opposite shift is vital when reaching for symbol rows."
    },
    {
      id: 25,
      stage: "Stage 7: Symbols",
      title: "Code Operators and Brackets",
      keysCovered: ["{", "}", "[", "]", "=", "+"],
      text: "{ key: value } [1, 2, 3] x = a + b; (a === b) ? true : false;",
      targetWpm: 24,
      targetAccuracy: 90,
      instructions: "Brackets and braces are typed with the right pinky.",
      fingerTips: "Keep your wrist stable when reaching for curly braces."
    },

    // --- STAGE 8: SPEED N-GRAMS & COMMON PATTERNS ---
    {
      id: 26,
      stage: "Stage 8: N-Grams",
      title: "Top Bigrams (th, he, in, er, an)",
      keysCovered: ["th", "he", "in", "er", "an"],
      text: "the then there other their father mother think into enter under and",
      targetWpm: 35,
      targetAccuracy: 94,
      instructions: "Typing these pairs as single fluent motions dramatically increases your WPM.",
      fingerTips: "Think in syllables rather than isolated letters."
    },
    {
      id: 27,
      stage: "Stage 8: N-Grams",
      title: "Trigrams (ing, ion, tio, for, ter)",
      keysCovered: ["ing", "ion", "tio", "for", "ter"],
      text: "running jumping action station motion information forward water winter",
      targetWpm: 38,
      targetAccuracy: 94,
      instructions: "Roll your fingers across the keys in a single fluid gesture.",
      fingerTips: "Maintain a steady, musical rhythm."
    },

    // --- STAGE 9: HIGH-FREQUENCY VOCABULARY ---
    {
      id: 28,
      stage: "Stage 9: Vocabulary",
      title: "Most Common English Words",
      keysCovered: ["top-words"],
      text: "about would these which there people could write first water find work",
      targetWpm: 40,
      targetAccuracy: 95,
      instructions: "These words constitute over half of all everyday written English.",
      fingerTips: "Aim for 100% accuracy on first attempt."
    },
    {
      id: 29,
      stage: "Stage 9: Vocabulary",
      title: "Polysyllabic Flow",
      keysCovered: ["advanced-flow"],
      text: "community development environment experience technology organization",
      targetWpm: 42,
      targetAccuracy: 95,
      instructions: "Longer words require smooth transitions across keyboard hemispheres.",
      fingerTips: "Do not rush; rhythm produces speed."
    },

    // --- STAGE 10: ENDURANCE & SPEED DRILLS ---
    {
      id: 30,
      stage: "Stage 10: Speed Drills",
      title: "Sprint Drill: 45 WPM Benchmark",
      keysCovered: ["sprint-45"],
      text: "Every great developer began with hesitation and uncertainty. Through steady daily repetition, the fingers learn to dance across the keys with quiet precision.",
      targetWpm: 45,
      targetAccuracy: 95,
      instructions: "Maintain unbroken cadence from the first capital letter to the final period.",
      fingerTips: "Breathe evenly and relax your shoulders."
    },
    {
      id: 31,
      stage: "Stage 10: Speed Drills",
      title: "Sprint Drill: 60 WPM Benchmark",
      keysCovered: ["sprint-60"],
      text: "Software craft is built on patience and curiosity. When you stop looking down at your hands, your thoughts flow directly into the editor without interruption.",
      targetWpm: 60,
      targetAccuracy: 96,
      instructions: "Push your speed while strictly maintaining 96%+ accuracy.",
      fingerTips: "Do not bottom out heavily; tap lightly and release."
    },
    {
      id: 32,
      stage: "Stage 10: Speed Drills",
      title: "Mastery Drill: 75 WPM Pro Certification",
      keysCovered: ["pro-mastery"],
      text: "Mastery is not an accident of nature; it is the compound interest of deliberate practice. You have conquered the home row, the numerals, and the symbols. Now let your intellect flow freely.",
      targetWpm: 75,
      targetAccuracy: 96,
      instructions: "The ultimate touch typing graduation trial. Achieve 75 WPM with surgical precision.",
      fingerTips: "Total focus. Flow state achieved."
    }
  ];

  const Lessons = {
    getAll() {
      return LESSONS;
    },

    getById(id) {
      return LESSONS.find(l => l.id === Number(id)) || LESSONS[0];
    },

    getStages() {
      const stages = {};
      LESSONS.forEach(l => {
        stages[l.stage] = stages[l.stage] || [];
        stages[l.stage].push(l);
      });
      return stages;
    },

    isUnlocked(lessonId) {
      if (Number(lessonId) === 1) return true;
      const progress = window.TypeApp.Storage ? window.TypeApp.Storage.getLessonsProgress() : {};
      const prevLesson = LESSONS.find(l => l.id === Number(lessonId) - 1);
      if (!prevLesson) return true;
      const prevRes = progress[prevLesson.id];
      return !!(prevRes && prevRes.passed);
    }
  };

  window.TypeApp.Lessons = Lessons;
})();
