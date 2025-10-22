import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TripCard from '../components/TripCard';
import { Link } from 'react-router-dom';

const TRIPS_API_URL = 'http://localhost:5001/api/trips';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- START: Added State for Search ---
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState('');
  // --- END: Added State ---

  const { token } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!token) {
        setLoading(false);
        setError('You are not authorized. Please log in.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // --- START: Updated Fetching Logic ---

        // Build query params
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (tags) params.append('tags', tags);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params, // Pass params to axios
        };

        // Make request with query params
        const { data } = await axios.get(TRIPS_API_URL, config);
        
        // --- END: Updated Fetching Logic ---
        
        setTrips(data);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError(err.response?.data?.message || 'Failed to fetch trips.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [token, searchTerm, tags]); // Re-run effect if token or search terms change

  const handleTripDeleted = (deletedTripId) => {
    setTrips((prevTrips) =>
      prevTrips.filter((trip) => trip._id !== deletedTripId)
    );
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
        <h1 className="text-3xl font-bold text-gray-800">Your Trips</h1>
        <Link
          to="/trip/new"
          className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
        >
          + Add New Trip
        </Link>
      </div>

      {/* --- START: Added Search/Filter Bar --- */}
      <div className="flex flex-col gap-4 p-4 mb-6 bg-white rounded-lg shadow-sm md:flex-row">
        <input
          type="text"
          placeholder="Search by destination or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Filter by tags (e.g., beach,solo)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {/* --- END: Added Search/Filter Bar --- */}

      {/* Trips Display */}
      {loading && <div className="text-center">Loading trips...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          {trips.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700">
                No trips found.
              </h3>
              <p className="mt-2 text-gray-500">
                Click "Add New Trip" to start your travel diary!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onDelete={handleTripDeleted}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;