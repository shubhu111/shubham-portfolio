import os
import json
import hashlib
import uuid
import urllib.request
import time
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
from google import genai

# ==========================================
# 1. ENVIRONMENT & CONFIGURATION
# ==========================================
env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="ST-GPT Backend Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"), 
    api_key=os.getenv("QDRANT_API_KEY")
)

# ==========================================
# 2. LLM INITIALIZATION (Multi-Key Fallback)
# ==========================================
llms = []
for i in range(1, 6):
    key = os.getenv(f"GEMINI_API_KEY_{i}")
    if key:
        llms.append(
            ChatGoogleGenerativeAI(
                model="gemini-3.5-flash-lite",
                api_key=key,
                temperature=0.1,
                max_retries=1 
            )
        )

if not llms:
    raise ValueError("No Gemini API keys found in .env.local")

# Set primary LLM with automatic failover to fallback keys
llm = llms[0]
if len(llms) > 1:
    llm = llm.with_fallbacks(llms[1:])

memory = MemorySaver()
agent_executor = create_react_agent(
    model=llm, 
    tools=[], 
    checkpointer=memory
)

class ChatRequest(BaseModel):
    message: str
    mode: str = "RECRUITER" 
    thread_id: str = "default_session"

# ==========================================
# 3. HELPER TOOLS
# ==========================================
GITHUB_CACHE = {"timestamp": 0, "data": ""}

def get_embedding(text: str) -> list:
    gemini_keys = [
        os.getenv("GEMINI_API_KEY_1"),
        os.getenv("GEMINI_API_KEY_2"),
        os.getenv("GEMINI_API_KEY_3"),
        os.getenv("GEMINI_API_KEY_4"),
        os.getenv("GEMINI_API_KEY_5")
    ]
    
    valid_keys = [key for key in gemini_keys if key]
    
    if not valid_keys:
        raise ValueError("No Gemini API keys found in .env.local")
        
    for attempt, key in enumerate(valid_keys):
        try:
            temp_client = genai.Client(api_key=key)
            result = temp_client.models.embed_content(
                model="gemini-embedding-2",
                contents=text
            )
            return result.embeddings[0].values
        except Exception as e:
            print(f"--- EMBEDDING WARNING: Key {attempt + 1} failed ({str(e)}). Switching to fallback key... ---")
            continue
            
    raise Exception("All Gemini API keys failed. Rate limits exhausted.")

def fetch_github_activity(username: str = "shubhu111"): 
    global GITHUB_CACHE
    
    if time.time() - GITHUB_CACHE["timestamp"] < 900:
        return GITHUB_CACHE["data"]
        
    try:
        events_url = f"https://api.github.com/users/{username}/events/public"
        req_events = urllib.request.Request(events_url, headers={'User-Agent': 'Mozilla/5.0'})
        events_summary = "Recent Public GitHub Activity:\n"
        seen_events = set()
        
        with urllib.request.urlopen(req_events, timeout=3) as response:
            events_data = json.loads(response.read().decode())[:3]
            for event in events_data:
                repo_name = event.get("repo", {}).get("name", "")
                type_ = event.get("type", "Event").replace("Event", "")
                event_key = f"{type_}:{repo_name}"
                
                if event_key not in seen_events and repo_name:
                    seen_events.add(event_key)
                    repo_url = f"https://github.com/{repo_name}"
                    events_summary += f"- {type_} on [{repo_name}]({repo_url})\n"

        repos_url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page=3"
        req_repos = urllib.request.Request(repos_url, headers={'User-Agent': 'Mozilla/5.0'})
        repos_summary = "\nPublic Repositories:\n"
        with urllib.request.urlopen(req_repos, timeout=3) as response:
            repos_data = json.loads(response.read().decode())[:3]
            for repo in repos_data:
                name = repo.get("full_name")
                desc = repo.get("description") or "No description."
                url = repo.get("html_url")
                
                readme_snippet = ""
                try:
                    readme_url = f"https://api.github.com/repos/{name}/readme"
                    req_readme = urllib.request.Request(
                        readme_url, 
                        headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'application/vnd.github.raw+json'}
                    )
                    with urllib.request.urlopen(req_readme, timeout=2) as readme_res:
                        readme_content = readme_res.read().decode('utf-8')
                        clean_text = " ".join(readme_content.split())
                        readme_snippet = f" | README Extract: {clean_text[:75]}..."
                except Exception:
                    pass
                    
                repos_summary += f"- [{name}]({url}): {desc}{readme_snippet}\n"

        final_data = f"{events_summary}\n{repos_summary}"
        GITHUB_CACHE["data"] = final_data
        GITHUB_CACHE["timestamp"] = time.time()
        return final_data
        
    except Exception:
        return GITHUB_CACHE["data"] if GITHUB_CACHE["data"] else "Could not fetch live GitHub stats."

