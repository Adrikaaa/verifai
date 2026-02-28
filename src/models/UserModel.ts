import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    scanCount: {
        type: Number,
        default: 0,
    },
    maxFreeScans: {
        type: Number,
        default: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
