// Taskmaster's "engine"
// Starts Express
// Creates server
// Connects to MongoDB
// Connects to database
// Loads routes
// Loads task and reward routes
// Handles JSON (JavaScript Object Notation)
// Converts data from server to web app to make it human-readable and machine-parsable
// Sets CORS (Cross Origin Resource Sharing)
// Allow requests from other domains
// Listens for port requests
// Starts, stops, and restarts server


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
// Dotenv loads environment variables from ".env" into "process.env" object --> accessible within app code
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config({ path: path.resolve("./.env") });

const app = express();

// Middlewares --> middle layer between web brower and app that processes requests and responses in app lifecycle
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// console.log("MONGO_URI value:", process.env.MONGO_URI);
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/rewards", rewardRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(
    PORT,
    console.log(`Server running on port ${PORT}`)
);