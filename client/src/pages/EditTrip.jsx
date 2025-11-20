import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import Particles from '../components/ui/Particles.jsx'; // Import Particles

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

  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchTrip = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${TRIPS_API_URL}/${id}`, config);
        setTripData({
          title: data.title,
          destination: data.destination,
          description: data.description,
          startDate: formatDateForInput(data.startDate),
          endDate: formatDateForInput(data.endDate),
          tags: data.tags ? data.tags.join(', ') : '',
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
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
      await axios.put(`${TRIPS_API_URL}/${id}`, tripData, config);
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

  if (loading && !error) {
    return (
      <div className="relative w-full min-h-screen bg-black p-4 pt-8 overflow-hidden">
         <Particles className="absolute inset-0 z-0" />
         <p className="relative z-10 text-center text-white">Loading trip data...</p>
      </div>
    );
  }

  return (
    // Main dark container with Particles
    <div className="relative w-full min-h-screen bg-black p-4 pt-8 overflow-hidden">
      <Particles className="absolute inset-0 z-0" />
      
      {/* Form container: translucent, centered, and on top */}
      <div className="relative z-10 max-w-2xl p-6 md:p-8 mx-auto my-10 bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Edit Your Trip
        </h2>

        {error && (
          <div className="p-3 mb-4 text-red-300 bg-red-500/30 rounded-md border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title - Dark Mode Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Trip Title
            </label>
            <input
              type="text" name="title" id="title"
              value={tripData.title} onChange={handleChange} required
              className="w-full px-3 py-2 mt-1 bg-slate-800/50 border border-slate-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Destination - Dark Mode Input */}
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-300">
              Destination
            </label>
            <input
              type="text" name="destination" id="destination"
              value={tripData.destination} onChange={handleChange} required
              className="w-full px-3 py-2 mt-1 bg-slate-800/50 border border-slate-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description - Dark Mode Textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              name="description" id="description" rows="3"
              value={tripData.description} onChange={handleChange} required
              className="w-full px-3 py-2 mt-1 bg-slate-800/50 border border-slate-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Dates - Dark Mode Inputs */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
                Start Date
              </label>
              <input
                type="date" name="startDate" id="startDate"
                value={tripData.startDate} onChange={handleChange} required
                className="w-full px-3 py-2 mt-1 bg-slate-800/50 border border-slate-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
                End Date
              </label>
              <input
                type="date" name="endDate" id="endDate"
                value={tripData.endDate} onChange={handleChange} required
                className="w-full px-3 py-2 mt-1 bg-slate-800/50 border border-slate-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Note: Photo editing is not included, but you could add a separate component for it here. */}
          
          {/* Tags - Dark Mode Input */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
              Tags (comma-separated)
            </label>
            <input
              type="text" name="tags" id="tags"
              value={tripData.tags} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-slate-800/50 border border-slate-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Companions - Dark Mode Input */}
          <div>
            <label htmlFor="companions" className="block text-sm font-medium text-gray-300">
              Travel Companions (comma-separated)
            </label>
            <input
              type="text" name="companions" id="companions"
              value={tripData.companions} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-slate-800/50 border border-slate-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Budget - Dark Mode Input */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-300">
              Budget ($)
            </label>
            <input
              type="number" name="budget" id="budget"
              value={tripData.budget} onChange={handleChange} min="0"
              className="w-full px-3 py-2 mt-1 bg-slate-800/50 border border-slate-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Notes - Dark Mode Textarea */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
              Notes
            </label>
            <textarea
              name="notes" id="notes" rows="3"
              value={tripData.notes} onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-slate-800/50 border border-slate-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Submit Button - Dark Mode */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 text-lg font-medium text-black bg-white rounded-md shadow-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTrip;