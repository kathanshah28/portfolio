// src/app/page.tsx
import { connectToDatabase } from "@/lib/db/mongodb";
import { ProfileModel } from "@/lib/db/models/Profile";
import { ProjectModel } from "@/lib/db/models/Project";
import { SkillModel } from "@/lib/db/models/Skill";
import { Profile, Project, Skill } from "@/types/portfolio";

import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { SkillsGrid } from "@/components/portfolio/SkillsGrid";
import { ProjectsShowcase } from "@/components/portfolio/ProjectsShowcase";
import { Timeline } from "@/components/portfolio/Timeline";

// Revalidate data every 60 seconds (ISR)
export const revalidate = 60;

async function getPortfolioData(): Promise<{
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
}> {
  try {
    await connectToDatabase();

    const [rawProfile, rawProjects, rawSkills] = await Promise.all([
      ProfileModel.findOne().lean(),
      ProjectModel.find({ status: "published" }).sort({ createdAt: -1 }).lean(),
      SkillModel.find().sort({ category: 1 }).lean(),
    ]);

    // Cast MongoDB documents to clean typed JSON
    const profile = rawProfile ? JSON.parse(JSON.stringify(rawProfile)) : null;
    const projects = JSON.parse(JSON.stringify(rawProjects));
    const skills = JSON.parse(JSON.stringify(rawSkills));

    return { profile, projects, skills };
  } catch (error) {
    console.error("Error loading portfolio data:", error);
    return { profile: null, projects: [], skills: [] };
  }
}

export default async function HomePage() {
  const { profile, projects, skills } = await getPortfolioData();

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-xl font-bold mb-2">No Profile Found</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Please run <code className="bg-muted px-1.5 py-0.5 rounded font-mono">npm run db:seed</code> to populate your database.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        githubUrl={profile.contact.github}
        linkedinUrl={profile.contact.linkedin}
      />
      <main className="flex-1">
        <Hero profile={profile} />
        <ProjectsShowcase projects={projects} />
        <SkillsGrid skills={skills} />
        <Timeline education={profile.education} achievements={profile.achievements} />
      </main>
      <footer className="border-t py-8 text-center text-xs text-muted-foreground font-mono">
        <div className="container mx-auto px-4">
          Built with Next.js, Tailwind, MongoDB & LangGraph. {profile.name} &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}