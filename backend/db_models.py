from sqlalchemy import Column, Integer, String, Float
from database import Base

class DBComment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    author = Column(String, default="Anonymous")
    organization = Column(String, default="N/A")
    industry = Column(String, default="Unspecified")
    role = Column(String, default="Contributor")
    date = Column(String, nullable=True)
    section = Column(String, nullable=True)
    sentiment_category = Column(String, nullable=True)
    sentiment_score = Column(Float, nullable=True)

class DBSummary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True, nullable=False)
    text = Column(String, nullable=False)
