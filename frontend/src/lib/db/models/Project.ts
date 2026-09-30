// src/lib/db/models/Project.ts
import mongoose, { Schema, Model } from "mongoose";
import { Project } from "@/types/portfolio";

const ProjectSchema = new Schema<Project>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        githubUrl: { type: String, required: true },
        liveUrl: { type: String },
        category: {
            type: String,
            enum: ["AI/ML", "Full Stack Web", "Mobile", "Systems", "DevOps"],
            required: true,
        },
        technologies: [{ type: String, required: true }],
        summary: { type: String, required: true },
        media: [
            {
                type: { type: String, enum: ["image", "video"], required: true },
                url: { type: String, required: true },
                caption: { type: String },
                isCover: { type: Boolean, default: false },
            },
        ],
        aiAnalysis: {
            overview: { type: String, required: true },
            architecture: { type: String },
            learnings: [{ type: String }],
            inspiration: { type: String },
        },
        featured: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ["staged", "published", "archived"],
            default: "published",
        },
        lastSyncedCommit: { type: String },
    },
    { timestamps: true }
);

export const ProjectModel: Model<Project> =
    mongoose.models.Project || mongoose.model<Project>("Project", ProjectSchema);