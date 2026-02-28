import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbconfig/dbconfig";
import User from "@/models/UserModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectToDatabase();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, action } = body;

        if (!email || !password || !action) {
            return NextResponse.json(
                { error: "Email, password, and action (login/register) are required" },
                { status: 400 }
            );
        }

        // ─── REGISTER ────────────────────────────────────────────────────
        if (action === "register") {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return NextResponse.json(
                    { error: "User already exists. Please login." },
                    { status: 400 }
                );
            }

            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);

            const newUser = new User({
                email,
                password: hashedPassword,
                scanCount: 0,
                maxFreeScans: 5,
            });

            const savedUser = await newUser.save();

            const token = jwt.sign(
                { id: savedUser._id, email: savedUser.email },
                process.env.TOKEN_SECRET!,
                { expiresIn: "7d" }
            );

            return NextResponse.json({
                success: true,
                message: "Registration successful",
                token,
                user: {
                    email: savedUser.email,
                    scanCount: savedUser.scanCount,
                    maxFreeScans: savedUser.maxFreeScans,
                },
            });
        }

        // ─── LOGIN ───────────────────────────────────────────────────────
        if (action === "login") {
            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json(
                    { error: "User does not exist. Please register first." },
                    { status: 404 }
                );
            }

            const validPassword = await bcryptjs.compare(password, user.password);
            if (!validPassword) {
                return NextResponse.json(
                    { error: "Invalid password" },
                    { status: 401 }
                );
            }

            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.TOKEN_SECRET!,
                { expiresIn: "7d" }
            );

            return NextResponse.json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    email: user.email,
                    scanCount: user.scanCount,
                    maxFreeScans: user.maxFreeScans,
                },
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Auth failed" },
            { status: 500 }
        );
    }
}
