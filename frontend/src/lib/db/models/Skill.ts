// src/lib/db/models/Skill.ts
import mongoose, { Schema, Model } from "mongoose";
import { Skill } from "@/types/portfolio";

const SkillSchema = new Schema<Skill>(
    {
        name: { type: String, required: true, unique: true },
        category: {
            type: String,
            enum: ["Frontend", "Backend", "AI/ML", "DevOps", "Database", "Tools"],
            required: true,
        },
        proficiencyLevel: {
            type: String,
            enum: ["Familiar", "Proficient", "Expert"],
        },
        iconKey: { type: String },
    },
    { timestamps: true }
);

export const SkillModel: Model<Skill> =
    mongoose.models.Skill || mongoose.model<Skill>("Skill", SkillSchema);