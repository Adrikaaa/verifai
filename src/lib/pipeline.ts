/**
 * VerifAI Pipeline Simulation
 * ----------------------------
 * Mirrors the Kaggle notebook's 6-stage content authenticity pipeline.
 * Each stage produces a score (0-1) where higher = more suspicious.
 *
 * When you deploy the real Kaggle notebook as an API,
 * replace the body of `runPipeline()` with a fetch call to that API.
 */

export interface PipelineResult {
    verdict: "AUTHENTIC" | "MANIPULATED" | "INCONCLUSIVE";
    overallScore: number;
    stages: {
        metadata: { score: number; findings: string[] };
        semantic: { score: number; description: string };
        visual: { score: number; label: string };
        audio: { score: number; label: string };
        fft: { score: number; label: string };
    };
}

// ── Stage 1: Metadata Forensics ──────────────────────────────────────
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
