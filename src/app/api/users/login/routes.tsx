import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    return NextResponse.json(
        { message: "Login endpoint — use /api/extension/auth instead" },
        { status: 200 }
    );
}
