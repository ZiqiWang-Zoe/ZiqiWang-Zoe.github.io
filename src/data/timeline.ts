// Experience and education for the home-page timeline. Every line traces to
// job-agent/profiles/ziqi/corpus/ or her previous site; nothing here is new.

export interface Entry {
  years: string;
  role: string;
  org: string;
  kind?: string;
  dates: string;
  place: string;
  current?: boolean;
  // Short description. Wrap a phrase in **double stars** to bold it.
  note: string;
  link?: { href: string; text: string };
}

export const experience: Entry[] = [
  {
    years: '2026 - present',
    role: 'Technical Marketing Intern',
    org: 'Futurewei Technologies',
    kind: 'Ecosystem Development',
    dates: 'Jun 2026 - Present',
    place: 'Santa Clara, CA',
    current: true,
    note: 'Turns **30+ industry-news items a week** into market insight reports, writes **10+ whitepapers, case studies and decks** on semiconductor technology, and runs weekly outreach to **100+ partners**. Built the **IC News Daily** briefing with Python and **Claude Code**.',
    link: { href: '/work/daily-news-push/', text: 'IC News Daily case study' },
  },
  {
    years: '2026 - present',
    role: 'Marketing and Proceedings Volunteer',
    org: 'CASPA',
    kind: 'Volunteer',
    dates: '2026 - Present',
    place: 'Bay Area',
    current: true,
    note: 'Event promotion, **video editing** and yearbook work for a Bay Area semiconductor association, including ACDB 2026.',
    link: { href: '/work/caspa/', text: 'CASPA event work' },
  },
  {
    years: '2024 - 2025',
    role: 'Social Media Intern',
    org: 'Echobend',
    kind: 'Internship',
    dates: 'Sep 2024 - Feb 2025',
    place: 'Los Angeles, CA',
    note: 'Ran **Meta Ads** and short-form content across client accounts. Average views grew from **~1K to 7K per post** and engagement rose **11.7%**. Supported influencer campaigns with celebrity partners.',
    link: { href: '/work/echobend-social/', text: 'Short-form and paid social' },
  },
  {
    years: '2024 - 2025',
    role: 'Marketing Intern, B2B and Growth',
    org: 'CambioML',
    kind: 'Internship',
    dates: 'Sep 2024 - Feb 2025',
    place: 'San Jose, CA',
    note: 'SEO and content work that lifted **backlinks 12%** and weekly website reach **~15%**. Built a **100+ company** B2B prospect list and helped recruit 10 engineering interns.',
  },
  {
    years: '2023 - 2024',
    role: 'Digital Media Assistant',
    org: 'University Payroll & Benefits, Illinois',
    kind: 'Part-time',
    dates: 'Aug 2023 - May 2024',
    place: 'Urbana, IL',
    note: 'Documented video production workflows and refined digital media and internal communications.',
  },
  {
    years: '2022 - 2024',
    role: 'UX Researcher',
    org: 'University of Illinois',
    kind: 'Research',
    dates: 'Dec 2022 - May 2024',
    place: 'Urbana, IL',
    note: 'Ran **VR user experiments** on the Proteus effect, studying how avatar design shapes self-efficacy.',
  },
  {
    years: '2022',
    role: 'Advertising Campaigner',
    org: 'Amazon & GO',
    kind: 'Sales team',
    dates: 'Aug 2022 - Dec 2022',
    place: 'Urbana, IL',
    note: 'Ran a **$2,000** campaign for Acure, raising traffic and **CTR 20%** and sales **~10%** in four months.',
  },
  {
    years: '2022 - present',
    role: 'Co-founder and President',
    org: 'Choom dance crew',
    kind: 'Leadership',
    dates: 'Aug 2022 - Present',
    place: 'Champaign, IL',
    note: 'Built and led a **50-member** dance crew at UIUC, including fundraising and its social media.',
  },
  {
    years: '2021',
    role: 'Brand Representative, Group Leader',
    org: 'Abercrombie & Fitch',
    kind: 'Retail',
    dates: 'Apr 2021 - Jul 2021',
    place: 'Beijing, China',
    note: 'Planned new-product events that lifted sales **30%**, and won first prize in the store\'s seasonal sales competition.',
  },
];

export const education: Entry[] = [
  {
    years: '2024 - 2026',
    role: 'M.S. Digital Social Media',
    org: 'University of Southern California',
    dates: 'Aug 2024 - May 2026',
    place: 'Los Angeles, CA',
    note: 'GPA **4.0**. Capstone on consumer trust and ingredient transparency in skincare.',
    link: { href: '/work/skincare-insights/', text: 'Capstone' },
  },
  {
    years: '2020 - 2024',
    role: 'B.S. Advertising, minors in Business and Communication',
    org: 'University of Illinois Urbana-Champaign',
    dates: 'Aug 2020 - May 2024',
    place: 'Urbana-Champaign, IL',
    note: 'GPA **3.90**, Dean\'s List 2021 to 2023.',
  },
];
