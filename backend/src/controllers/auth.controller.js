import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// const createJWTToken = () => {
//         const token = jwt.sign(
//       { userId: newUser._id },
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

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: "Email already exists. Please use a different email",
      });
    const lowerCaseEmail = email.toLowerCase()
    const idx = Math.floor(Math.random() * 100) + 1; // generate number b/w 1 and 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    const newUser = await User.create({
      lowerCaseEmail,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    try {
      console.log("Stream User ID: ", newUser._id.toString());

      await upsertStreamUser({
        id: newUser._id.toString(),
        name: fullName,
        image: newUser.profilePic || "",
      });
      console.log(`stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log(`starting to delete user now`);
      await deleteUser(newUser._id); // this is non functional
      console.log(`Error creating stream user: `, error);
      return res.status(400).json({
        message: "Unable to create Stream user. Please try again later",
        error,
      });
    }

    const token = jwt.sign(
      { userId: newUser._id },
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
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found")

      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
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
    const userId = req.user._id;
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
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );
    console.log("updatedUser: ", updatedUser);

    if (!updatedUser)
      return res.status(404).json({ message: "User Not Found" });
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        "Stream user updated after onboarding for ",
        updatedUser.fullName
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream User after onboarding: ",
        streamError.message
      );
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("onboarding error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
