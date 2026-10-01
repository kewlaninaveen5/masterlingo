// import { upsertStreamUser } from "../../lib/stream.js";
// import user from "../../models/user.js";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prismaClient.js";
import authHelper from "../../services/authHelper.js";


// const createJWTToken = () => {
//         const token = jwt.sign(
//       { userId: newUser.id },
//       process.env.JWT_SECRET_KEY,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.cookie("jwt", token, {
//       maxAge: 7 * 24 * 3600 * 1000,
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });
// }

export const deleteUser = async (userId) => {
  // this is non functional
  try {
    //why does this codepiece exist? who wants to delete a user? If I need a transaction, I better use (tx) right....
    await User.findByIdAndDelete(userId);
    console.log(`Deleted user with ID: ${userId}`);
  } catch (err) {
    console.error(`Error deleting user with ID ${userId}:`, err);
  }
};


export const signup = async (req, res, next) => {
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

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    console.log("email and password passed validation, checking existing user")

    const existingUser = await prisma.user.findUnique({
      where: {
        email : email
      }
    })
    
    // await user.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: "Email already exists. Please use a different email",
      });
    console.log("No existing user")
    const lowerCaseEmail = email.toLowerCase()
    const idx = Math.floor(Math.random() * 100) + 1; // generate number b/w 1 and 100
    const randomAvatar = `https://robohash.org/${idx}`;
    console.log("Creating new user", lowerCaseEmail)

    const encryptedPassword = await authHelper.encrypt(password)
    console.log("encryptedPassword: ", encryptedPassword)



    const newUser = await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        fullName,
        password : encryptedPassword,
        profilePic: randomAvatar,
      }
    })
    // const newUser = await user.create({
    //   email: lowerCaseEmail,
    //   fullName,
    //   password,
    //   profilePic: randomAvatar,
    // });
    console.log("Created new user", newUser)

    // try {
    //   console.log("Stream user ID: ", newUser.id.toString());

    //   await upsertStreamUser({
    //     id: newUser.id.toString(),
    //     name: fullName,
    //     image: newUser.profilePic || "",
    //   });
    //   console.log(`stream user created for ${newUser.fullName}`);
    // } catch (error) {
    //   console.log(`starting to delete user now`);
    //   await deleteUser(newUser.id); // this is non functional
    //   console.log(`Error creating stream user: `, error);
    //   return res.status(400).json({
    //     message: "Unable to create Stream user. Please try again later",
    //     error,
    //   });
    // }

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

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log("inside try")
    if (!email || !password)
      return res.status(400).json({ message: "All Fields are required" });
    
    const user = await prisma.user.findUnique({ 
      where : {
        email : email
      }
     });
    // const user = await user.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await authHelper.matchPassword(password, user?.password)
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 3600 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("error in login controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout Successful" });
};

export const onboard = async (req, res, next) => {
  console.log(req.user);
  try {
    const userId = req.user.id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location)
      return res.status(400).json({
        message: "All Fields are Mandatory",
        missingFields: [
          !fullName && "Full Name",
          !bio && "bio",
          !nativeLanguage && "Native Language",
          !learningLanguage && "Learning Language",
          !location && "location",
        ].filter(Boolean),
      });
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          fullName, bio, nativeLanguage, learningLanguage, location,
          isOnboarded: true,
        },
      });
    // const updatedUser = await user.findByIdAndUpdate(
    //   userId,
    //   {
    //     ...req.body,
    //     isOnboarded: true,
    //   },
    //   { new: true }
    // );
    console.log("updatedUser: ", updatedUser);

    if (!updatedUser)
      return res.status(404).json({ message: "user Not Found" });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("onboarding error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
