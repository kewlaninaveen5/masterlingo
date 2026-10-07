import { prisma } from "../lib/prismaClient.js";
import redis from "../lib/redis.js";
import User from "../models/User.js";
import { r200, r500 } from "../utils/responseUtils/responses.js";

export const getRecommendedUsers = async (req, res, next) => {
  try {

    const currentUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        friends: true,
      },
    });

    console.log("currentUser: ", currentUser)


    const friendIds = currentUser?.friends.map(
      (friend) => friend.friendId
    );


    const recommendedUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: [currentUser?.id, ...friendIds]
        },
        isOnboarded: true
      }
    })
    // mongoDb version
    // user.find({
    //   $and: [
    //     { id: { $ne: currentUserId } }, //exculude current user
    //     { id: { $nin: currentUser.friends } }, //exculude current user's friends
    //     { isOnboarded: true }, //exculude current user's friends
    //   ],
    // });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommended Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLastSeen = async (friendId) => {
  try {
    const lastSeenDate = await redis.get(`user:${friendId}:lastSeen`)
    console.log("lastSeenDate: ", lastSeenDate, friendId)
    if (!lastSeenDate) {
      return Date.now() - 30 * 24 * 60 * 60 * 1000 
    }
    return lastSeenDate
  } catch (err) {
    console.log( err )
  }
}

export const getMyFriends = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where : {
        id : req.user.id
      },
      include : {
          friends: {
            include : {
              friend : {
                select : {
              fullName: true,
              id : true,
              profilePic: true, 
              nativeLanguage : true, 
              learningLanguage : true
            }
          }
        }
        }
      }
    })

    console.log("USER: ", user.friends)
    const friends = await Promise.all(user.friends.map(async (f)=>{
      f.friend.userId = f.friend.id
      try {
        f.friend.lastseen = await getLastSeen(f.friend.id)
      } catch (error) {
        console.log(error)        
      }
      
      console.log("FRIEND DETAILS: ", f)
      return f.friend
    }))

    console.log(friends)
    

    res.status(200).json(friends);
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
    const recipient = await prisma.user.findUnique({
      where: {
        id : recipientId
      },
      include : {
        friends : true
      }
    })
    // mongo db version
    // await user.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    const recipientFriendsIds = recipient?.friends.map((f)=>f.friendId)
    console.log("Found recipient now: ", recipientFriendsIds)
    if (recipientFriendsIds.includes(myId)) {
      console.log("recipient.friends.includes me")
      return res
      .status(400)
      .json({ message: "Recipient is already your friend" });
    }
    console.log("recipient.friends does not include me")
    
    // ✅ High performance, but requires making two separate database hits or a schema match
    const existingRequest = await prisma.friendRequest.findFirst({
      where: { 
        senderId: myId, recipientId: recipientId 
      }
    }) ?? await prisma.friendRequest.findFirst({
      where: {
        senderId: recipientId, recipientId: myId 
      }
    });

    // mongo db version

    //     friendRequest.findOne({
    //   $or: [
    //     { sender: myId, recipient: recipientId },
    //     { sender: recipientId, recipient: myId },
    //   ],
    // });
    
    console.log("existing request: ", existingRequest)
    if (existingRequest) {
      console.log("Inside existing request validation")
      return res
        .status(400)
        .json({ message: "A friend request already exists" });
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: myId,
        recipientId
      }
    })
    if (!friendRequest) {
      r500(res, "some error occured")
    }
    
    // friendRequest.create({
    //   sender: myId,
    //   recipient: recipientId,
    // });

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
    const friendRequest = await prisma.friendRequest.findUnique({
      where : {
        id : requestId
      }
    })
      
      // friendRequest.findById(requestId);
    console.log("friendRequest: ", friendRequest)
    console.log("requestId: ", requestId)
    
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    
    console.log("friendRequest.recipientId ", friendRequest.recipientId)
    console.log("req.user.id: ", req.user.id)
    if (friendRequest.recipientId !== req.user.id) {
      console.log("this?")
      return res
        .status(403)
        .json({ message: "User not authorised to accept the request" });
    }
    friendRequest.status = "accepted";
    await prisma.friendRequest.update({
      where: {
        id : requestId
      },
      data : {
        status: "accepted"
      }
    })
    // await friendRequest.save();

    await prisma.userFriend.createMany({
      data: [
        {
          userId: friendRequest.senderId,
          friendId: friendRequest.recipientId,
        },
        {
          userId: friendRequest.recipientId,
          friendId: friendRequest.senderId,
        },
      ],
      skipDuplicates: true,
    });

    res.status(200).json({ message: "Friend Request Accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendRequests = async (req, res, next) => {
  try {

    const incomingReqs = await prisma.friendRequest.findMany({
      where: {
        recipientId: req.user.id,
        status: "pending",
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profilePic: true,
            nativeLanguage: true,
            learningLanguage: true,
          },
        },
      },
    });

    const acceptedReqs = await prisma.friendRequest.findMany({
      where: {
        senderId: req.user.id,
        status: "accepted",
      },
      include: {
        recipient: {
          select: {
            id: true,
            fullName: true,
            profilePic: true,
          },
        },
      },
    });

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getFriendRequests Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOutgoingFriendRequests = async (req, res, next) => {
  try {

    const outgoingReqs = await prisma.friendRequest.findMany({
      where: {
        senderId: req.user.id,
        status: "pending",
      },
      include: {
        recipient: {
          select: {
            id: true,
            fullName: true,
            profilePic: true,
            nativeLanguage: true,
            learningLanguage: true,
          },
        },
      },
    });

    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.log("Error in getOutgoingFriendRequests Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
