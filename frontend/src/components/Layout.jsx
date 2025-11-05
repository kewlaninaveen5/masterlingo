import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useThemeStore } from "../store/useThemeStore";

const Layout = ({ children, showSidebar = false }) => {

  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 overflow-y-auto" data-theme={theme} >{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
