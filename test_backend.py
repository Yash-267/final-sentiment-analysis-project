import requests
import io
import pandas as pd

# Create a dummy CSV in memory
data = "text,author\nI love this proposal, it is great!,John Doe\nThis is terrible, I hate it.,Jane Smith"
f = io.BytesIO(data.encode('utf-8'))
f.name = "test.csv"

print("Testing Backend at http://localhost:8001/upload ...")
try:
    files = {'file': ('test.csv', f, 'text/csv')}
    r = requests.post('http://localhost:8001/upload', files=files)
    print(f"Status Code: {r.status_code}")
    print(f"Response: {r.json()}")
except Exception as e:
    print(f"FAILED: {e}")
