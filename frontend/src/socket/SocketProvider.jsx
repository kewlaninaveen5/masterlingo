import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import { getAuthUser } from "../lib/api";
import { socket } from "./socket";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
	const { data : authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: getAuthUser,
	});

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
