import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    metric: z.string().optional(),
    metricLabel: z.string().optional(),
    org: z.string(),
    period: z.string(),
    role: z.string(),
    order: z.number(),
    // featured: on the home page's Selected Work list. Others go under "More work".
    featured: z.boolean().default(false),
    // planned: the work itself does not exist yet. draft: work exists, write-up incomplete.
    status: z.enum(['ready', 'draft', 'planned']),
    todo: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
});

export const collections = { work };
