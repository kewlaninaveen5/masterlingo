import redis from "../lib/redis.js";
import ChatMessageHelper from "../services/ChatMessageHelper.js";
import { initiateCall } from "../socketsCommunication/user.js";
import { joinChatroom } from "./chat.socket.js";
import { getIO } from "./socket.server.js";

export const registerSocketEvents = (socket) => {
    const io = getIO();

    socket.on("chat:join", async (chatroomId) => {
        console.log("[chat:join] Socket:", socket.id);
        console.log("[chat:join] Requested room:", chatroomId);
    
        await joinChatroom(socket, chatroomId);
    
        console.log("[chat:join] Actual socket rooms:", [...socket.rooms]);
    });

    socket.on("message:send", async (data) => {
        try {
            const { chatroomId, content } = data;
            const senderId = socket.data.userId
            const sessionId = socket.data.sessionId

            console.log("chatroomId : ", chatroomId)
            console.log("content : ", content)
            console.log("senderId : ", senderId)
            console.log("sessionId : ", sessionId)

            const cachedChatroom = await redis.get(
                `user:session:${sessionId}:chatroom`
            );

            if (!cachedChatroom) {
                socket.emit("message:error", {
                    message: "Chatroom session expired. Please reopen the chat.",
                });
                return;
            }

            const chatroom = JSON.parse(cachedChatroom);

            if (chatroom.id !== chatroomId) {
                socket.emit("message:error", {
                    message: "Invalid chatroom",
                });
                return;
            }

            const isParticipant =
            chatroom.user.id === senderId ||
            chatroom.chatPartner.id === senderId;

        if (!isParticipant) {
            socket.emit("message:error", {
                message: "You are not a participant in this chatroom",
            });
            return;
        }
        const receiverId =
        chatroom.user.id === senderId
            ? chatroom.chatPartner.id
            : chatroom.user.id;

        const message = await ChatMessageHelper.createMessage(chatroom, content)
        console.log("[message:send] Saved:", message);

        
        console.log("[DEBUG] Broadcasting message:new");
        console.log("[DEBUG] Room ID:", chatroomId);
        console.log("[DEBUG] Connected sockets in room:",
            (await io.in(chatroomId).fetchSockets()).length
        );
        
        io.to(`chatroom:${chatroomId}`).emit("message:new", message);
        
        console.log("[DEBUG] Emit executed");
    
        } catch (error) {
            console.error("[message:send] Error:", error);
    
            socket.emit("message:error", {
                message: "Failed to send message",
            });
        }
    });




















    // i dont know if I will be using this in future or not but I kept it
    socket.on("initiate_call", (data) => {
        initiateCall(socket, data);
    });
};