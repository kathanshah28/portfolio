// src/components/portfolio/Hero.tsx
import { Profile } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles, Terminal, FileText } from "lucide-react";

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="font-mono text-xs px-2.5 py-0.5 gap-1.5 border-primary/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for Engineering Roles
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
          Hi, I&apos;m <span className="text-primary">{profile.name}</span>.
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground font-medium mb-6">
          {profile.headline}
        </p>
        <p className="text-base sm:text-lg text-muted-foreground/90 leading-relaxed mb-8 max-w-2xl">
          {profile.bio}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="gap-2">
            <a href="#projects" className="flex items-center gap-1">
              Explore Projects
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>

          {
            profile.resumeUrl && (
              <Button variant="outline" size="lg" asChild className="gap-2 font-mono text-xs">
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-primary" />
                  Resume / CV
                </a>
              </Button>
            )
          }

          <Button variant="outline" size="lg" asChild className="gap-2 font-mono text-xs">
            <a href={`mailto:${profile.contact.email}`} className="flex items-center gap-1">
              <Terminal className="h-3.5 w-3.5" />
              {profile.contact.email}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}