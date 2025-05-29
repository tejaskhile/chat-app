import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({  // Define the user schema structure
    email:{
        type: String,
        unique: true,  
        required: true,  
        lowercase: true,  
        minLength: 5,  
        trim: true  // Remove whitespace from ends
    },
    password:{
        type: String,  
        required: true,  
        minLength: 5,
        select: false
    }
})

userSchema.statics.hashPassword = function(password){  // Static method to hash passwords
    return bcrypt.hash(password, 10)  // Return promise of hashed password with salt rounds of 10
}

userSchema.methods.isValidPassword = function(password){  // Method to verify password
    return bcrypt.compare(password, this.password)  // Compare plain password with hashed password
}

userSchema.methods.generateJWT = function(){  // Method to generate JWT token
    return jwt.sign({email: this.email}, process.env.JWT_SECRET,{
        expiresIn: '1d'  // Token expires in 1 day
    })  // Create token with user email
}

const User = mongoose.model('user', userSchema);  // Create the User model from schema

export default User;  // Export the User model
