# CampusCart 🎓

CampusCart is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed exclusively for university students to buy, sell, and trade used academic materials and essentials within their campus community. It provides a secure and user-friendly platform for students to monetize their unused items like calculators, notes, books, and project components, while helping others find affordable resources.

![CampusCart Hero](client/public/vite.svg) *Note: Replace with actual screenshot if available*

## 🚀 Features

### for Students (Users)
- **Secure Authentication**: Robust signup and login system using JWT (JSON Web Tokens) with password hashing.
- **Marketplace Browsing**: intuitive search and filter options to find specific items by name or category (e.g., Books, Notes, Electronics).
- **Product Listing**: Easily list items for sale with detailed descriptions, pricing, categories, and image uploads.
- **User Dashboard**: A personal profile page to manage your active listings and view your contact details.
- **Direct Communication**: View seller contact information (email/phone) to arrange purchases directly on campus.
- **Responsive Design**: Fully responsive UI built with React Bootstrap, accessible on desktops, tablets, and mobile devices.

### for Administrators
- **Dedicated Admin Panel**: Secure dashboard accessible only to authorized admin users.
- **User Management**: View all registered students, their contact details, and activity statistics.
- **Content Moderation**: Ability to delete inappropriate users or listings to maintain community standards.
- **Platform Insights**: visualize total users, active listings, and platform growth at a glance.

## 🛠️ Technology Stack

- **Frontend**: 
  - **React.js (Vite)**: For a fast, interactive user interface.
  - **React Bootstrap**: For responsive, modern styling and components.
  - **CSS3 (Custom)**: Glassmorphism effects, dynamic gradients, and polished aesthetics.

- **Backend**: 
  - **Node.js**: Robust JavaScript runtime environment.
  - **Express.js**: Fast, unopinionated web framework for building APIs.

- **Database**: 
  - **MongoDB**: NoSQL database for flexible data storage.
  - **Mongoose**: ODM library for MongoDB and Node.js.

- **Security & Utilities**:
  - **JWT (JSON Web Tokens)**: For secure, stateless authentication.
  - **Bcryptjs**: For password encryption.
  - **Multer**: user uploading middleware for handling product images.

## 📂 Project Structure

```bash
CampusCart/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, PrivateRoute)
│   │   ├── context/        # React Context API for Global State (Auth)
│   │   ├── pages/          # Application Views (Home, Login, Dashboard)
│   │   ├── utils/          # Helper functions and API configuration
│   │   ├── App.jsx         # Main Application Component
│   │   └── index.css       # Global Styles & Design System
│   └── vite.config.js      # Vite Configuration
│
└── server/                 # Node.js Backend
    ├── config/             # Database connection logic
    ├── controllers/        # Request logic for Auth, Products, and Admin
    ├── middleware/         # Auth verification and Role-based access control
    ├── models/             # Mongoose Schemas (User, Product)
    ├── routes/             # API Endpoints
    ├── uploads/            # Storage for uploaded product images
    ├── index.js            # Server entry point
    └── seeder.js           # Script to populate database with dummy data
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/campuscart.git
cd CampusCart
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

### 4. Database Seeding (Optional)
To populate the database with dummy users and products (including a default Admin account):
```bash
cd server
node seeder.js
```
*Default Admin Credentials:* `admin@campuscart.com` / `admin@123`

### 5. Running the Application
You need to run both the backend and frontend servers.

**Backend Terminal:**
```bash
cd server
npm start
```

**Frontend Terminal:**
```bash
cd client
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

## 🛡️ Admin Access
To access the Admin Panel:
1. Log in with the admin credentials (`admin@campuscart.com` / `admin@123`).
2. Click on the **"Admin Panel"** link in the navigation bar.
3. Use the dashboard to manage users and products.

---
*Built with ❤️ for Students.*
