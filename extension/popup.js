// VerifAI Extension — Popup Logic
// ═══════════════════════════════════════════════════

let API_BASE = "";

// The URL of the deployed VerifAI web app (change for production)
const WEBAPP_URL = "http://localhost:3000";

// ── DOM Elements ─────────────────────────────────
const serverSection = document.getElementById("serverSection");
const mainSection = document.getElementById("mainSection");
const connectionDot = document.getElementById("connectionDot");

// Auth bar
const authBar = document.getElementById("authBar");
const authStatus = document.getElementById("authStatus");
const authAction = document.getElementById("authAction");

const serverUrlInput = document.getElementById("serverUrlInput");
const connectBtn = document.getElementById("connectBtn");
const serverStatus = document.getElementById("serverStatus");

const connectedUrl = document.getElementById("connectedUrl");
const disconnectBtn = document.getElementById("disconnectBtn");

const urlInput = document.getElementById("urlInput");
const scanBtn = document.getElementById("scanBtn");
const scanLoading = document.getElementById("scanLoading");
const resultSection = document.getElementById("resultSection");
const historyList = document.getElementById("historyList");

const scanError = document.getElementById("scanError");
const scanErrorText = document.getElementById("scanErrorText");
const dismissError = document.getElementById("dismissError");

const resultEmoji = document.getElementById("resultEmoji");
const resultVerdict = document.getElementById("resultVerdict");
const resultScore = document.getElementById("resultScore");
const resultReason = document.getElementById("resultReason");
const factCheckSection = document.getElementById("factCheckSection");
const factCheckList = document.getElementById("factCheckList");
const personalitiesSection = document.getElementById("personalitiesSection");
const personalitiesList   = document.getElementById("personalitiesList");
const clipIdentitySection = document.getElementById("clipIdentitySection");
const clipKnownBadge = document.getElementById("clipKnownBadge");
const clipPlatform = document.getElementById("clipPlatform");
const clipTitleEl = document.getElementById("clipTitle");
const clipUploader = document.getElementById("clipUploader");
const clipDate = document.getElementById("clipDate");
const clipViews = document.getElementById("clipViews");
const clipNewsList = document.getElementById("clipNewsList");


// ═══════════════════════════════════════════════════
// AUTH0 — Check login state via VerifAI web app
// ═══════════════════════════════════════════════════

async function initAuth() {
  try {
    const res = await fetch(`${WEBAPP_URL}/api/me`, { credentials: "include" });
    if (!res.ok) throw new Error("no session");
    const data = await res.json();
    if (data.user) {
      const name = data.user.name || data.user.email || "Signed in";
      authStatus.textContent = `👤 ${name}`;
      authStatus.className = "auth-status-text logged-in";
      authAction.textContent = "Sign Out";
      authAction.href = `${WEBAPP_URL}/auth/logout`;
      authAction.className = "auth-action-link logout-link";
    } else {
      throw new Error("no user");
    }
  } catch {
    authStatus.textContent = "Not signed in";
    authStatus.className = "auth-status-text";
    authAction.textContent = "Sign In";
    authAction.href = `${WEBAPP_URL}/auth/login`;
    authAction.className = "auth-action-link";
  }
}

// ═══════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", async () => {
    // Check Auth0 login status
    initAuth();

    const data = await chrome.storage.local.get(["verifai_server_url", "verifai_api_base"]);

    if (data.verifai_server_url && data.verifai_api_base) {
        API_BASE = data.verifai_api_base;
        serverUrlInput.value = data.verifai_server_url;

        // Verify the saved server is still reachable
        const ok = await testServer(data.verifai_server_url, true);
        if (ok) {
            showMainSection(data.verifai_server_url);
            loadLocalHistory();
            loadLatestResult();
        } else {
            showServerSection();
            setStatus("⚠️ Saved server is unreachable. Reconnect or enter a new URL.", "warn");
        }
    } else {
        showServerSection();
    }
});


// ═══════════════════════════════════════════════════
// SERVER CONNECTION
// ═══════════════════════════════════════════════════

