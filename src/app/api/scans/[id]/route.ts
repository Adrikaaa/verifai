import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbconfig/dbconfig";
import Scan from "@/models/ScanModel";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    await connectToDatabase();
    const { id } = await params;

    try {
        const scan = await Scan.findById(id).lean();
        if (!scan) return NextResponse.json({ error: "Scan not found" }, { status: 404 });
        return NextResponse.json(scan);
    } catch {
        return NextResponse.json({ error: "Invalid scan ID" }, { status: 400 });
    }
}
