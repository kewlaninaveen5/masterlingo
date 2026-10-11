// const hashedPassword = await bcrypt.hash(password, 10);

import { prisma } from "../lib/prismaClient.js"

export class userHelper {
    constructor () {

    }

    static async getUserFromId (userId) {
      try {
        return await prisma.user.findFirst({
          where : {
            id : userId
          }, 
            select : {
            id : true,
            fullName : true,
            email : true,
            bio : true, 
            profilePic : true,
            profilePicIdx : true,
            nativeLanguage : true,
            learningLanguage : true, 
            location : true
          }
        })
      } catch (err) {
        console.log( "eeror in finding other user", err )
      }
    }
}
