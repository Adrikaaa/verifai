import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbconfig/dbconfig";
import Scan from "@/models/ScanModel";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
    } catch {
        return NextResponse.json({ success: true, scans: [] });
    }
    try {
        const scans = await Scan.find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({
            success: true,
            scans,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch scans" },
            { status: 500 }
        );
    }
}
