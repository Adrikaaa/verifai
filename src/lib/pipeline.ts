/**
 * VerifAI Pipeline — real Flask backend
 * --------------------------------------
 * Calls the Kaggle-hosted Flask API (exposed via ngrok static domain).
 * Set PIPELINE_URL in .env.local to your ngrok domain.
 */

// ── Full result shape returned by the Flask API ──────────────────────
export interface PipelineResult {
    verdict:      "AI" | "SUSPICIOUS" | "NOT AI";
    confidence:   "HIGH" | "MEDIUM" | "LOW";
    overallScore: number;
    reason:       string;
    scores: {
        face_deepfake:  number;
        full_deepfake:  number;
        ai_image:       number;
        fft_artifacts:  number;
        ela_forgery:    number;
        temporal:       number;
        audio_anomaly:  number;
    };
    caption:        string;
    factCheck:      { title: string; url: string; source: string; date: string }[];
    clipIdentity: {
        title:       string;
        uploader:    string;
        platform:    string;
        uploadDate:  string;
        viewCount:   number | null;
        likeCount:   number | null;
        description: string;
        tags:        string[];
        isKnownClip: boolean;
        clipNews:    { title: string; url: string; source: string; date: string }[];
        originalUrl: string;
    };
    personalities: {
        name:       string;
        confidence: number;
        frameIndex: number;
        news:       { title: string; url: string; source: string; date: string }[];
    }[];
    audioLabel:     string;
    framesAnalysed: number;
    durationSec:    number;
    sourceUrl:      string;
    models:         Record<string, string>;
}

// ── Detect platform from URL ─────────────────────────────────────────
export function detectPlatform(url: string): string {
    const u = url.toLowerCase();
    if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
    if (u.includes("instagram.com")) return "instagram";
    if (u.includes("tiktok.com")) return "tiktok";
    if (u.includes("twitter.com") || u.includes("x.com")) return "twitter";
    return "unknown";
}

// ══════════════════════════════════════════════════════════════════════
// MAIN PIPELINE — calls the Kaggle Flask backend via ngrok static domain
// ══════════════════════════════════════════════════════════════════════
export async function runPipeline(videoUrl: string, _platform: string): Promise<PipelineResult> {
    const backendUrl = process.env.PIPELINE_URL?.replace(/\/$/, "");
    if (!backendUrl) {
        throw new Error(
            "PIPELINE_URL is not set. Add it to .env.local:\n" +
            "  PIPELINE_URL=https://your-static-domain.ngrok-free.app"
        );
    }

    const controller = new AbortController();
    // Kaggle can take 3-5 min on first request (model load); allow up to 8 min
    const timer = setTimeout(() => controller.abort(), 8 * 60 * 1000);

    try {
        const response = await fetch(`${backendUrl}/api/extension/verify`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ videoUrl }),
            signal:  controller.signal,
        });

        if (!response.ok) {
            const err = await response.text().catch(() => response.statusText);
            throw new Error(`Backend returned ${response.status}: ${err}`);
        }

        const json = await response.json();

        if (!json.success || !json.result) {
            throw new Error(json.error || "Unexpected response from backend");
        }

        return json.result as PipelineResult;
    } catch (err: any) {
        if (err.name === "AbortError") {
            throw new Error("Pipeline timed out after 8 minutes. Is the Kaggle notebook running?");
        }
        throw err;
    } finally {
        clearTimeout(timer);
    }
}

// ── DEAD CODE BELOW \u2014 kept here only as reference, no longer called \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function analyzeMetadata(url: string, platform: string) {
    const findings: string[] = [];
    let score = 0;

    // Check for suspicious URL patterns
    if (url.includes("shorts") || url.includes("reel")) {
        findings.push("Short-form content detected (common deepfake vector)");
        score += 0.1;
    }

    // Platform-based risk assessment
    if (platform === "tiktok") {
        findings.push("TikTok: High deepfake prevalence platform");
        score += 0.15;
    } else if (platform === "instagram") {
        findings.push("Instagram: Moderate deepfake risk");
        score += 0.1;
    }

    // Simulate codec / duration anomalies from the notebook
    const hasDurationAnomaly = Math.random() > 0.7;
    if (hasDurationAnomaly) {
        findings.push("Unusual content duration detected");
        score += 0.2;
    }

    const hasFpsAnomaly = Math.random() > 0.8;
    if (hasFpsAnomaly) {
        findings.push("Non-standard FPS detected (possible AI generation)");
        score += 0.2;
    }

    return { score: Math.min(score, 1), findings };
}

