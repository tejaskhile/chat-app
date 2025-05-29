import 'dotenv/config.js' 
import http from 'http'; 
import jwt from 'jsonwebtoken'
import app from './app.js'; 
import {Server} from 'socket.io'
import mongoose from 'mongoose';
import projectModel from './models/projectModel.js';
import cors from 'cors'
import {generateResult} from './services/aiService.js'

const PORT = process.env.PORT || 3000 
const server = http.createServer(app); 

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ["Authorization"],
  exposedHeaders: [
    'Cross-Origin-Embedder-Policy',
    'Cross-Origin-Opener-Policy',
    'Cross-Origin-Resource-Policy'
  ]
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

const io =  new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ["Authorization"]
  }
});


io.use(async (socket, next)=>{
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
    const projectId = socket.handshake.query.projectId;
        
    if(!token){
      return next(new Error('Authentication Error'))
    }  
    if (!projectId ) {
      return next(new Error('Missing projectId'));
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error('Invalid projectId'));
    }
     
    
    socket.project = await projectModel.findById(projectId)
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
      return next(new Error('Authentication Error'))
    }  
    
    socket.user = decoded;
    
    next();
    
  } catch (error) {
    next(error)
  }  
})  

io.on('connection', async (socket) => {
  
  socket.roomId = socket.project._id.toString(),
  
  console.log('a user connected')

  socket.join(socket.roomId)

  socket.on('project-message', async (data) => {

    const message = data.message;
    const includesAi = message.includes('@ai')
    
    socket.broadcast.to(socket.roomId).emit('project-message', data)


    if(includesAi){
     const prompt = message.replace('@ai', '');
     const result = await generateResult(prompt);
     console.log(result)

     io.to(socket.roomId).emit('project-message', {
      sender: 'AI',
      message: result
     })
    }
  })  

  socket.on('event', data => { /* … */ })
  socket.on('disconnect', () => {
    console.log('User disconnected')
    socket.leave(socket.roomId)
  })
});


server.listen(PORT, ()=>{ // Start the server on the specified port
    console.log(`Server is running on port ${process.env.PORT}`); // Log a message when the server starts successfully
});