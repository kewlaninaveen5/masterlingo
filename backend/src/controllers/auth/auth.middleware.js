import { v4 as uuidv4 } from 'uuid';
// import { upsertStreamUser } from "../../lib/stream.js";
// import user from "../../models/user.js";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prismaClient.js";
import authHelper from "../../services/authHelper.js";
import redis from "../../lib/redis.js";
import { emailRegex } from "../../commonRegex.js";
import { r200, r201, r400, r500 } from "../../utils/responseUtils/responses.js";


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
  console.log("reached signup: ", email, password, fullName)

  try {
    if (!email || !password || !fullName)
      return r400(res, "All Fields are required")

    if (password.length < 6)
      return r400(res, "Password must be more than 6 characters")

    if (!emailRegex.test(email)) {
      return r400(res, "Invalid email format")
    }

    if (await authHelper.isEmailAlreadyUsed(email))
      return r400(res, "Email already exists. Please use a different email")

    console.log("creating new user now")

    const lowerCaseEmail = email.toLowerCase()
    const randomAvatarId = Math.floor(Math.random() * 100) + 1; // generate number b/w 1 and 100
    const randomAvatar = `https://robohash.org/${randomAvatarId}`;
    const encryptedPassword = await authHelper.encrypt(password)
    const newUser = await authHelper.createUser(lowerCaseEmail, fullName, encryptedPassword, randomAvatarId, randomAvatar)

    if (!newUser)
      return r400(res, "unable to create new user at the moment")

    req.user = newUser
    console.log("newUser: ", newUser)

    next()
  } catch (error) {
    console.log("error in signup controller: ", error);
    r500(res, "Internal server error")
  }
};

export const createJWTToken = (req,res,next) => {

  // console.log("req: ", req)

  const {user} = req
  console.log("USER: ", user)
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  req.jwt = token
  next()

}

export const createAndAttachSessionId = (req, res, next) => {

  const sessionId = uuidv4().replace(/-/g, '');
  req.sessionId = sessionId

  // send session id as cookie with response to frontend
  res.cookie("sessionId", sessionId, {
    maxAge: 1 * 3600 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  next()

}

export const addSessionDataInRedis = async (req,res,next) => {

  const {jwt, sessionId, user} = req

  await redis.set(`user:session:${sessionId}:jwt`,jwt,{EX: 3600} ) //1 hour TTL
  await redis.set(`user:session:${sessionId}:sessionId`,sessionId,{EX: 3600} ) //1 hour TTL
  await redis.set(`user:session:${sessionId}:userId`,user.id,{EX: 3600} ) //1 hour TTL
  await redis.set(`user:${user.id}:lastSeen`,Date.now(),{EX: 3600 * 24 * 31} ) //31 days TTL

  next()
}



export const sendUser = (req,res,next) => {
  console.log("req: ", req)
  const {user} = req
  return r201(res, user)
}

export const login = async (req, res, next) => {
  const { email, password } = req.body;


  try {
    console.log("inside try")
    if (!email || !password)
      return res.status(400).json({ message: "All Fields are required" });

    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    // const user = await user.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await authHelper.matchPassword(password, user?.password)
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    req.user = user
    next()

  } catch (error) {
    console.log("error in login controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res, next) => {
  console.log(req)
  const {sessionId} = req.cookies
  res.clearCookie("jwt");
  res.clearCookie("sessionId");
  redis.del(`user:session:${sessionId}:jwt`)
  const userId = await redis.get(`user:session:${sessionId}:userId`)
  await redis.set(`user:${userId}:lastSeen`, Date.now(), {EX: 3600 * 24 * 31})
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
