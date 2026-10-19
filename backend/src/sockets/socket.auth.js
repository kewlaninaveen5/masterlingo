import authHelper from "../services/authHelper.js";
import { getSessionIdFromCookie } from "../utils/session.js";

export const authenticateSocket = async (socket, next) => {
    try {
        // console.log("stuck in authenticateSocket")
        const sessionId = getSessionIdFromCookie(socket.handshake.headers.cookie);

        const session = await authHelper.authenticateSession(sessionId);

        if (!session) {
            return next(new Error("Authentication failed"));
        }

        socket.data.sessionId = session.sessionId;
        socket.data.userId = session.userId;

        next();

    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Authentication failed"));
    }
};