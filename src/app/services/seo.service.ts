import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  jsonLd?: any;
}

const ROUTE_SEO_MAP: Record<string, SeoData> = {
  "/": {
    "title": "ConverterAllAI – Free Online PDF, Image, Audio, Dev Tools & Calculators | 100% In-Browser",
    "description": "All-in-one free browser toolkit: Merge & edit PDFs, convert images, cut audio, format JSON, learn SQL, play web games, and calculate finances. 100% client-side privacy.",
    "keywords": "PDF tools, image converter, audio tools, online converter, free PDF editor, merge PDF, compress PDF, json formatter, sql tutorial, bmi calculator, emi calculator, web games",
    "canonicalUrl": "https://converterallai.com",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConverterAllAI",
      "url": "https://converterallai.com",
      "description": "Free client-side online tools for PDF processing, image editing, audio engineering, calculations, web games, and developer utilities.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/home": {
    "title": "ConverterAllAI – Free Online PDF, Image, Audio, Dev Tools & Calculators | 100% In-Browser",
    "description": "All-in-one free browser toolkit: Merge & edit PDFs, convert images, cut audio, format JSON, learn SQL, play web games, and calculate finances. 100% client-side privacy.",
    "keywords": "PDF tools, image converter, audio tools, online converter, free PDF editor, merge PDF, compress PDF, json formatter, sql tutorial, bmi calculator, emi calculator, web games",
    "canonicalUrl": "https://converterallai.com"
  },
  "/dashboard": {
    "title": "Live Analytics Matrix & Global Telemetry | ConverterAllAI",
    "description": "Real-time telemetry, visitor geo-distribution, top converted file types, and client-side WASM execution performance metrics.",
    "keywords": "analytics matrix, live telemetry, usage stats, visitor statistics, wasm performance metrics",
    "canonicalUrl": "https://converterallai.com/dashboard",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConverterAllAI Live Analytics Matrix",
      "url": "https://converterallai.com/dashboard",
      "description": "Real-time telemetry and browser WASM execution stats.",
      "applicationCategory": "AnalyticsApplication",
      "operatingSystem": "All"
    }
  },
  "/resume-builder": {
    "title": "Free AI Resume Builder – Professional ATS-Friendly CV Creator Online | ConverterAllAI",
    "description": "Build professional, ATS-optimized resumes and CVs for free. Customize modern templates, add work experience and skills, preview live, and download high-resolution PDF.",
    "keywords": "resume builder, free cv maker, ats resume generator, online resume maker, curriculum vitae builder, professional resume templates, free pdf resume",
    "canonicalUrl": "https://converterallai.com/resume-builder",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Free AI Resume & CV Builder",
      "url": "https://converterallai.com/resume-builder",
      "description": "Build ATS-friendly modern resumes and download printable PDF documents directly in your browser.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/typing-master": {
    "title": "Typing Master Pro – Free Online Touch Typing Test & Speed Trainer | ConverterAllAI",
    "description": "Test and improve your typing speed and accuracy with real-time WPM calculation, error diagnostics, and interactive speed drills. Free touch typing tutor online.",
    "keywords": "typing master, typing test, touch typing tutor, wpm speed test, keyboard practice, online typing tutor, cpm accuracy test",
    "canonicalUrl": "https://converterallai.com/typing-master",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Typing Master Pro Speed Trainer",
      "url": "https://converterallai.com/typing-master",
      "description": "Interactive touch-typing speed trainer and WPM test with instant accuracy metrics.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/developer-tools": {
    "title": "Free Developer Tools & SQL Studio – JSON Formatter, Base64 & SQL Sandbox | ConverterAllAI",
    "description": "Free browser-based developer utilities: JSON formatter & validator, SQL masterclass with in-browser query engine, Type Master, and text utilities. 100% client-side.",
    "keywords": "developer tools, json formatter, json validator, base64 encoder decoder, sql playground, learn sql online, web developer utilities",
    "canonicalUrl": "https://converterallai.com/developer-tools",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConverterAllAI Developer Tools & SQL Studio",
      "url": "https://converterallai.com/developer-tools",
      "description": "Developer workspace featuring JSON formatting, SQL educational masterclass, and keyboard trainers.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/developer-tools/json-formatter": {
    "title": "JSON Formatter & Validator – Clean, Beautify, Minify & Fix JSON Online | ConverterAllAI",
    "description": "Clean, beautify, minify, and validate JSON data instantly. Syntax error detector with precise line indicators, collapsible tree view, and copy/download support.",
    "keywords": "json formatter, json validator, beautify json, minify json, json syntax checker, format json online, json parser, clean json",
    "canonicalUrl": "https://converterallai.com/developer-tools/json-formatter",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "JSON Formatter & Validator Pro",
      "url": "https://converterallai.com/developer-tools/json-formatter",
      "description": "Format, validate, beautify, and inspect JSON documents in real-time with error line detection.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/developer-tools/sql": {
    "title": "Complete MySQL & SQL Masterclass – 102 Slide Tutorial & In-Browser Engine | ConverterAllAI",
    "description": "Comprehensive MySQL course covering all 102 slides: RDBMS basics, DDL, DML, DQL, constraints, scalar functions, GROUP BY, subqueries, cascading foreign keys, Venn joins, and views.",
    "keywords": "sql tutorial, mysql masterclass, learn sql, sql queries, sql joins, sql subqueries, ddl, dml, dql, group by having, relational database",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Complete MySQL & RDBMS Masterclass (102 Slides)",
      "description": "A comprehensive 14-chapter relational database tutorial with live in-browser query execution engine.",
      "provider": {
        "@type": "Organization",
        "name": "ConverterAllAI",
        "url": "https://converterallai.com"
      }
    }
  },
  "/developer-tools/sql/intro": {
    "title": "1. Introduction to MySQL & RDBMS – Data, Database & SQL Basics | ConverterAllAI",
    "description": "Learn the fundamentals of Data, Database, DBMS vs RDBMS, Tables, Fields, Tuples, and SQL capabilities based on Slides 1 to 4.",
    "keywords": "what is sql, mysql intro, rdbms basics, database management system, sql tables, sql rows columns",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/intro",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Introduction to MySQL & RDBMS Architecture",
      "description": "Understand the foundations of relational database management systems and SQL.",
      "url": "https://converterallai.com/developer-tools/sql/intro"
    }
  },
  "/developer-tools/sql/syntax": {
    "title": "2. SQL Syntax & Commands – DDL, DML, DQL, DCL, TCL Guide | ConverterAllAI",
    "description": "Master the 5 core SQL command categories (DDL, DML, DQL, DCL, TCL), arithmetic & comparison operators, logical expressions, and boolean truth tables (Slides 5-8).",
    "keywords": "sql syntax, sql commands, ddl dml dql dcl tcl, sql operators, sql expressions, arithmetic operators sql",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/syntax",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "SQL Syntax, Command Categories, Operators & Boolean Expressions",
      "description": "Comprehensive guide to DDL, DML, DQL, DCL, TCL commands and SQL operators.",
      "url": "https://converterallai.com/developer-tools/sql/syntax"
    }
  },
  "/developer-tools/sql/commands": {
    "title": "2. SQL Commands & Operators – DDL, DML, DQL, DCL, TCL Guide | ConverterAllAI",
    "description": "Master the 5 core SQL command categories (DDL, DML, DQL, DCL, TCL), arithmetic & comparison operators, logical expressions, and boolean truth tables (Slides 5-8).",
    "keywords": "sql commands, ddl dml dql dcl tcl, sql operators, sql expressions, arithmetic operators sql",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/syntax"
  },
  "/developer-tools/sql/data-types": {
    "title": "3. SQL Data Types & Storage – Numeric, String & Date/Time Formats | ConverterAllAI",
    "description": "Complete guide to MySQL data types: INT, TINYINT, BIGINT, FLOAT, DECIMAL, CHAR vs VARCHAR, TEXT, DATE, TIME, and DATETIME with byte sizes (Slides 9-11).",
    "keywords": "mysql data types, char vs varchar, decimal precision sql, int bigint, datetime format sql",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/data-types",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "MySQL Data Types: Storage Specifications and Best Practices",
      "description": "Detailed analysis of numeric, string, and temporal data types in MySQL.",
      "url": "https://converterallai.com/developer-tools/sql/data-types"
    }
  },
  "/developer-tools/sql/constraints": {
    "title": "4. SQL Integrity Constraints – PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT | ConverterAllAI",
    "description": "Understand domain and entity constraints in MySQL: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, and DEFAULT with column & table-level syntax (Slides 12-17).",
    "keywords": "sql constraints, primary key sql, foreign key sql, unique constraint, check constraint mysql, default value sql",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/constraints",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "SQL Integrity Constraints: PRIMARY KEY, UNIQUE, FOREIGN KEY & CHECK",
      "description": "Learn how to enforce relational data integrity with constraints in MySQL.",
      "url": "https://converterallai.com/developer-tools/sql/constraints"
    }
  },
  "/developer-tools/sql/ddl": {
    "title": "5. DDL Commands – CREATE, ALTER, RENAME, TRUNCATE & DROP Table | ConverterAllAI",
    "description": "Master Data Definition Language in MySQL: CREATE DATABASE, CREATE TABLE, ALTER TABLE (ADD, DROP, MODIFY, CHANGE), RENAME TABLE, TRUNCATE vs DROP (Slides 18-25).",
    "keywords": "ddl commands, create table sql, alter table mysql, truncate vs drop table, rename table sql",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/ddl",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Data Definition Language (DDL) in MySQL",
      "description": "In-depth tutorial on CREATE, ALTER, RENAME, TRUNCATE, and DROP database operations.",
      "url": "https://converterallai.com/developer-tools/sql/ddl"
    }
  },
  "/developer-tools/sql/dml": {
    "title": "6. DML Commands – INSERT INTO, UPDATE & DELETE Statements | ConverterAllAI",
    "description": "Learn Data Manipulation Language: INSERT single and multi-row, UPDATE with WHERE clause, DELETE rows, and DELETE vs TRUNCATE deep dive (Slides 26-30).",
    "keywords": "dml commands, insert into mysql, update statement sql, delete from table, delete vs truncate",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/dml",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Data Manipulation Language (DML) in MySQL",
      "description": "Hands-on guide to INSERT INTO, UPDATE, and DELETE operations with rollback safety.",
      "url": "https://converterallai.com/developer-tools/sql/dml"
    }
  },
  "/developer-tools/sql/dql": {
    "title": "7. DQL & SELECT Queries – WHERE, LIKE Wildcards, BETWEEN, IN, ORDER BY, LIMIT | ConverterAllAI",
    "description": "Master Data Query Language: SELECT DISTINCT, WHERE filters, AND/OR/NOT, BETWEEN range, IN set, LIKE pattern matching (% and _), ORDER BY, and LIMIT (Slides 31-46).",
    "keywords": "select query sql, sql where clause, like wildcard sql, order by limit mysql, between and sql, distinct sql",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/dql",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Data Query Language (DQL): Mastering SELECT & Advanced Filtering",
      "description": "Master data filtering with WHERE, LIKE wildcards, BETWEEN, IN, ORDER BY, and LIMIT.",
      "url": "https://converterallai.com/developer-tools/sql/dql"
    }
  },
  "/developer-tools/sql/dcl": {
    "title": "8. DCL Commands – GRANT & REVOKE Database Permissions in MySQL | ConverterAllAI",
    "description": "Master Data Control Language in MySQL: GRANT and REVOKE user privileges, security roles, fine-grained access control, and user account management.",
    "keywords": "dcl commands sql, grant revoke mysql, database permissions, user privileges sql, dcl security",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/dcl",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Data Control Language (DCL): Managing Permissions with GRANT and REVOKE",
      "description": "Learn database security and privilege delegation using MySQL DCL commands.",
      "url": "https://converterallai.com/developer-tools/sql/dcl"
    }
  },
  "/developer-tools/sql/tcl": {
    "title": "9. TCL Commands – COMMIT, ROLLBACK & SAVEPOINT Transaction Control | ConverterAllAI",
    "description": "Understand Transaction Control Language in MySQL: ACID principles, START TRANSACTION, COMMIT persistence, ROLLBACK undos, and SAVEPOINT markers.",
    "keywords": "tcl commands sql, commit rollback savepoint, acid properties database, mysql transactions, transaction control language",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/tcl",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Transaction Control Language (TCL): ACID Transactions, COMMIT & ROLLBACK",
      "description": "Master relational transactions, rollback mechanisms, and savepoints in MySQL.",
      "url": "https://converterallai.com/developer-tools/sql/tcl"
    }
  },
  "/developer-tools/sql/joins": {
    "title": "10. SQL Joins & Venn Diagrams – INNER, LEFT, RIGHT, FULL, CROSS & SELF JOIN | ConverterAllAI",
    "description": "Interactive visual guide to SQL Joins with Venn diagrams: INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL OUTER JOIN via UNION, CROSS JOIN, and SELF JOIN (Slides 88-96).",
    "keywords": "sql joins, inner join vs left join, right join mysql, full outer join union, cross join, self join sql",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/joins",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Visual Guide to SQL Joins: Venn Diagrams & Practical Syntax",
      "description": "Interactive Venn diagrams and complete syntax for INNER, LEFT, RIGHT, FULL, CROSS, and SELF joins in MySQL.",
      "url": "https://converterallai.com/developer-tools/sql/joins"
    }
  },
  "/developer-tools/sql/functions": {
    "title": "11. Built-in SQL Functions – String, Numeric, Date & Aggregate Functions | ConverterAllAI",
    "description": "Comprehensive MySQL functions reference: CONCAT, SUBSTR, UPPER, ROUND, MOD, NOW, DATEDIFF, COUNT, SUM, AVG, MIN, MAX, and IFNULL/COALESCE (Slides 47-59).",
    "keywords": "mysql functions, sql string functions, aggregate functions sql, count sum avg, date functions mysql",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/functions",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "MySQL Built-in Functions Reference: String, Math, Date & Aggregates",
      "description": "Complete reference for scalar and aggregate functions in MySQL with practical examples.",
      "url": "https://converterallai.com/developer-tools/sql/functions"
    }
  },
  "/developer-tools/sql/group-by": {
    "title": "12. GROUP BY & HAVING Clause – Aggregations & Group Filtering | ConverterAllAI",
    "description": "Deep dive into SQL aggregation: GROUP BY syntax rules, multi-column grouping, aggregate functions with groups, and HAVING vs WHERE clause difference (Slides 60-65).",
    "keywords": "group by sql, having clause mysql, having vs where, sql count group by, aggregation queries",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/group-by",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Mastering SQL GROUP BY & HAVING Clause",
      "description": "Learn SQL group aggregations, multi-column grouping, and the key differences between HAVING and WHERE.",
      "url": "https://converterallai.com/developer-tools/sql/group-by"
    }
  },
  "/developer-tools/sql/subqueries": {
    "title": "13. Nested Subqueries – Single-Row, Multi-Row (IN, ANY, ALL) & DML Subqueries | ConverterAllAI",
    "description": "Master nested queries in MySQL: Single-row subqueries, multi-row operators (IN, ANY, ALL), multi-column subqueries, and subqueries inside INSERT/UPDATE/DELETE (Slides 66-82).",
    "keywords": "sql subqueries, nested query mysql, any all operator sql, subquery in where, subquery with insert update",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/subqueries",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "SQL Nested Subqueries: Single-Row, Multi-Row, and DML Subqueries",
      "description": "Comprehensive guide to nested subqueries in MySQL with IN, ANY, ALL, and subqueries in DML statements.",
      "url": "https://converterallai.com/developer-tools/sql/subqueries"
    }
  },
  "/developer-tools/sql/foreign-keys": {
    "title": "14. Foreign Keys & Cascading Actions – ON DELETE CASCADE, SET NULL, RESTRICT | ConverterAllAI",
    "description": "Learn relational referential integrity: Parent and child tables, FOREIGN KEY definition, ON DELETE / ON UPDATE CASCADE, RESTRICT, SET NULL, and NO ACTION (Slides 83-87).",
    "keywords": "foreign key cascade, on delete cascade mysql, on update restrict, referential integrity sql",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/foreign-keys",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Relational Integrity: Foreign Keys & Cascading Actions in MySQL",
      "description": "Understand referential integrity, foreign key syntax, and cascading actions: CASCADE, SET NULL, and RESTRICT.",
      "url": "https://converterallai.com/developer-tools/sql/foreign-keys"
    }
  },
  "/developer-tools/sql/views": {
    "title": "15. SQL Views – Virtual Tables, CREATE, UPDATE & DROP VIEW | ConverterAllAI",
    "description": "Understand virtual tables in MySQL: Why use views, CREATE VIEW, querying views, updatable views with WITH CHECK OPTION, altering views, and DROP VIEW (Slides 97-102).",
    "keywords": "sql views, create view mysql, updatable views sql, virtual tables, drop view",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/views",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "SQL Views: Virtual Tables, Security & WITH CHECK OPTION",
      "description": "Master database views: creation, security benefits, updatable views, and schema alterations.",
      "url": "https://converterallai.com/developer-tools/sql/views"
    }
  },
  "/developer-tools/sql/playground": {
    "title": "16. Live SQL Playground & Sandbox – In-Browser Query Execution Engine | ConverterAllAI",
    "description": "Interactive SQL sandbox: write and execute real SELECT, JOIN, GROUP BY, and DML queries directly in your browser with pre-seeded datasets and 18 course presets.",
    "keywords": "sql playground, interactive sql editor, run sql online, sql sandbox, browser sql runner, test sql queries",
    "canonicalUrl": "https://converterallai.com/developer-tools/sql/playground",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Interactive In-Browser SQL Playground",
      "url": "https://converterallai.com/developer-tools/sql/playground",
      "description": "Client-side SQL execution engine with pre-seeded relational schemas and instant query feedback.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/calculators": {
    "title": "Online Calculators – Free Financial, Health, Math & Date Tools | ConverterAllAI",
    "description": "Comprehensive suite of free online calculators: BMI, EMI, Loan, GST, SIP, Percentage, Age, CGPA, Discount, and Date calculators. Fast, accurate, and easy to use.",
    "keywords": "online calculators, free calculator, bmi calculator, emi calculator, gst calculator, sip calculator, percentage calculator, age calculator",
    "canonicalUrl": "https://converterallai.com/calculators",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConverterAllAI Online Calculators Suite",
      "url": "https://converterallai.com/calculators",
      "description": "Free financial, health, and academic calculators with instant formula outputs.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/calculators/basic": {
    "title": "Basic Calculator Online – Free Standard Arithmetic Tool | ConverterAllAI",
    "description": "Free standard online calculator for quick arithmetic: addition, subtraction, multiplication, division, percentages, and memory functions. Clean and responsive.",
    "keywords": "basic calculator, online arithmetic calculator, standard calculator, simple math calculator, pocket calculator online",
    "canonicalUrl": "https://converterallai.com/calculators/basic",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Basic Calculator Online",
      "url": "https://converterallai.com/calculators/basic",
      "description": "Standard arithmetic online calculator for quick daily math calculations.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/bmi": {
    "title": "BMI Calculator – Free Body Mass Index & Healthy Weight Calculator | ConverterAllAI",
    "description": "Calculate your Body Mass Index (BMI) instantly. Supports Metric and Imperial units, provides WHO category breakdown, ideal weight range, and health insights.",
    "keywords": "bmi calculator, body mass index calculator, calculate bmi, bmi chart, healthy weight calculator, underweight overweight normal bmi",
    "canonicalUrl": "https://converterallai.com/calculators/bmi",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Body Mass Index (BMI) Calculator",
      "url": "https://converterallai.com/calculators/bmi",
      "description": "Calculate BMI and healthy weight thresholds based on WHO clinical standards.",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/percentage": {
    "title": "Percentage Calculator Online – Percentage Increase, Decrease & Difference | ConverterAllAI",
    "description": "Free multi-mode percentage calculator: calculate percentage of a number, percentage change (increase/decrease), discount percentages, and ratio differences.",
    "keywords": "percentage calculator, calculate percentage, percentage increase calculator, percentage difference, percent change calculator, discount percentage",
    "canonicalUrl": "https://converterallai.com/calculators/percentage",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Percentage Calculator Pro",
      "url": "https://converterallai.com/calculators/percentage",
      "description": "Calculate percentage values, percent increases, decreases, and proportion differences.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/emi": {
    "title": "EMI Calculator Online – Home Loan, Car Loan & Personal Loan EMI | ConverterAllAI",
    "description": "Calculate monthly EMI for home loans, car loans, and personal loans. View interactive amortization chart, total interest payable, and payment breakdown.",
    "keywords": "emi calculator, loan emi calculator, home loan emi, car loan emi, personal loan emi calculator, monthly installment calculator, amortization table",
    "canonicalUrl": "https://converterallai.com/calculators/emi",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Loan EMI Calculator",
      "url": "https://converterallai.com/calculators/emi",
      "description": "Calculate equated monthly installments (EMI) and loan amortization schedules.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/age": {
    "title": "Age Calculator Online – Calculate Exact Age in Years, Months, Days & Next Birthday | ConverterAllAI",
    "description": "Calculate your exact chronological age in years, months, weeks, days, and hours. See upcoming birthday countdown and life milestones instantly.",
    "keywords": "age calculator, calculate age from date of birth, date of birth calculator, how old am i, chronological age calculator, next birthday countdown",
    "canonicalUrl": "https://converterallai.com/calculators/age",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Chronological Age Calculator",
      "url": "https://converterallai.com/calculators/age",
      "description": "Calculate exact age from date of birth with days, months, and milestone breakdowns.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/gst": {
    "title": "GST Calculator Online – Calculate Exclusive & Inclusive Goods & Services Tax | ConverterAllAI",
    "description": "Free GST tax calculator for India and worldwide VAT: Calculate GST inclusive (remove GST) and GST exclusive (add GST) with 5%, 12%, 18%, 28% slabs.",
    "keywords": "gst calculator, calculate gst online, gst inclusive calculator, gst exclusive, goods and services tax calculator, vat calculator, reverse gst",
    "canonicalUrl": "https://converterallai.com/calculators/gst",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "GST Tax Calculator",
      "url": "https://converterallai.com/calculators/gst",
      "description": "Compute inclusive and exclusive GST/VAT tax amounts across all statutory slabs.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/discount": {
    "title": "Discount Calculator Online – Calculate Sale Price, Percentage Off & Total Savings | ConverterAllAI",
    "description": "Calculate discounted sale prices and savings instantly. Enter original price and discount percentage or flat coupon amount to see exact final price.",
    "keywords": "discount calculator, sale price calculator, percent off calculator, calculate discount, savings calculator, shopping discount tool",
    "canonicalUrl": "https://converterallai.com/calculators/discount",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Shopping Discount Calculator",
      "url": "https://converterallai.com/calculators/discount",
      "description": "Calculate final prices after discounts, markdowns, and sales percentages.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/sip": {
    "title": "SIP Calculator Online – Systematic Investment Plan Returns & Wealth Growth | ConverterAllAI",
    "description": "Calculate expected returns on Mutual Fund Systematic Investment Plans (SIP). View future wealth creation, total invested capital, and estimated gains graph.",
    "keywords": "sip calculator, mutual fund sip calculator, systematic investment plan, sip returns calculator, wealth calculator, investment growth calculator",
    "canonicalUrl": "https://converterallai.com/calculators/sip",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Mutual Fund SIP Calculator",
      "url": "https://converterallai.com/calculators/sip",
      "description": "Calculate projected wealth growth and returns on systematic mutual fund investments.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/cgpa": {
    "title": "CGPA to Percentage Calculator – Convert College Grades & GPA Instantly | ConverterAllAI",
    "description": "Convert CGPA (Cumulative Grade Point Average) to percentage accurately according to CBSE, Mumbai University, VTU, and general academic multiplier formulas.",
    "keywords": "cgpa to percentage, cgpa calculator, convert cgpa to percent, cbse cgpa calculator, gpa to percentage converter, college grade calculator",
    "canonicalUrl": "https://converterallai.com/calculators/cgpa",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "CGPA to Percentage Calculator",
      "url": "https://converterallai.com/calculators/cgpa",
      "description": "Convert academic CGPA and SGPA grade points to standard percentage marks.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/loan": {
    "title": "Loan Calculator Online – Loan Repayment, Amortization Schedule & Total Interest | ConverterAllAI",
    "description": "Calculate total loan cost, monthly repayments, and full amortization schedule. Compare fixed vs reducing interest rates for mortgage and personal loans.",
    "keywords": "loan calculator, loan repayment calculator, loan interest calculator, amortization schedule, personal loan calculator, mortgage calculator",
    "canonicalUrl": "https://converterallai.com/calculators/loan",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Comprehensive Loan Repayment Calculator",
      "url": "https://converterallai.com/calculators/loan",
      "description": "Calculate loan principal, interest payments, and multi-year amortization schedules.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All"
    }
  },
  "/calculators/date": {
    "title": "Date Calculator Online – Calculate Days Between Dates, Add or Subtract Days | ConverterAllAI",
    "description": "Calculate exact duration between two dates in days, weeks, months, and years. Add or subtract calendar days to find exact past or future deadlines.",
    "keywords": "date calculator, days between dates, calculate days between two dates, date difference calculator, add days to date, business day calculator",
    "canonicalUrl": "https://converterallai.com/calculators/date",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Date Difference & Duration Calculator",
      "url": "https://converterallai.com/calculators/date",
      "description": "Calculate day differences between dates and project future calendar dates.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All"
    }
  },
  "/image-processing": {
    "title": "Free Image Tools Online – Compress, Convert, Crop, Edit & Remove Background | ConverterAllAI",
    "description": "Powerful browser-based image toolkit: Compress JPG/PNG/WebP, convert formats, crop photos, remove backgrounds with AI, and create PDFs. 100% private, no uploads.",
    "keywords": "image tools, image compressor, image converter, background remover, crop image, photo editor, image to pdf, online image optimizer",
    "canonicalUrl": "https://converterallai.com/image-processing",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConverterAllAI Image Studio",
      "url": "https://converterallai.com/image-processing",
      "description": "Comprehensive client-side image editing and format transformation suite.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/image-processing/compressor": {
    "title": "Image Compressor Online – Compress JPG, PNG, WebP Without Losing Quality | ConverterAllAI",
    "description": "Compress images online by up to 80% while retaining razor-sharp visual fidelity. Custom compression slider, batch processing, and instant downloads.",
    "keywords": "image compressor, compress jpg, compress png, reduce image size, shrink photo mb to kb, online photo compressor, lossy lossless image compression",
    "canonicalUrl": "https://converterallai.com/image-processing/compressor",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Image Compressor Pro",
      "url": "https://converterallai.com/image-processing/compressor",
      "description": "Compress image files locally in your browser with real-time file size comparison.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All"
    }
  },
  "/image-Compressor": {
    "title": "Image Compressor Online – Compress JPG, PNG, WebP Without Losing Quality | ConverterAllAI",
    "description": "Compress images online by up to 80% while retaining razor-sharp visual fidelity. Custom compression slider, batch processing, and instant downloads.",
    "keywords": "image compressor, compress jpg, compress png, reduce image size, shrink photo mb to kb",
    "canonicalUrl": "https://converterallai.com/image-processing/compressor"
  },
  "/image-processing/format-converter": {
    "title": "Image Format Converter – Convert JPG, PNG, WebP, GIF, SVG, BMP Online | ConverterAllAI",
    "description": "Convert images between JPG, PNG, WebP, AVIF, GIF, and BMP formats in seconds. High-fidelity in-browser conversion with zero upload to external servers.",
    "keywords": "image format converter, convert png to jpg, convert jpg to webp, convert heic to jpg, image converter online, png to webp converter",
    "canonicalUrl": "https://converterallai.com/image-processing/format-converter",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Image Format Converter Online",
      "url": "https://converterallai.com/image-processing/format-converter",
      "description": "Convert between popular image formats with lossless or compressed options.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All"
    }
  },
  "/image-processing/cropper": {
    "title": "Image Cropper Online – Crop Photos to Custom Aspect Ratios (16:9, 1:1, 4:3) Free | ConverterAllAI",
    "description": "Crop and trim photos online with precise aspect ratio presets: square 1:1, 16:9 widescreen, 4:3 portrait, and freehand selection. Export high-res PNG or JPG.",
    "keywords": "image cropper, crop photo online, crop picture, photo crop tool, aspect ratio cropper, crop image square, free image trimmer",
    "canonicalUrl": "https://converterallai.com/image-processing/cropper",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Image Cropper Pro",
      "url": "https://converterallai.com/image-processing/cropper",
      "description": "Interactive image cropping tool with fixed aspect ratio presets and zoom controls.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All"
    }
  },
  "/image-processing/bg-remover": {
    "title": "AI Background Remover – Remove Background from Images Online Free | ConverterAllAI",
    "description": "Remove backgrounds from photos automatically with AI in seconds. Get transparent PNG cutouts for products, profile pictures, and graphics with 100% privacy.",
    "keywords": "remove background from image, background remover free, transparent png maker, remove bg online, erase background photo, cutout maker",
    "canonicalUrl": "https://converterallai.com/image-processing/bg-remover",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "AI Background Remover Online",
      "url": "https://converterallai.com/image-processing/bg-remover",
      "description": "Remove background from portraits, product shots, and icons producing transparent PNGs.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All"
    }
  },
  "/image-processing/image-to-pdf": {
    "title": "Image to PDF Converter – Convert Multiple Photos (JPG/PNG) to One PDF File | ConverterAllAI",
    "description": "Convert JPG, PNG, and WebP pictures into a clean multi-page PDF document. Reorder photos, set page orientation and margins, and download PDF instantly.",
    "keywords": "image to pdf, convert jpg to pdf, convert photos to pdf, picture to pdf, combine images into pdf, multi-page pdf maker",
    "canonicalUrl": "https://converterallai.com/image-processing/image-to-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Image to PDF Converter Pro",
      "url": "https://converterallai.com/image-processing/image-to-pdf",
      "description": "Combine multiple image files into an organized PDF document with custom margins.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All"
    }
  },
  "/image-processing/editor": {
    "title": "Online Photo Editor – Crop, Rotate, Adjust Brightness, Contrast & Add Filters | ConverterAllAI",
    "description": "Free browser photo editor: adjust brightness, contrast, saturation, blur, sharpness, flip, and apply color filters. Edit and enhance pictures with zero upload.",
    "keywords": "online photo editor, edit picture online, photo filter tool, adjust brightness photo, free picture editor, web photo enhancer",
    "canonicalUrl": "https://converterallai.com/image-processing/editor",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Browser Photo Editor Studio",
      "url": "https://converterallai.com/image-processing/editor",
      "description": "Client-side photo editing studio with color adjustments, filters, and rotations.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing": {
    "title": "Free Audio Tools Online – Cut, Trim, Boost, Reverse, Compress & Convert Audio | ConverterAllAI",
    "description": "All-in-one browser audio suite: Cut MP3s, boost volume, change audio speed, reverse tracks, apply 10-band equalizer, convert formats, and synthesize text to speech.",
    "keywords": "audio tools online, mp3 cutter, volume booster, audio speed changer, reverse audio, audio equalizer, text to speech, audio format converter",
    "canonicalUrl": "https://converterallai.com/audio-processing",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConverterAllAI Audio Processing Studio",
      "url": "https://converterallai.com/audio-processing",
      "description": "Browser-based audio editing, mastering, and conversion platform.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/audio-processing/audio-cutter": {
    "title": "Audio Cutter & MP3 Trimmer – Cut Music, Make Ringtones Online Free | ConverterAllAI",
    "description": "Cut and trim audio files with millisecond precision using interactive audio waveforms. Create custom phone ringtones, trim silence, and export as MP3 or WAV.",
    "keywords": "audio cutter, mp3 cutter, cut audio online, ringtone maker, trim mp3, trim music, cut song online free, audio trimmer",
    "canonicalUrl": "https://converterallai.com/audio-processing/audio-cutter",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Audio Cutter & Ringtone Maker",
      "url": "https://converterallai.com/audio-processing/audio-cutter",
      "description": "Interactive waveform audio trimmer and ringtone creator.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/volume-booster": {
    "title": "Audio Volume Booster – Boost Sound Level Up to 500% Online Free | ConverterAllAI",
    "description": "Boost audio volume of quiet MP3s, voice memos, and recordings up to 500% with built-in limiter to prevent distortion and clipping. 100% in-browser.",
    "keywords": "volume booster, audio booster online, increase mp3 volume, boost sound level, make audio louder, boost voice recording",
    "canonicalUrl": "https://converterallai.com/audio-processing/volume-booster",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Audio Volume Booster",
      "url": "https://converterallai.com/audio-processing/volume-booster",
      "description": "Amplify quiet audio files up to 5x with peak clipping protection.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/speed-changer": {
    "title": "Audio Speed Changer – Speed Up or Slow Down MP3/WAV Audio Online Free | ConverterAllAI",
    "description": "Change audio playback speed from 0.5x to 3.0x without altering pitch. Ideal for transcribing lectures, practicing music tracks, and speeding up podcasts.",
    "keywords": "audio speed changer, slow down audio, speed up audio, change mp3 playback speed, audio tempo changer without pitch change",
    "canonicalUrl": "https://converterallai.com/audio-processing/speed-changer",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Audio Speed & Tempo Changer",
      "url": "https://converterallai.com/audio-processing/speed-changer",
      "description": "Adjust audio tempo and playback rate while preserving natural voice pitch.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/audio-reverser": {
    "title": "Audio Reverser Online – Reverse Audio & Music Tracks Backwards Free | ConverterAllAI",
    "description": "Play and save any audio file backwards. Reverse MP3, WAV, and OGG songs to discover hidden sounds or create psychedelic audio effects. Instant export.",
    "keywords": "audio reverser, reverse audio online, play song backwards, reverse mp3, reverse music file, backwards audio effect",
    "canonicalUrl": "https://converterallai.com/audio-processing/audio-reverser",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Audio Reverser",
      "url": "https://converterallai.com/audio-processing/audio-reverser",
      "description": "Reverse audio tracks backwards in client-side memory.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/equalizer": {
    "title": "Online Audio Equalizer – 10-Band EQ, Bass Boost, Treble & Audio Presets | ConverterAllAI",
    "description": "Shape your sound with an interactive 10-band graphic equalizer: boost bass, enhance vocal clarity, adjust treble, or choose Rock, Pop, and Jazz EQ presets.",
    "keywords": "audio equalizer online, 10 band eq, bass booster online, graphic equalizer, web audio eq, music equalizer browser",
    "canonicalUrl": "https://converterallai.com/audio-processing/equalizer",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "10-Band Graphic Audio Equalizer",
      "url": "https://converterallai.com/audio-processing/equalizer",
      "description": "Web Audio API 10-band graphic equalizer with frequency response shaping.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/audio-compressor": {
    "title": "Audio Compressor Online – Reduce MP3 File Size Without Losing Sound Quality | ConverterAllAI",
    "description": "Shrink large audio files for email attachments and podcasts. Adjust bitrate, sampling rate, and audio channels while preserving high dynamic fidelity.",
    "keywords": "audio compressor, compress mp3 online, reduce audio file size, shrink mp3 mb to kb, audio bitrate compressor",
    "canonicalUrl": "https://converterallai.com/audio-processing/audio-compressor",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Audio Compressor Pro",
      "url": "https://converterallai.com/audio-processing/audio-compressor",
      "description": "Compress audio bitrates and shrink file sizes directly in browser memory.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/video-to-audio": {
    "title": "Video to Audio Converter – Extract MP3 Audio from MP4, MKV & WebM Online | ConverterAllAI",
    "description": "Extract crystal-clear audio from video files in seconds. Supports MP4, MKV, AVI, WebM, and MOV inputs with direct MP3 and WAV audio track downloads.",
    "keywords": "video to audio converter, extract audio from video, mp4 to mp3 converter, convert video to sound, rip audio from video file",
    "canonicalUrl": "https://converterallai.com/audio-processing/video-to-audio",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video to Audio Extractor",
      "url": "https://converterallai.com/audio-processing/video-to-audio",
      "description": "Extract and isolate audio soundtracks from video recordings client-side.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/format-converter": {
    "title": "Audio Format Converter – Convert MP3, WAV, OGG, AAC, FLAC & M4A Online | ConverterAllAI",
    "description": "Convert music and recordings between MP3, WAV, OGG, AAC, and FLAC formats. Blazing-fast WebAssembly conversion with zero server uploads.",
    "keywords": "audio format converter, convert wav to mp3, mp3 to wav converter, flac to mp3, ogg to mp3 converter, audio converter online free",
    "canonicalUrl": "https://converterallai.com/audio-processing/format-converter",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Audio Format Converter Online",
      "url": "https://converterallai.com/audio-processing/format-converter",
      "description": "Cross-format audio transcoder with multi-codec WebAssembly support.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/audio-joiner": {
    "title": "Audio Joiner & Merger – Combine Multiple Songs & MP3 Files into One Track | ConverterAllAI",
    "description": "Combine multiple audio tracks, voice notes, and songs into a seamless continuous audio file. Arrange track order, add crossfade transitions, and download MP3.",
    "keywords": "audio joiner, merge audio files, combine songs into one, mp3 merger online, stitch audio files together, audio combiner free",
    "canonicalUrl": "https://converterallai.com/audio-processing/audio-joiner",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Audio Joiner & Merger",
      "url": "https://converterallai.com/audio-processing/audio-joiner",
      "description": "Merge and splice multiple audio clips into a single continuous track.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/tts": {
    "title": "AI Text to Speech Studio – Free Multi-Lingual TTS in 60+ Languages with MP3 | ConverterAllAI",
    "description": "Convert text into natural human speech across 60+ global languages and Indian regional accents. Dual-speaker dialogue mode, speed control, and MP3 download.",
    "keywords": "text to speech, tts studio, free tts online, ai voice generator, text to speech hindi, text to speech english, natural voice synthesis",
    "canonicalUrl": "https://converterallai.com/audio-processing/tts",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "AI Multi-Lingual Text to Speech Studio",
      "url": "https://converterallai.com/audio-processing/tts",
      "description": "High-fidelity multi-lingual speech synthesis platform with dialogue modes.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/tts": {
    "title": "AI Text to Speech Studio – Free Multi-Lingual TTS in 60+ Languages with MP3 | ConverterAllAI",
    "description": "Convert text into natural human speech across 60+ global languages and Indian regional accents. Dual-speaker dialogue mode, speed control, and MP3 download.",
    "keywords": "text to speech, tts studio, free tts online, ai voice generator, speech synthesis",
    "canonicalUrl": "https://converterallai.com/audio-processing/tts"
  },
  "/audio-processing/text-to-mp3": {
    "title": "Text to MP3 Converter – Convert Written Text into Natural Human Voice Audio | ConverterAllAI",
    "description": "Convert written articles, scripts, and notes into crystal-clear MP3 audio. Choose voice accents, tweak pitch and tempo, and download audio instantly.",
    "keywords": "text to mp3, text to voice converter, speech to mp3, generate voice from text, audio file from text, read text aloud",
    "canonicalUrl": "https://converterallai.com/audio-processing/text-to-mp3",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Text to MP3 Audio Generator",
      "url": "https://converterallai.com/audio-processing/text-to-mp3",
      "description": "Direct text-to-MP3 synthesizer with adjustable cadence and pitch.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/audio-editor": {
    "title": "Powerful Audio Editor Pro – Cut, Trim, Merge & Pitch Shift Audio | ConverterAllAI",
    "description": "Edit, cut, trim, merge, equalizer and pitch shift audio files in your browser. Interactive waveform editor with MP3 & WAV export and zero upload latency.",
    "keywords": "audio editor, audio trimmer, cut audio, merge audio, pitch shifter, audio equalizer, mp3 cutter, daw browser",
    "canonicalUrl": "https://converterallai.com/audio-processing/audio-editor",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Web Audio Editor Pro",
      "url": "https://converterallai.com/audio-processing/audio-editor",
      "description": "Multi-feature digital audio workstation running directly in the browser.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/audio-processing/voice-cloning": {
    "title": "AI Voice Cloning Studio – Clone Any Voice Free | ConverterAllAI",
    "description": "Clone human voice from a 5-second mic sample. Extract pitch F0 and formant frequency profiles for multi-lingual text to speech synthesis.",
    "keywords": "voice cloning, AI voice clone, voice copier, voice synthesis, clone voice free, spectral analysis, formant profile",
    "canonicalUrl": "https://converterallai.com/audio-processing/voice-cloning",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "AI Voice Cloning Studio",
      "url": "https://converterallai.com/audio-processing/voice-cloning",
      "description": "Real-time spectral voice cloning and acoustic model profiling.",
      "applicationCategory": "AudioApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing": {
    "title": "PDF Tools – Merge, Split, Compress, Convert & Edit PDFs Free | ConverterAllAI",
    "description": "All-in-one free PDF toolkit. Merge, split, compress, rotate, watermark, convert PDF to Word/Excel/PPT, add page numbers, sign PDFs and more — 100% in-browser.",
    "keywords": "merge PDF, split PDF, compress PDF, PDF to Word, PDF to Excel, rotate PDF, watermark PDF, sign PDF, edit pdf free",
    "canonicalUrl": "https://converterallai.com/pdf-processing",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConverterAllAI PDF Suite",
      "url": "https://converterallai.com/pdf-processing",
      "description": "Client-side PDF management suite covering editing, conversion, and security.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/pdf-processing/merge-pdf": {
    "title": "Merge PDF Files – Combine Multiple PDFs into One | ConverterAllAI",
    "description": "Combine multiple PDF documents into a single file. Drag and drop, reorder pages, and download instantly — 100% free, client-side, no upload required.",
    "keywords": "merge pdf, combine pdf files, join pdf pages, put pdfs together, unite pdfs online, free pdf merger",
    "canonicalUrl": "https://converterallai.com/pdf-processing/merge-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online PDF Merger Pro",
      "url": "https://converterallai.com/pdf-processing/merge-pdf",
      "description": "Combine multiple PDF documents in user-specified sequence locally.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/split-pdf": {
    "title": "Split PDF – Extract Pages from PDF Files Online | ConverterAllAI",
    "description": "Extract specific pages or split a PDF into multiple documents. Select custom page ranges and download instantly — free, private, and fast.",
    "keywords": "split pdf, extract pdf pages, separate pdf document, divide pdf, cut pages from pdf, save individual pdf pages",
    "canonicalUrl": "https://converterallai.com/pdf-processing/split-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online PDF Splitter",
      "url": "https://converterallai.com/pdf-processing/split-pdf",
      "description": "Isolate and extract specific page ranges from PDF documents.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/compress-pdf": {
    "title": "Compress PDF – Reduce PDF File Size Online Free | ConverterAllAI",
    "description": "Shrink PDF file size while maintaining high document readability. Fast in-browser compression without uploading confidential files to servers.",
    "keywords": "compress pdf, reduce pdf size, shrink pdf online, compress pdf mb to kb, optimize pdf document, small pdf file",
    "canonicalUrl": "https://converterallai.com/pdf-processing/compress-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online PDF Compressor",
      "url": "https://converterallai.com/pdf-processing/compress-pdf",
      "description": "Optimize PDF streams and shrink file size client-side.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/pdf-to-word": {
    "title": "PDF to Word Converter – Convert PDF to Editable DOCX | ConverterAllAI",
    "description": "Convert PDF files to editable Microsoft Word documents (DOCX). Preserves fonts, paragraphs, and formatting for effortless document editing.",
    "keywords": "pdf to word, convert pdf to docx, pdf to word editable, turn pdf into word, pdf to ms word converter online",
    "canonicalUrl": "https://converterallai.com/pdf-processing/pdf-to-word",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF to Word Converter Online",
      "url": "https://converterallai.com/pdf-processing/pdf-to-word",
      "description": "Convert static PDF files into editable Microsoft Word DOCX files.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/pdf-to-ppt": {
    "title": "PDF to PowerPoint – Convert PDF to Editable PPTX Slides | ConverterAllAI",
    "description": "Convert PDF presentation documents into editable PowerPoint slides (PPTX). Retain slide geometry, vector shapes, and graphics accurately.",
    "keywords": "pdf to ppt, convert pdf to powerpoint, pdf to pptx, turn pdf into slides, pdf presentation to powerpoint",
    "canonicalUrl": "https://converterallai.com/pdf-processing/pdf-to-ppt",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF to PowerPoint Converter",
      "url": "https://converterallai.com/pdf-processing/pdf-to-ppt",
      "description": "Transform PDF page slides into editable PowerPoint PPTX files.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/pdf-to-excel": {
    "title": "PDF to Excel Converter – Extract Tables from PDF to XLSX | ConverterAllAI",
    "description": "Extract data tables and financial statements from PDF files into Microsoft Excel spreadsheets (XLSX). Preserves rows, columns, and numeric formats.",
    "keywords": "pdf to excel, convert pdf to xlsx, extract tables from pdf, pdf to spreadsheet, turn pdf table into excel",
    "canonicalUrl": "https://converterallai.com/pdf-processing/pdf-to-excel",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF to Excel Converter",
      "url": "https://converterallai.com/pdf-processing/pdf-to-excel",
      "description": "Extract tabular data from PDF files into structured XLSX spreadsheets.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/word-to-pdf": {
    "title": "Word to PDF Converter – Convert DOCX to PDF Online Free | ConverterAllAI",
    "description": "Convert Microsoft Word documents (DOC and DOCX) to professional PDF files. Locks layout, fonts, and images for universal viewing and printing.",
    "keywords": "word to pdf, convert docx to pdf, doc to pdf, turn word document into pdf, free word to pdf converter online",
    "canonicalUrl": "https://converterallai.com/pdf-processing/word-to-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Word to PDF Converter",
      "url": "https://converterallai.com/pdf-processing/word-to-pdf",
      "description": "Render DOCX Word documents into standardized PDF format.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/ppt-to-pdf": {
    "title": "PowerPoint to PDF Converter – Convert PPT & PPTX to PDF | ConverterAllAI",
    "description": "Convert PowerPoint slide decks (PPT and PPTX) into PDF presentations. Retains high-resolution graphics, transitions, and typography.",
    "keywords": "ppt to pdf, powerpoint to pdf, convert pptx to pdf, save slides as pdf, presentation to pdf converter",
    "canonicalUrl": "https://converterallai.com/pdf-processing/ppt-to-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PowerPoint to PDF Converter",
      "url": "https://converterallai.com/pdf-processing/ppt-to-pdf",
      "description": "Convert PPTX presentations into distributable PDF documents.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/excel-to-pdf": {
    "title": "Excel to PDF Converter – Convert Spreadsheets & XLSX to PDF | ConverterAllAI",
    "description": "Convert Excel spreadsheets (XLS and XLSX) to crisp, printable PDF documents. Maintains table alignment, cell borders, and page fitting.",
    "keywords": "excel to pdf, convert xlsx to pdf, spreadsheet to pdf, save excel sheet as pdf, xls to pdf converter",
    "canonicalUrl": "https://converterallai.com/pdf-processing/excel-to-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Excel to PDF Converter",
      "url": "https://converterallai.com/pdf-processing/excel-to-pdf",
      "description": "Convert workbook spreadsheets into formatted PDF reports.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/edit-pdf": {
    "title": "Edit PDF Online – Add Text, Annotations, Highlights & Shapes | ConverterAllAI",
    "description": "Add text annotations, highlight important paragraphs, draw shapes, and add signatures to PDF files directly in your web browser. 100% free and private.",
    "keywords": "edit pdf, pdf editor online, annotate pdf, add text to pdf, highlight pdf text, draw on pdf, free online pdf annotator",
    "canonicalUrl": "https://converterallai.com/pdf-processing/edit-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online PDF Editor & Annotator",
      "url": "https://converterallai.com/pdf-processing/edit-pdf",
      "description": "Client-side PDF annotation and text overlay utility.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/pdf-to-jpg": {
    "title": "PDF to JPG Converter – Convert PDF Pages into Images Online | ConverterAllAI",
    "description": "Convert each page of your PDF document into crisp, high-resolution JPG or PNG pictures. Batch zip download or single page export with zero server upload.",
    "keywords": "pdf to jpg, convert pdf to image, pdf to png, turn pdf into picture, export pdf pages as images, pdf to photo",
    "canonicalUrl": "https://converterallai.com/pdf-processing/pdf-to-jpg",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF to JPG Image Converter",
      "url": "https://converterallai.com/pdf-processing/pdf-to-jpg",
      "description": "Extract PDF document pages as high-resolution image files.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/jpg-to-pdf": {
    "title": "JPG to PDF Converter – Convert Images & Photos to PDF Online | ConverterAllAI",
    "description": "Convert JPG, PNG, and WebP images into a single professional PDF document. Reorder photos, set paper sizes (A4, Letter), and download PDF instantly.",
    "keywords": "jpg to pdf, convert image to pdf, photos to pdf, make pdf from images, jpg into pdf document",
    "canonicalUrl": "https://converterallai.com/pdf-processing/jpg-to-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "JPG to PDF Converter Online",
      "url": "https://converterallai.com/pdf-processing/jpg-to-pdf",
      "description": "Package multiple JPG photo files into a standardized PDF.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/sign-pdf": {
    "title": "Sign PDF Online – Add Digital & Electronic Signatures to Documents | ConverterAllAI",
    "description": "Sign contracts, NDAs, and forms electronically. Draw your handwritten signature or upload an image stamp, position on any page, and save signed PDF.",
    "keywords": "sign pdf, digital signature pdf, electronic signature, sign document online free, esign pdf, draw signature on pdf",
    "canonicalUrl": "https://converterallai.com/pdf-processing/sign-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Electronic PDF Signature Tool",
      "url": "https://converterallai.com/pdf-processing/sign-pdf",
      "description": "Sign documents digitally using canvas touch signatures or stamp overlays.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/add-watermark": {
    "title": "Add Watermark to PDF – Protect Documents with Custom Text or Logo | ConverterAllAI",
    "description": "Protect confidential files by adding custom text or logo watermarks. Customize opacity, angle, font, and positioning across all or selected pages.",
    "keywords": "add watermark to pdf, watermark pdf online, stamp pdf, protect pdf copyright, custom text watermark pdf, watermark maker",
    "canonicalUrl": "https://converterallai.com/pdf-processing/add-watermark",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF Watermark Generator",
      "url": "https://converterallai.com/pdf-processing/add-watermark",
      "description": "Apply diagonal or centered copyright watermarks to PDF files.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/rotate-pdf": {
    "title": "Rotate PDF Pages – Fix Upside Down or Sideways Pages Online | ConverterAllAI",
    "description": "Permanently rotate PDF pages 90°, 180°, or 270°. Fix upside-down scans and landscape pages easily in your browser without file uploads.",
    "keywords": "rotate pdf, rotate pdf pages online, turn pdf pages, fix upside down pdf, flip pdf orientation, save rotated pdf",
    "canonicalUrl": "https://converterallai.com/pdf-processing/rotate-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online PDF Page Rotator",
      "url": "https://converterallai.com/pdf-processing/rotate-pdf",
      "description": "Adjust and persist page rotation angles across PDF documents.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/html-to-pdf": {
    "title": "HTML to PDF Converter – Save Webpages and Code as PDF Documents | ConverterAllAI",
    "description": "Convert HTML code snippets, rich formatted text, or webpage URLs into clean, printable PDF documents with custom margins and CSS support.",
    "keywords": "html to pdf, convert webpage to pdf, url to pdf, save html as pdf, html code to pdf document converter",
    "canonicalUrl": "https://converterallai.com/pdf-processing/html-to-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "HTML to PDF Converter Online",
      "url": "https://converterallai.com/pdf-processing/html-to-pdf",
      "description": "Render HTML structures into vector-accurate PDF files.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/remove-password": {
    "title": "Remove PDF Password – Unlock Protected PDF Files Instantly | ConverterAllAI",
    "description": "Remove password restrictions from PDF files. Enter the document password once to decrypt and download an unlocked copy for effortless future access.",
    "keywords": "remove pdf password, unlock pdf, decrypt pdf online, remove security from pdf, unprotect pdf file, unlock secured pdf",
    "canonicalUrl": "https://converterallai.com/pdf-processing/remove-password",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF Password Remover & Unlocker",
      "url": "https://converterallai.com/pdf-processing/remove-password",
      "description": "Decrypt password-protected PDFs and export unlocked copies.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/add-password": {
    "title": "Protect PDF with Password – Encrypt PDF Files with 256-Bit Lock | ConverterAllAI",
    "description": "Protect sensitive PDF documents with robust encryption. Add user opening passwords and restrict printing or copying without file upload risks.",
    "keywords": "protect pdf with password, encrypt pdf online, add password to pdf, secure pdf file, lock pdf document, password protect pdf",
    "canonicalUrl": "https://converterallai.com/pdf-processing/add-password",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF Password Encryptor",
      "url": "https://converterallai.com/pdf-processing/add-password",
      "description": "Encrypt PDF files with client-side cryptographic locks.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/organize-pdf": {
    "title": "Organize PDF Pages – Reorder, Move, Delete & Sort Pages | ConverterAllAI",
    "description": "Visual drag-and-drop PDF page organizer: reorder pages, rotate individual thumbnails, delete unwanted sheets, and export reorganized PDF documents.",
    "keywords": "organize pdf, reorder pdf pages, delete pages from pdf, rearrange pdf pages, sort pdf document, rearrange pages online",
    "canonicalUrl": "https://converterallai.com/pdf-processing/organize-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF Page Organizer & Reorder Tool",
      "url": "https://converterallai.com/pdf-processing/organize-pdf",
      "description": "Rearrange, sort, and delete pages inside PDF documents.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/pdf-to-pdfa": {
    "title": "PDF to PDF/A Converter – Convert Documents to ISO Archival Format | ConverterAllAI",
    "description": "Convert PDF files to ISO-compliant PDF/A archival format for long-term document preservation. Complies with legal and institutional archiving standards.",
    "keywords": "pdf to pdfa, convert pdf to archival format, pdf/a-1b converter, iso compliant pdf, long term document archiving",
    "canonicalUrl": "https://converterallai.com/pdf-processing/pdf-to-pdfa",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF to PDF/A Archival Converter",
      "url": "https://converterallai.com/pdf-processing/pdf-to-pdfa",
      "description": "Standardize PDF documents to ISO 19005 (PDF/A) archival specifications.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/repair-pdf": {
    "title": "Repair Corrupted PDF – Fix Broken, Damaged or Unreadable Documents | ConverterAllAI",
    "description": "Repair damaged or unreadable PDF files online. Rebuild broken xref tables, salvage text streams, and recover accessible pages from corrupt files.",
    "keywords": "repair pdf, fix corrupted pdf, recover damaged pdf, broken pdf file repair, salvage pdf data, pdf recovery tool",
    "canonicalUrl": "https://converterallai.com/pdf-processing/repair-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Corrupted PDF Repair Tool",
      "url": "https://converterallai.com/pdf-processing/repair-pdf",
      "description": "Recover corrupted PDF page trees and rebuild invalid xref references.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/add-page-numbers": {
    "title": "Add Page Numbers to PDF – Insert Custom Headers & Footers | ConverterAllAI",
    "description": "Add page numbers to your PDF documents. Choose position (top/bottom, left/center/right), starting number, and font formatting. 100% client-side.",
    "keywords": "add page numbers to pdf, number pdf pages, paginate pdf, insert page number header footer, pdf numbering tool",
    "canonicalUrl": "https://converterallai.com/pdf-processing/add-page-numbers",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF Page Numbering Tool",
      "url": "https://converterallai.com/pdf-processing/add-page-numbers",
      "description": "Stamp sequential page numbering onto PDF documents.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/scan-to-pdf": {
    "title": "Scan to PDF Online – Digitize Documents Using Your Device Camera | ConverterAllAI",
    "description": "Use your phone or laptop camera to scan physical paper documents into clean, high-contrast, multi-page PDF files instantly. Private & client-side.",
    "keywords": "scan to pdf, document scanner online, camera to pdf, digitize paper to pdf, photo scanner to pdf",
    "canonicalUrl": "https://converterallai.com/pdf-processing/scan-to-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Scan to PDF Utility",
      "url": "https://converterallai.com/pdf-processing/scan-to-pdf",
      "description": "Capture physical documents via camera into multi-page PDF files.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/ocr-pdf": {
    "title": "OCR PDF Online – Recognize Text from Scanned PDFs & Make Searchable | ConverterAllAI",
    "description": "Optical Character Recognition (OCR) for scanned PDFs and image documents. Extract selectable, searchable text from unsearchable scans with high accuracy.",
    "keywords": "ocr pdf, optical character recognition pdf, make pdf searchable, extract text from scanned pdf, scanned pdf to text ocr",
    "canonicalUrl": "https://converterallai.com/pdf-processing/ocr-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online OCR PDF Engine",
      "url": "https://converterallai.com/pdf-processing/ocr-pdf",
      "description": "Perform optical character recognition on scanned PDF documents.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/compare-pdf": {
    "title": "Compare PDF Files Online – Visual & Text Difference Checker | ConverterAllAI",
    "description": "Compare two PDF documents side-by-side to highlight added, removed, and modified text or visual elements. Fast diff checking for contracts and revisions.",
    "keywords": "compare pdf files, pdf diff checker, spot differences in pdf, compare two pdfs online, document comparison tool",
    "canonicalUrl": "https://converterallai.com/pdf-processing/compare-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online PDF Comparison Tool",
      "url": "https://converterallai.com/pdf-processing/compare-pdf",
      "description": "Diff two PDF revisions side-by-side highlighting visual and textual changes.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/redact-pdf": {
    "title": "Redact PDF Online – Black Out Sensitive Data & Confidential Text | ConverterAllAI",
    "description": "Permanently redact sensitive numbers, credit cards, SSNs, and personal details from PDF files. Irreversible redaction removes underlying text data.",
    "keywords": "redact pdf, blackout sensitive text pdf, hide private data pdf, pdf redaction tool online, sanitize pdf document",
    "canonicalUrl": "https://converterallai.com/pdf-processing/redact-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online PDF Redaction Tool",
      "url": "https://converterallai.com/pdf-processing/redact-pdf",
      "description": "Irreversibly black out and remove confidential text streams from PDFs.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/crop-pdf": {
    "title": "Crop PDF Pages Online – Trim White Margins & Adjust Printable Area | ConverterAllAI",
    "description": "Crop and trim margins from PDF pages. Select custom margins for top, bottom, left, and right or apply universal crop to all pages in seconds.",
    "keywords": "crop pdf, trim pdf margins, cut whitespace pdf, adjust pdf page size, crop pdf document online",
    "canonicalUrl": "https://converterallai.com/pdf-processing/crop-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online PDF Page Crop Tool",
      "url": "https://converterallai.com/pdf-processing/crop-pdf",
      "description": "Crop and remove unwanted margins from PDF document pages.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/pdf-forms": {
    "title": "Fill PDF Forms Online – Interactive PDF Form Filler & Editor | ConverterAllAI",
    "description": "Fill out interactive PDF forms, check boxes, radio buttons, and text fields directly in your browser. Download completed form without flattening errors.",
    "keywords": "fill pdf form, interactive pdf form filler, fill out pdf online, pdf form editor, complete pdf application",
    "canonicalUrl": "https://converterallai.com/pdf-processing/pdf-forms",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Interactive PDF Form Filler",
      "url": "https://converterallai.com/pdf-processing/pdf-forms",
      "description": "Fill out and submit form fields in interactive PDF files.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/ai-summarizer": {
    "title": "AI PDF Summarizer – Summarize Long Documents, Papers & Reports | ConverterAllAI",
    "description": "Summarize lengthy PDF documents, research papers, legal agreements, and book chapters into concise bullet points and key takeaways in seconds.",
    "keywords": "ai pdf summarizer, summarize pdf online, condense research paper, pdf key takeaways, ai document summary",
    "canonicalUrl": "https://converterallai.com/pdf-processing/ai-summarizer",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "AI PDF Document Summarizer",
      "url": "https://converterallai.com/pdf-processing/ai-summarizer",
      "description": "Generate concise executive summaries and bullet points from PDF files.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/translate-pdf": {
    "title": "Translate PDF Online – Free Multi-Lingual Document Translator | ConverterAllAI",
    "description": "Translate PDF documents into 50+ languages while preserving original formatting, headings, and layout geometry. 100% free and easy to use.",
    "keywords": "translate pdf, pdf document translator, translate pdf online free, translate pdf english to hindi, multi-lingual pdf translation",
    "canonicalUrl": "https://converterallai.com/pdf-processing/translate-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Online Multi-Lingual PDF Translator",
      "url": "https://converterallai.com/pdf-processing/translate-pdf",
      "description": "Translate PDF text into foreign languages while maintaining document layout.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/pdf-to-text": {
    "title": "PDF to Text Extractor – Convert PDF Documents to Plain TXT Online | ConverterAllAI",
    "description": "Extract raw, clean text from PDF documents. Copy directly to clipboard or download as a TXT file — processed 100% in your browser.",
    "keywords": "pdf to text, extract text from pdf, pdf to txt converter, rip text from pdf, copy text from pdf file",
    "canonicalUrl": "https://converterallai.com/pdf-processing/pdf-to-text",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDF to Plain Text Extractor",
      "url": "https://converterallai.com/pdf-processing/pdf-to-text",
      "description": "Extract raw text streams from PDF files with paragraph formatting intact.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/pdf-processing/text-to-pdf": {
    "title": "Text to PDF Converter – Format & Convert Plain Text to PDF Online | ConverterAllAI",
    "description": "Convert plain text, notes, and code snippets into a formatted PDF document. Customize font family, text size, margins, and paper orientation.",
    "keywords": "text to pdf, convert txt to pdf, plain text to pdf document, write text save as pdf, text document to pdf generator",
    "canonicalUrl": "https://converterallai.com/pdf-processing/text-to-pdf",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Plain Text to PDF Generator",
      "url": "https://converterallai.com/pdf-processing/text-to-pdf",
      "description": "Typeset raw text input into clean, downloadable PDF documents.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All"
    }
  },
  "/games": {
    "title": "Free Web Games Online – Play Classic Chess, Teen Do Paanch, Sudoku & More | ConverterAllAI",
    "description": "Play free online browser games: Chess, Teen Do Paanch (3-2-5), Ludo, Snakes & Ladders, Sudoku, Snake, Memory Match, Tic Tac Toe, and 3D action shooters.",
    "keywords": "free web games, online browser games, play chess online, teen do paanch, ludo online, sudoku free, retro snake game, games no download",
    "canonicalUrl": "https://converterallai.com/games",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConverterAllAI Game Arcade",
      "url": "https://converterallai.com/games",
      "description": "Collection of classic board games, card games, puzzles, and arcade browser games.",
      "applicationCategory": "GameApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },
  "/games/chess": {
    "title": "Free Online Chess – Play Chess Against Smart AI Bot or Friends In-Browser | ConverterAllAI",
    "description": "Play chess online for free. Challenge an intelligent AI engine with adjustable difficulty levels or play local pass-and-play with friends. Move history & legal checks.",
    "keywords": "play chess online, free chess game, chess against ai, chess engine browser, 2 player chess online, play chess no download",
    "canonicalUrl": "https://converterallai.com/games/chess",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Classic Chess Online",
      "url": "https://converterallai.com/games/chess",
      "gamePlatform": "Web Browser",
      "genre": "Board Game, Strategy",
      "playMode": "SinglePlayer, MultiPlayer"
    }
  },
  "/games/frontline-survivor": {
    "title": "Frontline Survivor 3D – Intense Action Survival Web Game Online Free | ConverterAllAI",
    "description": "Survive endless waves of hostile enemies in Frontline Survivor. Upgrade weapons, collect powerups, and test your combat reflexes in full 3D graphics.",
    "keywords": "frontline survivor, 3d action game, survival shooter browser game, play 3d game online, free shooting game",
    "canonicalUrl": "https://converterallai.com/games/frontline-survivor",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Frontline Survivor 3D",
      "url": "https://converterallai.com/games/frontline-survivor",
      "gamePlatform": "Web Browser",
      "genre": "Action, Survival",
      "playMode": "SinglePlayer"
    }
  },
  "/games/warfare-3000": {
    "title": "Warfare 3000 – Sci-Fi Futuristic Tactical Combat Game Online Free | ConverterAllAI",
    "description": "Command futuristic armies and sci-fi defenses in Warfare 3000. Real-time tactical gameplay, particle weapons, and intense strategic sci-fi battles.",
    "keywords": "warfare 3000, sci-fi browser game, strategy war game, tactical web game, futuristic combat game",
    "canonicalUrl": "https://converterallai.com/games/warfare-3000",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Warfare 3000 Tactical Combat",
      "url": "https://converterallai.com/games/warfare-3000",
      "gamePlatform": "Web Browser",
      "genre": "Sci-Fi Strategy, Tactical Combat",
      "playMode": "SinglePlayer"
    }
  },
  "/games/teen-do-paanch": {
    "title": "Teen Do Paanch (3-2-5) Card Game – Play Classic Indian Trick-Taking Card Game | ConverterAllAI",
    "description": "Play traditional Teen Do Paanch (3-2-5) card game online with smart AI opponents. Master trump selection, trick making, and target goals (3, 2, and 5 hands).",
    "keywords": "teen do paanch, 3 2 5 card game, indian card game online, teen do paanch rules, play 3 2 5 card game free",
    "canonicalUrl": "https://converterallai.com/games/teen-do-paanch",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Teen Do Paanch (3-2-5) Card Game",
      "url": "https://converterallai.com/games/teen-do-paanch",
      "gamePlatform": "Web Browser",
      "genre": "Card Game, Strategy",
      "playMode": "SinglePlayer"
    }
  },
  "/games/snakes-ladders": {
    "title": "Snakes and Ladders Game – Play Classic Board Game Online Free | ConverterAllAI",
    "description": "Roll the dice and race to 100 in classic Snakes and Ladders. Climb ladders to victory and watch out for slithering snakes in this colorful interactive board game.",
    "keywords": "snakes and ladders game, play snakes and ladders online, classic board game, roll dice game, multiplayer snakes ladders",
    "canonicalUrl": "https://converterallai.com/games/snakes-ladders",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Snakes and Ladders Classic",
      "url": "https://converterallai.com/games/snakes-ladders",
      "gamePlatform": "Web Browser",
      "genre": "Board Game, Casual",
      "playMode": "MultiPlayer, SinglePlayer"
    }
  },
  "/games/ludo": {
    "title": "Ludo King Classic – Play Multiplayer Ludo Board Game In Your Browser | ConverterAllAI",
    "description": "Play the beloved Ludo board game online. Roll dice, move tokens into home pocket, knock out opponent pawns, and compete with 2 to 4 players or smart AI.",
    "keywords": "ludo game online, play ludo free, ludo board game browser, ludo multiplayer, classic pachisi game",
    "canonicalUrl": "https://converterallai.com/games/ludo",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Ludo Classic Board Game",
      "url": "https://converterallai.com/games/ludo",
      "gamePlatform": "Web Browser",
      "genre": "Board Game, Family",
      "playMode": "MultiPlayer, SinglePlayer"
    }
  },
  "/games/spelling-bee": {
    "title": "Spelling Bee Game – Word Puzzle Challenge & Vocabulary Trainer | ConverterAllAI",
    "description": "Test your vocabulary with Spelling Bee word puzzle. Make as many words as possible using 7 honeycomb letters including the required center letter. Daily fun!",
    "keywords": "spelling bee game, word puzzle online, honeycomb word game, vocabulary test game, free spelling game, word challenge",
    "canonicalUrl": "https://converterallai.com/games/spelling-bee",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Spelling Bee Word Puzzle",
      "url": "https://converterallai.com/games/spelling-bee",
      "gamePlatform": "Web Browser",
      "genre": "Word Game, Educational",
      "playMode": "SinglePlayer"
    }
  },
  "/games/teen-patti": {
    "title": "Teen Patti Online – Play Traditional 3-Card Indian Poker Game Free | ConverterAllAI",
    "description": "Play Teen Patti (Indian Poker) online free. Test your 3-card poker skills, trail, pure sequence, color, and pair rankings against smart virtual players.",
    "keywords": "teen patti online, 3 card poker game, flash indian poker, play teen patti free, teen patti browser game",
    "canonicalUrl": "https://converterallai.com/games/teen-patti",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Teen Patti 3-Card Poker",
      "url": "https://converterallai.com/games/teen-patti",
      "gamePlatform": "Web Browser",
      "genre": "Card Game, Casino",
      "playMode": "SinglePlayer"
    }
  },
  "/games/sudoku": {
    "title": "Free Online Sudoku – Classic Number Puzzle with Easy, Medium & Hard Modes | ConverterAllAI",
    "description": "Play free Sudoku puzzles online. Multiple difficulty levels from Beginner to Expert with error highlighting, notes mode, and timer. Great daily brain exercise.",
    "keywords": "sudoku online, free sudoku puzzle, daily sudoku game, number puzzle, sudoku solver, play sudoku in browser",
    "canonicalUrl": "https://converterallai.com/games/sudoku",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Classic Sudoku Puzzle",
      "url": "https://converterallai.com/games/sudoku",
      "gamePlatform": "Web Browser",
      "genre": "Logic Puzzle, Brain Game",
      "playMode": "SinglePlayer"
    }
  },
  "/games/snake": {
    "title": "Classic Retro Snake Game – Eat Food, Grow Longer & Beat High Scores | ConverterAllAI",
    "description": "Play the nostalgic retro Snake arcade game. Guide the hungry snake, eat fruit, avoid running into walls or your own tail, and set high score records.",
    "keywords": "retro snake game, classic snake arcade, play snake online free, nokia snake game browser, snake 2d game",
    "canonicalUrl": "https://converterallai.com/games/snake",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Retro Snake Arcade Game",
      "url": "https://converterallai.com/games/snake",
      "gamePlatform": "Web Browser",
      "genre": "Arcade, Retro",
      "playMode": "SinglePlayer"
    }
  },
  "/games/memory-match": {
    "title": "Memory Match Card Game – Brain Training & Visual Recall Puzzle Online | ConverterAllAI",
    "description": "Sharpen your memory with card matching puzzle game. Flip cards, remember locations, find matching pairs in minimal moves, and train your short-term recall.",
    "keywords": "memory match game, card matching game, brain training game, visual recall puzzle, flip cards memory game",
    "canonicalUrl": "https://converterallai.com/games/memory-match",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Memory Match Card Puzzle",
      "url": "https://converterallai.com/games/memory-match",
      "gamePlatform": "Web Browser",
      "genre": "Puzzle, Memory",
      "playMode": "SinglePlayer"
    }
  },
  "/games/tic-tac-toe": {
    "title": "Tic Tac Toe Online – Play Classic XOXO Game vs Smart AI or Two-Player | ConverterAllAI",
    "description": "Play Tic Tac Toe (Noughts and Crosses) online. Challenge an unbeatable AI bot or play with friends in 2-player local mode. Track scores and win streaks.",
    "keywords": "tic tac toe online, xoxo game, play noughts and crosses, tic tac toe vs ai, 2 player tic tac toe free",
    "canonicalUrl": "https://converterallai.com/games/tic-tac-toe",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Tic Tac Toe Classic",
      "url": "https://converterallai.com/games/tic-tac-toe",
      "gamePlatform": "Web Browser",
      "genre": "Board Game, Casual",
      "playMode": "SinglePlayer, MultiPlayer"
    }
  },
  "/games/brick-breaker": {
    "title": "Brick Breaker Arcade Game – Classic Retro Paddle & Ball Bouncing Fun | ConverterAllAI",
    "description": "Smash through walls of colored blocks in this classic Brick Breaker / Breakout arcade game. Catch bonus powerups, keep the ball bouncing, and clear levels.",
    "keywords": "brick breaker, breakout arcade game, smash bricks game, paddle and ball game online, retro brick buster",
    "canonicalUrl": "https://converterallai.com/games/brick-breaker",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Brick Breaker Arcade",
      "url": "https://converterallai.com/games/brick-breaker",
      "gamePlatform": "Web Browser",
      "genre": "Arcade, Retro",
      "playMode": "SinglePlayer"
    }
  },
  "/games/pong": {
    "title": "Retro Pong Game – Classic 2-Paddle Table Tennis Arcade Game In-Browser | ConverterAllAI",
    "description": "Play the original retro Pong video game. Move your paddle to deflect the ball past your opponent. Fast-paced 1970s arcade table tennis nostalgia.",
    "keywords": "pong game, retro pong arcade, play pong online free, classic table tennis game, 2 player pong",
    "canonicalUrl": "https://converterallai.com/games/pong",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Retro Pong Game",
      "url": "https://converterallai.com/games/pong",
      "gamePlatform": "Web Browser",
      "genre": "Sports, Arcade, Retro",
      "playMode": "SinglePlayer, MultiPlayer"
    }
  },
  "/about": {
    "title": "About ConverterAllAI – 100% Client-Side In-Browser Conversion Platform | ConverterAllAI",
    "description": "Learn about ConverterAllAI mission: delivering private, serverless, WebAssembly-powered tools for PDFs, audio, images, calculators, and developer workflows.",
    "keywords": "about converterallai, client side conversion, wasm tools, private file converter, safe online converter",
    "canonicalUrl": "https://converterallai.com/about",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About ConverterAllAI",
      "url": "https://converterallai.com/about",
      "description": "About ConverterAllAI mission and zero-server client-side architecture."
    }
  },
  "/contact": {
    "title": "Contact Us – Support, Feature Suggestions & Inquiries | ConverterAllAI",
    "description": "Get in touch with the ConverterAllAI team for questions, tool requests, partnership inquiries, or technical support. We respond quickly.",
    "keywords": "contact converterallai, support, feedback, bug report, feature request",
    "canonicalUrl": "https://converterallai.com/contact",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact ConverterAllAI",
      "url": "https://converterallai.com/contact",
      "description": "Customer support and developer contact channels."
    }
  },
  "/privacy-policy": {
    "title": "Privacy Policy – Zero Data Collection & 100% In-Browser Security | ConverterAllAI",
    "description": "Read the ConverterAllAI Privacy Policy: We do not store, upload, or inspect your files. All operations execute strictly in your browser via WebAssembly and Web APIs.",
    "keywords": "privacy policy, zero data retention, client side privacy, file privacy, gdpr compliance",
    "canonicalUrl": "https://converterallai.com/privacy-policy",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ConverterAllAI Privacy Policy",
      "url": "https://converterallai.com/privacy-policy",
      "description": "Complete transparency regarding user privacy and client-side processing."
    }
  },
  "/terms-of-service": {
    "title": "Terms of Service – Free & Secure Tool Usage Agreement | ConverterAllAI",
    "description": "Review the Terms of Service for using ConverterAllAI. Understand user rights, acceptable usage, intellectual property, and warranty disclaimers.",
    "keywords": "terms of service, terms of use, converterallai terms, user agreement",
    "canonicalUrl": "https://converterallai.com/terms-of-service",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ConverterAllAI Terms of Service",
      "url": "https://converterallai.com/terms-of-service",
      "description": "Terms of service agreement for using the ConverterAllAI platform."
    }
  },
  "/disclaimer": {
    "title": "Disclaimer – Educational, Financial & General Tool Disclaimers | ConverterAllAI",
    "description": "Legal disclaimer for ConverterAllAI: Information and calculator outputs are for general educational purposes. No financial, medical, or legal warranty.",
    "keywords": "disclaimer, legal disclaimer, financial disclaimer, calculator disclaimer",
    "canonicalUrl": "https://converterallai.com/disclaimer",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ConverterAllAI Legal Disclaimer",
      "url": "https://converterallai.com/disclaimer",
      "description": "Educational disclaimer for tools and calculator outputs."
    }
  },
  "/cookie-policy": {
    "title": "Cookie Policy – Privacy-Centric Cookie Information | ConverterAllAI",
    "description": "Learn how ConverterAllAI uses minimal essential cookies and local storage strictly to remember your UI theme preferences and game state.",
    "keywords": "cookie policy, cookies, browser storage, tracking cookies",
    "canonicalUrl": "https://converterallai.com/cookie-policy",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ConverterAllAI Cookie Policy",
      "url": "https://converterallai.com/cookie-policy",
      "description": "Explanation of cookies and local storage usage on ConverterAllAI."
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private router = inject(Router);
  private document = inject(DOCUMENT);

  init(): void {
    // Immediately set SEO for initial route
    this.updateSeoForRoute(this.router.url || '/');

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.updateSeoForRoute(navEvent.urlAfterRedirects || navEvent.url);
      });
  }

  updateSeoForRoute(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const seoData = ROUTE_SEO_MAP[cleanUrl];

    if (seoData) {
      this.updateTags(seoData);
    } else {
      // Intelligent fallback
      this.updateTags({
        title: 'ConverterAllAI – Free Online Converter & Processing Tools',
        description: 'All-in-one free online tools for PDFs, images, audio, calculations, games, and developer utilities. 100% in-browser processing — private, fast, and reliable.',
        keywords: 'online converter, free pdf tools, image tools, audio editor, calculators, developer tools',
        canonicalUrl: `https://converterallai.com${cleanUrl === '/' ? '' : cleanUrl}`
      });
    }
  }

  updateTags(data: SeoData): void {
    this.titleService.setTitle(data.title);

    this.metaService.updateTag({ name: 'description', content: data.description });

    if (data.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: data.title });
    this.metaService.updateTag({ property: 'og:description', content: data.description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'ConverterAllAI' });

    const ogImg = data.ogImage || 'https://converterallai.com/images/home.png';
    this.metaService.updateTag({ property: 'og:image', content: ogImg });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: data.title });
    this.metaService.updateTag({ name: 'twitter:description', content: data.description });
    this.metaService.updateTag({ name: 'twitter:image', content: ogImg });

    // Canonical link & Schema.org JSON-LD
    if (this.document) {
      const pathOnly = this.router.url.split('?')[0].split('#')[0];
      const canonicalHref = data.canonicalUrl || `https://converterallai.com${pathOnly === '/' ? '' : pathOnly}`;
      let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head?.appendChild(link);
      }
      link.setAttribute('href', canonicalHref);

      const existingScript = this.document.getElementById('seo-json-ld');
      if (data.jsonLd) {
        let script = existingScript as HTMLScriptElement;
        if (!script) {
          script = this.document.createElement('script');
          script.id = 'seo-json-ld';
          script.type = 'application/ld+json';
          this.document.head?.appendChild(script);
        }
        script.text = JSON.stringify(data.jsonLd);
      } else if (existingScript) {
        existingScript.remove();
      }
    }
  }
}
