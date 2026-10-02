import express from "express";
import { protectRoute, attachUser } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, attachUser, getStreamToken)

export default router;
