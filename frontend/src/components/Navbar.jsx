import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, ChevronLeft, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { StreamChat } from "stream-chat";
import useStreamChat from "../lib/useStreamChat";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname?.startsWith("/chat");
  const isHomepage = location.pathname ? location.pathname === "/" : false; //startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { disconnectChatHandler } = useStreamChat();
  const { logoutMutation } = useLogout();

  const backButtonHandler = async () => {
    console.log("initiate backButtonHandler");
    if (isChatPage) {
      const client = StreamChat.getInstance(STREAM_API_KEY);
      await client.disconnectUser();
    }
    navigate(-1);
  };

  const navigationHandler = async(address) => {
    if (isChatPage) {
      await disconnectChatHandler(()=>navigate(address));
    } else navigate(address);
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {!isHomepage ? (
            <div className="pl-5">
              <button
                onClick={() => navigationHandler(-1)}
                className="flex items-center gap-2.5"
              >
                {/* <ChevronLeft /> */}
                <ChevronLeft className="size-9 text-primary" />
                <span className="hidden lg:inline text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Masterlingo
                </span>
              </button>
            </div>
          ) : (
            <div className="pl-5">
              <button
                onClick={() => navigationHandler("/")}
                className="flex items-center gap-2.5"
              >
                {/* <ChevronLeft /> */}
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="hidden lg:inline text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Masterlingo
                </span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <button
              onClick={() => navigationHandler("/notifications")}
              to={"/notifications"}
            >
              {/* <button className="btn btn-ghost btn-circle"> */}
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              {/* </button> */}
            </button>
          </div>

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
