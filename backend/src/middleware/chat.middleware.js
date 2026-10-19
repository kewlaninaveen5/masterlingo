import redis from "../lib/redis.js"
import ChatRoomHelper from "../services/ChatRoomHelper.js"
import { userHelper } from "../services/userHelper.js"
import { r200 } from "../utils/responseUtils/responses.js"


function getOrderedChatroomStrings(str1, str2) {
        return str1 < str2 ?  {
            user1Id : str1,
            user2Id : str2, 
            chatRoomUniqueIdentifier : `${str1}_${str2}`

        } : {
            user1Id : str2,
            user2Id : str1, 
            chatRoomUniqueIdentifier : `${str2}_${str1}`

        } 
}



export const verifyChatroomMember = async (chatroomId, userId) => {
    const chatroom = await ChatRoomHelper.findChatRoomById(chatroomId);
    // console.log("chatroom from verifyChatroomMember", chatroom)

    if (!chatroom) {
        return null;
    }

    const isMember =
        chatroom.user1Id === userId ||
        chatroom.user2Id === userId;

    if (!isMember) {
        return null;
    }

    return chatroom;
};

export const createOrAttachChatroom = async (req,res,next) => {
    console.log("HELLOOOOOOOOOOO")
    try {

    const userIds = req.body
    
    if (!userIds || userIds.length < 2)
        throw new Error ("atleast 2 user ids are needed")

    const chatroomObject = getOrderedChatroomStrings(userIds[0], userIds[1])

    // console.log("chatRoomUniqueIdentifier : ", chatroomObject)
    const getChatroomIfExisting = await ChatRoomHelper.findUniqueChatRoom(chatroomObject)
    // console.log("getChatroomIfExisting", getChatroomIfExisting)
    if (getChatroomIfExisting) {
        req.chatroom = getChatroomIfExisting
        next()
        return
        // return r200(res, {chatroom: getChatroomIfExisting})
    }
    console.log("NO existing chatroom")

    const chatroom = await ChatRoomHelper.createChatRoom(chatroomObject)
    
    if (!chatroom) throw new Error ("unable to create chatroom")
        req.chatroom = chatroom
    console.log("chatroom: ", req.chatroom)
    next()            
    } catch (err) {
        console.log("error in createOrAttachChatroom", err)
    }

}

export const attachUserToChatroom = (req,res,next) => {
    // console.log("REACHED BACHEND WITH REQUEST: ", req)

    const {chatroom, user } = req
    chatroom.user = user
    req.chatroom = chatroom
    next()
}

export const getCurrentChatroom = async (req,res,next) => {
    const {sessionId} = req
    let chatroom = await redis.get(`user:session:${sessionId}:chatroom`)
    if (!chatroom)
        console.log("redis isnt returning chatroom")
    chatroom = JSON.parse(chatroom)
    // console.log("chatroom from redis : ", chatroom)
    req.chatroom = chatroom
    next()

}


export const attachChatPartnerToChatroom = async (req,res,next) => {
    const {user, chatroom, sessionId } = req
    const chatPartnerId = chatroom.user1Id === chatroom.user.id ? chatroom.user2Id : chatroom.user1Id
    try {

        const chatPartner = await userHelper.getUserFromId(chatPartnerId)
        req.chatroom.chatPartner = chatPartner
        next()
    } catch (err) {
        console.log("error in attachChatPartnerToChatroom", err)
    }


}

export const respondWithChatroomId = async (req,res,next) => {

    const {chatroom, sessionId } = req
    redis.set(`user:session:${sessionId}:chatroom`, JSON.stringify(chatroom), {EX : 3600 * 24})

    const chatroomForResponse = {
        id : chatroom.id,
        chatPartner: {
            fullName: chatroom.chatPartner.fullName,
            email: chatroom.chatPartner.email,
            bio: chatroom.chatPartner.bio,
            profilePic: chatroom.chatPartner.profilePic,
            profilePicIdx: chatroom.chatPartner.profilePicIdx,
            nativeLanguage: chatroom.chatPartner.nativeLanguage,
            learningLanguage: chatroom.chatPartner.learningLanguage,
            location: chatroom.chatPartner.location
          }
    }



    r200(res, chatroomForResponse)


}