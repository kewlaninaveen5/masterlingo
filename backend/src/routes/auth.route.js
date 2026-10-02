import express from "express";
import {signup, login, logout, onboard, createJWTToken, createAndAttachSessionId, sendUser} from '../controllers/auth/auth.middleware.js'
import { protectRoute, attachUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup, createJWTToken, createAndAttachSessionId, sendUser)
router.post("/login", login, createJWTToken, createAndAttachSessionId, sendUser)
router.post("/logout", logout)
router.post("/onboarding", protectRoute, attachUser,  onboard)

//forget-password
//send-reset-password-email

//check the authentication
router.all("/health", protectRoute, (req,res,next)=>{ //use this to check if logged in instead of "/me"
if (!req.jwt)
  return res.status(400).json("session time out")
})
router.get("/me", protectRoute, attachUser, (req, res, next) =>{
  // console.log("protection checked: ", req.user)
  res.status(200).json({ success: true, user: req.user })
}
);

// {
// "fullName" : "test user",
// "email" : "test@gmail.com",
// "password" : "123456"
// }






export default router;