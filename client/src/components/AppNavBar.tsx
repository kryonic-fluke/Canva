import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProfileCard } from "./ProfileCard";
import { useState } from "react";
import { useLayout } from "../context/LayoutContext";



export const Navbar = () => {
  const { user: currentUser } = useAuth();
  const [isOpen, setIsOpen ] = useState(false);
  const { isSidebarOpen, toggleSidebar, isAuthPage } = useLayout(); 


  return (
    <nav className="bg-blue-950 shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button disabled={isAuthPage}
          onClick={toggleSidebar}
          className="p-2"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
         <div className="hover:bg-slate-600 rounded-full p-2 transition-all duration-300">
 <img
              src="/img/back-button.png"
              alt="Left arrow icon"
              className="h-7"
            />
         </div>  
          ) : (
            <img
              src="/img/burger-menu.png"
              alt="Burger menu icon"
              className="h-7"
            />
          )}
        </button>
        <Link to="/" className="ml-[15rem] text-white font-bold text-xl" aria-label="Home">
  Creative Cava
          
        </Link>
        <div className=" ">
</div>
      </div>

      <div className="flex items-center gap-5">
        {currentUser ? (
          <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Open user menu">
              <img
                src={currentUser.photoURL || "/img/default-avatar.png"}
                alt="User avatar"
                className="h-10 w-10 rounded-full border-2 border-gray-600 hover:border-blue-400 transition"
              />
            </button>

            {isOpen && <ProfileCard setIsOpen={setIsOpen} />}
          </div>
        ) : (
          <div className="flex justify-center items-center gap-[2rem]">
            <Link
              to="/About"
              className="text-white font-semibold from-neutral-300 text-xl "
            >
              About
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
