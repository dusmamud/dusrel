import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Public docs (/docs/) — content lives in Markdown so adding a doc is one
// .md file + one line in src/data/docs.ts. Build-time collections: pages are
// prerendered, so docs are fast static HTML with no runtime cost.
const docSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(['guides', 'tools', 'apps', 'concepts']),
  type: z.enum(['tutorial', 'how-to', 'reference', 'explanation']),
  updated: z.string(),
  draft: z.boolean().default(false),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs/en' }),
  schema: docSchema,
});

// Hindi translations, same slugs as the English originals. A doc with no Hindi
// file simply has no /hi/docs/ page — it is never faked with English content.
const docsHi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs/hi' }),
  schema: docSchema,
});

export const collections = { docs, docsHi };
