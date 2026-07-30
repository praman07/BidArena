# BidArena — Deployment guide (hackathon / production)

## Architecture

- Frontend: Vite React app → **Vercel**
- Backend: Express + Socket.IO → **Render**
- Database: **MongoDB Atlas**
- Images (optional): **Cloudinary**

Socket.IO runs on the same Render HTTP server as the REST API.

---

## 1. MongoDB Atlas

1. Create a cluster and database user.
2. Allow network access from Render (or `0.0.0.0/0` for demos).
3. Copy the connection string into `MONGO_URI`.

---

## 2. Backend (Render)

Root / service directory: `server`

Build command:
```bash
npm install
```

Start command:
```bash
npm start
```

Environment variables:
```
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-frontend.vercel.app
CLIENT_URLS=
MONGO_URI=mongodb+srv://...
JWT_SECRET=<long-random>
JWT_EXPIRES_IN=7d
COOKIE_SECRET=<long-random>
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://your-api.onrender.com/api/auth/google/callback
```

Notes:
- `CLIENT_URL` must match the Vercel origin exactly (scheme + host, no trailing slash).
- Auth cookies use `SameSite=None; Secure` in production so the browser sends them cross-site.
- Health check: `GET /api/health`

---

## 3. Frontend (Vercel)

Root directory: `client`

Build command:
```bash
npm install && npm run build
```

Output directory: `dist`

Environment variables:
```
VITE_API_BASE_URL=https://your-api.onrender.com/api
VITE_SOCKET_URL=https://your-api.onrender.com
```

---

## 4. Local demo checklist

1. Copy `server/.env.example` → `server/.env` and fill secrets.
2. Copy `client/.env.example` → `client/.env`.
3. Start API: `cd server && npm run dev`
4. Start client: `cd client && npm run dev`
5. Flow: Register/Login → Create Auction → Browse → Details → Join Live → Place Bid.

---

## 5. QA checklist

- [ ] Login / Register / Logout
- [ ] Session persists after refresh
- [ ] Expired JWT redirects to Login with toast
- [ ] Create Auction (images + Mongo save)
- [ ] Browse Auctions
- [ ] Auction Details
- [ ] My Auctions (edit / delete)
- [ ] Place Bid + live updates for other clients
- [ ] Winner modal when auction ends
- [ ] Mobile layout
- [ ] Network / invalid id error states
