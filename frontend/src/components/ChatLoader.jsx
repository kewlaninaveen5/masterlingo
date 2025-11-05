import { LoaderIcon } from "lucide-react";
import useStreamChat from "../lib/useStreamChat";

function ChatLoader() {

  const {isConnecting, isDisconnecting} = useStreamChat()
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <LoaderIcon className="animate-spin size-10 text-primary" />
      {isConnecting && <p className="mt-4 text-center text-lg font-mono">Connecting to chat...</p>}
      {isDisconnecting && <p className="mt-4 text-center text-lg font-mono">Disconnecting chat...</p>}
    </div>
  );
}

export default ChatLoader;
