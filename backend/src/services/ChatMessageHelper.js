import { prisma } from "../lib/prismaClient.js"


class ChatMessageHelper {
    constructor () {}

    static async createMessage (chatroom, content) {
        try {
        return await prisma.message.create({
            data: {
                // chatRoomUniqueIdentifier: chatroom.chatRoomUniqueIdentifier,
                chatroomId: chatroom.id,
                senderId: chatroom.user.id,
                receiverId: chatroom.chatPartner.id,
                content,
            },
        });
    } catch (err) {
        console.log("error getting existing chatrooms", err)
    }

    }




}

export default ChatMessageHelper