// VerifAI Extension — Background Service Worker
// ═══════════════════════════════════════════════

const API_BASE = "http://localhost:3000/api/extension";

// ── Create context menu on install ───────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "verifai-scan-link",
        title: "🛡️ Scan with VerifAI",
        contexts: ["link"],
    });

    chrome.contextMenus.create({
        id: "verifai-scan-page",
        title: "🛡️ Scan this page with VerifAI",
        contexts: ["page"],
    });
});

// ── Handle context menu click ────────────────────────────────────────
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    let urlToScan = "";

    if (info.menuItemId === "verifai-scan-link" && info.linkUrl) {
        urlToScan = info.linkUrl;
    } else if (info.menuItemId === "verifai-scan-page" && tab?.url) {
        urlToScan = tab.url;
    }

    if (!urlToScan) return;

    // Get auth token
    const data = await chrome.storage.local.get(["verifai_token"]);
    const token = data.verifai_token;

    if (!token) {
        // Show notification to login
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "VerifAI",
            message: "Please login first! Click the VerifAI extension icon to sign in.",
        });
        return;
    }

    // Show scanning notification
    chrome.notifications.create("scan-progress", {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "VerifAI — Scanning...",
        message: `Analyzing: ${urlToScan.substring(0, 80)}...`,
    });

    try {
        const response = await fetch(`${API_BASE}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                videoUrl: urlToScan,
                userToken: token,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon128.png",
                title: "VerifAI — Error",
                message: result.error || result.message || "Scan failed",
            });
            return;
        }

        // Determine emoji for verdict
        const verdictEmoji =
            result.result.verdict === "AUTHENTIC" ? "✅" :
                result.result.verdict === "MANIPULATED" ? "🚨" : "⚠️";

        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: `VerifAI — ${verdictEmoji} ${result.result.verdict}`,
            message: `Confidence: ${(result.result.overallScore * 100).toFixed(1)}% suspicious\nScans remaining: ${result.scansRemaining}`,
        });

        // Store latest result for popup access
        await chrome.storage.local.set({
            verifai_lastResult: result,
            verifai_lastScanTime: Date.now(),
        });

    } catch (err) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "VerifAI — Connection Error",
            message: "Could not reach the VerifAI server. Make sure it's running on localhost:3000",
        });
    }
});
