# 🧳 TripVault – A Personal Travel Diary

TripVault is a full-stack **MERN** (MongoDB, Express, React, Node.js) application that acts as a personal digital travel diary.

Users can securely sign up and log in to create, view, edit, and delete their trip entries. Each trip entry can store a title, destination, dates, and notes. The app also supports **uploading photos** (using Cloudinary) for each trip and adding **searchable tags** (like "beach" or "solo"). The main dashboard displays all saved trips as cards, which can be **filtered or searched** by destination or tag.

---

## ✨ Features

* **Secure Authentication:** JWT-based user signup and login.
* **Trip Management (CRUD):** Users can create, view, edit, and delete their own trip entries.
* **Image Uploads:** Upload multiple photos for each trip, hosted on Cloudinary.
* **Dynamic Dashboard:** View all trips at a glance on a central dashboard.
* **Search & Filter:** Easily find trips by searching for destinations, titles, or filtering by tags.
* **Responsive UI:** A clean and responsive interface built with React and Tailwind CSS.
* **Client-Side Routing:** Uses React Router for a seamless single-page application (SPA) experience.

---

## 🧱 Tech Stack

* **Frontend:** React.js, React Router, Vite, Axios, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
* **Image Handling:** Multer & Cloudinary
* **Deployment:** Frontend on **Vercel**, Backend on **Render**

---

## 🚀 Getting Started (Local Development)

Follow these instructions to get a copy of the project up and running on your local machine. You will need to run two separate servers.

### Prerequisites

* Node.js (v18 or later)
* MongoDB (A local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account)
* Cloudinary (A free account for image hosting)

### 1. Backend Setup (`/server`)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `/server` directory and add your environment variables (see section below).
4.  Start the backend server:
    ```bash
    npm run dev  # (if you have nodemon)
    # or
    npm start
    ```
    The server will be running on `http://localhost:5001`.

### 2. Frontend Setup (`/client`)

1.  Open a **new terminal** and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `/client` directory (see section below).
4.  Start the React development server:
    ```bash
    npm run dev
    ```
    The app will open and run on `http://localhost:5173`.

---

## 🔐 Environment Variables

You must create two environment files for the app to work.

#### 1. Backend (`server/.env`)

This file contains all your secret keys for the server.

```env
# MongoDB Connection String
MONGO_URI=your_mongodb_connection_string

# JWT Secret Key
JWT_SECRET=your_super_secret_key_for_jwt

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# URL of the frontend (for CORS)
CLIENT_URL=http://localhost:5173