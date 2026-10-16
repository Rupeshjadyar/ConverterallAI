import fs from 'fs';
import path from 'path';

// Validation helper
export function validateAndFormat(tools) {
  const seenSlugs = new Set();
  const seenIds = new Set();
  const seenTitles = new Set();
  const seenDescriptions = new Set();

  for (const t of tools) {
    if (seenSlugs.has(t.slug)) throw new Error(`Duplicate slug: ${t.slug}`);
    seenSlugs.add(t.slug);

    if (seenIds.has(t.id)) throw new Error(`Duplicate id: ${t.id}`);
    seenIds.add(t.id);

    if (seenTitles.has(t.seoTitle)) throw new Error(`Duplicate title: ${t.seoTitle}`);
    seenTitles.add(t.seoTitle);

    if (seenDescriptions.has(t.seoDescription)) throw new Error(`Duplicate description: ${t.seoDescription}`);
    seenDescriptions.add(t.seoDescription);

    if (t.seoTitle.length > 60) {
      throw new Error(`Title too long (${t.seoTitle.length}): "${t.seoTitle}" on ${t.id}`);
    }
    if (t.seoDescription.length < 140 || t.seoDescription.length > 165) {
      throw new Error(`Description invalid length (${t.seoDescription.length}): "${t.seoDescription}" on ${t.id}`);
    }
    if (!t.h1 || t.h1.trim().length === 0) throw new Error(`Missing h1 on ${t.id}`);
    if (!t.intro || t.intro.trim().length === 0) throw new Error(`Missing intro on ${t.id}`);
    if (!t.howToSteps || t.howToSteps.length < 3 || t.howToSteps.length > 5) {
      throw new Error(`howToSteps count invalid (${t.howToSteps?.length}) on ${t.id}`);
    }
    if (!t.features || t.features.length < 3 || t.features.length > 5) {
      throw new Error(`features count invalid (${t.features?.length}) on ${t.id}`);
    }
    if (!t.faqs || t.faqs.length < 4 || t.faqs.length > 6) {
      throw new Error(`faqs count invalid (${t.faqs?.length}) on ${t.id}`);
    }
    if (!t.relatedToolPaths || t.relatedToolPaths.length < 3 || t.relatedToolPaths.length > 6) {
      throw new Error(`relatedToolPaths count invalid (${t.relatedToolPaths?.length}) on ${t.id}`);
    }
  }

  console.log(`Successfully verified all ${tools.length} tools!`);
}
