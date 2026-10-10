import { useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Download, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { assetUrl } from '@/lib/assets';
import source from '@/data/news-source';
import { topics, iterations } from '@/data/news-case';

type Topic = typeof topics[number];

function EvidenceLink({ path, children, download = false }: { path: string; children: React.ReactNode; download?: boolean }) {
  return <a href={assetUrl(path)} download={download || undefined} target={download ? undefined : '_blank'} rel="noopener noreferrer" className="btn-outline">
    {download ? <Download size={16} /> : <FileText size={16} />}{children}
  </a>;
}

function CodePanel({ topic }: { topic: Topic }) {
  const [focus, setFocus] = useState('');
  const refs = useRef<Record<string, HTMLSpanElement | null>>({});
  return <div className="space-y-5">
    <div><p className="section-label !mb-2">{topic.skill}</p><h3 className="text-xl">{topic.title}</h3></div>
    <div className="grid sm:grid-cols-2 gap-5 text-sm leading-relaxed">
      <div><h4 className="mb-2 text-base">Problem</h4><p className="text-muted-foreground">{topic.problem}</p></div>
      <div><h4 className="mb-2 text-base">My implementation</h4><p className="text-muted-foreground">{topic.decision}</p></div>
    </div>
    <div className="rounded-lg border border-border overflow-hidden min-w-0">
      <div className="flex flex-wrap justify-between gap-3 bg-secondary px-4 py-3 text-xs">
        <span className="font-medium">Original Python · Selected excerpts</span>
        <a className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline" href={assetUrl(`work/news-code/${topic.id}.txt`)} download><Download size={14} />Download excerpt</a>
      </div>
      <div className="max-h-[28rem] overflow-auto bg-card" role="region" aria-label={`${topic.label.slice(3)} Python source`} tabIndex={0}>
        {source[topic.id as keyof typeof source].map((segment, segmentIndex) => <div key={`${segment.file}-${segment.start}`}>
          <div className="sticky left-0 flex justify-between gap-4 border-y border-border bg-accent px-4 py-2 text-xs font-mono"><span className="break-all">{segment.file}</span><span className="shrink-0">L{segment.start}–{segment.end}</span></div>
          <pre className="py-3 text-[12px] leading-6 min-w-max"><code>{segment.code.split('\n').map((line, i) => {
            const number = segment.start + i;
            const key = `${segmentIndex}-${number}`;
            return <span key={number} ref={el => { refs.current[key] = el; }} className={`flex pr-5 ${focus === key ? 'bg-primary/15' : ''}`}><span aria-hidden="true" className="w-12 shrink-0 pr-3 text-right text-muted-foreground select-none">{number}</span><span>{line || '\u00a0'}</span></span>;
          })}</code></pre>
        </div>)}
      </div>
    </div>
    <div className="grid sm:grid-cols-2 gap-3">{topic.notes.map(note => <button key={note.title} type="button" className="rounded-lg border border-border p-4 text-left hover:bg-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" onClick={() => {
      const key = `${note.segment}-${note.line}`;
      setFocus(key);
      refs.current[key]?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
    }}><span className="text-xs font-medium text-primary flex items-center gap-1 mb-2">Inspect line {note.line}<ArrowDown size={13} /></span><strong className="block text-sm mb-1">{note.title}</strong><span className="block text-xs leading-relaxed text-muted-foreground">{note.body}</span></button>)}</div>
    <p className="text-xs text-muted-foreground leading-relaxed">The excerpts retain their original file names and line numbers. Gaps between blocks indicate omitted code. Downloads contain selected excerpts rather than a runnable package.</p>
  </div>;
}

function NewsDetails() {
  return <div className="space-y-10">
    <section className="space-y-4">
      <h3 className="text-xl">A briefing used by the IC lab</h3>
      <p>I built Daily News Push to help the lab follow the semiconductor industry. The application prepares approximately eight selected stories for a morning email through Outlook. Leadership has given positive feedback on its usefulness.</p>
      <p className="text-muted-foreground">I defined the editorial criteria and developed the Python workflow around them. Claude Code follows the research instructions to prepare the briefing. Python collects source material, produces the email and manages the Outlook integration.</p>
      <div className="rounded-lg bg-accent/50 p-5"><h4 className="text-base mb-2">My contribution</h4><p className="text-sm leading-relaxed">I built the collector, article extractor and email renderer. I also implemented subscription processing and recipient restrictions for tests. Later revisions added checks for queued messages, duplicate runs and uncertain send outcomes.</p></div>
    </section>
    <section><h3 className="text-xl mb-4">System architecture</h3><ol className="grid grid-cols-2 sm:grid-cols-3 gap-3">{[
      ['Collect', 'RSS feeds and publication pages'], ['Select', 'Editorial criteria applied through Claude Code'], ['Extract', 'Article text with explicit fallback states'], ['Render', 'HTML email with inline images'], ['Send', 'Active subscribers through Outlook'], ['Verify', 'Application state and a recorded outcome'],
    ].map(([title, desc], i) => <li key={title} className="rounded-lg border border-border p-4"><span className="text-xs text-primary font-medium">0{i + 1}</span><h4 className="text-base my-2">{title}</h4><p className="text-xs text-muted-foreground leading-relaxed">{desc}</p></li>)}</ol></section>
    <section className="space-y-5 min-w-0"><div className="flex flex-wrap justify-between items-center gap-3"><h3 className="text-xl">Python implementation</h3><EvidenceLink path="work/news-code/selected-source.txt" download>Download selected source</EvidenceLink></div><p className="text-sm text-muted-foreground">Explore eight parts of the application. Each includes the original code, my implementation decisions and annotations linked to specific lines.</p>
      <Tabs defaultValue="delivery" className="min-w-0"><TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4 gap-1 p-1 mb-6">{topics.map(topic => <TabsTrigger key={topic.id} value={topic.id} className="whitespace-normal py-2.5 text-xs">{topic.label}</TabsTrigger>)}</TabsList>{topics.map(topic => <TabsContent key={topic.id} value={topic.id}><CodePanel topic={topic} /></TabsContent>)}</Tabs>
    </section>
    <section><h3 className="text-xl mb-5">Operational debugging</h3><div className="space-y-4">{iterations.map(item => <article key={item.date} className="rounded-lg border border-border p-5"><span className="text-xs font-medium text-primary">{item.date.includes('2026') ? item.date : `${item.date} · 2026`}</span><h4 className="text-base mt-2 mb-3">{item.title}</h4><p className="text-sm text-muted-foreground mb-2">{item.symptom}</p><p className="text-sm leading-relaxed">{item.change}</p></article>)}</div></section>
    <section className="space-y-4"><h3 className="text-xl">Editorial criteria</h3><p className="text-sm text-muted-foreground">The briefing prioritizes developments that affect the semiconductor business, particularly startups and manufacturing. Stories must meet the coverage window and language requirements. Repeated coverage is consolidated before ranking.</p><p className="text-sm text-muted-foreground">The workflow ranks stories by structural impact and fit with the lab’s interests. Each summary links to its source. If full article text is unavailable, the available snippet limits what the summary can claim.</p></section>
    <section className="space-y-4"><h3 className="text-xl">Sample briefing</h3><p className="text-sm text-muted-foreground">The team currently receives approximately eight stories each morning. This original August 17, 2026 report contains ten and shows the delivered format.</p><iframe src={assetUrl('work/news-sample.html')} title="Original IC lab briefing — August 17, 2026" loading="lazy" sandbox="" className="w-full h-[420px] rounded-lg border border-border bg-white" /><EvidenceLink path="work/news-sample.html">Open complete briefing</EvidenceLink></section>
    <section className="rounded-lg bg-secondary/60 p-5"><h3 className="text-lg mb-3">Current limitations</h3><p className="text-sm text-muted-foreground leading-relaxed">The application requires a signed-in Windows Outlook environment. A Sent Items record confirms the sending step; it does not establish inbox delivery or readership. Local records reduce repeated sends without guaranteeing exactly-once delivery. Further work would add unique run identifiers, concurrency controls and tests with simulated Outlook responses.</p></section>
  </div>;
}

const presentations = {
  foundry: {
    title: 'Foundry Landscape', pdf: 'foundry-landscape.pdf', label: 'Open 43-page presentation',
    introduction: 'I researched sixteen manufacturers for a 43-page presentation on the foundry industry. Leadership uses the material to introduce the semiconductor ecosystem to external audiences.',
    contribution: 'I developed the comparison framework and wrote the explanations. The deck separates process capability from business model and application focus, then examines the technical dependencies behind customer switching costs.',
    note: 'Company comparisons reflect the August 2026 research snapshot.',
    slides: [
      {file:'foundry-framework.png',page:16,title:'Three dimensions of foundry competition',body:'The framework separates process node, business model and application focus. This lets the audience compare manufacturers without assuming every company competes by pursuing the smallest node.'},
      {file:'foundry-ecosystem.png',page:34,title:'Customer switching costs',body:'The analysis follows the design ecosystem required to bring a chip into production. It connects qualified tools and proven IP to the effort involved in moving a customer’s design to another foundry.'},
      {file:'foundry-sources.png',page:41,title:'Source register',body:'The appendix records the sources behind changing figures. It identifies which information a presenter should revisit before reusing the deck.'},
    ],
  },
  fabrication: {
    title: 'Chip Fabrication', pdf: 'fabrication-process.pdf', label: 'Open 17-page draft',
    introduction: 'I am developing an educational presentation that follows a wafer through fabrication. The current draft contains seventeen pages and has received positive feedback from leadership.',
    contribution: 'I researched the physical mechanisms behind the processes and organized them into diagrams and comparisons. Each section explains what changes on the wafer before introducing the associated equipment or industry context.',
    note: 'Work in progress. The material is an educational draft.',
    slides: [
      {file:'fabrication-deposition.png',page:5,title:'Thin-film deposition',body:'The slide compares CVD, PVD and ALD by their deposition mechanisms. Readers first learn how each method forms a film, providing a basis for understanding equipment differences.'},
      {file:'fabrication-coating.png',page:7,title:'Stages of spin coating',body:'The diagram follows the process from dispensing to soft bake. I aligned the explanation with each stage so the changing material provides a clear reference for the later patterning steps.'},
    ],
  },
};

function PresentationDetails({kind}:{kind:'foundry'|'fabrication'}) {
  const [selected,setSelected]=useState(0);
  const deck=presentations[kind];
  const slide=deck.slides[selected];
  return <div className="space-y-7"><p>{deck.introduction}</p><div className="rounded-lg bg-accent/50 p-5"><h3 className="text-base mb-2">My contribution</h3><p className="text-sm leading-relaxed">{deck.contribution}</p></div><div className="flex flex-wrap gap-3"><EvidenceLink path={`work/${deck.pdf}`}>{deck.label}</EvidenceLink></div><p className="text-xs text-muted-foreground">{deck.note}</p><section><h3 className="text-xl mb-4">Selected slides</h3><div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Choose presentation excerpt">{deck.slides.map((item,i)=><button type="button" key={item.file} aria-pressed={selected===i} onClick={()=>setSelected(i)} className={`px-4 py-2 text-sm rounded-lg border transition-colors ${selected===i?'bg-primary text-primary-foreground border-primary':'border-border hover:bg-accent'}`}>Page {item.page}</button>)}</div><figure><a href={assetUrl(`work/${slide.file}`)} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size slide, page ${slide.page}`}><img src={assetUrl(`work/${slide.file}`)} alt={slide.title} width={1500} height={844} className="w-full rounded-lg border border-border"/></a><figcaption className="mt-4" aria-live="polite"><p className="text-xs text-primary mb-2">Original presentation · Page {slide.page}</p><h4 className="text-lg mb-2">{slide.title}</h4><p className="text-sm text-muted-foreground leading-relaxed">{slide.body}</p></figcaption></figure></section></div>;
}

function CaspaDetails() {
  return <div className="space-y-8"><p>I volunteer with CASPA’s marketing and proceedings teams. I promote events and edit video for marketing. My proceedings work supports the yearbook and related documentation.</p><section className="grid sm:grid-cols-2 gap-6 items-start"><a href={assetUrl('work/caspa-acdb-poster.png')} target="_blank" rel="noopener noreferrer"><img src={assetUrl('work/caspa-acdb-poster.png')} alt="CASPA ACDB 2026 CEO Summit event poster" width={2160} height={2880} className="w-full max-w-sm mx-auto rounded-lg border border-border"/></a><div><span className="section-label">Current event work</span><h3 className="text-xl mb-4">ACDB 2026</h3><p className="text-sm text-muted-foreground mb-4">CASPA’s 35th Annual Conference & Dinner Banquet is scheduled for October 23–24, 2026 at the Santa Clara Convention Center. I am contributing to the event’s communications through the two volunteer teams.</p><p className="text-sm text-muted-foreground mb-4">My responsibilities include event promotion, video editing and yearbook support. The poster provides context for the event program.</p><a href="https://caspa.com/acdb-2026-announcement/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Official event announcement<ArrowUpRight size={16}/></a></div></section><section className="space-y-4"><h3 className="text-xl">CASPA × IEEE Summer Symposium</h3><p className="text-sm text-muted-foreground">Published video from the 2026 Summer Symposium, “Paving the AI Super-highway — Where Power Meets Intelligence.” This symposium is a separate event from ACDB.</p><figure><div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-secondary"><iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7503592070998073345?compact=1" title="CASPA × IEEE 2026 Summer Symposium — event video" width="504" height="399" loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full border-0"/></div><figcaption className="mt-3"><a href="https://www.linkedin.com/posts/caspa-office-595263a_caspa-ieee-aiinfrastructure-ugcPost-7503592070998073345--NfS/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">View original post on LinkedIn<ArrowUpRight size={16}/></a></figcaption></figure></section></div>;
}

export default function ProjectDetails({id}:{id:string}) {
  if(id==='news')return <NewsDetails/>;
  if(id==='foundry'||id==='fabrication')return <PresentationDetails key={id} kind={id}/>;
  if(id==='caspa')return <CaspaDetails/>;
  return null;
}
