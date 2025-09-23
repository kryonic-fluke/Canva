import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProfileCard } from "./ProfileCard";
import { useRef, useState } from "react";
import { useLayout } from "../context/LayoutContext";
import { Bars3Icon, ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";

export const Navbar = () => {
  const { user: currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { isSidebarOpen, toggleSidebar, isAuthPage } = useLayout();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <nav className="bg-gray-800 shadow-sm px-4 py-2 flex items-center justify-between h-[4.4rem]">
      <div className="w-48 flex justify-start">
        {!isAuthPage && (
          <button
            onClick={toggleSidebar}
            className="p-2 flex-shrink-0"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <div className="hover:opacity-40 rounded-full p-1 transition-all duration-300">
      <ChevronDoubleLeftIcon className="h-7 w-7" />

             

              </div>
            ) : (
              <div className="hover:opacity-40 rounded-full p-1 transition-all duration-300">
                     <Bars3Icon className="h- 10 w-10" aria-hidden="true" />

              </div>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-center">
        <Link
          to="/"
          className="flex items-center gap-4 text-white font-bold text-4xl hover:text-blue-400 transition-all duration-500 ease-in-out"
          aria-label="Home"
        >
          <img
            src="/img/image.png"
            className="h-14 w-14 rounded-full  object-cover"
          />

          <p>Synapse</p>
        </Link>
      </div>

      <div className="w-48 flex justify-end">
        {currentUser ? (
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(() => !isOpen)}
              aria-label="Open user menu"
            >
              <img
                src={currentUser.photoURL || "/img/default-avatar.png"}
                alt="User avatar"
                className="h-10 w-10 rounded-full border-2 border-gray-600 hover:border-blue-400 transition"
              />
            </button>
            {isOpen && (
              <ProfileCard setIsOpen={setIsOpen} buttonRef={buttonRef} />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/About" className="text-white font-semibold text-xl">
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
