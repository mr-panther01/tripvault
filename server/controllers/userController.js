import User from '../models/userModel.js';
import Trip from '../models/tripModel.js'; // <-- 1. IMPORT TRIP MODEL
import jwt from 'jsonwebtoken';

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // 3. If user created, seed sample trips and send back data
    if (user) {
      
      // --- START: NEW CODE TO SEED SAMPLE TRIPS ---
      try {
        const sampleTrips = [
          {
            title: 'Welcome: Explore Kyoto',
            destination: 'Kyoto, Japan',
            description: 'This is a sample trip. You can see details, edit it, or click the delete button.',
            startDate: new Date('2024-03-28'),
            endDate: new Date('2024-04-05'),
            photos: ['https://th.bing.com/th/id/R.02f9f79c2669888fbe33e525d3a627f6?rik=yaEwpt7jBrLlHA&riu=http%3a%2f%2fd3e1m60ptf1oym.cloudfront.net%2fd7de27b3-c9fe-4f1b-a9f3-ca88750115f5%2fM28265-FR-01_uxga.jpg&ehk=MyQG2ZJrGQIRNp3aCHzML0EmJOW17cI8tFQZQlQhXq4%3d&risl=&pid=ImgRaw&r=0'],
            tags: ['sample', 'asia', 'photography'],
          },
          {
            title: 'Sample: Amalfi Coast',
            destination: 'Amalfi, Italy',
            description: 'Click the "+ Add New Trip" button in the header to create your own travel diary entries.',
            startDate: new Date('2024-06-14'),
            endDate: new Date('2024-06-21'),
            photos: ['https://placehold.co/400x250/a7c7e7/000080?text=Amalfi+Coast'],
            tags: ['sample', 'beach', 'food'],
          },
        ];

        // Add the new user's ID to each sample trip
        const tripsToCreate = sampleTrips.map(trip => ({
          ...trip,
          user: user._id, // Associate trip with the new user
        }));

        // Insert them all into the database
        await Trip.insertMany(tripsToCreate);

      } catch (seedError) {
        // If seeding fails, just log it but don't fail the registration
        console.error('Failed to seed sample trips for user:', seedError.message);
      }
      // --- END: NEW CODE ---

      // 4. Send back user info and token (as before)
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  // ... (Login logic remains unchanged)
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/**
 * @desc    Get user profile (Example of a protected route)
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  // ... (getUserProfile logic remains unchanged)
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export { registerUser, loginUser, getUserProfile };