# ==========================================
# 4. API ENDPOINTS & STREAM GENERATOR
# ==========================================
@app.get("/")
async def root():
    return {"status": "online", "engine": "Direct Enterprise RAG Agent", "vector_db": "Connected"}

async def generate_chat_stream(user_message: str, mode: str, thread_id: str = "default_session"):
    print(f"\n--- INCOMING MESSAGE: {user_message} | MODE: {mode} | THREAD: {thread_id} ---")
    
    msg_lower = user_message.lower().strip()
    is_jd_match = len(user_message) > 150 and any(kw in msg_lower for kw in ["job", "jd", "requirements", "description", "responsibilities"])
    
    pure_greetings = ["hi", "hello", "hey", "hi buddie", "hello buddie", "hey there", "hi there", "sup", "hi bro"]
    is_greeting = msg_lower in pure_greetings

    context_str = ""
    github_context = ""
    
    # DYNAMIC INTENT ROUTER
    if not is_greeting:
        github_keywords = ["github", "code", "repo", "commit", "source", "deploy", "live"]
        qdrant_keywords = ["project", "skill", "experience", "work", "portfolio", "tech", "stack", "learn"]
        
        fetch_github = any(kw in msg_lower for kw in github_keywords)
        fetch_qdrant = any(kw in msg_lower for kw in qdrant_keywords) or is_jd_match
        
        if not fetch_github and not fetch_qdrant:
            fetch_qdrant = True
            
        if fetch_github:
            github_context = fetch_github_activity()
            print("--- ROUTER: Fetched GitHub Context ---")
            
        if fetch_qdrant:
            try:
                query_vector = get_embedding(user_message)

                search_response = qdrant.query_points(
                    collection_name="portfolio_context",
                    query=query_vector,
                    limit=5
                )
                
                search_results = search_response.points if hasattr(search_response, 'points') else search_response
                
                for point in search_results:
                    context_str += f"\n- {point.payload.get('topic')}: {point.payload.get('content')}"
                    
                print(f"--- ROUTER: QDRANT RETRIEVED DATA SUCCESSFULLY ---")
                
            except Exception as e:
                print(f"--- QDRANT SEARCH FAILED: {str(e)} ---")
    else:
        print("--- ROUTER: Simple greeting detected. Bypassed Data Fetch. ---")

    role_instruction = """
    TECH LEAD MODE: Dive directly into system architectures, vector dimensions, data pipelines, and database latency. Use high-level technical terminology.
    """ if mode == "TECH_LEAD" else """
    RECRUITER MODE: Focus on business impact, product outcomes, and high-level summaries. Avoid overly dense code-level jargon.
    """

    if is_jd_match:
        SYSTEM_INSTRUCTION = f"""<system_directive>
You are ST-GPT. The user has provided a Job Description (JD). Execute a precise JD Match Analysis.
</system_directive>

<retrieved_context>
{context_str}
</retrieved_context>

<execution_rules>
Provide a structured output containing:
0. WARM OPENING: ALWAYS start with a highly professional, encouraging statement acknowledging the job description. (e.g., "Thank you for sharing this role with me! I would be happy to show you how Shubham's background aligns with these requirements:"). Do not sound robotic.
1. Match Rating: Provide an objective percentage alignment (e.g., "Strong 90% Match").
2. Key Strengths: Direct mapping between JD requirements and Shubham's actual skills/projects in the <retrieved_context>. Use clean, single-line bullet points.
3. Gap Analysis: If a requirement is missing from his context, pivot to his core AI/Data strengths positively.
4. MANDATORY FOLLOW-UP: End your response with a single, relevant question asking how they want to proceed.
</execution_rules>"""
    else:
        SYSTEM_INSTRUCTION = f"""<system_directive>
You are ST-GPT, a highly advanced AI assistant acting as the interactive portfolio guide for Shubham Gajanan Tade. You operate with premium corporate professionalism, natural conversational flow, empathy, and structural clarity.
</system_directive>

<core_identity>
- AI NATURE: You are an artificial intelligence. You do not have physical states, but you MUST be warm, polite, and enthusiastic like a professional human recruiter or concierge.
- Subject: Shubham Gajanan Tade (AI/ML Engineer & Data Analyst based in Pune, India).
- Caresila Project Constraint: Strictly emphasize data cleaning, data collection, and frontend deployment.
</core_identity>

<system_architecture>
If the user asks how you work, what your architecture is, or about your RAG pipeline, use these exact facts:
- Frontend: Next.js and React (Client-side DOM manipulation)
- Backend: FastAPI (Python)
- Orchestration: LangGraph (Agentic routing and memory)
- LLM / Generation: Gemini 3.5 Flash Lite via Google GenAI for high-speed, stable token limits
- Resilience: 5-API Key Fallback Rotation for 100% uptime and bypassing rate limits
- Context Pipeline: Dynamic Intent Router (Only fetches Qdrant for projects/skills, and GitHub for code/commits to save tokens)
- Embeddings: gemini-embedding-2 via Google GenAI
- Vector Database: Qdrant (Semantic similarity search)
- Content Management: Sanity CMS connected via webhooks
</system_architecture>

<retrieved_context>
{context_str if context_str else "No specific database context found for this query. Rely on conversation history."}
{github_context}
</retrieved_context>
<formatting_directive>
CRITICAL FORMATTING RULES - YOU MUST OBEY:
1. NATURAL ACKNOWLEDGMENT: ALWAYS open with a brief, natural, 1-sentence reaction to the user's specific input before giving details.
   - If they compliment something ("i like it!"), react directly: "Glad you like it!" or "Awesome!"
   - If they say "sure" or "yes", keep it simple: "Great, let's dive in!"
   - NEVER repeat robotic phrases like "I would be more than happy" or "I would be thrilled" on consecutive turns.
2. NO DENSE PARAGRAPHS: NEVER output a single, long block of text or paragraph. Break information into scannable chunks.
3. BULLET POINT SYMBOLS: ALWAYS use clean dashes (`-`) for lists. DO NOT use asterisks (`*` or `**`) for bullet points.
4. STRICT SINGLE-LINE BULLETS (CRITICAL FOR LINKS): Every bullet point MUST stay on a SINGLE continuous line. When referencing GitHub repositories or projects with links, write the dash, title link, and description continuously on ONE line without any newlines. Format exactly like this:
   `- [shubhu111/wake_stgpt](https://github.com/shubhu111/wake_stgpt): An automated worker engine.`
   NEVER place a newline after a dash `-` or around markdown links.
5. ACTIVE MARKDOWN LINKS: Include active markdown links directly when referencing GitHub repositories or project URLs.
6. NO SPECULATIVE LANGUAGE: DO NOT use speculative language like "likely related to" or "appears to be." State facts directly as provided in the context or README extracts.
7. SECTION SPACING: Add a blank line between different topics or sections to keep the UI scannable, but NEVER place a newline or blank line inside an individual bullet point.
</formatting_directive>

<operational_rules>
1. FACTUAL GROUNDING: Base technical answers strictly on the <retrieved_context>, <system_architecture>, and chat history.
2. GREETINGS: If the user sends a simple greeting, respond with a single warm, professional sentence asking how you can help.
3. INVISIBLE INTEGRATION: Do not use phrases like "Based on the provided context."
4. TONE & ADAPTABILITY: {role_instruction}. Be natural, professional, and vary your vocabulary across conversation turns.
5. MANDATORY FOLLOW-UP: End technical answers with a single, short follow-up suggestion.
6. DOM ACTIONS: If navigating to projects or resume, append `[ACTION:SCROLL_TO_PROJECTS]` or `[ACTION:SCROLL_TO_RESUME]` at the very end.
</operational_rules>"""

    inputs = {
        "messages": [
            SystemMessage(content=SYSTEM_INSTRUCTION, id="core_system_instruction"),
            HumanMessage(content=user_message)
        ]
    }
    
    config = {"configurable": {"thread_id": thread_id}}
    
    print("--- GENERATING AI RESPONSE ---")
    async for event in agent_executor.astream_events(inputs, config=config, version="v2"):
        kind = event["event"]
        if kind == "on_chat_model_stream":
            raw_chunk = event["data"]["chunk"].content
            if raw_chunk:
                # UNIFYING GEMINI MULTI-PART CONTENT INTO A CLEAN STRING
                text_content = ""
                if isinstance(raw_chunk, list):
                    for item in raw_chunk:
                        if isinstance(item, str):
                            text_content += item
                        elif isinstance(item, dict) and "text" in item:
                            text_content += item["text"]
                        elif hasattr(item, "text"):
                            text_content += str(item.text)
                elif isinstance(raw_chunk, str):
                    text_content = raw_chunk
                else:
                    text_content = str(raw_chunk)

                if text_content:
                    yield f"data: {json.dumps({'text': text_content})}\n\n"
    
    yield "data: [DONE]\n\n"

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    return StreamingResponse(
        generate_chat_stream(request.message, request.mode, request.thread_id), 
        media_type="text/event-stream"
    )

