import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SHOW_PLACEHOLDERS } from '../site';

// Served at /sitemap.xml, the URL already submitted to Google Search Console.
export const GET: APIRoute = async ({ site }) => {
  const work = (await getCollection('work')).filter(
    (w) => SHOW_PLACEHOLDERS || w.data.status !== 'planned',
  );
  const writing = (await getCollection('writing')).filter((p) => p.data.status === 'published');
  const paths = ['/', ...work.map((w) => `/work/${w.id}/`), ...writing.map((p) => `/writing/${p.id}/`)];
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
