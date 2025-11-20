// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// // Helper function to format dates
// const formatDate = (dateString) => {
//   const options = { year: 'numeric', month: 'long', day: 'numeric' };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// // Define the base URL for your trips API
// const TRIPS_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/trips`  ;

// const TripCard = ({ trip, onDelete }) => {
//   const { token } = useAuth(); // Get token for delete request

//   const handleDelete = async () => {
//     // Confirm before deleting
//     if (window.confirm('Are you sure you want to delete this trip?')) {
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         await axios.delete(`${TRIPS_API_URL}/${trip._id}`, config);
//         // Notify the parent (Dashboard) to remove this card from the UI
//         onDelete(trip._id); 
//       } catch (error) {
//         console.error('Failed to delete trip:', error);
//         alert('Failed to delete trip. Please try again.');
//       }
//     }
//   };

//   return (
//     <div className="overflow-hidden bg-white rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
//       {/* Card Image */}
//       <img
//         src={
//           trip.photos && trip.photos.length > 0
//             ? trip.photos[0] // Show the first photo
//             : 'https://via.placeholder.com/400x250.png?text=No+Image' // Placeholder
//         }
//         alt={trip.title}
//         className="object-cover w-full h-48"
//       />

//       {/* Card Content */}
//       <div className="p-4">
//         <h3 className="text-xl font-semibold text-gray-800">{trip.title}</h3>
//         <p className="mb-2 text-gray-600">{trip.destination}</p>
//         <p className="text-sm text-gray-500">
//           {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
//         </p>
        
//         {/* Tags */}
//         <div className="flex flex-wrap gap-2 my-3">
//           {trip.tags?.map((tag, index) => (
//             <span
//               key={index}
//               className="px-2 py-0.5 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full"
//             >
//               {tag}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Card Actions */}
//       <div className="flex justify-end p-4 bg-gray-50">
//         <Link
//           to={`/trip/edit/${trip._id}`}
//           className="px-4 py-2 mr-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
//         >
//           Edit
//         </Link>
//         <button
//           onClick={handleDelete}
//           className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TripCard;
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TRIPS_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/trips`;

const TripCard = ({ trip, onDelete }) => {
  const { token } = useAuth();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${TRIPS_API_URL}/${trip._id}`, config);
        onDelete(trip._id); 
      } catch (error) {
        console.error('Failed to delete trip:', error);
        alert('Failed to delete trip. Please try again.');
      }
    }
  };

  return (
    // UPDATED: Changed from bg-white to dark translucent glassmorphism
    <motion.div
      className="flex flex-col overflow-hidden bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.03, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Card Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={
            trip.photos && trip.photos.length > 0
              ? trip.photos[0]
              : 'https://placehold.co/400x250/a78bfa/ffffff?text=My+Trip' 
          }
          alt={trip.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Card Content - UPDATED text colors for dark bg */}
      <div className="flex-grow p-5">
        <h3 className="text-2xl font-bold text-white">{trip.title}</h3>
        <p className="mb-3 text-base text-indigo-300 font-medium">
          {trip.destination}
        </p>
        <p className="text-sm text-gray-400">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
        
        {/* Tags - UPDATED tag colors for dark bg */}
        <div className="flex flex-wrap gap-2 pt-4">
          {trip.tags?.slice(0, 3).map((tag, index) => ( 
            <span
              key={index}
              className="px-3 py-1 text-xs font-semibold text-indigo-200 bg-indigo-500/30 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions - UPDATED bg and button colors */}
      <div className="flex justify-end p-4 border-t border-slate-700/50">
        <Link
          to={`/trip/edit/${trip._id}`}
          className="px-4 py-2 text-sm font-medium text-indigo-200 bg-indigo-500/30 rounded-lg hover:bg-indigo-500/50"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="px-4 py-2 ml-2 text-sm font-medium text-red-300 bg-red-500/30 rounded-lg hover:bg-red-500/50"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default TripCard;