connectBtn.addEventListener("click", async () => {
    let url = (serverUrlInput.value || "").trim();

    if (!url) {
        setStatus("❌ Please enter a server URL", "error");
        return;
    }

    // Normalize — strip box-drawing chars, trailing slashes, whitespace
    url = url.replace(/[\u2500-\u257F\u2580-\u259F\u2550-\u256C]/g, "").trim();
    url = url.replace(/\/+$/, "");
    if (url.includes("/api/extension")) {
        url = url.replace("/api/extension", "");
    }
    if (url.includes("/health")) {
        url = url.replace("/health", "");
    }

    connectBtn.disabled = true;
    connectBtn.textContent = "Connecting...";
    setStatus("🔄 Testing connection...", "info");

    const ok = await testServer(url, false);

    if (ok) {
        const apiUrl = url + "/api/extension";
        API_BASE = apiUrl;

        await chrome.storage.local.set({
            verifai_server_url: url,
            verifai_api_base: apiUrl,
        });

        // Notify background script
        try {
            chrome.runtime.sendMessage({ type: "UPDATE_API_BASE", apiBase: apiUrl });
        } catch (_) {}

        setStatus("✅ Connected!", "success");
        setTimeout(() => showMainSection(url), 400);
    }

    connectBtn.disabled = false;
    connectBtn.textContent = "Connect";
});

disconnectBtn.addEventListener("click", () => {
    showServerSection();
});

async function testServer(url, silent) {
    try {
        const healthUrl = url + "/health";
        const res = await fetch(healthUrl, {
            method: "GET",
            signal: AbortSignal.timeout(10000),
        });

        if (res.ok) {
            const data = await res.json();
            if (data.status === "ok") {
                return true;
            }
        }

        if (!silent) setStatus("❌ Server responded but health check failed", "error");
        return false;

    } catch (err) {
        if (!silent) {
            if (err.name === "TimeoutError") {
                setStatus("❌ Connection timed out. Is the server running?", "error");
            } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
                setStatus("❌ Cannot reach server. Check the URL and ensure the notebook is running.", "error");
            } else {
                setStatus(`❌ Connection failed: ${err.message}`, "error");
            }
        }
        return false;
    }
}

function setStatus(msg, level) {
    serverStatus.textContent = msg;
    const colors = {
        error: "var(--accent-red, #ef4444)",
        warn: "var(--accent-amber, #fbbf24)",
        success: "var(--accent-green, #3EF2C5)",
        info: "var(--text-secondary, #8b8fa3)",
    };
    serverStatus.style.color = colors[level] || colors.info;
}


// ═══════════════════════════════════════════════════
// SCAN
// ═══════════════════════════════════════════════════

