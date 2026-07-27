# MCA e-Consultation Sentiment Analysis Dashboard

A full-stack, AI-powered application designed to analyze, categorize, and visualize public sentiment on legislative drafts issued by the Ministry of Corporate Affairs (MCA). 

By leveraging cutting-edge Natural Language Processing (NLP), this dashboard instantly transforms thousands of raw public comments into actionable insights, interactive charts, and concise summaries.

---

##  Features

- ** Advanced NLP Engine**: Uses Hugging Face Transformers (`distilbert-base-uncased-finetuned-sst-2-english`) to accurately classify comment sentiments (Positive, Critical, Negative).
- ** Automated Summarization**: Employs an NLTK-based extraction algorithm to identify key themes and frequently discussed topics.
- ** Persistent Storage**: All processed feedback is securely stored in a local SQLite database using SQLAlchemy, ensuring lightning-fast retrievals without needing to re-analyze files.
- ** Premium UI/UX**: Built with React and Vite, featuring a responsive, modern aesthetic.
  - ** Dark Mode**: Seamlessly switch between light and dark themes.
  - ** Keyword Highlighting**: Instantly locate searched terms highlighted vividly within the comment text.
  - ** Interactive Visuals**: Click on any chart segment (via Recharts) to automatically filter the main dashboard view.
  - ** Export Capabilities**: Download the analyzed data as a CSV or generate a PDF report of the visual dashboard.

---

##  Architecture

- **Frontend**: React 19, Vite, Recharts, Lucide-React, Vanilla CSS
- **Backend**: FastAPI, Pandas, SQLAlchemy, Transformers, NLTK, Uvicorn
- **Database**: SQLite

---

##  Local Setup Instructions

Follow these steps to run the complete application on your local machine.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **Python** (v3.9 or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Yash-267/final-sentiment-analysis-project.git
cd final-sentiment-analysis-project
```

### 2. Backend Setup
Open a terminal and navigate to the backend folder:
```bash
cd backend
```
Create a virtual environment (optional but recommended):
```bash
python -m venv env
# On Windows:
env\Scripts\activate
# On Mac/Linux:
source env/bin/activate
```
Install the Python dependencies:
```bash
pip install -r requirements.txt
```
Start the FastAPI server:
```bash
uvicorn main:app --reload
```
### 3. Frontend Setup
Open a **new** terminal and navigate to the frontend folder:
```bash
cd frontend
```
Install the Node dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm run dev
```

---

## ☁️ Deployment

- **Backend**: Configured via the included `Dockerfile` to be seamlessly deployed to **Hugging Face Spaces**.
- **Frontend**: Ready to be built (`npm run build`) and deployed to standard static hosting providers like Vercel, Netlify, or GitHub Pages.
