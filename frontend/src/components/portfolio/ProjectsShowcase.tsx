// src/components/portfolio/ProjectsShowcase.tsx
"use client";

import * as React from "react";

import Link from "next/link";
import Image from "next/image";

import { Project, ProjectCategory } from "@/types/portfolio";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Bot, Sparkles, BookOpen, Layers, ArrowRight } from "lucide-react";
import { Github } from "@/components/icons"

interface ProjectsShowcaseProps {
  projects: Project[];
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-16 border-t">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Engineered Systems</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Production systems, AI agents, and developer tooling.
            </p>
          </div>

          <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="bg-muted/60">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs font-mono">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.slug} className="flex flex-col border-border/60 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    {project.category}
                  </Badge>
                  {project.featured && (
                    <Badge variant="default" className="text-[10px] font-mono gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> Featured
                    </Badge>
                  )}
                </div>
                <Link href={`/projects/${project.slug}`}>
                  <CardTitle className="flex items-center gap-1 text-lg font-semibold">
                    <span>{project.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </CardTitle>
                </Link>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {project.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pb-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono text-muted-foreground bg-muted/70 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-0 flex items-center justify-between border-t border-border/40 py-3 mt-auto">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs">
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center">
                      <Github className="h-3.5 w-3.5 mr-1" /> Code
                    </a>
                  </Button>
                  {project.liveUrl && (
                    <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs">
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> Live
                      </a>
                    </Button>
                  )}
                </div>

                {/* AI Analysis Modal Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-mono gap-1.5 border-primary/30">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                      <span>AI Insights</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-lg">
                        <Bot className="h-4 w-4 text-primary" />
                        AI System Analysis: {project.title}
                      </DialogTitle>
                      <DialogDescription className="text-xs font-mono">
                        Extracted directly from project architecture and source documentation.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-2 text-sm">
                      <div>
                        <h4 className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5 mb-1.5">
                          <Layers className="h-3.5 w-3.5 text-primary" /> Overview & Architecture
                        </h4>
                        <p className="text-xs leading-relaxed text-foreground/90 bg-muted/40 p-3 rounded-md">
                          {project.aiAnalysis.architecture || project.aiAnalysis.overview}
                        </p>
                      </div>

                      {project.aiAnalysis.learnings?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5 mb-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-primary" /> Key Engineering Learnings
                          </h4>
                          <ul className="text-xs space-y-1.5 list-disc list-inside text-foreground/90">
                            {project.aiAnalysis.learnings.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.aiAnalysis.inspiration && (
                        <div>
                          <h4 className="text-xs font-mono uppercase text-muted-foreground mb-1">
                            Inspiration
                          </h4>
                          <p className="text-xs text-muted-foreground italic">
                            &ldquo;{project.aiAnalysis.inspiration}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}