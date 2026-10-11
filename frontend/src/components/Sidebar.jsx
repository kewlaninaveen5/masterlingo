import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { Bot, ShipWheelIcon, UsersIcon } from "lucide-react";
import SearchBox from "./SearchBox";
import { useThemeStore } from "../store/useThemeStore";
import { getUserFriends } from "../lib/api.js";
import { useQuery } from "@tanstack/react-query";
import useChatRoom from "../hooks/useChatroom.js";
import { useUser } from "../ReactContext/UserContext/UserProvider.jsx";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const { theme } = useThemeStore();
  const { user, isLoading } = useUser();

  const navigate = useNavigate()


  const { isPending, error, chatRoomMutation } = useChatRoom();

  const chatRoomUpdateHandler =  (e, friend) => {
    e.preventDefault()
    console.log(user, friend)
    !isLoading && friend ? chatRoomMutation([user.id,friend.id]) : null
    navigate("/chat")
  }


  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    onSuccess: () => console.log("friends: ", friends)
  });

  const currentPath = location.pathname;

  return (
    <aside className="w-1/4 min-w-[200px] bg-base-200 border-r border-base-300  lg:flex flex-col h-screen sticky top-0" data-theme={theme}>
      <div className="p-5 border-b border-base-300 flex m-auto mt-0 mb-0 flex-row w-full justify-between ">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
            Masterlingo
          </span>
        </Link>
        <Link
        to="/friends"
        className={`btn btn-ghost justify-start gap-3 px-3 normal-case ${currentPath === "/friends" ? "btn-active" : ""
          }`}
      >
        <UsersIcon className="size-5 text-base-content opacity-70" />
        <span>Find</span>
      </Link>
      </div>

      <div aria-label="friends-list" className="p-2 border-b border-base-300">
        <SearchBox />
        {
          loadingFriends ? null : console.log("friends: ", friends)
        }

        {loadingFriends ? null : friends.map((friend, idx)=>{

          return <Link
          key = {idx}

          onClick={(e)=> chatRoomUpdateHandler(e, friend)}
          // onClick={()=> {console.log("user.id, friend.id : ", user.id, friend.id); return chatRoomMutation(user.id, friend.id)}}
          to="/chat" //this should not have link later on because we dont want to change pages, we just want to fetch chatroom data from context and show on the very same page 
          className={`btn red justify-start m-2 w-full gap-3 px-3 normal-case ${currentPath === "/friends" ? "active" : ""
            }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>{friend?.fullName}</span>
        </Link>
        })}
      </div>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
};
export default Sidebar;