// ── Stage 2: Semantic Plausibility ───────────────────────────────────
function analyzeSemantic(url: string) {
    // Simulates CLIP action classification + scene captioning + fact-checking
    const score = Number((Math.random() * 0.6 + 0.1).toFixed(3));
    const descriptions = [
        "Scene content appears plausible with known context",
        "Potential out-of-context media usage detected",
        "Face ID patterns consistent with known individuals",
        "Action classification does not match expected scenario",
        "Scene captioning reveals inconsistencies with claimed narrative",
    ];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    return { score, description };
}

// ── Stage 3: Visual CNN Analysis ─────────────────────────────────────
function analyzeVisual() {
    // Simulates pixel-level face manipulation artifact detection
    const score = Number((Math.random() * 0.7 + 0.1).toFixed(3));
    const labels = [
        "No manipulation artifacts detected",
        "Minor compression artifacts (likely authentic)",
        "Face-swap artifacts detected in facial region",
        "GAN-generated facial features identified",
        "Subtle blending inconsistencies near face boundary",
    ];
    const label = labels[Math.floor(Math.random() * labels.length)];
    return { score, label };
}

// ── Stage 4: Audio Analysis ──────────────────────────────────────────
function analyzeAudio() {
    // Simulates synthetic voice characteristics detection
    const score = Number((Math.random() * 0.5 + 0.05).toFixed(3));
    const labels = [
        "Audio exhibits natural speech patterns",
        "Potential voice cloning markers detected",
        "Audio spectrogram shows synthetic artifacts",
        "Natural prosody and intonation confirmed",
    ];
    const label = labels[Math.floor(Math.random() * labels.length)];
    return { score, label };
}

// ── Stage 5: FFT Frequency Analysis ──────────────────────────────────
function analyzeFFT() {
    // Simulates GAN upsampling artifact detection in frequency domain
    const score = Number((Math.random() * 0.6 + 0.05).toFixed(3));
    const labels = [
        "No GAN frequency artifacts detected",
        "Suspicious periodic patterns in frequency domain",
        "Upsampling artifacts consistent with GAN generation",
        "Frequency distribution within normal parameters",
    ];
    const label = labels[Math.floor(Math.random() * labels.length)];
    return { score, label };
}

// ── Final Verdict ────────────────────────────────────────────────────
function computeVerdict(overallScore: number): "AUTHENTIC" | "MANIPULATED" | "INCONCLUSIVE" {
    if (overallScore >= 0.6) return "MANIPULATED";
    if (overallScore <= 0.3) return "AUTHENTIC";
    return "INCONCLUSIVE";
}

// ── Detect platform from URL ─────────────────────────────────────────
export function detectPlatform(url: string): string {
    const u = url.toLowerCase();
    if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
    if (u.includes("instagram.com")) return "instagram";
    if (u.includes("tiktok.com")) return "tiktok";
    if (u.includes("twitter.com") || u.includes("x.com")) return "twitter";
    return "unknown";
}

// ══════════════════════════════════════════════════════════════════════
// MAIN PIPELINE — replace this function body with a real API call
// to your deployed Kaggle notebook when ready.
// ══════════════════════════════════════════════════════════════════════
export async function runPipeline(videoUrl: string, platform: string): Promise<PipelineResult> {
    // Simulate a small delay (as if processing)
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 2000));

    const metadata = analyzeMetadata(videoUrl, platform);
    const semantic = analyzeSemantic(videoUrl);
    const visual = analyzeVisual();
    const audio = analyzeAudio();
    const fft = analyzeFFT();

    // Weighted average matching the Kaggle notebook's approach
    const overallScore = Number(
        (
            metadata.score * 0.15 +
            semantic.score * 0.25 +
            visual.score * 0.30 +
            audio.score * 0.15 +
            fft.score * 0.15
        ).toFixed(3)
    );

    const verdict = computeVerdict(overallScore);

    return {
        verdict,
        overallScore,
        stages: { metadata, semantic, visual, audio, fft },
    };
}
