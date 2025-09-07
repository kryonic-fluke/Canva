import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProfileCard } from "./ProfileCard";
import { useRef, useState } from "react";
import { useLayout } from "../context/LayoutContext";

export const Navbar = () => {
  const { user: currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { isSidebarOpen, toggleSidebar, isAuthPage } = useLayout();
const buttonRef = useRef<HTMLButtonElement>(null); 

  return (
    <nav className="bg-blue-950 shadow-sm p-4 flex items-center justify-between h-20">

      <div className="w-48 flex justify-start">
        {!isAuthPage && (
          <button
            onClick={toggleSidebar}
            className="p-2 flex-shrink-0" 
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <div className="hover:opacity-40 rounded-full p-1 transition-all duration-300">
                <img
                  src="/img/back-button.png"
                  alt="Left arrow icon"
                  className="h-7 w-7"
                />
              </div>
            ) : (
   <div className="hover:opacity-40 rounded-full p-1 transition-all duration-300">

              <img
                src="/img/burger-menu.png"
                alt="Burger menu icon"
                className="h-7 w-7" 
              />
              </div>

            )}
          </button>
        )}
      </div>

      
      <div className="flex-1 flex justify-center"> 
        <Link to="/" className="text-white font-bold text-xl" aria-label="Home">
          Creative Cava
        </Link>
      </div>

      <div className="w-48 flex justify-end"> 
        {currentUser ? (
          <div className="relative">
            <button  ref={buttonRef} onClick={() => setIsOpen(()=>!isOpen)} aria-label="Open user menu">
              <img
                src={currentUser.photoURL || "/img/default-avatar.png"}
                alt="User avatar"
                className="h-10 w-10 rounded-full border-2 border-gray-600 hover:border-blue-400 transition"
              />
            </button>
            {isOpen && <ProfileCard setIsOpen={setIsOpen} buttonRef={buttonRef}/>}
          </div>
        ) : (
          <div className="flex items-center gap-6"> 
            <Link
              to="/About"
              className="text-white font-semibold text-xl"
            >
              About
            </Link>
            {!isAuthPage && (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};