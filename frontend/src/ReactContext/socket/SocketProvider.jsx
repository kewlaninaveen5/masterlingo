import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import { getAuthUser } from "../../lib/api";
import { socket } from "./socket";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
	const queryClient = useQueryClient();
	const { data : authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: getAuthUser,
	});

	useEffect(() => {
		console.log("events registerer ran")
		const logReceivedEvent = (eventName, ...args) => {
			console.log(`[Socket Received] ${eventName}`, ...args);
		};
	
		socket.onAny(logReceivedEvent);
	
		return () => {
			socket.offAny(logReceivedEvent);
		};
	}, []);

	useEffect(() => {
		const handleNewMessage = (message) => {
		  console.log("[SocketProvider] message:new", message);
	
		  queryClient.setQueryData(
			["messages", message.chatroomId],
			(oldMessages = []) => {
			  if (oldMessages.some((m) => m.id === message.id)) {
				return oldMessages;
			  }
	
			  return [...oldMessages, message];
			}
		  );
		};
	
		socket.on("message:new", handleNewMessage);
	
		return () => {
		  socket.off("message:new", handleNewMessage);
		};
	  }, [queryClient]);

	useEffect(() => {
		if (!authUser) return;
        console.log("connecting socket")
		socket.connect();

		return () => {
            console.log("disconnecting socket")
			socket.disconnect();
		};
	}, [authUser]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
}

export function useSocket() {
	return useContext(SocketContext);
}
