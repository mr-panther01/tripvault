import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config(); // Load .env variables
connectDB(); // Connect to MongoDB

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json()); // To accept JSON data in body
app.use(express.urlencoded({ extended: true })); // For form data

app.get('/', (req, res) => {
  res.send('TripVault API is running...');
});

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/upload', uploadRoutes);

// (Add Error Handling Middleware here)

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));