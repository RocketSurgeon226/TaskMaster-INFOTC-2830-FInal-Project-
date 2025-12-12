import User from "../models/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const signup = async(req, res) => {
    try {
        console.log("1. Signup started, body:", req.body);
        const { username, password } = req.body;

        console.log("2. Checking for existing user...");
        const existingUser = await User.findOne({ username });
        console.log("3. Existing user check complete:", existingUser);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        console.log("4. Creating new user...");
        const user = await User.create({ username, password });
        console.log("5. User created:", user._id);

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
        console.log("6. Token generated");

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                points: user.points,
            },
        });
    } catch (error) {
        console.error("=== SIGNUP ERROR ===");
        console.error("Error message:", error.message);
        console.error("Full error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async(req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                points: user.points,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCurrentUser = async(req, res) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                points: user.points,
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};