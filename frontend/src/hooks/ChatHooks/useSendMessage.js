import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessageAPI } from "../../lib/ChatApi";

 const useSendMessage = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: sendMessageAPI,
    onError: () => console.log("error aaya" , error),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chatRoom"] }),
  });

  return { isPending, error, sendMessageMutation: mutate };
};

export default useSendMessage