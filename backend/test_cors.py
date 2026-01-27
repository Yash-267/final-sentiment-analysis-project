import requests

print("Testing CORS Options Request...")
try:
    r = requests.options("http://localhost:8001/upload", headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST"
    })
    print(f"Status: {r.status_code}")
    print(f"Headers: {r.headers}")
except Exception as e:
    print(f"Failed: {e}")

print("\nTesting Upload Request...")
try:
    files = {'file': ('test.csv', b'text,author\nHello,Me', 'text/csv')}
    r = requests.post("http://localhost:8001/upload", files=files)
    print(f"Upload Status: {r.status_code}")
except Exception as e:
    print(f"Upload Failed: {e}")
