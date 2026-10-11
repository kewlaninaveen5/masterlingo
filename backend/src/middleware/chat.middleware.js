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

export const createOrAttachChatroom = async (req,res,next) => {
    console.log("HELLOOOOOOOOOOO")
    try {

    const userIds = req.body
    
    if (!userIds || userIds.length < 2)
        throw new Error ("atleast 2 user ids are needed")

    const chatroomObject = getOrderedChatroomStrings(userIds[0], userIds[1])

    console.log("chatRoomUniqueIdentifier : ", chatroomObject)
    const getChatroomIfExisting = await ChatRoomHelper.findUniqueChatRoom(chatroomObject)
    console.log(getChatroomIfExisting)
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
    console.log("REACHED BACHEND WITH REQUEST: ", req)

    const {chatroom, user } = req
    chatroom.user = user
    req.chatroom = chatroom
    next()
}


export const attachChatPartnerToChatroom = async (req,res,next) => {
    const {chatroom } = req
    const chatPartnerId = chatroom.user1Id === chatroom.user.id ? chatroom.user2Id : chatroom.user1Id
    try {

        const chatPartner = await userHelper.getUserFromId(chatPartnerId)
        console.log("chatPartner : ", chatPartner)
        req.chatroom.chatPartner = chatPartner
        r200(res, chatroom)
    } catch (err) {
        console.log("error in attachChatPartnerToChatroom", err)
    }


}