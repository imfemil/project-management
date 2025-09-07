# Development Guide

## Project Structure

```
src/
├── app.js                 # Express app setup
├── index.js              # Server entry point
├── controllers/          # Route controllers
│   ├── auth.controllers.js
│   ├── healthcheck.controllers.js
│   ├── note.controllers.js
│   ├── project.controllers.js
│   └── task.controllers.js
├── db/                   # Database configuration
│   └── index.js
├── middlewares/          # Custom middleware
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── validator.middleware.js
├── models/              # MongoDB models
│   ├── note.models.js
│   ├── project.models.js
│   ├── projectmember.models.js
│   ├── subtask.models.js
│   ├── task.models.js
│   └── user.models.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── healthcheck.routes.js
│   ├── note.routes.js
│   ├── project.routes.js
│   └── task.routes.js
├── utils/              # Utility functions
│   ├── api-error.js
│   ├── api-response.js
│   ├── async-handler.js
│   ├── constants.js
│   └── mail.js
└── validators/         # Input validation
    └── index.js
```

## Development Setup

### Prerequisites

1. Node.js (v21.x or higher)
2. MongoDB
3. Git
4. npm or yarn
5. Mailtrap account for email testing

### First Time Setup

1. Clone the repository
```bash
git clone <repository-url>
cd project-management
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
```bash
cp .env.example .env
```

4. Configure environment variables in .env
```bash
# Server Configuration
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
PORT=5000

# URLs
SERVER_URL=http://localhost:5000
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/reset-password

# MongoDB
MONGO_URI=your_mongodb_uri

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

# Email Configuration
SMTP_FROM_EMAIL=your_email@domain.com
MAILTRAP_SMTP_HOST=smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password
```

5. Start development server
```bash
npm run dev
```

### Development Workflow

1. Create a new branch for your feature
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them
```bash
git add .
git commit -m "feat: your feature description"
```

3. Push your changes
```bash
git push origin feature/your-feature-name
```

## Code Style Guide

### General Guidelines

1. Use ES6+ features
2. Follow airbnb-base style guide
3. Use async/await for asynchronous operations
4. Implement proper error handling
5. Write meaningful comments

### Naming Conventions

1. Files and Folders
   - Use kebab-case for file names
   - Use lowercase for folder names
   - Add appropriate extensions (.js, .json, etc.)

2. Variables and Functions
   - Use camelCase for variables and functions
   - Use PascalCase for classes
   - Use UPPER_CASE for constants

3. Database Models
   - Use PascalCase for model names
   - Use singular form (User, not Users)

### Code Organization

1. Controllers
   - Keep business logic in controllers
   - Use async/await with try-catch
   - Return standardized responses

2. Models
   - Define schemas clearly
   - Add proper validations
   - Include appropriate indexes

3. Routes
   - Group related routes
   - Use proper middleware
   - Implement input validation

4. Middleware
   - Keep middleware focused
   - Use next() appropriately
   - Handle errors properly

## Testing

### Unit Tests

1. Test individual components
2. Mock external dependencies
3. Focus on edge cases

### Integration Tests

1. Test API endpoints
2. Test database operations
3. Test authentication flows

### Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test-file.js

# Run tests with coverage
npm run test:coverage
```

## Error Handling

1. Use the ApiError class for all errors
2. Include appropriate HTTP status codes
3. Provide meaningful error messages
4. Log errors appropriately

Example:
```javascript
try {
  // Your code
} catch (error) {
  throw new ApiError(statusCode, "Error message", error);
}
```

## API Response Format

Use the ApiResponse class for all responses:

```javascript
{
  success: boolean,
  data: object | array | null,
  message: string,
  errors: array
}
```

## Database Guidelines

1. Use proper indexes
2. Implement data validation
3. Handle MongoDB operations safely
4. Use transactions when needed

## Security Best Practices

1. Input Validation
   - Validate all user inputs
   - Sanitize data appropriately
   - Use parameter binding

2. Authentication
   - Implement proper JWT handling
   - Secure password storage
   - Handle token refresh securely

3. Authorization
   - Implement role-based access
   - Check permissions properly
   - Validate resource ownership

4. Data Protection
   - Use HTTPS
   - Implement rate limiting
   - Enable CORS properly

## Deployment

1. Prepare for Production
   - Set NODE_ENV=production
   - Update environment variables
   - Build assets if needed

2. Database
   - Set up production database
   - Configure proper indexes
   - Set up backups

3. Server
   - Configure PM2 or similar
   - Set up monitoring
   - Configure logging

4. SSL/TLS
   - Install SSL certificate
   - Configure HTTPS
   - Redirect HTTP to HTTPS

## Monitoring and Logging

1. Application Monitoring
   - Use PM2 for process management
   - Monitor server resources
   - Track API performance

2. Error Logging
   - Log errors properly
   - Include stack traces
   - Add context information

3. Security Monitoring
   - Monitor failed login attempts
   - Track API usage
   - Monitor for suspicious activity

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Commit Message Format

Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

## License

This project is licensed under the MIT License.
