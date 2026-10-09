// src/app/api/chat/route.ts
import { NextRequest } from "next/server";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await fetch(`${AI_SERVICE_URL}/api/chat/stream`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(
                JSON.stringify({ error: `AI microservice failed: ${errorText}` }),
                { status: response.status, headers: { "Content-Type": "application/json" } }
            );
        }

        // Stream the SSE body directly back to the browser
        return new Response(response.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Chat gateway error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to connect to AI microservice." }),
            { status: 502, headers: { "Content-Type": "application/json" } }
        );
    }
}