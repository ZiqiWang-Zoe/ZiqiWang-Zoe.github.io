// Single source for identity details used across pages and structured data.
export const site = {
  name: 'Ziqi Wang',
  // TODO(Ziqi): confirm which address recruiters should use. Profile switched to gmail on 2026-08-10.
  email: 'zoewangzq2001@gmail.com',
  linkedin: 'https://linkedin.com/in/ziqiwang-zoe',
  github: 'https://github.com/ZiqiWang-Zoe',
  arxiv: 'https://arxiv.org/abs/2509.00761',
  scholar: 'https://scholar.google.com/citations?user=k0ZmsF4AAAAJ&hl=en',
  resume: '/Ziqi-Resume.pdf',
  // Weekly newsletter on beehiiv. The subscribe link appears once url is set.
  newsletter: { name: 'Silicon to Serving', url: 'https://silicontoserving.beehiiv.com/subscribe?utm_source=site&utm_medium=referral&utm_campaign=home' },
  description:
    'Ziqi Wang is a technical marketer in the San Francisco Bay Area and a Technical Marketing Intern at Futurewei. She holds an M.S. in Digital Social Media from USC and is a co-first author of L-MARS.',
};

// Placeholders mark content Ziqi still has to supply. Flip to false before merging to main,
// which hides every <Placeholder /> instead of shipping "TODO" boxes to recruiters.
export const SHOW_PLACEHOLDERS = false;

// Writing: drafts appear only in `npm run dev`, so they can be reviewed locally before going live.
export const showDraft = (status: string) => import.meta.env.DEV || status === 'published';
