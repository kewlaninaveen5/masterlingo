import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useUser } from "../ReactContext/UserContext/UserProvider";
// import useChatRoomContext from "../hooks/useChatRoomContext.js";
import { useQuery } from "@tanstack/react-query";
import { useChatRoomContext } from "../ReactContext/ChatroomContext/ChatRoomProvider";
import ChatHeader from "../components/Chat/ChatHeader.jsx";
import RecievedChatBubble from "../components/Chat/RecievedMessageBubble.jsx";
import SentMessageBubble from "../components/Chat/SentMessageBubble.jsx";
import ChatTextInput from "../components/Chat/ChatTextInput.jsx";
import useGetMessages from "../hooks/ChatHooks/useGetMessages.js";



const ChatPage = () => {

  const { user } = useUser();
  const { chatroom: chatroomState } = useChatRoomContext();

  console.log("chatroomState : ", chatroomState)

  const {
    messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
  } = useGetMessages(chatroomState?.id);

  console.log("chatroomState:", chatroomState);
  console.log("messages:", messages);

  if (!chatroomState) {
    return <div>No chatroom selected</div>;
  }

  if (messagesLoading) {
    return <div>Loading messages...</div>;
  }

  if (messagesError) {
    return <div>Failed to load messages</div>;
  }
  if (messages == []) {
    return <div>I am still working on error handling, please click some other button and come back.</div>;
  }


  return chatroomState && (
    <div class="h-full">
      <div class="flex flex-col h-full w-full mx-auto border border-base-300 bg-base-100 ">

        <ChatHeader chatPartner={chatroomState.chatPartner} />

        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-base-300 bg-opacity-20">

          <div class="divider text-xs text-base-content text-opacity-50">TODAY</div>

          {
            messages?.map((message, idx)=>{
              if (message.senderId === user.id)
                return <SentMessageBubble key={idx} chatPartner={chatroomState.chatPartner} content={message} />
              return <RecievedChatBubble key={idx} chatPartner={chatroomState.chatPartner} content={message} />
                
            })
          }

        </div>

        <ChatTextInput />

      </div>
    </div>)
};
export default ChatPage;
