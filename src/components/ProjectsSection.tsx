import { lazy, Suspense, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Beaker, Scale, Code2, Cpu, Megaphone } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
const ProjectDetails = lazy(() => import('./ProjectDetails'));

const projects: {
  icon: typeof Beaker;
  title: string;
  category: string;
  context: string;
  role: string;
  actions: string[];
  outcomes: string;
  tags: string[];
  url?: string;
  detail?: string;
}[] = [
  {
    icon: Code2,
    title: 'Daily News Push',
    category: 'Python Automation',
    context: 'A daily semiconductor briefing built for the IC lab at Futurewei.',
    role: 'Project Creator · Python Development',
    actions: [
      'Built source collection, article extraction and HTML email production in Python',
      'Implemented Outlook delivery checks, subscription handling and test-recipient controls',
      'Defined editorial criteria for the research workflow run through Claude Code',
    ],
    outcomes: 'The lab receives approximately eight selected stories each morning. Leadership has given positive feedback on the briefing’s usefulness.',
    tags: ['Python', 'Outlook COM', 'Claude Code', 'Automation'],
    detail: 'news',
  },
  {
    icon: Cpu,
    title: 'Semiconductor Foundry Landscape',
    category: 'Industry Research',
    context: 'A 43-page presentation on foundry business models and competitive positioning.',
    role: 'Research & Presentation Development · Futurewei',
    actions: [
      'Compared sixteen manufacturers across process capability, business model and application focus',
      'Explained the technical ecosystem behind customer switching costs',
      'Documented sources with a refresh schedule for changing market figures',
    ],
    outcomes: 'Leadership uses the deck to introduce the semiconductor industry to external audiences.',
    tags: ['Semiconductors', 'Competitive Analysis', 'Technical Marketing'],
    detail: 'foundry',
  },
  {
    icon: Cpu,
    title: 'Chip Fabrication Explained',
    category: 'Technical Education · In Progress',
    context: 'An educational presentation following the physical processes used to manufacture chips.',
    role: 'Technical Research & Presentation Development · Futurewei',
    actions: [
      'Explain wafer preparation and thin-film deposition through their physical mechanisms',
      'Use diagrams to connect spin coating with later patterning steps',
      'Organize technical material for an introductory audience',
    ],
    outcomes: 'The seventeen-page draft has received positive feedback from leadership. Development is ongoing.',
    tags: ['Chip Fabrication', 'Technical Writing', 'PowerPoint'],
    detail: 'fabrication',
  },
  {
    icon: Megaphone,
    title: 'CASPA Event Communications',
    category: 'Volunteer Work',
    context: 'Marketing and proceedings work for a semiconductor industry organization.',
    role: 'Marketing & Proceedings Volunteer',
    actions: [
      'Promote events for the semiconductor community',
      'Edit event-related video for the marketing team',
      'Support the yearbook and related documentation through the proceedings team',
    ],
    outcomes: 'Current work supports ACDB 2026. The project includes the event poster and a published CASPA × IEEE Summer Symposium video.',
    tags: ['Event Marketing', 'Video Editing', 'Documentation'],
    detail: 'caspa',
  },
  {
    icon: Beaker,
    title: 'Skincare Consumer Insights & Recommendation System',
    category: 'Research Project',
    context: 'Graduate capstone project addressing information asymmetry in the skincare industry.',
    role: 'Lead Researcher & Designer',
    actions: [
      'Designed survey-based skin-type assessment methodology',
      'Developed ingredient transparency framework',
      'Built recommendation logic based on consumer research',
    ],
    outcomes: 'Created an educational tool that helps consumers understand their skin and skincare ingredients through research-informed recommendations. Currently building the website/app and plan to publish it once it\'s ready.',
    tags: ['Consumer Research', 'UX Design', 'Data Analysis', 'Content Strategy', 'Digital Marketing', 'Brand Messaging', 'User Research', 'Product Development'],
  },
  {
    icon: Scale,
    title: 'L-MARS: Legal Multi-Agent Workflow with Orchestrated Reasoning and Agentic Search',
    category: 'Research Publication',
    context: 'Multi-agent system that reduces hallucination and uncertainty in legal question answering through coordinated reasoning and retrieval across heterogeneous sources (Serper web, local RAG, CourtListener case law).',
    role: 'Co-Author',
    actions: [
      'Designed multi-agent workflow with Judge Agent for verification of sufficiency, jurisdiction, and temporal validity',
      'Built iterative reasoning-search-verification loop to ground answers in authoritative law',
      'Evaluated on LegalSearchQA benchmark (200 questions); improved factual accuracy and preference scores from human experts and LLM judges',
    ],
    outcomes: 'Demonstrated that multi-agent reasoning with agentic search offers a scalable blueprint for deploying LLMs in high-stakes legal domains requiring precise retrieval and deliberation.',
    tags: ['Legal AI', 'Multi-Agent Systems', 'RAG', 'LLMs'],
    url: 'https://arxiv.org/abs/2509.00761',
  },
  {
    icon: Scale,
    title: 'AI & Legal Communication Project',
    category: 'Market Research',
    context: 'Research project exploring marketing and content strategy in a regulated industry.',
    role: 'Marketing Researcher',
    actions: [
      'Conducted competitive landscape analysis',
      'Developed content strategy recommendations',
      'Analyzed communication challenges in regulated sectors',
    ],
    outcomes: 'Delivered strategic insights on effective marketing approaches for complex, compliance-sensitive products.',
    tags: ['Market Research', 'Content Strategy', 'B2B Marketing'],
  },

];

