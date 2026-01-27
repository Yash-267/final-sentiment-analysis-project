import pandas as pd
import requests
import io

# Create a dataframe
data = [{"text": "This is a test comment", "author": "me"} for _ in range(10)]
df = pd.DataFrame(data)

# Save to excel buffer
excel_buffer = io.BytesIO()
df.to_excel(excel_buffer, index=False)
excel_buffer.seek(0)

print("Uploading Excel file...")
try:
    files = {'file': ('test.xlsx', excel_buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
    r = requests.post('http://localhost:8001/upload', files=files)
    print(f"Status: {r.status_code}")
    print(r.text[:200])
except Exception as e:
    print(f"Error: {e}")
