# API Documentation

## Base URL
`http://localhost:5000/api/v1`

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "isEmailVerified": false
    },
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "User registered successfully"
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "isEmailVerified": boolean
    },
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "Logged in successfully"
}
```

### Verify Email
```http
POST /auth/verify-email
```

**Request Body:**
```json
{
  "verificationToken": "string"
}
```

### Request Password Reset
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "string"
}
```

## Project Endpoints

### Create Project
```http
POST /projects
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

### Get All Projects
```http
GET /projects
```

**Headers:**
```
Authorization: Bearer <access_token>
```

### Get Project by ID
```http
GET /projects/:projectId
```

### Update Project
```http
PATCH /projects/:projectId
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

### Delete Project
```http
DELETE /projects/:projectId
```

## Task Endpoints

### Create Task
```http
POST /tasks
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "projectId": "string",
  "dueDate": "date",
  "priority": "string",
  "assignedTo": "string"
}
```

### Get Project Tasks
```http
GET /tasks/project/:projectId
```

### Update Task
```http
PATCH /tasks/:taskId
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "dueDate": "date",
  "assignedTo": "string"
}
```

### Delete Task
```http
DELETE /tasks/:taskId
```

## Note Endpoints

### Create Note
```http
POST /notes
```

**Request Body:**
```json
{
  "content": "string",
  "taskId": "string"
}
```

### Get Task Notes
```http
GET /notes/task/:taskId
```

### Update Note
```http
PATCH /notes/:noteId
```

**Request Body:**
```json
{
  "content": "string"
}
```

### Delete Note
```http
DELETE /notes/:noteId
```

## Common Headers

All requests should include:
```http
Content-Type: application/json
```

Protected routes require:
```http
Authorization: Bearer <access_token>
```

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized access",
  "errors": []
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found",
  "errors": []
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "errors": []
}
```
