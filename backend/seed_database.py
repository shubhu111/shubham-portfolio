import os
import uuid
from pathlib import Path
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from google import genai

# Load environment variables
env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

# Initialize clients
qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"), 
    api_key=os.getenv("QDRANT_API_KEY")
)
ai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

COLLECTION_NAME = "portfolio_context"

# 1. Create the Collection (Drop if it already exists to start fresh)
if qdrant.collection_exists(collection_name=COLLECTION_NAME):
    qdrant.delete_collection(collection_name=COLLECTION_NAME)
    print(f"Deleted existing collection: {COLLECTION_NAME}")

qdrant.create_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(size=3072, distance=Distance.COSINE),
)
print(f"Created new collection: {COLLECTION_NAME} (3072 dimensions)")

# 2. Your Professional Data (Add more chunks here as needed)
portfolio_data = [
    {
        "topic": "Professional Summary & Demographics",
        "content": "Shubham Gajanan Tade is an AI/ML Engineer and Data Analyst based in Pune and Khamgaon, India. He holds a Bachelor of Technology in Computer Science & Engineering (2020-2024). He balances deep ML architecture knowledge with practical data analysis skills."
    },
    {
        "topic": "AI & Data Science Training",
        "content": "Shubham's expertise in Generative AI, Retrieval-Augmented Generation (RAG), and LangChain was acquired through external professional training at 3RI Technology in Pune, as well as intensive self-study after his undergraduate degree."
    },
    {
        "topic": "Work Experience - PandoAI Solutions (Caresila Hospital Portal)",
        "content": "As an AI/ML Engineer and Data Analyst at PandoAI Solutions Pvt. Ltd., Shubham developed the 'Caresila Hospital Portal'. His core role focused heavily on large-scale data cleaning, data collection workflows, and frontend deployment to manage massive datasets encompassing over 100,000 hospitals."
    },
    {
        "topic": "Project - ST-GPT",
        "content": "ST-GPT is a personalized conversational AI companion hosted on Streamlit. It features multi-modal capabilities including memory-enabled conversational AI, a YouTube video RAG pipeline, and PDF document analysis."
    },
    {
        "topic": "Project - IoT Smart Car Build (SIH Prototype)",
        "content": "Engineered an IoT-based smart car designed around a safety-first architecture. Programmed an Arduino UNO in C++ to process live data from ultrasonic and MQ3 sensors to execute automated braking. Integrated GPS NEO 6 & GSM modules for real-time tracking and SOS dispatches."
    },
    {
        "topic": "Project - Universal Job Engine",
        "content": "A tool designed to aggregate listings from multiple job portals into a single dashboard. Shubham used APIs and automation scripts to optimize the workflow."
    },
    {
        "topic": "Technical Skills & Preferences",
        "content": "Shubham's toolkit includes Python, SQL, Pandas, NumPy, LangChain, Streamlit, and vector databases (like Qdrant). He loves using automation scripts to optimize workflows and prefers minimalist, modern UI/UX web designs."
    }
]

# 3. Generate Embeddings and Upload to Qdrant
points = []
print("Generating embeddings and preparing data...")

for item in portfolio_data:
    # Generate the 3072-dimension vector using Gemini 2
    response = ai_client.models.embed_content(
        model="gemini-embedding-2",
        contents=item["content"]
    )
    vector = response.embeddings[0].values
    
    # Create a Qdrant Point
    point = PointStruct(
        id=str(uuid.uuid4()),
        vector=vector,
        payload={
            "topic": item["topic"],
            "content": item["content"]
        }
    )
    points.append(point)

# Upload the points
qdrant.upsert(
    collection_name=COLLECTION_NAME,
    points=points
)
print(f"Successfully uploaded {len(points)} records to Qdrant!")