export function ProjectsSection() {
  const [params, setParams] = useSearchParams();
  const active = projects.find(project => project.detail && project.detail === params.get('project'));
  const trigger = useRef<HTMLAnchorElement | null>(null);
  function closeProject() {
    const next = new URLSearchParams(params);
    next.delete('project');
    setParams(next, { replace: true, preventScrollReset: true });
  }
  return (
    <section id="projects" className="section-spacing bg-secondary/30">
      <div className="container-main">
        <div className="section-header">
          <span className="section-label">Selected Projects</span>
          <h2 className="section-title">Featured Work</h2>
          <p className="section-description">
            Selected work in semiconductor research, automation and digital marketing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.title} className="card-base card-hover group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <project.icon size={24} className="text-primary" />
                </div>
                <span className="tag tag-primary text-xs">{project.category}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                {project.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">{project.context}</p>
              
              <div className="mb-4">
                <p className="text-xs font-semibold text-foreground mb-2">My Role: {project.role}</p>
                <ul className="space-y-1">
                  {project.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-accent/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-foreground">
                  <span className="font-semibold">Outcome:</span> {project.outcomes}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag text-xs">{tag}</span>
                ))}
              </div>
              {project.detail && <a href={`?project=${project.detail}#projects`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-4" onClick={event => {
                event.preventDefault();
                trigger.current = event.currentTarget;
                const next = new URLSearchParams(params);
                next.set('project', project.detail!);
                setParams(next, { preventScrollReset: true });
              }}>View {project.detail === 'news' ? 'project & Python code' : project.detail === 'caspa' ? 'event materials & video' : 'presentation & analysis'}<ArrowUpRight size={16}/></a>}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-4"
                >
                  View paper
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
      <Dialog open={Boolean(active)} onOpenChange={open => { if (!open) closeProject(); }}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-5xl max-h-[90dvh] p-0 flex flex-col overflow-hidden rounded-xl" onCloseAutoFocus={event => { if (trigger.current) { event.preventDefault(); trigger.current.focus(); } }}>
          <DialogHeader className="px-6 md:px-8 pt-6 pb-4 pr-12 border-b border-border text-left shrink-0">
            <span className="section-label !mb-1">{active?.category}</span>
            <DialogTitle className="text-2xl md:text-3xl leading-tight">{active?.title}</DialogTitle>
            <DialogDescription className="pt-1">{active?.role}</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto overscroll-contain px-6 md:px-8 py-6 min-h-0 text-sm md:text-base leading-relaxed">
            {active?.detail && <Suspense fallback={<p role="status">Loading project…</p>}><ProjectDetails key={active.detail} id={active.detail}/></Suspense>}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
