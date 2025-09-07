# Project Management System Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Project Setup](#project-setup)
4. [API Documentation](#api-documentation)
5. [Database Models](#database-models)
6. [Authentication & Authorization](#authentication--authorization)
7. [Email Service](#email-service)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Utilities](#utilities)

## Overview

A robust project management system built with Node.js and Express, featuring user authentication, project collaboration, task management, and real-time updates.

### Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer with Mailtrap
- **File Upload**: Multer
- **Validation**: Custom middleware

## System Architecture

The application follows a modular MVC (Model-View-Controller) architecture:

```
src/
├── controllers/     # Business logic
├── models/         # Database schemas
├── routes/         # API routes
├── middlewares/    # Custom middlewares
├── utils/          # Helper functions
├── validators/     # Input validation
└── db/            # Database configuration
```

## Project Setup

### Prerequisites
- Node.js (v21.x or higher)
- MongoDB
- npm or yarn

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
PORT=5000
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/reset-password
SERVER_URL=http://localhost:5000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
SMTP_FROM_EMAIL=your_email@domain.com
MAILTRAP_SMTP_HOST=smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password
```

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

## API Documentation

### Authentication Endpoints

#### POST /api/v1/auth/register
Register a new user
- Body: `{ email, username, password }`
- Returns: User object with JWT tokens

#### POST /api/v1/auth/login
Login existing user
- Body: `{ email, password }`
- Returns: User object with JWT tokens

### Project Endpoints

#### POST /api/v1/projects
Create new project
- Auth: Required
- Body: `{ name, description }`
- Returns: Project object

#### GET /api/v1/projects
Get all user's projects
- Auth: Required
- Returns: Array of projects

### Task Endpoints

#### POST /api/v1/tasks
Create new task
- Auth: Required
- Body: `{ title, description, projectId, dueDate }`
- Returns: Task object

#### GET /api/v1/tasks/:projectId
Get project tasks
- Auth: Required
- Returns: Array of tasks

## Database Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String,
  refreshToken: String,
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  isEmailVerified: Boolean
}
```

### Project Model
```javascript
{
  name: String,
  description: String,
  owner: ObjectId,
  members: [ObjectId],
  tasks: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId,
  assignedTo: ObjectId,
  status: String,
  priority: String,
  dueDate: Date,
  subtasks: [ObjectId]
}
```

## Authentication & Authorization

The system uses JWT-based authentication with refresh tokens:
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Email verification required for new accounts
- Password reset functionality available

## Email Service

Email notifications are handled by Nodemailer with Mailtrap integration:
- Email verification
- Password reset
- Project invitations
- Task assignments

## Middleware

### Authentication Middleware
- Verifies JWT tokens
- Handles token refresh
- Manages user sessions

### Validation Middleware
- Input validation
- Request sanitization
- Error formatting

### Multer Middleware
- Handles file uploads
- Validates file types
- Manages storage

## Error Handling

Custom error handling using ApiError class:
- Standardized error responses
- HTTP status codes
- Error logging
- Development vs Production error details

## Utilities

### API Response
Standardized API response format:
```javascript
{
  success: Boolean,
  data: Object|Array|null,
  message: String,
  errors: Array
}
```

### Async Handler
Wrapper for async route handlers with unified error handling.

### Mail Service
Email service utility with development and production modes.

## Security Features

1. Password Hashing
2. JWT Token Management
3. Rate Limiting
4. CORS Protection
5. Input Validation
6. XSS Prevention

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License
