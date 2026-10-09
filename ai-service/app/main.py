# app/main.py
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict

from langchain_core.messages import HumanMessage, AIMessage
from app.config import settings
from app.agent.graph import portfolio_agent

app = FastAPI(title="Kathan Portfolio AI Agent Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "portfolio-ai-agent"}

@app.post("/api/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="Messages payload cannot be empty.")

    # Convert incoming payload to LangChain message objects
    langchain_messages = []
    for msg in request.messages:
        if msg.role == "user":
            langchain_messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            langchain_messages.append(AIMessage(content=msg.content))

    async def event_generator():
        # Stream intermediate tool status and final answer tokens
        async for event in portfolio_agent.astream_events(
            {"messages": langchain_messages},
            version="v2"
        ):
            kind = event["event"]

            # Notification when a tool starts running
            if kind == "on_tool_start":
                tool_name = event["name"]
                yield f"data: {json.dumps({'type': 'tool_start', 'tool': tool_name})}\n\n"

            # Stream LLM generation tokens to client
            elif kind == "on_chat_model_stream":
                chunk = event["data"]["chunk"]
                if hasattr(chunk, "content") and chunk.content:
                    yield f"data: {json.dumps({'type': 'token', 'content': chunk.content})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")