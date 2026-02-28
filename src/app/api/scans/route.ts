import { NextRequest, NextResponse } from "next/server";
import { saveScan } from "@/lib/scanStore";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const scanId = crypto.randomUUID();

    // Fake AI result (replace later with real model)
    const result = {
      label: Math.random() > 0.5 ? "AI Generated" : "Human Written",
      confidence: Number((Math.random() * 0.4 + 0.6).toFixed(2)),
    };

    saveScan({
      id: scanId,
      label: result.label,
      confidence: result.confidence,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      scanId,
    });
  } catch (error) {
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
