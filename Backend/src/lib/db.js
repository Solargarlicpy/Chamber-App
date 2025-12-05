import mongoose from "mongoose"
import { ENV } from "./lib/env.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log("MONGODB CONNECTED:", conn.connection.host)
    }   catch (error) {
        console.log("MONGODB CONNECTION ERROR:", error)
        process.exit(1); // 1 status code for failure 0 for success

    }
}