// src/components/chat/ChatWidget.tsx
"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquareCode, X, Send, Bot, User, Sparkles, Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { usePortfolioChat } from "@/hooks/use-portfolio-chat";
import { Github, Linkedin } from "@/components/icons"

const QUICK_PROMPTS = [
    "What projects has Kathan built?",
    "What is his core tech stack?",
    "Tell me about his AI & distributed systems experience",
];

export function ChatWidget() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { messages, input, setInput, isLoading, activeTool, sendMessage } = usePortfolioChat();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, activeTool]);

    const getToolLabel = (toolName: string) => {
        switch (toolName) {
            case "search_projects":
                return "Querying MongoDB project records...";
            case "get_skills":
                return "Checking verified skill proficiencies...";
            case "get_personal_profile":
                return "Fetching profile & background details...";
            case "fetch_github_repo_readme":
                return "Fetching raw repository README from GitHub API...";
            default:
                return `Executing ${toolName}...`;
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Toggle Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="rounded-full shadow-xl gap-2 font-mono text-xs px-4 py-6 hover:scale-105 transition-all"
                >
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <MessageSquareCode className="h-5 w-5" />
                    <span>Ask Kathan&apos;s AI</span>
                </Button>
            )}

            {/* Floating Chat Drawer Window */}
            {isOpen && (
                <Card className="w-[360px] sm:w-[420px] h-[580px] shadow-2xl flex flex-col border border-border/80 bg-background/95 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    {/* Header */}
                    <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between space-y-0 bg-muted/40">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                                    AI Portfolio Assistant
                                    <Sparkles className="h-3 w-3 text-primary" />
                                </CardTitle>
                                <p className="text-[10px] text-muted-foreground font-mono">
                                    LangGraph • MongoDB Atlas • Groq
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    {/* Messages Body */}
                    <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot className="h-3.5 w-3.5" />
                                    </div>
                                )}

                                <div
                                    className={`rounded-xl px-3.5 py-2.5 max-w-[85%] leading-relaxed ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground font-sans ml-auto"
                                        : "bg-muted/70 text-foreground border border-border/50"
                                        }`}
                                >
                                    {msg.role === "user" ? (
                                        msg.content
                                    ) : (
                                        <div className="prose prose-xs dark:prose-invert max-w-none space-y-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
                                            <ReactMarkdown>{msg.content || (isLoading && idx === messages.length - 1 ? "Thinking..." : "")}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                                {msg.role === "user" && (
                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                                        <User className="h-3.5 w-3.5" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Live Tool Execution Indicator */}
                        {activeTool && (
                            <div className="flex items-center gap-2 text-[11px] font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-md animate-pulse">
                                {activeTool.includes("github") ? (
                                    <Github className="h-3.5 w-3.5" />
                                ) : (
                                    <Database className="h-3.5 w-3.5" />
                                )}
                                <span>{getToolLabel(activeTool)}</span>
                            </div>
                        )}
                    </CardContent>

                    {/* Quick Prompts (Only shown if conversation is short) */}
                    {messages.length <= 2 && (
                        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-border/40 bg-muted/20">
                            {QUICK_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => sendMessage(prompt)}
                                    disabled={isLoading}
                                    className="text-[10px] font-mono bg-background hover:bg-muted text-muted-foreground hover:text-foreground border px-2 py-1 rounded transition-colors"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Footer */}
                    <CardFooter className="p-3 border-t bg-muted/20">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                            className="flex w-full items-center gap-2"
                        >
                            <input
                                type="text"
                                placeholder="Ask about Kathan's work or skills..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                className="flex-1 bg-background border border-border/60 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-8 w-8 shrink-0">
                                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}