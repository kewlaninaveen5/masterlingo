import { prisma } from "../lib/prismaClient.js";
import { r200, r500 } from "../utils/responseUtils/responses.js";

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

export const getChatMessages = async (req, res, next) => {
    try {
        const { chatroomId } = req.params;
        const { chatroom } = req;
        const { user } = req;

        if (!chatroom || chatroom.id !== chatroomId) {
            return res.status(404).json({
                message: "Chatroom not found",
            });
        }

        // Make sure this user actually belongs to this chatroom
        if (
            chatroom.user1Id !== user.id &&
            chatroom.user2Id !== user.id
        ) {
            return res.status(403).json({
                message: "You are not a member of this chatroom",
            });
        }

        const messages = await prisma.message.findMany({
            where: {
                chatroomId: chatroom.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return r200(res, messages)

    } catch (error) {
        console.log("Error getting chat messages:", error);
        return r500(res, "Failed to get messages")

    }
};