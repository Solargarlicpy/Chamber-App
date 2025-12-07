import aj from "./arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";


export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req)

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ 
                    message: "Too Many Requests. Please try again later" });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ 
                    message: "Access denied" });
            } else {
                return res.status(403).json({ 
                    message: "Access denied by security policy" 
                });  
            }
        }

    // check for spoofed bots
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({ 
                error: "Spoofed bots detected",
                message: "Malicious activity detected. Access denied."
            });
        }

        // If all checks pass, proceed to the next route handler
        next();
        } catch (error) {
        console.error("Arcjet protection error:", error);
        next();
    }
};