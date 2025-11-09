import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketIO",
  initialState: {
    connected: false,
    inCall: false, //when in a call or in ringing state
    videocall: {
      activeCall: null, // info about current call
      incomingCall: null, // when someone calls you
      status: "idle", // idle | ringing | in-call 
    },
  },
  reducers: {
    socketConnected: (state) => {
      state.connected = true;
    },
      inCallToTrue: (state) => {
      state.inCall = true;
    },
    clearInCall: (state) => {
      state.inCall = false;
    },
    setIncomingCall: (state,action)=>{
      state.videocall.incomingCall = action.payload;
    },
    incomingCall: (state, action) => {
      state.incomingCall = action.payload;
    },
    socketDisconnected: (state) => {
      state.connected = false;
    },
  },
});

export const {
  setIncomingCall,

  inCallToTrue,
  clearInCall,
  socketConnected,
  socketDisconnected,
} = socketSlice.actions;
export default socketSlice.reducer;
