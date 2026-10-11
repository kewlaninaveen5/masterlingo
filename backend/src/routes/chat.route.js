import express from "express";
import { attachChatPartnerToChatroom, attachUserToChatroom, createOrAttachChatroom } from "../middleware/chat.middleware.js";
import { attachUser, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/chatroom", protectRoute, attachUser, createOrAttachChatroom,  attachUserToChatroom, attachChatPartnerToChatroom )


export default router;
