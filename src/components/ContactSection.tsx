import { Mail, MapPin, Linkedin, Send } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="section-spacing bg-secondary/30">
      <div className="container-main">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">Contact</span>
          <h2 className="section-title mb-4">Let's Connect</h2>
          <p className="section-description mx-auto mb-10">
            I'm seeking full-time opportunities in technical marketing, digital marketing and social media.
            Feel free to reach out to discuss how I can contribute to your team.
          </p>

          <div className="card-base inline-block w-full max-w-md mx-auto">
            <div className="space-y-6">
              <a
                href="mailto:zwang234@usc.edu"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail size={22} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">zwang234@usc.edu</p>
                </div>
              </a>

              <div className="divider" />

              <a
                href="https://linkedin.com/in/ziqiwang-zoe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Linkedin size={22} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">LinkedIn</p>
                  <p className="font-medium text-foreground">linkedin.com/in/ziqiwang-zoe</p>
                </div>
              </a>

              <div className="divider" />

              <div className="flex items-center gap-4 p-4 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                  <MapPin size={22} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">San Jose, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <a href="mailto:zwang234@usc.edu" className="btn-primary">
              <Send size={18} />
              Send Me a Message
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
