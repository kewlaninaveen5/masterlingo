import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prismaClient.js';
import redis from '../lib/redis.js';
import { r400 } from '../utils/responseUtils/responses.js';
import authHelper from '../services/authHelper.js';


export const protectRoute = async (req,res,next) => {
    try {

        const sessionId = req.cookies.sessionId
        console.log("sessionId: ", sessionId)
        const sessionJWT = await redis.get(`user:session:${sessionId}:jwt`)

        if (!sessionJWT) {
            console.log("unable to login becasue sessionId not in redis ")
            return r400(res, "session logged out, please login again")
        }

        req.jwt = sessionJWT
        next()
    } catch (error) {

        console.log("Error in protectRoute middleware", error)
        res.status(500).json({message: "Internal Server Error"})
        
    }
}

    export const attachUser = async (req,res,next) => {


        try {
        const token = req.jwt;
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
        const user = await authHelper.getUser(decoded.userId)
        
        // await prisma.user.findUnique({
        //     where: {
        //         id : decoded.userId
        //     },
        //     omit : {
        //         password: true
        //     } 
        // })

        if (!user) {
            console.log("User not found")
            return res.status(401).json({message: "Unauthorized - User not found"})
        }

        req.user = user;
        next()

    } catch (error) {

        console.log("Error in protectRoute middleware", error)
        res.status(500).json({message: "Internal Server Error"})
        
    }

}