import mongoose from "mongoose";
// import bcrypt from 'bcryptjs';

const videoCallChannelSchema = new mongoose.Schema(
  {
    webURL: {
        type: String,
        required: true,
        comment: "Unique URL of the video call room",
        unique: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        comment: "User who created the video call",
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
        comment: "list of _id of allowed members",
    },
    type: {
        type: String,
        required: true,
        comment: "type of Video call : one_to_one or group",
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'ended'],
        default: "active",
        comment: "Status of the videocall: can be 'active' or 'ended'",
    },
    maxDuration: {
      type: Number,
      default: 15 * 60 * 1000, // 15 min in ms
      comment: "Max duration for a video call in milliseconds",
    },
  },
  { timestamps: true }
);

const VideoCallChannel = mongoose.model("VideoCallChannel", videoCallChannelSchema);

export default VideoCallChannel;