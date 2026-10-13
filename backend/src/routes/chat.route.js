import express from "express";
import { attachChatPartnerToChatroom, attachUserToChatroom, createOrAttachChatroom, getCurrentChatroom, respondWithChatroomId } from "../middleware/chat.middleware.js";
import { attachUser, protectRoute } from "../middleware/auth.middleware.js";
import { processSentMessage } from "../middleware/chat.message.middleware.js";

const router = express.Router();

router.post("/chatroom", protectRoute, attachUser, createOrAttachChatroom,  attachUserToChatroom, attachChatPartnerToChatroom , respondWithChatroomId )

router.post("/message/send",protectRoute, getCurrentChatroom, processSentMessage)

export default router;