scanBtn.addEventListener("click", async () => {
    const url = urlInput.value.trim();

    if (!url) {
        showScanError("Please paste a video or reel URL to scan.");
        return;
    }

    // Basic URL validation
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        showScanError("Please enter a valid URL starting with http:// or https://");
        return;
    }

    if (!API_BASE) {
        showScanError("Not connected to a server. Click 'Change' to reconnect.");
        return;
    }

    hideScanError();

    // Show loading
    scanBtn.disabled = true;
    scanLoading.style.display = "block";
    resultSection.style.display = "none";
    animatePipelineSteps();

    try {
        const res = await fetch(`${API_BASE}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoUrl: url }),
        });

        const result = await res.json();

        scanLoading.style.display = "none";
        scanBtn.disabled = false;

        if (!res.ok) {
            const errMsg = result.error || result.message || `Server error (${res.status})`;
            showScanError(errMsg);
            return;
        }

        // Store result locally
        await chrome.storage.local.set({
            verifai_lastResult: result,
            verifai_lastScanTime: Date.now(),
        });

        // Save to local history
        await saveToHistory(url, result);

        // Update UI
        displayResult(result);
        loadLocalHistory();
        urlInput.value = "";

    } catch (err) {
        scanLoading.style.display = "none";
        scanBtn.disabled = false;

        if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
            showScanError("Lost connection to server. The Kaggle notebook may have stopped. Click 'Change' to reconnect.");
        } else {
            showScanError(`Scan failed: ${err.message}`);
        }
    }
});


// ═══════════════════════════════════════════════════
// ERROR HANDLING UI
// ═══════════════════════════════════════════════════

function showScanError(msg) {
    scanError.style.display = "flex";
    scanErrorText.textContent = msg;
}

function hideScanError() {
    scanError.style.display = "none";
    scanErrorText.textContent = "";
}

dismissError.addEventListener("click", hideScanError);


// ═══════════════════════════════════════════════════
// DISPLAY FUNCTIONS
// ═══════════════════════════════════════════════════

function showServerSection() {
    serverSection.style.display = "block";
    mainSection.style.display = "none";
    connectionDot.className = "connection-dot disconnected";
    connectionDot.title = "Not connected";
}

function showMainSection(url) {
    serverSection.style.display = "none";
    mainSection.style.display = "block";
    connectionDot.className = "connection-dot connected";
    connectionDot.title = "Connected";

    // Show truncated URL
    try {
        const host = new URL(url).host;
        connectedUrl.textContent = host;
    } catch {
        connectedUrl.textContent = url.substring(0, 30);
    }
}

function displayResult(data) {
    const r = data.result;
    if (!r) return;
    resultSection.style.display = "block";

    resultVerdict.textContent = r.verdict || "UNKNOWN";
    const verdictClass = (r.verdict || "unknown").toLowerCase().replace(/\s+/g, "-");
    resultVerdict.className = "result-verdict " + verdictClass;
    resultScore.textContent = `AI Score: ${((r.overallScore || 0) * 100).toFixed(1)}%`;

    // Reason
    if (resultReason) {
        resultReason.textContent = r.reason || "";
    }

    if (r.verdict === "NOT AI") {
        resultEmoji.textContent = "✅";
    } else if (r.verdict === "AI") {
        resultEmoji.textContent = "🤖";
    } else if (r.verdict === "SUSPICIOUS") {
        resultEmoji.textContent = "⚠️";
    } else {
        resultEmoji.textContent = "⚠️";
    }

    // Stage bars (forensic signals)
    setStageBar("face",    r.scores?.face_deepfake  || 0);
    setStageBar("aiImage", r.scores?.ai_image        || 0);
    setStageBar("fft",     r.scores?.fft_artifacts   || 0);
    setStageBar("ela",     r.scores?.ela_forgery      || 0);
    setStageBar("audio",   r.scores?.audio_anomaly   || 0);

    // Personalities
    const people = r.personalities || [];
    if (personalitiesSection && personalitiesList) {
        if (people.length > 0) {
            personalitiesSection.style.display = "block";
            personalitiesList.innerHTML = people.map(p => `
                <div class="personality-item">
                    <div class="personality-header">
                        <span class="personality-name">${escapeHtml(p.name)}</span>
                        <span class="personality-conf">${(p.confidence * 100).toFixed(1)}% match</span>
                    </div>
                    <div class="personality-news">${(p.news || []).map(n => `
                        <a class="fact-item" href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer">
                            <p class="fact-item-title">${escapeHtml(n.title)}</p>
                            <p class="fact-item-meta">${escapeHtml(n.source)}${n.date ? " &middot; " + escapeHtml(n.date) : ""}</p>
                        </a>`).join("")}
                    </div>
                </div>`).join("");
        } else {
            personalitiesSection.style.display = "none";
            personalitiesList.innerHTML = "";
        }
    }

    // Fact-check
    const facts = r.factCheck || [];
    if (factCheckSection && factCheckList) {
        if (facts.length > 0) {
            factCheckSection.style.display = "block";
            factCheckList.innerHTML = facts.map(f => `
                <a class="fact-item" href="${escapeHtml(f.url)}" target="_blank" rel="noopener noreferrer">
                    <p class="fact-item-title">${escapeHtml(f.title)}</p>
                    <p class="fact-item-meta">${escapeHtml(f.source)}${f.date ? " &middot; " + escapeHtml(f.date) : ""}</p>
                </a>`).join("");
        } else {
            factCheckSection.style.display = "none";
            factCheckList.innerHTML = "";
        }
    }

    // Show feedback section & reset its state
    const feedbackSection  = document.getElementById("feedbackSection");
    const feedbackForm     = document.getElementById("feedbackForm");
    const feedbackSentEl   = document.getElementById("feedbackSent");
    const feedbackTextWrap = document.getElementById("feedbackTextWrap");
    const feedbackTextarea = document.getElementById("feedbackTextarea");
    const feedbackAgreeBtn = document.getElementById("feedbackAgree");
    const feedbackDisagreeBtn = document.getElementById("feedbackDisagree");
    if (feedbackSection) {
        feedbackSection.style.display = "block";
        if (feedbackForm)     feedbackForm.style.display    = "block";
        if (feedbackSentEl)   feedbackSentEl.style.display  = "none";
        if (feedbackTextWrap) feedbackTextWrap.style.display = "none";
        if (feedbackTextarea) feedbackTextarea.value = "";
        if (feedbackAgreeBtn)    feedbackAgreeBtn.className    = "feedback-btn";
        if (feedbackDisagreeBtn) feedbackDisagreeBtn.className = "feedback-btn";
    }

    // Speech Analysis
    const speechSection   = document.getElementById("speechSection");
    const speechTranscript = document.getElementById("speechTranscript");
    const speechClaims    = document.getElementById("speechClaims");
    const sa = r.speechAnalysis;
    if (speechSection && sa && sa.transcript) {
        speechSection.style.display = "block";

        if (speechTranscript) {
            const lang = sa.language ? ` (${escapeHtml(sa.language)})` : "";
            const text = sa.transcript.length > 400
                ? sa.transcript.slice(0, 400) + "…"
                : sa.transcript;
            speechTranscript.innerHTML = `
                <p class="transcript-label">Transcript${lang}</p>
                <p class="transcript-text">"${escapeHtml(text)}"</p>`;
        }

        if (speechClaims && sa.claims && sa.claims.length > 0) {
            const supported = sa.claims.filter(c => c.supported).length;
            speechClaims.innerHTML =
                `<p style="font-size:11px;color:#8b8fa3;margin:0 0 6px;">` +
                `${sa.claims.length} claim${sa.claims.length !== 1 ? "s" : ""} extracted · ${supported} corroborated</p>` +
                sa.claims.map(c => `
                    <div class="claim-item">
                        <div class="claim-header">
                            <p class="claim-text">"${escapeHtml(c.claim)}"</p>
                            <span class="claim-badge ${c.supported ? "claim-badge-found" : "claim-badge-none"}">
                                ${c.supported ? "✓ Found" : "✗ No match"}
                            </span>
                        </div>
                        ${(c.news || []).map(n => `
                            <a class="fact-item" href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer">
                                <p class="fact-item-title">${escapeHtml(n.title)}</p>
                                <p class="fact-item-meta">${escapeHtml(n.source)}${n.date ? " · " + escapeHtml(n.date) : ""}</p>
                            </a>`).join("")}
                    </div>`).join("");
        } else if (speechClaims) {
            speechClaims.innerHTML = "";
        }
    } else if (speechSection) {
        speechSection.style.display = "none";
    }

    // Scene Search
    const sceneSection = document.getElementById("sceneSection");
    const sceneList    = document.getElementById("sceneList");
    const scenes = r.sceneSearch || [];
    if (sceneSection && scenes.length > 0) {
        sceneSection.style.display = "block";
        if (sceneList) {
            sceneList.innerHTML = scenes.map(s => `
                <div class="scene-item">
                    <div class="scene-header">
                        <p class="scene-caption">Frame ${s.frameIndex}: "${escapeHtml(s.caption)}"</p>
                        <span class="clip-badge ${s.isKnownScene ? "clip-badge-known" : "clip-badge-unknown"}">
                            ${s.isKnownScene ? "🟢 Known" : "⚪ New"}
                        </span>
                    </div>
                    ${(s.matchedNews || []).slice(0, 3).map(n => `
                        <a class="fact-item" href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer">
                            <p class="fact-item-title">${escapeHtml(n.title)}</p>
                            <p class="fact-item-meta">${escapeHtml(n.source)}${n.date ? " · " + escapeHtml(n.date) : ""}</p>
                        </a>`).join("")}
                    ${(s.matchedImages || []).length > 0 ? `
                        <div class="scene-image-links">
                            ${s.matchedImages.slice(0, 4).map(img => `
                                <a class="scene-image-link" href="${escapeHtml(img.url)}" target="_blank"
                                   rel="noopener noreferrer" title="${escapeHtml(img.title)}">
                                    ${escapeHtml(img.source || "image")} ↗
                                </a>`).join("")}
                        </div>` : ""}
                </div>`).join("");
        }
    } else if (sceneSection) {
        sceneSection.style.display = "none";
    }

    // Clip Identity
    const ci = r.clipIdentity;
    if (clipIdentitySection && ci) {
        const hasContent = ci.title || ci.clipNews?.length > 0;
        if (hasContent) {
            clipIdentitySection.style.display = "block";

            // Known / Unknown badge
            if (clipKnownBadge) {
                clipKnownBadge.textContent = ci.isKnownClip ? "\ud83d\udfe2 Known Clip" : "\u26aa Unknown Clip";
                clipKnownBadge.className = "clip-badge " + (ci.isKnownClip ? "clip-badge-known" : "clip-badge-unknown");
            }

            if (clipPlatform) clipPlatform.textContent = ci.platform || "";
            if (clipTitleEl)  clipTitleEl.textContent  = ci.title    || "(title unavailable)";
            if (clipUploader) clipUploader.textContent = ci.uploader ? `\ud83d\udc64 ${ci.uploader}` : "";
            if (clipDate)     clipDate.textContent     = ci.uploadDate ? `\ud83d\udcc5 ${ci.uploadDate}` : "";
            if (clipViews)    clipViews.textContent    = ci.viewCount != null
                ? `\ud83d\udc41\ufe0f ${Number(ci.viewCount).toLocaleString()} views` : "";

            // Clip-specific news
            if (clipNewsList) {
                if (ci.clipNews && ci.clipNews.length > 0) {
                    clipNewsList.innerHTML = ci.clipNews.map(n => `
                        <a class="fact-item" href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer">
                            <p class="fact-item-title">${escapeHtml(n.title)}</p>
                            <p class="fact-item-meta">${escapeHtml(n.source)}${n.date ? " &middot; " + escapeHtml(n.date) : ""}</p>
                        </a>`).join("");
                } else {
                    clipNewsList.innerHTML = `<p class="clip-no-news">No news coverage found for this clip.</p>`;
                }
            }
        } else {
            clipIdentitySection.style.display = "none";
        }
    }
}

function setStageBar(name, score) {
    const bar = document.getElementById(`${name}Bar`);
    const val = document.getElementById(`${name}Score`);
    if (bar) bar.style.width = `${(score * 100).toFixed(0)}%`;
    if (val) val.textContent = `${(score * 100).toFixed(0)}%`;
}

function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function animatePipelineSteps() {
    const steps = document.querySelectorAll(".pipeline-steps .step");
    steps.forEach((s) => s.classList.remove("active", "done"));

    let i = 0;
    const interval = setInterval(() => {
        if (i > 0 && steps[i - 1]) steps[i - 1].classList.replace("active", "done");
        if (i < steps.length) {
            steps[i].classList.add("active");
            i++;
        } else {
            clearInterval(interval);
        }
    }, 500);
}


// ═══════════════════════════════════════════════════
// LOCAL HISTORY (stored in chrome.storage)
// ═══════════════════════════════════════════════════

async function saveToHistory(videoUrl, result) {
    const data = await chrome.storage.local.get(["verifai_history"]);
    const history = data.verifai_history || [];

    history.unshift({
        videoUrl,
        result: result.result,
        timestamp: Date.now(),
    });

    // Keep last 20
    if (history.length > 20) history.length = 20;

    await chrome.storage.local.set({ verifai_history: history });
}

async function loadLocalHistory() {
    const data = await chrome.storage.local.get(["verifai_history"]);
    const history = data.verifai_history || [];

    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No scans yet. Start scanning!</p>';
        return;
    }

    historyList.innerHTML = history
        .slice(0, 8)
        .map((scan) => {
            const v = scan.result?.verdict || "PENDING";
            const emoji = v === "NOT AI" ? "✅" : v === "AI" ? "🤖" : "⚠️";
            const cls = v.toLowerCase().replace(/\s+/g, "-");
            const date = new Date(scan.timestamp).toLocaleString();
            const shortUrl = scan.videoUrl.length > 40
                ? scan.videoUrl.substring(0, 40) + "..."
                : scan.videoUrl;

            return `
        <div class="history-item">
          <span class="history-emoji">${emoji}</span>
          <div class="history-info">
            <p class="history-url">${shortUrl}</p>
            <p class="history-meta">${date}</p>
          </div>
          <span class="history-verdict ${cls}">${v}</span>
        </div>`;
        })
        .join("");
}

async function loadLatestResult() {
    const data = await chrome.storage.local.get(["verifai_lastResult"]);
    if (data.verifai_lastResult) {
        displayResult(data.verifai_lastResult);
    }
}


// ═══════════════════════════════════════════════════
// FEEDBACK
// ═══════════════════════════════════════════════════

(function initFeedback() {
    const feedbackSection   = document.getElementById("feedbackSection");
    const feedbackForm      = document.getElementById("feedbackForm");
    const feedbackSentEl    = document.getElementById("feedbackSent");
    const feedbackAgree     = document.getElementById("feedbackAgree");
    const feedbackDisagree  = document.getElementById("feedbackDisagree");
    const feedbackTextWrap  = document.getElementById("feedbackTextWrap");
    const feedbackTextarea  = document.getElementById("feedbackTextarea");
    const feedbackSubmit    = document.getElementById("feedbackSubmit");

    if (!feedbackAgree || !feedbackDisagree) return;

    let feedbackType = null;

    feedbackAgree.addEventListener("click", () => {
        feedbackType = "agree";
        feedbackAgree.className    = "feedback-btn selected-agree";
        feedbackDisagree.className = "feedback-btn";
        feedbackTextWrap.style.display = "flex";
    });

    feedbackDisagree.addEventListener("click", () => {
        feedbackType = "disagree";
        feedbackDisagree.className = "feedback-btn selected-disagree";
        feedbackAgree.className    = "feedback-btn";
        feedbackTextWrap.style.display = "flex";
    });

    feedbackSubmit.addEventListener("click", () => {
        const text = feedbackTextarea.value.trim();
        console.log("[VerifAI Feedback]", { type: feedbackType, text });

        // Show thank-you state
        feedbackForm.style.display    = "none";
        feedbackSentEl.style.display  = "flex";
    });
})();
