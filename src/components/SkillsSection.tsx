import { BarChart3, Palette, Code, Wrench } from 'lucide-react';

const skillCategories = [
  {
    icon: BarChart3,
    title: 'Strategy & Analysis',
    skills: [
      'Social Media Strategy',
      'Content Optimization',
      'Performance Tracking',
      'SEO Fundamentals',
      'Semiconductor Market Research',
    ],
  },
  {
    icon: Palette,
    title: 'Marketing & Creative',
    skills: [
      'Influencer Marketing',
      'Campaign Management',
      'Brand Development',
      'Content Creation',
      'Technical Content',
    ],
  },
  {
    icon: Wrench,
    title: 'Tools & Platforms',
    skills: [
      'Meta Ads Manager',
      'Google Ads',
      'Adobe Creative Suite',
      'Microsoft Office',
      'Claude Code',
    ],
  },
  {
    icon: Code,
    title: 'Data & Technical',
    skills: [
      'Python Workflow Automation',
      'R (Basic)',
      'Analytics Platforms',
      'Survey Design',
    ],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="section-spacing">
      <div className="container-main">
        <div className="section-header">
          <span className="section-label">Skills</span>
          <h2 className="section-title">Capabilities</h2>
          <p className="section-description">
            Core competencies developed through education, work experience, and personal projects.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category) => (
            <div key={category.title} className="card-base">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                <category.icon size={20} className="text-primary" />
              </div>
              
              <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {category.title}
              </h3>
              
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
