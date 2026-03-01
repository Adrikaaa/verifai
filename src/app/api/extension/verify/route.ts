import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbconfig/dbconfig";
import Scan from "@/models/ScanModel";
import { runPipeline, detectPlatform } from "@/lib/pipeline";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { videoUrl, platform } = body;

        if (!videoUrl) {
            return NextResponse.json({ error: "videoUrl is required" }, { status: 400 });
        }

        const detectedPlatform = platform || detectPlatform(videoUrl);

        let scan: any = null;
        try {
            await connectToDatabase();
            scan = new Scan({ videoUrl, platform: detectedPlatform, status: "pending" });
            await scan.save();
        } catch { /* DB unavailable - continue without persistence */ }

        try {
            const pipelineResult = await runPipeline(videoUrl, detectedPlatform);

            if (scan) { scan.result = pipelineResult; scan.status = "completed"; try { await scan.save(); } catch {} }

            return NextResponse.json({
                success: true,
                scanId: scan?._id,
                result: pipelineResult,
            });
        } catch (pipelineError: any) {
            if (scan) { scan.status = "failed"; try { await scan.save(); } catch {} }
            return NextResponse.json(
                { error: "Pipeline analysis failed: " + pipelineError.message },
                { status: 500 }
            );
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
    }
}
