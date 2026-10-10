import { Megaphone, Users } from 'lucide-react';

const leadershipExperiences = [
  {
    icon: Megaphone,
    title: 'Marketing & Proceedings Volunteer',
    company: 'CASPA · Semiconductor Industry Community',
    period: '2026 – Present',
    description: 'Contribute to event communications through CASPA’s marketing and proceedings teams. Current work supports ACDB 2026, the Annual Conference & Dinner Banquet.',
    achievements: [
      'Promote CASPA events for the semiconductor community.',
      'Edit event-related videos for the marketing team.',
      'Support the yearbook and related documentation with the proceedings team.',
    ],
    tools: ['Event Communications', 'Video Editing', 'Yearbook', 'Documentation'],
  },
  {
    icon: Users,
    title: 'Co-Founder/President of school social group',
    company: 'Choom, Champaign, IL',
    period: 'Aug. 2022 – Present',
    description: 'Assembled and led a 50-member dance crew at University of Illinois Urbana-Champaign.',
    achievements: [
      'Assembled leadership of a 50-member dance crew, promoting its presence in University of Illinois Urbana-Champaign.',
      'Raised funds and cultivated numerous social media presence, ensuring the crew\'s sustained success.',
    ],
    tools: ['Team Leadership', 'Fundraising', 'Social Media'],
  },
];

export function LeadershipSection() {
  return (
    <section id="leadership" className="section-spacing bg-secondary/30">
      <div className="container-main">
        <div className="section-header">
          <span className="section-label">Leadership</span>
          <h2 className="section-title">Leadership & Volunteering</h2>
          <p className="section-description">
            Contributions to industry communities and campus organizations.
          </p>
        </div>

        <div className="space-y-6">
          {leadershipExperiences.map((exp) => (
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
