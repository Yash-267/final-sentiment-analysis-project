from pydantic import BaseModel
from typing import List, Optional

class Comment(BaseModel):
    id: int
    text: str
    author: Optional[str] = "Anonymous"
    organization: Optional[str] = "N/A"
    industry: Optional[str] = "Unspecified"
    role: Optional[str] = "Contributor"
    date: Optional[str] = None
    section: Optional[str] = None
    sentiment_category: Optional[str] = None # Added after analysis
    sentiment_score: Optional[float] = None

class AnalysisRequest(BaseModel):
    pass # Mostly handled via file upload

class SentimentStats(BaseModel):
    total_comments: int
    category_counts: dict
    top_industries: dict
    top_roles: dict

class Summary(BaseModel):
    category: str
    text: str

class DashboardData(BaseModel):
    comments: List[Comment]
    stats: SentimentStats
    summaries: List[Summary]
