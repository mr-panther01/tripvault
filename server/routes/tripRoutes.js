import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
} from '../controllers/tripController.js';

const router = express.Router();

// /api/trips
router.route('/')
  .post(protect, createTrip) // Protect this route
  .get(protect, getTrips);    // Protect this route

// /api/trips/:id
router.route('/:id')
  .get(protect, getTripById)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

export default router;