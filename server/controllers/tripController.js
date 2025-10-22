import Trip from '../models/tripModel.js';
import mongoose from 'mongoose';

/**
 * @desc    Create a new trip
 * @route   POST /api/trips
 * @access  Private
 */
const createTrip = async (req, res) => {
  try {
    const {
      title,
      description,
      destination,
      startDate,
      endDate,
      tags,
      companions,
      budget,
      notes,
      photos, // Added photos from NewTrip.jsx
    } = req.body;

    // We get req.user from the 'protect' middleware
    const trip = new Trip({
      user: req.user._id, // Link the trip to the logged-in user
      title,
      description,
      destination,
      startDate,
      endDate,
      photos, // Save the photo URLs
      tags: tags ? tags.split(',').map((tag) => tag.trim()) : [], // Handle comma-separated string
      companions: companions ? companions.split(',').map((c) => c.trim()) : [],
      budget,
      notes,
    });

    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    res.status(400).json({ message: `Error creating trip: ${error.message}` });
  }
};

/**
 * @desc    Get all trips for the logged-in user
 * @route   GET /api/trips
 * @access  Private
 */
const getTrips = async (req, res) => {
  try {
    // --- START: Updated Search & Filter Logic ---

    const { search, tags } = req.query;

    // Base query: only get trips for the logged-in user
    const query = { user: req.user._id };

    if (search) {
      // Case-insensitive search on title or destination
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
      ];
    }

    if (tags && tags.trim() !== '') {
      // Find trips that contain *all* of the provided tags
      query.tags = { $all: tags.split(',').map(tag => tag.trim()) };
    }

    // Find trips based on the constructed query, sort by newest
    const trips = await Trip.find(query).sort({ startDate: -1 });
    
    // --- END: Updated Logic ---
    
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/**
 * @desc    Get a single trip by ID
 * @route   GET /api/trips/:id
 * @access  Private
 */
const getTripById = async (req, res) => {
  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Trip ID' });
    }

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // *** SECURITY CHECK ***
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/**
 * @desc    Update a trip
 * @route   PUT /api/trips/:id
 * @access  Private
 */
const updateTrip = async (req, res) => {
  try {
    const {
      title,
      description,
      destination,
      startDate,
      endDate,
      tags,
      companions,
      budget,
      notes,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Trip ID' });
    }

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // *** SECURITY CHECK ***
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    trip.title = title || trip.title;
    trip.description = description || trip.description;
    trip.destination = destination || trip.destination;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.budget = budget !== undefined ? budget : trip.budget;
    trip.notes = notes !== undefined ? notes : trip.notes;

    if (tags !== undefined) {
      trip.tags = tags.split(',').map((tag) => tag.trim());
    }
    if (companions !== undefined) {
      trip.companions = companions.split(',').map((c) => c.trim());
    }

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    res.status(400).json({ message: `Error updating trip: ${error.message}` });
  }
};

/**
 * @desc    Delete a trip
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
const deleteTrip = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Trip ID' });
    }

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // *** SECURITY CHECK ***
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.json({ message: 'Trip removed' });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export { createTrip, getTrips, getTripById, updateTrip, deleteTrip };