# ==========================================
# 5. SANITY CMS INGESTION WEBHOOK
# ==========================================
@app.post("/api/webhook/sanity")
async def sanity_webhook(request: dict):
    try:
        raw_doc_id = request.get("_id", "unknown_id")
        doc_id = raw_doc_id.replace("drafts.", "")
        
        id_hash = hashlib.md5(doc_id.encode()).hexdigest()
        qdrant_id = str(uuid.UUID(id_hash))
        
        clean_payload = {k: v for k, v in request.items() if not k.startswith('_')}
        
        if not clean_payload:
            qdrant.delete(
                collection_name="portfolio_context",
                points_selector=[qdrant_id]
            )
            print(f"--- WEBHOOK SUCCESS: Deleted document from Qdrant ---")
            return {"status": "success", "message": "Deleted from Qdrant"}
            
        doc_type = request.get("_type", "document")
        topic = (
            request.get("title") or 
            request.get("domainTitle") or 
            request.get("roadmapTitle") or 
            request.get("projectName") or 
            request.get("name") or 
            f"Update: {doc_type}"
        )
        content = json.dumps(clean_payload, indent=2)
            
        text_to_embed = f"Topic: {topic}\nContent: {content}"
        print(f"--- WEBHOOK TRIGGERED: Syncing '{topic}' to AI Brain ---")
        
        vector = get_embedding(text_to_embed)
        
        qdrant.upsert(
            collection_name="portfolio_context",
            points=[
                PointStruct(
                    id=qdrant_id,
                    vector=vector,
                    payload={"topic": topic, "content": text_to_embed}
                )
            ]
        )
        print(f"--- WEBHOOK SUCCESS: '{topic}' is live/updated in Qdrant ---")
        return {"status": "success", "message": f"Updated Qdrant for {topic}"}
        
    except Exception as e:
        print(f"--- WEBHOOK ERROR: {str(e)} ---")
        return {"status": "error", "message": str(e)}