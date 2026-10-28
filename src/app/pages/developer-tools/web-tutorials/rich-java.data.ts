import { RichTutorialChapter, W3TopicItem } from './rich-tutorial.models';

export const ALL_RICH_JAVA_CHAPTERS: RichTutorialChapter[] = [
  {
    "id": "java-overview",
    "chapterNumber": 1,
    "title": "Java Overview & JVM Architecture",
    "category": "Java Fundamentals",
    "shortDesc": "Write Once Run Anywhere (WORA), JVM execution pipeline, JIT compiler, JDK vs JRE vs JVM.",
    "overview": [
      "Java is a high-level, class-based, object-oriented programming language designed by James Gosling at Sun Microsystems in 1995 (now owned by Oracle).",
      "Java's defining characteristic is WORA (Write Once, Run Anywhere): compiled Java Bytecode (.class) executes on any operating system equipped with a compatible Java Virtual Machine (JVM).",
      "The JVM features automatic Garbage Collection, strong type safety, memory isolation, and a dynamic Just-In-Time (JIT) compiler."
    ],
    "sections": [
      {
        "title": "JDK, JRE & JVM Architecture Breakdown",
        "theory": [
          "JVM (Java Virtual Machine): An abstract computing machine that executes compiled Java bytecode instructions.",
          "JRE (Java Runtime Environment): JVM + Core Class Libraries (`rt.jar`, java.base) required to RUN Java applications.",
          "JDK (Java Development Kit): JRE + Development Tools (`javac` compiler, `javap` disassembler, `jconsole`, debugger) required to COMPILE and develop Java code.",
          "JIT (Just-In-Time) Compiler: Identifies frequently executed 'hotspots' in bytecode and compiles them directly into native CPU machine code at runtime for near-C++ execution speed."
        ],
        "table": [
          {
            "attribute": "JDK",
            "value": "Development Kit",
            "description": "Includes javac, JVM, core runtime libraries, and development tools."
          },
          {
            "attribute": "JRE",
            "value": "Runtime Environment",
            "description": "Provides the JVM and standard libraries needed solely to run existing applications."
          },
          {
            "attribute": "JVM",
            "value": "Virtual Machine",
            "description": "Stack-based virtual processor that interprets bytecode and runs the JIT compiler."
          },
          {
            "attribute": "JIT Compiler",
            "value": "Execution Engine",
            "description": "Compiles recurring bytecode hotspots into native machine instructions at runtime."
          }
        ],
        "codeExample": "// Java System Diagnostics & Runtime Inspection\npublic class SystemDiagnostics {\n    public static void main(String[] args) {\n        Runtime rt = Runtime.getRuntime();\n        System.out.println(\"Java Version: \" + System.getProperty(\"java.version\"));\n        System.out.println(\"Java Vendor: \" + System.getProperty(\"java.vendor\"));\n        System.out.println(\"Available CPU Processors: \" + rt.availableProcessors());\n        System.out.println(\"Max JVM Heap Memory: \" + (rt.maxMemory() / (1024 * 1024)) + \" MB\");\n        System.out.println(\"Free JVM Heap Memory: \" + (rt.freeMemory() / (1024 * 1024)) + \" MB\");\n    }\n}",
        "browserOutputDesc": "Java Version: 21.0.2\nJava Vendor: Oracle Corporation\nAvailable CPU Processors: 8\nMax JVM Heap Memory: 4096 MB\nFree JVM Heap Memory: 248 MB"
      },
      {
        "title": "10th-Grade Analogy & Interview Point",
        "theory": [
          "Analogy: Think of Java like an international sheet-music composer. You write a symphony (Java Source Code). The compiler turns it into standard musical notes (Bytecode). Any piano, flute, or violin player around the world (JVM on Windows, Mac, or Linux) can play that music accurately without changing a single note!",
          "Interview Point: If asked 'Why is Java not 100% pure object-oriented?', answer: Because Java retains 8 primitive data types (int, float, char, boolean, etc.) for performance reasons. However, wrapper classes (Integer, Float) and modern autoboxing bridge the gap."
        ],
        "codeExample": "// Java First Hello World Application\npublic class HelloWorld {\n    // The starting entry point for any standalone Java application\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Welcome to ConverterAllAI Java Masterclass!\");\n    }\n}",
        "browserOutputDesc": "Hello, Welcome to ConverterAllAI Java Masterclass!"
      }
    ]
  },
  {
    "id": "java-datatypes",
    "chapterNumber": 2,
    "title": "Java Data Types & Primitive Ranges Table",
    "category": "Java Fundamentals",
    "shortDesc": "8 Primitive types, bits/bytes, value ranges, wrapper classes, Integer Cache (-128 to 127), and type casting.",
    "overview": [
      "Java is a strictly typed language: every variable must be declared with a data type before assignment.",
      "Data types in Java are divided into two categories: Primitive Data Types (stored on the Stack) and Reference Types (objects stored on the Heap)."
    ],
    "sections": [
      {
        "title": "All 8 Primitive Data Types Reference Table",
        "theory": [
          "Primitive types are allocated directly on the thread's execution stack, avoiding object header overhead.",
          "Widening Casting (Implicit): byte -> short -> char -> int -> long -> float -> double (safe, no data loss).",
          "Narrowing Casting (Explicit): double -> float -> long -> int -> char -> short -> byte (requires manual cast `(int)3.14`, risk of truncation).",
          "Integer Cache: JVM caches Integer wrapper objects from -128 to 127 in memory. `Integer a = 100; Integer b = 100; a == b` is `true`, while `200 == 200` is `false`!"
        ],
        "table": [
          {
            "attribute": "byte",
            "value": "8-bit signed (-128 to 127)",
            "description": "Useful for saving memory in large byte streams and binary files."
          },
          {
            "attribute": "short",
            "value": "16-bit signed (-32,768 to 32,767)",
            "description": "Twice as small as an int; rarely used in modern systems."
          },
          {
            "attribute": "int",
            "value": "32-bit signed (-2^31 to 2^31 - 1)",
            "description": "Default integer type for numerical values and loop counters."
          },
          {
            "attribute": "long",
            "value": "64-bit signed (-2^63 to 2^63 - 1)",
            "description": "For large timestamps and database IDs. Suffix with L: 5000000000L."
          },
          {
            "attribute": "float",
            "value": "32-bit IEEE 754 float",
            "description": "Single-precision decimal. Suffix with f: 3.14159f."
          },
          {
            "attribute": "double",
            "value": "64-bit IEEE 754 double",
            "description": "Default choice for decimal values. Double precision."
          },
          {
            "attribute": "boolean",
            "value": "1-bit logical (true / false)",
            "description": "Represents one bit of information, true or false."
          },
          {
            "attribute": "char",
            "value": "16-bit Unicode ('\\u0000' to '\\uffff')",
            "description": "Stores a single character: 'A', '9', or Unicode glyphs."
          }
        ],
        "codeExample": "// Java Data Types, Widening/Narrowing & Integer Cache\npublic class DataTypesDemo {\n    public static void main(String[] args) {\n        // Primitive declarations\n        int count = 42;\n        long bigId = 9876543210L;\n        double price = 99.95;\n        char grade = 'A';\n        boolean isActive = true;\n\n        // Narrowing Type Casting (Explicit with possible truncation)\n        int truncatedPrice = (int) price; // Truncates 99.95 to 99\n        System.out.println(\"Truncated Price: \" + truncatedPrice);\n\n        // Integer Cache Demonstration (-128 to 127)\n        Integer x = 120;\n        Integer y = 120;\n        System.out.println(\"120 == 120 (Cached): \" + (x == y)); // true\n\n        Integer m = 500;\n        Integer n = 500;\n        System.out.println(\"500 == 500 (Different Heap Objects): \" + (m == n)); // false\n        System.out.println(\"500.equals(500) (Value comparison): \" + m.equals(n)); // true\n    }\n}",
        "browserOutputDesc": "Truncated Price: 99\n120 == 120 (Cached): true\n500 == 500 (Different Heap Objects): false\n500.equals(500) (Value comparison): true"
      }
    ]
  },
  {
    "id": "java-variables",
    "chapterNumber": 3,
    "title": "Java Variable Types & Memory Allocation",
    "category": "Java Fundamentals",
    "shortDesc": "Local variables in Stack, Instance variables in Heap, Static class variables in Metaspace.",
    "overview": [
      "A variable provides us with named storage that our programs can manipulate.",
      "In Java, there are three distinct types of variables: Local variables, Instance variables, and Class/Static variables."
    ],
    "sections": [
      {
        "title": "Memory Lifecycles: Stack vs Heap vs Metaspace",
        "theory": [
          "Local Variables: Declared inside methods, constructors, or blocks. Created when the method is entered and destroyed upon exit. Stored on the Stack. No default values; must be initialized before use.",
          "Instance Variables: Declared inside a class but outside methods. Created when an object is instantiated with `new` and destroyed when garbage collected. Stored in the Heap. Initialized with default values (0, null, false).",
          "Static (Class) Variables: Declared with `static` keyword. Only one copy exists per class, shared across all instances. Stored in JVM Metaspace."
        ],
        "table": [
          {
            "attribute": "Local Variable",
            "value": "Thread Stack",
            "description": "Created on method call, destroyed on method return. No default values."
          },
          {
            "attribute": "Instance Variable",
            "value": "Heap Memory",
            "description": "Created with new, destroyed by Garbage Collector. Has default values."
          },
          {
            "attribute": "Static Variable",
            "value": "JVM Metaspace",
            "description": "Created when class is loaded, destroyed when class unloaded. Shared state."
          }
        ],
        "codeExample": "// Java Variable Types Demo\npublic class Student {\n    // Static Variable (Shared across all students)\n    public static String universityName = \"ConverterAllAI Institute\";\n    public static int totalEnrolledStudents = 0;\n\n    // Instance Variables (Unique to each object in Heap)\n    private String studentName;\n    private double gpa;\n\n    public Student(String studentName, double gpa) {\n        this.studentName = studentName;\n        this.gpa = gpa;\n        totalEnrolledStudents++;\n    }\n\n    public void calculateHonorRoll() {\n        // Local Variable (Exists only during method execution on Stack)\n        double honorCutoff = 3.5;\n        boolean isHonor = this.gpa >= honorCutoff;\n        System.out.println(this.studentName + \" Honor Roll: \" + isHonor);\n    }\n\n    public static void main(String[] args) {\n        Student s1 = new Student(\"Alice\", 3.9);\n        Student s2 = new Student(\"Bob\", 3.2);\n        s1.calculateHonorRoll();\n        s2.calculateHonorRoll();\n        System.out.println(\"Total Students: \" + Student.totalEnrolledStudents);\n    }\n}",
        "browserOutputDesc": "Alice Honor Roll: true\nBob Honor Roll: false\nTotal Students: 2"
      }
    ]
  },
  {
    "id": "java-modifiers",
    "chapterNumber": 4,
    "title": "Java Modifier Types: Access & Non-Access",
    "category": "Java Fundamentals",
    "shortDesc": "Access modifiers (public, protected, default, private) and non-access modifiers (static, final, abstract, synchronized, volatile).",
    "overview": [
      "Modifiers are keywords that you add to definitions to change their meaning or accessibility.",
      "Java divides modifiers into two groups: Access Modifiers (encapsulation) and Non-Access Modifiers (behavioral characteristics)."
    ],
    "sections": [
      {
        "title": "Access Modifiers Visibility Matrix",
        "theory": [
          "`private`: Accessible only within the declaring class.",
          "`default` (package-private): Accessible only within the same package.",
          "`protected`: Accessible within the same package AND by subclasses in other packages.",
          "`public`: Accessible everywhere across the entire project."
        ],
        "table": [
          {
            "attribute": "private",
            "value": "Class Only",
            "description": "Same class: YES | Same pkg: NO | Subclass diff pkg: NO | World: NO"
          },
          {
            "attribute": "default (no keyword)",
            "value": "Package-Private",
            "description": "Same class: YES | Same pkg: YES | Subclass diff pkg: NO | World: NO"
          },
          {
            "attribute": "protected",
            "value": "Package & Subclass",
            "description": "Same class: YES | Same pkg: YES | Subclass diff pkg: YES | World: NO"
          },
          {
            "attribute": "public",
            "value": "Global Access",
            "description": "Same class: YES | Same pkg: YES | Subclass diff pkg: YES | World: YES"
          },
          {
            "attribute": "final",
            "value": "Immutable",
            "description": "Variables cannot be re-assigned; methods cannot be overridden; classes cannot be inherited."
          },
          {
            "attribute": "static",
            "value": "Class-Level",
            "description": "Belongs to the class rather than instances. Shared memory address."
          },
          {
            "attribute": "volatile",
            "value": "Thread Visibility",
            "description": "Guarantees that reads and writes are made directly to main memory, preventing thread CPU cache stale reads."
          }
        ],
        "codeExample": "// Java Final and Static Modifiers Demo\npublic class ConstantsDemo {\n    // Public static final constant (Upper snake case)\n    public static final double GOLDEN_RATIO = 1.6180339887;\n    public static final String APP_NAME = \"ConverterAllAI\";\n\n    public static void main(String[] args) {\n        System.out.println(\"Application: \" + ConstantsDemo.APP_NAME);\n        System.out.println(\"Golden Ratio: \" + ConstantsDemo.GOLDEN_RATIO);\n        // GOLDEN_RATIO = 2.0; // Compile-time error: cannot assign value to final variable\n    }\n}",
        "browserOutputDesc": "Application: ConverterAllAI\nGolden Ratio: 1.6180339887"
      }
    ]
  },
  {
    "id": "java-strings",
    "chapterNumber": 5,
    "title": "Java Strings & Complete Built-in Methods Table",
    "category": "Core Java",
    "shortDesc": "String immutability, String Constant Pool (SCP), StringBuilder vs StringBuffer, and complete methods table.",
    "overview": [
      "In Java, strings are objects backed by a `byte[]` array (compact strings since Java 9) and are strictly immutable.",
      "String literal instances reside in the String Constant Pool (SCP) inside the Heap. Re-assigning or concatenating a string creates a fresh object in memory."
    ],
    "sections": [
      {
        "title": "Complete String Methods Table & Thread Safety",
        "theory": [
          "Literal creation `String s = \"hello\"` checks the SCP; if present, it reuses the reference.",
          "`new String(\"hello\")` forces creation of a new object in the general heap, bypassing SCP reuse.",
          "`StringBuilder`: Mutable, high performance, NOT thread-safe (ideal for single-threaded string building).",
          "`StringBuffer`: Mutable, thread-safe (all methods `synchronized`), slightly slower due to lock overhead."
        ],
        "table": [
          {
            "attribute": "s.charAt(int index)",
            "value": "-> char",
            "description": "Returns char at specified index (0 to length()-1)."
          },
          {
            "attribute": "s.compareTo(String other)",
            "value": "-> int",
            "description": "Compares strings lexicographically (returns 0 if equal, negative if s < other)."
          },
          {
            "attribute": "s.concat(String str)",
            "value": "-> String",
            "description": "Concatenates specified string to the end of this string."
          },
          {
            "attribute": "s.contains(CharSequence seq)",
            "value": "-> boolean",
            "description": "Returns true if string contains specified sequence of characters."
          },
          {
            "attribute": "s.endsWith(String suffix)",
            "value": "-> boolean",
            "description": "Tests if string ends with specified suffix."
          },
          {
            "attribute": "s.equals(Object other)",
            "value": "-> boolean",
            "description": "Compares content equality of two strings (never use == for content!)."
          },
          {
            "attribute": "s.equalsIgnoreCase(String other)",
            "value": "-> boolean",
            "description": "Compares content ignoring case considerations."
          },
          {
            "attribute": "s.indexOf(String str)",
            "value": "-> int",
            "description": "Returns index of first occurrence of substring, or -1 if absent."
          },
          {
            "attribute": "s.length()",
            "value": "-> int",
            "description": "Returns number of characters in the string."
          },
          {
            "attribute": "s.replace(char old, char new)",
            "value": "-> String",
            "description": "Returns new string replacing all occurrences of old with new."
          },
          {
            "attribute": "s.split(String regex)",
            "value": "-> String[]",
            "description": "Splits string around matches of given regular expression."
          },
          {
            "attribute": "s.substring(int begin, int end)",
            "value": "-> String",
            "description": "Returns substring from begin index up to end index-1."
          },
          {
            "attribute": "s.toLowerCase() / toUpperCase()",
            "value": "-> String",
            "description": "Converts all characters to lower / upper case."
          },
          {
            "attribute": "s.trim() / s.strip()",
            "value": "-> String",
            "description": "Removes whitespace from both ends (strip() handles Unicode whitespace)."
          },
          {
            "attribute": "String.valueOf(any)",
            "value": "-> String",
            "description": "Static method returning string representation of primitive or object."
          }
        ],
        "codeExample": "// String Methods & StringBuilder Performance Demo\npublic class StringMethodsDemo {\n    public static void main(String[] args) {\n        String text = \"  ConverterAllAI:JavaMastery:2026  \";\n        String clean = text.trim();\n        \n        String[] parts = clean.split(\":\");\n        System.out.println(\"Platform: \" + parts[0]);\n        System.out.println(\"Subject: \" + parts[1]);\n        System.out.println(\"Year: \" + parts[2]);\n        \n        // High Performance StringBuilder in loop\n        StringBuilder sb = new StringBuilder();\n        for (int i = 1; i <= 5; i++) {\n            sb.append(\"Step-\").append(i).append(\" \");\n        }\n        System.out.println(\"StringBuilder Output: \" + sb.toString());\n    }\n}",
        "browserOutputDesc": "Platform: ConverterAllAI\nSubject: JavaMastery\nYear: 2026\nStringBuilder Output: Step-1 Step-2 Step-3 Step-4 Step-5 "
      }
    ]
  },
  {
    "id": "java-arrays",
    "chapterNumber": 6,
    "title": "Java Arrays & java.util.Arrays Utilities",
    "category": "Core Java",
    "shortDesc": "1D and 2D arrays, contiguous heap layout, ArrayStoreException, and java.util.Arrays methods table.",
    "overview": [
      "An array in Java is a dynamically created object that holds a fixed number of values of a single uniform type.",
      "Array length is immutable once instantiated: `numbers.length`. To resize dynamically, use Collections like `ArrayList`."
    ],
    "sections": [
      {
        "title": "java.util.Arrays Methods Table",
        "theory": [
          "Arrays are zero-indexed: first element is `arr[0]`, last is `arr[arr.length - 1]`.",
          "Java provides `java.util.Arrays` for optimized sorting (Dual-Pivot Quicksort for primitives, Timsort for objects), searching, and formatting."
        ],
        "table": [
          {
            "attribute": "Arrays.sort(arr)",
            "value": "O(n log n)",
            "description": "Sorts array into ascending numerical/alphabetical order in-place."
          },
          {
            "attribute": "Arrays.binarySearch(arr, key)",
            "value": "O(log n)",
            "description": "Searches sorted array for key using binary search algorithm."
          },
          {
            "attribute": "Arrays.equals(arr1, arr2)",
            "value": "O(n)",
            "description": "Returns true if two arrays contain equal elements in same order."
          },
          {
            "attribute": "Arrays.fill(arr, val)",
            "value": "O(n)",
            "description": "Assigns the specified value val to each element of the array."
          },
          {
            "attribute": "Arrays.copyOf(arr, newLen)",
            "value": "O(n)",
            "description": "Copies array, truncating or padding with default values to fit newLen."
          },
          {
            "attribute": "Arrays.toString(arr)",
            "value": "O(n)",
            "description": "Returns string representation formatted as [elem1, elem2, ...]."
          }
        ],
        "codeExample": "// Java Arrays & Utilities Demo\nimport java.util.Arrays;\n\npublic class ArrayUtilitiesDemo {\n    public static void main(String[] args) {\n        int[] scores = {88, 95, 72, 64, 91, 83};\n        \n        // In-place dual-pivot quicksort\n        Arrays.sort(scores);\n        System.out.println(\"Sorted Scores: \" + Arrays.toString(scores));\n        \n        // Binary Search (Requires sorted array)\n        int target = 91;\n        int index = Arrays.binarySearch(scores, target);\n        System.out.println(\"Score \" + target + \" found at index: \" + index);\n        \n        // 2D Matrix Array\n        int[][] matrix = {\n            {1, 2, 3},\n            {4, 5, 6}\n        };\n        System.out.println(\"Matrix Rows: \" + matrix.length + \", Cols: \" + matrix[0].length);\n    }\n}",
        "browserOutputDesc": "Sorted Scores: [64, 72, 83, 88, 91, 95]\nScore 91 found at index: 4\nMatrix Rows: 2, Cols: 3"
      }
    ]
  },
  {
    "id": "java-oop-inheritance",
    "chapterNumber": 7,
    "title": "Java OOP: Inheritance & super Keyword",
    "category": "OOP & Design",
    "shortDesc": "extends keyword, IS-A relationship, super constructor chaining, single vs multilevel inheritance.",
    "overview": [
      "Inheritance is an OOP mechanism where a new class (subclass/child) derives attributes and behaviors from an existing class (superclass/parent).",
      "Java supports Single Inheritance and Multilevel Inheritance for classes, but does NOT support Multiple Inheritance of classes (to prevent the Diamond Problem). Multiple inheritance is achieved via Interfaces."
    ],
    "sections": [
      {
        "title": "super Keyword & Constructor Chaining",
        "theory": [
          "`super()` invokes the parent constructor and MUST be the first statement in a child constructor.",
          "`super.methodName()` calls the overridden method implementation in the parent class.",
          "Every class in Java implicitly subclasses `java.lang.Object`, inheriting methods like `toString()`, `equals()`, `hashCode()`, and `getClass()`."
        ],
        "codeExample": "// Java Inheritance & Super Constructor Chaining\nclass Employee {\n    protected String name;\n    protected double baseSalary;\n\n    public Employee(String name, double baseSalary) {\n        this.name = name;\n        this.baseSalary = baseSalary;\n    }\n\n    public double calculateTotalPay() {\n        return this.baseSalary;\n    }\n}\n\nclass SoftwareEngineer extends Employee {\n    private double annualBonus;\n\n    public SoftwareEngineer(String name, double baseSalary, double annualBonus) {\n        super(name, baseSalary); // Call parent constructor\n        this.annualBonus = annualBonus;\n    }\n\n    @Override\n    public double calculateTotalPay() {\n        return super.calculateTotalPay() + this.annualBonus;\n    }\n}\n\npublic class InheritanceDemo {\n    public static void main(String[] args) {\n        SoftwareEngineer se = new SoftwareEngineer(\"Alice\", 120000, 25000);\n        System.out.println(se.name + \" Total Compensation: $\" + se.calculateTotalPay());\n    }\n}",
        "browserOutputDesc": "Alice Total Compensation: $145000.0"
      }
    ]
  },
  {
    "id": "java-oop-polymorphism",
    "chapterNumber": 8,
    "title": "Java OOP: Polymorphism & Method Overriding",
    "category": "OOP & Design",
    "shortDesc": "Compile-time polymorphism (overloading) vs runtime dynamic method dispatch (overriding with @Override).",
    "overview": [
      "Polymorphism means 'many forms'. It allows an entity such as a variable, function, or object to have more than one form.",
      "Java features Compile-time Polymorphism (Method Overloading) and Runtime Polymorphism (Method Overriding via Dynamic Method Dispatch)."
    ],
    "sections": [
      {
        "title": "Overloading vs Overriding Comparison Table",
        "theory": [
          "Method Overloading: Same method name, different parameter lists (type, count, or order) within the same class. Resolved at compile-time.",
          "Method Overriding: Subclass provides a specific implementation of a method already defined in its superclass with exact same name, return type, and parameters. Resolved at runtime based on the actual object in Heap."
        ],
        "table": [
          {
            "attribute": "Method Overloading",
            "value": "Compile-time (Static)",
            "description": "Same method name, different arguments. Return type alone cannot distinguish overloads."
          },
          {
            "attribute": "Method Overriding",
            "value": "Runtime (Dynamic)",
            "description": "Same method name and identical signature in subclass. Resolved via vtable pointer in Heap."
          },
          {
            "attribute": "@Override",
            "value": "Compiler Annotation",
            "description": "Instructs compiler to verify method signature matches superclass. Prevents accidental overloading typos."
          }
        ],
        "codeExample": "// Java Dynamic Method Dispatch Polymorphism\nclass PaymentGateway {\n    public void processPayment(double amount) {\n        System.out.println(\"Processing generic payment of $\" + amount);\n    }\n}\n\nclass CreditCardPayment extends PaymentGateway {\n    @Override\n    public void processPayment(double amount) {\n        System.out.println(\"Charging $\" + amount + \" to Credit Card with 2% cashback.\");\n    }\n}\n\nclass UpiPayment extends PaymentGateway {\n    @Override\n    public void processPayment(double amount) {\n        System.out.println(\"Authorizing Instant UPI payment of $\" + amount + \" via VPA.\");\n    }\n}\n\npublic class PolymorphismDemo {\n    public static void main(String[] args) {\n        // Polymorphic reference: Parent type pointing to Child objects\n        PaymentGateway p1 = new CreditCardPayment();\n        PaymentGateway p2 = new UpiPayment();\n        \n        p1.processPayment(500.0); // Dispatches to CreditCardPayment at runtime\n        p2.processPayment(150.0); // Dispatches to UpiPayment at runtime\n    }\n}",
        "browserOutputDesc": "Charging $500.0 to Credit Card with 2% cashback.\nAuthorizing Instant UPI payment of $150.0 via VPA."
      }
    ]
  },
  {
    "id": "java-oop-abstraction",
    "chapterNumber": 9,
    "title": "Java OOP: Abstraction & Interfaces",
    "category": "OOP & Design",
    "shortDesc": "abstract classes, interfaces, default & static interface methods (Java 8+), and multiple inheritance.",
    "overview": [
      "Abstraction is the process of hiding implementation details and showing only essential features to the user.",
      "Java achieves abstraction through Abstract Classes (0% to 100% abstraction) and Interfaces (100% pure contracts, with optional default/static implementations since Java 8)."
    ],
    "sections": [
      {
        "title": "Abstract Class vs Interface Comparison Table",
        "theory": [
          "An abstract class cannot be instantiated directly with `new`. It can declare state (instance fields) and constructors.",
          "An interface defines public contract methods. Classes `implement` interfaces. A class can implement multiple interfaces simultaneously."
        ],
        "table": [
          {
            "attribute": "Abstract Class",
            "value": "is-a relationship",
            "description": "Can have instance variables, constructors, and both abstract and concrete methods."
          },
          {
            "attribute": "Interface",
            "value": "can-do contract",
            "description": "Variables are implicitly public static final; supports multiple inheritance of type."
          },
          {
            "attribute": "default methods",
            "value": "Java 8+",
            "description": "Allows adding new methods with default bodies to interfaces without breaking existing implementers."
          },
          {
            "attribute": "static methods",
            "value": "Java 8+",
            "description": "Utility helper methods attached directly to the interface namespace."
          }
        ],
        "codeExample": "// Java Interface & Abstract Class Architecture\ninterface CloudStorageService {\n    void uploadFile(String fileName, byte[] data);\n    \n    // Java 8 default method\n    default void logAccess(String action) {\n        System.out.println(\"[AUDIT LOG] Cloud Storage Action: \" + action);\n    }\n}\n\nclass AmazonS3Storage implements CloudStorageService {\n    @Override\n    public void uploadFile(String fileName, byte[] data) {\n        logAccess(\"PUT s3://bucket/\" + fileName);\n        System.out.println(\"Uploaded \" + fileName + \" (\" + data.length + \" bytes) to AWS S3.\");\n    }\n}\n\npublic class AbstractionDemo {\n    public static void main(String[] args) {\n        CloudStorageService storage = new AmazonS3Storage();\n        storage.uploadFile(\"backup.tar.gz\", new byte[1024]);\n    }\n}",
        "browserOutputDesc": "[AUDIT LOG] Cloud Storage Action: PUT s3://bucket/backup.tar.gz\nUploaded backup.tar.gz (1024 bytes) to AWS S3."
      }
    ]
  },
  {
    "id": "java-collections-list",
    "chapterNumber": 10,
    "title": "Java Collections Framework: List & Queue",
    "category": "Collections & Generics",
    "shortDesc": "Collection hierarchy, ArrayList vs LinkedList vs Vector, PriorityQueue, ArrayDeque, and Big-O performance.",
    "overview": [
      "The Java Collections Framework (JCF) provides an architecture to store and manipulate a group of objects.",
      "The `List` interface represents an ordered sequence with index-based access, while `Queue` represents a collection designed for holding elements prior to processing (FIFO or priority order)."
    ],
    "sections": [
      {
        "title": "ArrayList vs LinkedList vs ArrayDeque Performance Table",
        "theory": [
          "ArrayList: Backed by a dynamically resizing array. Growth factor is 1.5x. O(1) random access via `get(i)`, but O(n) element shifts on middle insertion.",
          "LinkedList: Doubly-linked node list (`Node<E> { E item; Node next; Node prev; }`). O(1) insertions/deletions when pointer is at position, but O(n) traversal to reach index.",
          "ArrayDeque: Resizable circular array implementation of Deque. Faster than Stack and LinkedList for FIFO/LIFO queues."
        ],
        "table": [
          {
            "attribute": "ArrayList.get(index)",
            "value": "O(1)",
            "description": "Instant index calculation via contiguous memory offset."
          },
          {
            "attribute": "ArrayList.add(item)",
            "value": "O(1) amortized",
            "description": "Appends to array tail. Resizes by 1.5x when full."
          },
          {
            "attribute": "LinkedList.addFirst/Last",
            "value": "O(1)",
            "description": "Modifies head/tail node pointers without shifting elements."
          },
          {
            "attribute": "PriorityQueue",
            "value": "O(log n)",
            "description": "Binary min-heap. Elements ordered by natural ordering or custom Comparator."
          }
        ],
        "codeExample": "// Java List & Queue Collections Demo\nimport java.util.*;\n\npublic class ListQueueDemo {\n    public static void main(String[] args) {\n        // ArrayList with generics\n        List<String> frameworks = new ArrayList<>(Arrays.asList(\"Spring Boot\", \"Micronaut\", \"Quarkus\"));\n        frameworks.add(\"Jakarta EE\");\n        System.out.println(\"Frameworks List: \" + frameworks);\n        \n        // ArrayDeque used as high-performance FIFO Queue\n        Deque<String> requestQueue = new ArrayDeque<>();\n        requestQueue.offer(\"GET /api/users\");\n        requestQueue.offer(\"POST /api/orders\");\n        requestQueue.offer(\"DELETE /api/cart/1\");\n        \n        System.out.println(\"Processing Queue:\");\n        while (!requestQueue.isEmpty()) {\n            System.out.println(\"Executed: \" + requestQueue.poll());\n        }\n    }\n}",
        "browserOutputDesc": "Frameworks List: [Spring Boot, Micronaut, Quarkus, Jakarta EE]\nProcessing Queue:\nExecuted: GET /api/users\nExecuted: POST /api/orders\nExecuted: DELETE /api/cart/1"
      }
    ]
  },
  {
    "id": "java-collections-map",
    "chapterNumber": 11,
    "title": "Java Collections Framework: Map & Set",
    "category": "Collections & Generics",
    "shortDesc": "HashMap internal architecture (bucket array, load factor 0.75, treeify threshold 8), HashSet, TreeMap, and ConcurrentHashMap.",
    "overview": [
      "A `Map` maps unique keys to values. A `Set` contains no duplicate elements and models the mathematical set abstraction.",
      "Under the hood in Java 8+, `HashMap` uses an array of buckets containing linked lists. When bucket length exceeds TREEIFY_THRESHOLD (8), the linked list transforms into a Red-Black Tree, reducing worst-case lookup from O(n) to O(log n)."
    ],
    "sections": [
      {
        "title": "HashMap & Set Implementations Table",
        "theory": [
          "HashMap: O(1) average lookup/insert. Unordered. Keys must properly implement `hashCode()` and `equals()` contracts.",
          "LinkedHashMap: Maintains insertion order via a doubly-linked list through all entries. Ideal for LRU caches.",
          "TreeMap: Backed by a Red-Black Tree. Maintains sorted key order in O(log n) time.",
          "ConcurrentHashMap: High-concurrency thread-safe hash map using lock-striping and CAS (Compare-And-Swap) operations without synchronizing the entire table."
        ],
        "table": [
          {
            "attribute": "HashMap",
            "value": "O(1) avg",
            "description": "Hash bucket array with Red-Black treeification for collisions. Allows null key."
          },
          {
            "attribute": "HashSet",
            "value": "O(1) avg",
            "description": "Backed by an internal HashMap where elements are keys and value is a dummy Object."
          },
          {
            "attribute": "TreeMap",
            "value": "O(log n)",
            "description": "NavigableMap backed by Red-Black balance tree. Keys sorted naturally or via Comparator."
          },
          {
            "attribute": "ConcurrentHashMap",
            "value": "Thread-safe O(1)",
            "description": "Segment/bucket-level locking; no full-table locks. Highly scalable in multithreaded servers."
          }
        ],
        "codeExample": "// Java Map & Set Demonstration\nimport java.util.*;\n\npublic class MapSetDemo {\n    public static void main(String[] args) {\n        // HashMap key-value association\n        Map<String, Integer> stockPrices = new HashMap<>();\n        stockPrices.put(\"GOOGL\", 175);\n        stockPrices.put(\"MSFT\", 420);\n        stockPrices.put(\"NVDA\", 130);\n        \n        // Modern Map operations (Java 8+)\n        stockPrices.computeIfPresent(\"NVDA\", (k, v) -> v + 15);\n        System.out.println(\"Updated NVDA Price: $\" + stockPrices.get(\"NVDA\"));\n        \n        // TreeMap automatically sorts keys\n        Map<String, String> sortedMap = new TreeMap<>();\n        sortedMap.put(\"Zebra\", \"Animal\");\n        sortedMap.put(\"Apple\", \"Fruit\");\n        sortedMap.put(\"Mango\", \"Fruit\");\n        System.out.println(\"TreeMap Sorted Keys: \" + sortedMap.keySet());\n    }\n}",
        "browserOutputDesc": "Updated NVDA Price: $145\nTreeMap Sorted Keys: [Apple, Mango, Zebra]"
      }
    ]
  },
  {
    "id": "java-exceptions",
    "chapterNumber": 12,
    "title": "Java Exception Handling & try-with-resources",
    "category": "Advanced Java",
    "shortDesc": "Throwable hierarchy, Checked vs Unchecked exceptions, try-catch-finally, multi-catch, and AutoCloseable try-with-resources.",
    "overview": [
      "An exception is an abnormal condition that arises in a code sequence at runtime.",
      "Java enforces strong compile-time error checking: Checked Exceptions must be explicitly caught or declared in the method signature (`throws Exception`), while Unchecked Exceptions (subclasses of `RuntimeException`) represent programming logic bugs."
    ],
    "sections": [
      {
        "title": "Throwable Hierarchy & Resource Management",
        "theory": [
          "Checked Exceptions: Inherit from `java.lang.Exception` (excluding RuntimeException). Examples: `IOException`, `SQLException`. The compiler forces handling.",
          "Unchecked Exceptions: Inherit from `java.lang.RuntimeException`. Examples: `NullPointerException`, `IndexOutOfBoundsException`, `IllegalArgumentException`.",
          "`Error`: Severe JVM hardware or memory issues (e.g. `OutOfMemoryError`, `StackOverflowError`). Applications should not attempt to catch these.",
          "try-with-resources (Java 7+): Automatically closes any resource implementing `java.lang.AutoCloseable` upon exiting the block, eliminating resource leaks."
        ],
        "codeExample": "// Java Custom Exception & try-with-resources\nclass AccountLimitExceededException extends Exception {\n    public AccountLimitExceededException(String msg) {\n        super(msg);\n    }\n}\n\npublic class ExceptionDemo {\n    public static void validateTransfer(double amount) throws AccountLimitExceededException {\n        double maxDailyLimit = 10000.0;\n        if (amount > maxDailyLimit) {\n            throw new AccountLimitExceededException(\"Transfer of $\" + amount + \" exceeds daily limit of $\" + maxDailyLimit);\n        }\n        System.out.println(\"Transfer of $\" + amount + \" authorized.\");\n    }\n\n    public static void main(String[] args) {\n        try {\n            validateTransfer(15000.0);\n        } catch (AccountLimitExceededException ex) {\n            System.err.println(\"Security Block: \" + ex.getMessage());\n        } finally {\n            System.out.println(\"Audit: Verification cycle complete.\");\n        }\n    }\n}",
        "browserOutputDesc": "Security Block: Transfer of $15000.0 exceeds daily limit of $10000.0\nAudit: Verification cycle complete."
      }
    ]
  },
  {
    "id": "java-multithreading",
    "chapterNumber": 13,
    "title": "Java Multithreading, Concurrency & Thread Pools",
    "category": "Advanced Java",
    "shortDesc": "Thread lifecycle states, Runnable vs Callable, synchronized keyword, deadlock, and java.util.concurrent ExecutorService.",
    "overview": [
      "Multithreading is a specialized form of multitasking that allows concurrent execution of two or more parts of a program for maximum CPU utilization.",
      "Modern enterprise Java relies on the `java.util.concurrent` package, thread pools, and asynchronous `CompletableFuture` rather than spawning raw unmanaged threads."
    ],
    "sections": [
      {
        "title": "Thread Lifecycle States Table & Concurrency",
        "theory": [
          "Creating Threads: Implement `Runnable` or `Callable<V>` (preferred over extending `Thread` class).",
          "`ExecutorService`: Manages a pool of worker threads, queuing tasks and reusing existing threads to prevent expensive OS thread creation overhead."
        ],
        "table": [
          {
            "attribute": "NEW",
            "value": "State 1",
            "description": "Thread created with new Thread(), not yet started with start()."
          },
          {
            "attribute": "RUNNABLE",
            "value": "State 2",
            "description": "Thread executing in JVM or waiting for OS CPU quantum allocation."
          },
          {
            "attribute": "BLOCKED",
            "value": "State 3",
            "description": "Thread waiting for a monitor lock to enter/re-enter a synchronized block."
          },
          {
            "attribute": "WAITING",
            "value": "State 4",
            "description": "Thread waiting indefinitely for another thread via Object.wait() or Thread.join()."
          },
          {
            "attribute": "TIMED_WAITING",
            "value": "State 5",
            "description": "Thread waiting for a specified interval (e.g. Thread.sleep(ms), wait(ms))."
          },
          {
            "attribute": "TERMINATED",
            "value": "State 6",
            "description": "Thread has completed execution of its run() method."
          }
        ],
        "codeExample": "// Java Concurrency with ExecutorService & CompletableFuture\nimport java.util.concurrent.*;\n\npublic class ConcurrencyDemo {\n    public static void main(String[] args) throws Exception {\n        ExecutorService executor = Executors.newFixedThreadPool(2);\n        \n        // Submitting async task\n        Future<String> futureResult = executor.submit(() -> {\n            Thread.sleep(100); // Simulate background compute\n            return \"Report Generated successfully by \" + Thread.currentThread().getName();\n        });\n        \n        System.out.println(\"Main thread doing parallel work...\");\n        String result = futureResult.get(1, TimeUnit.SECONDS);\n        System.out.println(\"Async Result: \" + result);\n        \n        executor.shutdown();\n    }\n}",
        "browserOutputDesc": "Main thread doing parallel work...\nAsync Result: Report Generated successfully by pool-1-thread-1"
      }
    ]
  },
  {
    "id": "java-spring-boot",
    "chapterNumber": 14,
    "title": "Java Enterprise & Spring Boot Microservices",
    "category": "Enterprise & Cloud",
    "shortDesc": "Spring IoC container, Dependency Injection, @Component, @Autowired, Spring Boot @RestController, and Spring Data JPA.",
    "overview": [
      "Spring Boot is the world's most popular Java framework for building microservices, cloud-native backends, and enterprise APIs.",
      "Spring's core foundation is Inversion of Control (IoC) and Dependency Injection (DI), decoupling component creation from business logic."
    ],
    "sections": [
      {
        "title": "Spring Boot Annotations & REST Architecture",
        "theory": [
          "`@SpringBootApplication`: Combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`.",
          "`@RestController`: Combines `@Controller` and `@ResponseBody`, converting returned Java POJOs automatically into JSON payloads via Jackson.",
          "Spring Data JPA: Provides repository abstractions (`JpaRepository<Entity, ID>`) eliminating boilerplate SQL queries."
        ],
        "table": [
          {
            "attribute": "@Component / @Service",
            "value": "Stereotype",
            "description": "Registers class as a Spring-managed Bean in the ApplicationContext."
          },
          {
            "attribute": "@Autowired",
            "value": "Injection",
            "description": "Injects dependency automatically by type (constructor injection recommended)."
          },
          {
            "attribute": "@GetMapping / @PostMapping",
            "value": "HTTP Routing",
            "description": "Maps HTTP GET / POST requests to controller handler methods."
          },
          {
            "attribute": "@Entity",
            "value": "JPA / Hibernate",
            "description": "Marks Java class as a persistent relational database entity."
          }
        ],
        "codeExample": "// Conceptual Spring Boot REST Controller & Service\n\"\"\"\n@RestController\n@RequestMapping(\"/api/v1/users\")\npublic class UserController {\n    private final UserService userService;\n\n    // Constructor Dependency Injection\n    public UserController(UserService userService) {\n        this.userService = userService;\n    }\n\n    @GetMapping(\"/{id}\")\n    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {\n        return ResponseEntity.ok(userService.findUserById(id));\n    }\n}\n\"\"\"\nSystem.out.println(\"Spring Boot Architecture: Controller -> Service -> Repository -> Database.\");",
        "browserOutputDesc": "Spring Boot Architecture: Controller -> Service -> Repository -> Database."
      }
    ]
  },
  {
    "id": "java-interviews",
    "chapterNumber": 15,
    "title": "Top 100 Java & Spring Boot Interview Questions",
    "category": "Interview Preparation",
    "shortDesc": "Frequently asked technical interview questions, concise speaking points, and 10th-grade analogies.",
    "overview": [
      "Java interviews thoroughly test memory management (Garbage Collection, heap/stack), multi-threading concurrency, and Spring Boot architecture.",
      "Review these concise, high-impact answers before your technical phone screen or coding round."
    ],
    "sections": [
      {
        "title": "Core Java Interview Q&A (Speaking Points)",
        "theory": [
          "Q1: Why is String immutable in Java?",
          "Speaking Point: Strings are immutable for 3 reasons: 1) Security (strings store database URLs, usernames, passwords), 2) String Constant Pool caching (multiple references share the same literal; mutability would cause unintended side-effects), 3) Thread Safety (immutable objects are inherently thread-safe without locks).",
          "----------------------------------------",
          "Q2: What is the contract between equals() and hashCode()?",
          "Speaking Point: If two objects are equal according to `equals()`, they MUST produce the exact same `hashCode()`. However, if two objects produce the same hashCode, they do NOT necessarily have to be equal (this is a hash collision). Violating this contract breaks HashMaps and HashSets.",
          "----------------------------------------",
          "Q3: Difference between fail-fast and fail-safe iterators?",
          "Speaking Point: Fail-fast iterators (like `ArrayList.iterator()`) throw `ConcurrentModificationException` immediately if the collection is structurally modified during iteration. Fail-safe iterators (like `CopyOnWriteArrayList`) operate on a cloned copy of the collection and never throw ConcurrentModificationException.",
          "----------------------------------------",
          "Q4: What is the difference between Constructor Injection and Field Injection in Spring?",
          "Speaking Point: Constructor injection is strongly recommended over `@Autowired` field injection because it makes dependencies explicit, enforces immutability (`final` fields), prevents NullPointerExceptions during unit testing, and detects circular dependency cycles at compile/startup time."
        ],
        "codeExample": "// Demonstrating equals() and hashCode() Contract\nimport java.util.Objects;\n\nclass Developer {\n    private final int id;\n    private final String name;\n\n    public Developer(int id, String name) {\n        this.id = id;\n        this.name = name;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        if (o == null || getClass() != o.getClass()) return false;\n        Developer dev = (Developer) o;\n        return id == dev.id && Objects.equals(name, dev.name);\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(id, name);\n    }\n}\n\npublic class InterviewContractDemo {\n    public static void main(String[] args) {\n        Developer d1 = new Developer(101, \"Alice\");\n        Developer d2 = new Developer(101, \"Alice\");\n        System.out.println(\"d1.equals(d2): \" + d1.equals(d2));\n        System.out.println(\"HashCodes Match: \" + (d1.hashCode() == d2.hashCode()));\n    }\n}",
        "browserOutputDesc": "d1.equals(d2): true\nHashCodes Match: true"
      }
    ]
  }
];

