# Community Event Management System

A full-stack web application for managing community events, built with Node.js and React. This system allows organizations to create, manage, and track community events, handle registrations, and manage venues and activities.

## Features

- User authentication and authorization
- Event creation and management
- Activity scheduling
- Venue management
- Event registration system
- Image upload support via Cloudinary
- Responsive user interface
- Admin dashboard

## Tech Stack

### Backend

- Node.js with Express
- TypeScript
- Prisma (ORM)
- SQLite Database
- JWT Authentication
- Cloudinary (Media storage)
- Zod (Validation)
- Vitest (Testing)

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui Components
- Zustand (State management)
- React Router
- Axios
- Vitest (Testing)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- Cloudinary account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/inth3wild/community-event-management.git

cd community-event-management
```

### 2. Backend Setup

```bash
cd Solution/backend

# Install dependencies
npm install

# Create .env file
cp .env.sample .env
```

Configure your `.env` file with the following variables:

```
PORT=3000
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_URL=your_cloudinary_url_here
```

To get your `CLOUDINARY_URL`:

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/users/register/free)
2. After logging in, navigate to your Dashboard
3. Look for the "Environment variable" section
4. Copy the `CLOUDINARY_URL` value (it should look like: `cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz12@cloud-name`)

Then:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npm run migrate

# Seed the database (optional)
npm run seed

# Start the development server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.sample .env

# Start the development server
npm run dev
```

## Running Tests

### Backend Tests

```bash
cd Solution/backend
npm test

# With UI
npm run test:ui
```

### Frontend Tests

```bash
cd Solution/frontend
npm test

# With UI
npm run test:ui
```

## Project Structure

```
Solution/
├── backend/                 # Backend application
│   ├── prisma/             # Database schema and migrations
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── middlewares/    # Custom middlewares
│       ├── routes/         # API routes
│       ├── validators/     # Input validation
│       └── config/         # Application configuration
└── frontend/               # Frontend application
    └── src/
        ├── components/     # React components
        ├── pages/          # Page components
        ├── stores/         # Zustand stores
        └── hooks/          # Custom React hooks
```

## API Documentation

The API provides the following main endpoints:

- `/api/auth` - Authentication endpoints
- `/api/admin/events` - Admin management endpoints
- `/api/user/events` - Event management endpoints
- `/api/venues` - Venue management endpoints
- `/api/activities` - Activity management endpoints
- `/api/admin/registrations` - Registration management endpoints