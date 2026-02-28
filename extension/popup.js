// VerifAI Extension — Popup Logic
// ═══════════════════════════════════════════════════

const API_BASE = "http://localhost:3000/api/extension";

// ── DOM Elements ─────────────────────────────────
const authSection = document.getElementById("authSection");
const mainSection = document.getElementById("mainSection");
const logoutBtn = document.getElementById("logoutBtn");
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authError = document.getElementById("authError");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const tabs = document.querySelectorAll(".tab");

const scansRemainingEl = document.getElementById("scansRemaining");
const scanUsageText = document.getElementById("scanUsageText");
const ringProgress = document.getElementById("ringProgress");
const urlInput = document.getElementById("urlInput");
const scanBtn = document.getElementById("scanBtn");
const scanLoading = document.getElementById("scanLoading");
const resultSection = document.getElementById("resultSection");
const historyList = document.getElementById("historyList");
const upgradeCta = document.getElementById("upgradeCta");

// Result elements
const resultEmoji = document.getElementById("resultEmoji");
const resultVerdict = document.getElementById("resultVerdict");
const resultScore = document.getElementById("resultScore");

let currentAction = "login";

// ── Initialize ───────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    const data = await chrome.storage.local.get(["verifai_token", "verifai_user"]);

    if (data.verifai_token) {
        showMainSection(data.verifai_user);
        loadHistory();
        loadLatestResult();
    } else {
        showAuthSection();
    }
});

// ── Tab switching ────────────────────────────────
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        currentAction = tab.dataset.tab;
        authSubmitBtn.textContent = currentAction === "login" ? "Login" : "Register";
        authError.textContent = "";
    });
});

// ── Auth form submit ─────────────────────────────
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    authError.textContent = "";
    authSubmitBtn.disabled = true;
    authSubmitBtn.textContent = "Please wait...";

    try {
        const res = await fetch(`${API_BASE}/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value,
                action: currentAction,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            authError.textContent = data.error || "Authentication failed";
            authSubmitBtn.disabled = false;
            authSubmitBtn.textContent = currentAction === "login" ? "Login" : "Register";
            return;
        }

        // Save token & user
        await chrome.storage.local.set({
            verifai_token: data.token,
            verifai_user: data.user,
        });

        showMainSection(data.user);
        loadHistory();
    } catch (err) {
        authError.textContent = "Could not connect to server. Is it running?";
    }

    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = currentAction === "login" ? "Login" : "Register";
});

// ── Google Login ─────────────────────────────────
googleLoginBtn.addEventListener("click", async () => {
    authError.textContent = "";
    googleLoginBtn.disabled = true;
    googleLoginBtn.textContent = "Connecting...";

    try {
        // Initiate Google OAuth flow
        const authUrl = `${API_BASE}/auth/google`;
        
        // Open popup for Google authentication
        const popup = window.open(
            authUrl,
            'google-auth',
            'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Listen for authentication success
        const messageListener = async (event) => {
            if (event.origin !== "http://localhost:3000") return;
            
            if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
                popup.close();
                window.removeEventListener('message', messageListener);
                
                // Save token & user
                await chrome.storage.local.set({
                    verifai_token: event.data.token,
                    verifai_user: event.data.user,
                });

                showMainSection(event.data.user);
                loadHistory();
            } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
                popup.close();
                window.removeEventListener('message', messageListener);
                authError.textContent = event.data.error || "Google authentication failed";
            }
        };

        window.addEventListener('message', messageListener);

        // Check if popup was blocked
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            authError.textContent = "Popup blocked. Please allow popups for this extension.";
        }

    } catch (err) {
        authError.textContent = "Could not connect to Google authentication.";
    }

    googleLoginBtn.disabled = false;
    googleLoginBtn.textContent = "Continue with Google";
});

// ── Logout ───────────────────────────────────────
logoutBtn.addEventListener("click", async () => {
    await chrome.storage.local.remove([
        "verifai_token",
        "verifai_user",
        "verifai_lastResult",
        "verifai_lastScanTime",
    ]);
    showAuthSection();
});

// ── Scan button ──────────────────────────────────
scanBtn.addEventListener("click", async () => {
    const url = urlInput.value.trim();
    if (!url) return;

    const data = await chrome.storage.local.get(["verifai_token"]);
    if (!data.verifai_token) {
        showAuthSection();
        return;
    }

    // Show loading
    scanBtn.disabled = true;
    scanLoading.style.display = "block";
    resultSection.style.display = "none";

    // Animate pipeline steps
    animatePipelineSteps();

    try {
        const res = await fetch(`${API_BASE}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                videoUrl: url,
                userToken: data.verifai_token,
            }),
        });

        const result = await res.json();

        scanLoading.style.display = "none";
        scanBtn.disabled = false;

        if (!res.ok) {
            if (res.status === 403) {
                upgradeCta.style.display = "block";
            }
            alert(result.error || result.message || "Scan failed");
            return;
        }

        // Store result
        await chrome.storage.local.set({
            verifai_lastResult: result,
            verifai_lastScanTime: Date.now(),
            verifai_user: {
                ...((await chrome.storage.local.get("verifai_user")).verifai_user || {}),
                scanCount: result.scansUsed,
            },
        });

        // Update UI
        displayResult(result);
        updateScanCounter(result.scansUsed, result.scansUsed + result.scansRemaining);
        loadHistory();
        urlInput.value = "";

        // Show upgrade if needed
        if (result.scansRemaining <= 0) {
            upgradeCta.style.display = "block";
        }
    } catch (err) {
        scanLoading.style.display = "none";
        scanBtn.disabled = false;
        alert("Could not connect to server");
    }
});

