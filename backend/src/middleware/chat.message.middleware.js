import { prisma } from "../lib/prismaClient.js";
import { r200 } from "../utils/responseUtils/responses.js";

export const processSentMessage = async (req, res, next) => {
    const { user, chatroom, body } = req;

    try {
        const message = await prisma.message.create({
            data: {
                // chatRoomUniqueIdentifier: chatroom.chatRoomUniqueIdentifier,
                chatroomId: chatroom.id,
                senderId: chatroom.user.id,
                receiverId: chatroom.chatPartner.id,
                content: body.content,
            },
        });

        console.log("[processSentMessage -> message]", message);

        req.message = message;

        r200(res, message);
    } catch (error) {
        console.log("[processSentMessage] Error creating message:", error);
        return res.status(500).json({
            message: "Failed to send message",
        });
    }
};