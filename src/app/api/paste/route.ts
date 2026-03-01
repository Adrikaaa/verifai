import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbconfig/dbconfig";
import Scan from "@/models/ScanModel";
import { detectPlatform } from "@/lib/pipeline";

export const maxDuration = 300; // 5 minutes — pipeline can take 2-5 min

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { videoUrl } = body;

        if (!videoUrl?.trim()) {
            return NextResponse.json({ error: "videoUrl is required" }, { status: 400 });
        }
        if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://")) {
            return NextResponse.json({ error: "Please enter a valid URL starting with http:// or https://" }, { status: 400 });
        }

        const platform = detectPlatform(videoUrl);

        // ── Optionally save pending scan record ───────────────────────────────
        let scan: any = null;
        try {
            await connectToDatabase();
            scan = new Scan({ videoUrl: videoUrl.trim(), platform, status: "pending" });
            await scan.save();
        } catch { /* DB unavailable — continue without persistence */ }

        const backendUrl = process.env.PIPELINE_URL?.replace(/\/$/, "");
        if (!backendUrl) {
            if (scan) { scan.status = "failed"; try { await scan.save(); } catch {} }
            return NextResponse.json(
                { error: "Backend not configured. Set PIPELINE_URL in .env.local" },
                { status: 503 }
            );
        }

        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8 * 60 * 1000);

            const flaskRes = await fetch(`${backendUrl}/api/extension/verify`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ videoUrl: videoUrl.trim() }),
                signal:  controller.signal,
            });
            clearTimeout(timer);

            if (!flaskRes.ok) {
                const errText = await flaskRes.text().catch(() => flaskRes.statusText);
                throw new Error(`Backend error ${flaskRes.status}: ${errText}`);
            }

            const json = await flaskRes.json();
            if (!json.success || !json.result) {
                throw new Error(json.error || "Unexpected backend response");
            }

            if (scan) { scan.result = json.result; scan.status = "completed"; try { await scan.save(); } catch {} }

            return NextResponse.json({
                success: true,
                scanId:  scan?._id,
                result:  json.result,
                processingTimeSec: json.processingTimeSec,
            });
        } catch (pipelineError: any) {
            if (scan) { scan.status = "failed"; try { await scan.save(); } catch {} }
            const msg = pipelineError.name === "AbortError"
                ? "Analysis timed out after 8 minutes."
                : pipelineError.message;
            return NextResponse.json({ error: msg }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Analysis failed" },
            { status: 500 }
        );
    }
}
