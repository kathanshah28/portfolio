// src/types/portfolio.ts

export type SkillCategory = "Frontend" | "Backend" | "AI/ML" | "DevOps" | "Database" | "Tools";

export interface Skill {
    _id?: string;
    name: string;
    category: SkillCategory;
    proficiencyLevel?: "Familiar" | "Proficient" | "Expert";
    iconKey?: string;
}

export type ProjectCategory = "AI/ML" | "Full Stack Web" | "Mobile" | "Systems" | "DevOps";

export interface Project {
    _id?: string;
    title: string;
    slug: string;
    githubUrl: string;
    liveUrl?: string;
    category: ProjectCategory;
    technologies: string[];
    summary: string;
    aiAnalysis: {
        overview: string;
        architecture?: string;
        learnings: string[];
        inspiration?: string;
    };
    featured: boolean;
    status: "staged" | "published" | "archived";
    lastSyncedCommit?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    gradeOrPercentage?: string;
    highlights?: string[];
}

export interface Achievement {
    title: string;
    issuer: string;
    date: string;
    description: string;
}

export interface Hobby {
    name: string;
    category: string;
    achievements?: string[];
}

export interface Certification {
    _id?: string;
    title: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
    certificateImageUrl?: string;
    skillsCovered: string[];
}

export interface Profile {
    _id?: string;
    name: string;
    headline: string;
    bio: string;
    avatarUrl?: string;
    contact: {
        email: string;
        github: string;
        linkedin: string;
        twitter?: string;
    };
    education: Education[];
    hobbies: Hobby[];
    achievements: Achievement[];
}