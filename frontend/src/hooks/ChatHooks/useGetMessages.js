import { useQuery } from "@tanstack/react-query";
import { getChatMessages } from "../../lib/ChatApi.js";

const useGetMessages = (chatroomId) => {
    const {
        data: messages,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["messages", chatroomId],
        queryFn: () => getChatMessages(chatroomId),
        enabled: !!chatroomId,
    });

    return {
        messages,
        isLoading,
        isError,
        error,
    };
};

export default useGetMessages;