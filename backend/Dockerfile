# Use official Python runtime as a parent image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies (sometimes needed for scipy/transformers)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
# Using --no-cache-dir to keep image size small
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK data (punkt, stopwords) which might be needed
RUN python -m nltk.downloader punkt stopwords

# Create a user to run the app (security best practice)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Copy the rest of the application
COPY --chown=user . .

# Create cache directory for Transformers to avoid permission issues
RUN mkdir -p /home/user/.cache/huggingface && chmod -R 777 /home/user/.cache

# Expose the port (Hugging Face Spaces expsects 7860 by default usually, but we can config)
# Or standard 8000. Let's stick to 8000 and configure start command.
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
