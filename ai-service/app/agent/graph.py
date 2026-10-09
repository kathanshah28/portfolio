# app/agent/graph.py
from typing import Annotated, Sequence
from typing_extensions import TypedDict

from langchain_core.messages import BaseMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

# Support either Groq or OpenAI
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI 

from app.config import settings
from app.agent.prompts import SYSTEM_PROMPT
from app.agent.tools import get_personal_profile, get_skills, search_projects, fetch_github_repo_readme

# Define Tools
tools = [get_personal_profile, get_skills, search_projects, fetch_github_repo_readme]
tool_node = ToolNode(tools)

# Initialize Model
if settings.GROQ_API_KEY:
    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL_NAME
    )
elif settings.OPENAI_API_KEY:
    llm = ChatGoogleGenerativeAI(
        api_key=settings.GOOGLE_GEMINI_API,
        model=settings.GEMINI_MODEL_NAME
    )
else:
    raise RuntimeError("Neither GROQ_API_KEY nor OPENAI_API_KEY is configured.")

model_with_tools = llm.bind_tools(tools)

# State Definition
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

# Nodes
def call_model(state: AgentState) -> dict:
    messages = state["messages"]
    # Ensure system prompt is prepended if not already present
    if not isinstance(messages[0], SystemMessage):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + list(messages)
    response = model_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState) -> str:
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

# Build Graph
builder = StateGraph(AgentState)
builder.add_node("agent", call_model)
builder.add_node("tools", tool_node)

builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", should_continue, ["tools", END])
builder.add_edge("tools", "agent")

portfolio_agent = builder.compile()