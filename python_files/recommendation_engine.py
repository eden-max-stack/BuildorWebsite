from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from huggingface_hub import login
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import chromadb
from chromadb.config import Settings
import json
from sentence_transformers import SentenceTransformer
import os
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


def load_context_from_file(filename="context_data.json"):
    try:
        with open(filename, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        # Return empty context if file doesn't exist
        return []

class QueryRequest(BaseModel):
    query: str
    max_results: Optional[int] = 3
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 200

class RecommendationResponse(BaseModel):
    query: str
    context: List[str]
    recommendation: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load embedder
    app.state.embedder = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Load context
    app.state.context_data = load_context_from_file()
    
    # Extract and embed texts
    texts = []
    for item in app.state.context_data:
        combined = " | ".join(str(value) for value in item.values() if isinstance(value, str))
        texts.append(combined)
    
    app.state.embeddings = app.state.embedder.encode(texts)
    
    # Set up ChromaDB
    app.state.client = chromadb.Client(Settings(anonymized_telemetry=False))
    # Use get_or_create to handle restarts
    try:
        app.state.collection = app.state.client.create_collection("tech_stacks")
        # Add docs
        for i, doc in enumerate(texts):
            app.state.collection.add(
                documents=[doc],
                ids=[str(i)],
                embeddings=[app.state.embeddings[i]]
            )
    except:
        # Collection already exists
        app.state.collection = app.state.client.get_collection("tech_stacks")
    
    # Set up HuggingFace model
    model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    
    app.state.tokenizer = AutoTokenizer.from_pretrained(model_name)
    app.state.model = AutoModelForCausalLM.from_pretrained(
        model_name,
        device_map="auto",
        torch_dtype="auto"
    )
    
    app.state.gen_pipeline = pipeline("text-generation", 
                                     model=app.state.model, 
                                     tokenizer=app.state.tokenizer)
    
    yield
    
    # Cleanup code would go here (if needed)

app = FastAPI(
    title="Tech Stack Recommendation API", 
    description="API for recommending tech stacks based on user queries",
    lifespan=lifespan
)

origins = [
    "http://localhost:5173",  # your frontend dev URL
    # Add other URLs if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)

@app.post("/recommend", response_model=RecommendationResponse)
async def recommend_stack(request: QueryRequest = Body(...)):
    # Create query embedding
    query_embedding = app.state.embedder.encode([request.query])[0]
    
    # Retrieve relevant context
    results = app.state.collection.query(
        query_embeddings=[query_embedding],
        n_results=request.max_results
    )
    
    retrieved_docs = results['documents'][0]
    
    # Generate recommendation
    prompt = f"""### Instruction:
    You are an expert mentor for CS students.
    Based on the context below, answer the user's query with a tech stack recommendation in one line only.

    ### Context:
    {retrieved_docs}

    ### Query:
    {request.query}

    ### Response:
    """
    
    response = app.state.gen_pipeline(
        prompt, 
        do_sample=True, 
        max_new_tokens=request.max_tokens, 
        temperature=request.temperature, 
        return_full_text=False
    )
    
    recommendation = response[0]["generated_text"].strip()
    
    return RecommendationResponse(
        query=request.query,
        context=retrieved_docs,
        recommendation=recommendation
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("recommendation_engine:app", host="0.0.0.0", port=8001, reload=True)