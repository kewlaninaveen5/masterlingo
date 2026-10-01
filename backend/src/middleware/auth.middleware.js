import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prismaClient.js';


export const protectRoute = async (req,res,next) => {
    // console.log("[backend/src/middleware/auth] req.cookies: ", req.cookies)
    try {
        // console.log("entered try")
        const token = req.cookies.jwt;
        if (!token) {
            console.log("no token")
            return res.status(401).json({message: "Unauthorized - No user token provided"})
        }
        // console.log("token found")
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            console.log("token is not matching")
            return res.status(401).json({message: "Unauthorized - Invalid token"})
        }
        console.log("decoded: ", decoded)
        // console.log("token decoded, awaiting user")
        const user = await prisma.user.findUnique({
            where: {
                id : decoded.userId
            },
            omit : {
                password: true
            } 
        })

        console.log(user)
        // console.log("token decoded, awaiting user")
        if (!user) {
            console.log("User not found")
            return res.status(401).json({message: "Unauthorized - User not found"})
        }
        // console.log("user found")

        req.user = user;
        next()

    } catch (error) {

        console.log("Error in protectRoute middleware", error)
        res.status(500).json({message: "Internal Server Error"})
        
    }

}