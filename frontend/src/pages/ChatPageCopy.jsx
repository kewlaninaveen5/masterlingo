import { useEffect, useState, useRef } from "react";
import { useUser } from "../ReactContext/UserContext/UserProvider.jsx";
import { useChatRoomContext } from "../ReactContext/ChatroomContext/ChatRoomProvider.jsx";
import ChatHeader from "../components/Chat/ChatHeader.jsx";
import RecievedChatBubble from "../components/Chat/RecievedMessageBubble.jsx";
import SentMessageBubble from "../components/Chat/SentMessageBubble.jsx";
import ChatTextInput from "../components/Chat/ChatTextInput.jsx";
import useGetMessages from "../hooks/ChatHooks/useGetMessages.js";

export const ChatPageCopy = () => {
  const { user } = useUser();
  const { chatroom: chatroomState } = useChatRoomContext();
  const { messages = [], isLoading: messagesLoading, isError: messagesError, } = useGetMessages(chatroomState?.id);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (behavior = "smooth") => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    if (!messagesLoading && messages.length > 0) {
      scrollToBottom("auto");
    }
  }, [chatroomState?.id, messagesLoading]);

  // 2. When new messages arrive:
  //    only scroll if user was already near the bottom
  useEffect(() => {
    console.log("triggered?)")

    const container = messagesContainerRef.current;

    if (!container || messages.length === 0) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    const isNearBottom = distanceFromBottom < 400;

    if (isNearBottom) {
      scrollToBottom("smooth");
    }
  }, [messages]);

  // Detect whether user is near bottom
  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setShowScrollButton(distanceFromBottom > 100);
  };

  if (!chatroomState) {
    return <div>No chatroom selected</div>;
  }

  if (messagesLoading) {
    return <div>Loading messages...</div>;
  }

  if (messagesError) {
    return <div>Failed to load messages</div>;
  }

  return (
    <div class="h-full min-h-0">
      <div class="flex flex-col h-full min-h-0 w-full border border-base-300 bg-base-100">

        <div class="sticky top-0 z-20" >

          <ChatHeader chatPartner={chatroomState.chatPartner} />
        </div>
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-base-300 bg-opacity-20"
        >
          <div class="divider text-xs text-base-content text-opacity-50">
            TODAY
          </div>

          {messages.length === 0 ? (
            <div class="text-center text-base-content/50">
              No messages yet
            </div>
          ) : (
            messages.map((message, idx) => {
              if (message.senderId === user.id) {
                return (
                  <SentMessageBubble
                    key={idx}
                    chatPartner={chatroomState.chatPartner}
                    content={message}
                  />
                );
              }

              return (
                <RecievedChatBubble
                  key={idx}
                  chatPartner={chatroomState.chatPartner}
                  content={message}
                />
              );
            })
          )}
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={() => scrollToBottom("smooth")}
            class="absolute bottom-20 right-6 btn btn-circle btn-sm"
          >
            ↓
          </button>
        )}
        <div class="sticky bottom-0 z-20" >
          <ChatTextInput />
        </div>
      </div>

    </div>
  );
};