import { prisma } from "../lib/prismaClient.js"


class ChatRoomHelper {
    constructor () {}

    static async findUniqueChatRoom (chatroomObject) {
        try {
            return await prisma.ChatRoom.findFirst({
                where : {
                    chatRoomUniqueIdentifier : chatroomObject. chatRoomUniqueIdentifier
                }
            })

        } catch (err) {
            console.log("error getting existing chatrooms", err)
        }

    }

    static async createChatRoom (chatroomObject) {
        console.log("CREATE CHATROOM SERVICE CALLED")
        try {
            return await prisma.ChatRoom.create({
                data : {user1Id : chatroomObject.user1Id,
                user2Id : chatroomObject.user2Id,
                chatRoomUniqueIdentifier : chatroomObject.chatRoomUniqueIdentifier,},

            })
        } catch (err) {
            console.log( "error creating chatroom", err)
        }
    }

    static async findChatRoomById (chatroomId) {
        try {
            return await prisma.ChatRoom.findFirst({
                where : {
                    id : chatroomId
                }
            })

        } catch (err) {
            console.log("error getting findChatRoomById", err)
        }

    }





}

export default ChatRoomHelper