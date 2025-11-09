import { Server } from "socket.io";

const userSocketMap = new Map(); // key: userId, value: socketId

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // <-- must match frontend URL
      credentials: true,
    },
  });

  console.log("✅ Socket.io initialized and ready to accept connections");

  io.on("connection", (socket) => {
    console.log("socket connected. ID: ", socket.id);

    socket.on("register_user", (userId) => {
      if (userId) {
        userSocketMap.set(userId, {
          socketId: socket.id,
          lastSeen: Date.now(),
          isOnline: true,
          inCall: false,
          isRinging: false,
          inCall: false,
        });
        console.log(`✅ User ${userId} registered with socket ${socket.id}`);
      }
    });

    socket.on("initiate_call", (data) => {
      const { callId, to, from, type } = data;
      const receiverSocket = userSocketMap.get(to);
      const senderSocket = userSocketMap.get(from);


      console.log("🚀 ~ initSocket ~ receiverSocket:", userSocketMap)
      if (receiverSocket && receiverSocket.isOnline) {
        if (receiverSocket.inCall || receiverSocket.isRinging ) {
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
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      for (const [userId, userData] of userSocketMap.entries()) {
        console.log("🚀 ~ initSocket ~ userId, userData:", userId, userData)
        
        if (userData.socketId === socket.id) {
          userSocketMap.set(userId, {
            ...userData,
            isOnline: false,
            lastSeen: Date.now(),
          });
          console.log(`🔻 User ${userId} is now offline`); 
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => io;
