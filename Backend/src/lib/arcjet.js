import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ENV } from "./env.js";

const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: ENV.ARCJET_KEY || "test-key", // Fallback for development
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "DRY_RUN" }), // Use DRY_RUN for development
    // Create a bot detection rule
    detectBot({
      mode: "DRY_RUN", // Use DRY_RUN for development, blocks requests in LIVE
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    slidingWindow({
      mode: "DRY_RUN", // Use DRY_RUN for development
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      max: 5, // Refill 5 tokens per interval
      interval: 60, // Refill every 60 seconds
    }),
  ],
});

// Export the configured Arcjet instance and rules for use in other modules
export default aj;
export { shield, detectBot, slidingWindow };
