// src/components/portfolio/Timeline.tsx
import { Education, Achievement } from "@/types/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Award, Calendar } from "lucide-react";

interface TimelineProps {
  education: Education[];
  achievements: Achievement[];
}

export function Timeline({ education, achievements }: TimelineProps) {
  return (
    <section id="education" className="py-16 border-t">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Education Column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Academic Background</h2>
            </div>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <Card key={idx} className="border-border/60">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{edu.degree}</h3>
                        <p className="text-xs text-muted-foreground">{edu.fieldOfStudy}</p>
                        <p className="text-xs font-medium text-primary mt-0.5">{edu.institution}</p>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>

                    {edu.gradeOrPercentage && (
                      <div className="mt-2">
                        <span className="text-[11px] font-mono bg-muted px-2 py-0.5 rounded text-foreground/80">
                          {edu.gradeOrPercentage}
                        </span>
                      </div>
                    )}

                    {edu.highlights && edu.highlights.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                        {edu.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements Column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Milestones & Honors</h2>
            </div>

            <div className="space-y-4">
              {achievements.map((item, idx) => (
                <Card key={idx} className="border-border/60">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <span className="text-[11px] font-mono text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-xs font-medium text-primary mt-0.5">{item.issuer}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}