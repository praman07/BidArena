# BidArena

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socketdotio&logoColor=white)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-072654?style=flat-square&logo=razorpay&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

<!-- TODO: Replace with a 1–2 sentence project summary describing what BidArena is and who it is for. -->

**BidArena** is a MERN-stack online auction platform.  
_Short description placeholder — update this paragraph with the official project pitch._

---

## Features

> **Note:** Feature checklist below is a placeholder. Replace each item with verified product capabilities once the submission list is finalized. Do not mark items complete until they are implemented and demo-ready.

- [ ] <!-- TODO: Feature 1 — e.g. authentication / auctions / live bidding -->
- [ ] <!-- TODO: Feature 2 -->
- [ ] <!-- TODO: Feature 3 -->
- [ ] <!-- TODO: Feature 4 -->
- [ ] <!-- TODO: Feature 5 -->

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Socket.io Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT Authentication

### Payments

- Razorpay

<!-- TODO: Add any additional libraries (e.g. Cloudinary, Passport) only if used in the final submission build. -->

---

## Project Structure

<!-- TODO: Adjust folder names if the monorepo layout changes. This repo currently uses `client/` and `server/`. -->

```text
BidArena/
├── client/                 # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/         # Logos, images, static assets
│   │   ├── components/     # Shared UI components
│   │   ├── features/       # Feature modules (auth, auction, dashboard, …)
│   │   ├── hooks/
│   │   ├── routes/
│   │   └── services/       # API / Axios clients
│   ├── .env.example
│   └── package.json
├── server/                 # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── socket/         # Realtime / Socket.io
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Installation

### Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB instance (local or hosted)

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

<!-- TODO: Confirm exact scripts (`dev` / `start`) and default ports after finalizing package.json scripts. -->

---

## Environment Variables

Copy example env files and fill in values. Do not commit real secrets.

### Backend (`server/.env`)

| Variable | Description | Placeholder |
|----------|-------------|-------------|
| `PORT` | API server port | `5000` |
| `NODE_ENV` | Runtime environment | `development` |
| `CLIENT_URL` | Frontend origin (CORS / redirects) | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string | `mongodb://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `COOKIE_SECRET` | Cookie signing secret | `your-cookie-secret` |
| `RAZORPAY_KEY_ID` | Razorpay key id | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | `your-razorpay-secret` |

<!-- TODO: Document optional vars used by this project (e.g. CLIENT_URLS, Google OAuth, Cloudinary) when enabling those integrations for demo. -->

### Frontend (`client/.env`)

| Variable | Description | Placeholder |
|----------|-------------|-------------|
| `VITE_API_BASE_URL` | REST API base URL (include `/api`) | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.io server origin | `http://localhost:5000` |

---

## Screenshots

> Place images under `client/src/assets/` or a `docs/screenshots/` folder, then replace the placeholders below.

| Screen | Preview |
|--------|---------|
| Landing Page | <!-- TODO: ![Landing Page](path/to/landing.png) --> _Screenshot pending_ |
| Dashboard | <!-- TODO: ![Dashboard](path/to/dashboard.png) --> _Screenshot pending_ |
| Auction Room | <!-- TODO: ![Auction Room](path/to/auction-room.png) --> _Screenshot pending_ |
| Payment | <!-- TODO: ![Payment](path/to/payment.png) --> _Screenshot pending_ |
| Profile | <!-- TODO: ![Profile](path/to/profile.png) --> _Screenshot pending_ |

---

## Demo

| Resource | Link |
|----------|------|
| Live Demo | <!-- TODO: Add deployed URL --> _Coming soon_ |
| Demo Video | <!-- TODO: Add walkthrough / Loom / YouTube link --> _Coming soon_ |

---

## Future Improvements

<!-- TODO: Replace with real roadmap items after the hackathon demo. -->

- <!-- TODO: Improvement 1 -->
- <!-- TODO: Improvement 2 -->
- <!-- TODO: Improvement 3 -->

---

## Contributors

| Name | Role |
|------|------|
| <!-- TODO: Your Name --> | Full Stack Developer |
| <!-- TODO: Teammate Name --> | <!-- TODO: Role --> |

---

## License

This project is licensed under the [MIT License](LICENSE).

<!-- TODO: Add a LICENSE file at the repo root if one is not already present. -->
