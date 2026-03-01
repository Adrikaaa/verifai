# VerifAI — Content Authenticity Detection Platform

> **AI can fake anything. We help you see the truth.**

VerifAI is an end-to-end deepfake and AI-generated content detection platform that combines a Next.js web dashboard, a Chrome browser extension, and a GPU-accelerated Python ML backend to give users instant, explainable authenticity reports for video content.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup (Next.js)](#frontend-setup-nextjs)
  - [Backend Setup (Python / Kaggle)](#backend-setup-python--kaggle)
  - [Browser Extension](#browser-extension)
- [API Reference](#api-reference)
- [Detection Pipeline](#detection-pipeline)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Capability | Description |
|---|---|
| **Multi-Model Deepfake Detection** | SigLIP + SWIN Transformer ensemble for face-level and full-frame AI analysis |
| **Face Identity Recognition** | InsightFace ArcFace embeddings matched against a dynamically-built celebrity reference database via DuckDuckGo reverse image search |
| **Speech-to-Text + Claim Verification** | OpenAI Whisper transcribes audio; extracted claims are verified against historical news via DDGS |
| **Reverse Scene Search** | BLIP image captioning generates per-frame descriptions, reverse-searched against DDGS Images & News to detect re-used or manipulated footage |
| **Forensic Signal Analysis** | FFT spectral artifacts, ELA (Error Level Analysis) forgery detection, temporal consistency checks, and audio anomaly scoring |
| **BLIP Video Captioning** | Salesforce BLIP generates natural-language descriptions of video content |
| **Clip Identity Lookup** | DuckDuckGo reverse search identifies known clips, their original source, and related news |
| **Browser Extension** | Chrome Manifest V3 extension for one-click right-click scanning of any video on the web |
| **Feedback System** | Agree/disagree + text feedback on every scan result (website & extension) |
| **Real-time Dashboard** | Upload videos or paste URLs, view scan history, and explore detailed analysis breakdowns |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER INTERFACES                           │
│                                                                  │
│  ┌────────────────────┐    ┌──────────────────────────────────┐  │
│  │  Chrome Extension   │    │  Next.js Web App (Dashboard)     │  │
│  │  (Manifest V3)      │    │  • Upload Video                  │  │
│  │  • Right-click scan  │    │  • Paste URL                     │  │
│  │  • Popup results     │    │  • Scan History                  │  │
│  └────────┬───────────┘    └───────────────┬──────────────────┘  │
│            │                                │                     │
│            └──────────┬─────────────────────┘                     │
│                       ▼                                           │
│            ┌──────────────────────┐                               │
│            │  Next.js API Routes   │                               │
│            │  /api/upload          │                               │
│            │  /api/paste           │                               │
│            │  /api/scans           │                               │
│            │  /api/extension/*     │                               │
│            └──────────┬───────────┘                               │
│                       │ HTTP (ngrok tunnel)                        │
│                       ▼                                           │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              PYTHON ML BACKEND (Flask + Kaggle GPU)         │   │
│  │                                                             │   │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌───────────────┐   │   │
│  │  │ SigLIP  │ │  SWIN   │ │ ArcFace  │ │    Whisper    │   │   │
│  │  │(face AI)│ │(frame AI)│ │(identity)│ │   (speech)    │   │   │
│  │  └─────────┘ └─────────┘ └──────────┘ └───────────────┘   │   │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌───────────────┐   │   │
│  │  │  BLIP   │ │  FFT    │ │   ELA    │ │  DDGS Search  │   │   │
│  │  │(caption)│ │(forensic)│ │(forgery) │ │(reverse srch) │   │   │
│  │  └─────────┘ └─────────┘ └──────────┘ └───────────────┘   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                       │                                           │
│                       ▼                                           │
│            ┌──────────────────────┐                               │
│            │   MongoDB (Optional)  │                               │
│            │   Scan persistence    │                               │
│            └──────────────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | App Router, Server Components, API Routes |
| **React 19** | UI rendering |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **GSAP + React Three Fiber** | 3D particle background (Antigravity component) |
| **Radix UI** | Accessible component primitives |
| **Lucide React** | Icon system |

### Backend (Python)
| Technology | Purpose |
|---|---|
| **Flask** | REST API server |
| **pyngrok** | Tunnel local Flask server to public URL |
| **SigLIP** (`google/siglip-so400m-patch14-384`) | Face-crop deepfake detection |
| **SWIN Transformer** (`umm-maybe/AI-image-detector`) | Full-frame AI image detection |
| **InsightFace ArcFace** (`buffalo_l`) | 512-dim face embeddings for celebrity recognition |
| **OpenAI Whisper** | Speech-to-text transcription |
| **BLIP** (`Salesforce/blip-image-captioning-base`) | Video frame captioning + scene search |
| **OpenCV + FFmpeg** | Video frame extraction & processing |
| **DuckDuckGo Search (DDGS)** | Reverse image search, news search, claim verification |

### Data & Infrastructure
| Technology | Purpose |
|---|---|
| **MongoDB + Mongoose** | Optional scan persistence |
| **Kaggle Notebooks** | Free GPU runtime (T4/P100) for ML models |
| **ngrok** | HTTPS tunnel from Kaggle to Next.js frontend |

### Browser Extension
| Technology | Purpose |
|---|---|
| **Chrome Manifest V3** | Extension framework |
| **Service Worker** | Background script for context menu & notifications |
| **Chrome Storage API** | Scan count & result persistence |

---

## Project Structure

```
verifai/
├── deepfake_ngrok.ipynb          # Python ML backend (run on Kaggle)
├── verifai/                      # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing page (Hero, Features, Pricing, etc.)
│   │   │   ├── layout.tsx        # Root layout with fonts & metadata
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx      # Main dashboard — upload, paste, history
│   │   │   │   ├── upload/       # Dedicated upload page
│   │   │   │   └── paste/        # Dedicated paste-URL page
│   │   │   ├── api/
│   │   │   │   ├── upload/       # POST — file upload → Flask backend
│   │   │   │   ├── paste/        # POST — URL paste → Flask backend
│   │   │   │   ├── scans/        # GET — scan history, GET [id] — single scan
│   │   │   │   └── extension/    # Extension-specific verify & scans endpoints
│   │   │   ├── login/            # Login page
│   │   │   ├── signup/           # Signup page
│   │   │   └── profile/          # User profile page
│   │   ├── components/
│   │   │   ├── ScanResultPanel.tsx  # Full analysis results display
│   │   │   ├── Hero.tsx          # Landing hero section
│   │   │   ├── Features.tsx      # Feature cards
│   │   │   ├── HowItWorks.tsx    # 3-step process
│   │   │   ├── Pricing.tsx       # Pricing tiers
│   │   │   ├── Navbar.tsx        # Navigation bar
│   │   │   ├── Antigravity.tsx   # 3D particle background
│   │   │   └── ui/              # Radix-based UI primitives
│   │   ├── lib/
│   │   │   ├── pipeline.ts       # Flask backend client & types
│   │   │   ├── scanStore.ts      # Client-side scan state management
│   │   │   └── utils.ts          # Utility helpers
│   │   ├── models/
│   │   │   ├── ScanModel.ts      # Mongoose scan schema
│   │   │   └── UserModel.ts      # Mongoose user schema
│   │   └── dbconfig/
│   │       └── dbconfig.ts       # MongoDB connection singleton
│   ├── extension/
│   │   ├── manifest.json         # Chrome extension manifest (v3)
│   │   ├── popup.html            # Extension popup UI
│   │   ├── popup.css             # Extension popup styles
│   │   ├── popup.js              # Extension popup logic
│   │   ├── background.js         # Service worker (context menu, notifications)
│   │   └── icons/                # Extension icons (16, 48, 128px)
│   ├── public/                   # Static assets
│   ├── docs/
│   │   ├── prd.md                # Product Requirements Document
│   │   ├── tech_stack.md         # Technology stack reference
│   │   └── design.md             # Design reference
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── tailwind / postcss configs
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Python** 3.10+ (for backend, runs on Kaggle)
- **MongoDB** (optional — app works without it)
- **ngrok account** (free tier works) — [sign up](https://ngrok.com)
- **Kaggle account** (free GPU notebooks) — [sign up](https://kaggle.com)

### Frontend Setup (Next.js)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/verifai.git
cd verifai/verifai

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables section)

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.
Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the scan dashboard.

### Backend Setup (Python / Kaggle)

1. **Open `deepfake_ngrok.ipynb` on [Kaggle](https://kaggle.com)**
2. **Enable GPU** (Settings → Accelerator → GPU T4 x2)
3. **Set notebook secrets:**
   - `NGROK_AUTH_TOKEN` — your ngrok auth token
4. **Run Cell 1** — installs all Python dependencies:
   ```
   pip install pyngrok flask yt-dlp insightface onnxruntime-gpu
   pip install transformers pillow opencv-python ffmpeg-python
   pip install duckduckgo-search openai-whisper
   ```
5. **Run Cell 2** — loads all ML models and starts the Flask + ngrok server
6. **Copy the ngrok URL** from the output (e.g., `https://xxxx.ngrok-free.dev`)
7. **Update `.env.local`** in the frontend:
   ```
   PIPELINE_URL=https://xxxx.ngrok-free.dev
   ```

### Browser Extension

1. Open **Chrome** → `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked** → select the `verifai/extension/` folder
4. The VerifAI icon appears in your toolbar
5. Right-click any video → **"Scan with VerifAI"**

---

## API Reference

### `POST /api/upload`

Upload a video file for deepfake analysis.

| Parameter | Type | Description |
|---|---|---|
| `file` | `File` (multipart/form-data) | Video file (MP4, WebM, MOV, AVI, MKV). Max 200 MB. |

**Response:**
```json
{
  "success": true,
  "result": {
    "verdict": "AI",
    "confidence": "HIGH",
    "overallScore": 0.82,
    "reason": "Multiple deepfake signals detected...",
    "scores": {
      "face_deepfake": 0.91,
      "full_deepfake": 0.78,
      "ai_image": 0.65,
      "fft_artifacts": 0.72,
      "ela_forgery": 0.58,
      "temporal": 0.45,
      "audio_anomaly": 0.33
    },
    "caption": "A person speaking at a podium...",
    "personalities": [
      {
        "name": "Person Name",
        "confidence": 0.87,
        "frameIndex": 3,
        "news": [{ "title": "...", "url": "...", "source": "...", "date": "..." }]
      }
    ],
    "speechAnalysis": {
      "transcript": "Full transcription of audio...",
      "language": "en",
      "claims": [
        {
          "claim": "Extracted factual claim",
          "searchQuery": "search query used",
          "news": [{ "title": "...", "url": "...", "source": "...", "date": "..." }],
          "supported": true
        }
      ]
    },
    "sceneSearch": [
      {
        "frameIndex": 0,
        "caption": "A large crowd at a rally",
        "matchedImages": [{ "title": "...", "url": "...", "source": "...", "thumbnail": "..." }],
        "matchedNews": [{ "title": "...", "url": "...", "source": "...", "date": "..." }],
        "isKnownScene": true
      }
    ],
    "clipIdentity": { "..." : "..." },
    "framesAnalysed": 15,
    "durationSec": 30.5,
    "processingTimeSec": 45.2
  }
}
```

### `POST /api/paste`

Analyze a video from a URL (YouTube, Instagram, Twitter, etc.).

| Parameter | Type | Description |
|---|---|---|
| `videoUrl` | `string` (JSON body) | Public video URL |

**Response:** Same structure as `/api/upload`.

### `GET /api/scans`

Retrieve scan history (most recent first).

### `GET /api/scans/:id`

Retrieve a specific scan by ID.

### `POST /api/extension/verify`

Extension-specific endpoint for URL-based verification.

---

## Detection Pipeline

The Python backend runs a **7-stage analysis pipeline** on every video:

```
Video Input
    │
    ▼
┌─────────────────────────────────┐
│ 1. VIDEO INGESTION              │
│    • URL: yt-dlp download       │
│    • File: direct processing    │
│    • Extract frames (1 fps)     │
│    • Extract audio track        │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 2. FACE DETECTION & CROPPING    │
│    • InsightFace face detector  │
│    • Crop & align face regions  │
│    • Generate 512-dim ArcFace   │
│      embeddings per face        │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 3. DEEPFAKE SCORING             │
│    • SigLIP: face-crop AI score │
│    • SWIN: full-frame AI score  │
│    • FFT: spectral artifacts    │
│    • ELA: error level analysis  │
│    • Temporal: frame consistency │
│    • Audio: anomaly detection   │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 4. IDENTITY RECOGNITION         │
│    • Match face embeddings vs   │
│      DDGS-built celebrity DB    │
│    • 150+ public figures        │
│    • Threshold: 0.35 cosine sim │
│    • Fetch related news per     │
│      matched personality        │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 5. BLIP CAPTIONING & REVERSE    │
│    SCENE SEARCH                 │
│    • Generate natural-language  │
│      caption per key frame      │
│    • DDGS Image reverse search  │
│    • DDGS News reverse search   │
│    • Flag known/reused footage  │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 6. SPEECH-TO-TEXT & CLAIM       │
│    VERIFICATION                 │
│    • Whisper STT (auto lang)    │
│    • NLP claim extraction       │
│    • Each claim verified via    │
│      DDGS News historical data  │
│    • Supported / unsupported    │
│      classification             │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 7. VERDICT & REPORT GENERATION  │
│    • Weighted ensemble scoring  │
│    • Verdict: AI / SUSPICIOUS   │
│      / NOT AI                   │
│    • Confidence: HIGH / MED /   │
│      LOW                        │
│    • Structured JSON response   │
└─────────────────────────────────┘
```

---

## Environment Variables

Create a `.env.local` file in the `verifai/` directory:

```env
# Required — ngrok URL of the Python ML backend
PIPELINE_URL=https://your-ngrok-url.ngrok-free.dev

# Optional — MongoDB connection (app works without it)
MONGO_URI=mongodb://127.0.0.1:27017/verifai

# Optional — JWT secret (auth currently disabled)
TOKEN_SECRET=your-jwt-secret-here
```

---

## Deployment

### Frontend (Vercel)

```bash
cd verifai
npm run build
# Deploy via Vercel CLI or GitHub integration
vercel --prod
```

> **Note:** Set `PIPELINE_URL` in Vercel environment variables.
> The `maxDuration` for API routes is set to 300s (requires Vercel Pro for >60s).

### Backend (Kaggle)

The Python ML backend is designed to run on **Kaggle Notebooks** with free GPU:

1. Upload `deepfake_ngrok.ipynb` to Kaggle
2. Enable GPU accelerator
3. Add `NGROK_AUTH_TOKEN` to Kaggle Secrets
4. Run all cells — the Flask server auto-starts with an ngrok tunnel
5. For a **persistent URL**, set `NGROK_DOMAIN` in the notebook config to your ngrok static domain

### Extension (Chrome Web Store)

1. Zip the `extension/` folder
2. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Update `host_permissions` in `manifest.json` to match your production domain

---

## Result Interpretation

| Verdict | Overall Score | Meaning |
|---|---|---|
| **AI** | >= 0.60 | Strong signals of AI generation or manipulation detected |
| **SUSPICIOUS** | 0.35 – 0.59 | Some anomalies detected; manual review recommended |
| **NOT AI** | < 0.35 | No significant AI manipulation signals found |

### Signal Breakdown

| Signal | What It Detects |
|---|---|
| **Face Deepfake** | AI-generated or swapped face regions (SigLIP) |
| **Frame AI** | Full-frame AI generation artifacts (SWIN) |
| **AI Image** | Statistical patterns common in AI images |
| **FFT Artifacts** | Frequency-domain anomalies from GAN generation |
| **ELA Forgery** | Inconsistent compression levels suggesting edits |
| **Temporal** | Frame-to-frame inconsistencies in video |
| **Audio** | Audio track anomalies or TTS artifacts |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: add my feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is for educational and research purposes. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>VerifAI</strong> — Bringing trust back to digital content.
</p>
