import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import { getAuthUser } from "../../lib/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const { data: authUser, isLoading, isError } = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
    });

    useEffect(() => {
        console.log("AUTH USER UPDATED")

        return () => {
        };
    }, [authUser]);

    return (
        <UserContext.Provider value={{
            user: authUser?.user ?? null,
            isLoading,
            isError,
        }}>{children}</UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
