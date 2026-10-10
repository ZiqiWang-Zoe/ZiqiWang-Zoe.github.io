import { Target, TrendingUp, Users, Lightbulb } from 'lucide-react';

const strengths = [
  {
    icon: Target,
    title: 'Social Media Strategy',
    description: 'Developing data-informed strategies that drive engagement and growth.',
  },
  {
    icon: TrendingUp,
    title: 'Content Optimization',
    description: 'Creating and refining content for maximum reach and impact.',
  },
  {
    icon: Users,
    title: 'Influencer Marketing',
    description: 'Building partnerships that authentically connect brands with audiences.',
  },
  {
    icon: Lightbulb,
    title: 'Performance Analysis',
    description: 'Translating metrics into actionable insights for continuous improvement.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="section-spacing bg-secondary/30">
      <div className="container-main">
        <div className="section-header">
          <span className="section-label">About Me</span>
          <h2 className="section-title">Background & Expertise</h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="card-base space-y-5">
              <p className="text-foreground text-lg leading-relaxed">
                I'm a digital marketing professional with a background in <span className="highlight-text">Advertising</span> and <span className="highlight-text">Digital Social Media</span>, passionate about using consumer insights to create impactful marketing strategies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                At Futurewei, I research the semiconductor industry and develop technical marketing materials. I also built a Python application that delivers a daily news briefing to the IC lab. My earlier experience includes social campaigns, B2B growth and consumer research.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I have a particular interest in skincare, consumer trust, and marketing in complex or regulated industries—areas where transparency and education are critical to building meaningful customer relationships.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {strengths.map((item) => (
                <div key={item.title} className="card-base card-hover flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
