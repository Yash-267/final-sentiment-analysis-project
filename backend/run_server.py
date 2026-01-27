import uvicorn

if __name__ == "__main__":
    try:
        print("Starting server...")
        uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False)
    except Exception as e:
        print(f"Server crashed: {e}")
