import express from 'express';
import upload from '../config/multer.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// /api/upload
router.post('/', protect, upload.array('photos', 5), (req, res) => {
  // 'photos' is the field name, 5 is the max count
  // req.files will contain an array of file info from Cloudinary
  const urls = req.files.map(file => file.path);
  res.status(200).json(urls);
});

export default router;