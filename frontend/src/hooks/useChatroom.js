import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";



async function ChatRoom(args) {
  console.log("Request args:", args);

  try {
      const response = await axiosInstance.post("/chat/join/chatroom", args);

      console.log("Response data:", response.data);

      return response.data;
  } catch (error) {
      console.error("ChatRoom API failed:", error);
      throw error;
  }
}

const useChatRoom = () => {
  const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
      // mutationFn: (args) => {console.log("reached mutation function : ", args ); return ChatRoom},
      mutationFn: ChatRoom,
      onSuccess:(data) => {
        console.log("Mutation returned:", data);

        queryClient.setQueryData(["chatRoom"], data);
    },
    });
  
    return { error, isPending, chatRoomMutation: mutate };
  };


export default useChatRoom;



