import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm p-4 flex items-center justify-between">
      <Link to="/">App logo here </Link>

      <div>
        <Link to="/info">About </Link>
        <Link to="/login" replace={true}>
          Login
        </Link>
      </div>
    </nav>
  );
};
