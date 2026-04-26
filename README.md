# E-Commerce MERN Project

Full-stack e-commerce application with:
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT + Google OAuth

## Project Structure

```text
.
|-- backend/
|   |-- controller/
|   |-- models/
|   |-- routers/
|   |-- index.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |-- public/
|   `-- package.json
`-- vercel.json
```

## Features

- User registration and login
- Google login
- Password reset with OTP
- Product CRUD (admin-protected for create/update/delete)
- Product search and latest products
- Order placement and order management
- Review submission and admin review deletion
- Contact form and admin contact management

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB connection string (Atlas or local)

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside `backend`:

```env
Mongo_uri=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Frontend (`frontend/.env`)

Create a `.env` file inside `frontend`:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

## Installation

Install dependencies for both apps.

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run Locally

Start backend:

```bash
cd backend
npm start
```

Backend runs on `http://localhost:5000`.

Start frontend (new terminal):

```bash
cd frontend
npm run dev
```

Frontend dev server runs on Vite default port (usually `http://localhost:5173`).

## Available Scripts

### Backend

- `npm start` - Start server with nodemon

### Frontend

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints (Backend)

Base URL: `http://localhost:5000`

### Users (`/api/users`)

- `POST /` - Register user
- `POST /login` - Login user
- `POST /google-login` - Google login
- `GET /user` - Get current user (requires Bearer token)
- `PUT /user` - Update current user (requires Bearer token)
- `POST /send-reset-password-otp` - Send password reset OTP
- `POST /verify-otp` - Verify OTP
- `POST /reset-password` - Reset password

### Products (`/api/products`)

- `POST /` - Create product (admin)
- `GET /` - Get products
- `GET /latest` - Get latest products
- `GET /search/:query` - Search products
- `GET /:productId` - Get product by productId
- `PUT /:productId` - Update product (admin)
- `DELETE /:productId` - Delete product (admin)

### Orders (`/api/orders`)

- `POST /` - Create order (authenticated user)
- `GET /` - Get orders (all for admin, own for customer)
- `PUT /:id` - Update order status/notes (admin)

### Reviews (`/api/reviews`)

- `POST /` - Create review
- `GET /` - Get all reviews
- `DELETE /:id` - Delete review

### Contacts (`/api/contacts`)

- `POST /` - Create contact message
- `GET /` - Get all contact messages (admin)
- `PUT /:id/status` - Update contact status (admin)
- `DELETE /:id` - Delete contact message (admin)

## Authentication Notes

- Backend checks JWT from `Authorization: Bearer <token>`.
- Decoded user payload is attached to `req.user`.
- Admin-only logic depends on user role being `admin`.

## Deployment

- Root and frontend both contain `vercel.json`, so deployment can be configured for Vercel.
- Ensure all required environment variables are set in your hosting platform.

## Important Security Note

The current codebase includes hardcoded credentials/client IDs in backend user auth/email logic. Move all secrets and IDs to environment variables before production use.

## License

ISC (as declared in backend `package.json`).
