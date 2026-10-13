import { axiosInstance } from "./axios";

export const sendMessageAPI = async (chatData) => {
  console.log("chatData : ", chatData)
  const response = await axiosInstance.post("/chat/message/send", chatData);
  console.log("response.data : ", response.data)
  return response.data;
};