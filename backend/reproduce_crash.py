import pandas as pd
from nlp_service import nlp_service
import sys

print("Recursion limit:", sys.getrecursionlimit())

# Create a dataframe that mimics user data
data = []
for i in range(50):
    # Create somewhat long text to ensure summarizer runs
    text = f"This is a comment about the policy. " * 20 + f"Variation {i}"
    data.append({
        "text": text,
        "author": "Tester",
        "industry": "Tech",
        "role": "Dev"
    })

df = pd.DataFrame(data)

print("Starting analysis...")
try:
    result = nlp_service.analyze_comments(df)
    print("Analysis successful!")
    print(result.stats)
except Exception as e:
    print(f"Caught exception: {e}")
except BaseException as be:
    print(f"Caught BaseException: {be}")
