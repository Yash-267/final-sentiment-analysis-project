from nlp_service import NLPService
import pandas as pd

try:
    print("Testing NLP Service Summary...")
    nlp = NLPService()
    text = "This is a test sentence. " * 20
    summary = nlp._generate_extractive_summary(text)
    print(f"Summary Result: {summary}")
except Exception as e:
    print(f"FAILED: {e}")
