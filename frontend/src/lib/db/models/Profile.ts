// src/lib/db/models/Profile.ts
import mongoose, { Schema, Model } from "mongoose";
import { Profile } from "@/types/portfolio";

const ProfileSchema = new Schema<Profile>(
    {
        name: { type: String, required: true },
        headline: { type: String, required: true },
        bio: { type: String, required: true },
        avatarUrl: { type: String },
        resumeUrl: { type: String },
        contact: {
            email: { type: String, required: true },
            github: { type: String, required: true },
            linkedin: { type: String, required: true },
            twitter: { type: String },
        },
        education: [
            {
                institution: { type: String, required: true },
                degree: { type: String, required: true },
                fieldOfStudy: { type: String, required: true },
                startDate: { type: String, required: true },
                endDate: { type: String, required: true },
                gradeOrPercentage: { type: String },
                highlights: [{ type: String }],
            },
        ],
        hobbies: [
            {
                name: { type: String, required: true },
                category: { type: String, required: true },
                achievements: [{ type: String }],
            },
        ],
        achievements: [
            {
                title: { type: String, required: true },
                issuer: { type: String, required: true },
                date: { type: String, required: true },
                description: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

export const ProfileModel: Model<Profile> =
    mongoose.models.Profile || mongoose.model<Profile>("Profile", ProfileSchema);