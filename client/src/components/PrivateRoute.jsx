import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Your custom hook

const PrivateRoute = () => {
  const { user } = useAuth(); // Get user from your context
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;