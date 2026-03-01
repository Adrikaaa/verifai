import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbconfig/dbconfig";
import Scan from "@/models/ScanModel";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const allowed = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/mpeg", "video/ogg"];
        if (!allowed.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|avi|mkv|mpeg)$/i)) {
            return NextResponse.json(
                { error: "Unsupported file type. Please upload a video file (MP4, WebM, MOV, AVI, MKV)." },
                { status: 400 }
            );
        }

        const maxBytes = 200 * 1024 * 1024;
        if (file.size > maxBytes) {
            return NextResponse.json({ error: "File too large. Maximum size is 200 MB." }, { status: 400 });
        }

        let scan: any = null;
        try {
            await connectToDatabase();
            scan = new Scan({ videoUrl: `(uploaded: ${file.name})`, platform: "upload", status: "pending" });
            await scan.save();
        } catch { /* DB unavailable - continue without persistence */ }

        const backendUrl = process.env.PIPELINE_URL?.replace(/\/$/, "");
        if (!backendUrl) {
            if (scan) { scan.status = "failed"; try { await scan.save(); } catch {} }
            return NextResponse.json({ error: "Backend not configured. Set PIPELINE_URL in .env.local" }, { status: 503 });
        }

        try {
            const flaskForm = new FormData();
            flaskForm.append("file", file);

            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8 * 60 * 1000);

            const flaskRes = await fetch(`${backendUrl}/api/extension/upload`, {
                method: "POST",
                body: flaskForm,
                signal: controller.signal,
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
                scanId: scan?._id,
                result: json.result,
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
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
