import { configureStore } from "@reduxjs/toolkit";
import { socket } from "../../lib/sockets.js";
import socketReducer from "./socketSlice";
// import socketMiddlewar from "./socketMiddleware";

export const socketStore = configureStore({
  reducer: {
    socketFromStore: socketReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(socketMiddlewar),
});
