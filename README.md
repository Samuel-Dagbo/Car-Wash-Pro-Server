# Car Wash Backend

A Node.js and Express REST API for managing a car wash platform. It supports admin and customer authentication, service management, bookings, and dashboard stats.

## Features

- Admin and customer registration/login/logout
- JWT-based authentication and role-based authorization
- Service listing, creation, update, activation, and deactivation
- Booking creation and management
- Client image upload for bookings
- Admin dashboard endpoints for stats and recent bookings
- MongoDB persistence with automatic seeding for starter services and a default admin user
- Rate limiting and centralized error handling
- Health check endpoint for deployment monitoring
- Optional self-ping support for hosted environments

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Token
- bcrypt / bcryptjs
- cors
- express-rate-limit
- dotenv
- multer
- sharp

## Project Structure

```text
src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
```

## Prerequisites

- Node.js 18 or newer
- MongoDB database

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the required variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
SELF_PING_ENABLED=false
PUBLIC_BASE_URL=https://your-deployed-domain.com
```

3. Start the server:

```bash
npm run dev
```

For production:

```bash
npm start
```

## Available Scripts

- `npm start` - starts the server with Node.js
- `npm run dev` - starts the server with Nodemon
- `npm test` - placeholder script

## API Base Path

All routes are served under `/api`.

## Health Check

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "uptime": 123.45
}
```

## Main Routes

### Authentication

- `POST /api/auth/admin/register`
- `POST /api/auth/admin/login`
- `GET /api/auth/admin/me`
- `POST /api/auth/admin/logout`
- `POST /api/auth/customer/register`
- `POST /api/auth/customer/login`
- `GET /api/auth/customer/me`
- `POST /api/auth/customer/logout`

### Services

- `GET /api/services`
- `GET /api/services/:id`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`
- `PATCH /api/services/:id/deactivate`
- `PATCH /api/services/:id/activate`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `PUT /api/bookings/:id/status`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`

#### Booking image upload

Clients can upload an optional image when creating or updating a booking.

- Use `multipart/form-data` for `POST /api/bookings` and `PUT /api/bookings/:id`
- Send the file in field name `image`
- Uploaded image path is stored in `vehicleImageUrl`
- Images are served from `/uploads/bookings/...`
- To remove an existing image on update, send `clearVehicleImage=true`

### Dashboard

- `GET /api/dashboard/stats`
- `GET /api/dashboard/recent-bookings`

## Authentication Notes

Protected routes require a Bearer token in the Authorization header:

```http
Authorization: Bearer <token>
```

## Seed Data

When the application starts, it will automatically:

- create starter services if none exist
- create a default admin user if no admin exists

Default admin credentials:

- Email: `admin@carwash.com`
- Password: `admin123`

Change these after first login.

## Deployment Notes

If deployed on a platform that sleeps when idle, enable self-ping with:

```env
SELF_PING_ENABLED=true
```

The server will try to ping the public health endpoint using `PUBLIC_BASE_URL`, `RENDER_EXTERNAL_URL`, or `RENDER_EXTERNAL_HOSTNAME`.

## License

ISC
