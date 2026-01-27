from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from contextlib import asynccontextmanager
from nlp_service import NLPService
from data_models import DashboardData, Comment

# Global State (In-Memory Database)
current_data: DashboardData = None
nlp_service_instance: NLPService = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global nlp_service_instance
    print("Initializing NLP Service...")
    nlp_service_instance = NLPService()
    yield
    print("Shutting down...")

app = FastAPI(title="MCA Sentiment Analysis", description="Backend for MCA e-Consultation Dashboard", lifespan=lifespan)

# Logging Middleware
from fastapi import Request
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response Status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request Failed: {e}")
        raise e

# CORS
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "MCA Sentiment Analysis API is running."}

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    global current_data, nlp_service_instance
    
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload .csv or .excel")

    try:
        contents = file.file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        # Validate required columns
        # Flexible matching? For now expect keys from sample
        # id, text, author, organization, industry, role, date, section
        # If headers are different, we might need a mapping step. 
        # For now, let's normalize headers to lowercase using best-effort match
        df.columns = [c.lower() for c in df.columns]
        
        # Ensure 'text' column exists
        if 'text' not in df.columns:
             # Try to find a 'comment' or 'content' column
             found = False
             for valid in ['comment', 'content', 'feedback']:
                 if valid in df.columns:
                     df.rename(columns={valid: 'text'}, inplace=True)
                     found = True
                     break
             if not found:
                 raise HTTPException(status_code=400, detail="Could not find a 'text' or 'comment' column in the file.")

        # Run Analysis
        current_data = nlp_service_instance.analyze_comments(df)
        
        return {"message": "Analysis Complete", "stats": current_data.stats}

    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/comments")
def get_comments(industry: str = None, role: str = None, sentiment: str = None):
    if not current_data:
        return []
    
    filtered = current_data.comments
    
    if industry:
        filtered = [c for c in filtered if c.industry == industry]
    if role:
        filtered = [c for c in filtered if c.role == role]
    if sentiment:
        filtered = [c for c in filtered if c.sentiment_category == sentiment]
        
    return filtered

@app.get("/summary")
def get_summary():
    if not current_data:
        return []
    return current_data.summaries

@app.get("/stats")
def get_stats():
    if not current_data:
        return {}
    return current_data.stats
