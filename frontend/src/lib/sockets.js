import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : window.location.origin; // when deployed, same host

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  // transports: ["websocket"],
  reconnectionAttempts: 2,
  autoConnect: false, // ⚠️ Notice this
});

// socket.on("error", (err) => {
//   console.error("❌ General Socket Error:", err);
// });
