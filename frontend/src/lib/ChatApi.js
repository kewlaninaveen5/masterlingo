import { axiosInstance } from "./axios";

export const sendMessageAPI = async (chatData) => {
  console.log("chatData : ", chatData)
  const response = await axiosInstance.post("/chat/message/send", chatData);
  console.log("response.data : ", response.data)
  return response.data;
};

export async function getChatMessages(chatroomId) {
  try {
      const response = await axiosInstance.get(
          `/chat/messages/${chatroomId}`
      );

      return response.data;
  } catch (error) {
      console.log("Error in getChatMessages:", error);
      return null;
  }
}