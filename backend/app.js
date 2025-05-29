import express from 'express' // Import the Express framework
import morgan from 'morgan' // Import Morgan for HTTP request logging
import connect from './db/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import cookieParser from 'cookie-parser'; 
import cors from 'cors';
import aiRoutes from './routes/aiRoutes.js'

connect();

const app = express() // Create a new Express application

app.use(cors());
app.use(morgan('dev')) // Use Morgan middleware for logging HTTP requests in development format
app.use(express.json()) // Enable JSON parsing middleware for incoming requests
app.use(express.urlencoded({extended: true})) // Enable URL-encoded data parsing with extended mode
app.use(cookieParser());


app.use('/users', userRoutes);
app.use('/projects', projectRoutes)
app.use('/ai', aiRoutes)


export default app; // Export the configured Express app