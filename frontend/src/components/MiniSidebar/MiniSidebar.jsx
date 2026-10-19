import { Bot, UsersIcon, MessageCircle, NewspaperIcon, ShipWheelIcon, Home } from "lucide-react";
import { Link } from "react-router";

const MiniSidebar = () => {
    return (
      <aside className="flex h-full w-14 flex-col items-center border-r border-base-300 bg-base-100 py-3">
        <div className="flex flex-col items-center ">

        <Link to="/" className="btn rounded-none filter hover:brightness-90 active:brightness-90 py-4 pb-12 ">
        <Home className="size-7 text-primary" />
        </Link>

        <Link to="/" className="btn rounded-none hover:brightness-90 active:brightness-90 py-8 pb-12"  title="AI">
        <Bot className="size-6 text-base-content opacity-70" />
        </Link>
            
        
  
        <Link to="/chat" className="btn rounded-none hover:brightness-90 active:brightness-90  py-8 pb-12"  title="Chat">
            <MessageCircle className="size-5 text-base-content opacity-70" />
        </Link>
  
        <Link to="/friends" className="btn rounded-none hover:brightness-90 active:brightness-90  py-8 pb-12 "  title="find friends">
        <UsersIcon className="size-5 text-base-content opacity-70" />
          </Link>

  
          <Link to="#" className="btn rounded-none hover:brightness-90 active:brightness-90  py-8 pb-12 "  title="Under development">
            <NewspaperIcon className="size-5 text-base-content opacity-70" />
          </Link>
  
        </div>
  
        <div className="mt-auto">
          {/* <button
            className="btn btn-ghost btn-square"
            title="Settings"
          >
            ⚙️
          </button> */}
        </div>
      </aside>
    );
  };
  
  export default MiniSidebar;