import pandas as pd
from collections import Counter
from data_models import Comment, SentimentStats, Summary, DashboardData
import re

# Lazy imports for heavy libraries to prevent LS crashes
# import torch
# from transformers import pipeline

class NLPService:
    def __init__(self):
        print("Initializing NLP Service...")
        # Move imports here to prevent static analysis tools (LS) from crashing/hanging
        try:
            import torch
            from transformers import pipeline
            import nltk
            
            # Download necessary NLTK data quietly
            try:
                nltk.data.find('tokenizers/punkt')
            except LookupError:
                nltk.download('punkt', quiet=True)
            try:
                nltk.data.find('tokenizers/punkt_tab')
            except LookupError:
                nltk.download('punkt_tab', quiet=True)
            try:
                nltk.data.find('corpora/stopwords')
            except LookupError:
                nltk.download('stopwords', quiet=True)
                
        except ImportError as e:
            print(f"CRITICAL ERROR: Missing dependencies: {e}")
            raise e

        # Check for GPU
        device = 0 if torch.cuda.is_available() else -1
        print(f"Using device: {device}")

        print("Loading Sentiment Model (Transformers)...")
        
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="tabularisai/multilingual-sentiment-analysis",
            device=device
        )
        
        # REPLACING Summarizer with Lightweight NLTK
        # self.summarizer = pipeline("summarization", ...) # Removed heavy BART model
        print("Initialized Lightweight Summarizer (NLTK-based).")

        self.sentiment_map = {
            5: "Positive - Transformative support",
            4: "Supportive - Broadly supportive",
            3: "Critical/Suggestive - Constructive criticism",
            2: "Concerned - Specific objections",
            1: "Negative - Urgent opposition"
        }

    def _map_sentiment(self, label: str):
        # Handle various model outputs
        score_int = 3 # Default neutral
        
        if "star" in label:
            try:
                score_int = int(label.split(' ')[0])
            except:
                pass
        elif label.upper() in ["POSITIVE", "LABEL_2"]:
            score_int = 5
        elif label.upper() in ["NEUTRAL", "LABEL_1"]:
            score_int = 3
        elif label.upper() in ["NEGATIVE", "LABEL_0"]:
            score_int = 1
        
        return self.sentiment_map.get(score_int, "Critical/Suggestive - Constructive criticism")

    def _generate_extractive_summary(self, text, top_n=None):
        import nltk
        from nltk.corpus import stopwords
        from nltk.tokenize import sent_tokenize, word_tokenize
        
        if not text:
            return "No content to summarize."
            
        try:
            sentences = sent_tokenize(text)
        except LookupError:
            # Fallback if punkt is missing despite check
            nltk.download('punkt', quiet=True)
            nltk.download('punkt_tab', quiet=True)
            sentences = sent_tokenize(text)

        # Dynamic summary length: 25% of sentences, bounded between 3 and 10 sentences
        if top_n is None:
            top_n = max(3, min(10, int(len(sentences) * 0.25)))

        if len(sentences) <= top_n:
            return text

        stop_words = set(stopwords.words("english"))
        words = word_tokenize(text.lower())
        
        # Frequency map
        freq_table = dict()
        for word in words:
            if word in stop_words or not word.isalnum():
                continue
            if word in freq_table:
                freq_table[word] += 1
            else:
                freq_table[word] = 1
        
        # Score sentences
        sentence_scores = dict()
        for sentence in sentences:
            for word, freq in freq_table.items():
                if word in sentence.lower():
                    if sentence in sentence_scores:
                        sentence_scores[sentence] += freq
                    else:
                        sentence_scores[sentence] = freq
        
        # Get top N
        import heapq
        if not sentence_scores:
            return sentences[0] if sentences else ""

        summary_sentences = heapq.nlargest(top_n, sentence_scores, key=sentence_scores.get)
        return ' '.join(summary_sentences)

    def analyze_comments(self, comments_df: pd.DataFrame) -> DashboardData:
        # Preprocessing
        comments_df.fillna("", inplace=True)
        
        # 1. Sentiment Analysis (Heavy Model)
        texts = comments_df['text'].astype(str).tolist()
        print(f"Analyzing {len(texts)} comments with Sentiment Model...")
        
        # Truncate for model limit 
        texts = [t[:512] for t in texts] 
        
        # Batch processing
        results = []
        batch_size = 32
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            try:
                batch_results = self.sentiment_analyzer(batch)
                results.extend(batch_results)
            except Exception as e:
                print(f"Error in batch {i}: {e}")
                for _ in batch:
                    results.append({'label': 'NEUTRAL', 'score': 0.0})
        
        processed_comments = []
        sentiment_groups = {k: [] for k in self.sentiment_map.values()}
        
        for idx, (row, res) in enumerate(zip(comments_df.to_dict('records'), results)):
            category = self._map_sentiment(res['label'])
            
            c = Comment(
                id=idx + 1,
                text=row.get('text', ''),
                author=row.get('author', 'Anonymous'),
                organization=row.get('organization', 'N/A'),
                industry=row.get('industry', 'Unspecified'),
                role=row.get('role', 'Contributor'),
                date=str(row.get('date', '')),
                section=row.get('section', ''),
                sentiment_category=category,
                sentiment_score=res['score']
            )
            processed_comments.append(c)
            sentiment_groups[category].append(c.text)

        # 2. Summarization (Lightweight)
        print("Generating Summaries (Lightweight)...")
        summaries = []
        for category, texts_list in sentiment_groups.items():
            if not texts_list:
                continue
            
            # Combine all texts for this category
            full_text = " ".join(texts_list)
            
            # Limit input size for performance (e.g. 50k chars)
            if len(full_text) > 50000:
                full_text = full_text[:50000]
            
            try:
                summary_text = self._generate_extractive_summary(full_text)
            except Exception as e:
                print(f"Summary generation failed for {category}: {e}")
                summary_text = f"Analysis failed: {str(e)}"

            summaries.append(Summary(category=category, text=summary_text))
            
        # 3. Stats
        counts = Counter([c.sentiment_category for c in processed_comments])
        ind_counts = Counter([c.industry for c in processed_comments])
        role_counts = Counter([c.role for c in processed_comments])
        
        stats = SentimentStats(
            total_comments=len(processed_comments),
            category_counts=dict(counts),
            top_industries=dict(ind_counts.most_common(10)),
            top_roles=dict(role_counts.most_common(10))
        )
        
        return DashboardData(
            comments=processed_comments,
            stats=stats,
            summaries=summaries
        )

# Global Instance - REMOVED




