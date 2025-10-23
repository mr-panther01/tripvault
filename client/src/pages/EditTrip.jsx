import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

// API URL
const TRIPS_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/trips`;

const EditTrip = () => {
  const [tripData, setTripData] = useState({
    title: '',
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    tags: '',
    companions: '',
    budget: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useAuth(); // Get auth token
  const navigate = useNavigate();
  const { id } = useParams(); // Get the trip ID from the URL

  // Helper to format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // 1. Fetch existing trip data on page load
  useEffect(() => {
    const fetchTrip = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`${TRIPS_API_URL}/${id}`, config);

        // 2. Populate the form state with fetched data
        setTripData({
          title: data.title,
          destination: data.destination,
          description: data.description,
          startDate: formatDateForInput(data.startDate),
          endDate: formatDateForInput(data.endDate),
          tags: data.tags ? data.tags.join(', ') : '', // Convert array to string
          companions: data.companions ? data.companions.join(', ') : '',
          budget: data.budget || '',
          notes: data.notes || '',
        });
      } catch (err) {
        setError('Failed to fetch trip data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, token]); // Re-run if ID or token changes

  // Handle changes for all text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 3. Handle form submission (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // Send PUT request to update
      await axios.put(`${TRIPS_API_URL}/${id}`, tripData, config);

      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating trip:', err);
      setError(
        err.response?.data?.message || 'Failed to update trip. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading trip...</div>;

  return (
    <div className="max-w-2xl p-6 mx-auto my-10 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Edit Your Trip
      </h2>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Trip Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={tripData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            id="destination"
            value={tripData.destination}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows="3"
            value={tripData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={tripData.startDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={tripData.endDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        {/* Note: Photo editing is not included here as the backend updateTrip controller doesn't handle it. */}

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={tripData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Companions */}
        <div>
          <label htmlFor="companions" className="block text-sm font-medium text-gray-700">
            Travel Companions (comma-separated)
          </label>
          <input
            type="text"
            name="companions"
            id="companions"
            value={tripData.companions}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Budget ($)
          </label>
          <input
            type="number"
            name="budget"
            id="budget"
            value={tripData.budget}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows="3"
            value={tripData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-lg font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTrip;