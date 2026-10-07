import redis from "../lib/redis.js"

export const initiateCall = (data) => {
    const { callId, to, from, type } = data;
    const receiverSocket = userSocketMap.get(to);
    const senderSocket = userSocketMap.get(from);

    console.log("🚀 ~ initSocket ~ receiverSocket:", userSocketMap);
    if (receiverSocket && receiverSocket.isOnline) {
        if (receiverSocket.inCall || receiverSocket.isRinging) {
            io.to(senderSocket.socketId).emit("user_busy");
        }
        userSocketMap.set(to, { ...receiverSocket, isRinging: true });
        userSocketMap.set(from, { ...senderSocket, isRinging: true });

        io.to(receiverSocket.socketId).emit("incoming_call", {
            from,
            callId,
            type,
        });
        console.log(`📤 Sent incoming_call to user ${to}`);
    } else {
        console.log(`❌ User ${to} not connected`);
        io.to(senderSocket.socketId).emit("user_offline");
    }
}