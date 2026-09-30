// src/components/portfolio/Navbar.tsx
"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Terminal, MessageSquareCode } from "lucide-react";
import {Github, Linkedin} from "@/components/icons"

interface NavbarProps {
  githubUrl?: string;
  linkedinUrl?: string;
  onOpenChat?: () => void;
}

export function Navbar({ githubUrl, linkedinUrl, onOpenChat }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wider">
          <Terminal className="h-4 w-4 text-primary" />
          <span>KATHAN.DEV</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#projects" className="hover:text-foreground transition-colors">Projects</a>
          <a href="#skills" className="hover:text-foreground transition-colors">Skills</a>
          <a href="#education" className="hover:text-foreground transition-colors">Timeline</a>
        </nav>

        <div className="flex items-center gap-2">
          {githubUrl && (
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {linkedinUrl && (
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          <ThemeToggle />
          <Button
            size="sm"
            onClick={onOpenChat}
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs"
          >
            <MessageSquareCode className="h-3.5 w-3.5" />
            <span>Ask AI</span>
          </Button>
        </div>
      </div>
    </header>
  );
}