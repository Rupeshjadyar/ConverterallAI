import { RichTutorialChapter, W3TopicItem } from './rich-tutorial.models';

export const ALL_RICH_PYTHON_CHAPTERS: RichTutorialChapter[] = [
  {
    "id": "py-overview",
    "chapterNumber": 1,
    "title": "Python Overview & Architecture",
    "category": "Python Basics",
    "shortDesc": "Comprehensive zero-to-hero introduction to Python: history, philosophy, CPython bytecode compilation pipeline, and Python flavors.",
    "overview": [
      "Python is a high-level, interpreted, dynamically typed, garbage-collected programming language created in 1989 by Guido van Rossum at CWI in the Netherlands.",
      "Real-life Analogy: If C++ is like building a car from raw steel and machining every gear by hand, Python is like driving an automatic luxury electric car. You get straight to your destination with supreme comfort, while the engine handles transmission, fuel injection, and safety automatically under the hood.",
      "Python is universally celebrated for human-friendly readability, following the famous 'Zen of Python' (PEP 20): 'Readability counts', 'Simple is better than complex', and 'Explicit is better than implicit'."
    ],
    "sections": [
      {
        "title": "1. What is Python? History & The Zen of Python",
        "theory": [
          "Python was named after the British comedy television show 'Monty Python's Flying Circus', not after the snake reptile!",
          "Python 2 vs Python 3: Python 2 was officially retired on January 1, 2020. Modern software engineering exclusively uses Python 3 (specifically 3.10+).",
          "The Zen of Python: You can read Python's guiding design principles anytime directly in the terminal by typing `import this`."
        ],
        "syntax": "# Open Python interactive terminal and run:\nimport this\n\n# First 5 lines of output:\n# Beautiful is better than ugly.\n# Explicit is better than implicit.\n# Simple is better than complex.\n# Complex is better than complicated.\n# Readability counts.",
        "tips": [
          "Always prioritize clean, readable code over clever one-line tricks. Write code for humans to read first, and computers to execute second."
        ],
        "codeExample": "# Open Python interactive terminal and run:\nimport this\n\n# First 5 lines of output:\n# Beautiful is better than ugly.\n# Explicit is better than implicit.\n# Simple is better than complex.\n# Complex is better than complicated.\n# Readability counts."
      },
      {
        "title": "2. The CPython Compilation & Bytecode Pipeline",
        "theory": [
          "Common Myth: 'Python is purely interpreted and does not compile.' FALSE! Python is both compiled AND interpreted.",
          "Step 1 (Source Parsing): CPython parses your `.py` source text into an Abstract Syntax Tree (AST).",
          "Step 2 (Bytecode Compilation): The AST is compiled into platform-independent intermediate instructions called Python Bytecode (cached on disk in `__pycache__/*.pyc` files).",
          "Step 3 (PVM Execution): The Python Virtual Machine (PVM)—a software loop written in C—reads each bytecode instruction and executes it on the host CPU."
        ],
        "syntax": "# 1. Inspecting Bytecode Instructions in Python\nimport dis\n\ndef add_numbers(a, b):\n    return a + b\n\n# Disassemble function into bytecode opcodes:\ndis.dis(add_numbers)\n\n# Output printed by dis:\n#   2           0 LOAD_FAST                0 (a)\n#               2 LOAD_FAST                1 (b)\n#               4 BINARY_ADD\n#               6 RETURN_VALUE",
        "tips": [
          "The `.pyc` files inside `__pycache__` speed up startup time when you run the program again, skipping source re-parsing if the file hasn't changed."
        ],
        "codeExample": "# 1. Inspecting Bytecode Instructions in Python\nimport dis\n\ndef add_numbers(a, b):\n    return a + b\n\n# Disassemble function into bytecode opcodes:\ndis.dis(add_numbers)\n\n# Output printed by dis:\n#   2           0 LOAD_FAST                0 (a)\n#               2 LOAD_FAST                1 (b)\n#               4 BINARY_ADD\n#               6 RETURN_VALUE"
      },
      {
        "title": "3. Interpreted vs Compiled: The Hybrid Model",
        "theory": [
          "Pure compiled languages (C, C++, Rust, Go) compile source directly to machine code (`.exe` / ELF binary) specific to one CPU architecture (x86_64 or ARM).",
          "Python uses a Hybrid Model: Bytecode is compiled on the fly, making Python completely cross-platform. The same `.py` file runs identically on Windows, Linux, macOS, and Raspberry Pi without recompilation."
        ],
        "table": [
          {
            "attribute": "Language",
            "value": "Execution Model",
            "description": "Characteristics"
          },
          {
            "attribute": "C / C++",
            "value": "AOT (Ahead of Time)",
            "description": "Compiles directly to native CPU machine code. Fastest raw speed, but OS/CPU platform dependent."
          },
          {
            "attribute": "Python (CPython)",
            "value": "Bytecode + PVM",
            "description": "Compiles source code to bytecode (.pyc), then executes on Python Virtual Machine. 100% portable."
          },
          {
            "attribute": "Java",
            "value": "Bytecode + JVM",
            "description": "Compiles to .class bytecode executed by JVM with JIT (Just-in-Time) compiler."
          },
          {
            "attribute": "PyPy",
            "value": "JIT-compiled Python",
            "description": "Alternative Python implementation with a Just-In-Time compiler, often 4x-7x faster for loops."
          }
        ],
        "tips": [
          "Whenever raw CPU-bound performance is needed in Python, compute-heavy libraries like NumPy and PyTorch execute underlying loops in precompiled C/C++ or CUDA code."
        ],
        "codeExample": "# Example code\npass"
      },
      {
        "title": "4. Flavors of Python (CPython, PyPy, Jython, MicroPython)",
        "theory": [
          "Python is a language specification. There are multiple concrete implementations (flavors) designed for different ecosystems:",
          "1) CPython: The official reference implementation written in C. This is what you download from python.org.",
          "2) PyPy: Fast JIT (Just-In-Time) compiler implementation ideal for CPU-heavy mathematical scripts.",
          "3) MicroPython / CircuitPython: Stripped-down Python optimized to run on tiny microcontrollers with only 16KB RAM (ESP32, Raspberry Pi Pico)."
        ],
        "syntax": "import sys\nimport platform\n\n# Identify which Python flavor is currently running your code:\nprint(f\"Implementation: {platform.python_implementation()}\")  # 'CPython'\nprint(f\"Python Version: {platform.python_version()}\")         # e.g., '3.12.2'\nprint(f\"Compiler:       {platform.python_compiler()}\")        # 'MSC v.1937 64 bit' or 'GCC'",
        "tips": [
          "99.9% of production applications use CPython. Learn CPython first, as all standard documentation and packages target it."
        ],
        "codeExample": "import sys\nimport platform\n\n# Identify which Python flavor is currently running your code:\nprint(f\"Implementation: {platform.python_implementation()}\")  # 'CPython'\nprint(f\"Python Version: {platform.python_version()}\")         # e.g., '3.12.2'\nprint(f\"Compiler:       {platform.python_compiler()}\")        # 'MSC v.1937 64 bit' or 'GCC'"
      }
    ]
  },
  {
    "id": "py-environment",
    "chapterNumber": 2,
    "title": "Python Environment Setup & Virtual Environments",
    "category": "Python Basics",
    "shortDesc": "Complete setup guide: installing Python, the PATH environment variable, PIP package manager, virtual environments (venv), and modern uv.",
    "overview": [
      "Setting up a robust Python development environment is the essential first step to becoming a professional developer.",
      "Real-life Analogy: Think of a chef's kitchen. You wouldn't prepare delicate vegetarian desserts on the exact same unwashed cutting board you just used to slice raw fish. Virtual environments give each of your software projects its own clean, isolated kitchen and pantry.",
      "Never install project-specific packages globally! Always create an isolated virtual environment (`venv`) for every new project."
    ],
    "sections": [
      {
        "title": "1. Installing Python & The Crucial 'Add to PATH' Checkbox",
        "theory": [
          "When installing Python on Windows from python.org, the MOST CRITICAL STEP is checking the box: ☑ 'Add python.exe to PATH'.",
          "What is PATH? PATH is an operating system environment variable that tells your command prompt where executable programs live. Without it, typing `python` in PowerShell results in 'command not found'.",
          "Verification: Open PowerShell or Terminal and check both python and pip versions."
        ],
        "syntax": "# 1. Check Python installation:\npython --version\n# Output: Python 3.12.x\n\n# 2. Check PIP (Package Installer for Python):\npip --version\n\n# 3. Launch interactive REPL:\npython\n# >>> print(\"Hello World!\")\n# >>> exit()",
        "tips": [
          "If you have both Python 2 and Python 3 installed on Linux/Mac, use `python3` and `pip3`."
        ],
        "codeExample": "# 1. Check Python installation:\npython --version\n# Output: Python 3.12.x\n\n# 2. Check PIP (Package Installer for Python):\npip --version\n\n# 3. Launch interactive REPL:\npython\n# >>> print(\"Hello World!\")\n# >>> exit()"
      },
      {
        "title": "2. Why Virtual Environments (venv) are Mandatory",
        "theory": [
          "Dependency Conflict Problem: Project A needs `django==3.2` (legacy), while Project B needs `django==5.0` (new). If you install globally, one project breaks the other!",
          "Virtual Environment Solution: `venv` creates an isolated directory containing its own Python executable and its own isolated `site-packages` directory.",
          "Standard workflow: 1) Create venv -> 2) Activate venv -> 3) Install packages -> 4) Deactivate when done."
        ],
        "syntax": "# 1. Create a virtual environment named '.venv'\npython -m venv .venv\n\n# 2. Activate the virtual environment:\n# On Windows (PowerShell):\n.venv\\Scripts\\Activate.ps1\n\n# On Windows (Command Prompt cmd.exe):\n.venv\\Scripts\\activate.bat\n\n# On macOS / Linux:\nsource .venv/bin/activate\n\n# Notice your terminal prompt now shows: (.venv) PS C:\\Users\\...\n\n# 3. Deactivate when you're finished:\ndeactivate",
        "tips": [
          "Always add `.venv/` and `venv/` to your `.gitignore` file! Never commit virtual environment folders to GitHub."
        ],
        "codeExample": "# 1. Create a virtual environment named '.venv'\npython -m venv .venv\n\n# 2. Activate the virtual environment:\n# On Windows (PowerShell):\n.venv\\Scripts\\Activate.ps1\n\n# On Windows (Command Prompt cmd.exe):\n.venv\\Scripts\\activate.bat\n\n# On macOS / Linux:\nsource .venv/bin/activate\n\n# Notice your terminal prompt now shows: (.venv) PS C:\\Users\\...\n\n# 3. Deactivate when you're finished:\ndeactivate"
      },
      {
        "title": "3. Package Management with pip & requirements.txt",
        "theory": [
          "`pip` is the official package manager that downloads open-source libraries from the Python Package Index (PyPI).",
          "`requirements.txt`: A text file listing all project dependencies and their exact locked versions so anyone can reproduce your environment with a single command.",
          "`pip freeze`: Outputs all currently installed packages and exact version numbers."
        ],
        "syntax": "# 1. Install a package (e.g., requests, fastapi)\npip install requests\n\n# 2. Freeze all installed dependencies into requirements.txt:\npip freeze > requirements.txt\n\n# Inspect requirements.txt:\n# certifi==2024.2.2\n# charset-normalizer==3.3.2\n# idna==3.6\n# requests==2.31.0\n# urllib3==2.2.1\n\n# 3. Install all dependencies on another machine:\npip install -r requirements.txt",
        "tips": [
          "To speed up package installation by 10x-50x, consider using modern `uv` (`uv pip install -r requirements.txt`), a blazingly fast package manager written in Rust."
        ],
        "codeExample": "# 1. Install a package (e.g., requests, fastapi)\npip install requests\n\n# 2. Freeze all installed dependencies into requirements.txt:\npip freeze > requirements.txt\n\n# Inspect requirements.txt:\n# certifi==2024.2.2\n# charset-normalizer==3.3.2\n# idna==3.6\n# requests==2.31.0\n# urllib3==2.2.1\n\n# 3. Install all dependencies on another machine:\npip install -r requirements.txt"
      }
    ]
  },
  {
    "id": "py-syntax",
    "chapterNumber": 3,
    "title": "Python Basic Syntax & Indentation",
    "category": "Python Basics",
    "shortDesc": "Master Python's syntax rules: indentation, statements, line continuation, comments, reserved keywords, and PEP 8 best practices.",
    "overview": [
      "Unlike C, Java, or JavaScript which use curly braces `{}` to define code blocks, Python uses indentation (whitespace) to determine the structure and grouping of statements.",
      "Real-life Analogy: Think of an outline document or a legal contract. Section 1 has sub-clauses indented beneath it (1.1, 1.2). The indentation visually and legally defines ownership. In Python, indentation defines code hierarchy.",
      "Strict compliance with PEP 8 (Python Enhancement Proposal 8) is expected across the global Python engineering community."
    ],
    "sections": [
      {
        "title": "1. The 4-Space Indentation Rule (No Tabs!)",
        "theory": [
          "Python uses leading whitespace (spaces or tabs) to define blocks of code after colons (`:`).",
          "PEP 8 Standard: ALWAYS use exactly 4 spaces per indentation level. Never use tabs, and NEVER mix tabs and spaces in the same file!",
          "Mixing tabs and spaces causes the dreaded `IndentationError: unindent does not match any outer indentation level`."
        ],
        "syntax": "# ✅ Correct indentation (4 spaces per level):\nscore = 85\n\nif score >= 50:\n    print(\"Candidate Passed!\")\n    if score >= 80:\n        print(\"Distinction Awarded!\")  # 8 spaces (nested block)\nelse:\n    print(\"Candidate Failed.\")\n\n# ❌ WRONG (IndentationError):\n# if score > 50:\n# print(\"This will crash immediately!\")",
        "tips": [
          "Configure your code editor (VS Code, Cursor, PyCharm) to automatically convert the Tab key into 4 spaces."
        ],
        "codeExample": "# ✅ Correct indentation (4 spaces per level):\nscore = 85\n\nif score >= 50:\n    print(\"Candidate Passed!\")\n    if score >= 80:\n        print(\"Distinction Awarded!\")  # 8 spaces (nested block)\nelse:\n    print(\"Candidate Failed.\")\n\n# ❌ WRONG (IndentationError):\n# if score > 50:\n# print(\"This will crash immediately!\")"
      },
      {
        "title": "2. Line Continuation: Implicit vs Explicit",
        "theory": [
          "PEP 8 recommends keeping lines under 79-88 characters for readability on split screens.",
          "Implicit Continuation: Python automatically allows multi-line statements when enclosed within parentheses `()`, brackets `[]`, or braces `{}`. (Preferred!)",
          "Explicit Continuation: Using a trailing backslash `\\` to break a long line. (Use sparingly)."
        ],
        "syntax": "# 1. Implicit line continuation inside parentheses (BEST PRACTICE):\ntotal_revenue = (\n    january_sales\n    + february_sales\n    + march_sales\n    + q1_bonus_credits\n)\n\n# 2. Multi-line list definition:\nactive_services = [\n    \"authentication_service\",\n    \"payment_processing_worker\",\n    \"notification_dispatch_engine\",\n]\n\n# 3. Explicit continuation with backslash (Use only when brackets aren't natural):\nif user_is_authenticated and user_has_admin_role and    not system_in_maintenance_mode:\n    print(\"Access granted to control panel.\")",
        "tips": [
          "Prefer parentheses grouping over backslash `\\` continuation whenever possible."
        ],
        "codeExample": "# 1. Implicit line continuation inside parentheses (BEST PRACTICE):\ntotal_revenue = (\n    january_sales\n    + february_sales\n    + march_sales\n    + q1_bonus_credits\n)\n\n# 2. Multi-line list definition:\nactive_services = [\n    \"authentication_service\",\n    \"payment_processing_worker\",\n    \"notification_dispatch_engine\",\n]\n\n# 3. Explicit continuation with backslash (Use only when brackets aren't natural):\nif user_is_authenticated and user_has_admin_role and    not system_in_maintenance_mode:\n    print(\"Access granted to control panel.\")"
      },
      {
        "title": "3. Comments, Docstrings & Reserved Keywords",
        "theory": [
          "Single-line comments: Start with `#`. Everything after `#` is ignored by the interpreter.",
          "Docstrings: Triple-quoted strings (`\"\"\"` or `'''`) used for documenting modules, classes, and functions.",
          "Keywords: Reserved words with special grammatical meaning that cannot be used as variable or function names (e.g., `if`, `class`, `def`, `return`, `True`, `None`)."
        ],
        "syntax": "import keyword\n\n# Check all reserved Python keywords dynamically:\nprint(\"Total Python keywords:\", len(keyword.kwlist))\nprint(\"First 10 keywords:\", keyword.kwlist[:10])\n\n# Testing if a word is reserved:\nprint(keyword.iskeyword(\"def\"))    # True (Cannot use as variable!)\nprint(keyword.iskeyword(\"apple\"))  # False (Valid identifier!)\n\n# Naming Rules for Identifiers (Variables & Functions):\n# 1. Must start with a letter (a-z, A-Z) or underscore (_)\n# 2. Cannot start with a digit (e.g. 1st_user is INVALID)\n# 3. Can contain letters, numbers, and underscores\n# 4. Case-sensitive: 'Total' and 'total' are completely different variables!",
        "tips": [
          "Use `snake_case` for variable and function names (`user_name`, `calculate_tax`), and `PascalCase` for class names (`UserAccount`, `DatabaseConnector`)."
        ],
        "codeExample": "import keyword\n\n# Check all reserved Python keywords dynamically:\nprint(\"Total Python keywords:\", len(keyword.kwlist))\nprint(\"First 10 keywords:\", keyword.kwlist[:10])\n\n# Testing if a word is reserved:\nprint(keyword.iskeyword(\"def\"))    # True (Cannot use as variable!)\nprint(keyword.iskeyword(\"apple\"))  # False (Valid identifier!)\n\n# Naming Rules for Identifiers (Variables & Functions):\n# 1. Must start with a letter (a-z, A-Z) or underscore (_)\n# 2. Cannot start with a digit (e.g. 1st_user is INVALID)\n# 3. Can contain letters, numbers, and underscores\n# 4. Case-sensitive: 'Total' and 'total' are completely different variables!"
      }
    ]
  },
  {
    "id": "py-variables",
    "chapterNumber": 4,
    "title": "Python Variable Types & Memory Model",
    "category": "Python Basics",
    "shortDesc": "Understand Python's object reference model, dynamic typing, id(), type(), is vs ==, and the small integer cache optimization.",
    "overview": [
      "In Python, variables are NOT fixed memory boxes that hold data; variables are NAMETAGS (pointers / references) attached to objects in heap memory.",
      "Real-life Analogy: Think of a luggage tag tied to a suitcase. The suitcase is the object in memory (it has weight, color, contents). The tag with your name written on it is the variable. You can move that luggage tag to a different suitcase anytime.",
      "Everything in Python is an object: numbers, strings, lists, functions, and modules all live in memory as full CPython objects."
    ],
    "sections": [
      {
        "title": "1. The Nametag Reference Model (Variables as Pointers)",
        "theory": [
          "When you write `a = [1, 2, 3]`, Python creates a list object in memory, and binds the name `a` to that object's memory address.",
          "When you write `b = a`, Python does NOT copy the list! It simply creates a second nametag `b` pointing to the exact same list object!",
          "Therefore, mutating `b.append(4)` modifies the list that `a` also refers to!"
        ],
        "syntax": "# Demonstrating shared references:\na = [10, 20, 30]\nb = a  # Both 'a' and 'b' refer to the EXACT SAME list in memory!\n\nb.append(40)\nprint(\"a:\", a)  # [10, 20, 30, 40]  <-- Mutated through 'b'!\nprint(\"b:\", b)  # [10, 20, 30, 40]\n\n# Inspecting memory addresses with id():\nprint(\"Address of a:\", id(a))\nprint(\"Address of b:\", id(b))  # Exactly identical address!",
        "tips": [
          "To create an independent copy of a list, use `b = a.copy()` or `b = list(a)`."
        ],
        "codeExample": "# Demonstrating shared references:\na = [10, 20, 30]\nb = a  # Both 'a' and 'b' refer to the EXACT SAME list in memory!\n\nb.append(40)\nprint(\"a:\", a)  # [10, 20, 30, 40]  <-- Mutated through 'b'!\nprint(\"b:\", b)  # [10, 20, 30, 40]\n\n# Inspecting memory addresses with id():\nprint(\"Address of a:\", id(a))\nprint(\"Address of b:\", id(b))  # Exactly identical address!"
      },
      {
        "title": "2. The is vs == Identity vs Equality Operator",
        "theory": [
          "`==` (Equality): Checks if two objects have the SAME VALUE (data contents).",
          "`is` (Identity): Checks if two variables point to the EXACT SAME MEMORY LOCATION (`id(a) == id(b)`).",
          "Rule of Thumb: Always use `==` for comparing numbers, strings, and collections. Use `is` ONLY when comparing singleton objects like `x is None` or `x is True`."
        ],
        "syntax": "list_one = [1, 2, 3]\nlist_two = [1, 2, 3]\n\n# They have identical values:\nprint(list_one == list_two)  # True (Same contents)\n\n# But they are two distinct objects at different memory addresses:\nprint(list_one is list_two)  # False (Different objects in RAM!)\n\n# Comparing with None (Always use 'is'):\nresult = None\nif result is None:\n    print(\"Operation returned no result.\")",
        "tips": [
          "Never write `if x == None:`. PEP 8 explicitly mandates `if x is None:`."
        ],
        "codeExample": "list_one = [1, 2, 3]\nlist_two = [1, 2, 3]\n\n# They have identical values:\nprint(list_one == list_two)  # True (Same contents)\n\n# But they are two distinct objects at different memory addresses:\nprint(list_one is list_two)  # False (Different objects in RAM!)\n\n# Comparing with None (Always use 'is'):\nresult = None\nif result is None:\n    print(\"Operation returned no result.\")"
      },
      {
        "title": "3. The Small Integer Cache (-5 to 256) & String Interning",
        "theory": [
          "CPython Memory Optimization: Since integers between -5 and 256 are used constantly in loops and indexing, CPython pre-allocates an array of singleton integer objects for all numbers in the range `[-5, 256]` during interpreter startup.",
          "Anytime you assign an integer in this range, Python points your variable to the pre-existing cached object instead of allocating fresh memory!",
          "Numbers outside this range get new distinct objects allocated in memory."
        ],
        "syntax": "# Inside the small integer cache [-5 to 256]:\nx = 250\ny = 250\nprint(\"250 is 250:\", x is y)  # True! Pointing to cached CPython singleton!\n\n# Outside the small integer cache:\nx = 1000\ny = 1000\nprint(\"1000 is 1000:\", x is y)  # False (in interactive REPL; distinct memory objects!)\nprint(\"1000 == 1000:\", x == y)  # True (Values match!)",
        "tips": [
          "This is a favourite Python interview question! Explaining CPython's small integer cache demonstrates deep systems understanding."
        ],
        "codeExample": "# Inside the small integer cache [-5 to 256]:\nx = 250\ny = 250\nprint(\"250 is 250:\", x is y)  # True! Pointing to cached CPython singleton!\n\n# Outside the small integer cache:\nx = 1000\ny = 1000\nprint(\"1000 is 1000:\", x is y)  # False (in interactive REPL; distinct memory objects!)\nprint(\"1000 == 1000:\", x == y)  # True (Values match!)"
      },
      {
        "title": "4. Core Primitive Data Types Overview",
        "theory": [
          "Python provides built-in primitive types: `int`, `float`, `complex`, `bool`, and `NoneType`.",
          "Arbitrary Precision Integers: In Python 3, integers have UNLIMITED precision! You can compute $2^{1000}$ without any integer overflow errors (unlike C/Java's 32-bit or 64-bit limits).",
          "Floating-point IEEE 754: Floats use double-precision (64-bit), meaning $0.1 + 0.2$ produces $0.30000000000000004$ due to binary floating-point representation."
        ],
        "syntax": "# 1. Arbitrary Precision Integers (No overflow!)\nhuge_number = 2 ** 100\nprint(\"2^100 =\", huge_number)\n\n# 2. Floats & Decimal for exact financial calculations:\nfrom decimal import Decimal\nf_sum = 0.1 + 0.2\nprint(\"Float sum:\", f_sum)  # 0.30000000000000004\n\nd_sum = Decimal(\"0.1\") + Decimal(\"0.2\")\nprint(\"Decimal sum:\", d_sum)  # Decimal('0.3') (Exact!)\n\n# 3. Booleans are subclasses of integers!\nprint(isinstance(True, int))  # True\nprint(True + True)             # 2",
        "tips": [
          "For financial or billing calculations involving money and currencies, always use the `decimal.Decimal` module to avoid float rounding errors."
        ],
        "codeExample": "# 1. Arbitrary Precision Integers (No overflow!)\nhuge_number = 2 ** 100\nprint(\"2^100 =\", huge_number)\n\n# 2. Floats & Decimal for exact financial calculations:\nfrom decimal import Decimal\nf_sum = 0.1 + 0.2\nprint(\"Float sum:\", f_sum)  # 0.30000000000000004\n\nd_sum = Decimal(\"0.1\") + Decimal(\"0.2\")\nprint(\"Decimal sum:\", d_sum)  # Decimal('0.3') (Exact!)\n\n# 3. Booleans are subclasses of integers!\nprint(isinstance(True, int))  # True\nprint(True + True)             # 2"
      }
    ]
  },
  {
    "id": "py-operators",
    "chapterNumber": 5,
    "title": "Python Basic Operators & Precedence",
    "category": "Python Basics",
    "shortDesc": "Complete operators guide: arithmetic, comparison, logical short-circuiting, bitwise, assignment, and operator precedence order.",
    "overview": [
      "Operators are special symbols and keywords in Python that carry out arithmetic, logical, and relational computations.",
      "Python features unique, high-level operators like floor division `//`, exponentiation `**`, chained comparisons `1 < x < 10`, and short-circuit logical operators.",
      "Understanding Operator Precedence ensures your mathematical and boolean expressions evaluate exactly in the intended order without unexpected logical bugs."
    ],
    "sections": [
      {
        "title": "1. Arithmetic Operators (/, //, %, **)",
        "theory": [
          "Division `/`: Always returns a floating-point number in Python 3 (e.g. `10 / 2` yields `5.0`).",
          "Floor Division `//`: Divides and truncates down to the nearest integer towards negative infinity (e.g. `7 // 2` yields `3`, `-7 // 2` yields `-4`).",
          "Modulo `%`: Returns the remainder of division.",
          "Exponentiation `**`: Power operator (e.g. `2 ** 3` yields `8`)."
        ],
        "syntax": "a = 17\nb = 5\n\nprint(f\"{a} / {b}  = {a / b}\")    # 3.4 (Standard float division)\nprint(f\"{a} // {b} = {a // b}\")   # 3 (Floor division)\nprint(f\"{a} % {b}  = {a % b}\")    # 2 (Remainder)\nprint(f\"2 ** 8    = {2 ** 8}\")    # 256 (2 to the power 8)\n\n# Floor division negative rounding gotcha:\nprint(f\"-7 // 2   = {-7 // 2}\")   # -4 (Floors towards -infinity, NOT -3!)",
        "tips": [
          "Remember that `//` rounds DOWN towards negative infinity, not towards zero."
        ],
        "codeExample": "a = 17\nb = 5\n\nprint(f\"{a} / {b}  = {a / b}\")    # 3.4 (Standard float division)\nprint(f\"{a} // {b} = {a // b}\")   # 3 (Floor division)\nprint(f\"{a} % {b}  = {a % b}\")    # 2 (Remainder)\nprint(f\"2 ** 8    = {2 ** 8}\")    # 256 (2 to the power 8)\n\n# Floor division negative rounding gotcha:\nprint(f\"-7 // 2   = {-7 // 2}\")   # -4 (Floors towards -infinity, NOT -3!)"
      },
      {
        "title": "2. Comparison Operators & Python's Chained Comparisons",
        "theory": [
          "Standard comparisons: `==` (equal), `!=` (not equal), `<`, `>`, `<=`, `>=`.",
          "Chained Comparisons: In most languages (C/Java/JS), writing `1 < x < 10` evaluates `(1 < x) < 10` which causes logical bugs.",
          "Python Superpower: Python natively supports mathematical chained comparisons! `18 <= age <= 60` automatically translates to `18 <= age and age <= 60` cleanly."
        ],
        "syntax": "age = 25\n\n# Pythonic Chained Comparison:\nif 18 <= age <= 60:\n    print(\"Eligible working-age adult.\")\n\n# Multiple chains:\nx = 5\nprint(1 < x < 10 < 20)  # True!\n\n# Comparing strings (Lexicographical alphabetical order):\nprint(\"apple\" < \"banana\")  # True\nprint(\"cat\" == \"Cat\")       # False (Case-sensitive!)",
        "tips": [
          "Use chained comparisons to make boundary checks (e.g., `0 <= score <= 100`) expressive and clean."
        ],
        "codeExample": "age = 25\n\n# Pythonic Chained Comparison:\nif 18 <= age <= 60:\n    print(\"Eligible working-age adult.\")\n\n# Multiple chains:\nx = 5\nprint(1 < x < 10 < 20)  # True!\n\n# Comparing strings (Lexicographical alphabetical order):\nprint(\"apple\" < \"banana\")  # True\nprint(\"cat\" == \"Cat\")       # False (Case-sensitive!)"
      },
      {
        "title": "3. Logical Operators & Short-Circuit Evaluation",
        "theory": [
          "Python uses plain English words for boolean logic: `and`, `or`, `not` (instead of `&&`, `||`, `!`).",
          "Short-Circuit Evaluation: Python evaluates logical expressions from left to right and stops as soon as the final outcome is determined.",
          "With `and`: If the first operand is False, Python NEVER evaluates the second operand.",
          "With `or`: If the first operand is True, Python NEVER evaluates the second operand.",
          "Truthiness: Zero, empty collections (`[]`, `{}`, `\"\"`, `()`, `set()`), `None`, and `False` are Falsy; everything else is Truthy."
        ],
        "syntax": "# 1. Short-circuit preventing division by zero crash:\ndenominator = 0\nnumerator = 100\n\n# The right side is NEVER evaluated because 'denominator != 0' is False:\nif denominator != 0 and (numerator / denominator) > 2:\n    print(\"Safe division performed.\")\nelse:\n    print(\"Safely avoided ZeroDivisionError thanks to short-circuiting!\")\n\n# 2. Returning actual operands (Pythonic default assignment):\nuser_name = \"\"\ndisplay_name = user_name or \"Anonymous Guest\"\nprint(\"Display Name:\", display_name)  # \"Anonymous Guest\"",
        "tips": [
          "Leverage `x or default_value` as a concise idiom for assigning fallback values when `x` might be empty or None."
        ],
        "codeExample": "# 1. Short-circuit preventing division by zero crash:\ndenominator = 0\nnumerator = 100\n\n# The right side is NEVER evaluated because 'denominator != 0' is False:\nif denominator != 0 and (numerator / denominator) > 2:\n    print(\"Safe division performed.\")\nelse:\n    print(\"Safely avoided ZeroDivisionError thanks to short-circuiting!\")\n\n# 2. Returning actual operands (Pythonic default assignment):\nuser_name = \"\"\ndisplay_name = user_name or \"Anonymous Guest\"\nprint(\"Display Name:\", display_name)  # \"Anonymous Guest\""
      },
      {
        "title": "4. Complete Operator Precedence Reference Table",
        "theory": [
          "When an expression contains multiple operators, Python evaluates them according to strict precedence rules (from highest precedence at top to lowest at bottom)."
        ],
        "syntax": "# Precedence demo: Exponentiation has higher precedence than unary minus!\nprint(-2 ** 4)    # -16 (Evaluated as -(2**4)!)\nprint((-2) ** 4)  # 16  (Parentheses override precedence!)",
        "table": [
          {
            "attribute": "1 (Highest)",
            "value": "( )",
            "description": "Parentheses (explicit grouping)"
          },
          {
            "attribute": "2",
            "value": "**",
            "description": "Exponentiation (evaluates right-to-left!)"
          },
          {
            "attribute": "3",
            "value": "+x, -x, ~x",
            "description": "Unary positive, negation, bitwise NOT"
          },
          {
            "attribute": "4",
            "value": "*, /, //, %",
            "description": "Multiplication, Division, Floor division, Modulo"
          },
          {
            "attribute": "5",
            "value": "+, -",
            "description": "Addition, Subtraction"
          },
          {
            "attribute": "6",
            "value": "<<, >>",
            "description": "Bitwise shift operators"
          },
          {
            "attribute": "7",
            "value": "&",
            "description": "Bitwise AND"
          },
          {
            "attribute": "8",
            "value": "^",
            "description": "Bitwise XOR"
          },
          {
            "attribute": "9",
            "value": "|",
            "description": "Bitwise OR"
          },
          {
            "attribute": "10",
            "value": "==, !=, <, <=, >, >=",
            "description": "Comparisons, Identity (is), Membership (in)"
          },
          {
            "attribute": "11",
            "value": "not",
            "description": "Boolean NOT"
          },
          {
            "attribute": "12",
            "value": "and",
            "description": "Boolean AND"
          },
          {
            "attribute": "13 (Lowest)",
            "value": "or",
            "description": "Boolean OR"
          }
        ],
        "tips": [
          "When in doubt, ALWAYS use parentheses `()` to make your intended precedence explicit. Never force your teammates to guess operator priority!"
        ],
        "codeExample": "# Precedence demo: Exponentiation has higher precedence than unary minus!\nprint(-2 ** 4)    # -16 (Evaluated as -(2**4)!)\nprint((-2) ** 4)  # 16  (Parentheses override precedence!)"
      }
    ]
  },
  {
    "id": "py-decision",
    "chapterNumber": 6,
    "title": "Python Decision Making & Pattern Matching",
    "category": "Control Flow",
    "shortDesc": "Master conditional logic in Python: if, elif, else ladders, truthiness, the ternary operator, and Python 3.10+ match-case structural pattern matching.",
    "overview": [
      "Decision making allows programs to execute different code blocks depending on whether a boolean condition evaluates to True or False.",
      "Python relies strictly on whitespace indentation (standard 4 spaces) rather than curly braces to define conditional blocks.",
      "Python features 'Truthy' and 'Falsy' evaluation: every object in Python has an inherent boolean value when placed in an if condition.",
      "Python 3.10 introduced Structural Pattern Matching ('match-case'), providing modern switch-like capabilities with powerful pattern destructuring."
    ],
    "sections": [
      {
        "title": "1. Conditional Ladders: if, elif, and else",
        "theory": [
          "The 'if' statement evaluates a condition. If the condition is True, the indented block directly underneath runs.",
          "The 'elif' (short for else-if) allows you to check multiple mutually exclusive conditions in sequence.",
          "Short-Circuit Execution: As soon as the FIRST condition in an if-elif ladder evaluates to True, Python executes that block and immediately SKIPS all remaining elif and else checks.",
          "The 'else' block is optional and catches everything that did not match any previous condition."
        ],
        "syntax": "# Basic if-elif-else ladder:\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelif score >= 70:\n    grade = 'C'\nelse:\n    grade = 'F'",
        "tips": [
          "Clean Code Tip: Order your elif conditions from most restrictive to least restrictive (e.g. 90, 80, 70), otherwise higher numbers will be trapped by lower thresholds!"
        ],
        "table": [
          {
            "attribute": "if condition:",
            "value": "Primary Check",
            "description": "Executes block if condition evaluates to True."
          },
          {
            "attribute": "elif condition:",
            "value": "Subsequent Check",
            "description": "Tested only if all preceding if/elif checks were False."
          },
          {
            "attribute": "else:",
            "value": "Fallback Block",
            "description": "Executes when none of the above conditions were met."
          }
        ],
        "codeExample": "# 1. Conditional Grading System\nscore = 85\n\nif score >= 90:\n    grade = \"A (Distinction)\"\nelif score >= 80:\n    grade = \"B (Merit)\"\nelif score >= 70:\n    grade = \"C (Pass)\"\nelse:\n    grade = \"Needs Improvement\"\n\nprint(f\"Score: {score} -> Grade: {grade}\")",
        "browserOutputDesc": "Score: 85 -> Grade: B (Merit)"
      },
      {
        "title": "2. Logical Operators & Truthiness in Python",
        "theory": [
          "Combine conditions using logical operators: 'and' (both True), 'or' (at least one True), and 'not' (inverts boolean).",
          "Python Truthiness: You do not need to write 'if len(items) > 0:'. Python evaluates empty containers as False and populated containers as True!",
          "Falsy Values in Python: None, False, 0, 0.0, empty string \"\", empty list [], empty dict {}, empty tuple (), and empty set().",
          "Truthy Values: Any non-zero number, non-empty string, or non-empty collection is considered True."
        ],
        "syntax": "# Logical operators:\nif age >= 18 and has_license:\n    print('Can drive')\n\n# Truthiness check (Pythonic):\nusers = ['Alice', 'Bob']\nif users:  # Automatically True because list is non-empty!\n    print(f'Total users: {len(users)}')",
        "tips": [
          "Avoid redundant comparisons: Never write 'if is_valid == True:'. Simply write 'if is_valid:'."
        ],
        "table": [
          {
            "attribute": "and",
            "value": "Logical AND",
            "description": "Returns True only if BOTH left and right operands evaluate to True."
          },
          {
            "attribute": "or",
            "value": "Logical OR",
            "description": "Returns True if AT LEAST ONE operand evaluates to True."
          },
          {
            "attribute": "not",
            "value": "Logical NOT",
            "description": "Inverts boolean truth value (not True -> False)."
          }
        ],
        "codeExample": "# 2. Truthiness & Logical Operators Demo\ncart = [\"Laptop\", \"Mouse\"]\ndiscount_code = \"SUMMER2026\"\nuser_logged_in = True\n\n# Pythonic truthy check\nif cart and user_logged_in:\n    print(\"Cart has items and user is authenticated.\")\n\n# Falsy demonstration\nempty_message = \"\"\nif not empty_message:\n    print(\"Notice: Message field is empty (Falsy)!\")",
        "browserOutputDesc": "Cart has items and user is authenticated.\nNotice: Message field is empty (Falsy)!"
      },
      {
        "title": "3. The Python Ternary Operator (Inline If-Else)",
        "theory": [
          "The ternary operator provides a clean, single-line expression to assign a value based on a condition.",
          "Formula: value_if_true if condition else value_if_false.",
          "Unlike a full if statement, a ternary operator is an EXPRESSION, meaning it evaluates to a value that can be assigned directly to a variable or passed as an argument."
        ],
        "syntax": "# Syntax: [on_true] if [condition] else [on_false]\nstatus = 'Adult' if age >= 18 else 'Minor'\n\n# In function calls:\nprint('Passed' if score >= 50 else 'Failed')",
        "tips": [
          "Do not nest ternary operators (e.g. a if x else b if y else c) — it severely harms readability. Use standard if-elif blocks for multiple branches."
        ],
        "table": [
          {
            "attribute": "x if cond else y",
            "value": "Ternary Expression",
            "description": "Evaluates to x when cond is True, otherwise evaluates to y."
          }
        ],
        "codeExample": "# 3. Ternary Operator in Real Scenarios\nage = 20\nstatus = \"Eligible to Vote\" if age >= 18 else \"Too Young\"\nprint(f\"Age {age}: {status}\")\n\n# Setting default values\nuser_input = \"\"\nusername = user_input if user_input else \"Guest_User\"\nprint(\"Current Username:\", username)",
        "browserOutputDesc": "Age 20: Eligible to Vote\nCurrent Username: Guest_User"
      },
      {
        "title": "4. Modern Pattern Matching (match-case)",
        "theory": [
          "Introduced in Python 3.10 (PEP 634), 'match-case' provides structural pattern matching.",
          "It goes beyond C/Java switch statements: it can inspect shapes of data, match types, unpack sequences, and apply conditional 'if guards'.",
          "The wildcard underscore '_' acts as the default / catch-all case.",
          "Pipe operator '|' allows matching multiple alternative patterns in a single case statement."
        ],
        "syntax": "match command.split():\n    case ['quit']:\n        sys.exit()\n    case ['go', direction]:\n        move(direction)\n    case ['look', ('left' | 'right') as side]:\n        inspect(side)\n    case _:\n        print('Unknown command')",
        "tips": [
          "Pattern Guards: You can add an 'if condition' after a case to validate constraints (e.g. 'case Point(x, y) if x == y:')."
        ],
        "table": [
          {
            "attribute": "match value:",
            "value": "Subject Expression",
            "description": "Evaluates expression to match against cases."
          },
          {
            "attribute": "case pattern:",
            "value": "Pattern Match",
            "description": "Matches exact value, type, or structural sequence."
          },
          {
            "attribute": "case _:",
            "value": "Default Wildcard",
            "description": "Matches any value that did not hit a previous case."
          }
        ],
        "codeExample": "# 4. Python 3.10+ match-case in Action\ndef route_api_status(status_code: int) -> str:\n    match status_code:\n        case 200 | 201:\n            return \"SUCCESS: HTTP 200 OK\"\n        case 400:\n            return \"ERROR: 400 Bad Request Payload\"\n        case 401 | 403:\n            return \"SECURITY: 401/403 Unauthorized Access\"\n        case 404:\n            return \"NOT FOUND: 404 Resource missing\"\n        case 500 | 502 | 503:\n            return \"SERVER ERROR: 50x Internal Failure\"\n        case _:\n            return f\"UNKNOWN: Status {status_code}\"\n\nprint(route_api_status(200))\nprint(route_api_status(404))\nprint(route_api_status(503))\nprint(route_api_status(999))",
        "browserOutputDesc": "SUCCESS: HTTP 200 OK\nNOT FOUND: 404 Resource missing\nSERVER ERROR: 50x Internal Failure\nUNKNOWN: Status 999"
      }
    ]
  },
  {
    "id": "py-loops",
    "chapterNumber": 7,
    "title": "Python Loops: while, for, range & else with Loops",
    "category": "Control Flow",
    "shortDesc": "Comprehensive guide to Python iteration: for loops, range(), while loops, loop controls (break, continue, pass), enumerate, zip, and loop else clauses.",
    "overview": [
      "Loops automate repetitive tasks by executing a block of code multiple times.",
      "Python has two fundamental loop constructs: 1) 'for' loops (iterating over sequences like lists, strings, and ranges) and 2) 'while' loops (executing as long as a condition remains True).",
      "Python for loops are NOT traditional index-counter loops like C/Java; they work on the Iterator Protocol, fetching items directly from any iterable.",
      "Python features a unique 'else' clause attached to loops that executes ONLY IF the loop completes normally without encountering a break statement."
    ],
    "sections": [
      {
        "title": "1. The for Loop & range(start, stop, step)",
        "theory": [
          "A 'for' loop iterates over the items of any sequence (such as a string, list, tuple, or range).",
          "The range() function produces an arithmetic progression of integers without storing them all in memory (lazy evaluation).",
          "range(stop): Starts from 0 up to stop - 1 (e.g. range(5) gives 0, 1, 2, 3, 4).",
          "range(start, stop): Starts from start up to stop - 1 (e.g. range(2, 6) gives 2, 3, 4, 5).",
          "range(start, stop, step): Increments by step (e.g. range(0, 10, 2) gives 0, 2, 4, 6, 8)."
        ],
        "syntax": "# 1. Iterating over collection:\nfor item in ['Apple', 'Banana', 'Cherry']:\n    print(item)\n\n# 2. Iterating with range:\nfor i in range(1, 6):\n    print(f'Step {i}')",
        "tips": [
          "Memory Efficiency: In Python 3, range() uses constant O(1) memory whether you write range(10) or range(10_000_000)!"
        ],
        "table": [
          {
            "attribute": "range(n)",
            "value": "0 to n-1",
            "description": "Generates sequence of n integers starting at 0."
          },
          {
            "attribute": "range(start, stop)",
            "value": "start to stop-1",
            "description": "Generates sequence from start up to (excluding) stop."
          },
          {
            "attribute": "range(start, stop, step)",
            "value": "With Stride",
            "description": "Increments by step; negative step counts backwards."
          }
        ],
        "codeExample": "# 1. For Loop & Range Demonstrations\nprint(\"Counting 1 to 5:\")\nfor i in range(1, 6):\n    print(i, end=\" \")\nprint(\"\\n\")\n\nprint(\"Even numbers up to 10:\")\nfor even in range(2, 11, 2):\n    print(even, end=\" \")\nprint(\"\\n\")\n\nprint(\"Iterating through a string:\")\nfor letter in \"PYTHON\":\n    print(f\"[{letter}]\", end=\" \")\nprint()",
        "browserOutputDesc": "Counting 1 to 5:\n1 2 3 4 5 \n\nEven numbers up to 10:\n2 4 6 8 10 \n\nIterating through a string:\n[P] [Y] [T] [H] [O] [N] "
      },
      {
        "title": "2. The while Loop & Infinite Loop Traps",
        "theory": [
          "A 'while' loop executes as long as a test condition evaluates to True.",
          "While loops are ideal when you do not know ahead of time how many iterations will be required (e.g. reading from a network socket, waiting for user input, or running a game loop).",
          "The Infinite Loop Trap: If the condition never becomes False and no break statement is encountered, the loop will run forever, locking up your CPU. Always ensure the loop variable increments towards termination!"
        ],
        "syntax": "# Standard while loop with counter:\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1  # Crucial! Prevents infinite loop.",
        "tips": [
          "If your program hangs and refuses to respond, you likely created an infinite while loop! Press Ctrl+C in terminal to kill it."
        ],
        "table": [
          {
            "attribute": "while condition:",
            "value": "Condition Loop",
            "description": "Repeats execution of indented block as long as condition evaluates to True."
          }
        ],
        "codeExample": "# 2. While Loop & Number Guessing Logic\nbalance = 100\nwithdrawal = 25\ntransactions = 0\n\nprint(f\"Starting Balance: ${balance}\")\nwhile balance >= withdrawal:\n    balance -= withdrawal\n    transactions += 1\n    print(f\"Withdrawal #{transactions}: Withdrew ${withdrawal}, Remaining: ${balance}\")\n\nprint(f\"Finished. Total successful transactions: {transactions}\")",
        "browserOutputDesc": "Starting Balance: $100\nWithdrawal #1: Withdrew $25, Remaining: $75\nWithdrawal #2: Withdrew $25, Remaining: $50\nWithdrawal #3: Withdrew $25, Remaining: $25\nWithdrawal #4: Withdrew $25, Remaining: $0\nFinished. Total successful transactions: 4"
      },
      {
        "title": "3. Loop Control Statements: break, continue, pass",
        "theory": [
          "break: Terminates the entire loop immediately. Execution resumes at the next statement outside the loop.",
          "continue: Skips the remainder of the CURRENT iteration and jumps straight to the next iteration.",
          "pass: A syntactical placeholder statement that does nothing (a no-op). Used when a statement is required by Python syntax but no code needs to be executed yet."
        ],
        "syntax": "# 1. break:\nfor x in range(10):\n    if x == 5:\n        break  # Stops loop at 5\n\n# 2. continue:\nfor x in range(5):\n    if x == 2:\n        continue  # Skips 2\n    print(x)",
        "tips": [
          "Use pass when designing code skeletons: 'def process_data(): pass' allows your script to compile without SyntaxError: expected an indented block."
        ],
        "table": [
          {
            "attribute": "break",
            "value": "Loop Abort",
            "description": "Immediately exits the nearest enclosing loop."
          },
          {
            "attribute": "continue",
            "value": "Skip Iteration",
            "description": "Bypasses remaining code in current cycle and starts next cycle."
          },
          {
            "attribute": "pass",
            "value": "Null Statement",
            "description": "Does nothing; acts as placeholder for empty blocks."
          }
        ],
        "codeExample": "# 3. break, continue and pass in Action\nprint(\"Demo of 'continue' (skipping number 3):\")\nfor num in range(1, 6):\n    if num == 3:\n        continue  # Skip 3\n    print(num, end=\" \")\nprint(\"\\n\")\n\nprint(\"Demo of 'break' (stopping when 4 is found):\")\nfor num in range(1, 10):\n    if num == 4:\n        print(f\"Found {num}! Breaking out.\")\n        break\n    print(num, end=\" \")",
        "browserOutputDesc": "Demo of 'continue' (skipping number 3):\n1 2 4 5 \n\nDemo of 'break' (stopping when 4 is found):\n1 2 3 Found 4! Breaking out."
      },
      {
        "title": "4. The Unique Python Loop 'else' Construct",
        "theory": [
          "Python is one of the few languages where loops can have an optional 'else:' clause.",
          "The Golden Rule of Loop Else: The 'else' block executes ONLY IF the loop finishes its iterations naturally WITHOUT hitting a 'break' statement.",
          "Why is this useful? It eliminates the need for clumsy boolean flag variables (like 'found = False') when searching collections for an item!"
        ],
        "syntax": "# Prime Number Search Pattern with loop else:\nfor item in collection:\n    if matches_condition(item):\n        print('Found!')\n        break\nelse:\n    print('Not found anywhere in collection!')",
        "tips": [
          "Mental Model: Think of loop 'else' as 'no break'. If no break was triggered during the entire loop, the else block runs."
        ],
        "table": [
          {
            "attribute": "loop else:",
            "value": "No-Break Clause",
            "description": "Runs only if loop completed all cycles without hitting a break."
          }
        ],
        "codeExample": "# 4. Clean Search Algorithm using loop 'else'\ndef search_database(records: list[str], target: str):\n    print(f\"Searching for '{target}' in records...\")\n    for item in records:\n        if item.lower() == target.lower():\n            print(f\"SUCCESS: Found '{item}' in database!\")\n            break\n    else:\n        # Runs ONLY if loop finished without hitting break!\n        print(f\"ALERT: Target '{target}' not found in any record.\")\n\nusers = [\"Alice\", \"Bob\", \"Charlie\"]\nsearch_database(users, \"Charlie\")\nprint()\nsearch_database(users, \"David\")",
        "browserOutputDesc": "Searching for 'Charlie' in records...\nSUCCESS: Found 'Charlie' in database!\n\nSearching for 'David' in records...\nALERT: Target 'David' not found in any record."
      },
      {
        "title": "5. Iterating with enumerate() and zip()",
        "theory": [
          "enumerate(iterable, start=0): Returns both the index and the item simultaneously in each iteration. Eliminates clumsy 'range(len(list))' code.",
          "zip(*iterables): Takes two or more iterables and aggregates their elements into pairs/tuples in lockstep. It stops as soon as the shortest iterable is exhausted."
        ],
        "syntax": "# 1. enumerate:\nfor idx, item in enumerate(['A', 'B', 'C'], start=1):\n    print(idx, item)\n\n# 2. zip:\nnames = ['Alice', 'Bob']\nscores = [95, 88]\nfor name, score in zip(names, scores):\n    print(f'{name}: {score}')",
        "tips": [
          "Never write 'for i in range(len(my_list)): print(i, my_list[i])'. In Python, always write 'for i, item in enumerate(my_list):'."
        ],
        "table": [
          {
            "attribute": "enumerate(s, start=0)",
            "value": "(index, item)",
            "description": "Generates tuple of count and item for clean indexing."
          },
          {
            "attribute": "zip(s1, s2)",
            "value": "(s1_item, s2_item)",
            "description": "Pairs elements from multiple sequences simultaneously."
          }
        ],
        "codeExample": "# 5. Professional Iteration with enumerate and zip\ntechnologies = [\"Python\", \"Angular\", \"SQLite\", \"Docker\"]\n\nprint(\"--- Course Curriculum (using enumerate) ---\")\nfor rank, tech in enumerate(technologies, start=1):\n    print(f\"Module {rank:02d}: {tech}\")\n\nprint(\"\\n--- Student Leaderboard (using zip) ---\")\nstudents = [\"Priya\", \"Rahul\", \"Aarav\"]\nmarks = [98, 92, 89]\ngrades = [\"A+\", \"A\", \"A-\"]\n\nfor student, mark, grade in zip(students, marks, grades):\n    print(f\"Student: {student:<8} | Mark: {mark} | Grade: {grade}\")",
        "browserOutputDesc": "--- Course Curriculum (using enumerate) ---\nModule 01: Python\nModule 02: Angular\nModule 03: SQLite\nModule 04: Docker\n\n--- Student Leaderboard (using zip) ---\nStudent: Priya    | Mark: 98 | Grade: A+\nStudent: Rahul    | Mark: 92 | Grade: A\nStudent: Aarav    | Mark: 89 | Grade: A-"
      }
    ]
  },
  {
    "id": "py-strings",
    "chapterNumber": 8,
    "title": "Python Strings & Complete Built-in Methods Table",
    "category": "Data Structures",
    "shortDesc": "Complete zero-to-mastery guide to Python strings: quotes, indexing, slicing, immutability, escape characters, f-strings, and 35+ built-in methods.",
    "overview": [
      "In Python, a string is a sequential collection of characters used to store and manipulate text (letters, numbers, spaces, emojis, and symbols).",
      "Strings in Python are surrounded by single quotes ('...'), double quotes (\"...\"), or triple quotes ('''...''' or \"\"\"...\"\"\").",
      "Crucial Core Rule: Python strings are strictly IMMUTABLE. Once created, individual characters cannot be changed or deleted in-place. Any modification creates a brand new string.",
      "Python 3 strings are fully Unicode (UTF-8 by default), meaning they natively support Hindi, Japanese, Arabic, and all international characters without special configuration."
    ],
    "sections": [
      {
        "title": "1. What is a String? (Creation, Quotes & Length)",
        "theory": [
          "Single Quotes ('...') and Double Quotes (\"...\") work identically in Python. You can use double quotes when your string contains a single quote/apostrophe (e.g. \"It's raining\"), and single quotes when your string contains double quotes (e.g. 'He said \"Hello\"').",
          "Triple Quotes ('''...''' or \"\"\"...\"\"\") allow multi-line strings spanning multiple lines without needing manual newline characters. They are also universally used as function and class docstrings.",
          "The len() function returns the total count of characters in a string, including spaces, punctuation, and invisible newline characters.",
          "String Concatenation: Use the '+' operator to join two strings together into one.",
          "String Repetition: Use the '*' operator to repeat a string multiple times (e.g. 'Ha' * 3 gives 'HaHaHa').",
          "Membership Operators: Use 'in' and 'not in' to quickly check if a substring exists within a string (returns True or False)."
        ],
        "syntax": "# Different ways to declare strings:\nstr1 = 'Single quote string'\nstr2 = \"Double quote string (great for apostrophes: It's working)\"\nstr3 = \"\"\"Multi-line\nstring spanning\nacross multiple lines\"\"\"\n\n# Common operations:\ntotal_chars = len(str1)\ncombined = str1 + \" \" + str2\nrepeated = \"-=\" * 10\nexists = \"working\" in str2",
        "tips": [
          "Beginner Tip: Never confuse a number inside quotes with an actual number. '5' + '5' produces '55' (concatenation), not 10!",
          "Use int('5') or float('3.14') to convert string digits to numbers before doing math."
        ],
        "table": [
          {
            "attribute": "'...' vs \"...\"",
            "value": "Single / Double",
            "description": "Standard single-line text string. Use double quotes to avoid escaping apostrophes."
          },
          {
            "attribute": "'''...''' or \"\"\"...\"\"\"",
            "value": "Triple Quotes",
            "description": "Multi-line text blocks and function/module documentation strings (docstrings)."
          },
          {
            "attribute": "len(s)",
            "value": "Integer",
            "description": "Calculates the exact number of characters (letters, spaces, punctuation) in string s."
          },
          {
            "attribute": "s1 + s2",
            "value": "Concatenation",
            "description": "Glues two strings together into a single new string."
          },
          {
            "attribute": "s * n",
            "value": "Repetition",
            "description": "Repeats string s exactly n times."
          },
          {
            "attribute": "\"abc\" in s",
            "value": "Boolean (True/False)",
            "description": "Checks whether the substring 'abc' is present anywhere inside string s."
          }
        ],
        "codeExample": "# 1. String Creation, Concatenation, and Membership\nfirst_name = \"Alex\"\nlast_name = 'Smith'\n\n# Joining strings with '+'\nfull_name = first_name + \" \" + last_name\nprint(\"Full Name:\", full_name)\nprint(\"Total Characters:\", len(full_name))\n\n# Multi-line string with triple quotes\nwelcome_letter = \"\"\"Dear Student,\nWelcome to ConverterAllAI Python Academy!\nStart your journey today.\"\"\"\nprint(\"\\n--- Welcome Letter ---\")\nprint(welcome_letter)\n\n# Repetition with '*'\ndivider = \"=\" * 30\nprint(divider)\n\n# Checking membership with 'in'\nprint(\"Is 'Academy' in letter?\", \"Academy\" in welcome_letter)\nprint(\"Is 'Java' in letter?\", \"Java\" in welcome_letter)",
        "browserOutputDesc": "Full Name: Alex Smith\nTotal Characters: 10\n\n--- Welcome Letter ---\nDear Student,\nWelcome to ConverterAllAI Python Academy!\nStart your journey today.\n==============================\nIs 'Academy' in letter? True\nIs 'Java' in letter? False"
      },
      {
        "title": "2. String Indexing & Negative Indexing (Visual Positions)",
        "theory": [
          "Python strings are ordered sequences. Every single character has a specific numerical position called an Index.",
          "Zero-Based Positive Indexing: The first character starts at index 0, the second at 1, the third at 2, all the way up to len(s) - 1.",
          "Negative Indexing (Reading Backwards): Python provides negative indexes where -1 represents the very last character, -2 is the second-to-last, and -len(s) is the very first character.",
          "Off-by-One Trap (IndexError): If a string has 5 characters (indexes 0 to 4), trying to access index 5 will immediately crash your program with: IndexError: string index out of range."
        ],
        "syntax": "# Accessing characters by index:\ns = \"PYTHON\"\nfirst_char = s[0]    # 'P'\nsecond_char = s[1]   # 'Y'\nlast_char = s[-1]    # 'N'\nsecond_last = s[-2]  # 'O'",
        "tips": [
          "Visual Diagram of \"PYTHON\":\nIndex (Positive):   0    1    2    3    4    5\nCharacters:         P    Y    T    H    O    N\nIndex (Negative):  -6   -5   -4   -3   -2   -1",
          "Rule of Thumb: Always use s[-1] instead of s[len(s)-1] to get the last character. It is cleaner and more Pythonic."
        ],
        "table": [
          {
            "attribute": "s[0]",
            "value": "First Character",
            "description": "Reads the very first character on the extreme left of the string."
          },
          {
            "attribute": "s[-1]",
            "value": "Last Character",
            "description": "Reads the very last character on the extreme right without needing len()."
          },
          {
            "attribute": "s[-2]",
            "value": "2nd Last Character",
            "description": "Reads the penultimate character (second from right)."
          },
          {
            "attribute": "IndexError",
            "value": "Runtime Error",
            "description": "Raised when trying to access an index >= len(s) or < -len(s)."
          }
        ],
        "codeExample": "# 2. Positive & Negative Indexing Demo\nword = \"ConverterAllAI\"\n\nprint(\"Target Word:\", word)\nprint(\"Length of word:\", len(word))\n\n# Positive indexes (left to right)\nprint(\"First character s[0]:\", word[0])\nprint(\"Second character s[1]:\", word[1])\n\n# Negative indexes (right to left)\nprint(\"Last character s[-1]:\", word[-1])\nprint(\"Second-to-last s[-2]:\", word[-2])\nprint(\"Third-to-last s[-3]:\", word[-3])\n\n# Safe Index Checking with try-except\ntry:\n    invalid_char = word[100]\nexcept IndexError as err:\n    print(\"Handled Expected Error:\", err)",
        "browserOutputDesc": "Target Word: ConverterAllAI\nLength of word: 14\nFirst character s[0]: C\nSecond character s[1]: o\nLast character s[-1]: I\nSecond-to-last s[-2]: A\nThird-to-last s[-3]: l\nHandled Expected Error: string index out of range"
      },
      {
        "title": "3. String Slicing Masterclass: [start : stop : step]",
        "theory": [
          "Slicing allows you to extract a sub-portion (substring) from a string using the syntax s[start : stop : step].",
          "Golden Boundary Rule: The 'start' index is INCLUDED, but the 'stop' index is EXCLUDED (math notation: [start, stop)). So s[0:3] extracts characters at index 0, 1, and 2 (total 3 characters).",
          "Omitted Defaults: If you leave 'start' blank (e.g. s[:4]), it defaults to 0 (starts from beginning). If you leave 'stop' blank (e.g. s[4:]), it defaults to the end of the string. s[:] creates a complete copy.",
          "The 'Step' Parameter: By default, step is 1. If step is 2 (e.g. s[::2]), Python skips every other character.",
          "String Reversal: Using a negative step of -1 (s[::-1]) is the standard, blazing-fast Pythonic way to completely reverse any string!",
          "Slicing Never Crashes: Unlike single indexing s[100], slicing s[0:100] will NEVER throw an IndexError even if the numbers are out of range. Python gracefully stops at the string boundaries."
        ],
        "syntax": "# Syntax: s[start : stop : step]\ns = \"Hello World\"\n\n# Extract first 5 characters (index 0, 1, 2, 3, 4):\npart1 = s[0:5]       # 'Hello'\n\n# Extract from index 6 to end:\npart2 = s[6:]        # 'World'\n\n# Extract every 2nd character:\nevery_other = s[::2] # 'HloWrd'\n\n# Completely reverse the string:\nreversed_s = s[::-1] # 'dlroW olleH'",
        "tips": [
          "Quick Formula: The length of slice s[i:j] is always equal to (j - i) when step is 1.",
          "Interview Favorite: 'How do you check if a word is a palindrome?' Just write: word == word[::-1]."
        ],
        "table": [
          {
            "attribute": "s[0:4]",
            "value": "First 4 chars",
            "description": "Extracts characters at index 0, 1, 2, 3 (stop 4 is excluded)."
          },
          {
            "attribute": "s[3:]",
            "value": "From index 3 to end",
            "description": "Omitted stop parameter takes all characters till the end."
          },
          {
            "attribute": "s[:5]",
            "value": "From start to 5",
            "description": "Omitted start parameter begins from index 0."
          },
          {
            "attribute": "s[::2]",
            "value": "Every 2nd char",
            "description": "Steps through string jumping 2 positions each time."
          },
          {
            "attribute": "s[::-1]",
            "value": "Reversed String",
            "description": "Walks backwards with step -1 to invert the character sequence."
          },
          {
            "attribute": "s[-5:]",
            "value": "Last 5 chars",
            "description": "Grabs the final 5 characters from the end of the string."
          }
        ],
        "codeExample": "# 3. Slicing Deep Dive & String Reversal\ntext = \"ConverterAllAI\"\n\nprint(\"Original:\", text)\nprint(\"First 9 chars [0:9]:\", text[0:9])\nprint(\"Omitted start [:9]:\", text[:9])\nprint(\"From index 9 onwards [9:]:\", text[9:])\n\n# Negative indexes in slicing\nprint(\"Last 2 chars [-2:]:\", text[-2:])\nprint(\"Exclude first 2 and last 2 [2:-2]:\", text[2:-2])\n\n# Step parameter\nprint(\"Every second character [::2]:\", text[::2])\nprint(\"Every third character [::3]:\", text[::3])\n\n# Reversing a string\nreversed_text = text[::-1]\nprint(\"Reversed String [::-1]:\", reversed_text)\n\n# Palindrome verification demo\ntest_word = \"racecar\"\nprint(f\"Is '{test_word}' a palindrome?\", test_word == test_word[::-1])",
        "browserOutputDesc": "Original: ConverterAllAI\nFirst 9 chars [0:9]: Converter\nOmitted start [:9]: Converter\nFrom index 9 onwards [9:]: AllAI\nLast 2 chars [-2:]: AI\nExclude first 2 and last 2 [2:-2]: nverterAll\nEvery second character [::2]: Cnevrli\nEvery third character [::3]: CvtAI\nReversed String [::-1]: IAllArevnoC\nIs 'racecar' a palindrome? True"
      },
      {
        "title": "4. String Immutability & Memory Concepts",
        "theory": [
          "What does 'Immutable' mean? Once a string object is created in memory, its characters cannot be altered, replaced, or deleted in place.",
          "If you try to write s[0] = 'H', Python will immediately raise: TypeError: 'str' object does not support item assignment.",
          "How do you 'modify' a string then? You create a NEW string by slicing, concatenating (+), or calling methods like replace(). The original string remains completely untouched.",
          "String Interning Optimization: For performance and memory efficiency, CPython automatically 'interns' (reuses the exact same memory address) short strings and valid Python identifier names. Two separate variables with value 'python' often point to the exact same memory location (id(a) == id(b)).",
          "CRITICAL PERFORMANCE TRAP (Loop Concatenation): Doing s += char inside a loop that runs 100,000 times forces Python to allocate new memory and copy all previous characters on EVERY iteration (O(n²) time complexity!).",
          "Production Best Practice: Always append items to a list and use ''.join(my_list) at the end. This is O(n) linear time complexity and up to 100x faster!"
        ],
        "syntax": "# Modifying a string safely by creating a new string:\noriginal = \"Jello World\"\n# original[0] = \"H\"  <-- THIS THROWS TypeError!\n\n# Correct way (Slicing + Concatenation):\ncorrected = \"H\" + original[1:]\nprint(corrected)  # \"Hello World\"\n\n# Production way to build strings:\nparts = [\"User\", \"Admin\", \"2026\"]\nresult = \":\".join(parts)",
        "tips": [
          "Memory Check: Use id(variable) to see the memory address of an object. Notice how variable re-assignment changes its id().",
          "Golden Rule: In any loop where you build text, NEVER use '+='. Always append to a list and use ''.join()."
        ],
        "table": [
          {
            "attribute": "s[0] = 'x'",
            "value": "TypeError",
            "description": "Forbidden in Python. Strings cannot be mutated in place."
          },
          {
            "attribute": "new_s = s.replace(a, b)",
            "value": "Returns New String",
            "description": "Original string s is NOT modified; a fresh modified string is returned."
          },
          {
            "attribute": "''.join(list)",
            "value": "O(n) Linear Time",
            "description": "Optimal way to combine thousands of string chunks without quadratic memory reallocations."
          },
          {
            "attribute": "id(s)",
            "value": "Memory Address",
            "description": "Returns the unique integer memory pointer of the string object in CPython."
          }
        ],
        "codeExample": "# 4. Immutability Demonstration & Safe String Modification\nmessage = \"Python is Cool\"\nprint(\"Original Message:\", message)\nprint(\"Memory address:\", id(message))\n\n# Attempting mutation raises TypeError\ntry:\n    # message[0] = \"J\"  # Illegal in Python!\n    raise TypeError(\"'str' object does not support item assignment\")\nexcept TypeError as err:\n    print(\"\\nProof of Immutability:\", err)\n\n# Proper way to create a modified version:\nnew_message = \"J\" + message[1:]\nprint(\"Modified (New String):\", new_message)\nprint(\"New Memory address:\", id(new_message))\n\n# Best Practice: Building large strings with list + join()\nwords = [\"Fast\", \"Scalable\", \"Reliable\", \"Python\"]\nsentence = \" | \".join(words)\nprint(\"\\nJoined List with delimiter:\", sentence)",
        "browserOutputDesc": "Original Message: Python is Cool\nMemory address: 140238120\n\nProof of Immutability: 'str' object does not support item assignment\nModified (New String): Jython is Cool\nNew Memory address: 140239456\n\nJoined List with delimiter: Fast | Scalable | Reliable | Python"
      },
      {
        "title": "5. Escape Sequences & Raw Strings (r\"...\")",
        "theory": [
          "Escape sequences allow you to include special characters in strings that would otherwise be difficult or illegal to type directly.",
          "An escape sequence starts with a backslash '\\' followed by a special character.",
          "Most Common Escapes: '\\n' inserts a new line (Enter key), '\\t' inserts a horizontal tab (4 spaces), '\\\\' inserts a literal backslash, '\\'' inserts a single quote inside single-quoted strings, and '\\\"' inserts a double quote.",
          "Raw Strings (r\"...\"): Prefixing a string with 'r' or 'R' tells Python to treat backslashes as literal characters, disabling all escape interpretations.",
          "Why are Raw Strings Essential? In Windows file paths (e.g. \"C:\\new_folder\\test\") Python interprets '\\n' as a newline and '\\t' as a tab, corrupting the file path! Using r\"C:\\new_folder\\test\" preserves exact path slashes. Raw strings are also standard for Regular Expressions (re module)."
        ],
        "syntax": "# Escape sequences in action:\ntext = \"Line 1\\nLine 2\\n\\tIndented Line 3\"\n\n# Raw string to ignore escapes:\nwindows_path = r\"C:\\Users\\new_project\\test_data\"\nregex_pattern = r\"\\d{3}-\\d{2}-\\d{4}\"",
        "tips": [
          "Notice: A raw string cannot end with an odd number of backslashes (e.g. r\"C:\\\" will cause a SyntaxError). To end with a slash, write r\"C:\\path\" + \"\\\\\" or use forward slashes 'C:/path' which Python natively supports on Windows!"
        ],
        "table": [
          {
            "attribute": "\\n",
            "value": "Newline",
            "description": "Moves the cursor to the next line (equivalent to pressing Enter)."
          },
          {
            "attribute": "\\t",
            "value": "Horizontal Tab",
            "description": "Inserts a standard tab indentation space."
          },
          {
            "attribute": "\\\\",
            "value": "Literal Backslash",
            "description": "Outputs a single backslash without treating it as an escape character."
          },
          {
            "attribute": "\\' and \\\"",
            "value": "Quotes",
            "description": "Allows printing quotes without closing the enclosing string."
          },
          {
            "attribute": "r\"...\"",
            "value": "Raw String",
            "description": "Treats all backslashes as literal characters. Perfect for file paths and regex."
          }
        ],
        "codeExample": "# 5. Escape Characters vs Raw Strings Demo\n\n# Using \\n and \\t for formatting\nreceipt = \"Item\\t\\tPrice\\nApple\\t\\t$1.50\\nOrange\\t\\t$2.00\"\nprint(\"--- Formatted Receipt ---\")\nprint(receipt)\n\n# Problem without raw string:\nproblematic_path = \"C:\\new_folder\\tools\\test\"\nprint(\"\\nCorrupted Path (without raw string):\")\nprint(problematic_path)\n\n# Fixed with Raw String (r prefix):\nclean_path = r\"C:\\new_folder\\tools\\test\"\nprint(\"\\nClean Path with Raw String:\")\nprint(clean_path)\n\n# Including literal quotes\nquote = \"She whispered: \\\"Python is my favorite language!\\\"\"\nprint(\"\\nEscaped Quotes:\", quote)",
        "browserOutputDesc": "--- Formatted Receipt ---\nItem\t\tPrice\nApple\t\t$1.50\nOrange\t\t$2.00\n\nCorrupted Path (without raw string):\nC:\new_folder\tools\test\n\nClean Path with Raw String:\nC:\\new_folder\\tools\\test\n\nEscaped Quotes: She whispered: \"Python is my favorite language!\""
      },
      {
        "title": "6. Modern String Formatting (f-strings vs .format() vs %)",
        "theory": [
          "String formatting allows you to dynamically inject variables, numbers, and expressions inside text templates.",
          "Python has evolved through 3 formatting styles: 1) '%s' printf-style (Legacy Python 2), 2) str.format() (Python 3.0), and 3) f-strings (Python 3.6+).",
          "What is an f-string? You prefix the string with 'f' or 'F' (e.g. f\"Hello {name}\") and place any valid Python expression directly inside curly braces {}.",
          "Why f-strings are the Modern Standard: 1) Highly readable, 2) Fastest execution speed (evaluated at runtime directly into bytecode), 3) Zero boilerplate.",
          "Formatting Specifiers inside f-strings: You can append a colon ':' followed by formatting instructions inside the braces:",
          "• Float Precision: {pi:.2f} formats a float to exactly 2 decimal places (3.14).",
          "• Thousands Separator: {1000000:,} inserts commas into big numbers (1,000,000).",
          "• Percentage: {0.852:.1%} multiplies by 100 and appends a '%' sign (85.2%).",
          "• Padding and Alignment: {name:<10} left-aligns to width 10, {name:>10} right-aligns, and {name:^10} centers.",
          "• Debug Expressions (Python 3.8+): {x=} prints both the variable name and its value (e.g. x=42)."
        ],
        "syntax": "# 1. Basic f-string:\nf\"Hello, {name}! You have {messages} new alerts.\"\n\n# 2. Number formatting specifiers:\nf\"Price: ${price:,.2f}\"      # Currency: $1,250,500.50\nf\"Accuracy: {score:.2%}\"    # Percentage: 98.75%\nf\"Zero-Padded: {num:04d}\"    # Leading Zeros: 0042\n\n# 3. Expressions inside braces:\nf\"Next year you will be: {age + 1}\"\nf\"Uppercase name: {name.upper()}\"",
        "tips": [
          "Python 3.8+ Feature: Use f'{variable=}' when debugging. Instead of writing print('count:', count), simply write print(f'{count=}')!",
          "Performance: f-strings are significantly faster than .format() and '%' because they are parsed by the compiler into specialized bytecode."
        ],
        "table": [
          {
            "attribute": "f\"{val:.2f}\"",
            "value": "2 Decimals",
            "description": "Rounds float to 2 decimal places (e.g. 3.14159 -> 3.14)."
          },
          {
            "attribute": "f\"{num:,}\"",
            "value": "Comma Separator",
            "description": "Formats thousands with commas (e.g. 1000000 -> 1,000,000)."
          },
          {
            "attribute": "f\"{pct:.1%}\"",
            "value": "Percentage",
            "description": "Converts fraction to percentage (e.g. 0.756 -> 75.6%)."
          },
          {
            "attribute": "f\"{num:05d}\"",
            "value": "Zero Padding",
            "description": "Pads integer with leading zeros to given width (e.g. 42 -> 00042)."
          },
          {
            "attribute": "f\"{text:^20}\"",
            "value": "Center Align",
            "description": "Centers text within a field of specified character width."
          },
          {
            "attribute": "f\"{x=}\"",
            "value": "Debug Print",
            "description": "Prints both expression name and evaluated value (e.g. x=25)."
          }
        ],
        "codeExample": "# 6. Complete Modern f-string Demonstration\nuser = \"Priya Sharma\"\naccount_balance = 4852900.7584\ncompletion_rate = 0.9426\norder_id = 45\n\n# 1. Clean variable injection\nprint(f\"User Greeting: Welcome back, {user}!\")\n\n# 2. Math & Function calls inside {}\nprint(f\"Upper Name: {user.upper()}\")\nprint(f\"Year of Expiry: {2026 + 5}\")\n\n# 3. Formatting numbers (Currency, Comma, Precision)\nprint(f\"Formatted Balance: ${account_balance:,.2f}\")\n\n# 4. Percentage & Leading Zeros\nprint(f\"Profile Completion: {completion_rate:.1%}\")\nprint(f\"Order Code: ORD-{order_id:06d}\")\n\n# 5. Text Alignment Table\nprint(\"\\n--- Formatted Table Columns ---\")\nprint(f\"{'Product':<15} | {'Quantity':^10} | {'Total':>10}\")\nprint(\"-\" * 42)\nprint(f\"{'Laptop':<15} | {2:^10} | {'$2,400.00':>10}\")\nprint(f\"{'Wireless Mouse':<15} | {5:^10} | {'$125.50':>10}\")\n\n# 6. Python 3.8+ Debugging syntax\nx = 100\ny = 50\nprint(f\"\\nQuick Debug: {x=} | {y=} | {x + y=}\")",
        "browserOutputDesc": "User Greeting: Welcome back, Priya Sharma!\nUpper Name: PRIYA SHARMA\nYear of Expiry: 2031\nFormatted Balance: $4,852,900.76\nProfile Completion: 94.3%\nOrder Code: ORD-000045\n\n--- Formatted Table Columns ---\nProduct         |  Quantity  |      Total\n------------------------------------------\nLaptop          |     2      |  $2,400.00\nWireless Mouse  |     5      |    $125.50\n\nQuick Debug: x=100 | y=50 | x + y=150"
      },
      {
        "title": "7. Complete 35+ Built-in String Methods Reference",
        "theory": [
          "Python provides over 35 built-in methods on string objects to inspect, clean, split, join, and transform text effortlessly.",
          "Remember: Since strings are immutable, none of these methods modify the existing string! They always compute and return a fresh value or new string.",
          "Categories of Methods:",
          "1. Case Conversion: upper(), lower(), capitalize(), title(), swapcase(), casefold().",
          "2. Search & Counting: find() and index() to find substrings; count() to tally occurrences; startswith() and endswith() for prefix/suffix checks.",
          "3. Critical Interview Difference (find vs index): find('xyz') returns -1 if not found (safe), whereas index('xyz') raises a ValueError exception!",
          "4. Splitting & Joining: split() splits by delimiter into a list; splitlines() breaks on newlines; join() glues list elements with a delimiter.",
          "5. Cleaning & Stripping: strip() strips leading and trailing whitespace; lstrip() strips left; rstrip() strips right; replace() substitutes substrings.",
          "6. Validation Tests (Boolean): isalpha() checks letters only; isdigit() checks digits only; isalnum() checks letters/numbers; isspace() checks whitespace."
        ],
        "syntax": "# Top String Methods in daily use:\nraw = \"  hello world  \"\nclean = raw.strip()           # 'hello world'\nupper_text = clean.upper()    # 'HELLO WORLD'\nwords = clean.split(\" \")      # ['hello', 'world']\njoined = \"-\".join(words)      # 'hello-world'\nfound_at = clean.find(\"world\")# 6\nis_num = \"12345\".isdigit()    # True",
        "tips": [
          "Best Practice for Input Cleaning: When taking user input, always do user_input.strip().lower() to normalize spaces and casing before comparisons.",
          "Use .casefold() instead of .lower() if you are building international applications with European characters like German ß."
        ],
        "table": [
          {
            "attribute": "s.strip([chars])",
            "value": "-> str",
            "description": "Removes leading and trailing whitespace (or specific characters) from both ends."
          },
          {
            "attribute": "s.lower() / s.upper()",
            "value": "-> str",
            "description": "Converts all characters to lowercase or uppercase."
          },
          {
            "attribute": "s.title()",
            "value": "-> str",
            "description": "Converts first character of each word to uppercase (Title Case)."
          },
          {
            "attribute": "s.split(sep=None, maxsplit=-1)",
            "value": "-> list[str]",
            "description": "Splits string by delimiter into a list of words. Defaults to any whitespace."
          },
          {
            "attribute": "sep.join(iterable)",
            "value": "-> str",
            "description": "Concatenates elements of an iterable (list/tuple) using sep as the glue."
          },
          {
            "attribute": "s.replace(old, new, count)",
            "value": "-> str",
            "description": "Replaces occurrences of substring old with new (optionally limited to count times)."
          },
          {
            "attribute": "s.find(sub, start, end)",
            "value": "-> int",
            "description": "Returns lowest index of sub. Returns -1 if sub is not found (NEVER crashes)."
          },
          {
            "attribute": "s.index(sub, start, end)",
            "value": "-> int",
            "description": "Like find(), but raises ValueError if sub is missing."
          },
          {
            "attribute": "s.count(sub)",
            "value": "-> int",
            "description": "Counts total non-overlapping occurrences of sub in the string."
          },
          {
            "attribute": "s.startswith(prefix)",
            "value": "-> bool",
            "description": "Returns True if string begins with prefix (can pass a tuple of prefixes)."
          },
          {
            "attribute": "s.endswith(suffix)",
            "value": "-> bool",
            "description": "Returns True if string terminates with suffix (e.g. '.pdf', '.png')."
          },
          {
            "attribute": "s.isdigit() / s.isalpha()",
            "value": "-> bool",
            "description": "Validates if string consists entirely of digits or letters respectively."
          },
          {
            "attribute": "s.isalnum()",
            "value": "-> bool",
            "description": "Validates if all characters are alphanumeric (letters or numbers, no spaces)."
          },
          {
            "attribute": "s.zfill(width)",
            "value": "-> str",
            "description": "Pads a numeric string with zeros on the left until it reaches given width."
          }
        ],
        "codeExample": "# 7. Top String Methods in Action\nraw_data = \"   converterallai:python_developer:2026   \"\n\n# 1. Cleaning whitespace with strip()\ncleaned = raw_data.strip()\nprint(\"Cleaned with strip():\", f\"'{cleaned}'\")\n\n# 2. Splitting into tokens with split()\ntokens = cleaned.split(\":\")\nprint(\"Tokens List:\", tokens)\n\n# 3. Unpacking list\nplatform, role, year = tokens\nprint(f\"Platform: {platform}, Role: {role}, Year: {year}\")\n\n# 4. Joining back with a custom separator\nreconstructed = \" ---> \".join([platform.upper(), role.title(), year])\nprint(\"Reconstructed with join():\", reconstructed)\n\n# 5. Searching: find() vs index()\nprint(\"Position of 'developer':\", cleaned.find(\"developer\"))\nprint(\"Searching missing word with find():\", cleaned.find(\"java\"))  # Returns -1\n\n# 6. Prefix & Suffix verification\nfilename = \"dataset_report_2026.pdf\"\nprint(f\"Is '{filename}' a PDF document?\", filename.endswith(\".pdf\"))\nprint(f\"Does '{filename}' start with 'dataset'?\", filename.startswith(\"dataset\"))\n\n# 7. Replacing text with replace()\noriginal_quote = \"Java is great. Java is fast.\"\nupdated_quote = original_quote.replace(\"Java\", \"Python\")\nprint(\"Replaced quote:\", updated_quote)\n\n# 8. Character type verification\nprint(\"'12345'.isdigit():\", \"12345\".isdigit())\nprint(\"'Python3'.isalnum():\", \"Python3\".isalnum())\nprint(\"'Hello World'.isalpha():\", \"Hello World\".isalpha())  # False due to space",
        "browserOutputDesc": "Cleaned with strip(): 'converterallai:python_developer:2026'\nTokens List: ['converterallai', 'python_developer', '2026']\nPlatform: converterallai, Role: python_developer, Year: 2026\nReconstructed with join(): CONVERTERALLAI ---> Python_Developer ---> 2026\nPosition of 'developer': 22\nSearching missing word with find(): -1\nIs 'dataset_report_2026.pdf' a PDF document? True\nDoes 'dataset_report_2026.pdf' start with 'dataset'? True\nReplaced quote: Python is great. Python is fast.\n'12345'.isdigit(): True\n'Python3'.isalnum(): True\n'Hello World'.isalpha(): False"
      },
      {
        "title": "8. Practical Real-World Algorithms & Interview Problems",
        "theory": [
          "In real-world software engineering and coding interviews, string manipulation is tested in nearly every technical interview.",
          "Here are 4 classic, production-grade string algorithms implemented clearly for beginners:",
          "Problem 1 (Palindrome Verification): A phrase is a palindrome if it reads the same backwards and forwards after removing punctuation and spaces (e.g. 'A man, a plan, a canal: Panama').",
          "Problem 2 (Vowel & Consonant Counter): Count the total number of vowels (a, e, i, o, u) and consonants in any arbitrary sentence.",
          "Problem 3 (Word Frequency Counter): Break a text into words and count how many times each word appears using a Python dictionary.",
          "Problem 4 (Anonymize & Mask Sensitive Data): Mask credit cards or passwords showing only the last 4 characters (e.g. '************4321')."
        ],
        "syntax": "# 1. Checking Palindrome with clean alphanumeric filter:\ndef is_palindrome(text: str) -> bool:\n    clean = [c.lower() for c in text if c.isalnum()]\n    return clean == clean[::-1]\n\n# 2. Masking sensitive string:\ndef mask_card(number: str) -> str:\n    return '*' * (len(number) - 4) + number[-4:]",
        "tips": [
          "Interview Tip: Whenever an interview problem asks to check characters, always clarify if casing matters (e.g. 'A' vs 'a') and if spaces/punctuation should be ignored.",
          "Memory Tip: Using list comprehensions with .isalnum() is the most concise way to clean strings for algorithmic problems."
        ],
        "table": [
          {
            "attribute": "clean == clean[::-1]",
            "value": "O(n) Time",
            "description": "Standard two-pointer or slice reversal check for palindromes."
          },
          {
            "attribute": "c.lower() in 'aeiou'",
            "value": "O(1) Lookup",
            "description": "Optimal character set membership check for vowels."
          },
          {
            "attribute": "'*' * (len(s) - 4)",
            "value": "Data Masking",
            "description": "Standard security practice for masking credit cards, passwords, and PII."
          }
        ],
        "codeExample": "# 8. Four Practical Real-World String Algorithms\n\n# --- Algorithm 1: Advanced Palindrome Checker ---\ndef check_palindrome(sentence: str) -> bool:\n    # Keep only letters and numbers, in lowercase\n    filtered = \"\".join(c.lower() for c in sentence if c.isalnum())\n    return filtered == filtered[::-1]\n\ntest_sentence = \"A man, a plan, a canal: Panama\"\nprint(f\"Is '{test_sentence}' a Palindrome?\", check_palindrome(test_sentence))\n\n# --- Algorithm 2: Vowel and Consonant Counter ---\ndef count_vowels_consonants(text: str):\n    vowels = set(\"aeiouAEIOU\")\n    v_count = 0\n    c_count = 0\n    for char in text:\n        if char.isalpha():\n            if char in vowels:\n                v_count += 1\n            else:\n                c_count += 1\n    return v_count, c_count\n\nv, c = count_vowels_consonants(\"Python Programming 2026\")\nprint(f\"Vowels: {v}, Consonants: {c}\")\n\n# --- Algorithm 3: Word Frequency Counter ---\nparagraph = \"python is simple python is powerful and python is fast\"\nword_counts = {}\nfor word in paragraph.split():\n    word_counts[word] = word_counts.get(word, 0) + 1\nprint(\"\\nWord Frequency:\", word_counts)\n\n# --- Algorithm 4: Credit Card Masking ---\ndef mask_credit_card(card_number: str) -> str:\n    card_clean = card_number.replace(\"-\", \"\").replace(\" \", \"\")\n    return \"*\" * (len(card_clean) - 4) + card_clean[-4:]\n\nprint(\"Masked Card:\", mask_credit_card(\"4532-8921-7890-4321\"))",
        "browserOutputDesc": "Is 'A man, a plan, a canal: Panama' a Palindrome? True\nVowels: 4, Consonants: 13\n\nWord Frequency: {'python': 3, 'is': 3, 'simple': 1, 'powerful': 1, 'and': 1, 'fast': 1}\nMasked Card: ************4321"
      }
    ]
  },
  {
    "id": "py-lists",
    "chapterNumber": 9,
    "title": "Python Lists & Complete Built-in Methods Table",
    "category": "Data Structures",
    "shortDesc": "Complete zero-to-mastery guide to Python lists: dynamic arrays, indexing, slicing, 11 built-in methods, list comprehensions, sorting, and performance complexities.",
    "overview": [
      "A List in Python is an ordered, mutable (changeable) collection of objects enclosed in square brackets [].",
      "Unlike arrays in C or Java, Python lists are dynamic: they automatically resize, and can hold items of different data types (heterogeneous).",
      "CPython Internals: Under the hood, a Python list is implemented as a contiguous array of memory pointers (PyObject**). Appending to the end is amortized O(1), while inserting at the beginning is O(n).",
      "Lists are the most widely used data structure in Python, essential for data science, web development, and algorithms."
    ],
    "sections": [
      {
        "title": "1. What is a List? (Creation, Indexing & Mutability)",
        "theory": [
          "Declare a list using square brackets: my_list = [1, 2, 3] or the list() constructor.",
          "Lists can store any data type, including strings, numbers, booleans, and even other nested lists.",
          "Lists are MUTABLE: You can update, replace, add, or delete elements in place without creating a new list (e.g. nums[0] = 99).",
          "Lists support both 0-based positive indexing and negative indexing (-1 is the last item)."
        ],
        "syntax": "# Declaring lists:\nempty_list = []\nnumbers = [10, 20, 30, 40]\nmixed = ['Alex', 25, True, 99.5]\n\n# Modifying in place (Mutability):\nnumbers[0] = 99  # [99, 20, 30, 40]",
        "tips": [
          "Contrast with Strings: Strings are immutable (s[0] = 'a' crashes), while lists are mutable (l[0] = 'a' works perfectly!)."
        ],
        "table": [
          {
            "attribute": "[] or list()",
            "value": "Empty List",
            "description": "Creates a new empty list object."
          },
          {
            "attribute": "l[0] = val",
            "value": "In-Place Update",
            "description": "Modifies element at index 0 directly in memory."
          },
          {
            "attribute": "len(l)",
            "value": "List Length",
            "description": "Returns total count of elements inside list."
          }
        ],
        "codeExample": "# 1. List Creation, Indexing and Mutability\nfruits = [\"Apple\", \"Banana\", \"Cherry\"]\nprint(\"Original fruits:\", fruits)\n\n# Modifying in place (proof of mutability)\nfruits[1] = \"Blueberry\"\nprint(\"After modifying index 1:\", fruits)\n\n# Accessing via negative index\nprint(\"Last fruit fruits[-1]:\", fruits[-1])\n\n# Nested list\nmatrix = [[1, 2], [3, 4]]\nprint(\"Matrix row 0, col 1:\", matrix[0][1])",
        "browserOutputDesc": "Original fruits: ['Apple', 'Banana', 'Cherry']\nAfter modifying index 1: ['Apple', 'Blueberry', 'Cherry']\nLast fruit fruits[-1]: Cherry\nMatrix row 0, col 1: 2"
      },
      {
        "title": "2. Adding Elements: append(), extend(), insert()",
        "theory": [
          ".append(x): Adds a single element x to the very end of the list. Amortized O(1) time complexity.",
          ".extend(iterable): Takes an iterable (like another list) and appends all its elements individually. O(k) time.",
          ".insert(index, x): Inserts element x at the specified index, shifting all subsequent elements to the right. O(n) time.",
          "CRITICAL TRAP (.append vs .extend): If you append a list [4, 5] to [1, 2], you get [1, 2, [4, 5]] (a nested list!). If you extend with [4, 5], you get [1, 2, 4, 5] (a flat list)."
        ],
        "syntax": "nums = [1, 2, 3]\nnums.append(4)        # [1, 2, 3, 4]\nnums.extend([5, 6])   # [1, 2, 3, 4, 5, 6]\nnums.insert(0, 0)     # [0, 1, 2, 3, 4, 5, 6]",
        "tips": [
          "Performance Tip: Appending to the end of a list is instant (O(1)), but inserting at index 0 forces Python to shift every item in memory (O(n)). For frequent left-side insertions, use collections.deque!"
        ],
        "table": [
          {
            "attribute": "l.append(x)",
            "value": "O(1) Time",
            "description": "Appends single item to end of list."
          },
          {
            "attribute": "l.extend(items)",
            "value": "O(k) Time",
            "description": "Appends each item from iterable to end."
          },
          {
            "attribute": "l.insert(i, x)",
            "value": "O(n) Time",
            "description": "Inserts item at index i, shifting remaining items."
          }
        ],
        "codeExample": "# 2. Adding Elements: append, extend, insert\ncolors = [\"Red\", \"Green\"]\n\n# 1. append single item\ncolors.append(\"Blue\")\nprint(\"After append('Blue'):\", colors)\n\n# 2. extend with multiple items\ncolors.extend([\"Yellow\", \"Purple\"])\nprint(\"After extend(['Yellow', 'Purple']):\", colors)\n\n# 3. insert at specific position (index 0)\ncolors.insert(0, \"White\")\nprint(\"After insert(0, 'White'):\", colors)\n\n# Trap demonstration\nnested_test = [1, 2]\nnested_test.append([3, 4])\nprint(\"Notice append([3, 4]) creates nested list:\", nested_test)",
        "browserOutputDesc": "After append('Blue'): ['Red', 'Green', 'Blue']\nAfter extend(['Yellow', 'Purple']): ['Red', 'Green', 'Blue', 'Yellow', 'Purple']\nAfter insert(0, 'White'): ['White', 'Red', 'Green', 'Blue', 'Yellow', 'Purple']\nNotice append([3, 4]) creates nested list: [1, 2, [3, 4]]"
      },
      {
        "title": "3. Removing Elements: pop(), remove(), clear(), del",
        "theory": [
          ".pop([index]): Removes and RETURNS the item at index (defaults to last item). O(1) from end, O(n) from start.",
          ".remove(x): Searches for the FIRST occurrence of value x and removes it. Raises ValueError if x is missing!",
          "del list[index]: A statement to remove an element or an entire slice (e.g. del list[1:3]).",
          ".clear(): Removes all items, leaving the list empty []. O(n) time."
        ],
        "syntax": "nums = [10, 20, 30, 40, 20]\nlast = nums.pop()      # Removes 20, returns 20\nnums.remove(20)        # Removes first 20\ndel nums[0]            # Deletes item at index 0\nnums.clear()           # List becomes []",
        "tips": [
          "Safe Removal: Always check 'if item in my_list:' before calling .remove(item) to prevent unhandled ValueError crashes."
        ],
        "table": [
          {
            "attribute": "l.pop([i])",
            "value": "Returns Item",
            "description": "Removes and returns item at index (default last)."
          },
          {
            "attribute": "l.remove(val)",
            "value": "Value-based",
            "description": "Removes first matching value. Raises ValueError if absent."
          },
          {
            "attribute": "del l[i]",
            "value": "Statement",
            "description": "Deletes element or slice by index position."
          },
          {
            "attribute": "l.clear()",
            "value": "Empties List",
            "description": "Removes all items from the list in-place."
          }
        ],
        "codeExample": "# 3. Removing Elements Demo\nstack = [\"A\", \"B\", \"C\", \"D\", \"E\"]\n\n# pop from end\npopped = stack.pop()\nprint(f\"Popped: {popped}, Remaining: {stack}\")\n\n# remove by value\nstack.remove(\"C\")\nprint(\"After remove('C'):\", stack)\n\n# del by index\ndel stack[0]  # removes 'A'\nprint(\"After del stack[0]:\", stack)\n\n# clear\nstack.clear()\nprint(\"After clear():\", stack)",
        "browserOutputDesc": "Popped: E, Remaining: ['A', 'B', 'C', 'D']\nAfter remove('C'): ['A', 'B', 'D']\nAfter del stack[0]: ['B', 'D']\nAfter clear(): []"
      },
      {
        "title": "4. Slicing Lists & Shallow Copy vs Deep Copy",
        "theory": [
          "List slicing uses the same syntax as strings: list[start : stop : step].",
          "Slicing Assignment: You can replace an entire slice in place (e.g. nums[1:3] = [200, 300]).",
          "The Dangerous Copy Trap: Writing 'b = a' does NOT create a copy! It only creates a second reference (alias) pointing to the same list in memory. Modifying 'b' will also modify 'a'!",
          "Creating True Copies: Use a.copy() or a[:] for a shallow copy. For lists containing nested lists or dictionaries, use import copy; copy.deepcopy(a) to avoid shared nested references."
        ],
        "syntax": "nums = [1, 2, 3, 4, 5]\nsubset = nums[1:4]     # [2, 3, 4]\nreversed_l = nums[::-1] # [5, 4, 3, 2, 1]\n\n# Safe Shallow Copy:\ncopy_list = nums.copy()\n# Or: copy_list = nums[:]",
        "tips": [
          "Interview Trap: What happens when you do b = a? Answer: No new list is created. Both variables point to the exact same memory ID (id(a) == id(b))."
        ],
        "table": [
          {
            "attribute": "b = a",
            "value": "Alias / Pointer",
            "description": "Shares same memory. Changes in b reflect in a!"
          },
          {
            "attribute": "b = a.copy()",
            "value": "Shallow Copy",
            "description": "Independent top-level list, but nested lists remain shared."
          },
          {
            "attribute": "copy.deepcopy(a)",
            "value": "Deep Copy",
            "description": "Recursively clones all nested objects for 100% independence."
          }
        ],
        "codeExample": "# 4. Copying vs Referencing Demo\noriginal = [10, 20, 30]\n\n# Mistake: Direct assignment\nalias = original\nalias.append(99)\nprint(\"Original was also modified!\", original)\n\n# Correct: Shallow copy\ntrue_copy = original.copy()\ntrue_copy.append(500)\nprint(\"Original stays safe:\", original)\nprint(\"Copy has new item:\", true_copy)",
        "browserOutputDesc": "Original was also modified! [10, 20, 30, 99]\nOriginal stays safe: [10, 20, 30, 99]\nCopy has new item: [10, 20, 30, 99, 500]"
      },
      {
        "title": "5. Searching, Counting & Sorting: sort() vs sorted()",
        "theory": [
          ".index(x): Returns the zero-based index of the first occurrence of x. Raises ValueError if missing.",
          ".count(x): Returns the total number of times x appears in the list.",
          "CRITICAL DISTINCTION (.sort() vs sorted()):",
          "1) list.sort() sorts the list IN-PLACE using Timsort and returns None (it modifies the original list).",
          "2) sorted(iterable) leaves the original list untouched and returns a BRAND NEW sorted list.",
          "Both functions accept 'key=...' (for custom sorting criteria) and 'reverse=True' (for descending order)."
        ],
        "syntax": "# 1. In-place sort:\nnums = [4, 2, 9, 1]\nnums.sort()              # nums becomes [1, 2, 4, 9]\nnums.sort(reverse=True)  # [9, 4, 2, 1]\n\n# 2. Out-of-place sort:\nfresh_sorted = sorted(nums)\n\n# 3. Custom key sorting by string length:\nwords = ['apple', 'pie', 'banana']\nwords.sort(key=len)      # ['pie', 'apple', 'banana']",
        "tips": [
          "Common Beginner Bug: Writing 'x = my_list.sort()'. Because .sort() operates in-place, it returns None, so x will be None!"
        ],
        "table": [
          {
            "attribute": "l.sort(key, reverse)",
            "value": "In-Place Sort",
            "description": "Modifies original list in O(n log n) time. Returns None."
          },
          {
            "attribute": "sorted(l, key, reverse)",
            "value": "Returns New List",
            "description": "Leaves original list intact; outputs fresh sorted list."
          },
          {
            "attribute": "l.reverse()",
            "value": "In-Place Reversal",
            "description": "Flips list order in O(n) time. Returns None."
          }
        ],
        "codeExample": "# 5. sort() vs sorted() Demonstration\nscores = [88, 42, 99, 73, 56]\n\n# Using sorted() (leaves original intact)\nnew_sorted = sorted(scores)\nprint(\"Original scores:\", scores)\nprint(\"Sorted copy (sorted()):\", new_sorted)\n\n# Using .sort() (modifies in place)\nscores.sort(reverse=True)\nprint(\"After scores.sort(reverse=True):\", scores)\n\n# Custom sorting with lambda key\nemployees = [\n    {\"name\": \"Alice\", \"salary\": 90000},\n    {\"name\": \"Bob\", \"salary\": 65000},\n    {\"name\": \"Charlie\", \"salary\": 120000}\n]\nemployees.sort(key=lambda emp: emp[\"salary\"])\nprint(\"Sorted by salary:\", [e[\"name\"] for e in employees])",
        "browserOutputDesc": "Original scores: [88, 42, 99, 73, 56]\nSorted copy (sorted()): [42, 56, 73, 88, 99]\nAfter scores.sort(reverse=True): [99, 88, 73, 56, 42]\nSorted by salary: ['Bob', 'Alice', 'Charlie']"
      },
      {
        "title": "6. List Comprehensions: The Pythonic Powerhouse",
        "theory": [
          "List Comprehensions provide a concise, readable, and highly optimized syntax to create new lists from existing iterables.",
          "Formula: [expression for item in iterable if condition].",
          "Why List Comprehensions are Superior: They are executed at C-level bytecode speed in CPython, making them significantly faster than manual for-loops with .append()!",
          "Matrix Flattening: You can nest for-clauses inside a list comprehension to flatten 2D arrays in a single line."
        ],
        "syntax": "# 1. Mapping:\nsquares = [x**2 for x in range(1, 6)]\n\n# 2. Filtering:\nevens = [x for x in range(10) if x % 2 == 0]\n\n# 3. 2D Matrix Flattening:\nflat = [cell for row in matrix for cell in row]",
        "tips": [
          "Rule of Thumb: If a list comprehension requires more than 2 for-loops or complex if-else logic, write a standard for-loop instead for better team readability."
        ],
        "table": [
          {
            "attribute": "[x for x in s]",
            "value": "Basic Mapping",
            "description": "Creates new list with transformed or cloned elements."
          },
          {
            "attribute": "[x for x in s if cond]",
            "value": "Filter Comprehension",
            "description": "Includes only items satisfying the boolean condition."
          },
          {
            "attribute": "[x if c else y for x in s]",
            "value": "Ternary in Comprehension",
            "description": "Applies inline if-else transformation to each element."
          }
        ],
        "codeExample": "# 6. List Comprehensions Mastery\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# 1. Squares of odd numbers\nodd_squares = [x ** 2 for x in numbers if x % 2 != 0]\nprint(\"Squares of odds:\", odd_squares)\n\n# 2. Cleaning and normalizing user strings\nraw_tags = [\"  python \", \" ANGULAR\", \" SQLite \", \"  DoCker  \"]\nclean_tags = [t.strip().lower() for t in raw_tags]\nprint(\"Normalized tags:\", clean_tags)\n\n# 3. Flattening a 2D Matrix\ngrid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflattened = [num for row in grid for num in row]\nprint(\"Flattened 2D Grid:\", flattened)",
        "browserOutputDesc": "Squares of odds: [1, 9, 25, 49, 81]\nNormalized tags: ['python', 'angular', 'sqlite', 'docker']\nFlattened 2D Grid: [1, 2, 3, 4, 5, 6, 7, 8, 9]"
      },
      {
        "title": "7. Complete 11 List Methods Reference & Time Complexities",
        "theory": [
          "Python provides 11 built-in methods on list objects. Understanding their computational time complexity is essential for writing scalable code and passing coding interviews.",
          "Amortized O(1): Operations at the end of the list (.append, .pop) are instantaneous.",
          "Linear O(n): Operations at the start or middle (.insert, .remove, .pop(0)) require shifting memory pointers.",
          "O(n log n): .sort() uses Timsort, the world-class adaptive sorting algorithm."
        ],
        "syntax": "# All 11 methods summary:\nl.append(x)     l.extend(it)    l.insert(i, x)\nl.remove(x)     l.pop([i])      l.clear()\nl.index(x)      l.count(x)      l.sort()\nl.reverse()     l.copy()",
        "tips": [
          "Interview Big-O Guide: Always know that pop() from end is O(1), but pop(0) is O(n)."
        ],
        "table": [
          {
            "attribute": "l.append(x)",
            "value": "O(1) amortized",
            "description": "Appends element x to the end of list."
          },
          {
            "attribute": "l.extend(iterable)",
            "value": "O(k)",
            "description": "Appends all elements from iterable."
          },
          {
            "attribute": "l.insert(i, x)",
            "value": "O(n)",
            "description": "Inserts element x at index i."
          },
          {
            "attribute": "l.remove(x)",
            "value": "O(n)",
            "description": "Removes first matching element x."
          },
          {
            "attribute": "l.pop([i])",
            "value": "O(1) end / O(n) start",
            "description": "Removes and returns item at index i (default last)."
          },
          {
            "attribute": "l.clear()",
            "value": "O(n)",
            "description": "Empties the list completely."
          },
          {
            "attribute": "l.index(x)",
            "value": "O(n)",
            "description": "Returns zero-based index of first occurrence."
          },
          {
            "attribute": "l.count(x)",
            "value": "O(n)",
            "description": "Returns total count of occurrences."
          },
          {
            "attribute": "l.sort()",
            "value": "O(n log n)",
            "description": "Sorts items in-place using Timsort."
          },
          {
            "attribute": "l.reverse()",
            "value": "O(n)",
            "description": "Reverses list in-place."
          },
          {
            "attribute": "l.copy()",
            "value": "O(n)",
            "description": "Returns shallow copy of the list."
          }
        ],
        "codeExample": "# 7. Comprehensive List Methods Showcase\ndata = [40, 10, 30, 20, 10]\n\nprint(\"Count of 10:\", data.count(10))\nprint(\"Index of 30:\", data.index(30))\n\ndata.sort()\nprint(\"Sorted:\", data)\n\ndata.reverse()\nprint(\"Reversed:\", data)\n\nclone = data.copy()\nprint(\"Clone equal to data?\", clone == data)\nprint(\"Clone same object?\", clone is data)",
        "browserOutputDesc": "Count of 10: 2\nIndex of 30: 2\nSorted: [10, 10, 20, 30, 40]\nReversed: [40, 30, 20, 10, 10]\nClone equal to data? True\nClone same object? False"
      },
      {
        "title": "8. Practical Real-World List Algorithms & Interview Problems",
        "theory": [
          "In interviews, lists are the foundation for arrays, two-pointer techniques, stacks, and queues.",
          "Here are 3 classic, production-grade list algorithms every software engineer must know:",
          "Algorithm 1 (Deduplication preserving order): Removing duplicate items while maintaining original insertion order.",
          "Algorithm 2 (Two-Pointer List Reversal): Reversing a list in-place without using [::-1] or .reverse().",
          "Algorithm 3 (Chunking a list): Splitting a large list into smaller sub-batches of size N."
        ],
        "syntax": "# 1. Order-preserving deduplication:\nseen = set()\nunique = [x for x in items if not (x in seen or seen.add(x))]\n\n# 2. Chunking into batches:\nchunks = [data[i:i + size] for i in range(0, len(data), size)]",
        "tips": [
          "To quickly remove duplicates if order DOES NOT matter, simply do list(set(my_list)). If order DOES matter, use dict.fromkeys(my_list) (Python 3.7+ preserves order!)."
        ],
        "table": [
          {
            "attribute": "dict.fromkeys(l)",
            "value": "O(n) Time",
            "description": "Fastest way to remove duplicates while preserving insertion order."
          },
          {
            "attribute": "l[i:i+n]",
            "value": "O(k) Slicing",
            "description": "Standard batching pattern for pagination or API rate limits."
          }
        ],
        "codeExample": "# 8. Three Production-Grade List Algorithms\n\n# --- 1. Deduplication preserving order ---\nraw_tags = [\"python\", \"sql\", \"python\", \"javascript\", \"sql\", \"docker\"]\nunique_tags = list(dict.fromkeys(raw_tags))\nprint(\"Unique tags (order preserved):\", unique_tags)\n\n# --- 2. Chunking large dataset into batches ---\ndataset = list(range(1, 11))  # 1 to 10\nbatch_size = 3\nbatches = [dataset[i:i + batch_size] for i in range(0, len(dataset), batch_size)]\nprint(f\"Batches of size {batch_size}:\", batches)\n\n# --- 3. Find second largest number in list ---\ndef find_second_largest(numbers: list[int]) -> int:\n    unique_sorted = sorted(set(numbers))\n    return unique_sorted[-2] if len(unique_sorted) >= 2 else None\n\nprint(\"Second largest in [10, 20, 4, 45, 99, 99]:\", find_second_largest([10, 20, 4, 45, 99, 99]))",
        "browserOutputDesc": "Unique tags (order preserved): ['python', 'sql', 'javascript', 'docker']\nBatches of size 3: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]\nSecond largest in [10, 20, 4, 45, 99, 99]: 45"
      }
    ]
  },
  {
    "id": "py-tuples",
    "chapterNumber": 10,
    "title": "Python Tuples & Named Tuples",
    "category": "Python Data Structures",
    "shortDesc": "In-depth tutorial on immutable tuples, single-element tuples, packing/unpacking, memory advantages over lists, and typing.NamedTuple.",
    "overview": [
      "A Tuple is an ordered, immutable collection of elements in Python, written with parentheses: `(item1, item2, item3)`.",
      "Real-life Analogy: Think of a tuple like your National ID Card or Passport. Once issued, your Name, Birth Date, and Passport Number cannot be altered in-place. If anything changes, a brand new passport must be issued.",
      "Tuples provide two massive superpowers in Python: Safety (write-protection preventing accidental mutation) and Performance (lower memory footprint, faster allocation, and hashability so tuples can serve as dictionary keys)."
    ],
    "sections": [
      {
        "title": "1. What is a Tuple? (Creation, Parentheses & The Trailing Comma Trap)",
        "theory": [
          "Tuples can store heterogeneous data types: integers, strings, floats, lists, and other tuples.",
          "THE TRAILING COMMA RULE: To create a single-element tuple, you MUST include a trailing comma (e.g. `(42,)`). Writing `(42)` evaluates to a plain integer because parentheses are treated as mathematical grouping precedence!",
          "Empty tuples are created with empty parentheses `()` or `tuple()` constructor."
        ],
        "syntax": "# 1. Creating tuples with multiple items\ncoordinates = (19.0760, 72.8777)       # Mumbai GPS coordinates\nuser_record = (\"Rupesh\", 26, \"Mumbai\", True)\n\n# 2. THE SINGLE ELEMENT GOTCHA (Very common beginner mistake):\nnot_a_tuple = (42)       # Type is <class 'int'> !\nis_a_tuple = (42,)       # Type is <class 'tuple'> !\nprint(type(not_a_tuple)) # <class 'int'>\nprint(type(is_a_tuple))  # <class 'tuple'>\n\n# 3. Tuple packing without parentheses\nrgb_color = 255, 128, 0\nprint(type(rgb_color))   # <class 'tuple'>",
        "tips": [
          "Always remember the comma `(val,)` when writing single-element tuples in database queries or function returns.",
          "Parentheses are actually optional in many Python contexts; it's the comma that defines a tuple!"
        ],
        "codeExample": "# 1. Creating tuples with multiple items\ncoordinates = (19.0760, 72.8777)       # Mumbai GPS coordinates\nuser_record = (\"Rupesh\", 26, \"Mumbai\", True)\n\n# 2. THE SINGLE ELEMENT GOTCHA (Very common beginner mistake):\nnot_a_tuple = (42)       # Type is <class 'int'> !\nis_a_tuple = (42,)       # Type is <class 'tuple'> !\nprint(type(not_a_tuple)) # <class 'int'>\nprint(type(is_a_tuple))  # <class 'tuple'>\n\n# 3. Tuple packing without parentheses\nrgb_color = 255, 128, 0\nprint(type(rgb_color))   # <class 'tuple'>"
      },
      {
        "title": "2. Tuple Indexing, Slicing & Immutability Rules",
        "theory": [
          "Like strings and lists, tuples support 0-based forward indexing, negative reverse indexing (`-1` for the last item), and slice syntax `[start:stop:step]`.",
          "Immutability constraint: Tuples do NOT support item assignment (`t[0] = 99` raises TypeError).",
          "The 'Mutable Object Inside Immutable Tuple' Trap: If a tuple contains a mutable object (like a list), the list's reference in the tuple cannot change, but the contents of that list CAN be mutated!"
        ],
        "syntax": "dimensions = (1920, 1080, 60)\n\n# Indexing & Slicing\nprint(dimensions[0])      # 1920 (width)\nprint(dimensions[-1])     # 60 (refresh rate)\nprint(dimensions[0:2])    # (1920, 1080)\n\n# Attempting mutation raises TypeError:\ntry:\n    dimensions[0] = 3840\nexcept TypeError as e:\n    print(f\"Error caught: {e}\")  # 'tuple' object does not support item assignment\n\n# Mutable object inside tuple:\nnested = (\"Server-1\", [80, 443])\nnested[1].append(8080)    # ALLOWED! The list inside the tuple is mutated\nprint(nested)             # ('Server-1', [80, 443, 8080])",
        "tips": [
          "If you want total immutability, ensure all nested elements inside the tuple are also immutable primitives (ints, strings, floats, tuples)."
        ],
        "codeExample": "dimensions = (1920, 1080, 60)\n\n# Indexing & Slicing\nprint(dimensions[0])      # 1920 (width)\nprint(dimensions[-1])     # 60 (refresh rate)\nprint(dimensions[0:2])    # (1920, 1080)\n\n# Attempting mutation raises TypeError:\ntry:\n    dimensions[0] = 3840\nexcept TypeError as e:\n    print(f\"Error caught: {e}\")  # 'tuple' object does not support item assignment\n\n# Mutable object inside tuple:\nnested = (\"Server-1\", [80, 443])\nnested[1].append(8080)    # ALLOWED! The list inside the tuple is mutated\nprint(nested)             # ('Server-1', [80, 443, 8080])"
      },
      {
        "title": "3. Tuple Packing, Unpacking & The Asterisk (*) Rest Operator",
        "theory": [
          "Tuple Packing: Assigning multiple comma-separated values into a single variable automatically packs them into a tuple.",
          "Tuple Unpacking: Extracting elements from a tuple directly into individual variables in a single clean line.",
          "The Star Operator (*): Allows unpacking a variable number of elements, capturing the remaining items into a list (similar to JS rest/spread)."
        ],
        "syntax": "# 1. Tuple Packing\nemployee = \"Aarav\", 101, \"Engineering\", \"Lead Architect\"\n\n# 2. Tuple Unpacking\nname, emp_id, dept, role = employee\nprint(f\"{name} (ID: {emp_id}) works as {role}\")\n\n# 3. Swapping variables without a temporary variable (Tuple unpacking magic!)\na = 10\nb = 20\na, b = b, a   # Behind the scenes: (b, a) is packed, then unpacked into a, b\nprint(f\"a = {a}, b = {b}\")  # a = 20, b = 10\n\n# 4. Extended Unpacking with * (rest)\nscores = (98, 92, 85, 76, 64, 52)\ntopper, second, *remaining, last = scores\nprint(f\"Topper: {topper}\")        # 98\nprint(f\"Second: {second}\")        # 92\nprint(f\"Remaining: {remaining}\")  # [85, 76, 64]\nprint(f\"Last: {last}\")            # 52",
        "tips": [
          "Tuple unpacking works with any iterable (lists, sets, strings, dictionary keys), but is most idiomatic with tuples."
        ],
        "codeExample": "# 1. Tuple Packing\nemployee = \"Aarav\", 101, \"Engineering\", \"Lead Architect\"\n\n# 2. Tuple Unpacking\nname, emp_id, dept, role = employee\nprint(f\"{name} (ID: {emp_id}) works as {role}\")\n\n# 3. Swapping variables without a temporary variable (Tuple unpacking magic!)\na = 10\nb = 20\na, b = b, a   # Behind the scenes: (b, a) is packed, then unpacked into a, b\nprint(f\"a = {a}, b = {b}\")  # a = 20, b = 10\n\n# 4. Extended Unpacking with * (rest)\nscores = (98, 92, 85, 76, 64, 52)\ntopper, second, *remaining, last = scores\nprint(f\"Topper: {topper}\")        # 98\nprint(f\"Second: {second}\")        # 92\nprint(f\"Remaining: {remaining}\")  # [85, 76, 64]\nprint(f\"Last: {last}\")            # 52"
      },
      {
        "title": "4. Memory Efficiency, Hashability & Benchmark vs Lists",
        "theory": [
          "Why use tuples instead of lists? 1) Memory: Lists over-allocate memory to allow dynamic append operations; tuples allocate exactly the size needed.",
          "2) Speed: CPython caches small tuples, making tuple instantiation roughly 5x-10x faster than lists.",
          "3) Hashability: Tuples containing only immutable elements have a `__hash__()` method, meaning they can be used as Dictionary Keys and Set Elements, whereas Lists CANNOT."
        ],
        "syntax": "import sys\n\n# Memory comparison\nlst = [1, 2, 3, 4, 5]\ntup = (1, 2, 3, 4, 5)\n\nprint(f\"List bytes:  {sys.getsizeof(lst)}\")  # e.g., 104 bytes\nprint(f\"Tuple bytes: {sys.getsizeof(tup)}\")  # e.g., 80 bytes\n\n# Using Tuple as a Dictionary Key (e.g. 2D Grid coordinates):\nboard = {\n    (0, 0): \"Player 1\",\n    (0, 1): \"Empty\",\n    (1, 1): \"Player 2\"\n}\nprint(board[(0, 0)])  # \"Player 1\"\n\n# Attempting list as dict key fails:\n# board[[0, 0]] = \"Error\" -> TypeError: unhashable type: 'list'",
        "table": [
          {
            "attribute": "Feature",
            "value": "List [ ]",
            "description": "Tuple ( )"
          },
          {
            "attribute": "Mutability",
            "value": "Mutable (can add, remove, change items)",
            "description": "Immutable (read-only after creation)"
          },
          {
            "attribute": "Memory Allocation",
            "value": "Over-allocates memory buffer for growth",
            "description": "Fixed exact memory allocation (lighter)"
          },
          {
            "attribute": "Can be Dict Key?",
            "value": "No (Unhashable type)",
            "description": "Yes (if all elements are immutable)"
          },
          {
            "attribute": "Use Case",
            "value": "Collections of homogeneous, growing data",
            "description": "Fixed records, coordinates, function multi-returns"
          }
        ],
        "tips": [
          "Use tuples whenever the size and contents of your data are fixed and known beforehand to maximize performance and prevent accidental bugs."
        ],
        "codeExample": "import sys\n\n# Memory comparison\nlst = [1, 2, 3, 4, 5]\ntup = (1, 2, 3, 4, 5)\n\nprint(f\"List bytes:  {sys.getsizeof(lst)}\")  # e.g., 104 bytes\nprint(f\"Tuple bytes: {sys.getsizeof(tup)}\")  # e.g., 80 bytes\n\n# Using Tuple as a Dictionary Key (e.g. 2D Grid coordinates):\nboard = {\n    (0, 0): \"Player 1\",\n    (0, 1): \"Empty\",\n    (1, 1): \"Player 2\"\n}\nprint(board[(0, 0)])  # \"Player 1\"\n\n# Attempting list as dict key fails:\n# board[[0, 0]] = \"Error\" -> TypeError: unhashable type: 'list'"
      },
      {
        "title": "5. Named Tuples: collections.namedtuple & typing.NamedTuple",
        "theory": [
          "Plain tuples use numeric indices (e.g., `user[0]`, `user[1]`), which can make code hard to read and maintain.",
          "NamedTuples solve this by giving field names to each position while retaining all tuple benefits: zero-overhead immutability, tuple unpacking, and indexing.",
          "Modern Python uses `typing.NamedTuple` with type annotations for enterprise codebases."
        ],
        "syntax": "from typing import NamedTuple\n\n# Modern Class-based NamedTuple with Type Hints\nclass GeoPoint(NamedTuple):\n    latitude: float\n    longitude: float\n    city_name: str\n    elevation_m: int = 0  # Default value support!\n\nloc = GeoPoint(18.5204, 73.8567, \"Pune\", 560)\n\n# Access by field name or numeric index\nprint(loc.city_name)    # \"Pune\"\nprint(loc.latitude)     # 18.5204\nprint(loc[0])           # 18.5204 (still works like a normal tuple!)\n\n# Unpacking still works seamlessly:\nlat, lon, city, elev = loc\nprint(f\"{city} is at {lat}, {lon}\")\n\n# NamedTuples are immutable:\n# loc.city_name = \"Mumbai\" -> AttributeError: can't set attribute",
        "tips": [
          "Prefer `typing.NamedTuple` over plain tuples or simple classes when creating lightweight data-transfer records with type safety."
        ],
        "codeExample": "from typing import NamedTuple\n\n# Modern Class-based NamedTuple with Type Hints\nclass GeoPoint(NamedTuple):\n    latitude: float\n    longitude: float\n    city_name: str\n    elevation_m: int = 0  # Default value support!\n\nloc = GeoPoint(18.5204, 73.8567, \"Pune\", 560)\n\n# Access by field name or numeric index\nprint(loc.city_name)    # \"Pune\"\nprint(loc.latitude)     # 18.5204\nprint(loc[0])           # 18.5204 (still works like a normal tuple!)\n\n# Unpacking still works seamlessly:\nlat, lon, city, elev = loc\nprint(f\"{city} is at {lat}, {lon}\")\n\n# NamedTuples are immutable:\n# loc.city_name = \"Mumbai\" -> AttributeError: can't set attribute"
      }
    ]
  },
  {
    "id": "py-dict",
    "chapterNumber": 11,
    "title": "Python Dictionary & Complete Built-in Methods Table",
    "category": "Python Data Structures",
    "shortDesc": "Complete mastery of Python dictionaries: hash tables, lookup mechanics, get vs [], iteration patterns, dictionary comprehensions, Python 3.9+ merge operators, and all 11 methods.",
    "overview": [
      "A Dictionary in Python is an unordered (insertion-ordered in Python 3.7+), mutable collection of key-value pairs written as `{key1: value1, key2: value2}`.",
      "Real-life Analogy: Think of an actual Oxford English Dictionary or phone directory. You don't read page 1 through 500 to find 'Zebra'; you immediately jump to 'Z' via indexing. In Python, key lookup is near-instantaneous O(1) time complexity.",
      "Dictionary keys MUST be immutable and hashable (strings, numbers, tuples). Values can be anything (lists, objects, other dicts, functions)."
    ],
    "sections": [
      {
        "title": "1. What is a Dictionary? (Creation, Key Constraints & Hash Table Internals)",
        "theory": [
          "Dictionaries are implemented as compact, hash-table-backed arrays in CPython. When you look up `d[key]`, Python computes `hash(key)` to find the index directly.",
          "Key rules: 1) Keys must be unique (duplicate keys overwrite earlier ones). 2) Keys must be immutable (strings, integers, floats, booleans, tuples). Mutable types like lists or dicts cannot be keys.",
          "Creation options: Literal curly braces `{}`, `dict()` constructor, or `dict.fromkeys()`."
        ],
        "syntax": "# 1. Creating dictionaries\nstudent = {\n    \"name\": \"Priya Sharma\",\n    \"roll_no\": 1042,\n    \"courses\": [\"Python\", \"Machine Learning\", \"FastAPI\"],\n    \"is_enrolled\": True,\n    \"cgpa\": 9.4\n}\n\n# 2. Key uniqueness demo (last one wins):\ndemo = {\"a\": 1, \"b\": 2, \"a\": 99}\nprint(demo)  # {'a': 99, 'b': 2}\n\n# 3. Valid vs Invalid Keys:\nvalid = { (1, 2): \"coordinate\", \"id\": 10, 42: \"answer\" }  # All hashable!\n# invalid = { [1, 2]: \"error\" } -> TypeError: unhashable type: 'list'",
        "tips": [
          "Since Python 3.7, dictionaries are officially guaranteed to maintain the order in which keys were inserted."
        ],
        "codeExample": "# 1. Creating dictionaries\nstudent = {\n    \"name\": \"Priya Sharma\",\n    \"roll_no\": 1042,\n    \"courses\": [\"Python\", \"Machine Learning\", \"FastAPI\"],\n    \"is_enrolled\": True,\n    \"cgpa\": 9.4\n}\n\n# 2. Key uniqueness demo (last one wins):\ndemo = {\"a\": 1, \"b\": 2, \"a\": 99}\nprint(demo)  # {'a': 99, 'b': 2}\n\n# 3. Valid vs Invalid Keys:\nvalid = { (1, 2): \"coordinate\", \"id\": 10, 42: \"answer\" }  # All hashable!\n# invalid = { [1, 2]: \"error\" } -> TypeError: unhashable type: 'list'"
      },
      {
        "title": "2. Accessing & Modifying: [] vs .get(), .setdefault(), and Deletion",
        "theory": [
          "Accessing by `dict[key]`: If the key does not exist, it crashes your application with a `KeyError`.",
          "Safe access by `dict.get(key, default)`: Returns `None` (or your custom default) if the key is missing without crashing.",
          "Updating values: `dict[key] = new_value` or `dict.update(other_dict)`.",
          "Removing items: `del dict[key]`, `dict.pop(key, default)`, or `dict.popitem()` (removes last inserted key-value pair in LIFO order)."
        ],
        "syntax": "user = {\"username\": \"coder_pro\", \"role\": \"admin\"}\n\n# Square brackets vs .get()\n# print(user[\"email\"])   # CRASHES: KeyError: 'email'\nprint(user.get(\"email\"))                 # None (Safe!)\nprint(user.get(\"email\", \"not_provided\")) # \"not_provided\"\n\n# Adding & Updating\nuser[\"email\"] = \"coder@domain.com\"       # Adds new key\nuser[\"role\"] = \"superadmin\"              # Updates existing key\nuser.update({\"status\": \"active\", \"tier\": \"gold\"})\n\n# .setdefault(): sets default ONLY if key is not already present\nuser.setdefault(\"theme\", \"dark\")  # Adds theme: dark\nuser.setdefault(\"theme\", \"light\") # Keeps theme: dark (unchanged!)\n\n# Safe deletion\nremoved_role = user.pop(\"role\", \"none\")\nprint(f\"Removed: {removed_role}\")\nlast_item = user.popitem()        # Removes ('tier', 'gold')\ndel user[\"username\"]              # Hard delete",
        "tips": [
          "In production web applications (like FastAPI / Django), ALWAYS use `.get()` when reading optional query params or JSON payloads to avoid unhandled 500 server crashes."
        ],
        "codeExample": "user = {\"username\": \"coder_pro\", \"role\": \"admin\"}\n\n# Square brackets vs .get()\n# print(user[\"email\"])   # CRASHES: KeyError: 'email'\nprint(user.get(\"email\"))                 # None (Safe!)\nprint(user.get(\"email\", \"not_provided\")) # \"not_provided\"\n\n# Adding & Updating\nuser[\"email\"] = \"coder@domain.com\"       # Adds new key\nuser[\"role\"] = \"superadmin\"              # Updates existing key\nuser.update({\"status\": \"active\", \"tier\": \"gold\"})\n\n# .setdefault(): sets default ONLY if key is not already present\nuser.setdefault(\"theme\", \"dark\")  # Adds theme: dark\nuser.setdefault(\"theme\", \"light\") # Keeps theme: dark (unchanged!)\n\n# Safe deletion\nremoved_role = user.pop(\"role\", \"none\")\nprint(f\"Removed: {removed_role}\")\nlast_item = user.popitem()        # Removes ('tier', 'gold')\ndel user[\"username\"]              # Hard delete"
      },
      {
        "title": "3. Iterating Dictionaries: keys(), values(), and items() Unpacking",
        "theory": [
          "Python dictionaries offer 3 view objects for iteration: `.keys()` (all keys), `.values()` (all values), and `.items()` (key-value pairs as tuples).",
          "Direct iteration: `for key in my_dict:` loops through keys directly.",
          "Tuple unpacking: `for key, value in my_dict.items():` is the most common and pythonic way to inspect both key and value simultaneously."
        ],
        "syntax": "inventory = {\"apple\": 50, \"mango\": 30, \"banana\": 120}\n\n# 1. Iterate over keys directly\nfor fruit in inventory:\n    print(f\"Fruit: {fruit}\")\n\n# 2. Iterate over values\nfor qty in inventory.values():\n    print(f\"Stock count: {qty}\")\n\n# 3. Iterate over key-value pairs (Best Practice!)\nfor fruit, qty in inventory.items():\n    print(f\"{fruit.capitalize()}: {qty} units in stock\")\n\n# Membership check tests KEYS (very fast O(1)):\nif \"apple\" in inventory:\n    print(\"Apples are available!\")",
        "tips": [
          "`'apple' in inventory` checks keys in O(1) constant time, which is exponentially faster than checking an element in a million-item list (O(N))."
        ],
        "codeExample": "inventory = {\"apple\": 50, \"mango\": 30, \"banana\": 120}\n\n# 1. Iterate over keys directly\nfor fruit in inventory:\n    print(f\"Fruit: {fruit}\")\n\n# 2. Iterate over values\nfor qty in inventory.values():\n    print(f\"Stock count: {qty}\")\n\n# 3. Iterate over key-value pairs (Best Practice!)\nfor fruit, qty in inventory.items():\n    print(f\"{fruit.capitalize()}: {qty} units in stock\")\n\n# Membership check tests KEYS (very fast O(1)):\nif \"apple\" in inventory:\n    print(\"Apples are available!\")"
      },
      {
        "title": "4. Dictionary Comprehensions & Modern Merging (| Operator)",
        "theory": [
          "Dictionary Comprehension syntax: `{key_expr: value_expr for item in iterable if condition}`.",
          "Inverting a dictionary: Flip keys and values with `{v: k for k, v in d.items()}` (assuming unique values).",
          "Python 3.9+ Merge Operator (`|`): Combines two dictionaries into a brand new dictionary in clean syntax.",
          "In-place Merge Operator (`|=`): Updates the left dictionary in-place with the right dictionary."
        ],
        "syntax": "# 1. Dictionary Comprehension (Squares of numbers)\nnumbers = [1, 2, 3, 4, 5, 6]\neven_squares = {n: n**2 for n in numbers if n % 2 == 0}\nprint(even_squares)  # {2: 4, 4: 16, 6: 36}\n\n# 2. Inverting a dictionary (Names to IDs -> IDs to Names)\nusers = {\"user_101\": \"Alice\", \"user_102\": \"Bob\"}\nreversed_users = {name: uid for uid, name in users.items()}\nprint(reversed_users)  # {'Alice': 'user_101', 'Bob': 'user_102'}\n\n# 3. Modern Python 3.9+ Dictionary Merge (|)\nbase_config = {\"host\": \"localhost\", \"port\": 8000, \"debug\": True}\nprod_override = {\"host\": \"0.0.0.0\", \"debug\": False}\n\nmerged_config = base_config | prod_override\nprint(merged_config)\n# {'host': '0.0.0.0', 'port': 8000, 'debug': False} (Right side overwrites left!)",
        "tips": [
          "Before Python 3.9, developers used `{**base_config, **prod_override}`. The `|` operator is cleaner and much more readable."
        ],
        "codeExample": "# 1. Dictionary Comprehension (Squares of numbers)\nnumbers = [1, 2, 3, 4, 5, 6]\neven_squares = {n: n**2 for n in numbers if n % 2 == 0}\nprint(even_squares)  # {2: 4, 4: 16, 6: 36}\n\n# 2. Inverting a dictionary (Names to IDs -> IDs to Names)\nusers = {\"user_101\": \"Alice\", \"user_102\": \"Bob\"}\nreversed_users = {name: uid for uid, name in users.items()}\nprint(reversed_users)  # {'Alice': 'user_101', 'Bob': 'user_102'}\n\n# 3. Modern Python 3.9+ Dictionary Merge (|)\nbase_config = {\"host\": \"localhost\", \"port\": 8000, \"debug\": True}\nprod_override = {\"host\": \"0.0.0.0\", \"debug\": False}\n\nmerged_config = base_config | prod_override\nprint(merged_config)\n# {'host': '0.0.0.0', 'port': 8000, 'debug': False} (Right side overwrites left!)"
      },
      {
        "title": "5. Complete 11 Built-in Dictionary Methods Table",
        "theory": [
          "Python dictionaries have exactly 11 built-in methods. Mastering all 11 ensures you can handle any data manipulation task effortlessly."
        ],
        "syntax": "data = {\"a\": 1, \"b\": 2}\ndata_copy = data.copy()       # Shallow copy\ndata.clear()                  # Empties the dict: {}\nprint(data_copy.get(\"a\", 0))  # 1",
        "table": [
          {
            "attribute": "clear()",
            "value": "None",
            "description": "Removes all key-value elements from the dictionary in O(N) time."
          },
          {
            "attribute": "copy()",
            "value": "dict",
            "description": "Returns a shallow copy of the dictionary in O(N) time."
          },
          {
            "attribute": "fromkeys(seq, [val])",
            "value": "dict",
            "description": "Class method creating a new dict with keys from seq and values set to val (default None)."
          },
          {
            "attribute": "get(key, [default])",
            "value": "value or default",
            "description": "Safely returns value for key if key is in dict; else returns default (None) without crashing."
          },
          {
            "attribute": "items()",
            "value": "dict_items",
            "description": "Returns a dynamic view object displaying a list of (key, value) tuple pairs."
          },
          {
            "attribute": "keys()",
            "value": "dict_keys",
            "description": "Returns a dynamic view object displaying all keys in insertion order."
          },
          {
            "attribute": "pop(key, [default])",
            "value": "removed_value",
            "description": "Removes key and returns its value. If key not found, returns default or raises KeyError."
          },
          {
            "attribute": "popitem()",
            "value": "(key, value)",
            "description": "Removes and returns the last key-value pair added in LIFO (Last-In-First-Out) order."
          },
          {
            "attribute": "setdefault(key, [default])",
            "value": "value",
            "description": "Returns value if key is in dict; if not, inserts key with specified default value and returns it."
          },
          {
            "attribute": "update([other])",
            "value": "None",
            "description": "Updates the dictionary with key/value pairs from other, overwriting existing keys."
          },
          {
            "attribute": "values()",
            "value": "dict_values",
            "description": "Returns a dynamic view object displaying all dictionary values."
          }
        ],
        "tips": [
          "All single-key dictionary operations (`get`, `pop`, `setdefault`, `[]`) operate in O(1) average time complexity because of Python's hash table architecture."
        ],
        "codeExample": "data = {\"a\": 1, \"b\": 2}\ndata_copy = data.copy()       # Shallow copy\ndata.clear()                  # Empties the dict: {}\nprint(data_copy.get(\"a\", 0))  # 1"
      },
      {
        "title": "6. Practical Real-World Challenges & Nested JSON Processing",
        "theory": [
          "In real-world web development, backend APIs receive nested JSON payloads that deserialize into nested dictionaries.",
          "Here we implement two foundational interview patterns: 1) Word Frequency Counter (Histogram), and 2) Safe Deep Nested Dictionary Lookup."
        ],
        "syntax": "# Challenge 1: Character/Word Frequency Counter\ntext = \"apple mango apple banana apple mango orange\"\nfreq = {}\nfor word in text.split():\n    freq[word] = freq.get(word, 0) + 1\nprint(\"Word Counts:\", freq)\n# {'apple': 3, 'mango': 2, 'banana': 1, 'orange': 1}\n\n# Challenge 2: Parsing Complex Nested API JSON Safely\napi_response = {\n    \"status\": 200,\n    \"data\": {\n        \"user\": {\n            \"id\": 849,\n            \"profile\": {\n                \"displayName\": \"Rupesh\",\n                \"city\": \"Mumbai\"\n            }\n        }\n    }\n}\n\n# Safe deep lookup helper function:\ndef deep_get(dictionary, path, default=None):\n    keys = path.split(\".\")\n    curr = dictionary\n    for k in keys:\n        if isinstance(curr, dict) and k in curr:\n            curr = curr[k]\n        else:\n            return default\n    return curr\n\ncity = deep_get(api_response, \"data.user.profile.city\", \"Unknown\")\npostal = deep_get(api_response, \"data.user.profile.pincode\", \"Not Provided\")\nprint(f\"City: {city}, Pincode: {postal}\")\n# Output: City: Mumbai, Pincode: Not Provided",
        "tips": [
          "For frequency counting in standard library, check out `collections.Counter`, which is built on top of dictionaries."
        ],
        "codeExample": "# Challenge 1: Character/Word Frequency Counter\ntext = \"apple mango apple banana apple mango orange\"\nfreq = {}\nfor word in text.split():\n    freq[word] = freq.get(word, 0) + 1\nprint(\"Word Counts:\", freq)\n# {'apple': 3, 'mango': 2, 'banana': 1, 'orange': 1}\n\n# Challenge 2: Parsing Complex Nested API JSON Safely\napi_response = {\n    \"status\": 200,\n    \"data\": {\n        \"user\": {\n            \"id\": 849,\n            \"profile\": {\n                \"displayName\": \"Rupesh\",\n                \"city\": \"Mumbai\"\n            }\n        }\n    }\n}\n\n# Safe deep lookup helper function:\ndef deep_get(dictionary, path, default=None):\n    keys = path.split(\".\")\n    curr = dictionary\n    for k in keys:\n        if isinstance(curr, dict) and k in curr:\n            curr = curr[k]\n        else:\n            return default\n    return curr\n\ncity = deep_get(api_response, \"data.user.profile.city\", \"Unknown\")\npostal = deep_get(api_response, \"data.user.profile.pincode\", \"Not Provided\")\nprint(f\"City: {city}, Pincode: {postal}\")\n# Output: City: Mumbai, Pincode: Not Provided"
      }
    ]
  },
  {
    "id": "py-sets",
    "chapterNumber": 12,
    "title": "Python Sets, Frozensets & Mathematical Set Theory",
    "category": "Python Data Structures",
    "shortDesc": "Comprehensive guide to sets: uniqueness, hashability, mathematical Venn operations (union, intersection, difference), frozenset immutability, and O(1) membership lookups.",
    "overview": [
      "A Set in Python is an unordered collection of unique, hashable elements written inside curly braces `{1, 2, 3}`.",
      "Real-life Analogy: Think of a deck of unique playing cards or a bag of distinct lottery balls. If you draw duplicate numbers, the bag discards the copy and keeps only one unique instance.",
      "Sets are backed by hash tables with no values (only keys). This gives sets constant-time O(1) membership testing (`x in my_set`) and automatic deduplication."
    ],
    "sections": [
      {
        "title": "1. What is a Set? (Creation, Uniqueness & The Empty Set Pitfall)",
        "theory": [
          "Sets discard duplicate elements automatically. Passing `[1, 2, 2, 3, 3, 3]` to a set results in `{1, 2, 3}`.",
          "THE EMPTY SET PITFALL: Writing `{}` creates an empty DICTIONARY, NOT a set! To create an empty set, you MUST use `set()`.",
          "Sets can only store immutable, hashable items (ints, floats, strings, tuples). Adding a list or dict raises `TypeError: unhashable type`."
        ],
        "syntax": "# 1. Creating sets with values\nfruits = {\"apple\", \"banana\", \"mango\", \"apple\", \"banana\"}\nprint(fruits)  # {'banana', 'mango', 'apple'} (Duplicates vanished!)\n\n# 2. THE EMPTY SET PITFALL:\nempty_dict = {}\nempty_set = set()\nprint(type(empty_dict))  # <class 'dict'>\nprint(type(empty_set))   # <class 'set'>\n\n# 3. Deduplicating a list in one line (Very popular interview trick!)\nraw_user_ids = [101, 102, 103, 101, 104, 102, 105]\nunique_ids = list(set(raw_user_ids))\nprint(\"Unique IDs:\", unique_ids)  # [101, 102, 103, 104, 105]",
        "tips": [
          "Because sets are unordered, you cannot access items by index: `fruits[0]` raises `TypeError: 'set' object is not subscriptable`."
        ],
        "codeExample": "# 1. Creating sets with values\nfruits = {\"apple\", \"banana\", \"mango\", \"apple\", \"banana\"}\nprint(fruits)  # {'banana', 'mango', 'apple'} (Duplicates vanished!)\n\n# 2. THE EMPTY SET PITFALL:\nempty_dict = {}\nempty_set = set()\nprint(type(empty_dict))  # <class 'dict'>\nprint(type(empty_set))   # <class 'set'>\n\n# 3. Deduplicating a list in one line (Very popular interview trick!)\nraw_user_ids = [101, 102, 103, 101, 104, 102, 105]\nunique_ids = list(set(raw_user_ids))\nprint(\"Unique IDs:\", unique_ids)  # [101, 102, 103, 104, 105]"
      },
      {
        "title": "2. Mathematical Set Operations (Venn Logic: Union, Intersection, Difference)",
        "theory": [
          "Python sets directly implement mathematical Venn diagram operations using both operator symbols and named methods.",
          "Union (`|`): Combines all unique elements from both sets.",
          "Intersection (`&`): Returns only elements common to both sets.",
          "Difference (`-`): Returns elements in the left set that do NOT exist in the right set.",
          "Symmetric Difference (`^`): Returns elements in either set, but NOT in both (exclusive-OR)."
        ],
        "syntax": "frontend_devs = {\"Alice\", \"Bob\", \"Charlie\", \"David\"}\nbackend_devs = {\"Charlie\", \"David\", \"Eve\", \"Frank\"}\n\n# 1. UNION (| or .union()): All developers\nall_devs = frontend_devs | backend_devs\nprint(\"All Developers:\", all_devs)\n# {'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'}\n\n# 2. INTERSECTION (& or .intersection()): Full-stack developers (in both sets)\nfullstack = frontend_devs & backend_devs\nprint(\"Full-Stack Developers:\", fullstack)\n# {'Charlie', 'David'}\n\n# 3. DIFFERENCE (- or .difference()): Only Frontend developers\nonly_frontend = frontend_devs - backend_devs\nprint(\"Frontend Only:\", only_frontend)\n# {'Alice', 'Bob'}\n\n# 4. SYMMETRIC DIFFERENCE (^ or .symmetric_difference()): Only specialized in one side\nspecialized = frontend_devs ^ backend_devs\nprint(\"Specialized Devs:\", specialized)\n# {'Alice', 'Bob', 'Eve', 'Frank'}",
        "tips": [
          "Operators (like `|`, `&`) require both sides to be sets, whereas methods (like `s.union(iterable)`) can accept any iterable such as lists or tuples."
        ],
        "codeExample": "frontend_devs = {\"Alice\", \"Bob\", \"Charlie\", \"David\"}\nbackend_devs = {\"Charlie\", \"David\", \"Eve\", \"Frank\"}\n\n# 1. UNION (| or .union()): All developers\nall_devs = frontend_devs | backend_devs\nprint(\"All Developers:\", all_devs)\n# {'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'}\n\n# 2. INTERSECTION (& or .intersection()): Full-stack developers (in both sets)\nfullstack = frontend_devs & backend_devs\nprint(\"Full-Stack Developers:\", fullstack)\n# {'Charlie', 'David'}\n\n# 3. DIFFERENCE (- or .difference()): Only Frontend developers\nonly_frontend = frontend_devs - backend_devs\nprint(\"Frontend Only:\", only_frontend)\n# {'Alice', 'Bob'}\n\n# 4. SYMMETRIC DIFFERENCE (^ or .symmetric_difference()): Only specialized in one side\nspecialized = frontend_devs ^ backend_devs\nprint(\"Specialized Devs:\", specialized)\n# {'Alice', 'Bob', 'Eve', 'Frank'}"
      },
      {
        "title": "3. Modifying Sets: add(), update(), remove() vs discard()",
        "theory": [
          "Adding elements: `s.add(item)` adds a single item; `s.update(iterable)` adds multiple items.",
          "The Crucial Difference between `remove()` and `discard()`: `remove(item)` raises a `KeyError` if the element doesn't exist. `discard(item)` removes it silently if present, and does nothing if missing without crashing!",
          "`pop()`: Removes and returns an arbitrary element because sets have no order."
        ],
        "syntax": "tags = {\"python\", \"django\"}\n\n# Adding items\ntags.add(\"fastapi\")\ntags.update([\"docker\", \"kubernetes\", \"python\"])\nprint(\"Tags:\", tags)\n\n# Removing items safely vs unsafely:\ntags.discard(\"non_existent_tag\")  # NO ERROR! Clean and safe.\n\ntry:\n    tags.remove(\"non_existent_tag\") # RAISES KeyError!\nexcept KeyError:\n    print(\"Caught KeyError with .remove()!\")\n\n# Pop an arbitrary element\npopped = tags.pop()\nprint(f\"Popped item: {popped}\")",
        "tips": [
          "Always prefer `set.discard()` over `set.remove()` when deleting items where presence is not 100% guaranteed."
        ],
        "codeExample": "tags = {\"python\", \"django\"}\n\n# Adding items\ntags.add(\"fastapi\")\ntags.update([\"docker\", \"kubernetes\", \"python\"])\nprint(\"Tags:\", tags)\n\n# Removing items safely vs unsafely:\ntags.discard(\"non_existent_tag\")  # NO ERROR! Clean and safe.\n\ntry:\n    tags.remove(\"non_existent_tag\") # RAISES KeyError!\nexcept KeyError:\n    print(\"Caught KeyError with .remove()!\")\n\n# Pop an arbitrary element\npopped = tags.pop()\nprint(f\"Popped item: {popped}\")"
      },
      {
        "title": "4. Frozenset: The Immutable Set",
        "theory": [
          "A `frozenset` is an immutable, hashable version of a set created via `frozenset(iterable)`.",
          "Because regular sets are mutable, you CANNOT have a set of sets, nor can a set be a dictionary key.",
          "Frozensets solve this: they support all read-only mathematical operations (`|`, `&`, `-`, `^`) but cannot be modified, making them hashable."
        ],
        "syntax": "# Regular set cannot be a dict key:\n# d = { {\"admin\", \"user\"}: \"Roles\" } -> TypeError: unhashable type: 'set'\n\n# Frozenset as a dictionary key:\nadmin_roles = frozenset([\"read\", \"write\", \"delete\"])\nviewer_roles = frozenset([\"read\"])\n\npermission_groups = {\n    admin_roles: \"Administrator Level 3\",\n    viewer_roles: \"Guest Viewer\"\n}\n\nprint(permission_groups[admin_roles])  # Administrator Level 3\n\n# Mathematical operations still work:\ncombined = admin_roles | viewer_roles\nprint(\"Combined frozenset:\", combined)",
        "tips": [
          "Use frozensets when defining static permissions, mathematical constants, or immutable lookup keys."
        ],
        "codeExample": "# Regular set cannot be a dict key:\n# d = { {\"admin\", \"user\"}: \"Roles\" } -> TypeError: unhashable type: 'set'\n\n# Frozenset as a dictionary key:\nadmin_roles = frozenset([\"read\", \"write\", \"delete\"])\nviewer_roles = frozenset([\"read\"])\n\npermission_groups = {\n    admin_roles: \"Administrator Level 3\",\n    viewer_roles: \"Guest Viewer\"\n}\n\nprint(permission_groups[admin_roles])  # Administrator Level 3\n\n# Mathematical operations still work:\ncombined = admin_roles | viewer_roles\nprint(\"Combined frozenset:\", combined)"
      },
      {
        "title": "5. Complete Built-in Set Methods Reference Table",
        "theory": [
          "Reference guide for all built-in methods on Python `set` objects."
        ],
        "syntax": "a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a.issubset({1, 2, 3, 4}))  # True\nprint(a.isdisjoint({9, 10}))      # True",
        "table": [
          {
            "attribute": "add(elem)",
            "value": "None",
            "description": "Adds element elem to the set in O(1) time."
          },
          {
            "attribute": "clear()",
            "value": "None",
            "description": "Removes all elements from the set in O(N) time."
          },
          {
            "attribute": "copy()",
            "value": "set",
            "description": "Returns a shallow copy of the set."
          },
          {
            "attribute": "difference(*others)",
            "value": "set",
            "description": "Returns a new set with elements in this set that are not in others (operator -)."
          },
          {
            "attribute": "discard(elem)",
            "value": "None",
            "description": "Removes elem if present; does nothing if missing (O(1))."
          },
          {
            "attribute": "intersection(*others)",
            "value": "set",
            "description": "Returns a new set with elements common to this set and all others (operator &)."
          },
          {
            "attribute": "isdisjoint(other)",
            "value": "bool",
            "description": "Returns True if two sets have a null intersection (no common elements)."
          },
          {
            "attribute": "issubset(other)",
            "value": "bool",
            "description": "Returns True if another set contains this set (operator <=)."
          },
          {
            "attribute": "issuperset(other)",
            "value": "bool",
            "description": "Returns True if this set contains another set (operator >=)."
          },
          {
            "attribute": "pop()",
            "value": "elem",
            "description": "Removes and returns an arbitrary set element; raises KeyError if empty."
          },
          {
            "attribute": "remove(elem)",
            "value": "None",
            "description": "Removes elem from set; raises KeyError if elem is not found."
          },
          {
            "attribute": "symmetric_difference(other)",
            "value": "set",
            "description": "Returns a new set with elements in either set but not both (operator ^)."
          },
          {
            "attribute": "union(*others)",
            "value": "set",
            "description": "Returns a new set with elements from this set and all others (operator |)."
          }
        ],
        "tips": [
          "Checking `item in my_set` runs in O(1) average time, making sets the ultimate data structure for filtering and membership testing in Big Data applications."
        ],
        "codeExample": "a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a.issubset({1, 2, 3, 4}))  # True\nprint(a.isdisjoint({9, 10}))      # True"
      }
    ]
  },
  {
    "id": "py-functions",
    "chapterNumber": 13,
    "title": "Python Functions, *args, **kwargs & Lambdas",
    "category": "Functions & Modular Code",
    "shortDesc": "Complete mastery of Python functions: def statement, return vs print, default parameter traps, *args, **kwargs, positional-only/keyword-only markers, and lambdas.",
    "overview": [
      "A Function in Python is a reusable block of organized code defined using the `def` keyword, designed to perform a specific computational task and optionally return a result.",
      "Real-life Analogy: Think of a microwave oven. You put ingredients in (Arguments), select a preset cooking mode (Parameters), press start (Execution), and it beeps and delivers a cooked meal (Return value). You don't rebuild the microwave each time you want hot food.",
      "In Python, functions are 'First-Class Citizens', meaning they can be passed as arguments to other functions, assigned to variables, and returned from other functions."
    ],
    "sections": [
      {
        "title": "1. Function Basics (def, docstrings, Parameters vs Arguments & return)",
        "theory": [
          "Parameters vs Arguments: Parameters are the variables declared in the function definition header; Arguments are the actual concrete values passed into the function upon invocation.",
          "Docstrings (PEP 257): Triple-quoted documentation strings placed immediately after the `def` header, accessible via `func.__doc__` or `help(func)`.",
          "Return vs Print: `print()` merely displays text to the console output; `return` sends data back to the calling code so it can be stored in a variable, transformed, or evaluated in expressions. A function without an explicit `return` implicitly returns `None`."
        ],
        "syntax": "def calculate_gst(amount: float, tax_rate: float = 0.18) -> float:\n    \"\"\"\n    Calculates the GST tax amount for a given transaction.\n    \n    :param amount: Total transaction value in INR.\n    :param tax_rate: Tax percentage as a decimal (default 18%).\n    :return: Total final amount inclusive of GST.\n    \"\"\"\n    tax = amount * tax_rate\n    total = amount + tax\n    return round(total, 2)\n\n# Invoking function with positional and keyword arguments\nbill1 = calculate_gst(1000.0)          # Uses default 18% rate -> 1180.0\nbill2 = calculate_gst(500.0, tax_rate=0.05)  # Custom 5% rate -> 525.0\n\nprint(f\"Bill 1: ₹{bill1}\")\nprint(f\"Bill 2: ₹{bill2}\")\nprint(\"Docstring preview:\", calculate_gst.__doc__.strip().split('\\n')[0])",
        "tips": [
          "Always provide type hints (PEP 484) in modern Python. They dramatically improve IDE autocompletion and reduce production bugs."
        ],
        "codeExample": "def calculate_gst(amount: float, tax_rate: float = 0.18) -> float:\n    \"\"\"\n    Calculates the GST tax amount for a given transaction.\n    \n    :param amount: Total transaction value in INR.\n    :param tax_rate: Tax percentage as a decimal (default 18%).\n    :return: Total final amount inclusive of GST.\n    \"\"\"\n    tax = amount * tax_rate\n    total = amount + tax\n    return round(total, 2)\n\n# Invoking function with positional and keyword arguments\nbill1 = calculate_gst(1000.0)          # Uses default 18% rate -> 1180.0\nbill2 = calculate_gst(500.0, tax_rate=0.05)  # Custom 5% rate -> 525.0\n\nprint(f\"Bill 1: ₹{bill1}\")\nprint(f\"Bill 2: ₹{bill2}\")\nprint(\"Docstring preview:\", calculate_gst.__doc__.strip().split('\\n')[0])"
      },
      {
        "title": "2. The Infamous Mutable Default Argument Trap (def f(x=[]))",
        "theory": [
          "CRITICAL PYTHON TRAP: Default argument values are evaluated ONCE when the function definition is executed, NOT each time the function is called!",
          "If you use a mutable object (like a list `[]` or dictionary `{}`) as a default parameter, that single object is shared across ALL subsequent function invocations!",
          "The Standard Solution: Always default mutable parameters to `None`, and initialize a fresh new list/dict inside the function body if the argument is `None`."
        ],
        "syntax": "# ❌ THE WRONG WAY (The Mutable Default Bug):\ndef add_user_bad(user: str, user_list=[]):\n    user_list.append(user)\n    return user_list\n\nprint(add_user_bad(\"Aarav\"))   # ['Aarav']\nprint(add_user_bad(\"Bhavna\"))  # ['Aarav', 'Bhavna']  <-- BUG! Aarav persisted!\n\n# ✅ THE RIGHT PYTHONIC WAY:\ndef add_user_good(user: str, user_list=None):\n    if user_list is None:\n        user_list = []  # Creates a fresh list on EVERY invocation\n    user_list.append(user)\n    return user_list\n\nprint(add_user_good(\"Aarav\"))   # ['Aarav']\nprint(add_user_good(\"Bhavna\"))  # ['Bhavna']  <-- CLEAN!",
        "tips": [
          "Never use `[]` or `{}` as default parameter values. Always use `= None` and reassign inside."
        ],
        "codeExample": "# ❌ THE WRONG WAY (The Mutable Default Bug):\ndef add_user_bad(user: str, user_list=[]):\n    user_list.append(user)\n    return user_list\n\nprint(add_user_bad(\"Aarav\"))   # ['Aarav']\nprint(add_user_bad(\"Bhavna\"))  # ['Aarav', 'Bhavna']  <-- BUG! Aarav persisted!\n\n# ✅ THE RIGHT PYTHONIC WAY:\ndef add_user_good(user: str, user_list=None):\n    if user_list is None:\n        user_list = []  # Creates a fresh list on EVERY invocation\n    user_list.append(user)\n    return user_list\n\nprint(add_user_good(\"Aarav\"))   # ['Aarav']\nprint(add_user_good(\"Bhavna\"))  # ['Bhavna']  <-- CLEAN!"
      },
      {
        "title": "3. Arbitrary Arguments: *args (Tuples) and **kwargs (Dictionaries)",
        "theory": [
          "`*args`: Collects any number of positional arguments into a single tuple. The asterisk `*` is the unpacking operator; the name `args` is a universal convention.",
          "`**kwargs`: Collects any number of keyword (named) arguments into a single dictionary. Double asterisks `**` unpack dictionaries; the name `kwargs` stands for 'keyword arguments'.",
          "Order in function definition: Positional parameters -> `*args` -> Keyword parameters -> `**kwargs`."
        ],
        "syntax": "def build_invoice(client_name: str, *line_items: float, discount: float = 0.0, **metadata):\n    subtotal = sum(line_items)\n    final_total = subtotal * (1 - discount)\n    \n    print(f\"=== INVOICE FOR: {client_name} ===\")\n    print(f\"Subtotal ({len(line_items)} items): ₹{subtotal:.2f}\")\n    print(f\"Final Total (after {discount*100}% off): ₹{final_total:.2f}\")\n    \n    # Metadata inspected from kwargs\n    if metadata:\n        print(\"Metadata / Extra Details:\")\n        for key, val in metadata.items():\n            print(f\"  • {key}: {val}\")\n\n# Calling with arbitrary args and arbitrary kwargs\nbuild_invoice(\n    \"Apex Global Ltd\",\n    1200.50, 450.0, 99.0, 320.0,    # *line_items packed into tuple\n    discount=0.10,                   # keyword argument\n    payment_mode=\"UPI\",              # **metadata packed into dict\n    invoice_id=\"INV-2026-99\",\n    currency=\"INR\"\n)",
        "tips": [
          "You can also use `*` and `**` when calling functions to unpack existing lists/tuples or dicts into function parameters!"
        ],
        "codeExample": "def build_invoice(client_name: str, *line_items: float, discount: float = 0.0, **metadata):\n    subtotal = sum(line_items)\n    final_total = subtotal * (1 - discount)\n    \n    print(f\"=== INVOICE FOR: {client_name} ===\")\n    print(f\"Subtotal ({len(line_items)} items): ₹{subtotal:.2f}\")\n    print(f\"Final Total (after {discount*100}% off): ₹{final_total:.2f}\")\n    \n    # Metadata inspected from kwargs\n    if metadata:\n        print(\"Metadata / Extra Details:\")\n        for key, val in metadata.items():\n            print(f\"  • {key}: {val}\")\n\n# Calling with arbitrary args and arbitrary kwargs\nbuild_invoice(\n    \"Apex Global Ltd\",\n    1200.50, 450.0, 99.0, 320.0,    # *line_items packed into tuple\n    discount=0.10,                   # keyword argument\n    payment_mode=\"UPI\",              # **metadata packed into dict\n    invoice_id=\"INV-2026-99\",\n    currency=\"INR\"\n)"
      },
      {
        "title": "4. Modern Parameter Controls: Positional-Only (/) and Keyword-Only (*)",
        "theory": [
          "Python 3.8+ introduced the slash `/` and star `*` markers to enforce strict API contracts in enterprise codebases.",
          "Positional-Only (`/`): Any parameters BEFORE the `/` MUST be passed by position; they cannot be passed as `key=value`.",
          "Keyword-Only (`*`): Any parameters AFTER the `*` MUST be passed as named keywords; they cannot be passed positionally."
        ],
        "syntax": "# Syntax: def func(pos_only, /, standard, *, kw_only):\ndef configure_cache(cache_name: str, /, timeout_sec: int = 300, *, persistent: bool = False):\n    print(f\"Cache: {cache_name}, Timeout: {timeout_sec}s, Persistent: {persistent}\")\n\n# 1. Valid invocation:\nconfigure_cache(\"redis_session\", 600, persistent=True)\n\n# 2. Invalid: passing positional-only as keyword\n# configure_cache(cache_name=\"redis\")  \n# -> TypeError: configure_cache() got some positional-only arguments passed as keyword arguments: 'cache_name'\n\n# 3. Invalid: passing keyword-only positionally\n# configure_cache(\"redis_session\", 600, True)\n# -> TypeError: configure_cache() takes from 1 to 2 positional arguments but 3 were given",
        "tips": [
          "Standard library functions like `pow(x, y, /)` and `sorted(iterable, *, key=None, reverse=False)` use this syntax to make code readable and safe from API refactoring."
        ],
        "codeExample": "# Syntax: def func(pos_only, /, standard, *, kw_only):\ndef configure_cache(cache_name: str, /, timeout_sec: int = 300, *, persistent: bool = False):\n    print(f\"Cache: {cache_name}, Timeout: {timeout_sec}s, Persistent: {persistent}\")\n\n# 1. Valid invocation:\nconfigure_cache(\"redis_session\", 600, persistent=True)\n\n# 2. Invalid: passing positional-only as keyword\n# configure_cache(cache_name=\"redis\")  \n# -> TypeError: configure_cache() got some positional-only arguments passed as keyword arguments: 'cache_name'\n\n# 3. Invalid: passing keyword-only positionally\n# configure_cache(\"redis_session\", 600, True)\n# -> TypeError: configure_cache() takes from 1 to 2 positional arguments but 3 were given"
      },
      {
        "title": "5. First-Class Functions & Anonymous Lambda Expressions",
        "theory": [
          "Lambda functions: Small, anonymous inline functions defined with `lambda parameters: expression`.",
          "A lambda can have any number of parameters, but only a SINGLE expression (no multi-line statements, no assignments, no `return` keyword needed).",
          "Best use cases: Short sorting keys (`sorted(..., key=lambda x: ...)`), quick transformations (`map()`, `filter()`), or event callbacks."
        ],
        "syntax": "# 1. Basic lambda syntax\nsquare = lambda x: x ** 2\nprint(\"5 squared:\", square(5))  # 25\n\n# 2. Sorting complex lists of dictionaries by a specific key\nemployees = [\n    {\"name\": \"Dev\", \"salary\": 85000},\n    {\"name\": \"Aanya\", \"salary\": 120000},\n    {\"name\": \"Karan\", \"salary\": 65000}\n]\n\n# Sort by salary ascending:\nsorted_by_salary = sorted(employees, key=lambda emp: emp[\"salary\"])\nfor emp in sorted_by_salary:\n    print(f\"{emp['name']}: ₹{emp['salary']}\")\n\n# 3. Filtering elements using lambda\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nevens = list(filter(lambda n: n % 2 == 0, numbers))\nprint(\"Evens:\", evens)  # [2, 4, 6, 8, 10]",
        "tips": [
          "PEP 8 recommendation: Do NOT assign lambdas to variables (e.g. `f = lambda x: ...`). Use standard `def f(x):` for named functions; use lambdas only as inline anonymous callbacks."
        ],
        "codeExample": "# 1. Basic lambda syntax\nsquare = lambda x: x ** 2\nprint(\"5 squared:\", square(5))  # 25\n\n# 2. Sorting complex lists of dictionaries by a specific key\nemployees = [\n    {\"name\": \"Dev\", \"salary\": 85000},\n    {\"name\": \"Aanya\", \"salary\": 120000},\n    {\"name\": \"Karan\", \"salary\": 65000}\n]\n\n# Sort by salary ascending:\nsorted_by_salary = sorted(employees, key=lambda emp: emp[\"salary\"])\nfor emp in sorted_by_salary:\n    print(f\"{emp['name']}: ₹{emp['salary']}\")\n\n# 3. Filtering elements using lambda\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nevens = list(filter(lambda n: n % 2 == 0, numbers))\nprint(\"Evens:\", evens)  # [2, 4, 6, 8, 10]"
      },
      {
        "title": "6. Recursion & Python's Call Stack Limits",
        "theory": [
          "Recursion occurs when a function calls itself to solve a smaller subproblem of the original task.",
          "Every recursive function MUST have two parts: 1) A Base Case (stopping condition that prevents infinite looping), and 2) A Recursive Step (moving toward the base case).",
          "Python does NOT optimize for tail-call recursion. CPython enforces a recursion depth limit (default 1000) to protect against C stack overflow crashes (`RecursionError`)."
        ],
        "syntax": "import sys\n\n# Inspect Python's default recursion limit\nprint(\"Recursion limit:\", sys.getrecursionlimit())  # Typically 1000\n\n# Classic Factorial implementation: n! = n * (n-1)!\ndef factorial(n: int) -> int:\n    # 1. Base case\n    if n <= 1:\n        return 1\n    # 2. Recursive step\n    return n * factorial(n - 1)\n\nprint(\"Factorial of 5:\", factorial(5))  # 120\n\n# Fibonacci with memoization to avoid O(2^N) exponential explosion:\nmemo = {}\ndef fib(n: int) -> int:\n    if n in (0, 1):\n        return n\n    if n not in memo:\n        memo[n] = fib(n - 1) + fib(n - 2)\n    return memo[n]\n\nprint(\"Fibonacci(30):\", fib(30))  # 832040 (Instant O(N)!)",
        "tips": [
          "In modern Python, use `@functools.lru_cache` instead of manual memoization dictionaries for recursive functions."
        ],
        "codeExample": "import sys\n\n# Inspect Python's default recursion limit\nprint(\"Recursion limit:\", sys.getrecursionlimit())  # Typically 1000\n\n# Classic Factorial implementation: n! = n * (n-1)!\ndef factorial(n: int) -> int:\n    # 1. Base case\n    if n <= 1:\n        return 1\n    # 2. Recursive step\n    return n * factorial(n - 1)\n\nprint(\"Factorial of 5:\", factorial(5))  # 120\n\n# Fibonacci with memoization to avoid O(2^N) exponential explosion:\nmemo = {}\ndef fib(n: int) -> int:\n    if n in (0, 1):\n        return n\n    if n not in memo:\n        memo[n] = fib(n - 1) + fib(n - 2)\n    return memo[n]\n\nprint(\"Fibonacci(30):\", fib(30))  # 832040 (Instant O(N)!)"
      }
    ]
  },
  {
    "id": "py-scope-closures",
    "chapterNumber": 14,
    "title": "Python Scope, Closures & Decorators (@syntax)",
    "category": "Functions & Modular Code",
    "shortDesc": "Master LEGB variable scope lookup, global vs nonlocal keywords, closure state preservation, and production function decorators.",
    "overview": [
      "Python resolves variable names using the strict LEGB Rule: Local -> Enclosing -> Global -> Built-in.",
      "A Closure is an inner function that retains access to variables from its enclosing outer scope even after the outer function has finished executing and returned.",
      "Decorators are Python's cleanest architectural pattern for extending or modifying the behavior of functions or methods without modifying their source code."
    ],
    "sections": [
      {
        "title": "1. The LEGB Scope Rule & global / nonlocal Keywords",
        "theory": [
          "LEGB Hierarchy: 1) Local (inside current function), 2) Enclosing (inside enclosing wrapper function), 3) Global (module-level), 4) Built-in (Python built-ins like `len`, `range`).",
          "Reading vs Writing: You can READ a global or enclosing variable from anywhere. But if you assign (`=`) to a variable inside a function, Python treats it as a LOCAL variable unless declared otherwise!",
          "`global`: Tells Python the variable belongs to module global scope.",
          "`nonlocal`: Tells Python the variable belongs to the immediate outer enclosing function (essential for closures)."
        ],
        "syntax": "x = \"GLOBAL\"\n\ndef outer():\n    x = \"ENCLOSING\"\n    \n    def inner():\n        nonlocal x   # Modifies outer's 'x', NOT a new local variable\n        x = \"MODIFIED BY INNER\"\n        print(\"Inside inner:\", x)\n        \n    inner()\n    print(\"Inside outer:\", x)\n\nouter()\nprint(\"At module level:\", x)\n# Output:\n# Inside inner: MODIFIED BY INNER\n# Inside outer: MODIFIED BY INNER\n# At module level: GLOBAL",
        "tips": [
          "Avoid excessive use of the `global` keyword in production. It makes functions state-dependent and hard to unit test."
        ],
        "codeExample": "x = \"GLOBAL\"\n\ndef outer():\n    x = \"ENCLOSING\"\n    \n    def inner():\n        nonlocal x   # Modifies outer's 'x', NOT a new local variable\n        x = \"MODIFIED BY INNER\"\n        print(\"Inside inner:\", x)\n        \n    inner()\n    print(\"Inside outer:\", x)\n\nouter()\nprint(\"At module level:\", x)\n# Output:\n# Inside inner: MODIFIED BY INNER\n# Inside outer: MODIFIED BY INNER\n# At module level: GLOBAL"
      },
      {
        "title": "2. Closures: Preserving State Without Full Classes",
        "theory": [
          "A Closure occurs when: 1) We have a nested function, 2) The nested function refers to a variable in the enclosing scope, and 3) The enclosing function returns the nested function object.",
          "The inner function carries a hidden `__closure__` attribute containing cell objects that store the preserved variables in memory.",
          "Closures provide lightweight data hiding and state encapsulation without the boilerplate of creating a full class."
        ],
        "syntax": "def make_counter(start: int = 0):\n    count = start\n    \n    def increment():\n        nonlocal count\n        count += 1\n        return count\n        \n    return increment\n\n# Create two independent counter instances:\ncounter_a = make_counter(0)\ncounter_b = make_counter(100)\n\nprint(counter_a())  # 1\nprint(counter_a())  # 2\nprint(counter_b())  # 101 (Maintains completely isolated state!)\nprint(counter_a())  # 3",
        "tips": [
          "Closures are the foundational stepping stone required to understand Python Decorators."
        ],
        "codeExample": "def make_counter(start: int = 0):\n    count = start\n    \n    def increment():\n        nonlocal count\n        count += 1\n        return count\n        \n    return increment\n\n# Create two independent counter instances:\ncounter_a = make_counter(0)\ncounter_b = make_counter(100)\n\nprint(counter_a())  # 1\nprint(counter_a())  # 2\nprint(counter_b())  # 101 (Maintains completely isolated state!)\nprint(counter_a())  # 3"
      },
      {
        "title": "3. Decorators Demystified: The @ Wrapper Syntax",
        "theory": [
          "A Decorator is simply a callable that takes a function as input, extends its behavior, and returns a replacement wrapper function.",
          "The `@my_decorator` syntax is pure syntactic sugar for: `my_func = my_decorator(my_func)`.",
          "Crucial Best Practice: Always use `@functools.wraps(func)` on the inner wrapper! Without it, your decorated function loses its original name, docstring, and annotations."
        ],
        "syntax": "import time\nfrom functools import wraps\n\ndef execution_timer(func):\n    \"\"\"Decorator that measures execution duration of any function.\"\"\"\n    @wraps(func)  # Preserves func.__name__ and func.__doc__\n    def wrapper(*args, **kwargs):\n        t_start = time.perf_counter()\n        result = func(*args, **kwargs)\n        duration = time.perf_counter() - t_start\n        print(f\"[BENCHMARK] '{func.__name__}' executed in {duration:.6f}s\")\n        return result\n    return wrapper\n\n# Applying the decorator using @ syntax\n@execution_timer\ndef simulate_heavy_computation(n: int):\n    \"\"\"Simulates CPU work by summing numbers.\"\"\"\n    return sum(i * i for i in range(n))\n\nval = simulate_heavy_computation(1_000_000)\nprint(f\"Result computed. Name preserved: {simulate_heavy_computation.__name__}\")",
        "tips": [
          "Always use `*args, **kwargs` inside wrapper functions so the decorator can wrap functions with ANY signature."
        ],
        "codeExample": "import time\nfrom functools import wraps\n\ndef execution_timer(func):\n    \"\"\"Decorator that measures execution duration of any function.\"\"\"\n    @wraps(func)  # Preserves func.__name__ and func.__doc__\n    def wrapper(*args, **kwargs):\n        t_start = time.perf_counter()\n        result = func(*args, **kwargs)\n        duration = time.perf_counter() - t_start\n        print(f\"[BENCHMARK] '{func.__name__}' executed in {duration:.6f}s\")\n        return result\n    return wrapper\n\n# Applying the decorator using @ syntax\n@execution_timer\ndef simulate_heavy_computation(n: int):\n    \"\"\"Simulates CPU work by summing numbers.\"\"\"\n    return sum(i * i for i in range(n))\n\nval = simulate_heavy_computation(1_000_000)\nprint(f\"Result computed. Name preserved: {simulate_heavy_computation.__name__}\")"
      },
      {
        "title": "4. Decorators with Arguments (Three-Tier Wrappers)",
        "theory": [
          "What if you want to pass parameters into your decorator, like `@repeat(num_times=3)` or `@require_role('admin')`?",
          "A decorator with arguments requires THREE nested functions: 1) The outer factory that accepts decorator arguments, 2) The middle decorator that accepts the target function, and 3) The inner wrapper that executes per call."
        ],
        "syntax": "from functools import wraps\n\ndef repeat(times: int = 2):\n    \"\"\"Decorator factory that runs a function multiple times.\"\"\"\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            last_result = None\n            for i in range(1, times + 1):\n                print(f\"-> Execution #{i} of {func.__name__}...\")\n                last_result = func(*args, **kwargs)\n            return last_result\n        return wrapper\n    return decorator\n\n@repeat(times=3)\ndef ping_service(host: str):\n    print(f\"Pinging {host}: OK\")\n\nping_service(\"api.converterallai.com\")",
        "tips": [
          "This 3-tier pattern is exactly how web frameworks like FastAPI (`@app.get('/endpoint')`) and Flask implement route decorators."
        ],
        "codeExample": "from functools import wraps\n\ndef repeat(times: int = 2):\n    \"\"\"Decorator factory that runs a function multiple times.\"\"\"\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            last_result = None\n            for i in range(1, times + 1):\n                print(f\"-> Execution #{i} of {func.__name__}...\")\n                last_result = func(*args, **kwargs)\n            return last_result\n        return wrapper\n    return decorator\n\n@repeat(times=3)\ndef ping_service(host: str):\n    print(f\"Pinging {host}: OK\")\n\nping_service(\"api.converterallai.com\")"
      },
      {
        "title": "5. Production Decorators: LRU Cache & Rate Limiting",
        "theory": [
          "Python's standard library comes with built-in production decorators, most notably `@functools.lru_cache` (Least Recently Used memoization cache).",
          "Real-world use-cases: Authentication verification in web APIs, database query caching, automated retry logic on network failure, and audit logging."
        ],
        "syntax": "from functools import lru_cache\n\n# Using standard library's LRU cache:\n@lru_cache(maxsize=128)\ndef compute_expensive_hash(input_string: str) -> int:\n    print(f\"Calculating complex hash for: '{input_string}'...\")\n    # Expensive computation simulated\n    return hash(input_string)\n\n# First call calculates:\nprint(compute_expensive_hash(\"test-payload-1\"))\n\n# Second call with SAME argument returns instantly from cache!\nprint(compute_expensive_hash(\"test-payload-1\"))\n\n# Inspect cache statistics:\nprint(\"Cache info:\", compute_expensive_hash.cache_info())\n# CacheInfo(hits=1, misses=1, maxsize=128, currsize=1)",
        "tips": [
          "Use `@lru_cache` for pure deterministic functions (where the same input always yields the same output) to gain massive performance boosts."
        ],
        "codeExample": "from functools import lru_cache\n\n# Using standard library's LRU cache:\n@lru_cache(maxsize=128)\ndef compute_expensive_hash(input_string: str) -> int:\n    print(f\"Calculating complex hash for: '{input_string}'...\")\n    # Expensive computation simulated\n    return hash(input_string)\n\n# First call calculates:\nprint(compute_expensive_hash(\"test-payload-1\"))\n\n# Second call with SAME argument returns instantly from cache!\nprint(compute_expensive_hash(\"test-payload-1\"))\n\n# Inspect cache statistics:\nprint(\"Cache info:\", compute_expensive_hash.cache_info())\n# CacheInfo(hits=1, misses=1, maxsize=128, currsize=1)"
      }
    ]
  },
  {
    "id": "py-files",
    "chapterNumber": 15,
    "title": "Python File I/O & Context Managers (with statement)",
    "category": "Files, Systems & Utilities",
    "shortDesc": "Complete guide to file input/output in Python: modes, UTF-8 encoding, reading/writing methods, pathlib modern path manipulation, and custom context managers.",
    "overview": [
      "File I/O allows Python programs to persist data to disk, read configuration files, process CSV/JSON datasets, and log server events.",
      "Real-life Analogy: Think of borrowing a reference book from a library. You open the book, read or take notes, and MUST return it so others can use it and no pages are lost. The `with` statement ensures the book is returned even if the library suddenly catches fire.",
      "The `with` statement guarantees deterministic resource cleanup (flushing write buffers and closing OS file descriptors) via the Context Manager protocol."
    ],
    "sections": [
      {
        "title": "1. File Modes & Safe File Handling with 'with'",
        "theory": [
          "The classic way (`f = open(...) ... f.close()`) is dangerous: if an exception occurs between open and close, the file descriptor remains locked by the operating system, causing memory leaks.",
          "The `with` statement acts as a Context Manager: it automatically closes the file the exact millisecond code exits the indented block, even if an unhandled exception crashes the block!",
          "Always specify `encoding='utf-8'` to prevent cross-platform character corruption between Windows (cp1252) and Linux."
        ],
        "syntax": "# ✅ THE GOLD STANDARD PYTHON FILE PATTERN:\nwith open(\"app.log\", mode=\"w\", encoding=\"utf-8\") as f:\n    f.write(\"2026-10-28 10:00:00 [INFO] System initialized successfully.\\n\")\n    f.write(\"2026-10-28 10:00:01 [DEBUG] Loaded 45 database connections.\\n\")\n\n# File is automatically, safely closed here!\nprint(\"Is file closed?\", f.closed)  # True\n\n# Reading the file safely:\nwith open(\"app.log\", mode=\"r\", encoding=\"utf-8\") as f:\n    content = f.read()\n    print(\"Log contents:\\n\" + content)",
        "tips": [
          "Never call `f.close()` manually in modern Python; always wrap file operations inside a `with open(...)` block."
        ],
        "codeExample": "# ✅ THE GOLD STANDARD PYTHON FILE PATTERN:\nwith open(\"app.log\", mode=\"w\", encoding=\"utf-8\") as f:\n    f.write(\"2026-10-28 10:00:00 [INFO] System initialized successfully.\\n\")\n    f.write(\"2026-10-28 10:00:01 [DEBUG] Loaded 45 database connections.\\n\")\n\n# File is automatically, safely closed here!\nprint(\"Is file closed?\", f.closed)  # True\n\n# Reading the file safely:\nwith open(\"app.log\", mode=\"r\", encoding=\"utf-8\") as f:\n    content = f.read()\n    print(\"Log contents:\\n\" + content)"
      },
      {
        "title": "2. Complete File Modes Reference Table",
        "theory": [
          "Python supports combinations of reading (`r`), writing (`w`), appending (`a`), exclusive creation (`x`), text mode (`t`), and binary mode (`b`)."
        ],
        "syntax": "# Binary mode for images, PDFs, audio\n# with open(\"avatar.png\", \"rb\") as img_file:\n#     raw_bytes = img_file.read()",
        "table": [
          {
            "attribute": "'r' (Read)",
            "value": "Default mode",
            "description": "Opens file for reading text. File must already exist, or FileNotFoundError is raised."
          },
          {
            "attribute": "'w' (Write)",
            "value": "Truncates file",
            "description": "Opens for writing. If file exists, truncates (erases) everything! If not, creates new file."
          },
          {
            "attribute": "'a' (Append)",
            "value": "Appends to end",
            "description": "Opens for writing. Appends new data to the end without erasing existing contents."
          },
          {
            "attribute": "'x' (Exclusive)",
            "value": "Fails if exists",
            "description": "Creates a new file for writing. Fails with FileExistsError if file already exists (safe write)."
          },
          {
            "attribute": "'r+' (Read+Write)",
            "value": "In-place edit",
            "description": "Opens for both reading and writing; file pointer starts at the beginning."
          },
          {
            "attribute": "'rb' / 'wb'",
            "value": "Binary bytes",
            "description": "Reads/writes raw bytes instead of strings. Essential for images, PDFs, zips, models."
          }
        ],
        "tips": [
          "Use mode `'x'` when saving user uploads to prevent accidentally overwriting existing files with the same name."
        ],
        "codeExample": "# Binary mode for images, PDFs, audio\n# with open(\"avatar.png\", \"rb\") as img_file:\n#     raw_bytes = img_file.read()"
      },
      {
        "title": "3. Reading Techniques: read(), readline(), and Memory-Safe Iteration",
        "theory": [
          "`f.read()`: Reads the ENTIRE file into memory as one giant string. (DANGEROUS for 10 GB log files!).",
          "`f.readline()`: Reads a single line at a time until newline `\\n`.",
          "`f.readlines()`: Reads all lines into a list of strings.",
          "Memory-Safe Line Iteration (`for line in f:`): The file object itself is an iterator that streams one line at a time from disk with minimal RAM footprint."
        ],
        "syntax": "# Memory-Safe stream processing of large log files:\ndef count_errors(filepath: str) -> int:\n    error_count = 0\n    # Python streams chunks into a small buffer; does NOT load 5GB into RAM:\n    with open(filepath, \"r\", encoding=\"utf-8\") as log_file:\n        for line_num, line in enumerate(log_file, 1):\n            if \"[ERROR]\" in line or \"[CRITICAL]\" in line:\n                error_count += 1\n                print(f\"Issue on line {line_num}: {line.strip()}\")\n    return error_count",
        "tips": [
          "Always iterate directly over the file object (`for line in f:`) when processing files of unknown or large size."
        ],
        "codeExample": "# Memory-Safe stream processing of large log files:\ndef count_errors(filepath: str) -> int:\n    error_count = 0\n    # Python streams chunks into a small buffer; does NOT load 5GB into RAM:\n    with open(filepath, \"r\", encoding=\"utf-8\") as log_file:\n        for line_num, line in enumerate(log_file, 1):\n            if \"[ERROR]\" in line or \"[CRITICAL]\" in line:\n                error_count += 1\n                print(f\"Issue on line {line_num}: {line.strip()}\")\n    return error_count"
      },
      {
        "title": "4. Modern File Operations with pathlib.Path",
        "theory": [
          "Legacy Python used `os.path.join()`, `os.path.exists()`, which dealt with raw strings and had Windows `\\` vs Linux `/` slashes issues.",
          "Python 3.4+ introduced `pathlib`, an object-oriented file path abstraction that is cross-platform, elegant, and much cleaner."
        ],
        "syntax": "from pathlib import Path\n\n# Create path object (works on Windows, Mac, and Linux!)\nbase_dir = Path(\"storage\") / \"reports\" / \"2026\"\n\n# Create directories recursively (like mkdir -p):\nbase_dir.mkdir(parents=True, exist_ok=True)\n\nreport_file = base_dir / \"summary.txt\"\n\n# One-liner read and write without even using 'with open':\nreport_file.write_text(\"Revenue: $1.2M\\nGrowth: 45%\", encoding=\"utf-8\")\n\n# Check metadata\nprint(\"File exists?\", report_file.exists())\nprint(\"File name:\", report_file.name)\nprint(\"File extension:\", report_file.suffix)\nprint(\"File size (bytes):\", report_file.stat().st_size)\n\n# Read text back\nprint(\"Read content:\\n\" + report_file.read_text(encoding=\"utf-8\"))",
        "tips": [
          "Use `pathlib.Path` for all new Python 3 projects instead of the old `os.path` module."
        ],
        "codeExample": "from pathlib import Path\n\n# Create path object (works on Windows, Mac, and Linux!)\nbase_dir = Path(\"storage\") / \"reports\" / \"2026\"\n\n# Create directories recursively (like mkdir -p):\nbase_dir.mkdir(parents=True, exist_ok=True)\n\nreport_file = base_dir / \"summary.txt\"\n\n# One-liner read and write without even using 'with open':\nreport_file.write_text(\"Revenue: $1.2M\\nGrowth: 45%\", encoding=\"utf-8\")\n\n# Check metadata\nprint(\"File exists?\", report_file.exists())\nprint(\"File name:\", report_file.name)\nprint(\"File extension:\", report_file.suffix)\nprint(\"File size (bytes):\", report_file.stat().st_size)\n\n# Read text back\nprint(\"Read content:\\n\" + report_file.read_text(encoding=\"utf-8\"))"
      },
      {
        "title": "5. Custom Context Managers with __enter__ / __exit__ and @contextmanager",
        "theory": [
          "You can make ANY resource (database transaction, lock, network socket, timer) support the `with` statement.",
          "The Context Manager Protocol: 1) `__enter__()` is executed before entering the block; its return value is bound to the `as` variable. 2) `__exit__(exc_type, exc_val, exc_tb)` is ALWAYS called on exit, receiving exception information if an error occurred.",
          "Alternative shortcut: The `@contextmanager` decorator from `contextlib` using a generator with `yield`."
        ],
        "syntax": "from contextlib import contextmanager\nimport time\n\n# 1. Custom Timer Context Manager using generator syntax:\n@contextmanager\ndef code_timer(label: str):\n    start = time.perf_counter()\n    print(f\"[{label}] Started...\")\n    try:\n        yield  # Code inside 'with' runs here!\n    finally:\n        elapsed = time.perf_counter() - start\n        print(f\"[{label}] Completed in {elapsed:.4f} seconds.\")\n\n# Using our custom context manager:\nwith code_timer(\"Image Processing Batch\"):\n    # Simulated work\n    total = sum(i * 2 for i in range(500_000))\n    print(f\"Processed {total} items.\")",
        "tips": [
          "Use context managers to guarantee cleanup for locks (`with threading.Lock():`), database transactions (commit on success, rollback on error), and temp directories."
        ],
        "codeExample": "from contextlib import contextmanager\nimport time\n\n# 1. Custom Timer Context Manager using generator syntax:\n@contextmanager\ndef code_timer(label: str):\n    start = time.perf_counter()\n    print(f\"[{label}] Started...\")\n    try:\n        yield  # Code inside 'with' runs here!\n    finally:\n        elapsed = time.perf_counter() - start\n        print(f\"[{label}] Completed in {elapsed:.4f} seconds.\")\n\n# Using our custom context manager:\nwith code_timer(\"Image Processing Batch\"):\n    # Simulated work\n    total = sum(i * 2 for i in range(500_000))\n    print(f\"Processed {total} items.\")"
      }
    ]
  },
  {
    "id": "py-exceptions",
    "chapterNumber": 16,
    "title": "Python Exception Handling & Custom Exceptions",
    "category": "Files, Systems & Utilities",
    "shortDesc": "Complete guide to bulletproof error handling: try/except/else/finally lifecycle, exception hierarchy, custom domain exceptions, and exception chaining.",
    "overview": [
      "Exceptions are runtime events that disrupt the normal flow of program instructions when an error occurs.",
      "Real-life Analogy: Think of a car's emergency braking system or airbags. When an unavoidable road collision (error) occurs, the airbag deploys (exception handled) to safely prevent a fatal crash and allow passengers to exit calmly.",
      "Python follows the EAFP philosophy: 'Easier to Ask for Forgiveness than Permission'. Rather than testing 10 preconditions before acting, Python encourages attempting the operation in a `try` block and handling failures cleanly in `except`."
    ],
    "sections": [
      {
        "title": "1. The try ... except ... else ... finally Complete Lifecycle",
        "theory": [
          "`try`: Contains code that might raise an exception.",
          "`except ExceptionType as err`: Catches and handles specific exception types.",
          "`else`: Executes ONLY IF no exceptions were raised in the try block (ideal for code that relies on the try block's success).",
          "`finally`: ALWAYS executes, regardless of whether exceptions were raised, caught, or unhandled. Perfect for cleanup operations (closing sockets, releasing locks)."
        ],
        "syntax": "def divide_funds(total_amount: float, num_recipients: int):\n    print(f\"\\nInitiating transfer of ₹{total_amount} to {num_recipients} accounts...\")\n    try:\n        share = total_amount / num_recipients\n    except ZeroDivisionError as e:\n        print(f\"❌ Error: Cannot distribute funds to 0 recipients! ({e})\")\n    except TypeError as e:\n        print(f\"❌ Error: Invalid data types provided! ({e})\")\n    else:\n        print(f\"✅ Success: Each recipient receives ₹{share:.2f}\")\n    finally:\n        print(\"🔒 Audit Log: Transfer operation lifecycle completed.\")\n\n# Scenario A: Clean run\ndivide_funds(10000, 4)\n\n# Scenario B: Handled exception\ndivide_funds(5000, 0)",
        "tips": [
          "Keep the `try` block as small as possible. Only wrap the specific line that might fail, not entire 50-line functions."
        ],
        "codeExample": "def divide_funds(total_amount: float, num_recipients: int):\n    print(f\"\\nInitiating transfer of ₹{total_amount} to {num_recipients} accounts...\")\n    try:\n        share = total_amount / num_recipients\n    except ZeroDivisionError as e:\n        print(f\"❌ Error: Cannot distribute funds to 0 recipients! ({e})\")\n    except TypeError as e:\n        print(f\"❌ Error: Invalid data types provided! ({e})\")\n    else:\n        print(f\"✅ Success: Each recipient receives ₹{share:.2f}\")\n    finally:\n        print(\"🔒 Audit Log: Transfer operation lifecycle completed.\")\n\n# Scenario A: Clean run\ndivide_funds(10000, 4)\n\n# Scenario B: Handled exception\ndivide_funds(5000, 0)"
      },
      {
        "title": "2. The Python Exception Hierarchy & The Bare Except Anti-Pattern",
        "theory": [
          "All standard exceptions in Python inherit from `BaseException`. Standard errors (ValueError, KeyError, etc.) inherit from `Exception`.",
          "System exceptions like `KeyboardInterrupt` (Ctrl+C) and `SystemExit` inherit directly from `BaseException`, NOT `Exception`.",
          "THE BARE EXCEPT ANTI-PATTERN: Never write `except:` without an exception type! A bare except catches `KeyboardInterrupt`, preventing users or docker containers from terminating your program with Ctrl+C!"
        ],
        "syntax": "# ❌ THE DANGEROUS ANTI-PATTERN:\n# try:\n#     run_server()\n# except:\n#     pass  # Swallows Ctrl+C! Server cannot be stopped!\n\n# ✅ THE ENTERPRISE STANDARD:\ntry:\n    with open(\"config.json\") as f:\n        data = f.read()\nexcept FileNotFoundError:\n    print(\"Configuration file missing; loading fallback defaults...\")\n    data = \"{}\"\nexcept Exception as e:\n    # Catches all standard errors, but allows KeyboardInterrupt to pass through!\n    print(f\"Unexpected operational failure: {type(e).__name__} -> {e}\")",
        "table": [
          {
            "attribute": "BaseException",
            "value": "Root class",
            "description": "The root of all exceptions in Python. Subclasses include Exception, KeyboardInterrupt, SystemExit."
          },
          {
            "attribute": "Exception",
            "value": "Standard errors",
            "description": "The base class for all non-system-exiting exceptions. Custom exceptions should inherit from this."
          },
          {
            "attribute": "ValueError",
            "value": "Invalid value",
            "description": "Raised when an operation receives an argument of the right type but inappropriate value (e.g. int('abc'))."
          },
          {
            "attribute": "TypeError",
            "value": "Wrong type",
            "description": "Raised when an operation is applied to an object of inappropriate type (e.g. 'str' + 5)."
          },
          {
            "attribute": "KeyError / IndexError",
            "value": "Lookup errors",
            "description": "Raised when a mapping key or sequence index is not found."
          }
        ],
        "tips": [
          "Catch specific exceptions first before falling back to `except Exception:`. Never catch `BaseException` unless writing a global crash reporter."
        ],
        "codeExample": "# ❌ THE DANGEROUS ANTI-PATTERN:\n# try:\n#     run_server()\n# except:\n#     pass  # Swallows Ctrl+C! Server cannot be stopped!\n\n# ✅ THE ENTERPRISE STANDARD:\ntry:\n    with open(\"config.json\") as f:\n        data = f.read()\nexcept FileNotFoundError:\n    print(\"Configuration file missing; loading fallback defaults...\")\n    data = \"{}\"\nexcept Exception as e:\n    # Catches all standard errors, but allows KeyboardInterrupt to pass through!\n    print(f\"Unexpected operational failure: {type(e).__name__} -> {e}\")"
      },
      {
        "title": "3. Creating Custom Domain-Specific Exceptions",
        "theory": [
          "In real-world enterprise applications, you should create custom exceptions representing domain business rules (e.g., `InsufficientBalanceError`, `UserAlreadyExistsError`).",
          "Custom exceptions inherit from `Exception` and can include error codes, HTTP status codes, and context attributes."
        ],
        "syntax": "class BankingError(Exception):\n    \"\"\"Base exception for all banking domain errors.\"\"\"\n    pass\n\nclass InsufficientBalanceError(BankingError):\n    \"\"\"Raised when an account withdrawal exceeds available balance.\"\"\"\n    def __init__(self, current_balance: float, requested_amount: float):\n        self.current_balance = current_balance\n        self.requested_amount = requested_amount\n        self.shortfall = requested_amount - current_balance\n        message = (\n            f\"Withdrawal of ₹{requested_amount} denied. \"\n            f\"Current balance is ₹{current_balance} (Shortfall: ₹{self.shortfall}).\"\n        )\n        super().__init__(message)\n\n# Using our custom exception:\nclass BankAccount:\n    def __init__(self, balance: float):\n        self.balance = balance\n        \n    def withdraw(self, amount: float):\n        if amount > self.balance:\n            raise InsufficientBalanceError(self.balance, amount)\n        self.balance -= amount\n        return self.balance\n\naccount = BankAccount(1500.0)\ntry:\n    account.withdraw(5000.0)\nexcept InsufficientBalanceError as err:\n    print(f\"Handled Custom Error: {err}\")\n    print(f\"Customer needs ₹{err.shortfall} more to complete this transaction.\")",
        "tips": [
          "Organize custom exceptions into a hierarchy by creating a base project exception (e.g. `AppError`) so consumers can catch all application errors with a single handler."
        ],
        "codeExample": "class BankingError(Exception):\n    \"\"\"Base exception for all banking domain errors.\"\"\"\n    pass\n\nclass InsufficientBalanceError(BankingError):\n    \"\"\"Raised when an account withdrawal exceeds available balance.\"\"\"\n    def __init__(self, current_balance: float, requested_amount: float):\n        self.current_balance = current_balance\n        self.requested_amount = requested_amount\n        self.shortfall = requested_amount - current_balance\n        message = (\n            f\"Withdrawal of ₹{requested_amount} denied. \"\n            f\"Current balance is ₹{current_balance} (Shortfall: ₹{self.shortfall}).\"\n        )\n        super().__init__(message)\n\n# Using our custom exception:\nclass BankAccount:\n    def __init__(self, balance: float):\n        self.balance = balance\n        \n    def withdraw(self, amount: float):\n        if amount > self.balance:\n            raise InsufficientBalanceError(self.balance, amount)\n        self.balance -= amount\n        return self.balance\n\naccount = BankAccount(1500.0)\ntry:\n    account.withdraw(5000.0)\nexcept InsufficientBalanceError as err:\n    print(f\"Handled Custom Error: {err}\")\n    print(f\"Customer needs ₹{err.shortfall} more to complete this transaction.\")"
      },
      {
        "title": "4. Exception Chaining: raise ... from ... & traceback Preservation",
        "theory": [
          "When handling an exception and raising a new one, you often want to preserve the root cause for debugging.",
          "`raise NewException() from original_err`: Chains exceptions together, displaying 'The above exception was the direct cause of the following exception' in the terminal traceback.",
          "`raise NewException() from None`: Explicitly suppresses the original exception traceback, hiding internal details from end-users or API consumers."
        ],
        "syntax": "import json\n\nclass ConfigParseError(Exception):\n    pass\n\ndef load_settings(raw_text: str):\n    try:\n        return json.loads(raw_text)\n    except json.JSONDecodeError as err:\n        # Preserve original JSONDecodeError as the root cause:\n        raise ConfigParseError(\"Failed to parse system configuration\") from err\n\n# Demonstrating chaining:\ntry:\n    load_settings(\"INVALID_JSON_CONTENT\")\nexcept ConfigParseError as e:\n    print(f\"Caught: {e}\")\n    print(f\"Original root cause was: {type(e.__cause__).__name__}\")",
        "tips": [
          "Always use `raise ... from err` when wrapping third-party library errors into your application's domain exceptions."
        ],
        "codeExample": "import json\n\nclass ConfigParseError(Exception):\n    pass\n\ndef load_settings(raw_text: str):\n    try:\n        return json.loads(raw_text)\n    except json.JSONDecodeError as err:\n        # Preserve original JSONDecodeError as the root cause:\n        raise ConfigParseError(\"Failed to parse system configuration\") from err\n\n# Demonstrating chaining:\ntry:\n    load_settings(\"INVALID_JSON_CONTENT\")\nexcept ConfigParseError as e:\n    print(f\"Caught: {e}\")\n    print(f\"Original root cause was: {type(e.__cause__).__name__}\")"
      }
    ]
  },
  {
    "id": "py-oop",
    "chapterNumber": 17,
    "title": "Python OOP: Classes, Inheritance & Dunder Methods",
    "category": "Object-Oriented Python",
    "shortDesc": "Master Object-Oriented Programming: classes, objects, self, classmethod, staticmethod, encapsulation properties, inheritance, MRO, and magic dunder methods.",
    "overview": [
      "Object-Oriented Programming (OOP) is a programming paradigm that organizes software design around data, or objects, rather than functions and logic.",
      "Real-life Analogy: Think of an architectural blueprint for a house. The blueprint specifies rooms, doors, and wiring (The Class). When builders construct 5 houses from that single blueprint, each actual physical house is an individual Object (Instance) with its own address, paint color, and furniture.",
      "Python implements pure OOP where everything (including integers, functions, and classes themselves) is an object."
    ],
    "sections": [
      {
        "title": "1. Classes, Instances, __init__, and The Meaning of self",
        "theory": [
          "Class: The blueprint defining state (attributes) and behavior (methods).",
          "Instance: An individual object created from the class.",
          "`__init__()`: The constructor method automatically executed whenever a new instance is created.",
          "`self`: Represents the specific instance on which the method is called. When you call `car.drive()`, Python converts it to `Car.drive(car)`. It must be the first parameter of every instance method."
        ],
        "syntax": "class Car:\n    # Class attribute (shared by ALL instances):\n    wheels = 4\n\n    def __init__(self, brand: str, model: str, price: float):\n        # Instance attributes (unique to each car):\n        self.brand = brand\n        self.model = model\n        self.price = price\n        self.speed = 0\n\n    def accelerate(self, increment: int):\n        self.speed += increment\n        print(f\"{self.brand} {self.model} accelerated to {self.speed} km/h\")\n\n# Creating instances (objects)\ncar1 = Car(\"Tata\", \"Nexon EV\", 1600000)\ncar2 = Car(\"Mahindra\", \"XUV700\", 2200000)\n\ncar1.accelerate(40)\nprint(f\"{car1.brand} has {car1.wheels} wheels.\")\nprint(f\"{car2.brand} has {car2.wheels} wheels.\")",
        "tips": [
          "Instance attributes should always be initialized inside `__init__` to ensure all objects have consistent state."
        ],
        "codeExample": "class Car:\n    # Class attribute (shared by ALL instances):\n    wheels = 4\n\n    def __init__(self, brand: str, model: str, price: float):\n        # Instance attributes (unique to each car):\n        self.brand = brand\n        self.model = model\n        self.price = price\n        self.speed = 0\n\n    def accelerate(self, increment: int):\n        self.speed += increment\n        print(f\"{self.brand} {self.model} accelerated to {self.speed} km/h\")\n\n# Creating instances (objects)\ncar1 = Car(\"Tata\", \"Nexon EV\", 1600000)\ncar2 = Car(\"Mahindra\", \"XUV700\", 2200000)\n\ncar1.accelerate(40)\nprint(f\"{car1.brand} has {car1.wheels} wheels.\")\nprint(f\"{car2.brand} has {car2.wheels} wheels.\")"
      },
      {
        "title": "2. Instance vs Class (@classmethod) vs Static (@staticmethod) Methods",
        "theory": [
          "Instance Methods: Receive `self` as the first argument; can access and modify both instance state and class state.",
          "Class Methods (`@classmethod`): Receive `cls` (the class object itself) as the first argument; commonly used for alternative constructors (factory methods).",
          "Static Methods (`@staticmethod`): Do not receive `self` or `cls`; simple utility functions bound to the class namespace for logical grouping."
        ],
        "syntax": "class Employee:\n    company_name = \"TechCorp India\"\n    employee_count = 0\n\n    def __init__(self, name: str, salary: float):\n        self.name = name\n        self.salary = salary\n        Employee.employee_count += 1\n\n    # 1. Instance Method\n    def get_details(self) -> str:\n        return f\"{self.name} earns ₹{self.salary:,}/year at {self.company_name}\"\n\n    # 2. Class Method (Alternative Constructor from formatted string)\n    @classmethod\n    def from_string(cls, emp_str: str):\n        # Accepts 'Rahul-75000' and builds Employee object\n        name, salary = emp_str.split(\"-\")\n        return cls(name, float(salary))\n\n    # 3. Static Method (Utility helper with no state dependency)\n    @staticmethod\n    def is_valid_salary(salary: float) -> bool:\n        return salary >= 25000\n\n# Using instance method\nemp1 = Employee(\"Aarav\", 85000)\nprint(emp1.get_details())\n\n# Using class method factory:\nemp2 = Employee.from_string(\"Priya-120000\")\nprint(emp2.get_details())\n\n# Using static method:\nprint(\"Is 15000 valid?\", Employee.is_valid_salary(15000))  # False\nprint(\"Total staff:\", Employee.employee_count)             # 2",
        "tips": [
          "Use `@classmethod` whenever you need to create an object from JSON, CSV, or dictionary strings (e.g. `User.from_dict(payload)`)."
        ],
        "codeExample": "class Employee:\n    company_name = \"TechCorp India\"\n    employee_count = 0\n\n    def __init__(self, name: str, salary: float):\n        self.name = name\n        self.salary = salary\n        Employee.employee_count += 1\n\n    # 1. Instance Method\n    def get_details(self) -> str:\n        return f\"{self.name} earns ₹{self.salary:,}/year at {self.company_name}\"\n\n    # 2. Class Method (Alternative Constructor from formatted string)\n    @classmethod\n    def from_string(cls, emp_str: str):\n        # Accepts 'Rahul-75000' and builds Employee object\n        name, salary = emp_str.split(\"-\")\n        return cls(name, float(salary))\n\n    # 3. Static Method (Utility helper with no state dependency)\n    @staticmethod\n    def is_valid_salary(salary: float) -> bool:\n        return salary >= 25000\n\n# Using instance method\nemp1 = Employee(\"Aarav\", 85000)\nprint(emp1.get_details())\n\n# Using class method factory:\nemp2 = Employee.from_string(\"Priya-120000\")\nprint(emp2.get_details())\n\n# Using static method:\nprint(\"Is 15000 valid?\", Employee.is_valid_salary(15000))  # False\nprint(\"Total staff:\", Employee.employee_count)             # 2"
      },
      {
        "title": "3. Encapsulation: Private Attributes & @property Getters/Setters",
        "theory": [
          "Encapsulation restricts direct external access to internal object state to prevent invalid data corruption.",
          "Public: `self.name` (accessible everywhere).",
          "Protected Convention: `self._name` (single underscore signifies internal use; still accessible).",
          "Private & Name Mangling: `self.__pin` (double underscore causes CPython to rename it to `_ClassName__pin` to prevent accidental override).",
          "`@property`: Allows accessing a method like a normal attribute while executing validation logic on get and set."
        ],
        "syntax": "class BankAccount:\n    def __init__(self, owner: str, initial_balance: float):\n        self.owner = owner\n        self._balance = initial_balance  # Protected\n\n    # Getter property:\n    @property\n    def balance(self) -> float:\n        \"\"\"Read-only property access.\"\"\"\n        return self._balance\n\n    # Setter property with data validation:\n    @balance.setter\n    def balance(self, new_balance: float):\n        if new_balance < 0:\n            raise ValueError(\"Account balance cannot be negative!\")\n        self._balance = new_balance\n\nacc = BankAccount(\"Rohit\", 5000)\nprint(\"Balance:\", acc.balance)   # Calls getter like an attribute!\n\nacc.balance = 7500              # Calls setter with validation\nprint(\"Updated Balance:\", acc.balance)\n\ntry:\n    acc.balance = -100           # Raises ValueError!\nexcept ValueError as e:\n    print(f\"Validation caught: {e}\")",
        "tips": [
          "Always prefer `@property` over Java-style `getBalance()` and `setBalance()` methods for clean, idiomatic Python."
        ],
        "codeExample": "class BankAccount:\n    def __init__(self, owner: str, initial_balance: float):\n        self.owner = owner\n        self._balance = initial_balance  # Protected\n\n    # Getter property:\n    @property\n    def balance(self) -> float:\n        \"\"\"Read-only property access.\"\"\"\n        return self._balance\n\n    # Setter property with data validation:\n    @balance.setter\n    def balance(self, new_balance: float):\n        if new_balance < 0:\n            raise ValueError(\"Account balance cannot be negative!\")\n        self._balance = new_balance\n\nacc = BankAccount(\"Rohit\", 5000)\nprint(\"Balance:\", acc.balance)   # Calls getter like an attribute!\n\nacc.balance = 7500              # Calls setter with validation\nprint(\"Updated Balance:\", acc.balance)\n\ntry:\n    acc.balance = -100           # Raises ValueError!\nexcept ValueError as e:\n    print(f\"Validation caught: {e}\")"
      },
      {
        "title": "4. Inheritance, Polymorphism, super(), and MRO (C3 Linearization)",
        "theory": [
          "Inheritance enables a Child Class to inherit all attributes and methods of a Parent Class (`class Child(Parent):`).",
          "`super()`: Calls the parent class's constructor or method.",
          "Polymorphism: Different classes can implement the same method name with specialized behaviors.",
          "Method Resolution Order (MRO): The algorithm (C3 Linearization) Python uses to determine which method to invoke in multiple inheritance hierarchies. Inspect via `Class.mro()`."
        ],
        "syntax": "class PaymentProcessor:\n    def process(self, amount: float):\n        raise NotImplementedError(\"Subclasses must implement process()\")\n\nclass UPIPayment(PaymentProcessor):\n    def process(self, amount: float):\n        return f\"Processing UPI transaction of ₹{amount} via NPCI gateway.\"\n\nclass CreditCardPayment(PaymentProcessor):\n    def process(self, amount: float):\n        return f\"Processing Credit Card payment of ₹{amount} with 2% interchange fee.\"\n\n# Polymorphism in action:\ndef checkout(processor: PaymentProcessor, amount: float):\n    # Same method call works for ANY payment provider!\n    print(processor.process(amount))\n\ncheckout(UPIPayment(), 1499.0)\ncheckout(CreditCardPayment(), 4999.0)",
        "tips": [
          "Favor composition over deep inheritance trees whenever possible for simpler application architecture."
        ],
        "codeExample": "class PaymentProcessor:\n    def process(self, amount: float):\n        raise NotImplementedError(\"Subclasses must implement process()\")\n\nclass UPIPayment(PaymentProcessor):\n    def process(self, amount: float):\n        return f\"Processing UPI transaction of ₹{amount} via NPCI gateway.\"\n\nclass CreditCardPayment(PaymentProcessor):\n    def process(self, amount: float):\n        return f\"Processing Credit Card payment of ₹{amount} with 2% interchange fee.\"\n\n# Polymorphism in action:\ndef checkout(processor: PaymentProcessor, amount: float):\n    # Same method call works for ANY payment provider!\n    print(processor.process(amount))\n\ncheckout(UPIPayment(), 1499.0)\ncheckout(CreditCardPayment(), 4999.0)"
      },
      {
        "title": "5. Complete Magic Dunder Methods Reference Table",
        "theory": [
          "Dunder (Double Underscore) methods allow your custom classes to integrate with Python's built-in operators (`+`, `-`, `len()`, `str()`, `in`, `[]`)."
        ],
        "syntax": "class Vector2D:\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n\n    # __str__: Human-friendly string for print() and str()\n    def __str__(self) -> str:\n        return f\"Vector({self.x}, {self.y})\"\n\n    # __repr__: Formal representation for developers / debugging\n    def __repr__(self) -> str:\n        return f\"Vector2D(x={self.x}, y={self.y})\"\n\n    # __add__: Implements the '+' operator\n    def __add__(self, other):\n        return Vector2D(self.x + other.x, self.y + other.y)\n\n    # __eq__: Implements the '==' operator\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y\n\nv1 = Vector2D(3, 4)\nv2 = Vector2D(1, 2)\nv3 = v1 + v2   # Calls v1.__add__(v2)\nprint(\"Sum vector:\", v3)         # Vector(4, 6)\nprint(\"Equality check:\", v3 == Vector2D(4, 6))  # True",
        "table": [
          {
            "attribute": "__init__(self, ...)",
            "value": "Constructor",
            "description": "Called when the instance is initialized."
          },
          {
            "attribute": "__str__(self)",
            "value": "User display",
            "description": "Called by str(obj) and print(obj) for user-facing string."
          },
          {
            "attribute": "__repr__(self)",
            "value": "Developer display",
            "description": "Called by repr(obj) and interactive REPL. Should look like valid Python code to recreate the object."
          },
          {
            "attribute": "__len__(self)",
            "value": "int",
            "description": "Called by len(obj). Must return non-negative integer."
          },
          {
            "attribute": "__getitem__(self, key)",
            "value": "value",
            "description": "Enables square bracket indexing: obj[key]."
          },
          {
            "attribute": "__setitem__(self, key, val)",
            "value": "None",
            "description": "Enables square bracket assignment: obj[key] = val."
          },
          {
            "attribute": "__iter__(self)",
            "value": "iterator",
            "description": "Enables looping: for item in obj."
          },
          {
            "attribute": "__eq__(self, other)",
            "value": "bool",
            "description": "Implements equality comparison: obj == other."
          },
          {
            "attribute": "__add__(self, other)",
            "value": "result",
            "description": "Implements addition: obj + other."
          }
        ],
        "tips": [
          "Always implement both `__str__` and `__repr__` on classes. If only one is implemented, implement `__repr__` as Python falls back to it when `__str__` is missing."
        ],
        "codeExample": "class Vector2D:\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n\n    # __str__: Human-friendly string for print() and str()\n    def __str__(self) -> str:\n        return f\"Vector({self.x}, {self.y})\"\n\n    # __repr__: Formal representation for developers / debugging\n    def __repr__(self) -> str:\n        return f\"Vector2D(x={self.x}, y={self.y})\"\n\n    # __add__: Implements the '+' operator\n    def __add__(self, other):\n        return Vector2D(self.x + other.x, self.y + other.y)\n\n    # __eq__: Implements the '==' operator\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y\n\nv1 = Vector2D(3, 4)\nv2 = Vector2D(1, 2)\nv3 = v1 + v2   # Calls v1.__add__(v2)\nprint(\"Sum vector:\", v3)         # Vector(4, 6)\nprint(\"Equality check:\", v3 == Vector2D(4, 6))  # True"
      },
      {
        "title": "6. Modern Python Dataclasses (@dataclass)",
        "theory": [
          "Python 3.7+ introduced `@dataclass` in the `dataclasses` module to eliminate repetitive boilerplate code.",
          "A dataclass automatically generates `__init__()`, `__repr__()`, `__eq__()`, and optional comparison methods (`__lt__`, `__gt__`) based on type annotations."
        ],
        "syntax": "from dataclasses import dataclass, field\n\n@dataclass(order=True)\nclass Product:\n    # sort_index used for sorting products by price\n    sort_index: float = field(init=False, repr=False)\n    name: str\n    price: float\n    stock: int = 0\n\n    def __post_init__(self):\n        # Automatically assign sort key\n        self.sort_index = self.price\n\np1 = Product(\"Laptop\", 65000.0, 10)\np2 = Product(\"Mouse\", 800.0, 50)\n\nprint(p1)  # Product(name='Laptop', price=65000.0, stock=10)\nprint(p1 == Product(\"Laptop\", 65000.0, 10))  # True (Automatic __eq__!)\nprint(p2 < p1)  # True (Mouse is cheaper than Laptop thanks to order=True!)",
        "tips": [
          "Use `@dataclass` for any class that primarily exists to store data state."
        ],
        "codeExample": "from dataclasses import dataclass, field\n\n@dataclass(order=True)\nclass Product:\n    # sort_index used for sorting products by price\n    sort_index: float = field(init=False, repr=False)\n    name: str\n    price: float\n    stock: int = 0\n\n    def __post_init__(self):\n        # Automatically assign sort key\n        self.sort_index = self.price\n\np1 = Product(\"Laptop\", 65000.0, 10)\np2 = Product(\"Mouse\", 800.0, 50)\n\nprint(p1)  # Product(name='Laptop', price=65000.0, stock=10)\nprint(p1 == Product(\"Laptop\", 65000.0, 10))  # True (Automatic __eq__!)\nprint(p2 < p1)  # True (Mouse is cheaper than Laptop thanks to order=True!)"
      }
    ]
  },
  {
    "id": "py-regex",
    "chapterNumber": 18,
    "title": "Python Regular Expressions (re module)",
    "category": "Files, Systems & Utilities",
    "shortDesc": "Master regex patterns in Python: metacharacters, re.search vs match vs findall, named groups, greedy matching, and validation recipes.",
    "overview": [
      "A Regular Expression (Regex) is a specialized sequence of characters that forms a search pattern to match, validate, or transform text.",
      "Real-life Analogy: Think of a metal detector at an airport security checkpoint calibrated specifically to detect metallic objects while ignoring cloth and leather. Regex scans through millions of characters of messy text and detects only patterns that match your exact blueprint.",
      "Python provides the powerful standard library module `re` for regex operations. Always use raw strings (`r\"pattern\"`) to avoid backslash escaping clashes."
    ],
    "sections": [
      {
        "title": "1. The re Module & The Mandatory Raw String (r\"\") Rule",
        "theory": [
          "In normal Python strings, `\\n` is a newline and `\\t` is a tab. In regex, `\\d` means digit and `\\b` means word boundary.",
          "If you don't use raw strings (`r\"...\"`), Python's string parser attempts to escape backslashes before the regex engine even sees them!",
          "Rule: ALWAYS prefix regex patterns with `r`: `r'\\d{3}-\\d{4}'`."
        ],
        "syntax": "import re\n\n# ❌ BAD: Normal string requires double escaping: \"\\\\d+\"\n# ✅ GOOD: Raw string preserves literal backslashes for regex:\npattern = r\"\\d{3}-\\d{3}-\\d{4}\"  # Matches US phone format\n\ntext = \"Call customer support at 800-555-0199 or 888-555-0123.\"\nmatch = re.search(pattern, text)\n\nif match:\n    print(f\"Found phone number: '{match.group()}' at index {match.start()}-{match.end()}\")",
        "tips": [
          "Never write regex patterns as plain strings; always use `r'...'` raw string literals."
        ],
        "codeExample": "import re\n\n# ❌ BAD: Normal string requires double escaping: \"\\\\d+\"\n# ✅ GOOD: Raw string preserves literal backslashes for regex:\npattern = r\"\\d{3}-\\d{3}-\\d{4}\"  # Matches US phone format\n\ntext = \"Call customer support at 800-555-0199 or 888-555-0123.\"\nmatch = re.search(pattern, text)\n\nif match:\n    print(f\"Found phone number: '{match.group()}' at index {match.start()}-{match.end()}\")"
      },
      {
        "title": "2. Key re Functions: search() vs match() vs findall() vs sub()",
        "theory": [
          "`re.match()`: Checks for a match ONLY at the beginning of the string.",
          "`re.search()`: Scans through the ENTIRE string for the FIRST location where the pattern matches.",
          "`re.findall()`: Returns ALL non-overlapping matches in the string as a list of strings.",
          "`re.finditer()`: Returns an iterator yielding `Match` objects (memory-efficient for large text).",
          "`re.sub()`: Replaces occurrences of the pattern with a replacement string."
        ],
        "syntax": "import re\n\ntext = \"Price: ₹150, Tax: ₹27, Total: ₹177\"\n\n# 1. findall(): Extract all price amounts\namounts = re.findall(r\"₹(\\d+)\", text)\nprint(\"Extracted amounts:\", amounts)  # ['150', '27', '177']\n\n# 2. sub(): Mask sensitive numbers with '***'\nmasked_text = re.sub(r\"\\d+\", \"***\", text)\nprint(\"Masked text:\", masked_text)  # \"Price: ₹***, Tax: ₹***, Total: ₹***\"\n\n# 3. match() vs search():\nprint(\"match at start?\", re.match(r\"Price\", text) is not None)  # True\nprint(\"match at start for Tax?\", re.match(r\"Tax\", text) is not None)  # False (Tax is not at index 0!)\nprint(\"search anywhere for Tax?\", re.search(r\"Tax\", text) is not None) # True",
        "tips": [
          "Use `re.compile(pattern)` when running the same regex thousands of times in a loop to pre-compile the state machine and boost performance."
        ],
        "codeExample": "import re\n\ntext = \"Price: ₹150, Tax: ₹27, Total: ₹177\"\n\n# 1. findall(): Extract all price amounts\namounts = re.findall(r\"₹(\\d+)\", text)\nprint(\"Extracted amounts:\", amounts)  # ['150', '27', '177']\n\n# 2. sub(): Mask sensitive numbers with '***'\nmasked_text = re.sub(r\"\\d+\", \"***\", text)\nprint(\"Masked text:\", masked_text)  # \"Price: ₹***, Tax: ₹***, Total: ₹***\"\n\n# 3. match() vs search():\nprint(\"match at start?\", re.match(r\"Price\", text) is not None)  # True\nprint(\"match at start for Tax?\", re.match(r\"Tax\", text) is not None)  # False (Tax is not at index 0!)\nprint(\"search anywhere for Tax?\", re.search(r\"Tax\", text) is not None) # True"
      },
      {
        "title": "3. Metacharacters & Quantifiers Reference Table",
        "theory": [
          "Metacharacters are characters with special meaning in regex syntax."
        ],
        "syntax": "import re\n# Match any word starting with capital letter:\nwords = re.findall(r\"\\b[A-Z][a-z]+\\b\", \"Hello World this is Python Regex\")\nprint(\"Capitalized words:\", words)  # ['Hello', 'World', 'Python', 'Regex']",
        "table": [
          {
            "attribute": "\\d",
            "value": "Digit",
            "description": "Matches any decimal digit [0-9]."
          },
          {
            "attribute": "\\D",
            "value": "Non-digit",
            "description": "Matches any non-digit character."
          },
          {
            "attribute": "\\w",
            "value": "Word char",
            "description": "Matches alphanumeric characters and underscore [a-zA-Z0-9_]."
          },
          {
            "attribute": "\\s",
            "value": "Whitespace",
            "description": "Matches spaces, tabs, newlines [ \\t\\n\\r\\f\\v]."
          },
          {
            "attribute": "^ / $",
            "value": "Anchors",
            "description": "^ matches start of string; $ matches end of string."
          },
          {
            "attribute": "+",
            "value": "1 or more",
            "description": "Matches one or more repetitions of preceding token (Greedy)."
          },
          {
            "attribute": "*",
            "value": "0 or more",
            "description": "Matches zero or more repetitions of preceding token."
          },
          {
            "attribute": "?",
            "value": "Optional / Lazy",
            "description": "Matches 0 or 1 repetition; or makes a quantifier lazy when appended (*?)."
          }
        ],
        "tips": [
          "Add `?` after quantifiers like `.*?` to make them lazy (match the shortest possible sequence) instead of greedy."
        ],
        "codeExample": "import re\n# Match any word starting with capital letter:\nwords = re.findall(r\"\\b[A-Z][a-z]+\\b\", \"Hello World this is Python Regex\")\nprint(\"Capitalized words:\", words)  # ['Hello', 'World', 'Python', 'Regex']"
      },
      {
        "title": "4. Real-World Validation Recipes (Email, URL, Indian Mobile)",
        "theory": [
          "Production-ready patterns for standard data validation."
        ],
        "syntax": "import re\n\n# 1. Indian 10-digit mobile number (+91 or starting with 6,7,8,9)\nphone_pattern = r\"^(?:\\+91[\\-\\s]?)?[6-9]\\d{9}$\"\n\n# 2. RFC 5322 simplified Email pattern\nemail_pattern = r\"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\"\n\ndef validate(val: str, pattern: str, label: str):\n    is_valid = bool(re.match(pattern, val.strip()))\n    status = \"✅ Valid\" if is_valid else \"❌ Invalid\"\n    print(f\"{label} '{val}': {status}\")\n\nvalidate(\"9876543210\", phone_pattern, \"Phone\")\nvalidate(\"+91 9123456789\", phone_pattern, \"Phone\")\nvalidate(\"user.name+tag@company.co.in\", email_pattern, \"Email\")\nvalidate(\"invalid-email@domain\", email_pattern, \"Email\")",
        "tips": [
          "Always test your regex patterns on regex101.com before deploying them to production to catch edge-case bugs."
        ],
        "codeExample": "import re\n\n# 1. Indian 10-digit mobile number (+91 or starting with 6,7,8,9)\nphone_pattern = r\"^(?:\\+91[\\-\\s]?)?[6-9]\\d{9}$\"\n\n# 2. RFC 5322 simplified Email pattern\nemail_pattern = r\"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\"\n\ndef validate(val: str, pattern: str, label: str):\n    is_valid = bool(re.match(pattern, val.strip()))\n    status = \"✅ Valid\" if is_valid else \"❌ Invalid\"\n    print(f\"{label} '{val}': {status}\")\n\nvalidate(\"9876543210\", phone_pattern, \"Phone\")\nvalidate(\"+91 9123456789\", phone_pattern, \"Phone\")\nvalidate(\"user.name+tag@company.co.in\", email_pattern, \"Email\")\nvalidate(\"invalid-email@domain\", email_pattern, \"Email\")"
      }
    ]
  },
  {
    "id": "py-databases",
    "chapterNumber": 19,
    "title": "Python Database Access (sqlite3 & SQL Injection Prevention)",
    "category": "Databases & Web APIs",
    "shortDesc": "Complete database programming guide: PEP 249 DB-API 2.0, sqlite3 CRUD operations, parameterized queries to stop SQL injection, transactions, and SQLAlchemy.",
    "overview": [
      "Python connects to relational databases (PostgreSQL, MySQL, SQLite, Oracle) using the standardized Python Database API Specification v2.0 (PEP 249).",
      "Real-life Analogy: Think of a bank cashier window. You don't walk into the secure bank vault yourself (Database); you hand a deposit slip (SQL Query) to the teller (Cursor), who verifies and executes the operation, updates the ledger, and returns a printed receipt (Result set).",
      "The golden rule of database programming: NEVER concatenate user input strings into SQL queries. Always use parameterized queries (`?` or `%s`) to eliminate SQL Injection attacks."
    ],
    "sections": [
      {
        "title": "1. The DB-API 2.0 Standard & sqlite3 Basics",
        "theory": [
          "Python comes with built-in zero-configuration database support via the `sqlite3` standard library module.",
          "DB-API Workflow: 1) `connect()` to database file -> 2) Create a `cursor()` object -> 3) `cursor.execute(sql)` -> 4) `conn.commit()` to persist mutations -> 5) `conn.close()`."
        ],
        "syntax": "import sqlite3\n\n# 1. Connect to an in-memory database or disk file:\nconn = sqlite3.connect(\":memory:\")  # Fast in-memory database for testing\ncursor = conn.cursor()\n\n# 2. Create users table\ncursor.execute(\"\"\"\nCREATE TABLE users (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    username TEXT NOT NULL UNIQUE,\n    email TEXT NOT NULL,\n    balance REAL DEFAULT 0.0\n);\n\"\"\")\nconn.commit()\nprint(\"Database and 'users' table created successfully.\")",
        "tips": [
          "Use `:memory:` for unit tests to avoid disk I/O overhead and ensure completely clean test environments."
        ],
        "codeExample": "import sqlite3\n\n# 1. Connect to an in-memory database or disk file:\nconn = sqlite3.connect(\":memory:\")  # Fast in-memory database for testing\ncursor = conn.cursor()\n\n# 2. Create users table\ncursor.execute(\"\"\"\nCREATE TABLE users (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    username TEXT NOT NULL UNIQUE,\n    email TEXT NOT NULL,\n    balance REAL DEFAULT 0.0\n);\n\"\"\")\nconn.commit()\nprint(\"Database and 'users' table created successfully.\")"
      },
      {
        "title": "2. The Fatal SQL Injection Flaw & Parameterized Queries",
        "theory": [
          "SQL Injection is the #1 database vulnerability. If you format strings into SQL (`f'SELECT * FROM users WHERE name = \"{user_input}\"'`), an attacker can pass `' OR 1=1 --` to bypass authentication and dump your entire database!",
          "The Defense: Parameterized Queries. You pass placeholders (`?`), and pass values separately as a tuple. The database engine treats the values as pure literal data, NEVER executable code!"
        ],
        "syntax": "import sqlite3\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE accounts (user TEXT, pin TEXT)\")\ncur.execute(\"INSERT INTO accounts VALUES ('admin', 'secret123')\")\nconn.commit()\n\n# Malicious attacker input:\nattacker_user = \"' OR '1'='1\"\nattacker_pin = \"' OR '1'='1\"\n\n# ❌ THE FATAL WAY (SQL INJECTION VULNERABLE):\n# vulnerable_sql = f\"SELECT * FROM accounts WHERE user='{attacker_user}' AND pin='{attacker_pin}'\"\n# cur.execute(vulnerable_sql) # Attacker logs in as admin!\n\n# ✅ THE SECURE ENTERPRISE WAY (Parameterized with ?):\ncur.execute(\n    \"SELECT * FROM accounts WHERE user = ? AND pin = ?\",\n    (attacker_user, attacker_pin)  # Passed as tuple parameters!\n)\nuser_found = cur.fetchone()\nprint(\"Login successful?\", user_found is not None)  # False! Injection thwarted!",
        "tips": [
          "Never use `%`, `.format()`, or f-strings to construct SQL queries. Always pass parameters via cursor placeholders."
        ],
        "codeExample": "import sqlite3\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE accounts (user TEXT, pin TEXT)\")\ncur.execute(\"INSERT INTO accounts VALUES ('admin', 'secret123')\")\nconn.commit()\n\n# Malicious attacker input:\nattacker_user = \"' OR '1'='1\"\nattacker_pin = \"' OR '1'='1\"\n\n# ❌ THE FATAL WAY (SQL INJECTION VULNERABLE):\n# vulnerable_sql = f\"SELECT * FROM accounts WHERE user='{attacker_user}' AND pin='{attacker_pin}'\"\n# cur.execute(vulnerable_sql) # Attacker logs in as admin!\n\n# ✅ THE SECURE ENTERPRISE WAY (Parameterized with ?):\ncur.execute(\n    \"SELECT * FROM accounts WHERE user = ? AND pin = ?\",\n    (attacker_user, attacker_pin)  # Passed as tuple parameters!\n)\nuser_found = cur.fetchone()\nprint(\"Login successful?\", user_found is not None)  # False! Injection thwarted!"
      },
      {
        "title": "3. Complete CRUD Operations & Row Factory",
        "theory": [
          "By default, `sqlite3` returns rows as tuples (`(1, 'Alice', 'alice@test.com')`), which requires numeric indexing (`row[1]`).",
          "Setting `conn.row_factory = sqlite3.Row` transforms rows into dictionary-like objects where columns can be accessed by name (`row['username']`)."
        ],
        "syntax": "import sqlite3\n\nconn = sqlite3.connect(\":memory:\")\nconn.row_factory = sqlite3.Row  # Enables column-name dictionary access!\ncur = conn.cursor()\n\ncur.execute(\"CREATE TABLE products (id INT, title TEXT, price REAL)\")\n\n# Bulk Insert using executemany:\nproducts = [\n    (1, \"Wireless Mouse\", 799.0),\n    (2, \"Mechanical Keyboard\", 3499.0),\n    (3, \"4K Monitor\", 24999.0)\n]\ncur.executemany(\"INSERT INTO products VALUES (?, ?, ?)\", products)\nconn.commit()\n\n# Querying rows:\ncur.execute(\"SELECT * FROM products WHERE price > ?\", (1000.0,))\nrows = cur.fetchall()\n\nprint(\"Products over ₹1000:\")\nfor r in rows:\n    print(f\"• [{r['id']}] {r['title']} - ₹{r['price']}\")",
        "tips": [
          "Use `executemany()` instead of looping `execute()` in Python when inserting thousands of rows to reduce round-trips."
        ],
        "codeExample": "import sqlite3\n\nconn = sqlite3.connect(\":memory:\")\nconn.row_factory = sqlite3.Row  # Enables column-name dictionary access!\ncur = conn.cursor()\n\ncur.execute(\"CREATE TABLE products (id INT, title TEXT, price REAL)\")\n\n# Bulk Insert using executemany:\nproducts = [\n    (1, \"Wireless Mouse\", 799.0),\n    (2, \"Mechanical Keyboard\", 3499.0),\n    (3, \"4K Monitor\", 24999.0)\n]\ncur.executemany(\"INSERT INTO products VALUES (?, ?, ?)\", products)\nconn.commit()\n\n# Querying rows:\ncur.execute(\"SELECT * FROM products WHERE price > ?\", (1000.0,))\nrows = cur.fetchall()\n\nprint(\"Products over ₹1000:\")\nfor r in rows:\n    print(f\"• [{r['id']}] {r['title']} - ₹{r['price']}\")"
      },
      {
        "title": "4. Database Transactions (Commit & Rollback Mechanics)",
        "theory": [
          "A Transaction guarantees ACID properties: Atomicity, Consistency, Isolation, Durability.",
          "In financial transfers, debiting Account A and crediting Account B MUST both succeed together. If the server crashes midway, the transaction MUST rollback to avoid money disappearing!"
        ],
        "syntax": "def transfer_money(conn, sender_id: int, receiver_id: int, amount: float):\n    cur = conn.cursor()\n    try:\n        # Start transaction\n        cur.execute(\"UPDATE accounts SET balance = balance - ? WHERE id = ?\", (amount, sender_id))\n        \n        # Simulate network or server crash:\n        # raise RuntimeError(\"Database network connection dropped!\")\n        \n        cur.execute(\"UPDATE accounts SET balance = balance + ? WHERE id = ?\", (amount, receiver_id))\n        \n        # Both operations succeeded: Commit!\n        conn.commit()\n        print(\"Transfer completed successfully!\")\n    except Exception as e:\n        # Revert all changes in this transaction:\n        conn.rollback()\n        print(f\"Transaction rolled back due to error: {e}\")",
        "tips": [
          "In production web applications with SQLAlchemy, use transaction context managers (`with session.begin():`) for automatic commit/rollback."
        ],
        "codeExample": "def transfer_money(conn, sender_id: int, receiver_id: int, amount: float):\n    cur = conn.cursor()\n    try:\n        # Start transaction\n        cur.execute(\"UPDATE accounts SET balance = balance - ? WHERE id = ?\", (amount, sender_id))\n        \n        # Simulate network or server crash:\n        # raise RuntimeError(\"Database network connection dropped!\")\n        \n        cur.execute(\"UPDATE accounts SET balance = balance + ? WHERE id = ?\", (amount, receiver_id))\n        \n        # Both operations succeeded: Commit!\n        conn.commit()\n        print(\"Transfer completed successfully!\")\n    except Exception as e:\n        # Revert all changes in this transaction:\n        conn.rollback()\n        print(f\"Transaction rolled back due to error: {e}\")"
      }
    ]
  },
  {
    "id": "py-web-frameworks",
    "chapterNumber": 20,
    "title": "Python Web: FastAPI & Flask REST APIs",
    "category": "Databases & Web APIs",
    "shortDesc": "Build modern REST APIs with Python: ASGI vs WSGI, Flask fundamentals, FastAPI automatic Swagger documentation, Pydantic type validation, and async/await.",
    "overview": [
      "Python is one of the world's most dominant languages for backend web APIs and microservices, powered by cutting-edge frameworks like FastAPI and Flask.",
      "Real-life Analogy: Think of a restaurant. The Client (browser / mobile app) is the customer sitting at the table. The API endpoint is the waiter who takes the order (HTTP Request) to the kitchen (Python backend logic / Database), and brings back the prepared meal on a tray (JSON HTTP Response).",
      "FastAPI has become the modern standard for AI and data services thanks to asynchronous ASGI concurrency, Pydantic data validation, and automatic OpenAPI (Swagger) documentation."
    ],
    "sections": [
      {
        "title": "1. WSGI vs ASGI & Synchronous vs Asynchronous Web",
        "theory": [
          "WSGI (Web Server Gateway Interface): The synchronous standard (Flask, Django 2.x). Each incoming request blocks a worker thread until completion.",
          "ASGI (Asynchronous Server Gateway Interface): The modern async standard (FastAPI, Starlette). Uses Python's `asyncio` event loop to handle tens of thousands of concurrent I/O connections on a single thread.",
          "Async/await: While waiting for database queries or third-party APIs to respond, the worker thread handles other incoming client requests instead of sitting idle."
        ],
        "table": [
          {
            "attribute": "Feature",
            "value": "Flask (WSGI)",
            "description": "FastAPI (ASGI)"
          },
          {
            "attribute": "Concurrency Model",
            "value": "Synchronous (Thread/Process workers)",
            "description": "Asynchronous (async/await event loop)"
          },
          {
            "attribute": "Request Validation",
            "value": "Manual or Marshmallow extension",
            "description": "Automatic type validation via Pydantic"
          },
          {
            "attribute": "Interactive Docs",
            "value": "Requires custom Swagger plugins",
            "description": "Built-in interactive Swagger UI (/docs)"
          },
          {
            "attribute": "Best For",
            "value": "Simple web utilities, legacy apps",
            "description": "High-performance REST APIs, AI/ML model serving"
          }
        ],
        "tips": [
          "Choose FastAPI for any new API project in 2026. Choose Flask for small personal micro-scripts."
        ],
        "codeExample": "# Example code\npass"
      },
      {
        "title": "2. Flask Fundamentals: A Minimal REST API",
        "theory": [
          "Flask is a lightweight WSGI microframework created by Armin Ronacher.",
          "Uses route decorators (`@app.route('/path')`) to bind URL endpoints to Python functions.",
          "`jsonify()`: Serializes Python dictionaries into HTTP JSON responses with appropriate headers."
        ],
        "syntax": "from flask import Flask, jsonify, request\n\napp = Flask(__name__)\n\n# In-memory database\nitems = [{\"id\": 1, \"name\": \"Python Book\", \"price\": 499}]\n\n@app.route(\"/api/items\", methods=[\"GET\"])\ndef get_items():\n    return jsonify({\"success\": True, \"data\": items}), 200\n\n@app.route(\"/api/items\", methods=[\"POST\"])\ndef add_item():\n    payload = request.get_json()\n    new_item = {\n        \"id\": len(items) + 1,\n        \"name\": payload.get(\"name\"),\n        \"price\": payload.get(\"price\")\n    }\n    items.append(new_item)\n    return jsonify({\"success\": True, \"data\": new_item}), 201\n\n# Run with: flask --app app run --port 5000",
        "tips": [
          "In Flask, always return HTTP status codes explicitly (e.g. 200 for OK, 201 for Created, 400 for Bad Request)."
        ],
        "codeExample": "from flask import Flask, jsonify, request\n\napp = Flask(__name__)\n\n# In-memory database\nitems = [{\"id\": 1, \"name\": \"Python Book\", \"price\": 499}]\n\n@app.route(\"/api/items\", methods=[\"GET\"])\ndef get_items():\n    return jsonify({\"success\": True, \"data\": items}), 200\n\n@app.route(\"/api/items\", methods=[\"POST\"])\ndef add_item():\n    payload = request.get_json()\n    new_item = {\n        \"id\": len(items) + 1,\n        \"name\": payload.get(\"name\"),\n        \"price\": payload.get(\"price\")\n    }\n    items.append(new_item)\n    return jsonify({\"success\": True, \"data\": new_item}), 201\n\n# Run with: flask --app app run --port 5000"
      },
      {
        "title": "3. FastAPI & Pydantic: Type Safety & Auto-Swagger",
        "theory": [
          "FastAPI uses Python type annotations and Pydantic models to automatically validate incoming JSON bodies, query parameters, and path variables.",
          "If a client sends an invalid integer for an ID, FastAPI automatically returns a structured 422 Unprocessable Entity error without writing any manual checks!",
          "Automatic Documentation: Visiting `http://localhost:8000/docs` renders an interactive Swagger UI to test all endpoints directly in the browser."
        ],
        "syntax": "from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel, Field\nfrom typing import Optional\n\napp = FastAPI(title=\"ConverterAll AI Backend API\", version=\"1.0.0\")\n\n# Define Pydantic Schema for Request Validation:\nclass TaskPayload(BaseModel):\n    title: str = Field(..., min_length=3, max_length=100)\n    priority: int = Field(default=1, ge=1, le=5)\n    description: Optional[str] = None\n\ntasks_db = []\n\n@app.get(\"/tasks\")\nasync def list_tasks():\n    return {\"tasks\": tasks_db}\n\n@app.post(\"/tasks\", status_code=201)\nasync def create_task(task: TaskPayload):\n    task_dict = task.model_dump()\n    task_dict[\"id\"] = len(tasks_db) + 1\n    tasks_db.append(task_dict)\n    return {\"message\": \"Task created\", \"task\": task_dict}\n\n# Run with ASGI server:\n# uvicorn main:app --reload --port 8000",
        "tips": [
          "Pydantic models eliminate thousands of lines of boilerplate manual type-checking code."
        ],
        "codeExample": "from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel, Field\nfrom typing import Optional\n\napp = FastAPI(title=\"ConverterAll AI Backend API\", version=\"1.0.0\")\n\n# Define Pydantic Schema for Request Validation:\nclass TaskPayload(BaseModel):\n    title: str = Field(..., min_length=3, max_length=100)\n    priority: int = Field(default=1, ge=1, le=5)\n    description: Optional[str] = None\n\ntasks_db = []\n\n@app.get(\"/tasks\")\nasync def list_tasks():\n    return {\"tasks\": tasks_db}\n\n@app.post(\"/tasks\", status_code=201)\nasync def create_task(task: TaskPayload):\n    task_dict = task.model_dump()\n    task_dict[\"id\"] = len(tasks_db) + 1\n    tasks_db.append(task_dict)\n    return {\"message\": \"Task created\", \"task\": task_dict}\n\n# Run with ASGI server:\n# uvicorn main:app --reload --port 8000"
      }
    ]
  },
  {
    "id": "py-django",
    "chapterNumber": 21,
    "title": "Python Web: Django Full-Stack MVT Architecture",
    "category": "Databases & Web APIs",
    "shortDesc": "Master enterprise Django: MVT architecture, Django ORM models and migrations, auto-generated admin dashboard, and Django REST Framework.",
    "overview": [
      "Django is a high-level Python web framework that follows the 'batteries-included' philosophy, providing everything needed for enterprise applications out of the box.",
      "Real-life Analogy: If FastAPI is like a high-performance sports car chassis that you customize, Django is a fully furnished, turnkey luxury penthouse. It comes with plumbing (ORM), security guards (Auth & CSRF), maintenance staff (Admin Dashboard), and climate control (Middleware) pre-installed.",
      "Django powers world-scale platforms including Instagram, Spotify, Pinterest, and Disqus."
    ],
    "sections": [
      {
        "title": "1. The Django MVT Architecture Pattern",
        "theory": [
          "Django follows the Model-View-Template (MVT) pattern, a variant of classic MVC (Model-View-Controller):",
          "Model (M): Defines your database schema and data relationships as Python classes.",
          "View (V): The controller logic that processes incoming HTTP requests, queries models, and returns templates or JSON.",
          "Template (T): The presentation layer (HTML with Django Template Language `{{ variable }}` and `{% for %}`)."
        ],
        "syntax": "# Directory layout of a standard Django project:\n# myproject/\n# │── manage.py             <- CLI utility for running tasks\n# ├── myproject/            <- Project configuration package\n# │   ├── settings.py       <- Database, middleware, apps config\n# │   ├── urls.py           <- Root URL router\n# │   └── wsgi.py           <- WSGI server entrypoint\n# └── blog/                 <- Pluggable Django App\n#     ├── models.py         <- Database ORM definitions\n#     ├── views.py          <- Business logic request handlers\n#     ├── admin.py          <- Admin panel registration\n#     └── urls.py           <- App-specific route mapping",
        "tips": [
          "In Django, a 'project' can contain multiple pluggable 'apps' (e.g. `accounts`, `billing`, `analytics`) for clean separation of concerns."
        ],
        "codeExample": "# Directory layout of a standard Django project:\n# myproject/\n# │── manage.py             <- CLI utility for running tasks\n# ├── myproject/            <- Project configuration package\n# │   ├── settings.py       <- Database, middleware, apps config\n# │   ├── urls.py           <- Root URL router\n# │   └── wsgi.py           <- WSGI server entrypoint\n# └── blog/                 <- Pluggable Django App\n#     ├── models.py         <- Database ORM definitions\n#     ├── views.py          <- Business logic request handlers\n#     ├── admin.py          <- Admin panel registration\n#     └── urls.py           <- App-specific route mapping"
      },
      {
        "title": "2. Django ORM: Models & The Migration Lifecycle",
        "theory": [
          "Django's Object-Relational Mapper (ORM) allows you to define database tables entirely in Python code without writing raw SQL `CREATE TABLE` commands.",
          "The Migration Lifecycle: 1) Edit `models.py` -> 2) Run `python manage.py makemigrations` (generates migration files) -> 3) Run `python manage.py migrate` (applies changes to SQL database)."
        ],
        "syntax": "# blog/models.py\nfrom django.db import models\nfrom django.contrib.auth.models import User\n\nclass Post(models.Model):\n    title = models.CharField(max_length=200)\n    slug = models.SlugField(unique=True)\n    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name=\"posts\")\n    content = models.TextField()\n    is_published = models.BooleanField(default=False)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    def __str__(self):\n        return self.title\n\n# CLI commands to update database:\n# python manage.py makemigrations\n# python manage.py migrate",
        "tips": [
          "Always specify `on_delete` behavior on ForeignKey fields (`models.CASCADE`, `models.SET_NULL`, or `models.PROTECT`)."
        ],
        "codeExample": "# blog/models.py\nfrom django.db import models\nfrom django.contrib.auth.models import User\n\nclass Post(models.Model):\n    title = models.CharField(max_length=200)\n    slug = models.SlugField(unique=True)\n    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name=\"posts\")\n    content = models.TextField()\n    is_published = models.BooleanField(default=False)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    def __str__(self):\n        return self.title\n\n# CLI commands to update database:\n# python manage.py makemigrations\n# python manage.py migrate"
      },
      {
        "title": "3. Django Admin: Zero-Code Enterprise CRUD Dashboard",
        "theory": [
          "One of Django's most killer features is its automatic admin interface (`/admin`), which reads your model metadata to provide an instant, secure back-office web application.",
          "Features out of the box: Search boxes, filtering sidebars, pagination, user role permissions, and audit history."
        ],
        "syntax": "# blog/admin.py\nfrom django.contrib import admin\nfrom .models import Post\n\n@admin.register(Post)\nclass PostAdmin(admin.ModelAdmin):\n    list_display = (\"title\", \"author\", \"is_published\", \"created_at\")\n    list_filter = (\"is_published\", \"created_at\")\n    search_fields = (\"title\", \"content\")\n    prepopulated_fields = {\"slug\": (\"title\",)}\n\n# Create admin superuser account via CLI:\n# python manage.py createsuperuser",
        "tips": [
          "Registering models in `admin.py` gives non-technical team members (marketing, support, operations) instant ability to manage database records safely."
        ],
        "codeExample": "# blog/admin.py\nfrom django.contrib import admin\nfrom .models import Post\n\n@admin.register(Post)\nclass PostAdmin(admin.ModelAdmin):\n    list_display = (\"title\", \"author\", \"is_published\", \"created_at\")\n    list_filter = (\"is_published\", \"created_at\")\n    search_fields = (\"title\", \"content\")\n    prepopulated_fields = {\"slug\": (\"title\",)}\n\n# Create admin superuser account via CLI:\n# python manage.py createsuperuser"
      }
    ]
  },
  {
    "id": "py-data-science",
    "chapterNumber": 22,
    "title": "Python Data Science: NumPy, Pandas & Vectorization",
    "category": "AI, ML & Data Science",
    "shortDesc": "Zero-to-hero Data Science guide: NumPy ndarrays, vectorized operations vs slow Python loops, Pandas DataFrames, indexing, cleaning, and aggregations.",
    "overview": [
      "Python is the undisputed king of Data Science and Analytics, driven by its powerhouse ecosystem: NumPy for numerical computing and Pandas for tabular data manipulation.",
      "Real-life Analogy: A standard Python list is like a loose cardboard box holding different items (books, apples, pens) scattered around. A NumPy array is an organized metallic grid of identical steel ball bearings stored contiguously in memory, allowing high-speed parallel mathematical operations.",
      "Vectorization replaces slow iterative `for` loops with optimized, pre-compiled C/Fortran SIMD CPU instructions, achieving 50x to 100x speedups."
    ],
    "sections": [
      {
        "title": "1. NumPy Essentials: Vectorization vs Slow Loops",
        "theory": [
          "NumPy (`numpy.ndarray`): Homogeneous multidimensional array stored in contiguous memory blocks.",
          "Vectorized Arithmetic: Operations applied directly to whole arrays without explicit loops.",
          "Broadcasting: Rules that allow NumPy to perform arithmetic between arrays of different compatible shapes."
        ],
        "syntax": "import numpy as np\nimport time\n\n# Create 1 million numbers\nsize = 1_000_000\npy_list = list(range(size))\nnp_arr = np.arange(size)\n\n# 1. Pure Python Loop speed test:\nt0 = time.perf_counter()\npy_result = [x * 2 for x in py_list]\nt_py = time.perf_counter() - t0\n\n# 2. NumPy Vectorized speed test:\nt0 = time.perf_counter()\nnp_result = np_arr * 2  # Vectorized one-liner!\nt_np = time.perf_counter() - t0\n\nprint(f\"Python list duration: {t_py:.4f}s\")\nprint(f\"NumPy array duration: {t_np:.4f}s\")\nprint(f\"Speedup: {t_py / t_np:.1f}x faster with NumPy!\")",
        "tips": [
          "Never write a `for` loop to do element-wise math in Python when working with arrays. Always use NumPy vectorized operations."
        ],
        "codeExample": "import numpy as np\nimport time\n\n# Create 1 million numbers\nsize = 1_000_000\npy_list = list(range(size))\nnp_arr = np.arange(size)\n\n# 1. Pure Python Loop speed test:\nt0 = time.perf_counter()\npy_result = [x * 2 for x in py_list]\nt_py = time.perf_counter() - t0\n\n# 2. NumPy Vectorized speed test:\nt0 = time.perf_counter()\nnp_result = np_arr * 2  # Vectorized one-liner!\nt_np = time.perf_counter() - t0\n\nprint(f\"Python list duration: {t_py:.4f}s\")\nprint(f\"NumPy array duration: {t_np:.4f}s\")\nprint(f\"Speedup: {t_py / t_np:.1f}x faster with NumPy!\")"
      },
      {
        "title": "2. Pandas DataFrames: Loading, Filtering & Indexing (.loc vs .iloc)",
        "theory": [
          "Pandas provides two primary data structures: `Series` (1D labeled column) and `DataFrame` (2D labeled tabular grid).",
          "`.loc[]`: Label-based indexing (selects rows and columns by name).",
          "`.iloc[]`: Integer position-based indexing (selects rows and columns by numeric 0-based indices).",
          "Boolean Masking: Filter rows using conditional expressions like `df[df['age'] > 25]`."
        ],
        "syntax": "import pandas as pd\n\n# Creating a DataFrame from raw data:\ndata = {\n    \"emp_id\": [101, 102, 103, 104, 105],\n    \"name\": [\"Aarav\", \"Bhavna\", \"Chirag\", \"Divya\", \"Eshan\"],\n    \"department\": [\"Engineering\", \"Product\", \"Engineering\", \"Marketing\", \"Product\"],\n    \"salary\": [95000, 110000, 88000, 72000, 105000]\n}\ndf = pd.DataFrame(data)\n\n# 1. Inspect data:\nprint(\"Head preview:\\n\", df.head(3))\n\n# 2. Filtering rows (Engineering dept only with salary > 90k):\ntech_high = df[(df[\"department\"] == \"Engineering\") & (df[\"salary\"] > 90000)]\nprint(\"\\nFiltered Tech Staff:\\n\", tech_high)\n\n# 3. .loc vs .iloc:\nprint(\"\\nFirst row by iloc (position 0):\\n\", df.iloc[0])\nprint(\"\\nSpecific cell (Row 2, Column 'name'):\", df.loc[2, \"name\"])",
        "tips": [
          "Always use `&` and `|` (bitwise operators) instead of `and` / `or` when combining multiple conditions in Pandas, and wrap each condition in parentheses `(cond1) & (cond2)`."
        ],
        "codeExample": "import pandas as pd\n\n# Creating a DataFrame from raw data:\ndata = {\n    \"emp_id\": [101, 102, 103, 104, 105],\n    \"name\": [\"Aarav\", \"Bhavna\", \"Chirag\", \"Divya\", \"Eshan\"],\n    \"department\": [\"Engineering\", \"Product\", \"Engineering\", \"Marketing\", \"Product\"],\n    \"salary\": [95000, 110000, 88000, 72000, 105000]\n}\ndf = pd.DataFrame(data)\n\n# 1. Inspect data:\nprint(\"Head preview:\\n\", df.head(3))\n\n# 2. Filtering rows (Engineering dept only with salary > 90k):\ntech_high = df[(df[\"department\"] == \"Engineering\") & (df[\"salary\"] > 90000)]\nprint(\"\\nFiltered Tech Staff:\\n\", tech_high)\n\n# 3. .loc vs .iloc:\nprint(\"\\nFirst row by iloc (position 0):\\n\", df.iloc[0])\nprint(\"\\nSpecific cell (Row 2, Column 'name'):\", df.loc[2, \"name\"])"
      },
      {
        "title": "3. GroupBy Aggregations & Missing Data Handling",
        "theory": [
          "The Split-Apply-Combine Strategy: `df.groupby('col')` splits data into groups, applies aggregation functions (`mean()`, `sum()`, `count()`), and combines results into a summary table.",
          "Handling missing data: `.isna()` (detect missing `NaN`), `.dropna()` (drop missing rows), and `.fillna(val)` (impute missing values)."
        ],
        "syntax": "import pandas as pd\n\n# GroupBy Aggregation: Average salary by department\ndept_summary = df.groupby(\"department\")[\"salary\"].agg([\"mean\", \"count\", \"max\"])\nprint(\"Department Analytics:\\n\", dept_summary)\n\n# Handling NaN Missing Values:\nimport numpy as np\ndf_with_nan = df.copy()\ndf_with_nan.loc[1, \"salary\"] = np.nan\n\nprint(\"\\nMissing value count:\\n\", df_with_nan.isna().sum())\n\n# Fill missing salary with department median:\ndf_filled = df_with_nan.fillna({\"salary\": df_with_nan[\"salary\"].median()})\nprint(\"\\nImputed DataFrame:\\n\", df_filled)",
        "tips": [
          "Always inspect `.isna().sum()` on raw datasets before passing them into machine learning pipelines."
        ],
        "codeExample": "import pandas as pd\n\n# GroupBy Aggregation: Average salary by department\ndept_summary = df.groupby(\"department\")[\"salary\"].agg([\"mean\", \"count\", \"max\"])\nprint(\"Department Analytics:\\n\", dept_summary)\n\n# Handling NaN Missing Values:\nimport numpy as np\ndf_with_nan = df.copy()\ndf_with_nan.loc[1, \"salary\"] = np.nan\n\nprint(\"\\nMissing value count:\\n\", df_with_nan.isna().sum())\n\n# Fill missing salary with department median:\ndf_filled = df_with_nan.fillna({\"salary\": df_with_nan[\"salary\"].median()})\nprint(\"\\nImputed DataFrame:\\n\", df_filled)"
      }
    ]
  },
  {
    "id": "py-ml-ai",
    "chapterNumber": 23,
    "title": "Python AI & Machine Learning: PyTorch & Scikit-Learn",
    "category": "AI, ML & Data Science",
    "shortDesc": "Complete machine learning and AI pipeline: Scikit-Learn classification, evaluation metrics, PyTorch tensors, autograd backpropagation, and neural networks.",
    "overview": [
      "Python is the undisputed global standard for Artificial Intelligence, Machine Learning, and Deep Learning, powering everything from recommendation algorithms to large language models like ChatGPT and Gemini.",
      "Real-life Analogy: Think of teaching a child to recognize fruits. You don't write 5,000 rules describing the exact curvature of an orange. Instead, you show 10,000 photos of apples and oranges (Training Data). The child's neural connections adjust automatically through feedback (Backpropagation) until they can instantly identify an orange they've never seen before (Inference).",
      "Scikit-Learn powers traditional tabular machine learning (regression, random forests), while PyTorch powers modern deep learning and neural networks."
    ],
    "sections": [
      {
        "title": "1. The Machine Learning Lifecycle with Scikit-Learn",
        "theory": [
          "The ML Pipeline: 1) Data Prep -> 2) Train/Test Split (evaluating generalization) -> 3) Model Instantiation -> 4) `.fit(X_train, y_train)` -> 5) `.predict(X_test)` -> 6) Metric Evaluation.",
          "Overfitting vs Underfitting: Overfitting occurs when a model memorizes the training data (noise) but fails on unseen real-world test data. Underfitting occurs when the model is too simple to capture patterns."
        ],
        "syntax": "from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score, classification_report\n\n# 1. Load classic benchmark dataset:\niris = load_iris()\nX, y = iris.data, iris.target\n\n# 2. Split data: 80% training, 20% testing\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\n# 3. Train a Random Forest model\nclf = RandomForestClassifier(n_estimators=50, random_state=42)\nclf.fit(X_train, y_train)\n\n# 4. Predict on unseen test data\ny_pred = clf.predict(X_test)\n\n# 5. Measure performance:\nacc = accuracy_score(y_test, y_pred)\nprint(f\"Model Accuracy on Test Set: {acc * 100:.2f}%\")",
        "tips": [
          "Never evaluate your machine learning model on the same data it was trained on! Always hold out an unseen test set."
        ],
        "codeExample": "from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score, classification_report\n\n# 1. Load classic benchmark dataset:\niris = load_iris()\nX, y = iris.data, iris.target\n\n# 2. Split data: 80% training, 20% testing\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\n# 3. Train a Random Forest model\nclf = RandomForestClassifier(n_estimators=50, random_state=42)\nclf.fit(X_train, y_train)\n\n# 4. Predict on unseen test data\ny_pred = clf.predict(X_test)\n\n# 5. Measure performance:\nacc = accuracy_score(y_test, y_pred)\nprint(f\"Model Accuracy on Test Set: {acc * 100:.2f}%\")"
      },
      {
        "title": "2. PyTorch Deep Learning: Tensors, CUDA & Autograd",
        "theory": [
          "PyTorch is the world's most popular deep learning framework created by Meta AI.",
          "Tensors: Multi-dimensional arrays similar to NumPy, but capable of running on NVIDIA GPUs (`cuda`) or Apple Silicon (`mps`) for massive hardware acceleration.",
          "Autograd: PyTorch's automatic differentiation engine. When you perform mathematical operations on tensors with `requires_grad=True`, PyTorch dynamically constructs a computational graph and computes gradients automatically with `.backward()`."
        ],
        "syntax": "import torch\n\n# 1. Tensor creation & GPU availability check:\ndevice = \"cuda\" if torch.cuda.is_available() else \"cpu\"\nprint(\"Running PyTorch on device:\", device)\n\n# 2. Tensor with automatic gradient tracking (Autograd)\nx = torch.tensor(3.0, requires_grad=True)\ny = x ** 2 + 5 * x + 10  # y = x^2 + 5x + 10\n\n# Compute derivative dy/dx:\n# dy/dx = 2x + 5. At x = 3, dy/dx = 2(3) + 5 = 11.\ny.backward()\n\nprint(\"Computed gradient dy/dx at x=3:\", x.grad.item())  # 11.0",
        "tips": [
          "Autograd is the core engine behind backpropagation in every deep neural network and large language model."
        ],
        "codeExample": "import torch\n\n# 1. Tensor creation & GPU availability check:\ndevice = \"cuda\" if torch.cuda.is_available() else \"cpu\"\nprint(\"Running PyTorch on device:\", device)\n\n# 2. Tensor with automatic gradient tracking (Autograd)\nx = torch.tensor(3.0, requires_grad=True)\ny = x ** 2 + 5 * x + 10  # y = x^2 + 5x + 10\n\n# Compute derivative dy/dx:\n# dy/dx = 2x + 5. At x = 3, dy/dx = 2(3) + 5 = 11.\ny.backward()\n\nprint(\"Computed gradient dy/dx at x=3:\", x.grad.item())  # 11.0"
      },
      {
        "title": "3. Building a Neural Network with PyTorch nn.Module",
        "theory": [
          "In PyTorch, custom neural network architectures subclass `torch.nn.Module`.",
          "Two required methods: 1) `__init__()` (define layers: Linear, Conv2d, ReLU), 2) `forward(x)` (define computation path when data flows forward through the network)."
        ],
        "syntax": "import torch\nimport torch.nn as nn\n\nclass SimpleMLP(nn.Module):\n    def __init__(self, input_dim: int, hidden_dim: int, output_dim: int):\n        super().__init__()\n        # Layer 1: Input to Hidden\n        self.fc1 = nn.Linear(input_dim, hidden_dim)\n        self.relu = nn.ReLU()\n        # Layer 2: Hidden to Output\n        self.fc2 = nn.Linear(hidden_dim, output_dim)\n\n    def forward(self, x):\n        out = self.fc1(x)\n        out = self.relu(out)\n        out = self.fc2(out)\n        return out\n\n# Instantiate model: 4 inputs -> 16 hidden neurons -> 3 classes\nmodel = SimpleMLP(input_dim=4, hidden_dim=16, output_dim=3)\nprint(\"Neural Network Architecture:\\n\", model)\n\n# Forward pass with random batch of 5 samples:\ndummy_input = torch.randn(5, 4)\npredictions = model(dummy_input)\nprint(\"Output logits shape:\", predictions.shape)  # torch.Size([5, 3])",
        "tips": [
          "PyTorch's dynamic computational graph makes debugging neural networks feel just like normal Python debugging."
        ],
        "codeExample": "import torch\nimport torch.nn as nn\n\nclass SimpleMLP(nn.Module):\n    def __init__(self, input_dim: int, hidden_dim: int, output_dim: int):\n        super().__init__()\n        # Layer 1: Input to Hidden\n        self.fc1 = nn.Linear(input_dim, hidden_dim)\n        self.relu = nn.ReLU()\n        # Layer 2: Hidden to Output\n        self.fc2 = nn.Linear(hidden_dim, output_dim)\n\n    def forward(self, x):\n        out = self.fc1(x)\n        out = self.relu(out)\n        out = self.fc2(out)\n        return out\n\n# Instantiate model: 4 inputs -> 16 hidden neurons -> 3 classes\nmodel = SimpleMLP(input_dim=4, hidden_dim=16, output_dim=3)\nprint(\"Neural Network Architecture:\\n\", model)\n\n# Forward pass with random batch of 5 samples:\ndummy_input = torch.randn(5, 4)\npredictions = model(dummy_input)\nprint(\"Output logits shape:\", predictions.shape)  # torch.Size([5, 3])"
      }
    ]
  },
  {
    "id": "py-interviews",
    "chapterNumber": 24,
    "title": "Top 100 Python Interview Questions & Answers",
    "category": "Interview Preparation",
    "shortDesc": "High-frequency Python interview questions: GIL, garbage collection, memory management, generators, metaclasses, and coding challenges.",
    "overview": [
      "Cracking Python technical interviews requires not just knowing syntax, but mastering CPython internals, memory management, concurrency tradeoffs, and algorithmic problem-solving.",
      "Real-life Analogy: Knowing syntax is like being able to read road signs; mastering interview internals is like knowing how the internal combustion engine converts fuel into torque. Senior engineering interviewers specifically probe for this internal depth.",
      "This chapter covers the most frequent theoretical questions, architectural gotchas, and live coding challenges asked at top tech companies."
    ],
    "sections": [
      {
        "title": "1. The Global Interpreter Lock (GIL) Demystified",
        "theory": [
          "What is the GIL? The GIL (Global Interpreter Lock) is a mutual exclusion lock used by CPython to prevent multiple native OS threads from executing Python bytecode simultaneously.",
          "Why does it exist? CPython's memory management uses reference counting. Without the GIL, concurrent threads could corrupt reference counters and crash memory.",
          "CPU-bound vs I/O-bound: For I/O-bound tasks (web requests, database calls), multithreading works well because threads release the GIL while waiting. For CPU-bound tasks (math, encryption), multithreading DOES NOT speed up Python; you must use `multiprocessing` to run multiple independent Python processes across multiple CPU cores!"
        ],
        "syntax": "# CPU-bound tasks require multiprocessing to bypass GIL:\nimport multiprocessing\nimport os\n\ndef cpu_heavy_worker(number):\n    print(f\"Worker running on Process ID (PID): {os.getpid()}\")\n    return sum(i * i for i in range(number))\n\nif __name__ == \"__main__\":\n    # Spawns separate processes with independent memory and independent GILs!\n    with multiprocessing.Pool() as pool:\n        results = pool.map(cpu_heavy_worker, [1_000_000, 2_000_000, 3_000_000])\n        print(\"Results computed:\", len(results))",
        "tips": [
          "Python 3.13 introduces experimental free-threaded CPython (PEP 703) to disable the GIL, which is paving the future for true multi-threaded Python."
        ],
        "codeExample": "# CPU-bound tasks require multiprocessing to bypass GIL:\nimport multiprocessing\nimport os\n\ndef cpu_heavy_worker(number):\n    print(f\"Worker running on Process ID (PID): {os.getpid()}\")\n    return sum(i * i for i in range(number))\n\nif __name__ == \"__main__\":\n    # Spawns separate processes with independent memory and independent GILs!\n    with multiprocessing.Pool() as pool:\n        results = pool.map(cpu_heavy_worker, [1_000_000, 2_000_000, 3_000_000])\n        print(\"Results computed:\", len(results))"
      },
      {
        "title": "2. Memory Management: Reference Counting & Cyclic GC",
        "theory": [
          "Primary Mechanism (Reference Counting): Every Python object maintains `ob_refcnt`. Whenever a reference to an object is created, the count increments; when a reference goes out of scope or is deleted, it decrements. When `ob_refcnt == 0`, the memory is deallocated INSTANTLY.",
          "The Cyclic Reference Problem: What if Object A points to Object B, and Object B points to Object A? Their ref counts never hit zero even when unreachable!",
          "Secondary Mechanism (Cyclic Garbage Collector): A generational garbage collector (Generations 0, 1, 2) that periodically scans for isolated reference cycles and frees them."
        ],
        "syntax": "import sys\nimport gc\n\n# 1. Reference counting demonstration:\nx = [1, 2, 3]\nprint(\"Ref count:\", sys.getrefcount(x))  # 2 (x + getrefcount argument)\n\ny = x\nprint(\"Ref count after y=x:\", sys.getrefcount(x))  # 3\n\ndel y\nprint(\"Ref count after del y:\", sys.getrefcount(x)) # 2\n\n# 2. Inspecting Garbage Collector generations:\nprint(\"GC generation counts:\", gc.get_count())",
        "tips": [
          "Use the `weakref` module when creating caches or observer patterns to avoid circular references and memory leaks."
        ],
        "codeExample": "import sys\nimport gc\n\n# 1. Reference counting demonstration:\nx = [1, 2, 3]\nprint(\"Ref count:\", sys.getrefcount(x))  # 2 (x + getrefcount argument)\n\ny = x\nprint(\"Ref count after y=x:\", sys.getrefcount(x))  # 3\n\ndel y\nprint(\"Ref count after del y:\", sys.getrefcount(x)) # 2\n\n# 2. Inspecting Garbage Collector generations:\nprint(\"GC generation counts:\", gc.get_count())"
      },
      {
        "title": "3. Generators & Memory-Safe 'yield' vs 'return'",
        "theory": [
          "A Generator is a special type of function that returns an iterator, producing items one at a time on-demand using the `yield` statement.",
          "Difference from return: `return` sends a value and terminates the function completely. `yield` pauses the function, saves its entire execution state and local variables, and resumes from that exact point when `next()` is called again.",
          "Memory Advantage: Generating a 10-billion item sequence with a list consumes 80 gigabytes of RAM. A generator consumes under 150 bytes because only ONE item exists in memory at any given moment!"
        ],
        "syntax": "import sys\n\n# 1. Memory comparison: List vs Generator\n# List comprehension allocates ALL numbers in RAM:\nlist_comp = [i for i in range(100_000)]\n# Generator expression allocates ZERO items upfront (Lazy evaluation!):\ngen_exp = (i for i in range(100_000))\n\nprint(f\"List in RAM:      {sys.getsizeof(list_comp):,} bytes\")  # ~800,000 bytes\nprint(f\"Generator in RAM: {sys.getsizeof(gen_exp):,} bytes\")   # ~104 bytes!\n\n# 2. Custom Generator Function with yield\ndef countdown(start: int):\n    print(\"Countdown initiated...\")\n    while start > 0:\n        yield start\n        start -= 1\n    print(\"Blastoff! 🚀\")\n\nfor count in countdown(3):\n    print(f\"T-minus {count}\")",
        "tips": [
          "Always use generators when processing huge CSV files, streaming network logs, or infinite mathematical sequences."
        ],
        "codeExample": "import sys\n\n# 1. Memory comparison: List vs Generator\n# List comprehension allocates ALL numbers in RAM:\nlist_comp = [i for i in range(100_000)]\n# Generator expression allocates ZERO items upfront (Lazy evaluation!):\ngen_exp = (i for i in range(100_000))\n\nprint(f\"List in RAM:      {sys.getsizeof(list_comp):,} bytes\")  # ~800,000 bytes\nprint(f\"Generator in RAM: {sys.getsizeof(gen_exp):,} bytes\")   # ~104 bytes!\n\n# 2. Custom Generator Function with yield\ndef countdown(start: int):\n    print(\"Countdown initiated...\")\n    while start > 0:\n        yield start\n        start -= 1\n    print(\"Blastoff! 🚀\")\n\nfor count in countdown(3):\n    print(f\"T-minus {count}\")"
      },
      {
        "title": "4. Top 10 Core Python Interview Questions Quick-Fire",
        "theory": [
          "High-impact questions every candidate should be ready to answer clearly."
        ],
        "table": [
          {
            "attribute": "1. Mutable vs Immutable",
            "value": "Fundamental",
            "description": "Immutable (int, float, str, tuple, frozenset) cannot be changed in-place. Mutable (list, dict, set) can be mutated."
          },
          {
            "attribute": "2. deepcopy vs copy",
            "value": "Memory",
            "description": "copy() creates a new collection but references nested inner objects. deepcopy() recursively clones all nested objects."
          },
          {
            "attribute": "3. *args & **kwargs",
            "value": "Signatures",
            "description": "*args collects arbitrary positional arguments as a tuple; **kwargs collects arbitrary keyword arguments as a dictionary."
          },
          {
            "attribute": "4. __init__ vs __new__",
            "value": "OOP Internals",
            "description": "__new__ is the actual constructor that creates and returns the object instance; __init__ is the initializer that configures attributes."
          },
          {
            "attribute": "5. Monkeys Patching",
            "value": "Runtime",
            "description": "Dynamically modifying a module or class attribute at runtime (commonly used in testing to mock dependencies)."
          }
        ],
        "tips": [
          "In technical interviews, always explain the 'why' (e.g. why strings are immutable for hash table security and performance) rather than just stating the rule."
        ],
        "codeExample": "# Example code\npass"
      }
    ]
  }
];

