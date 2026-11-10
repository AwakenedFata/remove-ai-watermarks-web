# ==========================================
# Stage 1: Build React Vite Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Python Backend & Unified Server
# ==========================================
FROM python:3.12-slim

# Install system dependencies needed for OpenCV, C2PA, and libGL
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy server code
COPY server/ ./server/
COPY pyproject.toml ./

# Copy built frontend assets from stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure upload/output directories exist
RUN mkdir -p server/uploads server/outputs

# Expose port (default 8000)
ENV PORT=8000
EXPOSE 8000

# Start server using shell form so $PORT expands dynamically in cloud environments
CMD uvicorn server.app:app --host 0.0.0.0 --port ${PORT}
