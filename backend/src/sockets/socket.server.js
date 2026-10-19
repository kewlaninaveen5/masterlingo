import { Server } from "socket.io";
import { handleSocketConnection } from "./socket.connection.js";
import { authenticateSocket } from "./socket.auth.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    console.log("✅ Socket.io initialized");

    io.use(authenticateSocket);

    io.on("connection", handleSocketConnection);

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized");
    }

    return io;
};