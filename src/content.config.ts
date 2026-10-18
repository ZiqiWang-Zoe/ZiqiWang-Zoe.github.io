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
      // contain: tall screenshot cropped at the bottom. cover: landscape image shown whole and centered.
      coverFit: z.enum(['contain', 'cover']).default('contain'),
      // Card styling on the home grid.
      tint: z.enum(['gray', 'blue', 'ink']).default('gray'),
      wide: z.boolean().default(false),
      // Publications: shown on the card as live text beside the cover figure.
      paper: z
        .object({ title: z.string(), authors: z.string(), venue: z.string() })
        .optional(),
    }),
});

const writing = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    // draft: only in local dev. published: on the live site, the home page and the sitemap.
    status: z.enum(['draft', 'published']),
    beehiiv: z.string().default(''),
  }),
});

export const collections = { work, writing };
