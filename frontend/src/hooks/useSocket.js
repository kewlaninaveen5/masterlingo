import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../lib/sockets";
import {
  clearInCall,
  inCallToTrue,
  setIncomingCall,
  socketConnected,
  socketDisconnected,
} from "../redux/socketIO/socketSlice";
import toast from "react-hot-toast";
// import IncomingCallToast from "../components/IncomingCallToast";

const useSocket = (userId) => {
  const dispatch = useDispatch();
  const { connected } = useSelector((state) => state.socketFromStore);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
      // console.log("I come from connection req in useSocket");
      // console.log("📤 Connecting:", userId);
      dispatch(socketConnected());
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      dispatch(socketDisconnected());
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.error("Full error:", error);
    });

    socket.on("incoming_call", (data) => {
      console.log("📞 Incoming call:", data);
      dispatch(inCallToTrue());
      dispatch(
        setIncomingCall({
          callId: data.callId,
          from: data.from,
          type: data.type,
          status: "ringing",
        })
      );
    });

    socket.on("user_offline", () => {
      console.log("The user is offline");
      dispatch(clearInCall());

      toast.dismiss();
      toast.error("🚫 The user is offline");
    });

    return () => {
      socket.off("connect");
      socket.off("incoming_call");
      socket.off("user_offline");
      // socket.off("disconnect");
      socket.off("connect_error");
      // socket.off("incoming_call");
    };
  }, [dispatch]);

  useEffect(() => {
    if (connected && userId) {
      // console.log("📤 Registering user after load:", userId);
      socket.emit("register_user", userId);
    }
  }, [connected, userId]);

  useEffect(() => {
    socket.on("user_busy", () => {
      dispatch(clearInCall());
      console.log("User is busy: ");
      toast.dismiss();
      toast.error("User is Busy");
    });

    return () => {
      socket.off("user_busy");
    };
  }, []);

  const initiateCall = (data) => {
    const { callId, to, from, type } = data;
    dispatch(inCallToTrue());
    console.log("📤 Emitting initiate_call:", { callId, to, from, type });
    socket.emit("initiate_call", data);
  };

  return { socket, connected, initiateCall };
};

export default useSocket;
