import express from "express";
import {signup, login, logout, onboard} from '../controllers/auth/auth.controller.js'
import { protectRoute } from "../middleware/auth.middleware.js";
import authHelper from "../services/authHelper.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/onboarding", protectRoute, onboard)

//forget-password
//send-reset-password-email

//check the authentication
router.get("/me", protectRoute, (req, res, next) =>{
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