import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message:"Unauthorized, no token provided"});

        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if(!decoded) return res.status(401).json({message:"Unauthorized, invalid token"})
        
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message:"Unauthorized, user not found" });

        // custom field to store user data in req object
        req.user = user
        next() 
    // catch error for 
    } catch (error) {
        console.log ("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }        
}