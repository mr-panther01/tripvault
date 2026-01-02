import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Particles from '../components/ui/Particles';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, user } = useAuth(); // Get register function and user state
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard'); // Navigate to dashboard on successful registration
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-64px)] bg-black overflow-hidden selection:bg-indigo-500 selection:text-white">
      <Particles className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
            Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
                Join us to start planning your dream trips
            </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-200 bg-red-900/40 border border-red-800 rounded-md">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 mt-1 bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/30"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;