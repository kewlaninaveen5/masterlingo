import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const useStreamChat = (tokenData, authUser, targetUserId) => {
  //   const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDisconnecting, setIsDiconnecting] = useState(false);

  const chatClientRef = useRef(null);

  const client = StreamChat.getInstance(STREAM_API_KEY);

  const disconnectChatHandler = async (callback) => {
    console.log(chatClientRef);
    console.log("disconnect handler running: ", chatClientRef.current);
    setIsDiconnecting(true);
    setLoading(true);
    const client = chatClientRef.current;
    if (!client) {
      console.log("No client found");
      return;
    }
    try {
      console.log("try running: ", client);
      await client.disconnectUser();
      console.log("client should be disconnected now: ", client);
      //   setChatClient(null);

      setChannel(null);
      setIsConnected(false);
      callback();
    } catch (error) {
      console.log("catch running");
      console.log(error);
      toast.error("some error occured");
    } finally {
      console.log("finally running");
      setLoading(false);
      setIsDiconnecting(false);
    }
  };

  useEffect(() => {
    const initChat = async () => {
      setIsConnecting(true);
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        // const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser.id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        //
        const channelId = [authUser.id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser.id, targetUserId],
        });

        await currChannel.watch();
        console.log("connected client: ", client);
        // setChatClient(client);
        chatClientRef.current = client;
        setChannel(currChannel);
        setIsConnected(true);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
        navigate(-1);
      } finally {
        setLoading(false);
        setIsConnecting(false);
      }
    };

    initChat();

    return () => {
    console.log("useStreamChat unmounted, disconnecting...");
    if (chatClientRef.current) {
      chatClientRef.current.disconnectUser();
    }
  };
  }, [tokenData, authUser, targetUserId]);

  //   useEffect(() => {
  //     if (!isDisconnecting) return;
  //     const disconnectUser = async () => {
  //       if (isDisconnecting) {
  //         const client = StreamChat.getInstance(STREAM_API_KEY);
  //         await client.disconnectUser();
  //       }
  //     };
  //     disconnectUser();
  //   }, [isDisconnecting]);

  return {
    chatClient: chatClientRef.current,
    channel,
    loading,
    isConnecting,
    isDisconnecting,
    disconnectChatHandler,
    isConnected,
  };
};

export default useStreamChat;
