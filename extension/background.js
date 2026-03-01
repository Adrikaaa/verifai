// VerifAI Extension — Background Service Worker (No Auth)
// ═══════════════════════════════════════════════════════

let API_BASE = "";

// ── Load saved server URL on startup ─────────────────────────────────
async function loadApiBase() {
    const data = await chrome.storage.local.get(["verifai_api_base"]);
    if (data.verifai_api_base) {
        API_BASE = data.verifai_api_base;
    }
    return API_BASE;
}
loadApiBase();

// ── Listen for API_BASE updates from popup ───────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "UPDATE_API_BASE" && msg.apiBase) {
        API_BASE = msg.apiBase;
        sendResponse({ ok: true });
    }
    return true;
});

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
    // Reload API_BASE in case it was updated
    await loadApiBase();

    let urlToScan = "";

    if (info.menuItemId === "verifai-scan-link" && info.linkUrl) {
        urlToScan = info.linkUrl;
    } else if (info.menuItemId === "verifai-scan-page" && tab?.url) {
        urlToScan = tab.url;
    }

    if (!urlToScan) return;

    // Check if server is configured
    if (!API_BASE) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "VerifAI",
            message: "Please connect to a server first! Click the VerifAI extension icon to set up.",
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
            body: JSON.stringify({ videoUrl: urlToScan }),
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
            message: `Suspicion: ${(result.result.overallScore * 100).toFixed(1)}%`,
        });

        // Store latest result for popup access
        await chrome.storage.local.set({
            verifai_lastResult: result,
            verifai_lastScanTime: Date.now(),
        });

        // Save to local history
        const histData = await chrome.storage.local.get(["verifai_history"]);
        const history = histData.verifai_history || [];
        history.unshift({
            videoUrl: urlToScan,
            result: result.result,
            timestamp: Date.now(),
        });
        if (history.length > 20) history.length = 20;
        await chrome.storage.local.set({ verifai_history: history });

    } catch (err) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "VerifAI — Connection Error",
            message: "Could not reach the server. Check your connection in the VerifAI extension.",
        });
    }
});
