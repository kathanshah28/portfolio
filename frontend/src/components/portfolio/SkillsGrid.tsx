// src/components/portfolio/SkillsGrid.tsx
import { Skill, SkillCategory } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Globe, Server, Database, Wrench, ShieldCheck } from "lucide-react";

interface SkillsGridProps {
  skills: Skill[];
}

const CATEGORY_ICONS: Record<SkillCategory, React.ComponentType<{ className?: string }>> = {
  Frontend: Globe,
  Backend: Server,
  "AI/ML": Cpu,
  Database: Database,
  DevOps: ShieldCheck,
  Tools: Wrench,
};

export function SkillsGrid({ skills }: SkillsGridProps) {
  // Group skills by category
  const categories = Array.from(new Set(skills.map((s) => s.category))) as SkillCategory[];

  return (
    <section id="skills" className="py-16 border-t">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Technical Arsenal</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Core technologies and architectures I actively design and build with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Wrench;
            const categorySkills = skills.filter((s) => s.category === cat);

            return (
              <Card key={cat} className="border-border/60 bg-card/50">
                <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
                  <div className="p-1.5 rounded-md bg-muted text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold tracking-wide font-mono">
                    {cat}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5 pt-0">
                  {categorySkills.map((skill) => (
                    <Badge
                      key={skill.name}
                      variant="secondary"
                      className="font-normal text-xs py-0.5 px-2 bg-secondary/60 hover:bg-secondary"
                    >
                      {skill.name}
                      {skill.proficiencyLevel === "Expert" && (
                        <span className="ml-1 text-[10px] text-primary">★</span>
                      )}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}