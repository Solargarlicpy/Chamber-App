import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import mongoose from "mongoose";
import { ENV } from "./lib/env.js";

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

// Middleware configuration for parsing JSON and URL encoded data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes); 

// Make ready for deployment
if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
    });
}

// MongoDB connection function
const connectDB = async () => {
    try {
        console.log(" Debug - MONGO_URI:", process.env.MONGO_URI);
        console.log(" Debug - PORT:", process.env.PORT);
        console.log(" Debug - NODE_ENV:", process.env.NODE_ENV);
        console.log(" Debug - JWT_SECRET:", process.env.JWT_SECRET ? "***SET***" : "NOT SET");
        
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(` MONGODB CONNECTED: ${conn.connection.host}`);
    } catch (error) {
        console.log(" MONGODB CONNECTION ERROR:", error.message);
        process.exit(1);
    }
};

app.listen(PORT, "0.0.0.0", () => {
    console.log(` Server running on port: ${PORT}`);
    connectDB();
});