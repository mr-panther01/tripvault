import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 

const Header = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const authLinks = (
    <>
      <li className="flex items-center">
        <span className="mr-4 text-gray-300">Welcome, {user?.name}!</span>
      </li>
      <li>
        <Link
          to="/dashboard"
          className="px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700/50"
        >
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/trip/new"
          className="px-3 py-2 text-black bg-white rounded-md hover:bg-gray-200"
        >
          + New Trip
        </Link>
      </li>
      <li>
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700/50"
        >
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link
          to="/login"
          className="px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700/50"
        >
          Login
        </Link>
      </li>
      <li>
        <Link
          to="/register"
          className="px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700/50"
        >
          Register
        </Link>
      </li>
    </>
  );

  return (
    // This is the translucent style:
    <nav className="sticky top-0 z-50 w-full bg-black backdrop-blur-lg border-b border-slate-700/50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link to={user ? '/dashboard' : '/login'} className="text-2xl font-bold text-white">
              TripVault 🧳
            </Link>
          </div>

          <div className="hidden md:block">
            <ul className="flex items-center ml-10 space-x-4">
              {user ? authLinks : guestLinks}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;