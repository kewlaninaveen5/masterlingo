import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "stream-chat-react/dist/css/v2/index.css";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from "./ReactContext/socket/SocketProvider.jsx";
import { UserProvider } from "./ReactContext/UserContext/UserProvider.jsx";
import { ChatRoomProvider } from "./ReactContext/ChatroomContext/ChatRoomProvider.jsx";
// import { ChatRoomProvider } from "./ReactContext/UserContext/ChatRoomProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <UserProvider>
              <ChatRoomProvider>
                <App />
              </ChatRoomProvider>
            </UserProvider>
          </SocketProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