export const ALL_RICH_PYTHON_TOPICS: W3TopicItem[] = [
  {
    "id": "sec-basics",
    "name": "Python Fundamentals",
    "isHeader": true,
    "chapterRefId": "py-overview"
  },
  {
    "id": "py-overview-topic",
    "name": "1. Python Overview & Engine",
    "chapterRefId": "py-overview",
    "hasArrow": true
  },
  {
    "id": "py-env-topic",
    "name": "2. Environment & Virtualenv",
    "chapterRefId": "py-environment",
    "hasArrow": true
  },
  {
    "id": "py-syntax-topic",
    "name": "3. Basic Syntax & PEP 8",
    "chapterRefId": "py-syntax",
    "hasArrow": true
  },
  {
    "id": "py-variables-topic",
    "name": "4. Variables & Memory Model",
    "chapterRefId": "py-variables",
    "hasArrow": true
  },
  {
    "id": "py-operators-topic",
    "name": "5. Operators & Truth Tables",
    "chapterRefId": "py-operators",
    "hasArrow": true
  },
  {
    "id": "sec-control",
    "name": "Control Flow",
    "isHeader": true,
    "chapterRefId": "py-decision"
  },
  {
    "id": "py-decision-topic",
    "name": "6. Decision Making & Match",
    "chapterRefId": "py-decision",
    "hasArrow": true
  },
  {
    "id": "py-loops-topic",
    "name": "7. Loops: while, for, else",
    "chapterRefId": "py-loops",
    "hasArrow": true
  },
  {
    "id": "sec-ds",
    "name": "Data Structures",
    "isHeader": true,
    "chapterRefId": "py-strings"
  },
  {
    "id": "py-strings-topic",
    "name": "8. Strings & All Methods",
    "chapterRefId": "py-strings",
    "hasArrow": true
  },
  {
    "id": "py-lists-topic",
    "name": "9. Lists & All Methods",
    "chapterRefId": "py-lists",
    "hasArrow": true
  },
  {
    "id": "py-tuples-topic",
    "name": "10. Tuples & NamedTuples",
    "chapterRefId": "py-tuples",
    "hasArrow": true
  },
  {
    "id": "py-dict-topic",
    "name": "11. Dictionary & Hash Maps",
    "chapterRefId": "py-dict",
    "hasArrow": true
  },
  {
    "id": "py-sets-topic",
    "name": "12. Sets & Set Theory",
    "chapterRefId": "py-sets",
    "hasArrow": true
  },
  {
    "id": "sec-funcs",
    "name": "Functions & Modules",
    "isHeader": true,
    "chapterRefId": "py-functions"
  },
  {
    "id": "py-functions-topic",
    "name": "13. Functions, *args, **kwargs",
    "chapterRefId": "py-functions",
    "hasArrow": true
  },
  {
    "id": "py-closures-topic",
    "name": "14. Scope, Closures & Decorators",
    "chapterRefId": "py-scope-closures",
    "hasArrow": true
  },
  {
    "id": "sec-io",
    "name": "Files & System",
    "isHeader": true,
    "chapterRefId": "py-files"
  },
  {
    "id": "py-files-topic",
    "name": "15. File I/O & Context Managers",
    "chapterRefId": "py-files",
    "hasArrow": true
  },
  {
    "id": "py-exceptions-topic",
    "name": "16. Exception Handling",
    "chapterRefId": "py-exceptions",
    "hasArrow": true
  },
  {
    "id": "sec-oop",
    "name": "OOP & Architecture",
    "isHeader": true,
    "chapterRefId": "py-oop"
  },
  {
    "id": "py-oop-topic",
    "name": "17. Classes, OOP & Dunder Methods",
    "chapterRefId": "py-oop",
    "hasArrow": true
  },
  {
    "id": "py-regex-topic",
    "name": "18. Regular Expressions (re)",
    "chapterRefId": "py-regex",
    "hasArrow": true
  },
  {
    "id": "sec-data",
    "name": "Persistence & APIs",
    "isHeader": true,
    "chapterRefId": "py-databases"
  },
  {
    "id": "py-db-topic",
    "name": "19. SQLite3 & Parameterized SQL",
    "chapterRefId": "py-databases",
    "hasArrow": true
  },
  {
    "id": "py-web-topic",
    "name": "20. REST APIs: FastAPI & Flask",
    "chapterRefId": "py-web-frameworks",
    "hasArrow": true
  },
  {
    "id": "py-django-topic",
    "name": "21. Django Full-Stack MVT",
    "chapterRefId": "py-django",
    "hasArrow": true
  },
  {
    "id": "sec-ai",
    "name": "Data Science & AI",
    "isHeader": true,
    "chapterRefId": "py-data-science"
  },
  {
    "id": "py-datascience-topic",
    "name": "22. NumPy & Pandas Analytics",
    "chapterRefId": "py-data-science",
    "hasArrow": true
  },
  {
    "id": "py-ml-topic",
    "name": "23. PyTorch Deep Learning & ML",
    "chapterRefId": "py-ml-ai",
    "hasArrow": true
  },
  {
    "id": "sec-interview",
    "name": "Interview Preparation",
    "isHeader": true,
    "chapterRefId": "py-interviews"
  },
  {
    "id": "py-interview-topic",
    "name": "24. Top 100 Python Q&A",
    "chapterRefId": "py-interviews",
    "hasArrow": true
  }
];
