import redis from "../lib/redis.js";
import { registerSocketEvents } from "./socket.events.js";

export const handleSocketConnection = async (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    const sessionId = socket.data.sessionId
    const userId = socket.data.userId

    if (!userId || !userId) {
        socket.disconnect();
        return;
    }

    await redis.set(
        `user:session:${sessionId}:socketId`,
        socket.id,
        { EX: 3600 * 24 }
    );

    await redis.set(
        `user:${userId}:lastSeen`,
        Date.now(),
        { EX: 3600 * 24 * 31 }
    );

    registerSocketEvents(socket);

    socket.on("disconnect", async (reason) => {
        console.log("🔌 Socket disconnected:", socket.id, reason);

        await redis.del(
            `user:session:${sessionId}:socketId`
        );

        await redis.set(
            `user:${userId}:lastSeen`,
            Date.now(),
            { EX: 3600 * 24 * 31 }
        );
    });
};