import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbconfig/dbconfig";
import User from "@/models/UserModel";
import Scan from "@/models/ScanModel";
import jwt from "jsonwebtoken";

connectToDatabase();

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json(
                { error: "Authorization token required" },
                { status: 401 }
            );
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as {
                id: string;
                email: string;
            };
        } catch {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Get user
        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get scans for this user, sorted by most recent
        const scans = await Scan.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({
            success: true,
            scans,
            scanCount: user.scanCount,
            maxFreeScans: user.maxFreeScans,
            scansRemaining: user.maxFreeScans - user.scanCount,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch scans" },
            { status: 500 }
        );
    }
}
