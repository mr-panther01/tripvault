import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your useAuth hook

const Header = () => {
  const { user, logout } = useAuth(); // Get user state and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  // Links for logged-in users
  const authLinks = (
    <>
      <li className="flex items-center">
        <span className="mr-4 text-gray-300">Welcome, {user?.name}!</span>
      </li>
      <li>
        <Link
          to="/dashboard"
          className="px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/trip/new"
          className="px-3 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          + New Trip
        </Link>
      </li>
      <li>
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          Logout
        </button>
      </li>
    </>
  );

  // Links for guests (logged-out users)
  const guestLinks = (
    <>
      <li>
        <Link
          to="/login"
          className="px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          Login
        </Link>
      </li>
      <li>
        <Link
          to="/register"
          className="px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          Register
        </Link>
      </li>
    </>
  );

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="shrink-0">
            <Link to={user ? '/dashboard' : '/login'} className="text-2xl font-bold text-white">
              TripVault 🧳
            </Link>
          </div>

          {/* Navigation Links */}
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