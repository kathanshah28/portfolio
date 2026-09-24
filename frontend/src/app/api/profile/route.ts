// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { ProfileModel } from "@/lib/db/models/Profile";

export async function GET() {
    try {
        await connectToDatabase();
        const profile = await ProfileModel.findOne().lean();

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}