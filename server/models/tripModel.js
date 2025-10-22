import mongoose from 'mongoose';

const tripSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  photos: [{ type: String }], // Array of Cloudinary URLs
  tags: [{ type: String }],
  companions: [{ type: String }],
  budget: { type: Number },
  notes: { type: String },
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;