// ── Display Functions ────────────────────────────
function showAuthSection() {
    authSection.style.display = "block";
    mainSection.style.display = "none";
    logoutBtn.style.display = "none";
}

function showMainSection(user) {
    authSection.style.display = "none";
    mainSection.style.display = "block";
    logoutBtn.style.display = "block";

    if (user) {
        updateScanCounter(user.scanCount || 0, user.maxFreeScans || 5);

        if (user.scanCount >= (user.maxFreeScans || 5)) {
            upgradeCta.style.display = "block";
        }
    }
}

function updateScanCounter(used, max) {
    const remaining = Math.max(0, max - used);
    scansRemainingEl.textContent = remaining;
    scanUsageText.textContent = `${used} / ${max} used`;

    // Update ring — circumference = 2πr = 2 × π × 42 ≈ 264
    const circumference = 264;
    const progress = remaining / max;
    const offset = circumference * (1 - progress);
    ringProgress.style.strokeDashoffset = offset;

    // Color the ring based on remaining
    if (remaining <= 1) {
        ringProgress.style.stroke = "var(--accent-red)";
    } else if (remaining <= 2) {
        ringProgress.style.stroke = "var(--accent-amber)";
    } else {
        ringProgress.style.stroke = "var(--text-primary)";
    }
}

function displayResult(data) {
    const r = data.result;
    resultSection.style.display = "block";

    // Verdict
    resultVerdict.textContent = r.verdict;
    resultVerdict.className = "result-verdict " + r.verdict.toLowerCase();
    resultScore.textContent = `Suspicion: ${(r.overallScore * 100).toFixed(1)}%`;

    if (r.verdict === "AUTHENTIC") {
        resultEmoji.textContent = "✅";
    } else if (r.verdict === "MANIPULATED") {
        resultEmoji.textContent = "🚨";
    } else {
        resultEmoji.textContent = "⚠️";
    }

    // Stage bars
    setStageBar("metadata", r.stages.metadata.score);
    setStageBar("semantic", r.stages.semantic.score);
    setStageBar("visual", r.stages.visual.score);
    setStageBar("audio", r.stages.audio.score);
    setStageBar("fft", r.stages.fft.score);
}

function setStageBar(name, score) {
    const bar = document.getElementById(`${name}Bar`);
    const val = document.getElementById(`${name}Score`);
    if (bar) bar.style.width = `${(score * 100).toFixed(0)}%`;
    if (val) val.textContent = `${(score * 100).toFixed(0)}%`;
}

function animatePipelineSteps() {
    const steps = document.querySelectorAll(".pipeline-steps .step");
    steps.forEach((s) => {
        s.classList.remove("active", "done");
    });

    let i = 0;
    const interval = setInterval(() => {
        if (i > 0) steps[i - 1].classList.replace("active", "done");
        if (i < steps.length) {
            steps[i].classList.add("active");
            i++;
        } else {
            clearInterval(interval);
        }
    }, 500);
}

// ── Load History ─────────────────────────────────
async function loadHistory() {
    const data = await chrome.storage.local.get(["verifai_token"]);
    if (!data.verifai_token) return;

    try {
        const res = await fetch(`${API_BASE}/scans`, {
            headers: { Authorization: `Bearer ${data.verifai_token}` },
        });

        if (!res.ok) return;

        const result = await res.json();

        if (result.scans && result.scans.length > 0) {
            historyList.innerHTML = result.scans
                .slice(0, 8)
                .map((scan) => {
                    const v = scan.result?.verdict || "PENDING";
                    const emoji =
                        v === "AUTHENTIC" ? "✅" : v === "MANIPULATED" ? "🚨" : "⚠️";
                    const cls = v.toLowerCase();
                    const date = new Date(scan.createdAt).toLocaleString();
                    const shortUrl =
                        scan.videoUrl.length > 40
                            ? scan.videoUrl.substring(0, 40) + "..."
                            : scan.videoUrl;

                    return `
            <div class="history-item">
              <span class="history-emoji">${emoji}</span>
              <div class="history-info">
                <p class="history-url">${shortUrl}</p>
                <p class="history-meta">${scan.platform} · ${date}</p>
              </div>
              <span class="history-verdict ${cls}">${v}</span>
            </div>
          `;
                })
                .join("");
        } else {
            historyList.innerHTML = '<p class="empty-state">No scans yet. Start scanning!</p>';
        }

        // Update counter from server data
        if (result.scanCount !== undefined) {
            updateScanCounter(result.scanCount, result.maxFreeScans);
        }
    } catch (err) {
        // Silently fail — server might be down
    }
}

// ── Load latest result from storage ──────────────
async function loadLatestResult() {
    const data = await chrome.storage.local.get(["verifai_lastResult"]);
    if (data.verifai_lastResult) {
        displayResult(data.verifai_lastResult);
    }
}
