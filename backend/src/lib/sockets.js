import { Server } from "socket.io";
import redis from "./redis.js";
import { initiateCall } from "../socketsCommunication/user.js";

const userSocketMap = new Map(); // key: userId, value: socketId

let io;
export const getIO = () => io;

const SocketEvent = Object.freeze({
  connection : 'connection',
  userConnected: 'user:connected',
  MESSAGE_RECEIVED: 'message:received',
  DISCONNECT: 'disconnect',
});

export const initSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: "http://localhost:5173", // <-- must match frontend URL
			credentials: true,
		},
	});

	//io became my socket io object that implements the websockets

	console.log("✅ Socket.io initialized and ready to accept connections");

	io.on(SocketEvent.connection, handleSocket);

	return io;
};

const handleSocket = async (socket) => {

	const { cookie } =  socket.handshake.headers

	const sessionId = cookie?.split('=')[1]
	console.log("SESSION IDDD: ", sessionId)

	await redis.set(`user:session:${sessionId}:socketId`, socket.id, {EX: 3600})
	const userId = await redis.get(`user:session:${sessionId}:userId`, 'userId')
	await redis.set(`user:${userId}:lastSeen`, Date.now(), {EX: 3600 * 24 * 31})




	socket.on("initiate_call", initiateCall );

	socket.on("disconnect", (reason) => {
        console.log("DISCONNECTED:", socket.id, reason)});

	// socket.on("disconnect", async () => {
	// 	console.log(`Socket disconnected: ${socket.id}`);
	// 	await redis.del(`user:session:${sessionId}:socketId`, 'socketId')
	// 	const userId = await redis.get(`user:session:${sessionId}:userId`, 'userId')
	// 	await redis.set(`user:${userId}:lastSeen`, Date.now(), {EX: 3600 * 24 * 31})
	// 	console.log(`🔻 User ${userId} is now offline`);
	// });
};
