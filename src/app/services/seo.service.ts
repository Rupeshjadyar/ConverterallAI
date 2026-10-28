import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SITE_DOMAIN, SITE_BRAND, DEFAULT_OG_IMAGE } from '../data/seo.config';
import { ToolItem } from '../data/tools.data';
import { CategoryItem } from '../data/categories.data';
import { ToolRegistryService } from './tool-registry.service';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  robots?: 'index, follow' | 'noindex, nofollow' | 'noindex, follow';
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  locale?: string;
  jsonLd?: object | object[];
}

const STATIC_ROUTE_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'Free Online Tools - PDF, Audio & Code | ConverterAllAI',
    description: 'All-in-one free browser toolkit: Merge & edit PDFs, convert images, cut audio, format JSON, learn SQL, play web games, and calculate finances with 100% privacy.',
    keywords: 'free online tools, pdf tools, image converter, audio tools, emi calculator, json formatter, web games',
    canonical: SITE_DOMAIN,
    robots: 'index, follow'
  },
  '/about': {
    title: 'About ConverterAllAI - Private Web Tools | ConverterAllAI',
    description: 'Learn about ConverterAllAI\'s mission to provide 100% private, free, in-browser digital tools. No file uploads, no tracking, and zero subscription paywalls.',
    keywords: 'about converterallai, client-side tools, private web tools, in-browser converters',
    canonical: `${SITE_DOMAIN}/about`,
    robots: 'index, follow'
  },
  '/contact': {
    title: 'Contact ConverterAllAI - Support & Feedback | ConverterAllAI',
    description: 'Contact the ConverterAllAI team for questions, tool suggestions, bug reports, and partnership inquiries. We are here to support your daily digital workflows.',
    keywords: 'contact converterallai, tool support, bug report, feedback online tools',
    canonical: `${SITE_DOMAIN}/contact`,
    robots: 'index, follow'
  },
  '/privacy-policy': {
    title: 'Privacy Policy - 100% In-Browser Privacy | ConverterAllAI',
    description: 'Read ConverterAllAI\'s strict privacy policy. Learn how our browser-based client-side tools protect your sensitive documents, photos, and personal information.',
    keywords: 'privacy policy, client side privacy, in-browser security, no upload policy',
    canonical: `${SITE_DOMAIN}/privacy-policy`,
    robots: 'index, follow'
  },
  '/ai-chat': {
    title: 'Free AI Chat - Groq & Gemini Auto-Failover | ConverterAllAI',
    description: 'Chat with top free-tier AI models: Groq (14.4k RPD), Google Gemini (1.5k RPD), OpenRouter, and Hugging Face. Includes automated 429 rate-limit failover and clean code syntax highlighting.',
    keywords: 'free ai chat, groq playground, gemini flash free, openrouter deepseek r1, ai failover, ai code generator',
    canonical: `${SITE_DOMAIN}/ai-chat`,
    robots: 'index, follow'
  },
  '/terms-of-service': {
    title: 'Terms of Service - Free Web Utilities | ConverterAllAI',
    description: 'Read the Terms of Service for using ConverterAllAI. Understand our fair usage terms, open browser utilities, and intellectual property rights online for free.',
    keywords: 'terms of service, terms of use, converterallai terms, free tools policy',
    canonical: `${SITE_DOMAIN}/terms-of-service`,
    robots: 'index, follow'
  },
  '/disclaimer': {
    title: 'Disclaimer - Online Calculators & Tools | ConverterAllAI',
    description: 'Review the general disclaimer for ConverterAllAI tools and calculators. Information and calculations are provided for general educational guidance online.',
    keywords: 'disclaimer, calculator accuracy, financial tool disclaimer, legal notice',
    canonical: `${SITE_DOMAIN}/disclaimer`,
    robots: 'index, follow'
  },
  '/cookie-policy': {
    title: 'Cookie Policy - Local Storage & Cookies | ConverterAllAI',
    description: 'Understand how ConverterAllAI uses cookies and local browser storage to save your preferences, theme settings, and tool state with complete transparency.',
    keywords: 'cookie policy, local storage usage, browser cookie settings, tracking transparency',
    canonical: `${SITE_DOMAIN}/cookie-policy`,
    robots: 'index, follow'
  },
  '/dashboard': {
    title: 'Dashboard & Telemetry Matrix | ConverterAllAI',
    description: 'Internal telemetry metrics, browser execution stats, and visitor analytics. Private administrative overview and performance monitoring for ConverterAllAI.',
    keywords: 'dashboard, telemetry, analytics matrix, internal metrics',
    canonical: `${SITE_DOMAIN}/dashboard`,
    robots: 'noindex, nofollow'
  },
  '/404': {
    title: '404 Page Not Found - ConverterAllAI',
    description: 'The page you requested could not be found. Explore our free online PDF tools, image converters, audio editors, games, and calculators on the ConverterAllAI home.',
    canonical: `${SITE_DOMAIN}/404`,
    robots: 'noindex, nofollow'
  },
  // SQL Tutorial Sub-Chapters
  '/developer-tools/sql/intro': {
    title: 'Intro to MySQL & RDBMS - Database Basics | ConverterAllAI',
    description: 'Learn the fundamentals of Data, Database, DBMS vs RDBMS, tables, fields, tuples, and SQL architecture online for free with interactive schema explanations.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/intro`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/syntax': {
    title: 'SQL Syntax & Commands - DDL DML DQL Guide | ConverterAllAI',
    description: 'Master SQL command types (DDL, DML, DQL, DCL, TCL), arithmetic operators, boolean truth tables, and query expressions with practical examples and syntax.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/syntax`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/data-types': {
    title: 'MySQL Data Types Guide - Storage Formats | ConverterAllAI',
    description: 'Complete reference to MySQL data types: INT, BIGINT, DECIMAL, CHAR vs VARCHAR, DATE, and DATETIME with byte sizes, precision rules, and storage specs.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/data-types`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/constraints': {
    title: 'SQL Constraints Guide - Primary Keys | ConverterAllAI',
    description: 'Understand SQL integrity constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, and DEFAULT with column-level and table-level syntax rules.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/constraints`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/ddl': {
    title: 'SQL DDL Commands - CREATE ALTER DROP Table | ConverterAllAI',
    description: 'Master Data Definition Language in MySQL: CREATE DATABASE, CREATE TABLE, ALTER TABLE, RENAME, and TRUNCATE vs DROP table with full rollback safety rules.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/ddl`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/dml': {
    title: 'SQL DML Commands - INSERT UPDATE DELETE | ConverterAllAI',
    description: 'Learn Data Manipulation Language in MySQL: INSERT single and multi-row records, UPDATE with WHERE clause, and DELETE rows with transactional integrity.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/dml`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/dql': {
    title: 'SQL DQL & SELECT - WHERE LIKE ORDER BY | ConverterAllAI',
    description: 'Master Data Query Language: SELECT DISTINCT, WHERE filters, AND/OR/NOT, BETWEEN ranges, IN sets, LIKE wildcards, ORDER BY, and LIMIT with live queries.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/dql`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/dcl': {
    title: 'SQL DCL Commands - GRANT & REVOKE Access | ConverterAllAI',
    description: 'Master Data Control Language in MySQL: GRANT and REVOKE user privileges, security roles, fine-grained access control, and user account authorization.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/dcl`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/tcl': {
    title: 'SQL TCL Commands - COMMIT & ROLLBACK | ConverterAllAI',
    description: 'Understand Transaction Control Language in MySQL: ACID principles, START TRANSACTION, COMMIT persistence, ROLLBACK undos, and SAVEPOINT state markers.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/tcl`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/joins': {
    title: 'Visual SQL Joins Guide - Venn Diagrams | ConverterAllAI',
    description: 'Interactive guide to SQL Joins with Venn diagrams: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN via UNION, CROSS JOIN, and SELF JOIN with examples.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/joins`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/functions': {
    title: 'MySQL Functions Reference - String & Math | ConverterAllAI',
    description: 'Comprehensive MySQL functions reference: CONCAT, SUBSTR, UPPER, ROUND, NOW, DATEDIFF, COUNT, SUM, AVG, and IFNULL with clear syntax and practical queries.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/functions`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/group-by': {
    title: 'SQL GROUP BY & HAVING - Aggregation Guide | ConverterAllAI',
    description: 'Deep dive into SQL group aggregations: GROUP BY syntax, multi-column grouping, aggregate functions, and the key differences between HAVING and WHERE.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/group-by`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/subqueries': {
    title: 'SQL Subqueries Guide - Nested SQL Queries | ConverterAllAI',
    description: 'Master nested queries in MySQL: Single-row subqueries, multi-row operators (IN, ANY, ALL), and subqueries inside INSERT, UPDATE, and DELETE operations.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/subqueries`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/foreign-keys': {
    title: 'Foreign Keys Guide - ON DELETE CASCADE | ConverterAllAI',
    description: 'Learn relational referential integrity: Parent and child tables, FOREIGN KEY definitions, ON DELETE CASCADE, ON UPDATE CASCADE, RESTRICT, and SET NULL.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/foreign-keys`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/views': {
    title: 'SQL Views Tutorial - Virtual Tables Guide | ConverterAllAI',
    description: 'Understand virtual tables in MySQL: CREATE VIEW, querying views, updatable views with WITH CHECK OPTION, security advantages, and DROP VIEW syntax.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/views`,
    robots: 'index, follow'
  },
  '/developer-tools/sql/playground': {
    title: 'Interactive SQL Sandbox - Run SQL Online | ConverterAllAI',
    description: 'Write and execute real SQL SELECT, JOIN, GROUP BY, and DML queries directly in your browser with pre-seeded relational datasets and live execution.',
    canonical: `${SITE_DOMAIN}/developer-tools/sql/playground`,
    robots: 'index, follow'
  }
};

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private router = inject(Router);
  private toolRegistry = inject(ToolRegistryService);

  private isInitialized = false;

  /**
   * Initializes router navigation listener to apply SEO automatically to every page
   */
  init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Apply SEO for current initial URL
    this.handleRouteSeo(this.router.url);

    // Subscribe to future navigation events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.handleRouteSeo(event.urlAfterRedirects || event.url);
      });
  }

  /**
   * Main update method: sets title, meta description, keywords, robots, canonical, OG, Twitter, and JSON-LD
   */
  update(config: SeoConfig): void {
    // 1. Page Title
    this.titleService.setTitle(config.title);

    // 2. Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    }
    const robots = config.robots || 'index, follow';
    this.metaService.updateTag({ name: 'robots', content: robots });

    // 3. Canonical URL (Absolute, no trailing slash, no query params)
    const cleanCanonical = this.cleanUrl(config.canonical || SITE_DOMAIN);
    this.setCanonicalUrl(cleanCanonical);

    // 4. Open Graph Tags
    const ogType = config.ogType || 'website';
    const ogImg = config.ogImage || DEFAULT_OG_IMAGE;
    const ogUrl = config.ogUrl ? this.cleanUrl(config.ogUrl) : cleanCanonical;
    const locale = config.locale || 'en_US';

    this.metaService.updateTag({ property: 'og:site_name', content: SITE_BRAND });
    this.metaService.updateTag({ property: 'og:type', content: ogType });
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:url', content: ogUrl });
    this.metaService.updateTag({ property: 'og:image', content: ogImg });
    this.metaService.updateTag({ property: 'og:locale', content: locale });

    // 5. Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    this.metaService.updateTag({ name: 'twitter:image', content: ogImg });

    // 6. JSON-LD Structured Data
    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    } else {
      this.removeJsonLd();
    }
  }

  /**
   * Compatibility alias for older component calls
   */
  updateTags(data: Partial<SeoConfig> & { canonicalUrl?: string; jsonLd?: any }): void {
    this.update({
      title: data.title || 'ConverterAllAI',
      description: data.description || '',
      keywords: data.keywords,
      canonical: data.canonicalUrl || data.canonical,
      ogImage: data.ogImage,
      robots: data.robots,
      jsonLd: data.jsonLd
    });
  }

  /**
   * Applies complete SEO metadata for any tool
   */
  applyToolSeo(tool: ToolItem): void {
    const category = this.toolRegistry.getCategoryById(tool.categoryId);
    const categoryName = category?.name || 'Tools';
    const categorySlug = category?.slug || '/';

    const toolUrl = `${SITE_DOMAIN}${tool.slug}`;

    const appSchema = this.buildSoftwareApplicationSchema(tool);
    const breadcrumbSchema = this.buildBreadcrumbListSchema([
      { name: 'Home', url: SITE_DOMAIN },
      { name: categoryName, url: `${SITE_DOMAIN}${categorySlug}` },
      { name: tool.name, url: toolUrl }
    ]);
    const faqSchema = this.buildFaqPageSchema(tool.faqs);
    const howToSchema = this.buildHowToSchema(tool);

    this.update({
      title: tool.seoTitle,
      description: tool.seoDescription,
      keywords: tool.keywords,
      canonical: toolUrl,
      robots: 'index, follow',
      ogType: 'website',
      jsonLd: [appSchema, breadcrumbSchema, faqSchema, howToSchema]
    });
  }

  /**
   * Applies complete SEO metadata for any category landing page
   */
  applyCategorySeo(category: CategoryItem): void {
    const categoryUrl = `${SITE_DOMAIN}${category.slug}`;
    const tools = this.toolRegistry.getToolsByCategory(category.id);

    const breadcrumbSchema = this.buildBreadcrumbListSchema([
      { name: 'Home', url: SITE_DOMAIN },
      { name: category.name, url: categoryUrl }
    ]);
    const itemListSchema = this.buildItemListSchema(category, tools);

    this.update({
      title: category.seoTitle,
      description: category.seoDescription,
      canonical: categoryUrl,
      robots: 'index, follow',
      ogType: 'website',
      jsonLd: [breadcrumbSchema, itemListSchema]
    });
  }

  // ==================== ROUTE RESOLUTION ====================

  private handleRouteSeo(rawUrl: string): void {
    if (!rawUrl) rawUrl = '/';
    const cleanPath = rawUrl.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

    // 1. Check Homepage
    if (cleanPath === '/' || cleanPath === '/home') {
      const homeConfig = STATIC_ROUTE_SEO['/'];
      const websiteSchema = this.buildWebSiteSchema();
      const orgSchema = this.buildOrganizationSchema();
      this.update({
        ...homeConfig,
        jsonLd: [websiteSchema, orgSchema]
      });
      return;
    }

    // 2. Check Static and Legal Routes
    if (STATIC_ROUTE_SEO[cleanPath]) {
      const staticConf = STATIC_ROUTE_SEO[cleanPath];
      const breadcrumb = this.buildBreadcrumbListSchema([
        { name: 'Home', url: SITE_DOMAIN },
        { name: staticConf.title.split('-')[0].trim(), url: `${SITE_DOMAIN}${cleanPath}` }
      ]);
      this.update({
        ...staticConf,
        jsonLd: [breadcrumb]
      });
      return;
    }

    // 3. Check Tools Registry
    const tool = this.toolRegistry.getToolBySlug(cleanPath);
    if (tool) {
      this.applyToolSeo(tool);
      return;
    }

    // 4. Check Categories Registry
    const category = this.toolRegistry.getCategoryBySlug(cleanPath);
    if (category) {
      this.applyCategorySeo(category);
      return;
    }

    // 5. Check TTS Language Slugs (/tts/:slug or /audio-processing/tts/:slug)
    const ttsPrefix = cleanPath.startsWith('/audio-processing/tts/') ? '/audio-processing/tts/' : cleanPath.startsWith('/tts/') ? '/tts/' : null;
    if (ttsPrefix) {
      const slug = cleanPath.slice(ttsPrefix.length);
      import('../data/tts-languages.data').then(({ TTS_LANGUAGES }) => {
        const lang = TTS_LANGUAGES.find(l => l.slug === slug);
        if (lang) {
          const base = `${lang.lang} (${lang.country})`;
          let pageTitle = `${base} Voice TTS Free - MP3 | ConverterAllAI`;
          if (pageTitle.length > 60) {
            pageTitle = `${base} TTS Free - MP3 | ConverterAllAI`;
          }
          if (pageTitle.length > 60) {
            pageTitle = `${base} Free TTS | ConverterAllAI`;
          }
          if (pageTitle.length > 60) {
            pageTitle = `${lang.lang} (${lang.code}) Free TTS | ConverterAllAI`;
          }

          let pageDesc = `Convert ${lang.lang} text to natural spoken audio with ${lang.country} accent online. Generate realistic speech MP3 files free with zero signup on ConverterAllAI.`;
          if (pageDesc.length > 165) {
            pageDesc = `Convert ${lang.lang} text to speech with ${lang.country} accent online. Generate realistic voice audio MP3 files free with zero signup on ConverterAllAI.`;
          }
          if (pageDesc.length > 165) {
            pageDesc = `Convert ${lang.lang} text to voice with ${lang.country} accent online. Free speech MP3 generator with zero signup on ConverterAllAI tool.`;
          }
          if (pageDesc.length < 140) {
            pageDesc = `Convert ${lang.lang} text to natural spoken audio with ${lang.country} accent online. Generate realistic speech MP3 files free with zero signup on ConverterAllAI web.`;
          }

          const canonicalUrl = `${SITE_DOMAIN}${cleanPath}`;

          const breadcrumbs = this.buildBreadcrumbListSchema([
            { name: 'Home', url: SITE_DOMAIN },
            { name: 'Audio Tools', url: `${SITE_DOMAIN}/audio-processing` },
            { name: 'TTS Voice Studio', url: `${SITE_DOMAIN}/audio-processing/tts` },
            { name: `${lang.lang} (${lang.country}) TTS`, url: canonicalUrl }
          ]);

          this.update({
            title: pageTitle,
            description: pageDesc,
            keywords: `${lang.lang} text to speech, ${lang.country} voice generator, ${lang.code} tts, online text to mp3`,
            canonical: canonicalUrl,
            robots: 'index, follow',
            jsonLd: [breadcrumbs]
          });
        }
      });
      return;
    }

    // 6. Fallback / 404
    this.update({
      title: '404 Page Not Found - ConverterAllAI',
      description: 'The page you requested could not be found. Explore our free online PDF tools, image converters, audio editors, games, and calculators on the ConverterAllAI home.',
      canonical: `${SITE_DOMAIN}/404`,
      robots: 'noindex, nofollow'
    });
  }

  // ==================== SCHEMA HELPERS ====================

  buildWebSiteSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_BRAND,
      url: SITE_DOMAIN,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_DOMAIN}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  buildOrganizationSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_BRAND,
      url: SITE_DOMAIN,
      logo: `${SITE_DOMAIN}/assets/home.jpg`
    };
  }

  buildSoftwareApplicationSchema(tool: ToolItem): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      url: `${SITE_DOMAIN}${tool.slug}`,
      description: tool.shortDesc,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      featureList: tool.features
    };
  }

  buildBreadcrumbListSchema(crumbs: { name: string; url: string }[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: this.cleanUrl(crumb.url)
      }))
    };
  }

  buildFaqPageSchema(faqs: { q: string; a: string }[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a
        }
      }))
    };
  }

  buildHowToSchema(tool: ToolItem): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use ${tool.name}`,
      description: tool.intro,
      step: tool.howToSteps.map((step, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: `Step ${idx + 1}`,
        text: step
      }))
    };
  }

  buildItemListSchema(category: CategoryItem, tools: ToolItem[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${category.name} on ${SITE_BRAND}`,
      description: category.description,
      itemListElement: tools.map((t, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: t.name,
        url: `${SITE_DOMAIN}${t.slug}`
      }))
    };
  }

  // ==================== INTERNAL HELPERS ====================

  private cleanUrl(url: string): string {
    if (!url) return SITE_DOMAIN;
    const withoutQuery = url.split('?')[0].split('#')[0];
    const trimmed = withoutQuery.replace(/\/+$/, '');
    return trimmed || SITE_DOMAIN;
  }

  private setCanonicalUrl(canonicalHref: string): void {
    if (!this.document) return;
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head?.appendChild(link);
    }
    link.setAttribute('href', canonicalHref);
  }

  private setJsonLd(data: object | object[]): void {
    if (!this.document) return;
    this.removeJsonLd();

    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'app-json-ld');
    script.textContent = JSON.stringify(data);
    this.document.head?.appendChild(script);
  }

  private removeJsonLd(): void {
    if (!this.document) return;
    const existing = this.document.getElementById('app-json-ld');
    if (existing) {
      existing.remove();
    }
  }
}
