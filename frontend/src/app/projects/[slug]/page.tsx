// src/app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { connectToDatabase } from "@/lib/db/mongodb";
import { ProjectModel } from "@/lib/db/models/Project";
import { Project } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    ExternalLink,
    Layers,
    BookOpen,
    Sparkles,
    Video,
    Image as ImageIcon
} from "lucide-react";
import { Github } from "@/components/icons";

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    await connectToDatabase();
    const project = await ProjectModel.findOne({ slug }).lean<Project>();

    if (!project) {
        return { title: "Project Not Found" };
    }

    return {
        title: `${project.title} | Systems Deep Dive`,
        description: project.summary,
    };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    await connectToDatabase();

    const rawProject = await ProjectModel.findOne({ slug, status: "published" }).lean();

    if (!rawProject) {
        notFound();
    }

    const project: Project = JSON.parse(JSON.stringify(rawProject));
    const images = project.media?.filter((m) => m.type === "image") || [];
    const videos = project.media?.filter((m) => m.type === "video") || [];

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Top Bar */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="gap-2 font-mono text-xs">
                        <Link href="/" className="flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs font-mono">
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                                <Github className="h-3.5 w-3.5" />
                                Source Code
                            </a>
                        </Button>
                        {project.liveUrl && (
                            <Button size="sm" asChild className="gap-1.5 text-xs font-mono">
                                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Live Demo
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-8 max-w-4xl pt-10">
                {/* Header Section */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs uppercase">
                            {project.category}
                        </Badge>
                        {project.featured && (
                            <Badge variant="default" className="text-xs font-mono gap-1">
                                <Sparkles className="h-3 w-3" /> Featured
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                        {project.title}
                    </h1>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="font-mono text-xs py-1 px-2.5">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Media Section: Cloudinary Videos & Demos */}
                {videos.length > 0 && (
                    <div className="space-y-4 mb-10">
                        <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                            <Video className="h-4 w-4 text-primary" /> Live Walkthrough & Video Demos
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {videos.map((vid, idx) => (
                                <div key={idx} className="rounded-xl overflow-hidden border border-border/60 bg-black/40">
                                    <video
                                        controls
                                        preload="metadata"
                                        className="w-full max-h-[480px] object-contain rounded-lg"
                                        src={vid.url}
                                    >
                                        Your browser does not support HTML5 video streaming.
                                    </video>
                                    {vid.caption && (
                                        <p className="p-3 text-xs font-mono text-muted-foreground bg-muted/30">
                                            {vid.caption}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Media Section: Cloudinary Image Gallery */}
                {images.length > 0 && (
                    <div className="space-y-4 mb-12">
                        <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                            <ImageIcon className="h-4 w-4 text-primary" /> Architecture & Visual Interface
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {images.map((img, idx) => (
                                <Card key={idx} className="overflow-hidden border-border/60">
                                    <div className="relative h-60 w-full bg-muted">
                                        <Image
                                            src={img.url}
                                            alt={img.caption || `${project.title} screenshot ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {img.caption && (
                                        <CardContent className="p-3">
                                            <p className="text-xs text-muted-foreground font-mono">{img.caption}</p>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Deep Dive Breakdown */}
                <div className="space-y-8 border-t pt-8">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
                            <Layers className="h-5 w-5 text-primary" /> System Architecture & Overview
                        </h2>
                        <div className="p-5 rounded-lg bg-card border border-border/60 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                            {project.aiAnalysis.architecture || project.aiAnalysis.overview}
                        </div>
                    </div>

                    {project.aiAnalysis.learnings?.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
                                <BookOpen className="h-5 w-5 text-primary" /> Key Technical Takeaways
                            </h2>
                            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside bg-muted/30 p-5 rounded-lg border border-border/60">
                                {project.aiAnalysis.learnings.map((learning, idx) => (
                                    <li key={idx} className="leading-relaxed text-foreground/90">
                                        {learning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.aiAnalysis.inspiration && (
                        <div>
                            <h3 className="text-xs font-mono uppercase text-muted-foreground mb-2">Project Inspiration</h3>
                            <p className="text-sm italic text-muted-foreground border-l-2 border-primary/40 pl-4 py-1">
                                &ldquo;{project.aiAnalysis.inspiration}&rdquo;
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}