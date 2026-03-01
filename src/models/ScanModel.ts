import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
    {
        // URL scans → the video URL; file uploads → "(uploaded: filename.mp4)"
        videoUrl: {
            type: String,
            default: "",
        },
        platform: {
            type: String,
            enum: ["youtube", "instagram", "tiktok", "twitter", "unknown", "upload"],
            default: "unknown",
        },
        // Full pipeline result — stored as a flexible mixed object so we can
        // store the rich output (scores, personalities, factCheck, clipIdentity…)
        // without fighting Mongoose's strict schema mode.
        result: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }   // adds createdAt + updatedAt automatically
);

delete (mongoose.models as any).scans;
const Scan = mongoose.model("scans", scanSchema);

export default Scan;
