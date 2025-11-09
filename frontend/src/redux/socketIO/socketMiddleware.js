import { socket } from "../../lib/sockets";
import {
  incomingCall,
  socketConnected,
  socketDisconnected,
} from "./socketSlice";


const socketMiddlewar = (store) => {
  // Register socket listeners once
  socket.on("connect", () => {
    console.log("I am coming from middleware");
    store.dispatch(socketConnected());
  });

  socket.on("disconnect", () => {
    store.dispatch(socketDisconnected());
  });

  socket.on("initiate-call", (data) => {
    const { callId, to, from } = data;
    // const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", { callId, from });
    }
  });

  socket.on("incoming-call", (data) => {
    // dispatch Redux action to show incoming call
    store.dispatch(incomingCall(data));
  });

  return (next) => (action) => {
    switch (action.type) {
      case "signaling/initiate-call":
        socket.emit("initiate-call", action.payload);
        break;
      case "signaling/send-offer":
        socket.emit("offer", action.payload);
        break;
      case "signaling/send-answer":
        socket.emit("answer", action.payload);
        break;
      case "signaling/send-ice-candidate":
        socket.emit("ice-candidate", action.payload);
        break;
      case "signaling/join-room":
        socket.emit("join-room", action.payload);
        break;
      default:
        break;
    }
    return next(action);
  };
};

export default socketMiddlewar;
