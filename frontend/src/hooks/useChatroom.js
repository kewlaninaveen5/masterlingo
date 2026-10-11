import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatRoom } from "../lib/api";

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


