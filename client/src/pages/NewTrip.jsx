import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// API URLs
const UPLOAD_API_URL = '/api/upload';
const TRIPS_API_URL = '/api/trips';

const NewTrip = () => {
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
  const [files, setFiles] = useState(null); // State for selected files
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth(); // Get auth token
  const navigate = useNavigate();

  // Handle changes for all text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let photoURLs = [];

    try {
      // --- Step A: Upload Images First ---
      if (files && files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('photos', files[i]);
        }

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        };

        // Upload images
        const { data } = await axios.post(UPLOAD_API_URL, formData, config);
        photoURLs = data; // data should be an array of URLs ['http://...', 'http://...']
      }

      // --- Step B: Create the Trip with Photo URLs ---
      const finalTripData = {
        ...tripData,
        photos: photoURLs, // Add the array of URLs
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Create the trip
      await axios.post(TRIPS_API_URL, finalTripData, config);

      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating trip:', err);
      setError(
        err.response?.data?.message || 'Failed to create trip. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto my-10 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Add Your New Trip
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

        {/* Photos */}
        <div>
          <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
            Upload Photos (up to 5)
          </label>
          <input
            type="file"
            name="photos"
            id="photos"
            multiple // Allow multiple files
            onChange={handleFileChange} // Use file handler
            accept="image/png, image/jpeg, image/jpg"
            className="w-full px-3 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* --- Optional Fields --- */}
        
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated, e.g., adventure, beach)
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
            {loading ? 'Creating Trip...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTrip;