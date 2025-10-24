# 🧳 TripVault – A Personal Travel Diary

TripVault is a full-stack **MERN** application (MongoDB, Express, React, Node.js) that acts as a personal digital travel diary.

Users can securely sign up and log in to create, view, edit, and delete their trip entries. Each trip entry can store a title, destination, dates, and notes. The app also supports **photo uploads** (via Cloudinary) and **searchable tags** (like "beach" or "solo"). The main dashboard displays all trips as cards, which can be **filtered or searched** by destination or tag.

---

## ✨ Features

- **Secure Authentication:** JWT-based user signup and login.
- **Trip Management (CRUD):** Create, view, edit, and delete trip entries.
- **Image Uploads:** Upload multiple photos for each trip (Cloudinary hosting).
- **Dynamic Dashboard:** View all saved trips in an interactive dashboard.
- **Search & Filter:** Search by destination or filter by tags.
- **Responsive UI:** Built with React and Tailwind CSS for optimal experience.
- **Client-Side Routing:** Uses React Router for SPA navigation.

---

## 🧱 Tech Stack

- **Frontend:** React.js, React Router, Vite, Axios, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js  
- **Image Handling:** Multer & Cloudinary  
- **Deployment:** Frontend on **Vercel**, Backend on **Render**

---

## 🚀 Getting Started (Local Development)

Follow the steps below to set up the project on your local machine.  
You will need **two servers** running — one for frontend and one for backend.

### Prerequisites

- Node.js (v18 or later)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Cloudinary account (for image hosting)

---

### 1. Backend Setup (`/server`)

1. Navigate to the server directory:
   cd server
2. Install dependencies:
   npm install
3. Create a `.env` file in `/server` and add your environment variables (see below).  
4. Start the backend:
npm run dev # if you use nodemon
or
npm start
The backend will run on [http://localhost:5001](http://localhost:5001).

---

### 2. Frontend Setup (`/client`)

1. In a new terminal window:
  cd client
2. Install dependencies:
  npm install
3. Create a `.env.local` file in `/client` (see below).  
4. Start the React development server:
The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🔐 Environment Variables

### 1. Backend (`server/.env`)
MongoDB Connection String
MONGO_URI=your_mongodb_connection_string

JWT Secret Key
JWT_SECRET=your_super_secret_key_for_jwt

Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Frontend URL for CORS
CLIENT_URL=http://localhost:5173

### 2. Frontend (`client/.env.local`)
Backend API URL
VITE_API_BASE_URL=http://localhost:5001

---

## ☁️ Deployment

This project is deployed in two parts:

### **Backend (Render)**
- Deploy `/server` folder as a **Web Service** on Render.
- **Root Directory:** `server`  
- **Start Command:** `node server.js`
- Update `CLIENT_URL` in Render environment variables to your live Vercel URL (e.g., `https://tripvault.vercel.app`).

### **Frontend (Vercel)**
- Deploy `/client` as a **Vite Project** on Vercel.  
- **Root Directory:** `client`  
- Update `VITE_API_BASE_URL` in environment variables to your Render API URL (e.g., `https://tripvault-api.onrender.com`).
- Add a `client/vercel.json` file to fix React Router refresh issues.

---

## 📖 API Endpoints

All API requests are prefixed with your base URL  
(e.g., `http://localhost:5001` or `https://tripvault-api.onrender.com`).

### **User Routes**
- `POST /api/users/register` – Register a new user  
- `POST /api/users/login` – Log in a user  

### **Trip Routes**
- `POST /api/trips` – Create a new trip  
- `GET /api/trips` – Get all trips for the logged-in user  
  - Supports queries: `?search=` and `?tags=`  
- `GET /api/trips/:id` – Get a single trip by ID  
- `PUT /api/trips/:id` – Update a trip  
- `DELETE /api/trips/:id` – Delete a trip  

### **Upload Route**
- `POST /api/upload` – Upload images and receive an array of Cloudinary URLs

---

## 🧭 Future Enhancements

- Add interactive maps for each destination
- Enable itinerary sharing via public links
- Integrate weather forecasts and local guides

---

## 👨‍💻 Author

Developed by **Aditya Sharma**.  
If you like this project, 🌟 star the repository and share your feedback!
