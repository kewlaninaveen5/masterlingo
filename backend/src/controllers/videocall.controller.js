import mongoose from "mongoose";
import VideoCallChannel from "../models/VideoCallChannel.js";
import { v4 as uuidv4 } from "uuid";


// POST /api/videocall/create
export const postCreateVideoCall = async (req, res, next) => {
  //     expecting:
  //     {
  //   "callToUser": "690ab5021ebd6d69ee5c83c7",
  //   "type": "one_to_one"
  // }

  console.log(req.user);
  const { callToUser, type } = req.body;
  const admin = req.user?.id;
  console.log(admin);
  try {
    if (!callToUser)
      return res.status(400).json({ message: "Target user not provided" });

    if (!mongoose.Types.ObjectId.isValid(callToUser))
      return res.status(400).json({ message: "Invalid user ID format" });

    if (!type)
      return res.status(400).json({
        message: "type not found",
      });

    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const members = [admin, callToUser];

    const webURL = uuidv4(); // unique room ID

    const videoCall = await VideoCallChannel.create({
      webURL,
      admin,
      members,
      type: type || "one_to_one",
      status: "active",
    });

    console.log("VideoCall: ", videoCall);

    return res.status(201).json({
      success: true,
      message: "Video call created successfully",
      webURL,
    });

    // if (!videoCall)
    //     return res.status(500).json({message: "could not create video call"})
  } catch (error) {
    return res
      .status(500)
      .json({ message: "could not create video call", error: error.message });
  }
};



// POST /api/videocall/leave
export const leaveVideoCall = async (req, res) => {
    console.log("HEREEEEEE")
  try {
    // You can later track user leaving in DB
    res.json({ message: "Left call successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/videocall/end
export const endVideoCall = async (req, res) => {
  try {
    const { callId } = req.body;
    await VideoCallChannel.findOneAndUpdate(
      { webURL: callId },
      { status: "ended" }
    );
    res.json({ message: "Call ended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/videocall/join/:callId
export const getVideoCall = async (req, res) => {
  try {
    const user = req.user;
    const { callId } = req.params;
    if (!callId)
      return res.status(400).json({ message: "Call id not provided" });

    const call = await VideoCallChannel.findOne({ webURL: callId });

    if (!call) return res.status(404).json({ message: "Call not found" });

    if ((call.status === "ended"))
      return res
        .status(404)
        .json({ message: "The call you are trying to reach has ended" });

    if (!call.members.includes(user.id))
      return res
        .status(403)
        .json({ message: "User not authorized to join the call" });

    res.status(200).json(call);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


