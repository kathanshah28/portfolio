// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { ProjectModel } from "@/lib/db/models/Project";

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get("category");
        const status = searchParams.get("status") || "published";

        const query: Record<string, unknown> = { status };
        if (category) {
            query.category = category;
        }

        const projects = await ProjectModel.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}