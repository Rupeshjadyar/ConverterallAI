/**
 * Typing Speed Test - Curated Quotes Dataset (Zero External Dependencies)
 * At least 60 original inspirational, philosophical, and literary quotes & passages
 * categorized into Short, Medium, and Long.
 * Namespace: window.TypeApp.Quotes
 */

window.TypeApp = window.TypeApp || {};

(function() {
  const QUOTES = [
    // --- SHORT QUOTES (1 to 22) ---
    {
      id: "s1",
      category: "short",
      text: "Simplicity is prerequisite for reliability.",
      author: "Edsger W. Dijkstra"
    },
    {
      id: "s2",
      category: "short",
      text: "The journey of a thousand miles begins with a single step.",
      author: "Lao Tzu"
    },
    {
      id: "s3",
      category: "short",
      text: "Programs must be written for people to read, and only incidentally for machines to execute.",
      author: "Harold Abelson"
    },
    {
      id: "s4",
      category: "short",
      text: "First, solve the problem. Then, write the code.",
      author: "John Johnson"
    },
    {
      id: "s5",
      category: "short",
      text: "Knowledge is power, but enthusiasm pulls the switch.",
      author: "Ivern Ball"
    },
    {
      id: "s6",
      category: "short",
      text: "Speed is a byproduct of clarity and smooth muscle memory.",
      author: "Typing Maxim"
    },
    {
      id: "s7",
      category: "short",
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain"
    },
    {
      id: "s8",
      category: "short",
      text: "Make it work, make it right, make it fast.",
      author: "Kent Beck"
    },
    {
      id: "s9",
      category: "short",
      text: "Code never lies, comments sometimes do.",
      author: "Ron Jeffries"
    },
    {
      id: "s10",
      category: "short",
      text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
      author: "Antoine de Saint-Exupéry"
    },
    {
      id: "s11",
      category: "short",
      text: "Curiosity is the engine of intellectual achievement.",
      author: "Ken Robinson"
    },
    {
      id: "s12",
      category: "short",
      text: "Do what you can, with what you have, where you are.",
      author: "Theodore Roosevelt"
    },
    {
      id: "s13",
      category: "short",
      text: "Discipline equals freedom in both craft and thought.",
      author: "Jocko Willink"
    },
    {
      id: "s14",
      category: "short",
      text: "Focus is a muscle; the more you exercise it, the sharper it cuts.",
      author: "Anonymous Artisan"
    },
    {
      id: "s15",
      category: "short",
      text: "The best error message is the one that never shows up.",
      author: "Thomas Fuchs"
    },
    {
      id: "s16",
      category: "short",
      text: "Action is the foundational key to all success.",
      author: "Pablo Picasso"
    },
    {
      id: "s17",
      category: "short",
      text: "Before software can be reusable it first has to be usable.",
      author: "Ralph Johnson"
    },
    {
      id: "s18",
      category: "short",
      text: "Creativity is intelligence having fun.",
      author: "Albert Einstein"
    },
    {
      id: "s19",
      category: "short",
      text: "Stay hungry, stay foolish, and never stop refining your keystrokes.",
      author: "Steve Jobs Adaptation"
    },
    {
      id: "s20",
      category: "short",
      text: "Small daily improvements over time lead to stunning results.",
      author: "Robin Sharma"
    },
    {
      id: "s21",
      category: "short",
      text: "To understand recursion, one must first understand recursion.",
      author: "Traditional Proverb"
    },
    {
      id: "s22",
      category: "short",
      text: "Smooth is fast, and fast is smooth.",
      author: "Navigation Principle"
    },

    // --- MEDIUM QUOTES (23 to 44) ---
    {
      id: "m1",
      category: "medium",
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      author: "Martin Fowler"
    },
    {
      id: "m2",
      category: "medium",
      text: "Give a person a program and you frustrate them for a day; teach them to program and you frustrate them for a lifetime.",
      author: "David Leinweber"
    },
    {
      id: "m3",
      category: "medium",
      text: "The most disastrous thing that you can ever learn is your first programming language, because you will measure everything against it.",
      author: "Alan Kay"
    },
    {
      id: "m4",
      category: "medium",
      text: "Typing is not just striking keys on a board; it is the instantaneous projection of consciousness directly into the digital realm.",
      author: "Digital Philosophy"
    },
    {
      id: "m5",
      category: "medium",
      text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit formed through deliberate and steady practice.",
      author: "Will Durant"
    },
    {
      id: "m6",
      category: "medium",
      text: "The computer was born to solve problems that did not exist before, yet it has become the mirror in which we see human potential reflected.",
      author: "Bill Gates"
    },
    {
      id: "m7",
      category: "medium",
      text: "Optimism is an essential ingredient for innovation. How else can the individual welcome change over the security of the status quo?",
      author: "Robert Noyce"
    },
    {
      id: "m8",
      category: "medium",
      text: "Walking on water and developing software from a specification are easy if both are frozen into complete immobility.",
      author: "Edward V. Berard"
    },
    {
      id: "m9",
      category: "medium",
      text: "Real confidence does not stem from always being correct, but from not fearing the possibility of making mistakes and correcting them swiftly.",
      author: "Peter T. McIntyre"
    },
    {
      id: "m10",
      category: "medium",
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall, stronger, calmer, and more deliberate than before.",
      author: "Nelson Mandela"
    },
    {
      id: "m11",
      category: "medium",
      text: "Code craft resembles architecture: a single misaligned bracket or load-bearing wall may cause the entire majestic structure to tumble.",
      author: "Systems Architecture Journal"
    },
    {
      id: "m12",
      category: "medium",
      text: "Touch typing transforms words from physical obstacles into pure rhythmic thought, flowing effortlessly from mind to screen without friction.",
      author: "The Craft of Keys"
    },
    {
      id: "m13",
      category: "medium",
      text: "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies.",
      author: "C.A.R. Hoare"
    },
    {
      id: "m14",
      category: "medium",
      text: "It is not the critic who counts; not the man who points out how the strong man stumbles, but the one who is actually in the arena.",
      author: "Theodore Roosevelt"
    },
    {
      id: "m15",
      category: "medium",
      text: "Technology is best when it brings people together and removes barriers between our intentions and their tangible realization.",
      author: "Matt Mullenweg"
    },
    {
      id: "m16",
      category: "medium",
      text: "If you cannot explain it simply, you do not understand it well enough. True mastery reveals itself in effortless clarity.",
      author: "Richard Feynman"
    },
    {
      id: "m17",
      category: "medium",
      text: "The illiterate of the twenty-first century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.",
      author: "Alvin Toffler"
    },
    {
      id: "m18",
      category: "medium",
      text: "In the middle of difficulty lies opportunity. Every misplaced character on your keyboard is a signpost toward greater dexterity.",
      author: "Reflective Typist"
    },
    {
      id: "m19",
      category: "medium",
      text: "To build a great tool is to respect the user's precious time, granting them wings instead of weight and clarity instead of clutter.",
      author: "Modern Interface Essays"
    },
    {
      id: "m20",
      category: "medium",
      text: "Mastering keystrokes is like tuning an instrument: each finger finds its home, and the symphony of ideas plays without hesitation.",
      author: "Ergonomics Quarterly"
    },
    {
      id: "m21",
      category: "medium",
      text: "A complex system that works is invariably found to have evolved from a simple system that worked. Begin humble and iterate relentlessly.",
      author: "John Gall"
    },
    {
      id: "m22",
      category: "medium",
      text: "Patience and perseverance have a magical effect before which difficulties disappear and obstacles vanish into thin air.",
      author: "John Quincy Adams"
    },

    // --- LONG QUOTES / PASSAGES (45 to 66) ---
    {
      id: "l1",
      category: "long",
      text: "You cannot connect the dots looking forward; you can only connect them looking backward. So you have to trust that the dots will somehow connect in your future. You have to trust in something: your gut, destiny, life, karma, whatever. This approach has never let me down, and it has made all the difference in my life.",
      author: "Steve Jobs"
    },
    {
      id: "l2",
      category: "long",
      text: "Look at a stone cutter hammering away at his rock, perhaps a hundred times without as much as a crack showing in it. Yet at the hundred and first blow it will split in two, and I know it was not that blow that did it, but all that had gone before.",
      author: "Jacob Riis"
    },
    {
      id: "l3",
      category: "long",
      text: "The beauty of a mechanical switch keyboard lies not merely in its audible feedback, but in the tactile certainty it provides to the fingertips. With every bottoming out and spring rebound, the brain registers certainty, establishing a subconscious tempo that accelerates thought into uninterrupted prose.",
      author: "Mechanics of Input"
    },
    {
      id: "l4",
      category: "long",
      text: "Software engineering is a discipline where intangible ideas materialize into working systems. We build towering castles in the sky out of pure logic, where a misplaced semicolon can shake the battlements, yet a well-crafted abstraction can withstand decades of evolving demands.",
      author: "Frederick P. Brooks Jr."
    },
    {
      id: "l5",
      category: "long",
      text: "Speed without precision is like an unguided rocket: impressive in its fury, yet utterly unreliable in reaching its destination. The true master typist seeks accuracy first, knowing that once accuracy becomes instinctual, velocity follows as an effortless consequence.",
      author: "Typing Mastery Treatise"
    },
    {
      id: "l6",
      category: "long",
      text: "Far better is it to dare mighty things, to win glorious triumphs, even though checkered by failure, than to rank with those poor spirits who neither enjoy much nor suffer much, because they live in a gray twilight that knows not victory nor defeat.",
      author: "Theodore Roosevelt"
    },
    {
      id: "l7",
      category: "long",
      text: "The universe does not require our permission to be complex. As engineers and thinkers, our duty is to distill this complexity into modular, comprehensible fragments that human minds can cultivate, debug, and expand across generations.",
      author: "Cosmic Computation"
    },
    {
      id: "l8",
      category: "long",
      text: "It is not enough for code to run; it must sing. It must communicate intent with such elegance and lucidity that any developer reading it five years hence can step into the author's boots and immediately comprehend the underlying rationale.",
      author: "Clean Architecture Principles"
    },
    {
      id: "l9",
      category: "long",
      text: "In an age of relentless distraction, the ability to submerge oneself into unbroken focus has become a rare superpower. When you sit before a glowing screen with hands resting on the home row, the chaos of the world recedes, leaving only the rhythm of the cursor.",
      author: "Deep Work Observations"
    },
    {
      id: "l10",
      category: "long",
      text: "The human hand possesses twenty-seven bones, an intricate lattice of tendons, and tens of thousands of nerve endings. Learning to type without looking is one of the highest expressions of motor neuroplasticity, bridging biological nerve impulses with mechanical computation.",
      author: "Human Ergonomics Studies"
    },
    {
      id: "l11",
      category: "long",
      text: "Whenever you feel overwhelmed by a monumental challenge, remember that every novel was written one sentence at a time, every program one line at a time, and every typing record one keystroke at a time. Do not anticipate the summit; conquer the step before your eyes.",
      author: "Mindful Productivity"
    },
    {
      id: "l12",
      category: "long",
      text: "A craftsman cares about their tools. They keep their chisels sharp, their benches clean, and their minds receptive. A typist, too, honors the mechanical interface: maintaining proper wrist posture, relaxing the shoulders, and cultivating a light, rhythmic keystroke touch.",
      author: "The Art of the Keyboard"
    },
    {
      id: "l13",
      category: "long",
      text: "The test of a first-rate intelligence is the ability to hold two opposed ideas in the mind at the same time, and still retain the ability to function. One must, for example, be able to see that things are hopeless and yet be determined to make them otherwise.",
      author: "F. Scott Fitzgerald"
    },
    {
      id: "l14",
      category: "long",
      text: "There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self. Compete not against external leaderboards, but against your own hesitation and errors of yesterday.",
      author: "Ernest Hemingway"
    },
    {
      id: "l15",
      category: "long",
      text: "Good design is as little design as possible. Less, but better, because it concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity, back to genuine utility.",
      author: "Dieter Rams"
    },
    {
      id: "l16",
      category: "long",
      text: "When you write, you create worlds from silent thoughts. When you type with fluency, the machine dissolves into invisibility, allowing pure narrative velocity to bypass the barrier of sluggish mechanical transcription.",
      author: "The Literary Engine"
    },
    {
      id: "l17",
      category: "long",
      text: "The most profound technologies are those that disappear. They weave themselves into the fabric of everyday life until they are indistinguishable from it, granting capabilities so natural that we forget their underlying wonder.",
      author: "Mark Weiser"
    },
    {
      id: "l18",
      category: "long",
      text: "Two roads diverged in a yellow wood, and sorry I could not travel both and be one traveler, long I stood and looked down one as far as I could to where it bent in the undergrowth; then took the other, as just as fair, and having perhaps the better claim.",
      author: "Robert Frost"
    },
    {
      id: "l19",
      category: "long",
      text: "Do not wait for ideal conditions to write or practice. The blank page and the waiting prompt are indifferent to your mood. Sit upright, place your index fingers on the home keys, feel the subtle nubs on F and J, and begin.",
      author: "Typing Primer"
    },
    {
      id: "l20",
      category: "long",
      text: "A user interface is like a joke. If you have to explain it, it is not that good. The most exhilarating tools are those whose operation feels like second nature within sixty seconds of touching the controls.",
      author: "Interface Heuristics"
    },
    {
      id: "l21",
      category: "long",
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts. When a run ends with a flurry of red characters, do not turn away in despair. Clear the prompt, take a deep breath, and reset the clock.",
      author: "Winston Churchill Adaptation"
    },
    {
      id: "l22",
      category: "long",
      text: "What we achieve inwardly will change outer reality. If we cultivate discipline, patience, and unwavering precision in the small details of our daily work, the greater trajectory of our life unfolds with symmetry and grace.",
      author: "Plutarch"
    }
  ];

  const Quotes = {
    getAll() {
      return QUOTES;
    },

    getByCategory(category = 'medium') {
      const filtered = QUOTES.filter(q => q.category === category);
      return filtered.length > 0 ? filtered : QUOTES;
    },

    getRandom(category = 'medium') {
      const pool = this.getByCategory(category);
      return pool[Math.floor(Math.random() * pool.length)];
    }
  };

  window.TypeApp.Quotes = Quotes;
})();
