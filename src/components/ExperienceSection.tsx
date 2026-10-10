import { Briefcase, Building2, GraduationCap } from 'lucide-react';

const experiences = [
  {
    icon: Briefcase,
    title: 'Technical Marketing',
    company: 'Futurewei Technologies · Santa Clara, CA',
    period: 'Jun. 2026 – Present',
    description: 'Research semiconductor markets for the Ecosystem Development team. Develop technical content and build tools that support the lab’s daily work.',
    achievements: [
      'Distill 30+ weekly industry-news items into market insight reports to support technical planning.',
      'Create 10+ technical marketing materials for partners and prospects, including educational content on foundry business models and chip fabrication.',
      'Built Daily News Push in Python to deliver approximately eight semiconductor stories to the IC lab each morning through Outlook.',
      'Support weekly outreach to 100+ industry leaders and partners in coordination with engineering and ecosystem-development teams.',
    ],
    tools: ['Semiconductor Research', 'Technical Marketing', 'Python Automation', 'Claude Code'],
    workLink: '?project=news#projects',
    workLabel: 'Explore Daily News Push',
  },
  {
    icon: Building2,
    title: 'Social Media Intern',
    company: 'Echobend',
    period: 'Sep. 2024 – Feb. 2025',
    description: 'Executed and optimized multi-platform social media content and campaigns across multiple client accounts, supporting influencer initiatives and performance analysis.',
    achievements: [
      'Executed end-to-end social media content strategies across multiple platforms including Meta Ads (Facebook and Instagram) and Website Traffic Campaign, driving an 11.7% increase in overall audience engagement.',
      'Increased average short-form video views from ~1K to 7K per post through data-driven content optimization and trend analysis.',
      'Supported influencer marketing initiatives by coordinating content execution and campaign rollouts involving macro influencers and celebrity partners (e.g., Sydney Sweeney, Rosé, Mariah Carey, Conan Gray).',
      'Monitored performance metrics and iterated creative strategies to improve brand visibility and audience retention.',
    ],
    tools: ['Meta Ads Manager', 'Content Scheduling Tools', 'Analytics Platforms'],
  },
  {
    icon: Briefcase,
    title: 'Marketing Intern (B2B & Growth)',
    company: 'CambioML',
    period: 'Sep. 2024 – Feb. 2025',
    description: 'Supported growth marketing initiatives for a B2B technology company. Focused on content marketing, lead generation, and market research.',
    achievements: [
      'Generated a database of 100+ potential B2B partners in the Bay Area, supporting business growth.',
      'Supported recruitment of 10 software engineer interns through integrated tech + social campaigns.',
      'Improved SEO, achieving a 12% increase in backlinks and ~15% weekly growth in website reach.',
    ],
    tools: ['Google Ads', 'SEO Tools', 'CRM Systems'],
  },
  {
    icon: Briefcase,
    title: 'Digital Media Assistant',
    company: 'University Payroll & Benefit, Illinois, U.S.',
    period: 'Aug. 2023 – May 2024',
    description: 'Supported video production documentation, digital media refinement, and internal communication at a university administrative office.',
    achievements: [
      'Translated complex video production workflows into clear operational documentation, improving internal process efficiency.',
      'Reviewed and refined digital media and administrative documents to enhance clarity, consistency, and usability.',
      'Supported internal communication and documentation management using Microsoft Excel, OneNote, and Teams.',
    ],
    tools: ['Microsoft Excel', 'OneNote', 'Microsoft Teams'],
  },
  {
    icon: GraduationCap,
    title: 'Research Assistant',
    company: 'UIUC',
    period: ['Academic', 'Dec. 2022 – May 2024'],
    description: 'Conducted research on consumer behavior and marketing communications. Applied quantitative and qualitative research methods.',
    achievements: [
      'Assisting in a VR project focused on the Proteus effect\'s impact on self-efficacy during exercise.',
      'Conducting experiments, collecting data, and exploring the relationship between avatar appearance & gym interaction.',
      'Strengthening communication skills through close collaboration with professors and research partners.',
      'Developing proficiency in technical writing and digital technology design.',
    ],
    tools: ['R', 'SPSS', 'Survey Design', 'AI Agent'],
  },
  {
    icon: Briefcase,
    title: 'Advertising Campaigner/Sales Team',
    company: 'Amazon & GO, Illinois, U.S.',
    period: 'Aug. 2022 – Dec. 2022',
    description: 'Designed and executed advertising campaigns for consumer products, optimizing ad spend and driving sales growth.',
    achievements: [
      'Designed and executed campaigns for Acure\'s "Incredibly Clear" product.',
      'Optimized ad spend, driving a 20% increase in traffic & CTR.',
      'Achieved the $2000 budget and sales goal, contributing to about 10% increase in sales within a 4-month period.',
    ],
    tools: ['Amazon Ads', 'Campaign Analytics', 'Sales Tracking'],
  },
  {
    icon: Briefcase,
    title: 'Brand Representative/Group Leader',
    company: 'Abercrombie & Fitch, Beijing, China',
    period: 'Apr. 2021 – Jul. 2021',
    description: 'Led team in media promotion and event planning to drive brand awareness and sales.',
    achievements: [
      'Collaborated with a team to devise and execute media-promotion strategies.',
      'Conducted innovative event planning to increase awareness of new products, resulting in a 30% increase in sales.',
      'Achieved first prize in the store\'s seasonal sale competition, expanding the team from 5 to 8 members.',
    ],
    tools: ['Event Planning', 'Team Leadership', 'Sales Strategy'],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="section-spacing">
      <div className="container-main">
        <div className="section-header">
          <span className="section-label">Experience</span>
          <h2 className="section-title">Professional Journey</h2>
          <p className="section-description">
            Experience in technical marketing, digital campaigns and academic research.
          </p>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={exp.title + exp.company} className="card-base card-hover">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <exp.icon size={24} className="text-primary" />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                        {exp.title}
                      </h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(exp.period) ? exp.period : [exp.period]).map((p) => (
                        <span key={p} className="tag">{p}</span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{exp.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  
                  {exp.workLink && <a href={exp.workLink} className="inline-flex text-sm font-medium text-primary hover:underline mb-4">{exp.workLabel} ↗</a>}
                  <div className="flex flex-wrap gap-2">
                    {exp.tools.map((tool) => (
                      <span key={tool} className="tag text-xs">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
