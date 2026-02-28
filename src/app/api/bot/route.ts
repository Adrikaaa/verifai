import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    return NextResponse.json(
        { message: "Bot endpoint — coming soon" },
        { status: 200 }
    );
}
