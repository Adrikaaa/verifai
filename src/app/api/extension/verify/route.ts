import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbconfig/dbconfig";
import User from "@/models/UserModel";
import Scan from "@/models/ScanModel";
import jwt from "jsonwebtoken";
import { runPipeline, detectPlatform } from "@/lib/pipeline";

connectToDatabase();

// ── Helper: extract user from JWT ────────────────────────────────────
async function getUserFromToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as {
            id: string;
            email: string;
        };
        return await User.findById(decoded.id);
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { videoUrl, platform, userToken } = body;

        if (!videoUrl || !userToken) {
            return NextResponse.json(
                { error: "videoUrl and userToken are required" },
                { status: 400 }
            );
        }

        // ── 1. Validate user ─────────────────────────────────────────────
        const user = await getUserFromToken(userToken);
        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token. Please login again." },
                { status: 401 }
            );
        }

        // ── 2. Check free scan limit ─────────────────────────────────────
        if (user.scanCount >= user.maxFreeScans) {
            return NextResponse.json(
                {
                    error: "Free scan limit reached",
                    scanCount: user.scanCount,
                    maxFreeScans: user.maxFreeScans,
                    message: `You have used all ${user.maxFreeScans} free scans. Upgrade to continue scanning.`,
                },
                { status: 403 }
            );
        }

        // ── 3. Detect platform if not provided ───────────────────────────
        const detectedPlatform = platform || detectPlatform(videoUrl);

        // ── 4. Create pending scan record ────────────────────────────────
        const scan = new Scan({
            userId: user._id,
            videoUrl,
            platform: detectedPlatform,
            status: "pending",
        });
        await scan.save();

        // ── 5. Run the pipeline ──────────────────────────────────────────
        try {
            const pipelineResult = await runPipeline(videoUrl, detectedPlatform);

            // Update scan with results
            scan.result = pipelineResult;
            scan.status = "completed";
            await scan.save();

            // ── 6. Increment scan count ──────────────────────────────────
            user.scanCount += 1;
            await user.save();

            return NextResponse.json({
                success: true,
                scanId: scan._id,
                result: pipelineResult,
                scansUsed: user.scanCount,
                scansRemaining: user.maxFreeScans - user.scanCount,
            });
        } catch (pipelineError: any) {
            scan.status = "failed";
            await scan.save();

            return NextResponse.json(
                { error: "Pipeline analysis failed: " + pipelineError.message },
                { status: 500 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Verification failed" },
            { status: 500 }
        );
    }
}
