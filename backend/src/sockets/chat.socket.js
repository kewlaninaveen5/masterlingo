// sockets/chat.socket.js

import { verifyChatroomMember } from "../middleware/chat.middleware.js";

export const joinChatroom = async (socket, chatroomId) => {
    try {
        const { userId } = socket.data;

        const chatroom = await verifyChatroomMember(chatroomId, userId)

        if (!chatroom) {
            console.log(
                `User ${userId} is not allowed to join ${chatroomId}`
            );

            return;
        }

        console.log(
            `User ${userId} wants to join chatroom ${chatroomId}`
        );

        // We will verify membership here next.

        socket.join(`chatroom:${chatroomId}`);

        console.log(
            `User ${userId} joined chatroom:${chatroomId}`
        );

    } catch (error) {
        console.error("Error joining chatroom:", error);
    }
};