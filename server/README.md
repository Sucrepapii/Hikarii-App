# Checkmate Backend API

Backend server for the Checkmate task and budget management application.

## Features

- ✅ User authentication with JWT
- ✅ Task management with financial tracking
- ✅ Budget and expense management
- ✅ Smart insights and recommendations
- ✅ MongoDB database
- ✅ RESTful API

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Default URI: `mongodb://localhost:27017/checkmate`

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update values as needed

4. **Start development server:**

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task status

### Budgets & Expenses

- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create/update budget
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Intelligence

- `GET /api/insights` - Get smart insights
- `GET /api/insights/recommendations` - Get task recommendations

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/checkmate
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5174
```

## Scripts

-`npm run dev` - Start development server with auto-reload

- `npm run build` - Build for production
- `npm start` - Start production server

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
