import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useThemeStore } from "../store/useThemeStore";
import MiniSidebar from "./MiniSidebar/MiniSidebar";

const Layout = ({ children, showSidebar = true }) => {

  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen">
      <div className="flex">
      <MiniSidebar />
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="h-[calc(100vh-64px)] overflow-hidden" data-theme={theme} >{children}</main>
        </div>
        {/* {console.log("openChatBubbles : ", openChatBubbles)}
        {openChatBubbles && openChatBubbles.map((user, i) => (<ChatBubble user={user}  />))} */}

      </div>
    </div>
  );
};
export default Layout;
