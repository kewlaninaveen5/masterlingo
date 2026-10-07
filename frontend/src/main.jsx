import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "stream-chat-react/dist/css/v2/index.css";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { socketStore } from './redux/socketIO/socketStore.js'
import { SocketProvider } from "./socket/SocketProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={socketStore}>
          <SocketProvider>
            <App />
          </SocketProvider>
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
