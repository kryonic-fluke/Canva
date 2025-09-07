import React, { useEffect, useRef } from "react"; // Import React for types
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
}

export const ProfileCard = ({ setIsOpen ,buttonRef}: ProfileCardProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef?.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen,buttonRef]);

  return (
   
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      role="menu"
      aria-orientation="vertical"
    >
      <div className="py-1" role="none">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={user?.photoURL || "/img/default-avatar.png"} 
            alt="User avatar"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {user?.displayName || "User"}
            </span>
            <span className="text-sm text-gray-500 truncate">{user?.email}</span>
          </div>
        </div>

        <div className="p-2">
          <button
            onClick={handleLogout}
            className="w-full text-left block rounded-md px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};