# app/agent/tools.py
import json
import httpx
from langchain_core.tools import tool
from app.db.mongo import mongodb
from app.config import settings

@tool
def get_personal_profile() -> str:
    """
    Fetch Kathan Shah's complete profile information, including headline, bio,
    education history, hobbies, achievements, and contact details.
    """
    db = mongodb.database
    # Check both pluralized (Mongoose default) and singular collection names
    collection = db["profiles"] if "profiles" in db.list_collection_names() else db["Profile"]
    profile = collection.find_one({}, {"_id": 0, "createdAt": 0, "updatedAt": 0, "__v": 0})

    if not profile:
        return "No profile details found in database."

    return json.dumps(profile, default=str)


@tool
def get_skills(category: str = None) -> str:
    """
    Retrieve technical skills and proficiencies.
    Optional category: Frontend, Backend, AI/ML, DevOps, Database, Tools.
    """
    db = mongodb.database
    collection = db["skills"] if "skills" in db.list_collection_names() else db["Skill"]
    
    query = {"category": category} if category else {}
    skills = list(collection.find(query, {"_id": 0, "createdAt": 0, "updatedAt": 0, "__v": 0}))

    if not skills:
        return f"No skills found for category: {category}" if category else "No skills found in database."

    return json.dumps(skills, default=str)


@tool
def search_projects(query: str = "") -> str:
    """
    Search published portfolio projects by technology, category, or keyword.
    Returns project title, tech stack, summary, AI architecture analysis, and links.
    """
    db = mongodb.database
    collection = db["projects"] if "projects" in db.list_collection_names() else db["Project"]

    filter_query = {"status": "published"}
    if query:
        regex = {"$regex": query, "$options": "i"}
        filter_query["$or"] = [
            {"title": regex},
            {"technologies": regex},
            {"category": regex},
            {"summary": regex},
        ]

    projects = list(
        collection.find(
            filter_query,
            {"_id": 0, "status": 0, "createdAt": 0, "updatedAt": 0, "__v": 0},
        ).limit(6)
    )

    print("\n\n\n\n\n\n\n")
    print(projects)
    print("\n\n\n\n\n\n\n")

    if not projects:
        return f"No published projects found matching query: '{query}'."

    return json.dumps(projects, default=str)


@tool
async def fetch_github_repo_readme(repo_name: str) -> str:
    """
    Directly fetches the raw README markdown of a specific GitHub repository owned by Kathan.
    Use this strictly if a user asks for granular source details not covered in the database.
    """
    username = settings.GITHUB_USERNAME
    clean_repo = repo_name.replace(f"{username}/", "").strip()
    url = f"https://api.github.com/repos/{username}/{clean_repo}/readme"
    headers = {"Accept": "application/vnd.github.raw+json"}
    
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

    async with httpx.AsyncClient(timeout=8.0) as client:
        try:
            res = await client.get(url, headers=headers)
            if res.status_code == 200:
                text = res.text.strip()
                return text[:3000] if text else "The repository README is empty."
            elif res.status_code == 404:
                return f"Repository '{clean_repo}' or its README was not found on GitHub."
            else:
                return f"GitHub API responded with status {res.status_code}."
        except Exception as e:
            return f"Error connecting to GitHub: {str(e)}"