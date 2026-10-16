import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      metric: z.string().optional(),
      metricLabel: z.string().optional(),
      org: z.string(),
      period: z.string(),
      role: z.string(),
      order: z.number(),
      // featured: a large card on the home page. Others go in the compact "More work" list.
      featured: z.boolean().default(false),
      // planned: the work itself does not exist yet. draft: work exists, write-up incomplete.
      status: z.enum(['ready', 'draft', 'planned']),
      todo: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      // contain: show the whole image on a soft backdrop (screenshots, posters).
      coverFit: z.enum(['contain', 'cover']).default('contain'),
    }),
});

export const collections = { work };
