import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Define the base URL for your user API
const API_URL = 'http://localhost:5001/api/users';

// 1. Create the AuthContext
const AuthContext = createContext();

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // 3. Hold user and token in state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // To check auth status on app load

  // Check localStorage on initial app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        // Set the token in axios default headers for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        // Clear bad data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // Finished checking
  }, []);

  // 4. Provide login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      if (response.data) {
        // 5. Store token/user in state and localStorage
        setUser(response.data);
        setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);

        // Set axios default header for all subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response; // Return response for component to handle navigation/errors
    } catch (error) {
      console.error('Login error', error.response?.data);
      throw error.response?.data || error; // Throw error to be caught by the component
    }
  };

  // 4. Provide register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password });

      if (response.data) {
        // 5. Store token/user in state and localStorage (auto-login)
        setUser(response.data);
        setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response;
    } catch (error) {
      console.error('Register error', error.response?.data);
      throw error.response?.data || error;
    }
  };

  // 4. Provide logout function
  const logout = () => {
    // 6. Clear state and localStorage
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Provide the context values to the rest of the app
  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {/* Only render children once loading is false */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};