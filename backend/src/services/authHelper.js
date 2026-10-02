import bcrypt from "bcryptjs"
import { prisma } from "../lib/prismaClient.js"

class authHelper {
    
    static async matchPassword(enteredPassword, hashedPassword) {
        console.log(enteredPassword, hashedPassword)
        if (!enteredPassword || !hashedPassword) 
            return  false
        try {
            const isPasswordCorrect = await bcrypt.compare(enteredPassword, hashedPassword)
            return isPasswordCorrect

        } catch (error) {
            console.log("Falied while comparing password at services.Auth.matchPassword : ", error )
            return  false

        }
    } 

    static async encrypt(pass) {
        if (!pass || !process.env.JWT_SECRET_KEY) {
            throw new Error("Cannot encrypt password, the password is empty or SECTRE_KEY is not present")
        }

        try {
                const salt = await bcrypt.genSalt(10);

                const password = await bcrypt.hash(pass, salt)
                return password
            } catch (err) {
                console.log("ERR: ", err)
            }
    }

    static async isEmailAlreadyUsed (email) {
      try {

        const isExisting = await prisma.user.findUnique({
          where: {
            email : email
          }
        })
        if (isExisting)
          return true
        return false
      } catch (err){
        console.log("unable to check: isEmailAlreadyUsed: ", err)
      }
    }

    static async createUser (email, fullName, passwordHash, profilePicIdx, profilePic) {
      try {
        return await prisma.user.create({
              data: {
                email,
                fullName,
                password : passwordHash,
                profilePicIdx,
                profilePic,
              }
            })
        // return user

      } catch (err) {
        console.log("unable to create user", err)
      }
    }

    static async getUser (id) {
      try {
        return await prisma.user.findUnique({
          where: {
              id,
          },
          omit : {
              password: true
          } 
      })
      } catch (err) {
        console.log("user not found", err)
      }
    }

}

export default authHelper