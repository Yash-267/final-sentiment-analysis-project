from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from contextlib import asynccontextmanager
from nlp_service import NLPService
from data_models import DashboardData, Comment, SentimentStats, Summary
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import engine, get_db, Base
from db_models import DBComment, DBSummary
from typing import List

# Global NLP Service
nlp_service_instance: NLPService = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global nlp_service_instance
    print("Initializing Database Tables...")
    Base.metadata.create_all(bind=engine)
    
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
def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    global nlp_service_instance
    
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload .csv or .excel")

    try:
        contents = file.file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents), encoding='utf-8')
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        # Normalize headers
        df.columns = [c.lower() for c in df.columns]
        
        # Ensure 'text' column exists
        if 'text' not in df.columns:
             found = False
             for valid in ['comment', 'content', 'feedback']:
                 if valid in df.columns:
                     df.rename(columns={valid: 'text'}, inplace=True)
                     found = True
                     break
             if not found:
                 raise HTTPException(status_code=400, detail="Could not find a 'text' or 'comment' column in the file.")

        # Run Analysis
        analysis_data = nlp_service_instance.analyze_comments(df)
        
        # Clear existing data in database
        db.query(DBComment).delete()
        db.query(DBSummary).delete()
        
        # Insert new comments
        db_comments = []
        for c in analysis_data.comments:
            # We don't include the 'id' explicitly so the database auto-increments properly, 
            # or we can pass it if we want. Pydantic's model_dump/dict can be used.
            c_dict = c.dict()
            if 'id' in c_dict:
                del c_dict['id']
            db_comments.append(DBComment(**c_dict))
        
        db.bulk_save_objects(db_comments)
        
        # Insert new summaries
        db_summaries = []
        for s in analysis_data.summaries:
            s_dict = s.dict()
            db_summaries.append(DBSummary(**s_dict))
            
        db.bulk_save_objects(db_summaries)
        db.commit()
        
        return {"message": "Analysis Complete", "stats": analysis_data.stats}

    except Exception as e:
        db.rollback()
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/comments", response_model=List[Comment])
def get_comments(industry: str = None, role: str = None, sentiment: str = None, db: Session = Depends(get_db)):
    query = db.query(DBComment)
    
    if industry:
        query = query.filter(DBComment.industry == industry)
    if role:
        query = query.filter(DBComment.role == role)
    if sentiment:
        query = query.filter(DBComment.sentiment_category == sentiment)
        
    return query.all()

@app.get("/summary", response_model=List[Summary])
def get_summary(db: Session = Depends(get_db)):
    return db.query(DBSummary).all()

@app.get("/stats", response_model=SentimentStats)
def get_stats(db: Session = Depends(get_db)):
    total_comments = db.query(func.count(DBComment.id)).scalar()
    
    if total_comments == 0:
        return SentimentStats(
            total_comments=0,
            category_counts={},
            top_industries={},
            top_roles={}
        )
    
    # Category counts
    categories = db.query(DBComment.sentiment_category, func.count(DBComment.id)).group_by(DBComment.sentiment_category).all()
    category_counts = {c[0]: c[1] for c in categories if c[0]}
    
    # Top Industries
    industries = db.query(DBComment.industry, func.count(DBComment.id)).group_by(DBComment.industry).order_by(func.count(DBComment.id).desc()).limit(10).all()
    top_industries = {i[0]: i[1] for i in industries if i[0]}
    
    # Top Roles
    roles = db.query(DBComment.role, func.count(DBComment.id)).group_by(DBComment.role).order_by(func.count(DBComment.id).desc()).limit(10).all()
    top_roles = {r[0]: r[1] for r in roles if r[0]}
    
    return SentimentStats(
        total_comments=total_comments,
        category_counts=category_counts,
        top_industries=top_industries,
        top_roles=top_roles
    )
