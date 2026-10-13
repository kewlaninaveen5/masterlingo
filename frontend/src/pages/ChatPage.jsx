import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useUser } from "../ReactContext/UserContext/UserProvider";
// import useChatRoomContext from "../hooks/useChatRoomContext.js";
import { useQuery } from "@tanstack/react-query";
import { ChatRoom } from "../lib/api";
import { useChatRoomContext } from "../ReactContext/ChatroomContext/ChatRoomProvider";
import ChatHeader from "../components/Chat/ChatHeader.jsx";
import RecievedChatBubble from "../components/Chat/RecievedMessageBubble.jsx";
import SentMessageBubble from "../components/Chat/SentMessageBubble.jsx";
import ChatTextInput from "../components/Chat/ChatTextInput.jsx";


// chat page for testing
// const ChatPage = () => {
//   const { chatroom, isLoading, isError   } = useChatRoomContext();

//   console.log("Current chatroom:", chatroom);

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Failed to load chatroom</div>;
//   if (!chatroom) return <div>No chatroom selected</div>;

//   return <div>Chatroom loaded!</div>;
// };

const ChatPage = () => {

  const { user } = useUser();
  const {chatroom : chatroomState } = useChatRoomContext();

  console.log("chatroomState : ", chatroomState)


  return chatroomState && (
  <div class="h-full">
      <div class="flex flex-col h-full w-full mx-auto border border-base-300 bg-base-100 ">

        <ChatHeader chatPartner={chatroomState.chatPartner}  />

        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-base-300 bg-opacity-20">

          <div class="divider text-xs text-base-content text-opacity-50">TODAY</div>

          <RecievedChatBubble chatPartner={chatroomState.chatPartner} />
          <SentMessageBubble chatPartner={chatroomState.chatPartner} />

        </div>

        <ChatTextInput />

      </div>
    </div>)
};
export default ChatPage;
