import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    videoUrl: {
        type: String,
        required: [true, "Please provide a video URL"],
    },
    platform: {
        type: String,
        enum: ["youtube", "instagram", "tiktok", "twitter", "unknown"],
        default: "unknown",
    },
    result: {
        verdict: {
            type: String,
            enum: ["AUTHENTIC", "MANIPULATED", "INCONCLUSIVE"],
            default: "INCONCLUSIVE",
        },
        overallScore: { type: Number, default: 0 },
        stages: {
            metadata: {
                score: { type: Number, default: 0 },
                findings: [String],
            },
            semantic: {
                score: { type: Number, default: 0 },
                description: String,
            },
            visual: {
                score: { type: Number, default: 0 },
                label: String,
            },
            audio: {
                score: { type: Number, default: 0 },
                label: String,
            },
            fft: {
                score: { type: Number, default: 0 },
                label: String,
            },
        },
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Scan = mongoose.models.scans || mongoose.model("scans", scanSchema);

export default Scan;