export const ALL_RICH_JAVA_TOPICS: W3TopicItem[] = [
  {
    "id": "sec-fundamentals",
    "name": "Java Fundamentals",
    "isHeader": true,
    "chapterRefId": "java-overview"
  },
  {
    "id": "java-overview-topic",
    "name": "1. Java Overview & JVM Engine",
    "chapterRefId": "java-overview",
    "hasArrow": true
  },
  {
    "id": "java-datatypes-topic",
    "name": "2. Data Types & Primitives Table",
    "chapterRefId": "java-datatypes",
    "hasArrow": true
  },
  {
    "id": "java-variables-topic",
    "name": "3. Variables & Memory Allocation",
    "chapterRefId": "java-variables",
    "hasArrow": true
  },
  {
    "id": "java-modifiers-topic",
    "name": "4. Modifiers & Access Matrix",
    "chapterRefId": "java-modifiers",
    "hasArrow": true
  },
  {
    "id": "sec-core",
    "name": "Core Java",
    "isHeader": true,
    "chapterRefId": "java-strings"
  },
  {
    "id": "java-strings-topic",
    "name": "5. Strings & All Methods Table",
    "chapterRefId": "java-strings",
    "hasArrow": true
  },
  {
    "id": "java-arrays-topic",
    "name": "6. Arrays & Utility Algorithms",
    "chapterRefId": "java-arrays",
    "hasArrow": true
  },
  {
    "id": "sec-oop",
    "name": "OOP & Architecture",
    "isHeader": true,
    "chapterRefId": "java-oop-inheritance"
  },
  {
    "id": "java-inheritance-topic",
    "name": "7. Inheritance & super Keyword",
    "chapterRefId": "java-oop-inheritance",
    "hasArrow": true
  },
  {
    "id": "java-polymorphism-topic",
    "name": "8. Polymorphism & Overriding",
    "chapterRefId": "java-oop-polymorphism",
    "hasArrow": true
  },
  {
    "id": "java-abstraction-topic",
    "name": "9. Abstraction & Interfaces",
    "chapterRefId": "java-oop-abstraction",
    "hasArrow": true
  },
  {
    "id": "sec-collections",
    "name": "Collections & Generics",
    "isHeader": true,
    "chapterRefId": "java-collections-list"
  },
  {
    "id": "java-list-topic",
    "name": "10. List & Queue Implementations",
    "chapterRefId": "java-collections-list",
    "hasArrow": true
  },
  {
    "id": "java-map-topic",
    "name": "11. HashMap, Set & Trees",
    "chapterRefId": "java-collections-map",
    "hasArrow": true
  },
  {
    "id": "sec-advanced",
    "name": "Advanced Java",
    "isHeader": true,
    "chapterRefId": "java-exceptions"
  },
  {
    "id": "java-exceptions-topic",
    "name": "12. Exceptions & AutoCloseable",
    "chapterRefId": "java-exceptions",
    "hasArrow": true
  },
  {
    "id": "java-multithreading-topic",
    "name": "13. Multithreading & Thread Pools",
    "chapterRefId": "java-multithreading",
    "hasArrow": true
  },
  {
    "id": "sec-enterprise",
    "name": "Enterprise & Cloud",
    "isHeader": true,
    "chapterRefId": "java-spring-boot"
  },
  {
    "id": "java-spring-topic",
    "name": "14. Spring Boot & JPA APIs",
    "chapterRefId": "java-spring-boot",
    "hasArrow": true
  },
  {
    "id": "sec-interview",
    "name": "Interview Preparation",
    "isHeader": true,
    "chapterRefId": "java-interviews"
  },
  {
    "id": "java-interview-topic",
    "name": "15. Top 100 Java Q&A",
    "chapterRefId": "java-interviews",
    "hasArrow": true
  }
];
