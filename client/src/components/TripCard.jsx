import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Define the base URL for your trips API
const TRIPS_API_URL = '/api/trips';

const TripCard = ({ trip, onDelete }) => {
  const { token } = useAuth(); // Get token for delete request

  const handleDelete = async () => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`${TRIPS_API_URL}/${trip._id}`, config);
        // Notify the parent (Dashboard) to remove this card from the UI
        onDelete(trip._id); 
      } catch (error) {
        console.error('Failed to delete trip:', error);
        alert('Failed to delete trip. Please try again.');
      }
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
      {/* Card Image */}
      <img
        src={
          trip.photos && trip.photos.length > 0
            ? trip.photos[0] // Show the first photo
            : 'https://via.placeholder.com/400x250.png?text=No+Image' // Placeholder
        }
        alt={trip.title}
        className="object-cover w-full h-48"
      />

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{trip.title}</h3>
        <p className="mb-2 text-gray-600">{trip.destination}</p>
        <p className="text-sm text-gray-500">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 my-3">
          {trip.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex justify-end p-4 bg-gray-50">
        <Link
          to={`/trip/edit/${trip._id}`}
          className="px-4 py-2 mr-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TripCard;