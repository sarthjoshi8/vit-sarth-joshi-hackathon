#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# FINRISK AI — Unified Runner Script
# S&P Global & CRISIL Campus Hackathon 2026
# ═══════════════════════════════════════════════════════════════

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================================="
echo "⚡ Starting FINRISK AI System..."
echo "=========================================================="

# 1. Activate Python virtual environment
if [ -d ".venv" ]; then
    echo "✓ Activating .venv..."
    source .venv/bin/activate
else
    echo "Creating virtual environment..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
fi

# 2. Check and sample data if needed
if [ ! -f "data/samples/transactions_sample.csv" ]; then
    echo "Generating dataset samples..."
    python3 scripts/make_samples.py
fi

# 3. Start FastAPI Backend in background
echo "🚀 Starting FastAPI Backend at http://127.0.0.1:8000 ..."
PYTHONPATH=. uvicorn src.backend.app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Trap signals to cleanly shutdown both servers
trap "echo 'Shutting down FINRISK AI...'; kill $BACKEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM EXIT

# Give backend a moment to initialize
sleep 2

# 4. Start Vite Frontend
echo "🌐 Starting Vite Frontend at http://localhost:5173 ..."
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
