import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";

const ChatRoomContext = createContext(null);

export function ChatRoomProvider({ children }) {
    const {
        data: chatroom,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["chatRoom"],
        queryFn: () => Promise.resolve(null),
        enabled: false,
    });

    useEffect(() => {
        console.log("ChatRoomContext UPDATED")

        return () => {
        };
    }, [chatroom]);

    return (
        <ChatRoomContext.Provider value={{ chatroom, isLoading, isError }}>{children}</ChatRoomContext.Provider>
    );
}

export function useChatRoomContext() {
    return useContext(ChatRoomContext);
}
