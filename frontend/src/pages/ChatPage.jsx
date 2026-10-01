import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import useStreamChat from "../lib/useStreamChat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  // const [chatClient, setChatClient] = useState(null);
  // const [channel, setChannel] = useState(null);
  // const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  const navigate = useNavigate()
  const {chatClient: chatClientFromHook, channel: channelFromHook,loading: loadingFromHook} = useStreamChat(tokenData, authUser,targetUserId)

  // useEffect(() => {
  //   const initChat = async () => {
  //     if (!tokenData?.token || !authUser) return;

  //     try {
  //       console.log("Initializing stream chat client...");

  //       const client = StreamChat.getInstance(STREAM_API_KEY);

  //       await client.connectUser(
  //         {
  //           id: authUser.id,
  //           name: authUser.fullName,
  //           image: authUser.profilePic,
  //         },
  //         tokenData.token
  //       );

  //       //
  //       const channelId = [authUser.id, targetUserId].sort().join("-");

  //       // you and me
  //       // if i start the chat => channelId: [myId, yourId]
  //       // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

  //       const currChannel = client.channel("messaging", channelId, {
  //         members: [authUser.id, targetUserId],
  //       });

  //       await currChannel.watch();

  //       setChatClient(client);
  //       setChannel(currChannel);
  //     } catch (error) {
  //       console.error("Error initializing chat:", error);
  //       toast.error("Could not connect to chat. Please try again.");
  //       navigate(-1)
        
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   initChat();

  //   // return () => {
  //   //   const disconnectChat = async () => {
  //   //     console.log("now ran")
  //   //     const client = StreamChat.getInstance(STREAM_API_KEY);
  //   //     await client.disconnectUser();
  //   //   };
  //   //   disconnectChat();
  //   // };
  // }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loadingFromHook || !chatClientFromHook || !channelFromHook) {
    console.log("loading updated")
    return <ChatLoader />;
  } 

  return (
    <div className="h-[93vh]">
      <Chat client={chatClientFromHook}>
        <Channel channel={channelFromHook}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
