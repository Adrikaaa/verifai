import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbconfig/dbconfig";
import Scan from "@/models/ScanModel";

/** GET /api/scans  — returns all scan history (newest first) */
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
    } catch {
        return NextResponse.json({ success: true, scans: [] });
    }
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const scans = await Scan.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return NextResponse.json({ success: true, scans });
}
