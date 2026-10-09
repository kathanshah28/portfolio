// src/hooks/use-portfolio-chat.ts
"use client";

import { useState, useCallback } from "react";

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export function usePortfolioChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! I am Kathan's AI assistant. Ask me anything about his projects, technical architecture, engineering skills, or background.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const sendMessage = useCallback(
        async (overrideMessage?: string) => {
            const messageToSend = (overrideMessage || input).trim();
            if (!messageToSend || isLoading) return;

            const userMessage: Message = { role: "user", content: messageToSend };
            const nextMessages = [...messages, userMessage];

            setMessages(nextMessages);
            setInput("");
            setIsLoading(true);
            setActiveTool(null);

            // Create a blank placeholder for the incoming assistant response
            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: nextMessages.map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                    }),
                });

                if (!response.ok || !response.body) {
                    throw new Error("Failed to receive stream response");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data:")) continue;

                        const jsonStr = trimmed.replace(/^data:\s*/, "");
                        try {
                            const event = JSON.parse(jsonStr);

                            if (event.type === "tool_start") {
                                setActiveTool(event.tool);
                            } else if (event.type === "token") {
                                setActiveTool(null);
                                setMessages((prev) => {
                                    const updated = [...prev];
                                    const lastIdx = updated.length - 1;
                                    updated[lastIdx] = {
                                        ...updated[lastIdx],
                                        content: updated[lastIdx].content + event.content,
                                    };
                                    return updated;
                                });
                            } else if (event.type === "done") {
                                setActiveTool(null);
                            }
                        } catch {
                            // Ignore partial JSON chunks
                        }
                    }
                }
            } catch (error) {
                console.error("Streaming error:", error);
                setMessages((prev) => {
                    const updated = [...prev];
                    const lastIdx = updated.length - 1;
                    updated[lastIdx] = {
                        ...updated[lastIdx],
                        content:
                            updated[lastIdx].content ||
                            "I encountered an error connecting to the AI service. Please make sure the backend is active.",
                    };
                    return updated;
                });
            } finally {
                setIsLoading(false);
                setActiveTool(null);
            }
        },
        [input, isLoading, messages]
    );

    return {
        messages,
        input,
        setInput,
        isLoading,
        activeTool,
        sendMessage,
    };
}