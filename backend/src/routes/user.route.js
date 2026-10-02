import express from "express";
import { protectRoute, attachUser } from "../middleware/auth.middleware.js";
import {
    acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";
const router = express.Router();

router.use(protectRoute, attachUser);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
//reject request

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;
