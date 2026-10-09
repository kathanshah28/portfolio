# Autonomous Agentic Portfolio & Engineering System

A distributed, production-grade developer portfolio featuring full-stack server-side rendering, dynamic project detail routing, and an autonomous AI engineering assistant powered by **LangGraph**, **FastAPI**, and **Groq/Llama 3.3**.

---

## Architecture Overview

                  ┌──────────────────────────────────────┐
                  │            Client Browser            │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │    Next.js 15+ App Router (Vercel)   │
                  │  - React Server Components & UI      │
                  │  - Cloudinary Media Player & Showcase│
                  │  - Route Handlers (/api/chat, etc.)  │
                  └─────────────┬────────────────────────┘
                                │ (Direct DB reads)
                                ├────────────────────────┐
                                │ (SSE Stream Proxy)     ▼
                                ▼              ┌───────────────────┐
                  ┌──────────────────────────┐ │   MongoDB Atlas   │
                  │   FastAPI AI Service     │ │  - profiles       │
                  │  - LangGraph StateGraph  │ │  - projects       │
                  │  - Guardrails & Boundary │ │  - skills         │
                  │  - MongoDB & GitHub Tools│ └─────────▲─────────┘
                  └─────────────┬────────────┘           │
                                │ (Read-only lookup)     │
                                └────────────────────────┘

The system uses a decoupled architecture to prevent AI dependencies (`langchain`, `langgraph`) from blocking core web rendering and standard API transactions:

* **Frontend & BFF (`frontend/`):** Built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui. Handles dynamic routing (`/projects/[slug]`), responsive dark/light theming, server-side data fetching from MongoDB, and acts as a Backend-for-Frontend (BFF) proxy for streaming SSE events.
* **AI Agent Microservice (`ai-service/`):** A dedicated Python FastAPI microservice running a compiled LangGraph workflow. Uses Groq (`llama-3.3-70b-versatile`) or OpenAI (`gpt-4o-mini`) with strictly scoped, read-only tools to answer technical queries using database state and GitHub README fallbacks.
* **Database Layer:** Managed MongoDB Atlas cluster storing structured documents across `profiles`, `projects`, and `skills` collections.

---

## Key Features

* **Interactive Project Showcase:** Filter projects by engineering category, open dedicated slug pages (`/projects/[slug]`), view Cloudinary video demos, and inspect technical architecture breakdowns.
* **Autonomous AI Assistant:** A floating drawer chat interface with real-time token streaming via Server-Sent Events (SSE) and live execution badges (e.g., `Querying MongoDB project records...`).
* **Strict LLM Guardrails:** Layered system prompt constraints and tool sandboxing prevent prompt injection, hallucinations, and out-of-scope queries.
* **GitHub Integration:** Dynamic tool fallback directly fetches raw repository READMEs via the GitHub API if deep implementation details are not present in the primary database.

---

## Repository Structure

```bash
portfolio-workspace/
├── frontend/                     # Next.js App Router application
│   ├── src/
│   │   ├── app/                  # Pages, layouts, and API route handlers
│   │   ├── components/           # UI components, portfolio sections, and ChatWidget
│   │   ├── hooks/                # usePortfolioChat streaming hook
│   │   ├── lib/db/               # Mongoose models and pooled connection utility
│   │   └── types/                # TypeScript interfaces and contracts
│   ├── scripts/                  # Database seeding scripts (seed.ts)
│   └── public/                   # Static assets
│
├── ai-service/                   # Python FastAPI & LangGraph microservice
│   ├── app/
│   │   ├── agent/                # LangGraph workflow, system prompts, and tools
│   │   ├── db/                   # MongoDB connection client
│   │   ├── config.py             # Pydantic environment configuration
│   │   └── main.py               # FastAPI app and SSE endpoint (/api/chat/stream)
│   ├── inspect_db.py             # Database cluster inspection script
│   └── requirements.txt          # Python dependencies
│
└── README.md                     # Project documentation
```

## Getting Started

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **Python**: 3.10+
- **MongoDB**: A free MongoDB Atlas cluster connection string
- **API Key**: A Groq API Key (or OpenAI API Key)

### 1. Database Setup & Seeding

#### 1. In `frontend/`, created `.env` file with following variables:

```bash
MONGODB_URI="<your_atlas_connection_string>"
GROQ_API_KEY="<your_groq_key>"
OPENAI_API_KEY=""
```

#### 2. Seed your MongoDB collections with initial data:

```bash
# 1. Navigate to the scripts directory
cd frontend/scripts

# 2. Install Mongoose if not already installed
npm install mongoose

# 3. Run the seed script
npm run seed
```

### 2. Setup AI Microservice

#### 1. In `ai-services/`, create a virtual environment and install requirements:

```bash
cd ai-service
python -m venv venv

# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

pip install -r requirements.txt
```

#### 2. create `ai-service/.env`:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
DB_NAME=portfolio
GROQ_API_KEY=gsk_your_groq_api_key_here
MODEL_NAME=llama-3.3-70b-versatile
GITHUB_TOKEN=ghp_your_optional_github_token
GITHUB_USERNAME=your_github_username
```

#### 3. Start the FastAPI microservice:

```bash
# Start the AI Microservice (Terminal 1 local test)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload 

# Start the Next.js Frontend (Terminal 2)
cd frontend
npm run dev
```

### 3. Frontend Setup

#### 1. In a separate terminal, navigate to `frontend/`:

```bash
cd frontend
npm run dev
```

#### 2. Open `http://localhost:3000` in your browser.

## Tech Stack


| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 15+ (App Router), React Server Components, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend / BFF** | Express.js (via Vercel middleware) |
| **AI Service** | Python, FastAPI, LangGraph, Groq SDK (Llama 3.3), MongoDB |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Media** | Cloudinary (Video Player & Uploads) |
| **Styling** | Tailwind CSS, Lucide-React |
| **Builds** | Vite (Frontend), uvicorn (Python) |

---
