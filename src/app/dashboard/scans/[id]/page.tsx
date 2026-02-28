"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScanResultPage() {
  const { id } = useParams();
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScan = async () => {
      const res = await fetch(`/api/scans/${id}`);
      const data = await res.json();

      if (res.ok) {
        setScan(data);
      }

      setLoading(false);
    };

    fetchScan();
  }, [id]);

  if (loading) return <p className="text-white p-10">Loading...</p>;
  if (!scan) return <p className="text-white p-10">Scan not found</p>;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-xl p-10 rounded-2xl border border-white/10 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Scan Result</h1>

        <div className="text-4xl mb-4">
          {scan.label === "AI Generated" ? "🤖" : "🧑"}
        </div>

        <p className="text-xl font-medium">{scan.label}</p>

        <p className="text-gray-400 mt-2">
          Confidence: {(scan.confidence * 100).toFixed(1)}%
        </p>

        <p className="text-xs text-gray-500 mt-6">
          {new Date(scan.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
