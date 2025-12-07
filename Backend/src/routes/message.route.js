import express from "express";
import { getAllContacts, getMessagesByUserId, sendMessage, getChatPartners } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(protectRoute);

// middlwares execute in order so request get rate limited first then authenticated
// used for efficiency since autnehticated requests get blocked by rate limiting before hitting the auth middleware
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
// dynamic value :id represents user id - get messages between logged in user and specific user
router.get("/:id", getMessagesByUserId);
// send message to specific user - POST request
router.post("/send/:id", sendMessage);

export { router as default };