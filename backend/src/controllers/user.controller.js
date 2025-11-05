import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getRecommendedUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exculude current user
        { _id: { $nin: currentUser.friends } }, //exculude current user's friends
        { isOnboarded: true }, //exculude current user's friends
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommended Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage "
      );
    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res, next) => {
  console.log("reached sendFriendRequest")
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    console.log("req.params: ", req.params,)
    console.log("myId: ", myId,)
    console.log("recipientId: ", recipientId,)

    //prevent sending request to self
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself!" });
    }
    console.log("Recipient id is different : checked. Checking recipient now")
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    console.log("Found recipient now: ", recipient)
    if (recipient.friends.includes(myId)) {
      console.log("recipient.friends.includes me")
      return res
      .status(400)
      .json({ message: "Recipient is already your friend" });
    }
    console.log("recipient.friends does not include me")
    
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    
    console.log("existing request: ", existingRequest)
    if (existingRequest) {
      console.log("Inside existing request validation")
      return res
        .status(400)
        .json({ message: "A friend request already exists" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req, res, next) => {
  console.log("Inside acceptFriendRequest")
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    console.log("friendRequest: ", friendRequest)
    console.log("requestId: ", requestId)
    
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    
    console.log("friendRequest.recipient.toString(): ", friendRequest.recipient.toString())
    console.log("req.user.id: ", req.user.id)
    if (friendRequest.recipient.toString() !== req.user.id) {
      console.log("this?")
      return res
        .status(403)
        .json({ message: "User not authorised to accept the request" });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();

    //add each user to other's friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend Request Accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendRequests = async (req, res, next) => {
  try {
    const incomingReqs = await FriendRequest
      .find({
        recipient: req.user.id,
        status: "pending",
      })
      .populate(
        "sender",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    const acceptedReqs = await FriendRequest
      .find({
        sender: req.user.id,
        status: "accepted",
      })
      .populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getFriendRequests Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOutgoingFriendRequests = async (req, res, next) => {
  try {
    const outgoingReqs = await FriendRequest
      .find({
        sender: req.user.id,
        status: "pending",
      })
      .populate(
        "recipient",
        "fullName profilePic nativeLanguage learningLanguage"
      );
      console.log("outgoingReqs: ", outgoingReqs)
    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.log("Error in getOutgoingFriendRequests Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
