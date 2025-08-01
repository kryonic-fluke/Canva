import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user: currentUser,logout } = useAuth();
const navigate = useNavigate();
  const handleLogout = async()=>{
     logout();
    navigate('/')
  }
  return (
    <nav className="bg-white shadow-sm p-4 flex items-center justify-between">
      <Link to="/">App logo here </Link>

      <div>
        <Link to="/info">About </Link>

        {currentUser ? (
          <div className="flex items-center gap-4">
                <span>Welcom,
                  {currentUser.displayName || currentUser.email}
                </span>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  Logout
                </button>
          </div>
        ) : (
          <Link to="/login" replace={true}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
