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
  description:
    'Ziqi Wang is a technical marketer in the San Francisco Bay Area. Technical Marketing at Futurewei, M.S. Digital Social Media at USC, co-first author of L-MARS.',
};

// Placeholders mark content Ziqi still has to supply. Flip to false before merging to main,
// which hides every <Placeholder /> instead of shipping "TODO" boxes to recruiters.
export const SHOW_PLACEHOLDERS = false;
