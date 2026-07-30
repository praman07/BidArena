# 🏟️ BidArena

> A high-performance, real-time auction engine and platform built with the MERN stack.

BidArena is a robust, production-ready live auction platform. It features an authoritative server-side auction engine, guaranteeing atomic bid processing, real-time state synchronization via WebSocket (Socket.IO), and seamless crash recovery with MongoDB. 

The architecture is explicitly split into two domains to ensure scalability and maintainability:
- **Domain A**: REST API (Authentication, User Management, Static Data)
- **Domain B**: Auction Engine & Real-Time System (Socket.IO, Timers, Bid Queues)

## 🚀 Key Features

- **Real-Time Auction Engine**: Low-latency, authoritative server-state powered by Socket.IO.
- **Atomic Bid Processing**: Sequential Promise queues prevent race conditions and guarantee accurate bid ordering even during extreme concurrent loads.
- **State Hydration & Recovery**: Bids and timers survive server crashes; the engine automatically rehydrates the in-memory state from MongoDB on startup.
- **Graceful Shutdown**: Managed lifecycle hooks ensure that socket connections, database pools, and intervals are safely closed on SIGINT/SIGTERM.
- **Modern Frontend Interface**: Built with Vite, React 19, Tailwind CSS v4, and Framer Motion for a fluid, dynamic UI.
- **Isolated Room Broadcasting**: Efficient pub/sub architecture using Socket.IO rooms ensures users only receive data for their active auction.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4, clsx, tailwind-merge
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit
- **Forms & Validation**: React Hook Form, Zod
- **Networking**: Axios, Socket.IO Client

### Backend (Server)
- **Environment**: Node.js, Express 5.x
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.IO
- **Security**: Passport.js (Google OAuth2.0), JWT, bcryptjs, Helmet, CORS
- **Payments & Media**: Razorpay, Cloudinary

---

## 🏗️ Architecture Overview

The backend is built around a centralized **Auction Engine**, which operates as a state machine. 

### Data Flow
1. **Client Event**: User emits a `bid:place` event via WebSocket.
2. **Atomic Queue**: The request hits the `AuctionEngine` and joins an isolated, sequential Promise queue for that specific `auctionId`.
3. **Validation**: The bid is validated against the in-memory authoritative state (e.g., minimum increments, auction active status).
4. **Persistence**: If valid, the bid is immediately persisted to MongoDB (`Bid`, `Timeline`, and `Auction` models) via fire-and-forget async operations.
5. **Broadcast**: The `BroadcastManager` instantly pushes the updated state and statistics back to the isolated Socket.IO room.

---

## 💻 Getting Started

Follow these steps to run BidArena locally.

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/praman07/BidArena.git
cd BidArena
```

### 2. Environment Configuration
You will need to set up `.env` files for both the client and server.

**Server (`server/.env`)**
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bidarena
JWT_SECRET=your_jwt_secret
# Add your Cloudinary, Razorpay, and Google OAuth credentials here
```

**Client (`client/.env`)**
Create a `.env` file in the `/client` directory based on the `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Install Dependencies
Install dependencies for both frontend and backend concurrently:
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 4. Run the Application
You can run both environments in development mode:

**Start Backend Server:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Start Frontend Application:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173 (or as specified by Vite)
```

---

## 🧪 Development Guidelines

- **Domain Isolation**: When developing features for Domain B (Auction Engine), ensure that the HTTP server and Socket.IO layers remain decoupled. Use the `BroadcastManager` to dispatch events rather than importing `io` directly.
- **Git Flow**: The default working branch is `dev`. Feature branches (e.g., `feature/architecture-refactor`) should be merged strictly via Pull Requests to avoid direct conflicts.
- **Code Formatting**: The project utilizes standard `oxlint` on the frontend for lightning-fast linting. 

## 🛡️ License

This project is licensed under the MIT License.
