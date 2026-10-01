import bcrypt from "bcryptjs"

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

    signup = async (req, res, next) => { ///this is wrong. this is a whole middleware. I need to seperate controllers out of this. A service can have controllers not middlewares. 
      const { email, password, fullName } = req.body;
      console.log("reached signup: ",email, password, fullName )
    
      try {
        if (!email || !password || !fullName)
          return res.status(400).json({ message: "All Fields are required" });
    
        if (password.length < 6)
          return res
            .status(400)
            .json({ message: "Password must be more than 6 characters" });
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        encryptedPassword = authHelper.encrypt(password)
        console.log("encryptedPassword: ", encryptedPassword)
    
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        console.log("email and password passed validation, checking existing user")
    
        const existingUser = await prisma.user.findUnique({
          where: {
            email : email
          }
        })
        
        if (existingUser)
          return res.status(400).json({
            message: "Email already exists. Please use a different email",
          });
        console.log("No existing user")
        const lowerCaseEmail = email.toLowerCase()
        const idx = Math.floor(Math.random() * 100) + 1; // generate number b/w 1 and 100
        const randomAvatar = `https://robohash.org/${idx}`;
        console.log("Creating new user", lowerCaseEmail)
        const newUser = await prisma.user.create({
          data: {
            email: lowerCaseEmail,
            fullName,
            password : encryptedPassword,
            profilePic: randomAvatar,
          }
        })

        console.log("Created new user", newUser)
    

    
        const token = jwt.sign(
          { userId: newUser.id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "7d",
          }
        );
    
        res.cookie("jwt", token, {
          maxAge: 7 * 24 * 3600 * 1000,
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
        console.log("finish signup")
        res.status(201).json({ success: true, user: newUser });
      } catch (error) {
        console.log("error in signup controller: ", error);
        res.status(500).json({ message: "Internal server error" });
      }
    };
}

export default authHelper