from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerificationRequest(BaseModel):
    content: str
    type: str # 'text', 'image_url', 'video_url'

@app.get("/")
def read_root():
    return {"message": "Welcome to Veri.Ai API"}

@app.post("/verify")
def verify_content(request: VerificationRequest):
    # Placeholder for AI verification logic
    # In a real app, this would call verify_image, verify_text, etc.
    return {
        "score": 85,
        "risk": "Low",
        "explanation": "No deepfake artifacts detected. Content appears authentic."
    }
