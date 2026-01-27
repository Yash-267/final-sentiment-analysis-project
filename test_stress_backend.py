import requests
import io
import pandas as pd
import time

# Generate a larger dataset
print("Generating large dataset...")
rows = []
for i in range(100):
   rows.append({
       "text": f"This is comment number {i}. I think this proposal has some merits but also significant flaws in section {i%5}.",
       "author": f"User {i}",
       "industry": "Tech" if i % 2 == 0 else "Finance",
       "role": "Manager"
   })

df = pd.DataFrame(rows)
csv_buffer = io.BytesIO()
df.to_csv(csv_buffer, index=False)
csv_buffer.seek(0)
csv_buffer.name = "stress_test.csv"

print("Testing Backend with 100 comments at http://localhost:8001/upload ...")
try:
    start_time = time.time()
    files = {'file': ('stress_test.csv', csv_buffer, 'text/csv')}
    r = requests.post('http://localhost:8001/upload', files=files, timeout=60) # Increased timeout
    end_time = time.time()
    
    print(f"Status Code: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print("Success!")
        print(f"Stats: {data.get('stats')}")
        print(f"Time taken: {end_time - start_time:.2f} seconds")
    else:
        print(f"Failed with status {r.status_code}: {r.text}")

except Exception as e:
    print(f"FAILED (Network Error or Timeout): {e}")
