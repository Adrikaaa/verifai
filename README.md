# Veri.Ai

Veri.Ai is a Content Authenticity SaaS platform designed to detect AI-generated media (images, videos, audio, text) and verify authenticity.

## Project Structure

This repository contains the source code for the entire Veri.Ai ecosystem:

- **`frontend/`**: The Next.js web application (Landing Page + Dashboard). Based on `create-next-app` with Tailwind CSS.
- **`backend/`**: The FastAPI backend service for handling verification requests and integrating with AI models.
- **`extension/`**: The Browser Extension (Chrome Manifest V3) for quick content verification.

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.9+)
- **Chrome/Edge** (for extension testing)

### 1. Frontend Setup (Web App)

Navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 2. Backend Setup (API)

Navigate to the `backend` directory:

```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
# Activate virtual environment:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000).
API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `extension` folder in this repository.
5. The Veri.Ai extension should now be visible in your toolbar.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Framer Motion (planned), Aceternity UI/Magic UI (recommended).
- **Backend**: FastAPI, Python.
- **Extension**: Vanilla JS + Chrome Extension API (Manifest V3).
- **AI Models**: placeholder logic currently implemented; integration with Hive AI/GPTZero planned.

## License

Private.
