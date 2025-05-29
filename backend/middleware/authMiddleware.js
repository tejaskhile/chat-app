import jwt from "jsonwebtoken";
import redisClient from "../services/redis.js";

export const authUser = async (req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(" ")[1]; // Get token from cookies or headers

        if (!token) {
            return res.status(401).json({ error: "Not authorized" }); // Return 401 if no token
        }

        const isBlacklisted = await redisClient.get(token); // Check if token is blacklisted
        
        if(isBlacklisted){
            res.cookie("token", "", {maxAge: 1}); 
            return res.status(401).json({error: "Not authorized"}); // Return 401 if token is blacklisted
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Set user in request
        next(); // Call next middleware
       
    }catch(err){
        return res.status(400).json({error: err.message}); // Return error if token is missing
    }
  
};