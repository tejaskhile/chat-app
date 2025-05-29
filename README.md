# Real-Time Collaborative Chat Application

A real-time collaborative chat application built with React, Node.js, Express, MongoDB, and Socket.IO.

## Features

- 👥 User Authentication (Register/Login)
- 💬 Real-time Chat
- 🤝 Project Collaboration
- 👥 Add Team Members
- 🤖 AI Assistant Integration (@ai commands)
- 📝 Code Editor with Syntax Highlighting

## Tech Stack

- **Frontend**: React, Socket.IO-client
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Cache**: Redis
- **AI Integration**: Google Generative AI

## API Endpoints

### Authentication Routes
```http
POST /users/register
{
    "email": "user@example.com",
    "password": "password123"
}

POST /users/login
{
    "email": "user@example.com",
    "password": "password123"
}

GET /users/profile
Authorization: Bearer <token>

GET /users/logout
Authorization: Bearer <token>

GET /users/all
Authorization: Bearer <token>
```

### Project Routes
```http
POST /projects/create
Authorization: Bearer <token>
{
    "name": "Project Name"
}

GET /projects/all
Authorization: Bearer <token>

PUT /projects/add-user
Authorization: Bearer <token>
{
    "projectId": "project_id",
    "users": ["user_id1", "user_id2"]
}

GET /projects/get-project/:projectId
Authorization: Bearer <token>
```

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
GOOGLE_API_KEY=your_google_ai_api_key
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/chat-app.git
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
- Create `.env` file in both frontend and backend directories
- Add the required environment variables

4. Start the application
```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd frontend
npm start
```

## WebSocket Events

```javascript
// Connect to project chat
socket.emit('connection', { projectId, token })

// Send message in project chat
socket.emit('project-message', { 
    message, 
    sender, 
    projectId 
})

// Receive message in project chat
socket.on('project-message', (data) => {
    // Handle incoming message
})
```

## AI Assistant Commands

Use `@ai` in chat followed by your prompt to interact with the AI assistant:

```
@ai create an express server
@ai generate react component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
